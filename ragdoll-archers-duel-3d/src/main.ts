import * as THREE from 'three';
import { PlatformBridge, CloudSaveData } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { DaylightLighting } from './render/lighting';
import { CameraRig } from './render/camera-rig';
import { ParticleEffects } from './render/effects';
import { SoundController } from './core/audio';
import { DuelManager } from './game/systems/duel-manager';
import { InputManager } from './input/input-manager';
import { HudController } from './ui/hud';
import { ShellController } from './ui/shell-controller';

export class ArcherDuelApp {
  private readonly appEl: HTMLElement;
  private readonly scene: THREE.Scene;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly cameraRig: CameraRig;
  private readonly lighting: DaylightLighting;
  private readonly particles: ParticleEffects;
  private readonly audio: SoundController;
  private readonly ads: UniversalAdProvider;
  private readonly duel: DuelManager;
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
    this.lighting = new DaylightLighting(this.scene);
    this.particles = new ParticleEffects(this.scene);
    this.audio = new SoundController();
    this.ads = UniversalAdProvider.get();
    void this.ads.initialize();

    this.duel = new DuelManager(
      this.scene,
      this.particles,
      this.audio,
      this.cameraRig,
      {
        onHudUpdate: () => this.syncHud(),
        onWaveVictory: (earnedCoins, headshots) => {
          this.input.setEnabled(false);
          this.audio.playVictory();
          this.hud.showVictoryModal(this.duel.currentWave, earnedCoins, headshots);
        },
        onPlayerDefeated: () => {
          this.input.setEnabled(false);
          this.audio.playDefeat();
          this.hud.showNearMissReviveModal(this.duel.aliveEnemyCount);
        },
        onCallout: (text, colorHex) => {
          this.hud.showFloatingCallout(text, colorHex);
        },
      }
    );

    this.input = new InputManager(
      this.appEl,
      () => this.audio.playBowDraw(),
      (angleRad, power01) => this.duel.firePlayerBow(angleRad, power01)
    );

    this.hud = new HudController(this.ads, {
      onRestart: () => {
        this.input.setEnabled(true);
        this.duel.startWave(this.duel.currentWave);
      },
      onToggleSound: () => this.audio.toggleUserMute(),
      onActivateBooster: (type) => {
        if (type === 'triple') {
          this.duel.tripleShotArmed = true;
        } else if (type === 'pierce') {
          this.duel.laserShotArmed = true;
        } else if (type === 'shield' && this.duel.player) {
          this.duel.player.setShieldCharges(2);
        }
        this.audio.playShieldBlock();
        this.syncHud();
      },
      onReviveAccepted: () => {
        this.duel.revivePlayerWithBonus();
        this.input.setEnabled(true);
      },
      onReviveDeclined: () => {
        this.input.setEnabled(true);
        this.duel.startWave(this.duel.currentWave);
      },
      onNextWave: (totalCoinsAwarded) => {
        this.saveState.coins += totalCoinsAwarded;
        this.saveState.highestLevel = Math.max(
          this.saveState.highestLevel,
          this.duel.currentWave + 1
        );
        this.saveState.stars += 3;
        void PlatformBridge.saveData(this.saveState);
        PlatformBridge.sendScore(this.saveState.highestLevel * 100 + this.saveState.coins);
        this.input.setEnabled(true);
        this.duel.startWave(this.duel.currentWave + 1);
      },
    });

    this.shell = new ShellController({
      currentGameId: 'ragdoll-archers-duel-3d',
      onRestart: () => {
        this.hud.closeModal();
        this.input.setEnabled(true);
        this.duel.startWave(this.duel.currentWave);
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
    this.duel.startWave(this.saveState.highestLevel);

    this.lastTimeMs = performance.now();
    requestAnimationFrame((now) => this.animate(now));
  }

  private handleResize(w: number, h: number): void {
    if (w <= 0 || h <= 0) return;
    this.renderer.setSize(w, h);
    this.cameraRig.resize(w / h);
  }

  private syncHud(): void {
    const player = this.duel.player;
    this.lighting.currentWindX = this.duel.windX;
    this.hud.syncStats({
      wave: this.duel.currentWave,
      coins: this.saveState.coins,
      hp: player ? player.hp : 0,
      maxHp: player ? player.maxHp : 100,
      windX: this.duel.windX,
      aliveEnemies: this.duel.aliveEnemyCount,
      shieldCharges: player ? player.shieldCharges : 0,
      tripleArmed: this.duel.tripleShotArmed,
      laserArmed: this.duel.laserShotArmed,
    });
  }

  private animate(nowMs: number): void {
    requestAnimationFrame((t) => this.animate(t));
    const rawDt = (nowMs - this.lastTimeMs) * 0.001;
    this.lastTimeMs = nowMs;
    const dt = Math.min(0.05, Math.max(0.001, rawDt));

    if (!this.isPaused) {
      this.duel.updateAimPreview(
        this.input.aim.isAiming,
        this.input.aim.angleRad,
        this.input.aim.power01
      );
      this.duel.update(dt);
      this.particles.update(dt);
      this.lighting.update(dt);
      this.cameraRig.update(dt);
    }

    this.renderer.render(this.scene, this.cameraRig.camera);

    if (this.isFirstFrame) {
      this.isFirstFrame = false;
      PlatformBridge.firstFrameReady();
      PlatformBridge.gameReady();
    }
  }
}

new ArcherDuelApp();
