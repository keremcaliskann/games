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
import { PrefabFactory } from './render/PrefabFactory';
import { Cannon } from './game/entities/cannon';
import { ProjectileManager, ProjectileType } from './game/entities/projectile';
import { StructureManager } from './game/entities/structure';
import { TargetDummyManager } from './game/entities/target-dummy';
import { EconomySystem } from './game/systems/economy';
import { InputManager } from './input/input-manager';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { LEVELS, LevelDefinition } from './game/levels/level-data';

enum GameState {
  PLAYING,
  LEVEL_WON,
  LEVEL_LOST,
  REVIVE_PROMPT,
}

class CannonBlitzApp {
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
  private readonly input: InputManager;
  private readonly hud: Hud;
  private readonly shell: ShellController;
  private readonly clock: GameClock;

  // Physics & World Entities
  private physics!: PhysicsWorld;
  private cannon!: Cannon;
  private projectiles!: ProjectileManager;
  private structures!: StructureManager;
  private targets!: TargetDummyManager;

  // Level & Match State
  private currentLevelIndex = 0;
  private currentLevel!: LevelDefinition;
  private remainingAmmo = 3;
  private maxAmmo = 3;
  private state: GameState = GameState.PLAYING;
  private activeBooster: ProjectileType | null = null;
  private isFirstFrame = true;
  private shotSettlingTimer = 0;
  private winDelayTimer = 0;

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

    // 3. Environment & Props
    PrefabFactory.createEnvironment(this.scene);

    // 4. UI & Input
    this.hud = new Hud(this.hudEl, {
      onToggleSound: () => {
        const isMuted = this.sound.toggleMute();
        this.hud.updateSound(isMuted);
      },
      onRestart: () => this.startLevel(this.currentLevelIndex),
      onBoosterCluster: () => this.activateBooster('cluster'),
      onBoosterAmmo: () => this.activateAmmoBooster(),
      onBoosterLaser: () => this.activateBooster('megaLaser'),
      onRevive: () => this.handleReviveReward(),
      onGiveUp: () => {
        this.state = GameState.LEVEL_LOST;
        this.hud.showDefeatModal();
      },
      onClaimMultiplied: (mul) => this.handleVictoryMultiplier(mul),
      onNextLevel: () => this.nextLevel(),
    });

    this.input = new InputManager(this.appEl, {
      onAim: (yaw, pitch) => {
        if (this.state === GameState.PLAYING) {
          this.cannon.updateAim(yaw, pitch);
        }
      },
      onFire: () => {
        if (this.state === GameState.PLAYING) {
          this.fireCannon();
        }
      },
    });

    this.shell = new ShellController({
      currentGameId: 'ragdoll-cannon-blitz-3d',
      onRestart: () => this.startLevel(this.currentLevelIndex),
    });
    void this.shell;
    void this.input;
    void this.clock;

    // 5. Game Loop
    this.loop = new GameLoop(
      (dt) => this.fixedUpdate(dt),
      (_alpha, dt) => this.render(dt)
    );

    // Window Resize
    window.addEventListener('resize', () => {
      const w = this.appEl.clientWidth || window.innerWidth;
      const h = this.appEl.clientHeight || window.innerHeight;
      this.renderer.setSize(w, h);
      this.cameraRig.onResize(w / h);
    });

    // Lifecycle Listeners
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
    this.cannon = new Cannon(this.scene);
    this.projectiles = new ProjectileManager(this.scene, this.physics, this.particles, this.sound);
    this.structures = new StructureManager(this.scene, this.physics, this.particles, this.sound, this.cameraRig);
    this.targets = new TargetDummyManager(this.scene, this.physics, this.particles, this.sound);

    // Create Island Static Physics Body
    const islandBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, 0, -4);
    const islandBody = this.physics.world.createRigidBody(islandBodyDesc);
    const islandColliderDesc = RAPIER.ColliderDesc.cylinder(1.7, 16.0)
      .setFriction(0.7)
      .setRestitution(0.2);
    this.physics.world.createCollider(islandColliderDesc, islandBody);

    this.startLevel(0);
    this.loop.start();
  }

  private startLevel(index: number): void {
    this.currentLevelIndex = index % LEVELS.length;
    this.currentLevel = LEVELS[this.currentLevelIndex];

    this.state = GameState.PLAYING;
    this.remainingAmmo = this.currentLevel.parAmmo;
    this.maxAmmo = this.currentLevel.parAmmo;
    this.activeBooster = null;
    this.shotSettlingTimer = 0;
    this.winDelayTimer = 0;

    this.hud.closeModals();
    this.hud.setBoosterActive(null);
    this.hud.updateLevel(this.currentLevelIndex + 1);
    this.hud.updateAmmo(this.remainingAmmo, this.maxAmmo);
    this.hud.updateSound(this.sound.muted);

    // Build Level Blocks & Dummies
    this.projectiles.clearAll();
    this.structures.buildLevel(this.currentLevel.blocks, this.currentLevel.tnt);
    this.targets.buildTargets(this.currentLevel.targets);
    this.hud.updateTargets(this.targets.remainingCount);

    this.cannon.setLaserMode(false);
    this.cannon.updateAim(0, 0.35);

    PlatformBridge.gameReady();
  }

  private fireCannon(): void {
    if (this.remainingAmmo <= 0) return;

    this.hud.hideAimHint();
    this.remainingAmmo--;
    this.hud.updateAmmo(this.remainingAmmo, this.maxAmmo);

    const shotType = this.activeBooster || 'standard';
    this.activeBooster = null;
    this.hud.setBoosterActive(null);
    this.cannon.setLaserMode(false);

    // Visual & Audio
    this.cannon.triggerRecoil();
    this.sound.playCannonFire(shotType === 'megaLaser');

    const launchInfo = this.cannon.getLaunchInfo();
    this.particles.spawnSmoke(launchInfo.origin);
    this.cameraRig.addTrauma(shotType === 'megaLaser' ? 0.35 : 0.18);

    // Spawn Projectile
    this.projectiles.spawnBall(launchInfo.origin, launchInfo.velocity, shotType);
  }

  // --- Booster 1: Cluster Bomb & Mega Laser ---
  private async activateBooster(type: ProjectileType): Promise<void> {
    const placement = type === 'cluster' ? 'booster_cluster' : 'booster_laser';
    const rewardGranted = await this.ads.showRewarded(placement);
    if (rewardGranted) {
      this.activeBooster = type;
      this.hud.setBoosterActive(type === 'cluster' ? 'cluster' : 'laser');
      if (type === 'megaLaser') {
        this.cannon.setLaserMode(true);
      }
      this.sound.playClick();
    }
  }

  // --- Booster 2: +3 Ammo Booster ---
  private async activateAmmoBooster(): Promise<void> {
    const rewardGranted = await this.ads.showRewarded('booster_ammo');
    if (rewardGranted) {
      this.remainingAmmo += 3;
      this.maxAmmo = Math.max(this.maxAmmo, this.remainingAmmo);
      this.hud.updateAmmo(this.remainingAmmo, this.maxAmmo);
      this.sound.playClick();
    }
  }

  // --- Rewarded Ad Hook: Revive ---
  private async handleReviveReward(): Promise<void> {
    const rewarded = await this.ads.showRewarded('revive');
    if (rewarded) {
      this.remainingAmmo = 2;
      this.maxAmmo = Math.max(this.maxAmmo, 2);
      this.hud.updateAmmo(this.remainingAmmo, this.maxAmmo);
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
    const baseCoins = 50;
    const finalCoins = rewarded ? Math.round(baseCoins * multiplier) : baseCoins;
    this.economy.addCoins(finalCoins);
    this.nextLevel();
  }

  private nextLevel(): void {
    this.economy.recordLevelCompleted(this.currentLevelIndex + 1);
    this.startLevel(this.currentLevelIndex + 1);
  }

  private fixedUpdate(dt: number): void {
    if (this.state === GameState.REVIVE_PROMPT) return;

    // Step Rapier Physics
    this.physics.step((h1, h2) => {
      const meta1 = this.physics.getMeta(h1);
      const meta2 = this.physics.getMeta(h2);

      // Check TNT explosion impacts
      if (meta1?.type === 'tnt') this.structures.triggerTntByHandle(h1);
      if (meta2?.type === 'tnt') this.structures.triggerTntByHandle(h2);

      // Clatter sound for wooden/stone collisions
      if (meta1?.type === 'structure' || meta2?.type === 'structure') {
        this.sound.playWoodImpact();
      }
    });

    this.structures.update(dt);
    this.targets.update(dt, (remaining) => {
      this.hud.updateTargets(remaining);
    });
    this.projectiles.update(dt);

    // Check Victory
    if (this.targets.remainingCount === 0 && this.state === GameState.PLAYING) {
      this.winDelayTimer += dt;
      if (this.winDelayTimer >= 1.2) {
        this.state = GameState.LEVEL_WON;
        this.sound.playVictory();
        this.hud.showVictoryModal(50);
      }
      return;
    }

    // Check Out of Ammo
    if (
      this.remainingAmmo === 0 &&
      this.projectiles.activeCount === 0 &&
      this.targets.remainingCount > 0 &&
      this.state === GameState.PLAYING
    ) {
      this.shotSettlingTimer += dt;
      if (this.shotSettlingTimer >= 2.0) {
        // Trigger Near-Miss Revive Modal if targets still stand
        this.state = GameState.REVIVE_PROMPT;
        this.hud.showReviveModal();
      }
    } else {
      this.shotSettlingTimer = 0;
    }
  }

  private render(dt: number): void {
    this.cannon.update(dt);
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
  const app = new CannonBlitzApp();
  void app.bootstrap();
});
