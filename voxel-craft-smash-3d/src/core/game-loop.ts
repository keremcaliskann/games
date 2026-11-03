/**
 * Genre-Agnostic Managed Game Loop (shared/core/game-loop.ts)
 * Enforces strict MENU / PAUSE state halting (zero background execution before PLAY is clicked),
 * spiral-of-death delta clamping, and optional fixed-timestep physics accumulation.
 */

export interface ManagedLoopCallbacks {
  /** Called only when the Start Menu is closed (!isMenuOpen) and the game is not paused. */
  onUpdate: (dt: number, scaledDt: number, elapsedSec: number) => void;
  /** Optional fixed-timestep step (default 1/60s) for deterministic physics/logic. */
  onFixedUpdate?: (fixedDt: number) => void;
  /** Called to render the active 3D scene when the menu is closed (plus 1 initial boot frame). */
  onRender: (alpha: number) => void;
  /** Returns true when the Start Menu overlay is open. */
  isMenuOpen: () => boolean;
  /** Returns true when the platform/SDK has paused the game. */
  isPaused?: () => boolean;
  /** Optional difficulty speed/pacing multiplier from ShellController (default 1.0). */
  getDifficultyMultiplier?: () => number;
}

export class ManagedGameLoop {
  private readonly callbacks: ManagedLoopCallbacks;
  private readonly fixedStep: number;
  private rafId = 0;
  private running = false;
  private lastTimeMs = 0;
  private accumulator = 0;
  private elapsedSec = 0;
  private renderedBootFrame = false;

  private readonly boundTick = (nowMs: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.boundTick);

    if (this.lastTimeMs === 0) {
      this.lastTimeMs = nowMs;
    }
    const rawDt = (nowMs - this.lastTimeMs) * 0.001;
    this.lastTimeMs = nowMs;

    // Render exactly one initial frame so YouTube Playables firstFrameReady() succeeds,
    // then completely halt background execution while the full-screen Start Menu is open.
    if (this.callbacks.isMenuOpen() || this.callbacks.isPaused?.()) {
      this.accumulator = 0;
      if (!this.renderedBootFrame) {
        this.renderedBootFrame = true;
        this.callbacks.onRender(1);
      }
      return;
    }

    const dt = Math.min(0.05, Math.max(0.001, rawDt));
    const mult = this.callbacks.getDifficultyMultiplier ? this.callbacks.getDifficultyMultiplier() : 1.0;
    const scaledDt = dt * mult;
    this.elapsedSec += dt;

    if (this.callbacks.onFixedUpdate) {
      this.accumulator = Math.min(this.accumulator + scaledDt, this.fixedStep * 4);
      while (this.accumulator >= this.fixedStep) {
        this.callbacks.onFixedUpdate(this.fixedStep);
        this.accumulator -= this.fixedStep;
      }
    }

    this.callbacks.onUpdate(dt, scaledDt, this.elapsedSec);
    const alpha = this.callbacks.onFixedUpdate ? this.accumulator / this.fixedStep : 1;
    this.callbacks.onRender(alpha);
  };

  constructor(callbacks: ManagedLoopCallbacks, fixedStep = 1 / 60) {
    this.callbacks = callbacks;
    this.fixedStep = fixedStep;
  }

  public start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTimeMs = 0;
    this.accumulator = 0;
    this.rafId = requestAnimationFrame(this.boundTick);
  }

  public stop(): void {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }
}

export const FIXED_DT = 1 / 60;
export type UpdateCallback = (delta: number) => void;
export type FixedUpdateCallback = (fixedDelta: number) => void;
export type RenderCallback = (alpha: number, dt: number) => void;

/**
 * Universal Fixed/Variable Timestep Loop (compatible with both constructor and setCallbacks patterns).
 */
export class GameLoop {
  private isRunning = false;
  private animFrameId = 0;
  private accumulator = 0;
  private lastTime = 0;

  private onFixedUpdate: FixedUpdateCallback = () => {};
  private onUpdate: UpdateCallback = () => {};
  private onRender: RenderCallback = () => {};

  constructor(
    onFixedUpdate?: FixedUpdateCallback,
    onRender?: RenderCallback
  ) {
    if (onFixedUpdate) this.onFixedUpdate = onFixedUpdate;
    if (onRender) this.onRender = onRender;
  }

  public setCallbacks(
    onFixedUpdate: FixedUpdateCallback,
    onUpdate: UpdateCallback,
    onRender: () => void
  ): void {
    this.onFixedUpdate = onFixedUpdate;
    this.onUpdate = onUpdate;
    this.onRender = () => onRender();
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.accumulator = 0;

    const frame = (time: number): void => {
      if (!this.isRunning) return;

      const rawDt = (time - this.lastTime) * 0.001;
      this.lastTime = time;
      const dt = Math.min(0.05, Math.max(0.001, rawDt));

      this.accumulator = Math.min(this.accumulator + dt, FIXED_DT * 4);
      while (this.accumulator >= FIXED_DT) {
        this.onFixedUpdate(FIXED_DT);
        this.accumulator -= FIXED_DT;
      }

      this.onUpdate(dt);
      const alpha = this.accumulator / FIXED_DT;
      this.onRender(alpha, dt);

      this.animFrameId = requestAnimationFrame(frame);
    };

    this.animFrameId = requestAnimationFrame(frame);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = 0;
    }
  }
}
