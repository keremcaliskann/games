import * as THREE from 'three';
import { PlatformBridge, CloudSaveData } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { GameLoop } from './core/game-loop';
import { EventBus } from './core/events';
import { SoundController } from './core/audio';
import { LightingSetup } from './render/lighting';
import { CameraRig } from './render/camera-rig';
import { ParticleEffects } from './render/effects';
import { PrefabFactory } from './render/PrefabFactory';
import { FactoryManager } from './game/systems/factory-manager';
import { InputManager } from './input/input-manager';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';

class ConveyorMarbleApp {
  private readonly appEl: HTMLElement;
  private readonly hudEl: HTMLElement;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly cameraRig: CameraRig;
  private readonly particles: ParticleEffects;
  private readonly sound: SoundController;
  private readonly loop: GameLoop;
  private readonly ads: UniversalAdProvider;
  private readonly events: EventBus;
  private readonly hud: Hud;
  private readonly shell: ShellController;

  private readonly factoryManager: FactoryManager;
  private readonly input: InputManager;

  private isFirstFrame = true;
  private hasGameReadyFired = false;
  private currentLevel = 1;
  private saveData: CloudSaveData = { coins: 100, highestLevel: 1, stars: 0 };

  constructor() {
    this.appEl = document.getElementById('app')!;
    this.hudEl = document.getElementById('hud')!;

    // 1. Dual-Mode Shell setup
    PlatformBridge.applyDualModeShell();

    // 2. Three.js Scene & Renderer
    this.scene = new THREE.Scene();
    const width = this.appEl.clientWidth || window.innerWidth;
    const height = this.appEl.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      stencil: false,
      depth: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.appEl.appendChild(this.renderer.domElement);

    this.cameraRig = new CameraRig(width / height);
    new LightingSetup(this.scene);
    this.particles = new ParticleEffects(this.scene);
    this.sound = new SoundController();
    this.events = new EventBus();
    this.ads = UniversalAdProvider.get();

    // 3. Build Floating Factory Circuit
    const stage = PrefabFactory.createFactoryStage();
    this.scene.add(stage);

    const loopPath = PrefabFactory.createConveyorLoop(5.6, 3.2);
    this.scene.add(loopPath.root);

    this.factoryManager = new FactoryManager(
      this.scene,
      loopPath,
      this.particles,
      this.sound,
      this.events
    );

    this.input = new InputManager(this.renderer.domElement, this.cameraRig, this.factoryManager);

    // 4. UI & Shell setup
    this.hud = new Hud(this.hudEl, {
      onToggleSound: () => {
        const isMuted = this.sound.toggleMute();
        this.hud.updateSound(isMuted);
      },
      onRestart: () => this.restartLevel(),
      onBoosterBelt: () => this.triggerBoosterBelt(),
      onBoosterMagnet: () => this.triggerBoosterMagnet(),
      onBoosterUndo: () => this.triggerBoosterUndo(),
      onRevive: () => this.triggerRevive(),
      onGiveUp: () => this.restartLevel(),
      onClaimMultiplied: (mul) => this.claimMultipliedVictory(mul),
      onNextLevel: () => this.advanceNextLevel(1.0),
    });

    this.shell = new ShellController({
      currentGameId: 'conveyor-marble-sort-3d',
      onRestart: () => this.restartLevel(),
      onResize: (w, h) => {
        this.renderer.setSize(w, h);
        this.cameraRig.onResize(w / h);
      },
    });

    this.setupEventWiring();
    this.initPlatformLifecycle();

    // 5. Start Game Loop
    this.loop = new GameLoop((dt) => this.tick(dt));
    this.loop.start();

    // 6. Start Level 1
    void this.loadAndStart();
  }

  private async loadAndStart(): Promise<void> {
    await this.ads.initialize();
    this.saveData = await PlatformBridge.loadData(this.saveData);
    this.currentLevel = this.saveData.highestLevel || 1;
    this.factoryManager.coins = this.saveData.coins || 100;
    this.factoryManager.startLevel(this.currentLevel);
  }

  private setupEventWiring(): void {
    this.events.on('state:updated', (data: any) => {
      if (data.level !== undefined) this.hud.updateLevel(data.level);
      if (data.coins !== undefined) this.hud.updateCoins(data.coins);
      if (data.score !== undefined) this.hud.updateScore(data.score);
      if (data.conveyorOccupied !== undefined && data.conveyorMax !== undefined) {
        this.hud.updateBeltCapacity(data.conveyorOccupied, data.conveyorMax);
      }
    });

    this.events.on('game:jammed', () => {
      this.hud.showReviveModal();
    });

    this.events.on('game:victory', (data: any) => {
      const earned = Math.max(50, data.score || 50);
      PlatformBridge.sendScore(this.factoryManager.score);
      this.hud.showVictoryModal(earned);
    });
  }

  private initPlatformLifecycle(): void {
    PlatformBridge.initLifecycle({
      onPause: () => this.loop.stop(),
      onResume: () => this.loop.start(),
      onAudioEnabledChange: (enabled) => {
        this.hud.updateSound(!enabled);
      },
    });

    window.addEventListener(
      'pointerdown',
      () => {
        if (!this.hasGameReadyFired) {
          this.hasGameReadyFired = true;
          PlatformBridge.gameReady();
          this.hud.hideTapHint();
        }
      },
      { once: true }
    );
  }

  private tick(dt: number): void {
    if (this.isFirstFrame) {
      this.isFirstFrame = false;
      PlatformBridge.firstFrameReady();
    }

    this.cameraRig.update(dt);
    this.particles.update(dt);
    this.factoryManager.update(dt);

    this.renderer.render(this.scene, this.cameraRig.camera);
  }

  private restartLevel(): void {
    this.hud.closeModals();
    this.factoryManager.startLevel(this.currentLevel);
  }

  // --- REWARDED AD BOOSTERS ---

  private async triggerBoosterBelt(): Promise<void> {
    const success = await this.ads.showRewarded('booster_belt');
    if (success) {
      this.factoryManager.applyBeltExpansion();
    }
  }

  private async triggerBoosterMagnet(): Promise<void> {
    const success = await this.ads.showRewarded('booster_magnet');
    if (success) {
      this.factoryManager.applyMagnet();
    }
  }

  private async triggerBoosterUndo(): Promise<void> {
    const success = await this.ads.showRewarded('booster_undo');
    if (success) {
      this.factoryManager.applyUndoJam();
    }
  }

  private async triggerRevive(): Promise<void> {
    const success = await this.ads.showRewarded('revive');
    if (success) {
      this.factoryManager.applyRevive();
    } else {
      this.restartLevel();
    }
  }

  private async claimMultipliedVictory(multiplier: number): Promise<void> {
    const success = await this.ads.showRewarded('victory_multiplier');
    const factor = success ? multiplier : 1.0;
    this.advanceNextLevel(factor);
  }

  private advanceNextLevel(rewardMultiplier: number): void {
    const bonusCoins = Math.round(50 * rewardMultiplier);
    this.factoryManager.coins += bonusCoins;
    this.currentLevel++;
    this.saveData.highestLevel = Math.max(this.saveData.highestLevel, this.currentLevel);
    this.saveData.coins = this.factoryManager.coins;
    void PlatformBridge.saveData(this.saveData);

    void this.ads.showInterstitial('level_transition');
    this.factoryManager.startLevel(this.currentLevel);
  }

  public destroy(): void {
    this.loop.stop();
    this.input.destroy();
    this.shell.dispose();
    this.renderer.dispose();
  }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  new ConveyorMarbleApp();
});
