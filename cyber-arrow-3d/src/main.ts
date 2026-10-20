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
import { LifecycleManager } from './platform/lifecycle';
import { GAME_CONFIG } from './game/config/game-config';

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

  constructor() {
    this.appEl = document.getElementById('app')!;
    this.hudEl = document.getElementById('hud')!;

    // Core & Render Setup
    this.bus = EventBus.get();
    this.sound = new SoundController();
    this.pipeline = new RenderPipeline(this.appEl);
    this.cameraRig = new CameraRig(this.appEl);
    LightingSetup.setup(this.pipeline.scene);

    // Particle Burst System
    this.particles = new ParticleBurstEffect();
    this.pipeline.scene.add(this.particles.points);

    // Game Systems & Entities
    this.economy = new EconomySystem();
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

    // UI HUD Setup
    this.hud = new Hud(this.hudEl, {
      onHintClick: () => this.handleHint(),
      onResetClick: () => this.loadCurrentLevel(),
      onSoundToggle: () => this.sound.toggleMute(),
      onNextLevel: () => this.handleNextLevel(),
      onWatchAd: () => this.handleRewardAd(),
    });

    // Wire Event Bus listeners
    this.bus.on('block_cleared', (block: ArrowBlock) => {
      this.sound.playFlyAway();
      this.particles.spawnBurst(block.group.position, 22);
      this.hud.setRemaining(this.grid.getRemainingCount());
    });

    this.bus.on('block_blocked', () => {
      this.sound.playBlocked();
    });

    this.bus.on('level_completed', () => {
      this.sound.playLevelVictory();
      const currentLevel = this.economy.getLevel();
      const shouldAd = this.economy.shouldShowInterstitial();
      this.economy.advanceLevel();
      this.hud.showVictory(currentLevel, GAME_CONFIG.coinsPerLevel, shouldAd);
    });

    // Lifecycle Watcher
    LifecycleManager.onVisibilityChange((isVisible) => {
      if (!isVisible) {
        this.loop.stop();
      } else {
        this.loop.start();
      }
    });

    // Game Loop
    this.loop = new GameLoop();
    this.loop.setCallbacks(
      () => {}, // Fixed physics step if needed
      (delta) => this.update(delta),
      () => this.render()
    );

    // Initial Level Load
    this.loadCurrentLevel();
    this.loop.start();
  }

  private updateCameraDistance(): void {
    const lvl = this.economy.getLevel();
    const dist = lvl <= 2 ? 14 : lvl <= 4 ? 18 : 22;
    this.cameraRig.setDistance(dist);
  }

  private loadCurrentLevel(): void {
    const lvl = this.economy.getLevel();
    LevelLoader.loadLevel(lvl, this.grid);
    this.updateCameraDistance();
    this.hud.updateHeader(lvl, this.grid.getRemainingCount(), this.economy.getCoins());
  }

  private handleTap(raycaster: THREE.Raycaster): void {
    const targets = this.grid.getRaycastTargets();
    const hits = raycaster.intersectObjects(targets, false);

    if (hits.length > 0) {
      const hitObj = hits[0].object;
      const block = hitObj.userData.block as ArrowBlock | undefined;
      if (block) {
        this.grid.tryTapBlock(block);
      }
    }
  }

  private handleHint(): void {
    if (!this.economy.canAffordHint()) {
      this.hud.showRewardedAdPrompt();
      return;
    }

    const found = this.grid.showHint();
    if (found) {
      this.economy.spendHint();
    }
  }

  private handleNextLevel(): void {
    this.loadCurrentLevel();
  }

  private handleRewardAd(): void {
    this.economy.rewardAdWatched();
  }

  private update(delta: number): void {
    this.cameraRig.update(delta);
    this.grid.update(delta, () => {});
    this.particles.update(delta);
  }

  private render(): void {
    this.pipeline.render(this.cameraRig.camera);
  }
}

// Start game once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
