import * as THREE from 'three';
import { SoundController } from './core/audio';
import { RallyStageManager } from './game/systems/rally-stage-manager';
import { InputManager } from './input/input-manager';
import { UniversalAdProvider } from './platform/ads';
import { PlatformBridge } from './platform/sdk';
import { CameraRig } from './render/camera-rig';
import { ParticleEffects } from './render/effects';
import { setupDaylightLighting } from './render/lighting';
import { HudController } from './ui/hud';
import { ShellController } from './ui/shell-controller';

async function bootstrap(): Promise<void> {
  const container = document.getElementById('game-container') as HTMLElement;
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const hudRoot = document.getElementById('hud-root') as HTMLElement;

  const sdk = new PlatformBridge();
  const audio = new SoundController();
  const ads = UniversalAdProvider.get();
  void ads.initialize();

  const saveData = await sdk.loadData();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const sunLight = setupDaylightLighting(scene, renderer);

  const cameraRig = new CameraRig(container.clientWidth / Math.max(1, container.clientHeight));
  const particles = new ParticleEffects(scene);
  const input = new InputManager(container);

  let hud: HudController | null = null;

  const stage = new RallyStageManager(scene, cameraRig, particles, audio, {
    onHudUpdate: () => hud?.refreshHud(),
    onCallout: (text, color) => hud?.showCallout(text, color),
    onStageComplete: (rank, stageTimeSec, goldTargetSec, baseCoins) =>
      hud?.showVictoryModal(rank, stageTimeSec, goldTargetSec, baseCoins),
    onNearMissTimeExpired: (progressPct) => hud?.showNearMissReviveModal(progressPct),
  });

  const startStageWithSavedStats = () => {
    stage.startStage(
      saveData.stageNumber,
      saveData.selectedSkin,
      saveData.turboUpgradeLevel,
      saveData.gripUpgradeLevel,
      saveData.suspensionUpgradeLevel
    );
  };

  hud = new HudController(hudRoot, stage, sdk, ads, audio, saveData, startStageWithSavedStats);
  startStageWithSavedStats();

  const handleResize = (w: number, h: number) => {
    if (w <= 0 || h <= 0) return;
    renderer.setSize(w, h, false);
    cameraRig.resize(w / h);
  };

  const shell = new ShellController({
    currentGameId: 'rally-horizon-3d',
    onRestart: () => {
      startStageWithSavedStats();
    },
    onResize: handleResize,
  });

  let isPaused = false;
  sdk.bindLifecycle(
    () => {
      isPaused = true;
    },
    () => {
      isPaused = false;
    },
    (enabled) => {
      audio.setPlatformMuted(!enabled);
    }
  );

  // Render first frame and notify YouTube Playables SDK immediately
  renderer.render(scene, cameraRig.camera);
  sdk.firstFrameReady();
  sdk.gameReady();

  let lastTime = performance.now();
  function animate(now: number): void {
    requestAnimationFrame(animate);
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) * 0.001));
    lastTime = now;

    if (!isPaused && !shell.isMenuOpen) {
      const simDt = dt * shell.getDifficultyMultiplier();
      input.update();
      stage.update(simDt, input.steerInput, input.throttleInput, input.driftHeld);
      particles.update(simDt);
      if (stage.player) {
        cameraRig.update(
          dt,
          stage.player.pos,
          stage.player.headingRad,
          stage.player.driftAngleRad,
          stage.player.nitroTimer > 0
        );
        sunLight.position.set(
          stage.player.pos.x + 36,
          stage.player.pos.y + 68,
          stage.player.pos.z - 28
        );
        sunLight.target.position.copy(stage.player.pos);
        sunLight.target.updateMatrixWorld();
      }
      hud?.update(dt);
      renderer.render(scene, cameraRig.camera);
    }
  }

  requestAnimationFrame(animate);
}

bootstrap();
