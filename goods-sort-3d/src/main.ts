import * as THREE from 'three';
import { PlatformBridge } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { GameClock } from './core/clock';
import { GameLoop } from './core/game-loop';
import { SoundController } from './core/audio';
import { LightingSetup } from './render/lighting';
import { CameraRig } from './render/camera-rig';
import { ParticleEffects } from './render/effects';
import { Cabinet } from './game/entities/cabinet';
import { GoodsItem } from './game/entities/goods-item';
import { SortMatcher } from './game/systems/sort-matcher';
import { LevelGenerator, GeneratedLevel } from './game/levels/level-generator';
import { EconomySystem } from './game/systems/economy';
import { InputManager } from './input/input-manager';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { GAME_CONFIG } from './game/config/game-config';

enum GameState {
  PLAYING,
  LEVEL_WON,
  LEVEL_LOST,
  REVIVE_PROMPT,
}

class GoodsSortApp {
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

  // Game Entities & Systems
  private cabinet!: Cabinet;
  private matcher!: SortMatcher;
  private input!: InputManager;

  // Match / Level State
  private currentLevelNum = 1;
  private currentLevelData!: GeneratedLevel;
  private state: GameState = GameState.PLAYING;
  private remainingTime = 90;
  private totalLevelTime = 90;
  private isFirstFrame = true;

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
      onRestart: () => this.startLevel(this.currentLevelNum),
      onBoosterWand: () => this.activateBoosterWand(),
      onBoosterSlot: () => this.activateBoosterSlot(),
      onBoosterShuffle: () => this.activateBoosterShuffle(),
      onRevive: () => this.handleReviveReward(),
      onGiveUp: () => {
        this.state = GameState.LEVEL_LOST;
        this.hud.showDefeatModal();
      },
      onClaimMultiplied: (mul) => this.handleVictoryMultiplier(mul),
      onNextLevel: () => this.nextLevel(),
    });

    this.shell = new ShellController({
      currentGameId: 'goods-sort-3d',
      onRestart: () => this.startLevel(this.currentLevelNum),
    });
    void this.shell;

    // 4. Game Loop
    this.loop = new GameLoop((dt) => this.frameUpdate(dt));

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
    await this.economy.init();

    this.cabinet = new Cabinet(this.scene, GAME_CONFIG.cabinet.tiers, GAME_CONFIG.cabinet.cols);
    this.matcher = new SortMatcher(this.cabinet, this.sound, this.particles);

    this.input = new InputManager(this.appEl, this.cameraRig.camera, this.cabinet, {
      onItemMoved: () => {
        this.hud.hideTapHint();
        this.checkMatches();
      },
      onParallax: (px, py) => {
        this.cameraRig.setParallax(px, py);
      },
      onPlayClickSound: () => this.sound.playClick(),
      onPlaySlideSound: () => this.sound.playSlide(),
    });
    void this.input;

    this.startLevel(this.economy.highestLevel);
    this.loop.start();
  }

  private startLevel(levelNum: number): void {
    this.currentLevelNum = levelNum;
    this.currentLevelData = LevelGenerator.generateLevel(levelNum);

    this.state = GameState.PLAYING;
    this.totalLevelTime = this.currentLevelData.parTime;
    this.remainingTime = this.totalLevelTime;

    this.hud.closeModals();
    this.hud.updateLevel(this.currentLevelNum);
    this.hud.updateCoins(this.economy.coins);
    this.hud.updateTimer(this.remainingTime, this.totalLevelTime);
    this.hud.updateSound(this.sound.muted);

    // Build Cabinet Items
    this.cabinet.clear();
    for (const itemData of this.currentLevelData.items) {
      const pos = this.cabinet.getSlotPos(itemData.tier, itemData.col, itemData.slotIndex, false);
      const item = new GoodsItem(
        itemData.id,
        itemData.typeId,
        itemData.tier,
        itemData.col,
        itemData.slotIndex,
        itemData.layer,
        pos
      );
      this.cabinet.addItem(item);
    }

    this.sound.resetCombo();
    PlatformBridge.gameReady();
  }

  private checkMatches(): void {
    const hadMatch = this.matcher.checkMatches(() => {
      // Check Victory Condition
      if (this.cabinet.getAllItems().length === 0 && this.state === GameState.PLAYING) {
        this.state = GameState.LEVEL_WON;
        this.sound.playVictory();
        this.hud.showVictoryModal(GAME_CONFIG.coinsPerClear);
      }
    });

    if (!hadMatch) {
      this.sound.resetCombo();
    }
  }

  // --- Booster 1: Tidy Magic Wand ---
  private async activateBoosterWand(): Promise<void> {
    const rewarded = await this.ads.showRewarded('booster_wand');
    if (rewarded) {
      this.matcher.executeMagicWand();
      this.checkMatches();
    }
  }

  // --- Booster 2: Extra VIP Shelf Slot ---
  private async activateBoosterSlot(): Promise<void> {
    const rewarded = await this.ads.showRewarded('booster_slot');
    if (rewarded) {
      this.cabinet.enableVipTray();
      this.sound.playClick();
    }
  }

  // --- Booster 3: Shuffle Restock ---
  private async activateBoosterShuffle(): Promise<void> {
    const rewarded = await this.ads.showRewarded('booster_shuffle');
    if (rewarded) {
      this.matcher.executeShuffle();
    }
  }

  // --- Rewarded Ad Hook: Revive ---
  private async handleReviveReward(): Promise<void> {
    const rewarded = await this.ads.showRewarded('revive');
    if (rewarded) {
      this.remainingTime += 30;
      this.totalLevelTime += 30;
      this.hud.updateTimer(this.remainingTime, this.totalLevelTime);
      this.matcher.executeMagicWand();
      this.state = GameState.PLAYING;
      this.sound.playClick();
    } else {
      this.state = GameState.LEVEL_LOST;
      this.hud.showDefeatModal();
    }
  }

  // --- Rewarded Ad Hook: Victory Multiplier ---
  private async handleVictoryMultiplier(multiplier: number): Promise<void> {
    const rewarded = await this.ads.showRewarded('victory_multiplier');
    const baseCoins = GAME_CONFIG.coinsPerClear;
    const finalCoins = rewarded ? Math.round(baseCoins * multiplier) : baseCoins;
    this.economy.addCoins(finalCoins);
    this.nextLevel();
  }

  private nextLevel(): void {
    this.economy.recordLevelCompleted(this.currentLevelNum);
    this.startLevel(this.currentLevelNum + 1);
  }

  private frameUpdate(dt: number): void {
    this.clock.tick();

    if (this.state === GameState.PLAYING) {
      this.remainingTime -= dt;
      this.hud.updateTimer(this.remainingTime, this.totalLevelTime);

      if (this.remainingTime <= 0) {
        this.state = GameState.REVIVE_PROMPT;
        this.hud.showReviveModal();
      }
    }

    this.cabinet.update(dt);
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
  const app = new GoodsSortApp();
  void app.bootstrap();
});
