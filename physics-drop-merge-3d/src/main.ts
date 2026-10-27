import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { PlatformBridge } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { GameClock } from './core/clock';
import { GameLoop } from './core/game-loop';
import { SoundController } from './core/audio';
import { PhysicsWorld } from './physics/physics-world';
import { LightingSetup } from './render/lighting';
import { CameraRig } from './render/camera-rig';
import { ParticleEffects } from './render/effects';
import { ContainerEntity } from './game/entities/container';
import { DropperEntity } from './game/entities/dropper';
import { MergeSystem } from './game/systems/merge-system';
import { EconomySystem } from './game/systems/economy';
import { InputManager } from './input/input-manager';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { GAME_CONFIG } from './game/config/game-config';

enum GameState {
  PLAYING,
  GAME_OVER,
  REVIVE_PROMPT,
}

class DropMergeApp {
  private readonly appEl: HTMLElement;
  private readonly hudEl: HTMLElement;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly cameraRig: CameraRig;
  private readonly particles: ParticleEffects;
  private readonly sound: SoundController;
  private readonly loop: GameLoop;
  private readonly ads: UniversalAdProvider;
  private readonly economy: EconomySystem;
  private readonly hud: Hud;
  private readonly shell: ShellController;
  private readonly clock: GameClock;

  // Physics & World Entities
  private physics!: PhysicsWorld;
  private containerEntity!: ContainerEntity;
  private dropper!: DropperEntity;
  private mergeSystem!: MergeSystem;
  private input!: InputManager;

  // Game & Score State
  private state: GameState = GameState.PLAYING;
  private currentScore = 0;
  private nextTier = 1;
  private isNextBomb = false;
  private isNextRainbow = false;
  private dangerTimer = 0;
  private isFirstFrame = true;
  private dropCooldown = 0;

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
    this.ads = UniversalAdProvider.get();
    this.economy = new EconomySystem();
    this.clock = new GameClock();

    // 3. UI
    this.hud = new Hud(this.hudEl, {
      onToggleSound: () => {
        const isMuted = this.sound.toggleMute();
        this.hud.updateSound(isMuted);
      },
      onRestart: () => this.restartGame(),
      onBoosterShake: () => this.activateBoosterShake(),
      onBoosterBomb: () => this.activateBoosterBomb(),
      onBoosterEvolve: () => this.activateBoosterEvolve(),
      onRevive: () => this.handleReviveReward(),
      onGiveUp: () => {
        this.state = GameState.GAME_OVER;
        this.hud.showGameOverModal(this.currentScore, Math.max(10, Math.floor(this.currentScore * 0.1)));
      },
      onClaimMultiplied: (mul) => this.handleVictoryMultiplier(mul),
      onPlayAgain: () => this.restartGame(),
    });

    this.shell = new ShellController({
      currentGameId: 'physics-drop-merge-3d',
      onRestart: () => this.restartGame(),
    });
    void this.shell;

    // 4. Game Loop
    this.loop = new GameLoop(
      (dt) => this.fixedUpdate(dt),
      (_alpha, dt) => this.render(dt)
    );

    // Resize
    window.addEventListener('resize', () => {
      const w = this.appEl.clientWidth || window.innerWidth;
      const h = this.appEl.clientHeight || window.innerHeight;
      this.renderer.setSize(w, h);
      this.cameraRig.onResize(w / h);
    });

    // Lifecycle
    PlatformBridge.initLifecycle({
      onPause: () => this.loop.stop(),
      onResume: () => this.loop.start(),
      onAudioEnabledChange: (enabled) => this.hud.updateSound(!enabled),
    });
  }

  public async bootstrap(): Promise<void> {
    await PlatformBridge.initPlatform();
    await this.ads.initialize();
    await this.economy.init();
    await RAPIER.init();

    this.physics = new PhysicsWorld();
    this.containerEntity = new ContainerEntity(this.scene, this.physics);
    this.dropper = new DropperEntity(this.scene);
    this.mergeSystem = new MergeSystem(
      this.scene,
      this.physics,
      this.sound,
      this.particles,
      this.cameraRig
    );

    this.input = new InputManager(this.appEl, {
      onAim: (x) => {
        if (this.state === GameState.PLAYING) {
          this.dropper.setX(x);
        }
      },
      onDragInertia: (dx) => {
        if (this.state === GameState.PLAYING) {
          this.physics.applyLateralInertia(dx * 0.08);
        }
      },
      onDrop: (x) => {
        if (this.state === GameState.PLAYING) {
          this.dropActiveSphere(x);
        }
      },
    });
    void this.input;

    this.restartGame();
    this.loop.start();
  }

  private restartGame(): void {
    this.state = GameState.PLAYING;
    this.currentScore = 0;
    this.dangerTimer = 0;
    this.dropCooldown = 0;

    this.hud.closeModals();
    this.hud.updateScore(0, this.economy.highScore);
    this.hud.setDangerAlert(false);
    this.hud.updateSound(this.sound.muted);

    this.mergeSystem.clear();

    this.nextTier = this.rollNextTier();
    this.isNextBomb = false;
    this.isNextRainbow = false;
    this.dropper.setPrimed(1, false, false);
    this.hud.updateNextBall(this.nextTier, this.isNextBomb, this.isNextRainbow);

    this.sound.resetCombo();
    PlatformBridge.gameReady();
  }

  private rollNextTier(): number {
    // Weighted RNG: 50% Tier 1, 30% Tier 2, 15% Tier 3, 5% Tier 4
    const r = Math.random();
    if (r < 0.5) return 1;
    if (r < 0.8) return 2;
    if (r < 0.95) return 3;
    return 4;
  }

  private dropActiveSphere(x: number): void {
    if (this.dropCooldown > 0) return;
    this.dropCooldown = 0.45; // Prevent rapid-tap spam

    this.hud.hideAimHint();
    const tierToDrop = this.dropper.primedTier;
    const isBomb = this.dropper.isBomb;
    const isRainbow = this.dropper.isRainbow;

    this.sound.playDrop();
    this.mergeSystem.spawnSphere(x, GAME_CONFIG.dropper.spawnY - 0.5, 0, tierToDrop, isBomb, isRainbow);

    // Queue next sphere
    const upcomingTier = this.nextTier;
    const upcomingBomb = this.isNextBomb;
    const upcomingRainbow = this.isNextRainbow;

    this.nextTier = this.rollNextTier();
    this.isNextBomb = false;
    // Check if next ball should be a Rainbow Wildcard (triggered every 15 merges)
    this.isNextRainbow = this.mergeSystem.mergeCount > 0 && this.mergeSystem.mergeCount % 15 === 0;

    this.dropper.setPrimed(upcomingTier, upcomingBomb, upcomingRainbow);
    this.hud.updateNextBall(this.nextTier, this.isNextBomb, this.isNextRainbow);
  }

  // --- Booster 1: Pop Shake ---
  private async activateBoosterShake(): Promise<void> {
    const rewarded = await this.ads.showRewarded('booster_shake');
    if (rewarded) {
      this.physics.applyUpwardShake(GAME_CONFIG.boosters.shakeImpulse);
      this.sound.playClick();
      this.cameraRig.addTrauma(0.3);
    }
  }

  // --- Booster 2: Bomb Ball ---
  private async activateBoosterBomb(): Promise<void> {
    const rewarded = await this.ads.showRewarded('booster_bomb');
    if (rewarded) {
      this.dropper.setPrimed(1, true);
      this.sound.playClick();
    }
  }

  // --- Booster 3: +1 Evolution Beam ---
  private async activateBoosterEvolve(): Promise<void> {
    const rewarded = await this.ads.showRewarded('booster_evolve');
    if (rewarded) {
      const current = this.dropper.primedTier;
      const evolved = Math.min(current + 1, 10);
      this.dropper.setPrimed(evolved, false);
      this.sound.playClick();
    }
  }

  // --- Rewarded Ad Hook: Revive ---
  private async handleReviveReward(): Promise<void> {
    const rewarded = await this.ads.showRewarded('revive');
    if (rewarded) {
      this.mergeSystem.vaporizeTopSpheres(3);
      this.dangerTimer = 0;
      this.hud.setDangerAlert(false);
      this.state = GameState.PLAYING;
      this.sound.playClick();
    } else {
      this.state = GameState.GAME_OVER;
      this.hud.showGameOverModal(this.currentScore, Math.max(10, Math.floor(this.currentScore * 0.1)));
    }
  }

  // --- Rewarded Ad Hook: Victory Multiplier ---
  private async handleVictoryMultiplier(multiplier: number): Promise<void> {
    const rewarded = await this.ads.showRewarded('victory_multiplier');
    const baseCoins = Math.max(10, Math.floor(this.currentScore * 0.1));
    const finalCoins = rewarded ? Math.round(baseCoins * multiplier) : baseCoins;
    this.economy.addCoins(finalCoins);
    this.restartGame();
  }

  private fixedUpdate(dt: number): void {
    if (this.state === GameState.REVIVE_PROMPT) return;

    if (this.dropCooldown > 0) {
      this.dropCooldown -= dt;
    }

    // Step Physics
    this.physics.step((h1, h2) => {
      this.mergeSystem.handleContact(h1, h2, (points, newTier) => {
        this.currentScore += points;
        this.economy.recordTier(newTier);
        const isNewBest = this.economy.recordScore(this.currentScore);
        this.hud.updateScore(this.currentScore, this.economy.highScore);
        if (isNewBest) {
          this.cameraRig.addTrauma(0.15);
        }
      });
    });

    this.mergeSystem.update(dt);

    // Check Stack Height & Danger Overflow
    const highestY = this.mergeSystem.getHighestY();
    this.cameraRig.setStackHeight(highestY);

    const isDanger = highestY >= GAME_CONFIG.container.dangerY;
    this.containerEntity.setDangerAlert(isDanger, dt);
    this.hud.setDangerAlert(isDanger);

    if (isDanger && this.state === GameState.PLAYING) {
      const prevSec = Math.floor(this.dangerTimer);
      this.dangerTimer += dt;
      if (Math.floor(this.dangerTimer) > prevSec) {
        this.sound.playDangerWarning();
      }

      if (this.dangerTimer >= GAME_CONFIG.container.dangerTimeLimit) {
        this.state = GameState.REVIVE_PROMPT;
        this.hud.showReviveModal();
      }
    } else {
      this.dangerTimer = 0;
    }
  }

  private render(dt: number): void {
    this.clock.tick();
    this.particles.update(dt);
    this.cameraRig.update(dt);

    this.renderer.render(this.scene, this.cameraRig.camera);

    if (this.isFirstFrame) {
      this.isFirstFrame = false;
      PlatformBridge.firstFrameReady();
    }
  }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  const app = new DropMergeApp();
  void app.bootstrap();
});
