import { GameClock } from './clock';

export class GameLoop {
  private readonly clock: GameClock;
  private animFrameId: number | null = null;
  private isRunning = false;

  private onFixedUpdate: (dt: number) => void = () => {};
  private onUpdate: (dt: number) => void = () => {};
  private onRender: () => void = () => {};

  constructor() {
    this.clock = new GameClock();
  }

  public setCallbacks(
    fixedUpdate: (dt: number) => void,
    update: (dt: number) => void,
    render: () => void
  ): void {
    this.onFixedUpdate = fixedUpdate;
    this.onUpdate = update;
    this.onRender = render;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();

    const frame = () => {
      if (!this.isRunning) return;
      this.clock.tick(this.onFixedUpdate, this.onUpdate);
      this.onRender();
      this.animFrameId = requestAnimationFrame(frame);
    };

    this.animFrameId = requestAnimationFrame(frame);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.clock.pause();
  }

  public resume(): void {
    if (!this.isRunning) {
      this.start();
    } else {
      this.clock.resume();
    }
  }

  public isLoopRunning(): boolean {
    return this.isRunning;
  }
}
