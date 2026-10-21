export class GameClock {
  private lastTime = 0;
  private accumulator = 0;
  private readonly fixedStep = 1 / 60;
  private isPaused = false;
  private readonly maxDelta = 0.1;

  public start(): void {
    this.lastTime = performance.now() * 0.001;
    this.accumulator = 0;
    this.isPaused = false;
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.lastTime = performance.now() * 0.001;
    this.isPaused = false;
  }

  public getPaused(): boolean {
    return this.isPaused;
  }

  public tick(onFixedUpdate: (dt: number) => void, onUpdate: (dt: number) => void): void {
    if (this.isPaused) return;

    const now = performance.now() * 0.001;
    let delta = now - this.lastTime;
    this.lastTime = now;

    if (delta > this.maxDelta) {
      delta = this.maxDelta;
    }

    this.accumulator += delta;
    while (this.accumulator >= this.fixedStep) {
      onFixedUpdate(this.fixedStep);
      this.accumulator -= this.fixedStep;
    }

    onUpdate(delta);
  }
}
