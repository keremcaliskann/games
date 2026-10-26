export const FIXED_DT = 1 / 60;

export class GameLoop {
  private isRunning = false;
  private animFrameId = 0;
  private accumulator = 0;
  private lastTime = 0;

  constructor(
    private readonly onFixedUpdate: (dt: number) => void,
    private readonly onRender: (interpolation: number, dt: number) => void
  ) {}

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulator = 0;

    const frame = (time: number) => {
      if (!this.isRunning) return;

      const rawDt = (time - this.lastTime) / 1000;
      this.lastTime = time;
      const dt = Math.min(rawDt, 0.1);

      this.accumulator += dt;
      while (this.accumulator >= FIXED_DT) {
        this.onFixedUpdate(FIXED_DT);
        this.accumulator -= FIXED_DT;
      }

      const alpha = this.accumulator / FIXED_DT;
      this.onRender(alpha, dt);

      this.animFrameId = requestAnimationFrame(frame);
    };

    this.animFrameId = requestAnimationFrame(frame);
  }

  public stop(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.animFrameId);
  }
}
