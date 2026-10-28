import * as THREE from 'three';
import { RenderPipeline } from './render/renderer';
import { CameraRig } from './render/camera-rig';
import { LightingSetup } from './render/lighting';
import { ParticleBurstEffect } from './render/effects';
import { SoundController } from './core/audio';
import { GameLoop } from './core/game-loop';
import { InputManager } from './input/input-manager';
import { Hud } from './ui/hud';
import { ShellController } from './ui/shell-controller';
import { PlatformBridge, SaveDataPayload } from './platform/sdk';
import { UniversalAdProvider } from './platform/ads';
import { GAME_CONFIG, ColorDef } from './game/config/game-config';
import { EconomySystem } from './game/systems/economy';
import { LevelGenerator } from './game/systems/level-generator';
import { Screw } from './game/entities/screw';
import { Plate } from './game/entities/plate';
import { Toolbox } from './game/entities/toolbox';
import { BufferDock } from './game/entities/buffer-dock';

const _ORIGIN = new THREE.Vector3(0, 0, 0);
const _IDENTITY_QUAT = new THREE.Quaternion();
const _TEMP_QUAT = new THREE.Quaternion();

class ScrewJamApp {
  private readonly appEl: HTMLElement;
  private readonly hudEl: HTMLElement;

  private readonly pipeline: RenderPipeline;
  private readonly cameraRig: CameraRig;
  private readonly particles: ParticleBurstEffect;
  private readonly sound: SoundController;
  private readonly loop: GameLoop;
  private readonly ads: UniversalAdProvider;
  private readonly economy: EconomySystem;
  private readonly input: InputManager;
  private readonly hud: Hud;
  private readonly shell: ShellController;

  // Game Entities
  private readonly bufferDock: BufferDock;
  private readonly activeToolboxes: Toolbox[] = [];
  private toolboxQueue: ColorDef[] = [];
  private readonly plates: Plate[] = [];
  private readonly screws: Screw[] = [];
  private readonly assemblyGroup = new THREE.Group();

  private isFirstRender = true;
  private isLevelTransitioning = false;

  constructor(cloudData?: Partial<SaveDataPayload>) {
    this.appEl = document.getElementById('app')!;
    this.hudEl = document.getElementById('hud')!;

    PlatformBridge.applyDualModeShell();
    this.ads = UniversalAdProvider.get();
    this.ads.initialize();

    this.sound = new SoundController();
    this.economy = new EconomySystem(cloudData);
    this.cameraRig = new CameraRig(this.appEl);

    this.pipeline = new RenderPipeline(this.appEl, {
      onResize: (w, h) => this.cameraRig.resize(w, h),
    });

    LightingSetup.setup(this.pipeline.scene);

    this.particles = new ParticleBurstEffect();
    this.pipeline.scene.add(this.particles.points);

    // Floating 3D Assembly (Zero ground occlusion)
    this.pipeline.scene.add(this.assemblyGroup);

    // Buffer Dock at front bottom
    this.bufferDock = new BufferDock(new THREE.Vector3(0, -3.2, 1.8));
    this.pipeline.scene.add(this.bufferDock.group);

    // Input Manager (Tap + Orbit Drag)
    this.input = new InputManager(this.pipeline.renderer.domElement, this.cameraRig.camera);
    this.input.setCallbacks(
      (raycaster) => this.handleTap(raycaster),
      (dx, dy) => this.cameraRig.rotateDelta(dx, dy)
    );

    // HUD Setup
    this.hud = new Hud(this.hudEl, {
      onRestartClick: () => this.loadCurrentLevel(),
      onSoundToggle: () => {
        const isMuted = this.sound.toggleMute();
        this.hud.setSoundMuted(isMuted);
      },
      onExtraSlotAd: () => this.handleExtraSlotAd(),
      onMagnetAd: () => this.handleMagnetAd(),
      onShatterAd: () => this.handleShatterAd(),
      onReviveAd: () => this.handleReviveAd(),
      onClaimMultiplierAd: (mult) => this.handleClaimMultiplierAd(mult),
      onClaimBaseVictory: () => this.handleClaimBaseVictory(),
      onNextLevel: () => this.handleNextLevel(),
      isAdReady: () => this.ads.isRewardedReady(),
    });

    this.shell = new ShellController({
      currentGameId: 'screw-jam-3d',
      onRestart: () => this.loadCurrentLevel(),
    });

    window.addEventListener('beforeunload', () => {
      this.particles.dispose();
      this.shell.dispose();
      this.pipeline.dispose();
    });

    PlatformBridge.initLifecycle({
      onPause: () => this.loop.stop(),
      onResume: () => this.loop.start(),
      onAudioEnabledChange: (enabled) => {
        this.sound.setMuted(!enabled);
        this.hud.setSoundMuted(!enabled);
      },
    });

    this.loop = new GameLoop();
    this.loop.setCallbacks(
      () => {},
      (dt) => this.update(dt),
      () => this.render()
    );

    this.loadCurrentLevel();
    this.loop.start();

    PlatformBridge.signalGameReady();
  }

  private loadCurrentLevel(): void {
    this.isLevelTransitioning = false;
    PlatformBridge.gameplayStart();

    // 1. Clear existing entities
    this.clearCurrentEntities();

    // 2. Load level data
    const lvl = this.economy.getLevel();
    const data = LevelGenerator.generateLevel(lvl);

    this.toolboxQueue = [...data.toolboxQueue];

    // 3. Build plates
    for (const p of data.plates) {
      const plate = new Plate(
        p.id,
        p.width,
        p.height,
        p.holes,
        p.color,
        p.position,
        _TEMP_QUAT.setFromEuler(p.rotation)
      );
      this.plates.push(plate);
      this.assemblyGroup.add(plate.group);
    }

    // 4. Build screws
    for (const s of data.screws) {
      const screw = new Screw(
        s.id,
        s.color,
        s.position,
        _IDENTITY_QUAT
      );
      this.screws.push(screw);
      this.assemblyGroup.add(screw.group);

      // Register holding plates
      for (const plateId of s.holdingPlateIds) {
        const pl = this.plates.find((p) => p.id === plateId);
        pl?.addHoldingScrew(s.id);
      }
    }

    // 5. Spawn initial active toolboxes
    this.spawnNextToolboxes();

    // 6. Update HUD
    this.updateHud();
  }

  private clearCurrentEntities(): void {
    for (const s of this.screws) {
      this.assemblyGroup.remove(s.group);
      s.dispose();
    }
    this.screws.length = 0;

    for (const p of this.plates) {
      this.assemblyGroup.remove(p.group);
      p.dispose();
    }
    this.plates.length = 0;

    for (const tb of this.activeToolboxes) {
      this.pipeline.scene.remove(tb.group);
      tb.dispose();
    }
    this.activeToolboxes.length = 0;

    this.bufferDock.clear();
  }

  private spawnNextToolboxes(): void {
    const targetCount = GAME_CONFIG.activeToolboxCount;
    while (this.activeToolboxes.length < targetCount && this.toolboxQueue.length > 0) {
      const color = this.toolboxQueue.shift()!;
      const idx = this.activeToolboxes.length;
      const posX = idx === 0 ? -1.5 : 1.5;
      const tb = new Toolbox(`box_${Date.now()}_${idx}`, color, new THREE.Vector3(posX, 3.4, 0));
      this.activeToolboxes.push(tb);
      this.pipeline.scene.add(tb.group);
    }
  }

  private update(dt: number): void {
    this.cameraRig.update(dt);
    this.particles.update(dt);

    for (let i = 0; i < this.screws.length; i++) {
      this.screws[i].update(dt);
    }

    for (let i = 0; i < this.plates.length; i++) {
      this.plates[i].update(dt);
    }

    for (let i = 0; i < this.activeToolboxes.length; i++) {
      this.activeToolboxes[i].update(dt);
    }
  }

  private render(): void {
    this.pipeline.render(this.cameraRig.camera);
    if (this.isFirstRender) {
      this.isFirstRender = false;
      PlatformBridge.signalFirstFrameReady();
    }
  }

  private handleTap(raycaster: THREE.Raycaster): void {
    if (this.isLevelTransitioning) return;

    // Raycast against all interactive screw meshes and active plates
    const meshes: THREE.Object3D[] = [];
    for (const s of this.screws) {
      if (s.state === 'idle') {
        meshes.push(s.headMesh, s.shaftMesh);
      }
    }
    for (const p of this.plates) {
      if (!p.isFalling && !p.isDropped) {
        meshes.push(p.mesh);
      }
    }

    const hits = raycaster.intersectObjects(meshes, false);
    if (hits.length === 0) {
      // Magnetic Tap Assist: if ray missed tiny screw head, pick closest idle screw within 0.52m of ray
      let bestScrew: Screw | null = null;
      let bestDistSq = 0.52 * 0.52;
      for (let i = 0; i < this.screws.length; i++) {
        const s = this.screws[i];
        if (s.state !== 'idle') continue;
        s.headMesh.getWorldPosition(_ORIGIN);
        const dSq = raycaster.ray.distanceSqToPoint(_ORIGIN);
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          bestScrew = s;
        }
      }
      if (bestScrew) {
        this.processScrewUnbolt(bestScrew);
      }
      return;
    }

    const firstHit = hits[0].object as THREE.Mesh;
    const hitPlate = firstHit.userData?.plate as Plate | undefined;
    if (hitPlate) {
      // Check if an idle screw head was right behind the obstructing plate
      const occludedScrewHit = hits.find((h) => Boolean(h.object.userData?.screw));
      const occludedScrew = occludedScrewHit?.object.userData?.screw as Screw | undefined;
      if (occludedScrew && !hitPlate.holdingScrewIds.has(occludedScrew.id)) {
        hitPlate.triggerOcclusionShake();
        this.sound.playBlocked();
        this.cameraRig.addTrauma(0.2);
        return;
      }
      if (occludedScrew && hitPlate.holdingScrewIds.has(occludedScrew.id)) {
        this.processScrewUnbolt(occludedScrew);
        return;
      }
      hitPlate.triggerOcclusionShake();
      return;
    }

    const screw = firstHit.userData?.screw as Screw;
    if (!screw || screw.state !== 'idle') return;

    this.processScrewUnbolt(screw);
  }

  private processScrewUnbolt(screw: Screw): void {
    // 1. Check if an active open toolbox matches screw color
    const matchingBox = this.activeToolboxes.find(
      (b) => b.color.id === screw.color.id && !b.isFull()
    );

    if (matchingBox) {
      const targetPos = matchingBox.reserveSocketWorldPosition();
      if (targetPos) {
        this.sound.playUnscrew();
        this.particles.spawnUnscrewSparks(screw.group.position, screw.color.hex, 16);
        this.onScrewExtracted(screw);

        screw.startUnscrewAndFly(targetPos, () => {
          this.sound.playSocketSnap();
          const isFull = matchingBox.addScrew(screw);
          screw.state = 'cleared';
          screw.group.visible = false;
          this.checkLevelStatus();

          if (isFull) {
            this.handleBoxCompleted(matchingBox);
          }
        });
        return;
      }
    }

    // 2. No matching box -> Try parking in Buffer Dock
    const freeSlotIdx = this.bufferDock.getFreeSlotIndex();
    if (freeSlotIdx !== -1) {
      const slotPos = this.bufferDock.getSlotWorldPosition(freeSlotIdx);
      this.bufferDock.parkScrew(screw);
      this.sound.playUnscrew();
      this.particles.spawnUnscrewSparks(screw.group.position, screw.color.hex, 14);
      this.onScrewExtracted(screw);

      screw.startUnscrewAndFly(slotPos, () => {
        this.sound.playSocketSnap();
        screw.state = 'parked';
        // Check if a matching toolbox opened while this screw was in flight
        this.flushMatchingParkedScrews();
      });
      return;
    }

    // 3. Buffer Dock is FULL! Trigger Hook 2 Near-Miss Revive Modal!
    this.sound.playBlocked();
    screw.triggerWiggle();
    this.cameraRig.addTrauma(0.35);

    setTimeout(() => {
      this.hud.showNearMissRevive(
        () => this.handleReviveAd(),
        () => this.loadCurrentLevel()
      );
    }, 280);
  }

  private onScrewExtracted(screw: Screw): void {
    // Release holding plates immediately when bolt is extracted from its hole
    for (const plate of this.plates) {
      const justDetached = plate.removeHoldingScrew(screw.id);
      if (justDetached) {
        this.sound.playPlateDrop();
        this.particles.spawnUnscrewSparks(plate.group.position, plate.color.hex, 24);
      }
    }
  }

  private handleBoxCompleted(box: Toolbox): void {
    this.sound.playBoxComplete();
    this.particles.spawnCelebration(box.group.position, 60);
    box.startSlideAway();

    setTimeout(() => {
      // Remove completed box
      const idx = this.activeToolboxes.indexOf(box);
      if (idx !== -1) {
        this.activeToolboxes.splice(idx, 1);
        this.pipeline.scene.remove(box.group);
        box.dispose();
      }

      // Spawn next waiting box from queue
      this.spawnNextToolboxes();

      // Check if any screw in buffer dock matches newly opened boxes
      this.flushMatchingParkedScrews();
    }, 380);
  }

  private flushMatchingParkedScrews(): void {
    for (const box of this.activeToolboxes) {
      if (box.isFull()) continue;
      const parked = this.bufferDock.getParkedScrewsOfColor(box.color.id);
      for (const screw of parked) {
        if (screw.state !== 'parked') continue;
        if (box.isFull()) break;
        const targetPos = box.reserveSocketWorldPosition();
        if (targetPos) {
          this.bufferDock.removeScrew(screw);
          screw.startUnscrewAndFly(targetPos, () => {
            this.sound.playSocketSnap();
            const isFull = box.addScrew(screw);
            screw.state = 'cleared';
            screw.group.visible = false;
            this.checkLevelStatus();
            if (isFull) {
              this.handleBoxCompleted(box);
            }
          });
        }
      }
    }
  }

  private checkLevelStatus(): void {
    if (this.isLevelTransitioning) return;
    const remainingScrews = this.screws.filter((s) => s.state !== 'cleared').length;

    if (remainingScrews === 0) {
      // VICTORY!
      this.isLevelTransitioning = true;
      PlatformBridge.gameplayStop();
      this.sound.playVictory();
      this.particles.spawnCelebration(_ORIGIN, 180);

      const lvl = this.economy.getLevel();
      PlatformBridge.sendScore(lvl * 150);

      setTimeout(() => {
        this.hud.showVictory(lvl, GAME_CONFIG.coinsPerLevel);
      }, 600);
    }
  }

  private updateHud(): void {
    this.hud.updateHeader(this.economy.getLevel(), this.economy.getCoins());
  }

  // Hook 1: In-Level Boosters
  private async handleExtraSlotAd(): Promise<void> {
    const success = await this.ads.showRewarded('booster_extra_slot');
    if (success) {
      this.bufferDock.unlockExtraSlot();
      this.sound.playBoxComplete();
      this.particles.spawnCelebration(this.bufferDock.group.position, 30);
    }
  }

  private async handleMagnetAd(): Promise<void> {
    const success = await this.ads.showRewarded('booster_magnet');
    if (success) {
      // Find open toolbox
      const openBox = this.activeToolboxes.find((b) => !b.isFull());
      if (openBox) {
        const matchingScrews = this.screws.filter(
          (s) => s.color.id === openBox.color.id && s.state === 'idle'
        );
        for (const s of matchingScrews.slice(0, 3)) {
          this.processScrewUnbolt(s);
        }
      }
    }
  }

  private async handleShatterAd(): Promise<void> {
    const success = await this.ads.showRewarded('booster_shatter');
    if (success) {
      const openBox = this.activeToolboxes.find((b) => !b.isFull());
      const targetPlate =
        (openBox && this.plates.find((p) => !p.isFalling && p.color.id === openBox.color.id)) ||
        this.plates.find((p) => !p.isFalling);

      if (targetPlate) {
        const heldIds = Array.from(targetPlate.holdingScrewIds);
        targetPlate.holdingScrewIds.clear();
        targetPlate.startFalling();
        this.sound.playPlateDrop();
        this.particles.spawnCelebration(targetPlate.group.position, 45);

        for (const sid of heldIds) {
          const s = this.screws.find((sc) => sc.id === sid && sc.state === 'idle');
          if (s) {
            this.processScrewUnbolt(s);
          }
        }
      }
    }
  }

  // Hook 2: Near-Miss Revive
  private async handleReviveAd(): Promise<void> {
    const success = await this.ads.showRewarded('near_miss_revive');
    if (success) {
      // Unlock extra buffer slots and magnet-complete the active open toolbox so no screw count is ever orphaned
      this.bufferDock.unlockExtraSlot();
      this.bufferDock.unlockExtraSlot();
      const openBox = this.activeToolboxes.find((b) => !b.isFull());
      if (openBox) {
        const matchingScrews = this.screws.filter(
          (s) => s.color.id === openBox.color.id && s.state === 'idle'
        );
        for (const s of matchingScrews) {
          if (openBox.isFull()) break;
          this.processScrewUnbolt(s);
        }
      }
      this.sound.playBoxComplete();
      this.updateHud();
    } else {
      this.loadCurrentLevel();
    }
  }

  // Hook 3: Multiplier
  private async handleClaimMultiplierAd(multiplier: number): Promise<void> {
    const success = await this.ads.showRewarded('victory_multiplier');
    if (success) {
      const reward = Math.floor(GAME_CONFIG.coinsPerLevel * multiplier);
      this.economy.addCoins(reward);
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

// Bootstrap application with mandatory cloud save pre-flight
async function bootstrap(): Promise<void> {
  PlatformBridge.applyDualModeShell();
  await PlatformBridge.initPlatform();
  const cloudData = await PlatformBridge.loadData({
    level: 1,
    coins: GAME_CONFIG.initialCoins,
    magnets: 1,
    extraSlots: 0,
  });
  new ScrewJamApp(cloudData);
}

window.addEventListener('DOMContentLoaded', () => {
  void bootstrap();
});
