/**
 * Precision delta-time accumulator with background-tab clamping.
 */
export class GameClock {
  private lastTime = 0;
  private totalElapsed = 0;
  private readonly maxDelta = 0.1; // Clamp tab suspension frame jumps

  public start(): void {
    this.lastTime = performance.now();
  }

  public tick(): number {
    const now = performance.now();
    let delta = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (delta > this.maxDelta) {
      delta = this.maxDelta;
    }

    this.totalElapsed += delta;
    return delta;
  }

  public get elapsed(): number {
    return this.totalElapsed;
  }
}
