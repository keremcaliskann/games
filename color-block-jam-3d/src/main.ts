import * as THREE from 'three';
import { RenderPipeline } from './render/renderer';
import { CameraRig } from './render/camera-rig';
import { LightingSetup } from './render/lighting';
import { ParticleBurstEffect } from './render/effects';
import { InputManager } from './input/input-manager';
import { SoundController } from './core/audio';
import { GameLoop } from './core/game-loop';
import { Board } from './game/entities/board';
import { Block } from './game/entities/block';
import { LevelGenerator, LevelData } from './game/systems/solver-generator';
import { EconomySystem } from './game/systems/economy';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { PlatformBridge, SaveDataPayload } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { GAME_CONFIG } from './game/config/game-config';

const _ORIGIN = new THREE.Vector3(0, 0, 0);

class GameApp {
  private readonly appEl: HTMLElement;
  private readonly hudEl: HTMLElement;

  private readonly pipeline: RenderPipeline;
  private readonly cameraRig: CameraRig;
  private readonly particles: ParticleBurstEffect;
  private readonly sound: SoundController;
  private readonly loop: GameLoop;

  private readonly economy: EconomySystem;
  private readonly board: Board;
  private readonly input: InputManager;
  private readonly hud: Hud;
  private readonly shell: ShellController;
  private readonly ads: UniversalAdProvider;

  private currentLevelData!: LevelData;
  private remainingMoves = 16;
  private isFirstRender = true;
  private isLevelTransitioning = false;

  constructor(cloudData?: SaveDataPayload) {
    this.appEl = document.getElementById('app')!;
    this.hudEl = document.getElementById('hud')!;

    this.ads = UniversalAdProvider.get();
    this.ads.initialize();

    this.sound = new SoundController();
    this.cameraRig = new CameraRig(this.appEl);
    this.pipeline = new RenderPipeline(this.appEl, {
      onResize: (width, height) => {
        this.cameraRig.resize(width, height);
      },
    });

    LightingSetup.setup(this.pipeline.scene);

    // Pooled 3D Voxel Shred Particles
    this.particles = new ParticleBurstEffect();
    this.pipeline.scene.add(this.particles.instancedMesh);

    // Board & Entities
    this.economy = new EconomySystem(cloudData);
    this.board = new Board(6, 6);
    this.pipeline.scene.add(this.board.rootGroup);

    // Input Controller
    this.input = new InputManager(this.pipeline.renderer.domElement, this.cameraRig.camera);
    this.input.setTargetsProvider(() => this.board.getRaycastTargets());
    this.input.setCallbacks({
      onBlockSwipe: (block, dirX, dirY) => this.handleBlockSwipe(block, dirX, dirY),
      onBlockTap: (block) => this.handleBlockTap(block),
      onOrbitDelta: (dx, dy) => this.cameraRig.rotateDelta(dx, dy),
    });

    // UI HUD Controller with 3 Mandatory Revenue Hooks
    this.hud = new Hud(this.hudEl, {
      onRestartClick: () => this.loadCurrentLevel(),
      onSoundToggle: () => {
        const isMuted = this.sound.toggleMute();
        this.hud.setSoundMuted(isMuted);
      },
      onNextLevel: () => this.handleNextLevel(),
      onUseHammer: () => this.handleHammerClick(),
      onUseFreeHammerAd: () => this.handleFreeHammerAd(),
      onAddMovesAd: () => this.handleAddMovesAd(),
      onUseVacuumAd: () => this.handleVacuumAd(),
      onReviveAd: () => this.handleReviveAd(),
      onClaimMultiplierAd: (mult) => this.handleClaimMultiplierAd(mult),
      onClaimBaseVictory: () => this.handleClaimBaseVictory(),
      isAdReady: () => this.ads.isRewardedReady(),
    });

    // Arcade Shell Controller
    this.shell = new ShellController({
      currentGameId: 'color-block-jam-3d',
      onRestart: () => this.loadCurrentLevel(),
    });

    window.addEventListener('arcade:restart', () => {
      this.loadCurrentLevel();
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
      (dt) => this.update(dt),
      () => this.render()
    );

    // Initial Level Load
    this.loadCurrentLevel();
    this.loop.start();

    // Signal game ready after everything is interactive
    PlatformBridge.signalGameReady();
  }

  private update(dt: number): void {
    this.cameraRig.update(dt);
    this.board.update(dt);
    this.particles.update(dt);
  }

  private render(): void {
    this.pipeline.render(this.cameraRig.camera);
    if (this.isFirstRender) {
      this.isFirstRender = false;
      PlatformBridge.signalFirstFrameReady();
    }
  }

  private loadCurrentLevel(): void {
    this.isLevelTransitioning = false;
    this.hud.resetLatches();
    this.hud.setHammerActive(false);

    const lvl = this.economy.getLevel();
    this.currentLevelData = LevelGenerator.generateLevel(lvl);

    LevelGenerator.loadIntoBoard(this.currentLevelData, this.board);
    this.remainingMoves = this.currentLevelData.parMoves;

    // Adjust camera distance according to board dimensions
    const maxDim = Math.max(this.currentLevelData.cols, this.currentLevelData.rows);
    const camDist = maxDim <= 5 ? 18 : maxDim <= 6 ? 21 : 24;
    this.cameraRig.setBaseDistance(camDist);

    this.updateHud();
  }

  private updateHud(): void {
    this.hud.updateHeader(
      this.economy.getLevel(),
      this.board.getRemainingCount(),
      this.remainingMoves,
      this.economy.getCoins()
    );
  }

  private handleBlockSwipe(block: Block, dirX: number, dirY: number): void {
    if (this.isLevelTransitioning) return;

    if (this.hud.getIsHammerActive()) {
      this.executeHammerOnBlock(block);
      return;
    }

    const outcome = this.board.trySlideBlock(block, dirX, dirY);

    if (outcome.type === 'shredded') {
      this.remainingMoves = Math.max(0, this.remainingMoves - 1);
      this.sound.playShredCrunch();
      this.sound.playVoxelPop();

      // Spawn 3D flying voxels burst
      this.particles.spawnShredBurst(
        outcome.gate.worldPosition,
        outcome.gate.intakeDirection,
        block.color.hex,
        32
      );

      this.updateHud();
      this.checkLevelStatus();
    } else if (outcome.type === 'moved') {
      this.remainingMoves = Math.max(0, this.remainingMoves - 1);
      this.sound.playSlide();
      this.updateHud();
      this.checkLevelStatus();
    } else {
      // Blocked
      this.sound.playBlocked();
      this.cameraRig.addTrauma(0.3);
    }
  }

  private handleBlockTap(block: Block): void {
    if (this.isLevelTransitioning) return;

    if (this.hud.getIsHammerActive()) {
      this.executeHammerOnBlock(block);
      return;
    }

    // Smart tap: If this block has an open path directly into its matching gate, slide into it!
    const tryDirs = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    for (const d of tryDirs) {
      const exitGate = this.board.canBlockExitInDirection(block, d.x, d.y);
      if (exitGate) {
        this.handleBlockSwipe(block, d.x, d.y);
        return;
      }
    }

    // Path to matching gate is currently blocked -> Wiggle feedback without wasting moves
    block.triggerWiggle();
    this.sound.playBlocked();
    this.cameraRig.addTrauma(0.15);
  }

  private executeHammerOnBlock(block: Block): void {
    this.hud.setHammerActive(false);
    this.board.hammerBlock(block);
    this.sound.playHammer();
    this.cameraRig.addTrauma(0.45);
    this.particles.spawnHammerSparks(block.group.position);
    this.updateHud();
    this.checkLevelStatus();
  }

  private checkLevelStatus(): void {
    const remaining = this.board.getRemainingCount();

    if (remaining === 0) {
      // Level Victory!
      this.isLevelTransitioning = true;
      this.sound.playVictory();
      this.particles.spawnCelebration(_ORIGIN);

      const lvl = this.economy.getLevel();
      PlatformBridge.sendScore(lvl * 100);

      setTimeout(() => {
        this.hud.showVictory(lvl, GAME_CONFIG.coinsPerLevel);
      }, 500);
      return;
    }

    if (this.remainingMoves <= 0) {
      // Out of moves! Check Near-Miss Revive Hook
      if (remaining <= GAME_CONFIG.nearMissThreshold) {
        // Hook 2: Near-Miss Revive Modal
        this.sound.playBlocked();
        setTimeout(() => {
          this.hud.showNearMissRevive(
            remaining,
            () => {
              // Revived via ad
              this.remainingMoves += GAME_CONFIG.reviveMoves;
              this.economy.addHammer();
              this.updateHud();
            },
            () => {
              // Gave up -> Game Over
              this.sound.playGameOver();
              this.hud.showGameOver(() => this.loadCurrentLevel());
            }
          );
        }, 300);
      } else {
        // Standard Game Over
        this.sound.playGameOver();
        setTimeout(() => {
          this.hud.showGameOver(() => this.loadCurrentLevel());
        }, 300);
      }
    }
  }

  // --- REVENUE HOOKS IMPLEMENTATION ---

  // Hook 1A: Hammer Booster Click
  private async handleHammerClick(): Promise<void> {
    if (this.hud.getIsHammerActive()) {
      this.hud.setHammerActive(false);
      return;
    }

    if (this.economy.getHammers() > 0) {
      this.economy.useHammer();
      this.hud.setHammerActive(true);
      this.updateHud();
    } else if (this.economy.canAffordHammer()) {
      this.economy.buyHammer();
      this.economy.useHammer();
      this.hud.setHammerActive(true);
      this.updateHud();
    } else {
      // Out of coins; offer Rewarded Ad for Free Hammer
      await this.handleFreeHammerAd();
    }
  }

  private async handleFreeHammerAd(): Promise<void> {
    const success = await this.ads.showRewarded('free_hammer');
    if (success) {
      this.economy.addHammer();
      this.hud.setHammerActive(true);
      this.updateHud();
    }
  }

  // Hook 1B: +5 Moves Booster Ad
  private async handleAddMovesAd(): Promise<void> {
    const success = await this.ads.showRewarded('extra_moves');
    if (success) {
      this.remainingMoves += 5;
      this.sound.playVoxelPop();
      this.updateHud();
    }
  }

  // Hook 1C: Color Vacuum Booster Ad
  private async handleVacuumAd(): Promise<void> {
    const success = await this.ads.showRewarded('color_vacuum');
    if (success) {
      // Find the most abundant remaining color
      const counts: Record<string, number> = {};
      for (const b of this.board.getActiveBlocks()) {
        counts[b.color.id] = (counts[b.color.id] || 0) + 1;
      }
      let topColor = '';
      let topCount = 0;
      for (const cid in counts) {
        if (counts[cid] > topCount) {
          topCount = counts[cid];
          topColor = cid;
        }
      }

      if (topColor) {
        this.sound.playVacuum();
        const shredded = this.board.vacuumBlocksOfColor(topColor);
        for (const b of shredded) {
          this.particles.spawnShredBurst(b.group.position, new THREE.Vector3(0, 1, 0), b.color.hex, 25);
        }
        this.updateHud();
        this.checkLevelStatus();
      }
    }
  }

  // Hook 2: Near-Miss Revive Rewarded Ad
  private async handleReviveAd(): Promise<void> {
    const success = await this.ads.showRewarded('near_miss_revive');
    if (success) {
      this.remainingMoves += GAME_CONFIG.reviveMoves;
      this.economy.addHammer();
      this.updateHud();
    }
  }

  // Hook 3: Victory Multiplier Rewarded Ad
  private async handleClaimMultiplierAd(multiplier: number): Promise<void> {
    const success = await this.ads.showRewarded('victory_multiplier');
    if (success) {
      const baseReward = GAME_CONFIG.coinsPerLevel;
      const totalBonus = Math.floor(baseReward * multiplier);
      this.economy.addCoins(totalBonus);
      this.handleNextLevel();
    } else {
      this.handleClaimBaseVictory();
    }
  }

  private handleClaimBaseVictory(): void {
    this.economy.addCoins(GAME_CONFIG.coinsPerLevel);
    this.handleNextLevel();
  }

  private handleNextLevel(): void {
    this.economy.nextLevel();
    this.loadCurrentLevel();
  }
}

// Bootstrap
async function bootstrap(): Promise<void> {
  PlatformBridge.applyDualModeShell();

  // Cloud save pre-flight (loadData must precede saveData)
  const defaultSave: SaveDataPayload = {
    level: 1,
    coins: 150,
    hammers: 1,
    colorVacuums: 1,
  };
  const cloudData = await PlatformBridge.loadData(defaultSave);

  new GameApp(cloudData);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => bootstrap());
} else {
  bootstrap();
}
