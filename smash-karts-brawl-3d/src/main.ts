import * as THREE from 'three';
import { SoundController } from './core/audio';
import { BrawlArenaManager } from './game/systems/brawl-arena-manager';
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
  setupDaylightLighting(scene);

  const cameraRig = new CameraRig(container.clientWidth / Math.max(1, container.clientHeight));
  const particles = new ParticleEffects(scene);
  const input = new InputManager(container);

  let hud: HudController | null = null;

  const arena = new BrawlArenaManager(scene, particles, audio, cameraRig, {
    onHudUpdate: () => hud?.refreshHud(),
    onCallout: (text, color) => hud?.showCallout(text, color),
    onMatchVictory: (rank, baseCoins, kills) => hud?.showVictoryModal(rank, baseCoins, kills),
    onPlayerWrecked: (rank, killerName) => hud?.showNearMissReviveModal(rank, killerName),
  });

  const startMatchWithSavedStats = () => {
    arena.startMatch(
      saveData.level,
      saveData.selectedSkin,
      saveData.armorUpgradeLevel,
      saveData.turboUpgradeLevel,
      saveData.weaponUpgradeLevel
    );
  };

  hud = new HudController(hudRoot, arena, sdk, ads, audio, saveData, startMatchWithSavedStats);
  startMatchWithSavedStats();

  const handleResize = (w: number, h: number) => {
    if (w <= 0 || h <= 0) return;
    renderer.setSize(w, h, false);
    cameraRig.resize(w / h);
  };

  const shell = new ShellController({
    currentGameId: 'smash-karts-brawl-3d',
    onRestart: () => {
      startMatchWithSavedStats();
    },
    onResize: handleResize,
  });
  void shell;

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
      arena.update(simDt, input.steerX, input.steerZ, input.consumeFireRequest());
      particles.update(simDt);
      if (arena.player) {
        cameraRig.update(dt, arena.player.pos, arena.player.powerCubes);
      }
      hud?.update(dt);
      renderer.render(scene, cameraRig.camera);
    }
  }

  requestAnimationFrame(animate);
}

bootstrap();
