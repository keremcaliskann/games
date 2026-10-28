import * as THREE from 'three';
import { PlatformBridge, CloudSaveData } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { LightingSetup } from './render/lighting';
import { CameraRig } from './render/camera-rig';
import { ParticleEffects } from './render/effects';
import { SoundController } from './core/audio';
import { ArenaManager } from './game/systems/arena-manager';
import { InputManager } from './input/input-manager';
import { HudController } from './ui/hud';
import { ShellController } from './ui/shell-controller';

export class BumperSmashApp {
  private readonly appEl: HTMLElement;
  private readonly scene: THREE.Scene;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly cameraRig: CameraRig;
  private readonly lighting: LightingSetup;
  private readonly particles: ParticleEffects;
  private readonly audio: SoundController;
  private readonly ads: UniversalAdProvider;
  private readonly arena: ArenaManager;
  private readonly input: InputManager;
  private readonly hud: HudController;
  private readonly shell: ShellController;

  private saveState: CloudSaveData = {
    coins: 120,
    highestLevel: 1,
    stars: 0,
  };
  private isPaused = false;
  private isFirstFrame = true;
  private lastTimeMs = 0;

  constructor() {
    this.appEl = document.getElementById('app')!;
    PlatformBridge.applyDualModeShell();

    this.scene = new THREE.Scene();
    const width = this.appEl.clientWidth || window.innerWidth;
    const height = this.appEl.clientHeight || window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.appEl.appendChild(this.renderer.domElement);

    this.cameraRig = new CameraRig(width / height);
    this.lighting = new LightingSetup(this.scene);
    void this.lighting;
    this.particles = new ParticleEffects(this.scene);
    this.audio = new SoundController();
    this.ads = UniversalAdProvider.get();
    void this.ads.initialize();

    this.arena = new ArenaManager(
      this.scene,
      this.particles,
      this.audio,
      this.cameraRig,
      {
        onHudUpdate: () => this.syncHud(),
        onCallout: (text, colorHex) => this.hud.showFloatingCallout(text, colorHex),
        onMatchVictory: (earnedCoins, knockouts) => {
          this.input.setEnabled(false);
          this.audio.playVictory();
          this.hud.showVictoryModal(this.arena.arenaNumber, earnedCoins, knockouts);
        },
        onPlayerKnockedOut: (rank, aliveRivals) => {
          this.input.setEnabled(false);
          this.audio.playDefeat();
          this.hud.showNearMissReviveModal(rank, aliveRivals);
        },
      }
    );

    this.input = new InputManager(this.appEl);

    this.hud = new HudController(this.ads, {
      onRestart: () => {
        this.input.setEnabled(true);
        this.arena.startMatch(this.arena.arenaNumber);
      },
      onToggleSound: () => this.audio.toggleUserMute(),
      onActivateBooster: (type) => {
        this.arena.activateBooster(type);
      },
      onReviveAccepted: () => {
        this.arena.revivePlayerWithShockwave();
        this.input.setEnabled(true);
      },
      onReviveDeclined: () => {
        this.input.setEnabled(true);
        this.arena.startMatch(this.arena.arenaNumber);
      },
      onNextArena: (totalCoinsAwarded) => {
        this.saveState.coins += totalCoinsAwarded;
        this.saveState.highestLevel = Math.max(
          this.saveState.highestLevel,
          this.arena.arenaNumber + 1
        );
        this.saveState.stars += 3;
        void PlatformBridge.saveData(this.saveState);
        PlatformBridge.sendScore(this.saveState.highestLevel * 150 + this.saveState.coins);
        this.input.setEnabled(true);
        this.arena.startMatch(this.arena.arenaNumber + 1);
      },
    });

    this.shell = new ShellController({
      currentGameId: 'bumper-smash-io-3d',
      onRestart: () => {
        this.hud.closeModal();
        this.input.setEnabled(true);
        this.arena.startMatch(this.arena.arenaNumber);
      },
      onResize: (w, h) => this.handleResize(w, h),
    });
    void this.shell;

    window.addEventListener('resize', () => {
      const w = this.appEl.clientWidth || window.innerWidth;
      const h = this.appEl.clientHeight || window.innerHeight;
      this.handleResize(w, h);
    });

    void this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    await PlatformBridge.initPlatform();
    PlatformBridge.initLifecycle({
      onPause: () => {
        this.isPaused = true;
      },
      onResume: () => {
        this.isPaused = false;
        this.lastTimeMs = performance.now();
      },
      onAudioEnabledChange: (enabled) => {
        this.audio.setPlatformMuted(!enabled);
      },
    });

    this.saveState = await PlatformBridge.loadData(this.saveState);
    this.arena.startMatch(this.saveState.highestLevel);

    this.lastTimeMs = performance.now();
    requestAnimationFrame((now) => this.animate(now));
  }

  private handleResize(w: number, h: number): void {
    if (w <= 0 || h <= 0) return;
    this.renderer.setSize(w, h);
    this.cameraRig.resize(w / h);
  }

  private syncHud(): void {
    const p = this.arena.player;
    this.hud.syncStats({
      arenaNum: this.arena.arenaNumber,
      timeRemaining: this.arena.timeRemaining,
      coins: this.saveState.coins,
      aliveCount: this.arena.aliveKartCount,
      totalCount: this.arena.karts.length,
      knockouts: p ? p.knockouts : 0,
      karts: this.arena.karts,
      nitroActive: p ? p.nitroTimer > 0 : false,
      vortexActive: p ? p.vortexTimer > 0 : false,
      spikesActive: p ? p.spikeTimer > 0 : false,
    });
  }

  private animate(nowMs: number): void {
    requestAnimationFrame((t) => this.animate(t));
    const rawDt = (nowMs - this.lastTimeMs) * 0.001;
    this.lastTimeMs = nowMs;
    const dt = Math.min(0.05, Math.max(0.001, rawDt));

    if (!this.isPaused) {
      this.arena.update(
        dt,
        this.input.steer.active,
        this.input.steer.dx,
        this.input.steer.dz
      );
      this.particles.update(dt);
      const p = this.arena.player;
      this.cameraRig.update(
        dt,
        p ? p.pos.x : 0,
        p ? p.pos.z : 0,
        p ? p.scale : 1.0
      );
    }

    this.renderer.render(this.scene, this.cameraRig.camera);

    if (this.isFirstFrame) {
      this.isFirstFrame = false;
      PlatformBridge.firstFrameReady();
      PlatformBridge.gameReady();
    }
  }
}

new BumperSmashApp();
