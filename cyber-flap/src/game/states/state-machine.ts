import type { SynthAudio } from '../../core/audio';
import type { GameClock } from '../../core/clock';
import type { EventBus } from '../../core/events';
import type { InputManager } from '../../input/input-manager';
import type { PhysicsWorld } from '../../physics/physics-world';
import type { StorageService } from '../../platform/storage';
import type { CameraRig } from '../../render/camera-rig';
import type { CyberCity } from '../../render/cyber-city';
import type { CyberDrone } from '../entities/drone';
import type { ObstacleSpawner } from '../systems/obstacle-spawner';
import type { ParticleSystem } from '../systems/particle-system';

export const GameStateId = {
  Menu: 'menu',
  Playing: 'playing',
  Paused: 'paused',
  GameOver: 'game_over',
} as const;

export type GameStateIdType = (typeof GameStateId)[keyof typeof GameStateId];

export type GameEvents = {
  stateChange: { state: GameStateIdType; score: number; highScore: number };
  scoreChange: { score: number; highScore: number };
};

export interface GameState {
  readonly id: GameStateIdType;
  enter(): void;
  exit(): void;
  fixedUpdate(dtSec: number): void;
  update(dtSec: number): void;
}

export class StateMachine {
  private current: GameState | null = null;
  private readonly states = new Map<GameStateIdType, GameState>();

  register(state: GameState): void {
    this.states.set(state.id, state);
  }

  transitionTo(id: GameStateIdType): void {
    const next = this.states.get(id);
    if (!next || this.current === next) return;
    this.current?.exit();
    this.current = next;
    next.enter();
  }

  getCurrentId(): GameStateIdType | null {
    return this.current ? this.current.id : null;
  }

  fixedUpdate(dtSec: number): void {
    this.current?.fixedUpdate(dtSec);
  }

  update(dtSec: number): void {
    this.current?.update(dtSec);
  }
}

export interface GameContext {
  readonly clock: GameClock;
  readonly events: EventBus<GameEvents>;
  readonly audio: SynthAudio;
  readonly storage: StorageService;
  readonly input: InputManager;
  readonly physics: PhysicsWorld;
  readonly drone: CyberDrone;
  readonly spawner: ObstacleSpawner;
  readonly city: CyberCity;
  readonly cameraRig: CameraRig;
  readonly particles: ParticleSystem;
  readonly fsm: StateMachine;
  score: number;
  highScore: number;
  hasShield: boolean;
  hasSlowMo: boolean;
}
