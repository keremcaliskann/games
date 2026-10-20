export const FIXED_DT = 1 / 60;
const MAX_STEPS = 5;
const MAX_FRAME_DT = 0.1;

export interface LoopHandlers {
  fixedUpdate(dt: number): void;
  update(dt: number): void;
  render(alpha: number): void;
}

export class GameLoop {
  private rafId = 0;
  private lastMs = 0;
  private accSec = 0;
  private isRunning = false;
  private emaFrameMs = 16.6;

  constructor(private readonly handlers: LoopHandlers) {}

  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastMs = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.isRunning = false;
    cancelAnimationFrame(this.rafId);
  }

  getAverageFrameMs(): number {
    return this.emaFrameMs;
  }

  // Arrow property prevents per-frame function binding allocations
  private frame = (nowMs: number): void => {
    if (!this.isRunning) return;
    this.rafId = requestAnimationFrame(this.frame);

    const rawDeltaMs = nowMs - this.lastMs;
    this.lastMs = nowMs;

    // Track smoothed frame duration for adaptive quality decisions
    this.emaFrameMs = this.emaFrameMs * 0.92 + Math.min(rawDeltaMs, 100) * 0.08;

    const dtSec = Math.min(rawDeltaMs / 1000, MAX_FRAME_DT);
    this.accSec += dtSec;

    let steps = 0;
    while (this.accSec >= FIXED_DT && steps < MAX_STEPS) {
      this.handlers.fixedUpdate(FIXED_DT);
      this.accSec -= FIXED_DT;
      steps++;
    }
    // Discard excess lag if device cannot keep up with fixed simulation
    if (steps === MAX_STEPS) {
      this.accSec = 0;
    }

    this.handlers.update(dtSec);
    this.handlers.render(this.accSec / FIXED_DT);
  };
}
