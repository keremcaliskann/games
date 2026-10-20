/**
 * Fixed step and variable delta clock.
 * Clamps maximum delta time to 100ms to prevent simulation explosion on tab reactivation.
 */
export class GameClock {
  private lastTime = 0;
  private accumulator = 0;
  public readonly fixedStep = 1 / 60;

  public start(): void {
    this.lastTime = performance.now();
    this.accumulator = 0;
  }

  public tick(currentTime: number, onFixedStep: (fixedDelta: number) => void): number {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
    }

    let delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Guard against background tab time jumps
    if (delta > 0.1) {
      delta = 0.1;
    }

    this.accumulator += delta;
    while (this.accumulator >= this.fixedStep) {
      onFixedStep(this.fixedStep);
      this.accumulator -= this.fixedStep;
    }

    return delta;
  }
}
