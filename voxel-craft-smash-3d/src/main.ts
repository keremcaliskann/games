import * as THREE from 'three';
import { CameraRig } from './render/camera-rig';
import { LightingSetup } from './render/lighting';
import { ParticleEffects } from './render/effects';
import { PrefabFactory } from './render/PrefabFactory';
import { SoundController } from './core/audio';
import { GameLoop } from './core/game-loop';
import { InputManager } from './input/input-manager';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { PlatformBridge } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { GAME_CONFIG } from './game/config/game-config';
import { Turret } from './game/entities/turret';
import { VoxelWorld, VoxelBlock } from './game/entities/voxel-world';
import { ProjectileManager } from './game/entities/projectile';
import { GolemEnemy } from './game/entities/golem-enemy';
import { LootCubeManager } from './game/entities/loot-cube';
import { EconomySystem } from './game/systems/economy';

class VoxelSmashApp {
  private readonly appEl: HTMLElement;
  private readonly hudEl: HTMLElement;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly cameraRig: CameraRig;
  private readonly lighting: LightingSetup;
  private readonly particles: ParticleEffects;
  private readonly sound: SoundController;
  private readonly loop: GameLoop;
  private readonly ads: UniversalAdProvider;
  private readonly economy: EconomySystem;
  private readonly input: InputManager;
  private readonly hud: Hud;
  private readonly shell: ShellController;

  // Game World Entities
  private turret!: Turret;
  private voxelWorld!: VoxelWorld;
  private projectiles!: ProjectileManager;
  private lootCubes!: LootCubeManager;
  private golems: GolemEnemy[] = [];

  // Wave & Match State
  private currentWave = 1;
  private currentScore = 0;
  private waveGoldEarned = 0;
  private isWaveRunning = false;
  private hasRevivedThisWave = false;
  private lastTime = 0;

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
    this.lighting = new LightingSetup(this.scene);
    void this.lighting;
    this.particles = new ParticleEffects(this.scene);
    this.sound = new SoundController();
    this.ads = UniversalAdProvider.get();
    this.economy = new EconomySystem();
    this.input = new InputManager(this.appEl, this.cameraRig.camera);
    this.hud = new Hud(this.hudEl);

    this.shell = new ShellController({
      currentGameId: 'voxel-craft-smash-3d',
      onRestart: () => this.startWave(1),
    });
    void this.shell;

    this.loop = new GameLoop((time) => this.onFrame(time));

    this.init();
  }

  private async init(): Promise<void> {
    await PlatformBridge.initPlatform();
    await this.ads.initialize();
    await this.economy.init();

    // First gesture audio unlock
    const unlockAudio = () => {
      this.sound.unlock();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    // Lifecycle
    PlatformBridge.initLifecycle({
      onPause: () => {
        this.isWaveRunning = false;
        this.sound.setMuted(true);
      },
      onResume: () => {
        this.isWaveRunning = true;
        this.sound.setMuted(PlatformBridge.isAudioMuted());
      },
      onAudioEnabledChange: (enabled) => {
        this.sound.setMuted(!enabled);
      },
    });

    window.addEventListener('resize', () => this.onWindowResize());

    // Build World Architecture
    this.buildWorld();

    // Setup 3 Mandatory Rewarded Ad Boosters
    this.setupBoosterHooks();

    // Start Wave 1
    this.startWave(1);

    // Signal Ready
    PlatformBridge.signalFirstFrameReady();
    PlatformBridge.signalGameReady();
    PlatformBridge.gameplayStart();

    this.loop.start();
  }

  private buildWorld(): void {
    // 1. Floating Battle Island Ground
    const island = PrefabFactory.createIsland(GAME_CONFIG.arenaWidth, GAME_CONFIG.arenaDepth);
    this.scene.add(island);

    // 2. Turret at bottom base
    this.turret = new Turret(0, 16);
    this.scene.add(this.turret.group);

    // 3. Voxel World (InstancedMesh)
    this.voxelWorld = new VoxelWorld();
    this.scene.add(this.voxelWorld.group);

    this.voxelWorld.onBlockShattered = (b: VoxelBlock, pos: THREE.Vector3) => {
      this.currentScore += b.config.goldReward * 2;
      this.sound.playVoxelShatter(1.0 + (b.y / 8) * 0.3);
      this.particles.spawnBlockFracture(pos, parseInt(b.config.color.replace('#', '0x'), 16), 8);
      this.lootCubes.spawn(pos, b.config.goldReward, 2);
    };

    this.voxelWorld.onTntDetonated = (pos: THREE.Vector3) => {
      this.sound.playExplosion();
      this.cameraRig.addShake(0.8);
      this.particles.spawnBlockFracture(pos, 0xef4444, 28);
    };

    // 4. Kinetic Projectiles & Loot Vacuum
    this.projectiles = new ProjectileManager(this.scene);
    this.lootCubes = new LootCubeManager(this.scene);
  }

  private startWave(wave: number): void {
    this.currentWave = wave;
    this.waveGoldEarned = 0;
    this.isWaveRunning = true;
    this.hasRevivedThisWave = false;
    this.hud.closeModal();

    this.turret.reset();
    this.projectiles.clearAll();
    this.lootCubes.clearAll();

    // Clear old golems
    for (const g of this.golems) {
      this.scene.remove(g.group);
    }
    this.golems = [];

    // Generate Voxel Fortress
    this.voxelWorld.generateWaveFortress(wave);

    // Spawn Wave Golems
    if (wave >= 2) {
      const count = wave === 2 ? 2 : wave === 3 ? 3 : 5;
      for (let i = 0; i < count; i++) {
        const x = (i - (count - 1) / 2) * 6.5;
        const z = -18 - i * 4;
        const golem = new GolemEnemy(x, z, 10 + wave * 4, 1.8 + wave * 0.2);
        this.scene.add(golem.group);
        this.golems.push(golem);
      }
    }

    this.hud.updateStats(
      this.turret.hp,
      this.turret.maxHp,
      this.currentWave,
      this.economy.coins,
      this.voxelWorld.activeBlockCount
    );
  }

  private setupBoosterHooks(): void {
    this.hud.setBoosterCallbacks({
      // Hook 1A: TNT Mega-Barrage
      onTnt: async () => {
        const success = await this.ads.showRewarded('booster_tnt');
        if (success) {
          this.sound.playExplosion();
          this.cameraRig.addShake(0.9);
          // Drop 5 TNT explosions directly into fortress
          for (let i = 0; i < GAME_CONFIG.tntBarrageCount; i++) {
            const rx = (Math.random() - 0.5) * 8;
            const rz = -12 + (Math.random() - 0.5) * 6;
            this.voxelWorld.triggerTntExplosion(new THREE.Vector3(rx, 2, rz));
          }
        }
      },
      // Hook 1B: Double Cannon (20s)
      onDoubleCannon: async () => {
        const success = await this.ads.showRewarded('booster_cannon');
        if (success) {
          this.turret.doubleCannonTimer = GAME_CONFIG.boosterDoubleCannonSec;
          this.sound.playCannonShot();
        }
      },
      // Hook 1C: Gold Vacuum Magnet
      onMagnet: async () => {
        const success = await this.ads.showRewarded('booster_magnet');
        if (success) {
          this.lootCubes.triggerGlobalVacuum();
          this.golems.forEach((g) => g.freeze(3.0));
          this.sound.playLootCollect();
        }
      },
    });
  }

  private onFrame(time: number): void {
    if (this.lastTime === 0) this.lastTime = time;
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    if (this.isWaveRunning) {
      // 1. Turret Aiming & Auto-Firing
      this.turret.aimAt(this.input.aimPosition);
      this.turret.update(dt);

      if (this.input.isFiring && this.turret.canFire()) {
        const shots = this.turret.fire();
        for (const s of shots) {
          this.projectiles.spawn(s.origin, s.direction, this.turret.doubleCannonTimer > 0);
        }
        this.sound.playCannonShot();
      }

      // 2. Projectile Movement & Collision Check
      this.projectiles.update(dt, (pos, radius) => {
        // Hit check against voxels
        if (this.voxelWorld.checkProjectileHit(pos, radius, 1)) {
          return true;
        }

        // Hit check against golems
        for (const g of this.golems) {
          if (g.isAlive && pos.distanceTo(g.position) < 1.6) {
            const dead = g.takeDamage(1);
            if (this.turret.doubleCannonTimer > 0) {
              g.freeze(3.0);
            }
            this.sound.playVoxelShatter(0.85);
            this.particles.spawnBlockFracture(g.position, 0x475569, 12);
            if (dead) {
              this.currentScore += 150;
              this.lootCubes.spawn(g.position, 25, 4);
              this.sound.playLootCollect();
            }
            return true;
          }
        }

        return false;
      });

      // 3. Advancing Golems
      const targetZ = this.turret.position.z;
      for (const g of this.golems) {
        if (!g.isAlive) continue;
        const reachedBase = g.update(dt, targetZ);
        if (reachedBase) {
          this.turret.takeDamage(25);
          g.takeDamage(999);
          this.sound.playExplosion();
          this.cameraRig.addShake(0.6);

          if (this.turret.hp <= 0) {
            this.handleBaseBreached();
            break;
          }
        }
      }

      // 4. Loot Cubes Vacuum Physics
      this.lootCubes.update(dt, this.turret.position, (gold) => {
        this.economy.addCoins(gold);
        this.waveGoldEarned += gold;
        this.sound.playLootCollect();
      });

      // 5. Check Wave Victory (All blocks & golems destroyed)
      const blocksRemaining = this.voxelWorld.activeBlockCount;
      let golemsRemaining = 0;
      for (let i = 0; i < this.golems.length; i++) {
        if (this.golems[i].isAlive) golemsRemaining++;
      }

      this.hud.updateStats(
        this.turret.hp,
        this.turret.maxHp,
        this.currentWave,
        this.economy.coins,
        blocksRemaining
      );

      if (blocksRemaining === 0 && golemsRemaining === 0) {
        this.handleWaveVictory();
      }
    }

    // Camera & Effects
    this.cameraRig.update(dt);
    this.particles.update(dt);

    this.renderer.render(this.scene, this.cameraRig.camera);
  }

  // Hook 2: Near-Miss Revive Modal
  private handleBaseBreached(): void {
    this.isWaveRunning = false;

    if (!this.hasRevivedThisWave) {
      this.hud.showReviveModal({
        onRevive: async () => {
          const success = await this.ads.showRewarded('near_miss_revive');
          if (success) {
            this.hasRevivedThisWave = true;
            this.turret.hp = this.turret.maxHp;
            // Knock back & damage all golems
            for (const g of this.golems) {
              if (g.isAlive) {
                g.group.position.z -= 14;
                g.takeDamage(4);
              }
            }
            this.sound.playExplosion();
            this.cameraRig.addShake(1.0);
            this.isWaveRunning = true;
          } else {
            this.startWave(this.currentWave);
          }
        },
        onGiveUp: () => {
          this.startWave(1);
        },
      });
    } else {
      this.startWave(1);
    }
  }

  // Hook 3: Wave Victory & Multiplier Bar
  private handleWaveVictory(): void {
    this.isWaveRunning = false;
    this.sound.playWaveComplete();

    const baseReward = GAME_CONFIG.coinsPerWaveBase + this.currentWave * 20;
    this.economy.recordWaveComplete(this.currentWave, this.currentScore);

    this.hud.showVictoryModal(this.currentWave, baseReward, {
      onClaimMultiplier: async (multiplier) => {
        const success = await this.ads.showRewarded('victory_multiplier');
        const total = success ? Math.floor(baseReward * multiplier) : baseReward;
        this.economy.addCoins(total);
        this.advanceNextWave();
      },
      onClaimBase: () => {
        this.economy.addCoins(baseReward);
        this.advanceNextWave();
      },
    });
  }

  private advanceNextWave(): void {
    const nextWave = (this.currentWave % GAME_CONFIG.totalWaves) + 1;
    this.startWave(nextWave);
  }

  private onWindowResize(): void {
    const width = this.appEl.clientWidth || window.innerWidth;
    const height = this.appEl.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
    this.cameraRig.resize(width, height);
  }
}

// Bootstrap
window.addEventListener('DOMContentLoaded', () => {
  new VoxelSmashApp();
});
