import * as THREE from 'three';
import { CameraRig } from './render/camera-rig';
import { LightingSetup } from './render/lighting';
import { ParticleEffects } from './render/effects';
import { SoundController } from './core/audio';
import { GameLoop } from './core/game-loop';
import { GameClock } from './core/clock';
import { EventBus } from './core/events';
import { UniversalAdProvider } from './platform/ads';
import { PlatformBridge } from './platform/sdk';
import { EconomySystem } from './game/systems/economy';
import { ParkingLot } from './game/entities/parking-lot';
import { BusManager } from './game/systems/bus-manager';
import { InputManager } from './input/input-manager';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { GAME_CONFIG } from './game/config/game-config';

export class GameApp {
  private readonly appEl: HTMLElement;
  private readonly hudEl: HTMLElement;

  private readonly scene: THREE.Scene;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly cameraRig: CameraRig;
  private readonly lighting: LightingSetup;
  private readonly particles: ParticleEffects;
  private readonly sound: SoundController;
  private readonly loop: GameLoop;
  private readonly clock: GameClock;
  private readonly events: EventBus;
  private readonly ads: UniversalAdProvider;
  private readonly economy: EconomySystem;

  private readonly lot: ParkingLot;
  private readonly busManager: BusManager;
  private input!: InputManager;
  private hud!: Hud;
  private shell!: ShellController;

  private currentLevel = 1;
  private isFirstFrame = true;

  constructor() {
    this.appEl = document.getElementById('app')!;
    this.hudEl = document.getElementById('hud')!;

    // 1. Dual-Mode Shell setup
    PlatformBridge.applyDualModeShell();

    // 2. Three.js Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(GAME_CONFIG.visuals.skyColor);

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
    this.lighting = new LightingSetup(this.scene);
    this.particles = new ParticleEffects(this.scene);
    this.sound = new SoundController();
    this.events = new EventBus();
    this.ads = UniversalAdProvider.get();
    this.economy = new EconomySystem();
    this.clock = new GameClock();

    // 3. Game Systems
    this.lot = new ParkingLot(this.scene);
    this.busManager = new BusManager(
      this.lot,
      this.sound,
      this.particles,
      this.cameraRig,
      this.events
    );

    // Suppress unused member warnings
    void this.lighting;
    void this.clock;

    // 4. UI & Input
    this.setupUI();
    this.setupInput();
    this.setupEventWiring();
    this.initPlatformLifecycle();

    // 5. Game Loop
    this.loop = new GameLoop((dt) => this.tick(dt));
    this.loop.start();

    // 6. Bootstrap
    void this.bootstrap();
  }

  private setupUI(): void {
    this.hud = new Hud(this.hudEl, {
      onToggleSound: () => {
        const muted = this.sound.toggleMute();
        this.hud.updateSound(muted);
      },
      onRestart: () => this.startLevel(this.currentLevel),
      onBoosterHelo: () => this.handleBoosterHelo(),
      onBoosterVip: () => this.handleBoosterVip(),
      onBoosterShuffle: () => this.handleBoosterShuffle(),
      onRevive: () => this.handleRevive(),
      onGiveUp: () => this.startLevel(this.currentLevel),
      onClaimMultiplied: (mul) => this.handleClaimMultiplied(mul),
      onNextLevel: () => this.nextLevel(),
    });

    this.shell = new ShellController({
      currentGameId: 'bus-escape-jam-3d',
      onRestart: () => this.startLevel(this.currentLevel),
    });
    void this.shell;
  }

  private setupInput(): void {
    this.input = new InputManager(this.appEl, this.cameraRig.camera, (bus) => {
      this.busManager.handleTapBus(bus);
    });

    this.appEl.addEventListener('pointerup', () => {
      this.input.checkBusRaycast(this.busManager.buses);
    });

    window.addEventListener('resize', () => {
      const w = this.appEl.clientWidth || window.innerWidth;
      const h = this.appEl.clientHeight || window.innerHeight;
      this.renderer.setSize(w, h);
      this.cameraRig.onResize(w / h);
    });
  }

  private setupEventWiring(): void {
    this.events.on('bus:departed', (data: { coinsEarned: number }) => {
      this.economy.addCoins(data.coinsEarned);
      this.hud.updateCoins(this.economy.coins);
    });

    this.events.on('level:jammed', () => {
      this.hud.showReviveModal();
    });

    this.events.on('level:victory', (data: { coinsEarned: number }) => {
      PlatformBridge.sendScore(this.currentLevel * 100);
      this.hud.showVictoryModal(data.coinsEarned);
    });
  }

  private initPlatformLifecycle(): void {
    PlatformBridge.initLifecycle({
      onPause: () => this.loop.stop(),
      onResume: () => this.loop.start(),
      onAudioEnabledChange: (enabled) => this.hud.updateSound(!enabled),
    });
  }

  private async bootstrap(): Promise<void> {
    await PlatformBridge.initPlatform();
    await this.ads.initialize();
    await this.economy.init();

    this.currentLevel = this.economy.highestLevel;
    this.startLevel(this.currentLevel);
  }

  private startLevel(levelNum: number): void {
    this.currentLevel = levelNum;
    this.hud.closeModals();
    this.hud.updateLevel(this.currentLevel);
    this.hud.updateCoins(this.economy.coins);
    this.hud.updateSound(this.sound.muted);

    this.busManager.loadLevel(levelNum);
    PlatformBridge.gameReady();
  }

  private nextLevel(): void {
    this.currentLevel++;
    this.economy.recordLevelCompleted(this.currentLevel);
    this.startLevel(this.currentLevel);
  }

  // --- Booster 1: Helicopter Lift ---
  private async handleBoosterHelo(): Promise<void> {
    const granted = await this.ads.showRewarded('booster_helo');
    if (granted) {
      this.busManager.extractBusWithHelo();
    }
  }

  // --- Booster 2: VIP Bay ---
  private async handleBoosterVip(): Promise<void> {
    const granted = await this.ads.showRewarded('booster_vip');
    if (granted) {
      this.lot.unlockVipBay();
      this.sound.playClick();
      this.busManager.processBoarding();
    }
  }

  // --- Booster 3: Shuffle Queue ---
  private async handleBoosterShuffle(): Promise<void> {
    const granted = await this.ads.showRewarded('booster_shuffle');
    if (granted) {
      this.busManager.shufflePassengers();
    }
  }

  // --- Revive Hook ---
  private async handleRevive(): Promise<void> {
    const granted = await this.ads.showRewarded('revive');
    if (granted) {
      this.lot.unlockVipBay();
      this.busManager.shufflePassengers();
    } else {
      this.startLevel(this.currentLevel);
    }
  }

  // --- Victory Multiplier Hook ---
  private async handleClaimMultiplied(multiplier: number): Promise<void> {
    const granted = await this.ads.showRewarded('victory_multiplier');
    const baseCoins = GAME_CONFIG.economy.coinsPerLevel;
    const finalCoins = granted ? Math.round(baseCoins * multiplier) : baseCoins;
    this.economy.addCoins(finalCoins);
    this.hud.updateCoins(this.economy.coins);
    this.nextLevel();
  }

  private tick(dt: number): void {
    this.busManager.update(dt);
    this.cameraRig.update(dt);
    this.particles.update(dt);

    this.renderer.render(this.scene, this.cameraRig.camera);

    if (this.isFirstFrame) {
      this.isFirstFrame = false;
      PlatformBridge.firstFrameReady();
    }
  }
}

// Instantiate
new GameApp();
