import RAPIER from '@dimforge/rapier3d-compat';
import { SynthAudio } from './core/audio';
import { GameClock } from './core/clock';
import { EventBus } from './core/events';
import { GameLoop } from './core/game-loop';
import { logger } from './core/logger';
import { GAME_CONFIG } from './game/config/game-config';
import { CyberDrone } from './game/entities/drone';
import { GameOverState } from './game/states/game-over-state';
import { MenuState } from './game/states/menu-state';
import { PausedState } from './game/states/paused-state';
import { PlayingState } from './game/states/playing-state';
import {
  GameStateId,
  StateMachine,
  type GameContext,
  type GameEvents,
} from './game/states/state-machine';
import { ObstacleSpawner } from './game/systems/obstacle-spawner';
import { ParticleSystem } from './game/systems/particle-system';
import { GamepadSource } from './input/gamepad';
import { InputManager } from './input/input-manager';
import { KeyboardPointerSource } from './input/keyboard-mouse';
import { PhysicsWorld } from './physics/physics-world';
import { LifecycleManager } from './platform/lifecycle';
import { StorageService } from './platform/storage';
import { CameraRig } from './render/camera-rig';
import { CyberCity } from './render/cyber-city';
import { setupCyberLighting } from './render/lighting';
import { AdaptiveQuality } from './render/quality';
import { RenderEngine } from './render/renderer';
import { CyberHud } from './ui/hud';
import { ShellController } from './ui/shell-controller';

async function bootstrap(appContainer: HTMLElement, hudContainer: HTMLElement): Promise<void> {
  await RAPIER.init();

  const clock = new GameClock();
  const events = new EventBus<GameEvents>();
  const audio = new SynthAudio();
  const storage = new StorageService();

  const cameraRig = new CameraRig(appContainer.clientWidth, appContainer.clientHeight);
  let city: CyberCity | null = null;
  let loop: GameLoop | null = null;

  const quality = new AdaptiveQuality((newTier) => {
    renderEngine.applyQualityTier(newTier);
    city?.setRainCount(newTier.rainCount);
    logger.info(`Adaptive quality adjusted to tier: ${newTier.name}`);
  });

  const renderEngine = new RenderEngine(appContainer, quality.current, {
    onResize: (width: number, height: number): void => {
      cameraRig.resize(width, height);
    },
    onContextLost: (): void => {
      loop?.stop();
    },
    onContextRestored: (): void => {
      loop?.start();
    },
  });

  setupCyberLighting(renderEngine.scene);

  city = new CyberCity(GAME_CONFIG.ceilingY, GAME_CONFIG.floorY);
  city.setRainCount(quality.current.rainCount);
  renderEngine.scene.add(city.root);

  const physics = new PhysicsWorld();
  const drone = new CyberDrone(physics);
  renderEngine.scene.add(drone.mesh);

  const spawner = new ObstacleSpawner(renderEngine.scene, physics);
  const particles = new ParticleSystem();
  renderEngine.scene.add(particles.mesh);

  const input = new InputManager([
    new KeyboardPointerSource(appContainer),
    new GamepadSource(),
  ]);

  const fsm = new StateMachine();
  const ctx: GameContext = {
    clock,
    events,
    audio,
    storage,
    input,
    physics,
    drone,
    spawner,
    city,
    cameraRig,
    particles,
    fsm,
    score: 0,
    highScore: storage.loadHighScore(),
  };

  fsm.register(new MenuState(ctx));
  fsm.register(new PlayingState(ctx));
  fsm.register(new PausedState(ctx));
  fsm.register(new GameOverState(ctx));

  const hud = new CyberHud(hudContainer, events, input);
  fsm.transitionTo(GameStateId.Menu);

  const handleRestart = (): void => {
    ctx.clock.reset();
    ctx.score = 0;
    ctx.spawner.reset();
    ctx.particles.reset();
    ctx.drone.reset();
    ctx.drone.flap();
    ctx.audio.playFlap();
    ctx.fsm.transitionTo(GameStateId.Playing);
  };

  const shell = new ShellController({
    currentGameId: 'cyber-flap',
    onRestart: handleRestart,
  });

  window.addEventListener('arcade:restart', handleRestart);

  loop = new GameLoop({
    fixedUpdate: (dtSec: number): void => {
      input.poll();
      fsm.fixedUpdate(dtSec);
      input.consumeFixedEdges();
    },
    update: (dtSec: number): void => {
      const emaMs = loop!.getAverageFrameMs();
      quality.update(dtSec, emaMs);
      fsm.update(dtSec);
      particles.update(dtSec);
      hud.updateDebug(
        dtSec,
        emaMs,
        renderEngine.getDrawCalls(),
        renderEngine.getGeometryCount(),
      );
    },
    render: (alpha: number): void => {
      drone.renderInterpolated(alpha);
      spawner.renderInterpolated(alpha);
      renderEngine.render(cameraRig.camera);
    },
  });

  const lifecycle = new LifecycleManager({
    onPause: (): void => {
      input.reset();
      if (fsm.getCurrentId() === GameStateId.Playing) {
        fsm.transitionTo(GameStateId.Paused);
      }
      loop?.stop();
    },
    onResume: (): void => {
      loop?.start();
    },
  });

  window.addEventListener(
    'beforeunload',
    () => {
      shell.dispose();
      window.removeEventListener('arcade:restart', handleRestart);
      loop?.stop();
      lifecycle.dispose();
      hud.dispose();
      input.dispose();
      spawner.dispose();
      particles.dispose();
      drone.dispose();
      city?.dispose();
      physics.dispose();
      renderEngine.dispose();
      audio.dispose();
    },
    { once: true },
  );

  loop.start();
}

const appEl = document.getElementById('app');
const hudEl = document.getElementById('hud');

if (!appEl || !hudEl) {
  throw new Error('Required DOM containers (#app, #hud) not found');
}

bootstrap(appEl, hudEl).catch((err: unknown) => {
  appEl.textContent = 'Failed to initialize Cyber-Flap. Please check the console.';
  logger.error('Bootstrap failure', err);
});
