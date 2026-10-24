export class GameClock {
  private lastTime = 0;
  private accumulator = 0;
  public readonly fixedStep = 1 / 60;

  public reset(): void {
    this.lastTime = performance.now();
    this.accumulator = 0;
  }

  public tick(currentTime: number, onFixedUpdate: (dt: number) => void): number {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      return 0;
    }

    const frameTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;
    this.accumulator += frameTime;

    while (this.accumulator >= this.fixedStep) {
      onFixedUpdate(this.fixedStep);
      this.accumulator -= this.fixedStep;
    }

    return frameTime;
  }
}
