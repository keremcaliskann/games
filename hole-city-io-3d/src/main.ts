import * as THREE from 'three';
import { CameraRig } from './render/camera-rig';
import { LightingSetup } from './render/lighting';
import { ParticleBurstEffect } from './render/effects';
import { SoundController } from './core/audio';
import { GameLoop } from './core/game-loop';
import { InputManager } from './input/input-manager';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { PlatformBridge } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { GAME_CONFIG } from './game/config/game-config';
import { Hole } from './game/entities/hole';
import { CityArena } from './game/entities/city-arena';
import { Prop } from './game/entities/prop';
import { PrefabFactory } from './render/PrefabFactory';
import { BotAISystem } from './game/systems/bot-ai';
import { LeaderboardSystem } from './game/systems/leaderboard';
import { EconomySystem } from './game/systems/economy';

class HoleCityApp {
  private readonly appEl: HTMLElement;
  private readonly hudEl: HTMLElement;

  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly cameraRig: CameraRig;
  private readonly lighting: LightingSetup;
  private readonly particles: ParticleBurstEffect;
  private readonly sound: SoundController;
  private readonly loop: GameLoop;
  private readonly ads: UniversalAdProvider;
  private readonly economy: EconomySystem;
  private readonly input: InputManager;
  private readonly hud: Hud;
  private readonly shell: ShellController;

  private arena!: CityArena;
  private playerHole!: Hole;
  private bots: Hole[] = [];
  private props: Prop[] = [];
  private readonly allHolesBuffer: Hole[] = [];
  private botAi = new BotAISystem();
  private leaderboard = new LeaderboardSystem();

  // Match State
  private matchTimeRemaining = GAME_CONFIG.matchDurationSec;
  private isMatchRunning = false;
  private hasRevivedThisMatch = false;
  private baseCoinsEarned = 0;
  private lastTime = 0;

  constructor() {
    this.appEl = document.getElementById('app')!;
    this.hudEl = document.getElementById('hud')!;

    // 1. Dual-Mode Shell & Platform Setup
    PlatformBridge.applyDualModeShell();

    // 2. Three.js Scene & Renderer Setup
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
    this.particles = new ParticleBurstEffect(this.scene);
    this.sound = new SoundController();
    this.ads = UniversalAdProvider.get();
    this.economy = new EconomySystem();
    this.input = new InputManager(this.appEl);
    this.hud = new Hud(this.hudEl);

    this.shell = new ShellController({
      currentGameId: 'hole-city-io-3d',
      onRestart: () => this.startNewMatch(),
    });
    void this.shell;

    this.loop = new GameLoop((time) => this.onFrame(time));

    this.init();
  }

  private async init(): Promise<void> {
    await PlatformBridge.initPlatform();
    await this.ads.initialize();
    await this.economy.init();

    // Audio unlocking on first gesture
    const unlockAudio = () => {
      this.sound.unlock();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);

    // Lifecycle bindings
    PlatformBridge.initLifecycle({
      onPause: () => {
        this.isMatchRunning = false;
        this.sound.setMuted(true);
      },
      onResume: () => {
        this.isMatchRunning = true;
        this.sound.setMuted(PlatformBridge.isAudioMuted());
      },
      onAudioEnabledChange: (enabled) => {
        this.sound.setMuted(!enabled);
      },
    });

    window.addEventListener('resize', () => this.onWindowResize());

    // Build City & Props
    this.buildCityWorld();

    // Setup Hud Callbacks for 3 Mandatory Rewarded Ad Hooks
    this.setupHudBoosters();

    // Start First Match
    this.startNewMatch();

    // Signal Ready to Platforms
    PlatformBridge.signalFirstFrameReady();
    PlatformBridge.signalGameReady();
    PlatformBridge.gameplayStart();

    this.loop.start();
  }

  private buildCityWorld(): void {
    // 1. Foundational Arena Ground & Roads
    this.arena = new CityArena();
    this.scene.add(this.arena.group);

    // 2. Player Hole
    const defaultSkin = GAME_CONFIG.skins[0];
    this.playerHole = new Hole('player', 'You', true, defaultSkin.color, defaultSkin.ringColor);
    this.scene.add(this.playerHole.group);

    // 3. AI Rival Holes (7 Bots)
    this.bots = GAME_CONFIG.bots.map((cfg) => {
      const bot = new Hole(cfg.id, cfg.name, false, cfg.color, cfg.ringColor);
      this.scene.add(bot.group);
      return bot;
    });

    // 4. Generate ~350 Interactive City Props across all 5 Tiers
    this.spawnCityProps();

    this.leaderboard.setHoles([this.playerHole, ...this.bots]);
    this.botAi.setEntities(this.bots, this.playerHole, this.props);
  }

  private spawnCityProps(): void {
    const size = GAME_CONFIG.arenaSize;
    const half = size / 2 - 8;

    // Helper random in range
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    // Quadrant Prop Spawner
    for (let i = 0; i < 110; i++) {
      // Tier 1: Traffic Cones & Hydrants
      const cone = new Prop(PrefabFactory.createTrafficCone(), rand(-half, half), rand(-half, half));
      this.scene.add(cone.group);
      this.props.push(cone);

      const hydrant = new Prop(PrefabFactory.createFireHydrant(), rand(-half, half), rand(-half, half));
      this.scene.add(hydrant.group);
      this.props.push(hydrant);
    }

    // Tier 2: Park Trees, Lamps, Sedans
    for (let i = 0; i < 70; i++) {
      const tree = new Prop(PrefabFactory.createParkTree(), rand(-half, half), rand(-half, half));
      this.scene.add(tree.group);
      this.props.push(tree);

      const lamp = new Prop(PrefabFactory.createStreetLamp(), rand(-half, half), rand(-half, half), Math.PI * 0.5);
      this.scene.add(lamp.group);
      this.props.push(lamp);

      const car = new Prop(PrefabFactory.createSedanCar(i % 3), rand(-half + 4, half - 4), rand(-half + 4, half - 4), rand(0, Math.PI));
      this.scene.add(car.group);
      this.props.push(car);
    }

    // Tier 3: Buses & Delivery Vans
    for (let i = 0; i < 24; i++) {
      const bus = new Prop(PrefabFactory.createCityBus(), rand(-half + 8, half - 8), rand(-half + 8, half - 8), (i % 2) * Math.PI * 0.5);
      this.scene.add(bus.group);
      this.props.push(bus);
    }

    // Tier 4: Townhouses & Shops
    for (let i = 0; i < 20; i++) {
      const house = new Prop(PrefabFactory.createTownhouse(i % 3), rand(-half + 12, half - 12), rand(-half + 12, half - 12));
      this.scene.add(house.group);
      this.props.push(house);
    }

    // Tier 5: Modern Skyscrapers (City Landmarks)
    const skyscraperLocs = [
      [-36, -36], [36, -36], [-36, 36], [36, 36],
      [-18, -18], [18, 18], [-18, 18], [18, -18],
    ];

    skyscraperLocs.forEach(([x, z]) => {
      const skyscraper = new Prop(PrefabFactory.createSkyscraper(), x, z);
      this.scene.add(skyscraper.group);
      this.props.push(skyscraper);
    });
  }

  private startNewMatch(): void {
    this.matchTimeRemaining = GAME_CONFIG.matchDurationSec;
    this.isMatchRunning = true;
    this.hasRevivedThisMatch = false;
    this.hud.closeModal();

    // Reset Player to center
    this.playerHole.reset(0, 0);

    // Reset Bots to dispersed circle around arena
    const count = this.bots.length;
    this.bots.forEach((bot, index) => {
      const angle = (index / count) * Math.PI * 2;
      const dist = 32 + (index % 2) * 14;
      bot.reset(Math.cos(angle) * dist, Math.sin(angle) * dist);
    });

    // Reset all props to their initial city coordinates
    for (let i = 0; i < this.props.length; i++) {
      this.props[i].reset();
    }

    this.hud.updateTimer(this.matchTimeRemaining);
    this.hud.updateScore(0);
  }

  private setupHudBoosters(): void {
    this.hud.setBoosterCallbacks({
      // Hook 1A: Mega Magnet
      onMagnet: async () => {
        const success = await this.ads.showRewarded('booster_magnet');
        if (success) {
          this.playerHole.activateMagnet();
          this.sound.playBooster();
          this.particles.spawnBurst(this.playerHole.position, 0x06b6d4, 18);
        }
      },
      // Hook 1B: Speed Turbo
      onTurbo: async () => {
        const success = await this.ads.showRewarded('booster_turbo');
        if (success) {
          this.playerHole.activateTurbo();
          this.sound.playBooster();
          this.particles.spawnBurst(this.playerHole.position, 0xf59e0b, 18);
        }
      },
      // Hook 1C: Size Surge (+25% radius)
      onSize: async () => {
        const success = await this.ads.showRewarded('booster_size');
        if (success) {
          this.playerHole.activateSizeSurge();
          this.sound.playGrow();
          this.particles.spawnBurst(this.playerHole.position, 0xa855f7, 24);
        }
      },
    });
  }

  private onFrame(time: number): void {
    if (this.lastTime === 0) this.lastTime = time;
    const dt = Math.min((time - this.lastTime) / 1000, 0.1);
    this.lastTime = time;

    if (this.isMatchRunning) {
      // 1. Tick match clock
      this.matchTimeRemaining -= dt;
      if (this.matchTimeRemaining <= 0) {
        this.matchTimeRemaining = 0;
        this.handleMatchComplete();
      }
      this.hud.updateTimer(this.matchTimeRemaining);

      // Mega-Tornado Hazard during final 30s
      if (this.matchTimeRemaining <= 30.0) {
        this.arena.activateTornado();
        this.hud.showTornadoAlert(true);
        this.arena.updateTornado(dt);
      } else {
        this.hud.showTornadoAlert(false);
      }

      // 2. Player Input & Movement
      const move = this.input.getMoveVector();
      this.playerHole.setMoveDirection(move.x, move.z);
      this.playerHole.update(dt);

      // 3. AI Bots Steering & Updates
      this.botAi.update(dt, time / 1000);

      // 4. Props Suction Physics
      this.updateSuctionPhysics(dt);

      // 5. Hole-on-Hole Collisions
      this.updateHoleCollisions();

      // 6. Update Leaderboard
      const rankings = this.leaderboard.getRankings();
      this.hud.updateLeaderboard(rankings);
      this.hud.updateScore(this.playerHole.score);
    }

    // Camera & Effects update
    this.cameraRig.update(this.playerHole.position, this.playerHole.radius, dt);
    this.lighting.update(this.playerHole.position);
    this.particles.update(dt);

    this.renderer.render(this.scene, this.cameraRig.camera);
  }

  private updateSuctionPhysics(dt: number): void {
    this.allHolesBuffer.length = 0;
    if (this.playerHole.isAlive) this.allHolesBuffer.push(this.playerHole);
    for (let i = 0; i < this.bots.length; i++) {
      if (this.bots[i].isAlive) this.allHolesBuffer.push(this.bots[i]);
    }
    const allHoles = this.allHolesBuffer;

    for (const prop of this.props) {
      if (prop.state === 'swallowing') {
        prop.update(dt);
        continue;
      }
      if (prop.state === 'consumed') continue;

      const propPos = prop.position;

      // Check all holes for suction
      for (const hole of allHoles) {
        let suctionRadius = hole.radius;
        // Magnet booster extends player suction radius
        if (hole.isPlayer && hole.magnetTimer > 0) {
          suctionRadius *= GAME_CONFIG.magnetRangeMultiplier;
        }

        const dist = Math.hypot(propPos.x - hole.position.x, propPos.z - hole.position.z);

        if (dist <= suctionRadius && hole.canSwallowProp(prop.radius)) {
          prop.startSwallow(hole.position, () => {
            hole.addScore(prop.points, prop.radius * 0.02);

            if (hole.isPlayer) {
              if (prop.tier === 1) this.sound.playPop();
              else if (prop.tier <= 3) this.sound.playCrunch();
              else this.sound.playRumble();

              this.particles.spawnBurst(hole.position, 0x38bdf8, 8 + prop.tier * 3);
            }
          });
          break;
        }
      }
    }
  }

  private updateHoleCollisions(): void {
    this.allHolesBuffer.length = 0;
    if (this.playerHole.isAlive) this.allHolesBuffer.push(this.playerHole);
    for (let i = 0; i < this.bots.length; i++) {
      if (this.bots[i].isAlive) this.allHolesBuffer.push(this.bots[i]);
    }
    const allHoles = this.allHolesBuffer;

    for (let i = 0; i < allHoles.length; i++) {
      const a = allHoles[i];
      if (!a.isAlive) continue;

      for (let j = i + 1; j < allHoles.length; j++) {
        const b = allHoles[j];
        if (!b.isAlive) continue;

        const dist = a.position.distanceTo(b.position);
        const minDist = Math.max(a.radius, b.radius);

        if (dist < minDist * 0.85) {
          // A swallows B?
          if (a.canSwallowHole(b)) {
            this.eliminateHole(a, b);
          } else if (b.canSwallowHole(a)) {
            this.eliminateHole(b, a);
          }
        }
      }
    }
  }

  private eliminateHole(predator: Hole, prey: Hole): void {
    prey.isAlive = false;
    prey.group.visible = false;
    predator.kills++;
    predator.addScore(250, 0.45);

    predator.showTaunt('😈 NOM NOM!');
    prey.showTaunt('😱 NOOO!');

    this.particles.spawnBurst(prey.position, 0xec4899, 32);

    if (predator.isPlayer) {
      this.sound.playEliminate();
    }

    // Hook 2: Near-Miss Revive Modal if Player was eaten
    if (prey.isPlayer && !this.hasRevivedThisMatch) {
      this.isMatchRunning = false;
      this.hud.showReviveModal({
        onRevive: async () => {
          const success = await this.ads.showRewarded('near_miss_revive');
          if (success) {
            this.hasRevivedThisMatch = true;
            this.playerHole.isAlive = true;
            this.playerHole.group.visible = true;
            this.playerHole.activateShield(5.0);
            this.playerHole.addScore(150, 0.35);
            this.matchTimeRemaining += GAME_CONFIG.reviveOvertimeSec;
            this.isMatchRunning = true;
            this.sound.playGrow();
            this.particles.spawnBurst(this.playerHole.position, 0x10b981, 28);
          } else {
            this.handleMatchComplete();
          }
        },
        onGiveUp: () => {
          this.handleMatchComplete();
        },
      });
    }
  }

  private handleMatchComplete(): void {
    this.isMatchRunning = false;
    PlatformBridge.gameplayStop();

    const rank = this.leaderboard.getPlayerRank();
    this.baseCoinsEarned = this.economy.recordMatchResult(this.playerHole.score, rank);

    // If near miss (Rank 2 or 3) and hasn't revived yet, offer revive overtime
    if ((rank === 2 || rank === 3) && !this.hasRevivedThisMatch) {
      this.hud.showReviveModal({
        onRevive: async () => {
          const success = await this.ads.showRewarded('near_miss_revive');
          if (success) {
            this.hasRevivedThisMatch = true;
            this.matchTimeRemaining += GAME_CONFIG.reviveOvertimeSec;
            this.isMatchRunning = true;
            this.playerHole.activateShield(4.0);
            this.sound.playBooster();
          } else {
            this.showVictoryPodium(rank);
          }
        },
        onGiveUp: () => {
          this.showVictoryPodium(rank);
        },
      });
    } else {
      this.showVictoryPodium(rank);
    }
  }

  // Hook 3: Victory Multiplier Screen
  private showVictoryPodium(rank: number): void {
    if (rank === 1) this.sound.playVictory();

    this.hud.showVictoryModal(rank, this.playerHole.score, this.baseCoinsEarned, {
      onClaimMultiplier: async (multiplier) => {
        const success = await this.ads.showRewarded('victory_multiplier');
        if (success) {
          const bonus = Math.floor(this.baseCoinsEarned * (multiplier - 1));
          this.economy.addCoins(bonus);
        }
        this.startNewMatch();
      },
      onClaimBase: () => {
        this.startNewMatch();
      },
    });
  }

  private onWindowResize(): void {
    const width = this.appEl.clientWidth || window.innerWidth;
    const height = this.appEl.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
    this.cameraRig.resize(width, height);
  }
}

// Bootstrap application on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  new HoleCityApp();
});
