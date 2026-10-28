import * as THREE from 'three';
import { RenderPipeline } from './render/renderer';
import { CameraRig } from './render/camera-rig';
import { LightingSetup } from './render/lighting';
import { ParticleBurstEffect } from './render/effects';
import { InputManager } from './input/input-manager';
import { SoundController } from './core/audio';
import { GameLoop } from './core/game-loop';
import { EventBus } from './core/events';
import { PuzzleGrid } from './game/entities/puzzle-grid';
import { LevelLoader } from './game/systems/level-loader';
import { EconomySystem } from './game/systems/economy';
import { ArrowBlock } from './game/entities/arrow-block';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { PlatformBridge } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { GAME_CONFIG, calculateMoveBudget } from './game/config/game-config';

const _ORIGIN = new THREE.Vector3(0, 0, 0);

class GameApp {
  private readonly appEl: HTMLElement;
  private readonly hudEl: HTMLElement;

  private readonly pipeline: RenderPipeline;
  private readonly cameraRig: CameraRig;
  private readonly particles: ParticleBurstEffect;
  private readonly sound: SoundController;
  private readonly loop: GameLoop;
  private readonly bus: EventBus;

  private readonly economy: EconomySystem;
  private readonly grid: PuzzleGrid;
  private readonly input: InputManager;
  private readonly hud: Hud;
  private readonly shell: ShellController;
  private readonly ads: UniversalAdProvider;
  private isFirstRender = true;

  private movesRemaining = 0;
  private streakCount = 0;
  private isGameOver = false;
  private isHammerActive = false;

  constructor(cloudData?: { currentLevel?: number; coins?: number }) {
    this.appEl = document.getElementById('app')!;
    this.hudEl = document.getElementById('hud')!;
    this.ads = UniversalAdProvider.get();
    this.ads.initialize();

    // Core & Render Setup
    this.bus = EventBus.get();
    this.sound = new SoundController();
    this.cameraRig = new CameraRig(this.appEl);
    this.pipeline = new RenderPipeline(this.appEl, {
      onResize: (width, height) => {
        this.cameraRig.resize(width, height);
      },
    });
    LightingSetup.setup(this.pipeline.scene);

    // Particle Burst System
    this.particles = new ParticleBurstEffect();
    this.pipeline.scene.add(this.particles.points);

    // Game Systems & Entities
    this.economy = new EconomySystem(cloudData);
    this.grid = new PuzzleGrid();
    this.pipeline.scene.add(this.grid.rootGroup);

    // Dynamic Camera Distance scaling based on level size
    this.updateCameraDistance();

    // Input Handling
    this.input = new InputManager(this.pipeline.renderer.domElement, this.cameraRig.camera);
    this.input.setCallbacks(
      (raycaster) => this.handleTap(raycaster),
      (dx, dy) => this.cameraRig.rotateDelta(dx, dy)
    );

    // UI HUD Setup with 3 Mandatory Revenue Hooks
    this.hud = new Hud(this.hudEl, {
      onHintClick: () => this.handleHint(),
      onResetClick: () => this.loadCurrentLevel(),
      onHammerClick: () => this.handleHammerClick(),
      onSoundToggle: () => this.sound.toggleMute(),
      onNextLevel: () => this.handleNextLevel(),
      onWatchAd: () => this.handleRewardCoinsAd(),
      onWatchMultiplierAd: (multiplier: number) => this.handleMultiplierAd(multiplier),
      onFreeHintAd: () => this.handleFreeHintAd(),
      isAdReady: () => this.ads.isRewardedReady(),
    });

    // Standardized Arcade Shell Controller (for GitHub Pages Portal mode)
    this.shell = new ShellController({
      currentGameId: 'cyber-arrow-3d',
      onRestart: () => this.loadCurrentLevel(),
    });

    // Wire Event Bus listeners
    this.bus.on('block_cleared', (block: ArrowBlock) => {
      this.streakCount++;
      this.sound.playFlyAway(this.streakCount);
      this.particles.spawnBurst(block.group.position, 24);
      this.hud.setRemaining(this.grid.getRemainingCount());
      this.hud.setStreak(this.streakCount);
    });

    this.bus.on('block_blocked', (block: ArrowBlock) => {
      this.streakCount = 0;
      this.hud.setStreak(0);
      this.sound.playBlocked();
      this.cameraRig.addTrauma(0.35);
      if (block) {
        this.particles.spawnBonkSparks(block.group.position, block.dirVector);
      }
    });

    this.bus.on('level_completed', () => {
      this.isGameOver = true;
      this.sound.playLevelVictory();
      this.particles.spawnCelebration(_ORIGIN);
      const currentLevel = this.economy.getLevel();
      PlatformBridge.sendScore(currentLevel * 100);
      PlatformBridge.saveData({
        level: currentLevel + 1,
        coins: this.economy.getCoins() + GAME_CONFIG.coinsPerLevel,
      });

      // Show Victory screen with Oscillating Multiplier Hook
      PlatformBridge.gameplayStop();
      this.hud.showVictory(currentLevel, GAME_CONFIG.coinsPerLevel);
    });

    // Platform Lifecycle & Audio Sync
    PlatformBridge.initLifecycle({
      onPause: () => this.loop.stop(),
      onResume: () => this.loop.start(),
      onAudioEnabledChange: (enabled: boolean) => {
        this.sound.setMuted(!enabled);
        this.hud.setSoundMuted(!enabled);
      },
    });

    window.addEventListener('beforeunload', () => {
      this.particles.dispose();
      this.shell.dispose();
      this.pipeline.dispose();
    });

    // Game Loop
    this.loop = new GameLoop();
    this.loop.setCallbacks(
      () => {},
      (delta) => this.update(delta),
      () => this.render()
    );

    // Initial Level Load
    this.loadCurrentLevel();
    this.loop.start();

    // Signal game ready after bootstrap
    PlatformBridge.signalGameReady();
  }

  private updateCameraDistance(): void {
    const lvl = this.economy.getLevel();
    const dist = lvl <= 2 ? 14 : lvl <= 4 ? 18 : 22;
    this.cameraRig.setDistance(dist);
  }

  private loadCurrentLevel(): void {
    PlatformBridge.gameplayStart();
    const lvl = this.economy.getLevel();
    LevelLoader.loadLevel(lvl, this.grid);
    this.updateCameraDistance();
    this.isGameOver = false;
    this.isHammerActive = false;
    this.streakCount = 0;
    this.hud.setStreak(0);
    this.hud.setHammerActive(false);
    this.movesRemaining = calculateMoveBudget(this.grid.getRemainingCount());
    this.hud.updateHeader(lvl, this.grid.getRemainingCount(), this.economy.getCoins());
    this.hud.setMoves(this.movesRemaining);
  }

  private handleTap(raycaster: THREE.Raycaster): void {
    if (this.isGameOver) return;

    const targets = this.grid.getRaycastTargets();
    const hits = raycaster.intersectObjects(targets, false);

    let selectedBlock: ArrowBlock | undefined;
    if (hits.length > 0) {
      selectedBlock = hits[0].object.userData.block as ArrowBlock | undefined;
    } else {
      // Magnetic Tap Assist: pick closest idle block within 0.68m of ray
      let bestDistSq = 0.68 * 0.68;
      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        const candidate = t.userData.block as ArrowBlock | undefined;
        if (!candidate || candidate.state !== 'IDLE') continue;
        t.getWorldPosition(_ORIGIN);
        const dSq = raycaster.ray.distanceSqToPoint(_ORIGIN);
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          selectedBlock = candidate;
        }
      }
    }

    if (selectedBlock && selectedBlock.state === 'IDLE') {
      const block = selectedBlock;

      if (this.isHammerActive) {
        this.isHammerActive = false;
        this.hud.setHammerActive(false);
        this.grid.hammerDestroyBlock(block);
        return;
      }

      this.movesRemaining--;
      this.hud.setMoves(this.movesRemaining);

      this.grid.tryTapBlock(block);

      if (this.movesRemaining <= 0 && this.grid.getRemainingCount() > 0) {
        this.isGameOver = true;
        setTimeout(() => {
          if (this.grid.getRemainingCount() > 0) {
            this.hud.showNearMissRevive(
              this.grid.getRemainingCount(),
              () => this.handleReviveMoves(),
              () => this.loadCurrentLevel()
            );
          }
        }, 350);
      }
    }
  }

  // Hook 2: Near-Miss Revive (+5 Moves via Rewarded Ad)
  private async handleReviveMoves(): Promise<void> {
    const rewarded = await this.ads.showRewarded('revive_moves');
    if (rewarded) {
      this.movesRemaining += 5;
      this.hud.setMoves(this.movesRemaining);
      this.isGameOver = false;
      this.sound.playFlyAway();
    } else {
      this.loadCurrentLevel();
    }
  }

  // Hook 1: Hammer Booster (Tap-to-Clear Single Block via Rewarded Ad)
  private async handleHammerClick(): Promise<void> {
    if (this.isGameOver) return;
    if (this.isHammerActive) {
      this.isHammerActive = false;
      this.hud.setHammerActive(false);
      return;
    }

    const rewarded = await this.ads.showRewarded('booster_hammer');
    if (rewarded) {
      this.isHammerActive = true;
      this.hud.setHammerActive(true);
      this.sound.playFlyAway();
    }
  }

  // Hook 1: In-Level Booster (Hint or Free Rewarded Hint)
  private async handleHint(): Promise<void> {
    if (!this.economy.canAffordHint()) {
      await this.handleFreeHintAd();
      return;
    }

    const found = this.grid.showHint();
    if (found) {
      this.economy.spendHint();
      this.hud.updateHeader(this.economy.getLevel(), this.grid.getRemainingCount(), this.economy.getCoins());
    }
  }

  private async handleFreeHintAd(): Promise<void> {
    const rewarded = await this.ads.showRewarded('booster_hint');
    if (rewarded) {
      const found = this.grid.showHint();
      if (found) {
        this.sound.playFlyAway();
      }
    }
  }

  // Hook 1 (Coins refill via Rewarded Ad)
  private async handleRewardCoinsAd(): Promise<void> {
    const rewarded = await this.ads.showRewarded('refill_coins');
    if (rewarded) {
      this.economy.rewardAdWatched();
      this.hud.updateHeader(this.economy.getLevel(), this.grid.getRemainingCount(), this.economy.getCoins());
    }
  }

  // Hook 3: Victory Multiplier Bar (1.5x - 5x)
  private async handleMultiplierAd(multiplier: number): Promise<void> {
    const rewarded = await this.ads.showRewarded('victory_multiplier');
    const baseCoins = GAME_CONFIG.coinsPerLevel;
    const finalBonus = rewarded ? Math.floor(baseCoins * multiplier) : baseCoins;

    this.economy.advanceLevel();
    const extraCoins = finalBonus - baseCoins;
    if (extraCoins > 0) {
      this.economy.addCoins(extraCoins);
    }

    this.loadCurrentLevel();
  }

  private async handleNextLevel(): Promise<void> {
    this.economy.advanceLevel();
    // Trigger interstitial between levels respecting 90-120s cadence
    await this.ads.showInterstitial('next_level');
    this.loadCurrentLevel();
  }

  private update(delta: number): void {
    this.cameraRig.update(delta);
    this.grid.update(delta);
    this.particles.update(delta);
  }

  private render(): void {
    if (this.isFirstRender) {
      this.isFirstRender = false;
      PlatformBridge.signalFirstFrameReady();
    }
    this.pipeline.render(this.cameraRig.camera);
  }
}

async function bootstrap(): Promise<void> {
  // 1. Dual-Mode Shell: Auto-collapse in YouTube Playables / Yandex / CrazyGames / Poki
  PlatformBridge.applyDualModeShell();
  await PlatformBridge.initPlatform();

  // YouTube Playables mandatory loadData before any saveData
  const cloudData = await PlatformBridge.loadData({
    level: 1,
    coins: 50,
  });

  new GameApp({
    currentLevel: cloudData.level,
    coins: cloudData.coins,
  });
}

// Start game once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  bootstrap();
});
