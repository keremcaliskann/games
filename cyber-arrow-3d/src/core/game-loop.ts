import { GameClock } from './clock';

export type UpdateCallback = (delta: number) => void;
export type FixedUpdateCallback = (fixedDelta: number) => void;
export type RenderCallback = () => void;

/**
 * Main application game loop using requestAnimationFrame.
 * Integrates fixed-step updates for determinism and standard per-frame updates for visuals.
 */
export class GameLoop {
  private readonly clock = new GameClock();
  private isRunning = false;
  private animFrameId: number | null = null;

  private onFixedUpdate: FixedUpdateCallback | null = null;
  private onUpdate: UpdateCallback | null = null;
  private onRender: RenderCallback | null = null;

  public setCallbacks(
    onFixedUpdate: FixedUpdateCallback,
    onUpdate: UpdateCallback,
    onRender: RenderCallback
  ): void {
    this.onFixedUpdate = onFixedUpdate;
    this.onUpdate = onUpdate;
    this.onRender = onRender;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.scheduleFrame();
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  private scheduleFrame(): void {
    this.animFrameId = requestAnimationFrame((now) => {
      if (!this.isRunning) return;
      this.tick(now);
      this.scheduleFrame();
    });
  }

  private tick(now: number): void {
    const delta = this.clock.tick(now, (fixedDelta) => {
      if (this.onFixedUpdate) {
        this.onFixedUpdate(fixedDelta);
      }
    });

    if (this.onUpdate) {
      this.onUpdate(delta);
    }

    if (this.onRender) {
      this.onRender();
    }
  }
}
