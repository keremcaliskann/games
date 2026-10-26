import * as THREE from 'three';
import { CameraRig } from './render/camera-rig';
import { LightingSetup } from './render/lighting';
import { PrefabFactory } from './render/PrefabFactory';
import { SoundController } from './core/audio';
import { GameLoop } from './core/game-loop';
import { HexGrid, HexCell } from './game/entities/hex-grid';
import { TraySpawner } from './game/entities/tray-spawner';
import { CascadeAnimator } from './game/systems/cascade-animator';
import { EconomySystem } from './game/systems/economy';
import { InputManager } from './input/input-manager';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { PlatformBridge } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { GAME_CONFIG, HexColorDef } from './game/config/game-config';

class HexaSortApp {
  private readonly appEl: HTMLElement;
  private readonly hudEl: HTMLElement;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly cameraRig: CameraRig;
  private readonly sound: SoundController;
  private readonly loop: GameLoop;
  private readonly ads: UniversalAdProvider;
  private readonly economy: EconomySystem;
  private readonly grid: HexGrid;
  private readonly tray: TraySpawner;
  private readonly cascade: CascadeAnimator;
  private readonly input: InputManager;
  private readonly hud: Hud;
  private readonly shell: ShellController;

  private isFirstRender = true;
  private isLevelTransitioning = false;
  private feverMeter = 0;
  private feverTimer = 0;

  constructor() {
    this.appEl = document.getElementById('app')!;
    this.hudEl = document.getElementById('hud')!;

    // 1. Dual-Mode Shell & SDK Integration
    PlatformBridge.applyDualModeShell();
    this.ads = UniversalAdProvider.get();
    this.ads.initialize();

    // 2. Sound & Systems
    this.sound = new SoundController();
    this.economy = new EconomySystem();

    // 3. Three.js Scene Setup (Rule 32 Stylized Toony Soft Daylight)
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(GAME_CONFIG.daylight.skyColor);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(this.appEl.clientWidth, this.appEl.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.appEl.appendChild(this.renderer.domElement);

    // 4. Camera & Lighting
    this.cameraRig = new CameraRig(this.appEl);
    LightingSetup.setup(this.scene);

    // 5. Procedural Prefabs & Game Entities
    PrefabFactory.init();

    this.grid = new HexGrid();
    this.scene.add(this.grid.group);

    this.tray = new TraySpawner();
    this.scene.add(this.tray.group);

    this.cascade = new CascadeAnimator(this.scene, this.grid, this.sound);
    this.cascade.setCallbacks(
      (color, count, points) => this.handleComboClear(color, count, points),
      () => this.handleCascadeFinish()
    );

    // 6. Input Manager
    this.input = new InputManager(
      this.renderer.domElement,
      this.cameraRig,
      this.grid,
      this.tray,
      this.sound
    );
    this.input.setCallbacks(
      (cell) => this.handleStackPlaced(cell),
      (cell) => this.handleHammerUsed(cell),
      () => this.hud.setBoosterModeBanner('normal')
    );

    // 7. HUD & Shell
    this.hud = new Hud(this.hudEl, {
      onRestartClick: () => this.restartLevel(),
      onSoundToggle: () => {
        const isMuted = this.sound.toggleMute();
        this.hud.setSoundMuted(isMuted);
      },
      onHammerBooster: () => this.activateHammerBooster(),
      onSwapBooster: () => this.activateSwapBooster(),
      onMoveBooster: () => this.activateMoveBooster(),
      onReviveAd: () => this.handleReviveAd(),
      onClaimMultiplierAd: (multiplier) => this.handleClaimMultiplierAd(multiplier),
      onClaimBaseVictory: () => this.handleClaimBaseVictory(),
      onNextLevel: () => this.handleNextLevel(),
      isAdReady: () => this.ads.isRewardedReady(),
    });

    this.shell = new ShellController({
      currentGameId: 'hexa-sort-3d',
      onRestart: () => this.restartLevel(),
    });
    window.addEventListener('beforeunload', () => this.shell.dispose());

    // 8. Resize Observer
    const ro = new ResizeObserver(() => this.handleResize());
    ro.observe(this.appEl);

    // 9. Platform Lifecycle
    PlatformBridge.initLifecycle({
      onPause: () => this.loop.stop(),
      onResume: () => this.loop.start(),
      onAudioEnabledChange: (enabled) => {
        this.sound.setMuted(!enabled);
        this.hud.setSoundMuted(!enabled);
      },
    });

    // 10. Game Loop
    this.loop = new GameLoop();
    this.loop.setCallbacks(
      () => {},
      (dt) => this.update(dt),
      () => this.render()
    );

    this.start();
  }

  private async start(): Promise<void> {
    await PlatformBridge.initPlatform();
    await this.economy.initialize();

    this.loadLevel(this.economy.level);
    this.loop.start();
  }

  private handleResize(): void {
    const w = this.appEl.clientWidth;
    const h = this.appEl.clientHeight;
    if (w <= 0 || h <= 0) return;

    this.cameraRig.resize(w, h);
    this.renderer.setSize(w, h);
  }

  private loadLevel(levelNum: number): void {
    this.isLevelTransitioning = false;
    this.feverMeter = 0;
    this.feverTimer = 0;
    this.hud.updateFever(0, false);
    this.grid.clear();
    this.tray.clear();
    this.cascade.clear();

    // Grid size: Level 1 has 7 cells (radius 1) for frictionless 2-second onboarding.
    // Level 2+ has 19 cells (radius 2 concentric honeycomb).
    const radius = levelNum === 1 ? 1 : 2;
    this.grid.generateBoard(radius, -0.6);

    const activeColors = this.economy.getActiveColors();

    // 2-Second Hook Onboarding: Pre-populate 1 or 2 starting cells with starter stacks
    this.seedInitialBoard(activeColors);

    // Fill the 3 tray slots with smart solvability bias
    this.tray.refillSlots(
      activeColors,
      this.grid.getExposedTopColorIds(),
      this.grid.getOccupancyRatio()
    );

    this.updateHud();
    PlatformBridge.gameplayStart();
  }

  /**
   * Seeds 2 initial stacks on the board so the player immediately sees matching cascade potential
   */
  private seedInitialBoard(activeColors: HexColorDef[]): void {
    const empty = this.grid.getEmptyCells();
    if (empty.length < 2) return;

    // Pick 2 adjacent cells
    const cellA = empty[0];
    const neighbors = this.grid.getNeighbors(cellA);
    const cellB = neighbors[0] || empty[1];

    const colorA = activeColors[0];
    const colorB = activeColors[1 % activeColors.length];

    // Cell A gets 3 tiles of color A
    for (let i = 0; i < 3; i++) {
      cellA.stack.pushTile(colorA);
    }

    // Cell B gets 2 tiles of color B
    for (let i = 0; i < 2; i++) {
      cellB.stack.pushTile(colorB);
    }
  }

  private handleStackPlaced(cell: HexCell): void {
    // Evaluate domino arc flip cascades starting from target cell
    this.cascade.evaluateCascades(cell);
  }

  private handleComboClear(_color: HexColorDef, count: number, points: number): void {
    this.feverMeter = Math.min(1, this.feverMeter + 0.4);
    if (this.feverMeter >= 1) {
      this.feverTimer = 5.0;
    }
    const mult = this.feverTimer > 0 ? 2 : 1;
    this.economy.addClearedTiles(count * mult, points * mult);
    this.cameraRig.addTrauma(0.35);
    this.hud.updateFever(this.feverMeter, this.feverTimer > 0);
    this.updateHud();

    if (this.economy.isLevelComplete() && !this.isLevelTransitioning) {
      this.isLevelTransitioning = true;
      PlatformBridge.gameplayStop();
      this.sound.playVictory();
      setTimeout(() => {
        this.hud.showVictory(this.economy.level, 50);
      }, 600);
    }
  }

  private handleCascadeFinish(): void {
    if (this.isLevelTransitioning) return;

    // Refill tray slots
    const activeColors = this.economy.getActiveColors();
    this.tray.refillSlots(
      activeColors,
      this.grid.getExposedTopColorIds(),
      this.grid.getOccupancyRatio()
    );

    this.updateHud();

    // Check for Near-Miss Jam Condition: All cells full with stacks and no empty slots
    if (this.checkDeadlock()) {
      setTimeout(() => {
        this.hud.showNearMissRevive(
          () => this.handleReviveAd(),
          () => this.restartLevel()
        );
      }, 400);
    }
  }

  private checkDeadlock(): boolean {
    const emptyCount = this.grid.getEmptyCells().length;
    if (emptyCount > 0) return false;

    // All cells occupied: check if any tray stack has a top color matching an adjacent stack
    const exposed = new Set(this.grid.getExposedTopColorIds());
    for (const slot of this.tray.slots) {
      if (slot.stack && !slot.stack.isEmpty()) {
        const top = slot.stack.getTopColor();
        if (top && exposed.has(top.id)) {
          return false; // Can still drop on matching top cell
        }
      }
    }

    return true; // Honeycomb completely full with no matching moves
  }

  // --- Boosters (Hook 1) ---

  private activateHammerBooster(): void {
    if (this.economy.hammers > 0) {
      this.economy.hammers--;
      this.input.mode = 'hammer';
      this.hud.setBoosterModeBanner('hammer');
      this.updateHud();
    } else {
      // Prompt rewarded ad for hammer
      this.ads.showRewarded('booster_hammer').then((rewarded) => {
        if (rewarded) {
          this.input.mode = 'hammer';
          this.hud.setBoosterModeBanner('hammer');
        }
      });
    }
  }

  private handleHammerUsed(cell: HexCell): void {
    this.cascade.executeHammerSmash(cell);
    this.cameraRig.addTrauma(0.45);
    this.updateHud();
    this.economy.save();
  }

  private activateSwapBooster(): void {
    const executeSwap = () => {
      this.sound.playSwap();
      this.tray.rerollAll(
        this.economy.getActiveColors(),
        this.grid.getExposedTopColorIds(),
        this.grid.getOccupancyRatio()
      );
      this.economy.save();
      this.updateHud();
    };

    if (this.economy.swaps > 0) {
      this.economy.swaps--;
      executeSwap();
    } else {
      this.ads.showRewarded('booster_swap').then((rewarded) => {
        if (rewarded) executeSwap();
      });
    }
  }

  private activateMoveBooster(): void {
    if (this.economy.moves > 0) {
      this.economy.moves--;
      this.input.mode = 'move_stack';
      this.hud.setBoosterModeBanner('move_stack');
      this.updateHud();
    } else {
      this.ads.showRewarded('booster_move').then((rewarded) => {
        if (rewarded) {
          this.input.mode = 'move_stack';
          this.hud.setBoosterModeBanner('move_stack');
        }
      });
    }
  }

  // --- Revive (Hook 2) ---

  private async handleReviveAd(): Promise<void> {
    const rewarded = await this.ads.showRewarded('near_miss_revive');
    if (rewarded) {
      // Clear the 3 tallest stacks on the board to free space
      const occupied = this.grid.getOccupiedCells();
      occupied.sort((a, b) => b.stack.size - a.stack.size);
      const toClear = occupied.slice(0, 3);

      for (const cell of toClear) {
        this.cascade.executeHammerSmash(cell);
      }
      this.cameraRig.addTrauma(0.4);
      this.updateHud();
    }
  }

  // --- Victory & Multiplier (Hook 3) ---

  private async handleClaimMultiplierAd(multiplier: number): Promise<void> {
    const rewarded = await this.ads.showRewarded('victory_multiplier');
    const bonusCoins = Math.floor(50 * (rewarded ? multiplier : 1.0));
    this.economy.coins += bonusCoins;
    this.handleNextLevel();
  }

  private handleClaimBaseVictory(): void {
    this.economy.coins += 50;
    this.handleNextLevel();
  }

  private handleNextLevel(): void {
    this.ads.showInterstitial('level_complete');
    this.economy.nextLevel();
    this.loadLevel(this.economy.level);
  }

  private restartLevel(): void {
    this.loadLevel(this.economy.level);
  }

  private updateHud(): void {
    this.hud.updateHeader(
      this.economy.level,
      this.economy.currentClearedCount,
      this.economy.targetQuota,
      this.economy.coins
    );
    this.hud.updateBoosterLabels(this.economy.hammers, this.economy.swaps, this.economy.moves);
  }

  private update(dt: number): void {
    if (this.feverTimer > 0) {
      this.feverTimer = Math.max(0, this.feverTimer - dt);
      if (this.feverTimer === 0) {
        this.feverMeter = 0;
        this.hud.updateFever(0, false);
      }
    } else if (this.feverMeter > 0) {
      this.feverMeter = Math.max(0, this.feverMeter - dt * 0.18);
      if (this.feverMeter < 0.3) {
        this.hud.updateFever(this.feverMeter, false);
      }
    }
    this.cameraRig.update(dt);
    this.cascade.update(dt);
  }

  private render(): void {
    this.renderer.render(this.scene, this.cameraRig.camera);

    if (this.isFirstRender) {
      this.isFirstRender = false;
      PlatformBridge.signalFirstFrameReady();
      PlatformBridge.signalGameReady();
    }
  }
}

// Boot application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  new HexaSortApp();
});
