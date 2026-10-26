export class GameClock {
  private lastTime: number = performance.now();
  private elapsedSeconds: number = 0;

  public tick(): number {
    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.elapsedSeconds += dt;
    return dt;
  }

  public get elapsed(): number {
    return this.elapsedSeconds;
  }
}
