import * as THREE from 'three';
import { PlatformBridge, CloudSaveData } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { LightingSetup } from './render/lighting';
import { CameraRig } from './render/camera-rig';
import { ParticleEffects } from './render/effects';
import { RUNNER_SKINS } from './render/PrefabFactory';
import { SoundController } from './core/audio';
import { TournamentManager } from './game/systems/tournament-manager';
import { InputManager } from './input/input-manager';
import { HudController } from './ui/hud';
import { ShellController } from './ui/shell-controller';

export class PartyKnockoutApp {
  private readonly appEl: HTMLElement;
  private readonly scene: THREE.Scene;
  private readonly renderer: THREE.WebGLRenderer;
  private readonly cameraRig: CameraRig;
  private readonly lighting: LightingSetup;
  private readonly particles: ParticleEffects;
  private readonly audio: SoundController;
  private readonly ads: UniversalAdProvider;
  private readonly tournament: TournamentManager;
  private readonly input: InputManager;
  private readonly hud: HudController;
  private readonly shell: ShellController;

  private saveState: CloudSaveData = {
    coins: 150,
    crowns: 0,
    selectedSkinId: 0,
    unlockedSkins: [0],
    speedLevel: 1,
    jumpLevel: 1,
    stabilityLevel: 1,
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
    this.particles = new ParticleEffects(this.scene);
    this.audio = new SoundController();
    this.ads = UniversalAdProvider.get();
    void this.ads.initialize();

    this.tournament = new TournamentManager(
      this.scene,
      this.particles,
      this.audio,
      this.cameraRig,
      {
        onHudUpdate: () => this.syncHud(),
        onCallout: (text, colorHex) => this.hud.showFloatingCallout(text, colorHex),
        onRoundQualified: (roundNum, finishRank, earnedCoins, isFinalCrown) => {
          this.input.setEnabled(false);
          if (isFinalCrown) {
            this.saveState.crowns += 1;
            this.audio.playVictory();
          }
          this.hud.showVictoryModal(roundNum, finishRank, earnedCoins, isFinalCrown);
        },
        onPlayerEliminated: (roundNum, finishRank, qualifyLimit) => {
          this.input.setEnabled(false);
          this.audio.playDefeat();
          this.hud.showNearMissReviveModal(roundNum, finishRank, qualifyLimit);
        },
      }
    );

    this.input = new InputManager(this.appEl, () => this.handlePlayerJumpOrDive());

    this.hud = new HudController(this.ads, {
      onRestart: () => {
        this.input.setEnabled(true);
        this.startTournamentRound(this.tournament.roundNumber);
      },
      onToggleSound: () => this.audio.toggleUserMute(),
      onJumpOrDive: () => this.handlePlayerJumpOrDive(),
      onActivateBooster: (type) => {
        this.tournament.activateBooster(type);
      },
      onReviveQualifyAccepted: () => {
        const nextRound = Math.min(3, this.tournament.roundNumber + 1);
        this.input.setEnabled(true);
        this.startTournamentRound(nextRound);
        if (this.tournament.player) {
          this.tournament.player.speedBootsTimer = 12.0;
        }
      },
      onReviveDeclined: () => {
        this.input.setEnabled(true);
        this.startTournamentRound(1);
      },
      onNextRoundOrTournament: (totalCoinsAwarded, advanceRound) => {
        this.saveState.coins += totalCoinsAwarded;
        void PlatformBridge.saveData(this.saveState);
        PlatformBridge.sendScore(this.saveState.crowns * 500 + this.saveState.coins);
        this.input.setEnabled(true);
        const nextRound = advanceRound ? Math.min(3, this.tournament.roundNumber + 1) : 1;
        this.startTournamentRound(nextRound);
      },
      onSelectOrBuySkin: (skinId) => {
        const spec = RUNNER_SKINS[skinId];
        if (!spec) return;
        if (this.saveState.unlockedSkins.includes(skinId)) {
          this.saveState.selectedSkinId = skinId;
          if (this.tournament.player) {
            this.tournament.player.applySkin(skinId);
          }
        } else if (this.saveState.coins >= spec.cost) {
          this.saveState.coins -= spec.cost;
          this.saveState.unlockedSkins.push(skinId);
          this.saveState.selectedSkinId = skinId;
          if (this.tournament.player) {
            this.tournament.player.applySkin(skinId);
          }
          this.audio.playBoosterActivate();
        }
        void PlatformBridge.saveData(this.saveState);
        this.syncHud();
      },
      onBuyStatUpgrade: (stat) => {
        if (stat === 'speed') {
          const cost = this.saveState.speedLevel * 100;
          if (this.saveState.coins >= cost) {
            this.saveState.coins -= cost;
            this.saveState.speedLevel++;
            this.audio.playBoosterActivate();
          }
        } else if (stat === 'jump') {
          const cost = this.saveState.jumpLevel * 100;
          if (this.saveState.coins >= cost) {
            this.saveState.coins -= cost;
            this.saveState.jumpLevel++;
            this.audio.playBoosterActivate();
          }
        } else {
          const cost = this.saveState.stabilityLevel * 100;
          if (this.saveState.coins >= cost) {
            this.saveState.coins -= cost;
            this.saveState.stabilityLevel++;
            this.audio.playBoosterActivate();
          }
        }
        void PlatformBridge.saveData(this.saveState);
        this.syncHud();
      },
    });
    this.hud.bindGarageOpen(() => this.saveState);

    this.shell = new ShellController({
      currentGameId: 'stumble-knockout-royale-3d',
      onRestart: () => {
        this.hud.closeModal();
        this.input.setEnabled(true);
        this.startTournamentRound(1);
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

  private handlePlayerJumpOrDive(): void {
    if (!this.tournament.player) return;
    const action = this.tournament.player.triggerJumpOrDive();
    if (action === 'jump') {
      this.audio.playJump(false);
    } else if (action === 'dive') {
      this.audio.playJump(true);
    }
  }

  private startTournamentRound(roundNum: number): void {
    this.tournament.startRound(
      roundNum,
      this.saveState.selectedSkinId,
      this.saveState.speedLevel,
      this.saveState.jumpLevel,
      this.saveState.stabilityLevel
    );
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
    this.startTournamentRound(1);

    this.lastTimeMs = performance.now();
    requestAnimationFrame((now) => this.animate(now));
  }

  private handleResize(w: number, h: number): void {
    if (w <= 0 || h <= 0) return;
    this.renderer.setSize(w, h);
    this.cameraRig.resize(w / h);
  }

  private syncHud(): void {
    const p = this.tournament.player;
    this.hud.syncStats({
      roundNum: this.tournament.roundNumber,
      crowns: this.saveState.crowns,
      coins: this.saveState.coins,
      qualifiedCount: this.tournament.qualifiedCount,
      qualifySlots: this.tournament.qualifySlots,
      playerRank: this.tournament.getPlayerRank(),
      totalRunners: this.tournament.totalRunnersInRound,
      runners: this.tournament.runners,
      jetpackActive: p ? p.jetpackTimer > 0 : false,
      giantActive: p ? p.giantTimer > 0 : false,
      speedActive: p ? p.speedBootsTimer > 0 : false,
    });
  }

  private animate(nowMs: number): void {
    requestAnimationFrame((t) => this.animate(t));
    const rawDt = (nowMs - this.lastTimeMs) * 0.001;
    this.lastTimeMs = nowMs;
    const dt = Math.min(0.05, Math.max(0.001, rawDt));

    if (!this.isPaused) {
      this.tournament.update(
        dt,
        this.input.state.steerX,
        this.input.state.steerZ
      );
      this.particles.update(dt);
      const p = this.tournament.player;
      const px = p ? p.pos.x : 0;
      const py = p ? p.pos.y : 0;
      const pz = p ? p.pos.z : 0;
      this.cameraRig.update(dt, px, py, pz);
      this.lighting.updateShadowFocus(pz);
    }

    this.renderer.render(this.scene, this.cameraRig.camera);

    if (this.isFirstFrame) {
      this.isFirstFrame = false;
      PlatformBridge.firstFrameReady();
      PlatformBridge.gameReady();
    }
  }
}

new PartyKnockoutApp();
