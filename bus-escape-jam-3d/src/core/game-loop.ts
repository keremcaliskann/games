export class GameLoop {
  private isRunning = false;
  private animFrameId = 0;
  private lastTime = 0;

  constructor(private readonly onFrame: (dt: number) => void) {}

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();

    const frame = (time: number) => {
      if (!this.isRunning) return;

      const rawDt = (time - this.lastTime) / 1000;
      this.lastTime = time;
      const dt = Math.min(rawDt, 0.1);

      this.onFrame(dt);
      this.animFrameId = requestAnimationFrame(frame);
    };

    this.animFrameId = requestAnimationFrame(frame);
  }

  public stop(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.animFrameId);
  }
}
