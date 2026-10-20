import { Action } from '../../input/input-state';
import { GameStateId, type GameContext, type GameState } from './state-machine';

export class PausedState implements GameState {
  readonly id = GameStateId.Paused;

  constructor(private readonly ctx: GameContext) {}

  enter(): void {
    this.ctx.events.emit('stateChange', {
      state: this.id,
      score: this.ctx.score,
      highScore: this.ctx.highScore,
    });
  }

  exit(): void {}

  fixedUpdate(_dtSec: number): void {
    const pressed = this.ctx.input.state.pressed;
    if (pressed & (Action.Pause | Action.Confirm | Action.Flap)) {
      this.ctx.fsm.transitionTo(GameStateId.Playing);
    }
  }

  update(dtSec: number): void {
    this.ctx.cameraRig.update(dtSec, this.ctx.drone.mesh.position.y);
  }
}
