import { GameClock } from './clock';

export class GameLoop {
  private isRunning = false;
  private animFrameId: number | null = null;
  private readonly clock = new GameClock();

  private onFixedUpdate: (dt: number) => void = () => {};
  private onUpdate: (dt: number) => void = () => {};
  private onRender: () => void = () => {};

  public setCallbacks(
    onFixedUpdate: (dt: number) => void,
    onUpdate: (dt: number) => void,
    onRender: () => void
  ): void {
    this.onFixedUpdate = onFixedUpdate;
    this.onUpdate = onUpdate;
    this.onRender = onRender;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.tick();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private tick = (): void => {
    if (!this.isRunning) return;

    const dt = this.clock.tick();
    this.onFixedUpdate(1 / 60);
    this.onUpdate(dt);
    this.onRender();

    this.animFrameId = requestAnimationFrame(this.tick);
  };
}
