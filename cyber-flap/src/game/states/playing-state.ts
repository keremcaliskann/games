import { Action } from '../../input/input-state';
import type { PhysicsCallbacks } from '../../physics/physics-world';
import { GameStateId, type GameContext, type GameState } from './state-machine';

export class PlayingState implements GameState {
  readonly id = GameStateId.Playing;
  private readonly physicsCallbacks: PhysicsCallbacks;

  constructor(private readonly ctx: GameContext) {
    this.physicsCallbacks = {
      onHitHazard: (): void => {
        this.ctx.audio.playCrash();
        this.ctx.cameraRig.triggerShake(0.65);
        this.ctx.fsm.transitionTo(GameStateId.GameOver);
      },
      onPassScoreSensor: (pairId: number): void => {
        if (!this.ctx.spawner.tryConsumeScoreSensor(pairId)) return;
        this.ctx.score++;
        if (this.ctx.score > this.ctx.highScore) {
          this.ctx.highScore = this.ctx.score;
          this.ctx.storage.saveHighScore(this.ctx.highScore);
        }
        this.ctx.audio.playScore();
        this.ctx.events.emit('scoreChange', {
          score: this.ctx.score,
          highScore: this.ctx.highScore,
        });
      },
    };
  }

  enter(): void {
    this.ctx.events.emit('stateChange', {
      state: this.id,
      score: this.ctx.score,
      highScore: this.ctx.highScore,
    });
  }

  exit(): void {}

  fixedUpdate(dtSec: number): void {
    const pressed = this.ctx.input.state.pressed;
    if (pressed & Action.Pause) {
      this.ctx.fsm.transitionTo(GameStateId.Paused);
      return;
    }

    if (pressed & Action.Flap) {
      this.ctx.drone.flap();
      this.ctx.audio.playFlap();
    }

    this.ctx.clock.tick(dtSec);
    this.ctx.drone.fixedUpdate(dtSec);
    this.ctx.spawner.fixedUpdate(dtSec, this.ctx.clock.elapsedSec, this.ctx.score);
    this.ctx.physics.step(this.physicsCallbacks);
  }

  update(dtSec: number): void {
    const scrollSpeed = this.ctx.spawner.getScrollSpeedMps(this.ctx.score);
    this.ctx.drone.updateVisuals(dtSec);
    this.ctx.city.update(dtSec, scrollSpeed);
    this.ctx.cameraRig.update(dtSec, this.ctx.drone.mesh.position.y);
  }
}
