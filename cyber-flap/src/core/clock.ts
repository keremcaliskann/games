export class GameClock {
  elapsedSec = 0;
  timeScale = 1;

  tick(dtSec: number): void {
    this.elapsedSec += dtSec * this.timeScale;
  }

  reset(): void {
    this.elapsedSec = 0;
  }
}
