export class GameLoop {
  private isRunning = false;
  private reqId = 0;
  private readonly updateFn: (time: number) => void;

  constructor(updateFn: (time: number) => void) {
    this.updateFn = updateFn;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    const frame = (time: number) => {
      if (!this.isRunning) return;
      this.updateFn(time);
      this.reqId = requestAnimationFrame(frame);
    };

    this.reqId = requestAnimationFrame(frame);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.reqId) {
      cancelAnimationFrame(this.reqId);
      this.reqId = 0;
    }
  }
}
