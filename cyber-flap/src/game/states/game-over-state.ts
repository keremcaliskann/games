import { Action } from '../../input/input-state';
import { GAME_CONFIG } from '../config/game-config';
import { GameStateId, type GameContext, type GameState } from './state-machine';

const RESTART_COOLDOWN_SEC = 0.38;

export class GameOverState implements GameState {
  readonly id = GameStateId.GameOver;
  private cooldownSec = 0;

  constructor(private readonly ctx: GameContext) {}

  enter(): void {
    this.cooldownSec = RESTART_COOLDOWN_SEC;
    this.ctx.events.emit('stateChange', {
      state: this.id,
      score: this.ctx.score,
      highScore: this.ctx.highScore,
    });
  }

  exit(): void {}

  fixedUpdate(dtSec: number): void {
    this.cooldownSec = Math.max(0, this.cooldownSec - dtSec);

    // Let drone fall to the floor rail after crash
    this.ctx.drone.prevPos.copy(this.ctx.drone.currPos);
    this.ctx.drone.prevRot.copy(this.ctx.drone.currRot);
    if (this.ctx.drone.currPos.y > GAME_CONFIG.floorY + 0.4) {
      this.ctx.drone.velocityY = Math.max(
        GAME_CONFIG.maxFallSpeedMps,
        this.ctx.drone.velocityY + GAME_CONFIG.gravityMps2 * dtSec,
      );
      this.ctx.drone.currPos.y = Math.max(
        GAME_CONFIG.floorY + 0.4,
        this.ctx.drone.currPos.y + this.ctx.drone.velocityY * dtSec,
      );
    }

    if (this.cooldownSec <= 0 && this.ctx.input.state.pressed & (Action.Flap | Action.Confirm)) {
      this.ctx.clock.reset();
      this.ctx.score = 0;
      this.ctx.spawner.reset();
      this.ctx.drone.reset();
      this.ctx.drone.flap();
      this.ctx.audio.playFlap();
      this.ctx.fsm.transitionTo(GameStateId.Playing);
    }
  }

  update(dtSec: number): void {
    this.ctx.city.update(dtSec, 1.2);
    this.ctx.cameraRig.update(dtSec, this.ctx.drone.mesh.position.y);
  }
}
