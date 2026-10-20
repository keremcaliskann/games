import { Action } from '../../input/input-state';
import { GAME_CONFIG } from '../config/game-config';
import { GameStateId, type GameContext, type GameState } from './state-machine';

export class MenuState implements GameState {
  readonly id = GameStateId.Menu;

  constructor(private readonly ctx: GameContext) {}

  enter(): void {
    this.ctx.clock.reset();
    this.ctx.score = 0;
    this.ctx.spawner.reset();
    this.ctx.drone.reset();
    this.ctx.events.emit('stateChange', {
      state: this.id,
      score: this.ctx.score,
      highScore: this.ctx.highScore,
    });
  }

  exit(): void {}

  fixedUpdate(dtSec: number): void {
    this.ctx.clock.tick(dtSec);
    this.ctx.drone.updateIdleHover(this.ctx.clock.elapsedSec);

    if (this.ctx.input.state.pressed & (Action.Flap | Action.Confirm)) {
      this.ctx.drone.reset();
      this.ctx.drone.flap();
      this.ctx.audio.playFlap();
      this.ctx.fsm.transitionTo(GameStateId.Playing);
    }
  }

  update(dtSec: number): void {
    this.ctx.drone.updateVisuals(dtSec);
    this.ctx.city.update(dtSec, GAME_CONFIG.baseScrollSpeedMps * 0.6);
    this.ctx.cameraRig.update(dtSec, this.ctx.drone.mesh.position.y);
  }
}
