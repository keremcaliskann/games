export interface RunnerInputState {
  steerX: number;
  steerZ: number;
  isMoving: boolean;
}

export class InputManager {
  public readonly state: RunnerInputState = {
    steerX: 0,
    steerZ: 1,
    isMoving: true,
  };

  private enabled = true;
  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private lastTapTimeMs = 0;
  private readonly keys = new Set<string>();

  constructor(
    private readonly stageEl: HTMLElement,
    private readonly onJumpOrDive: () => void
  ) {
    this.bindEvents();
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.pointerId = null;
      this.state.steerX = 0;
      this.state.steerZ = 0;
      this.state.isMoving = false;
    } else {
      this.state.steerX = 0;
      this.state.steerZ = 1;
      this.state.isMoving = true;
    }
  }

  private bindEvents(): void {
    this.stageEl.addEventListener('pointerdown', (e: PointerEvent) => {
      if (!this.enabled) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-hud-interactive="true"]')) return;

      const now = performance.now();
      if (now - this.lastTapTimeMs < 260) {
        this.onJumpOrDive();
      }
      this.lastTapTimeMs = now;

      this.pointerId = e.pointerId;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.state.isMoving = true;
      this.state.steerZ = 1;
    });

    window.addEventListener('pointermove', (e: PointerEvent) => {
      if (!this.enabled || this.pointerId !== e.pointerId) return;
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      this.state.steerX = Math.max(-1, Math.min(1, dx / 48));
      // Moving finger down slows/reverses slightly; default pushes forward (+Z)
      this.state.steerZ = dy > 38 ? -0.4 : 1.0;
    });

    const releasePointer = (e: PointerEvent): void => {
      if (this.pointerId !== e.pointerId) return;
      this.pointerId = null;
      this.updateKeyboardFallback();
    };

    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.enabled) return;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (e.code === 'Space') {
          this.onJumpOrDive();
        }
      }
      this.keys.add(e.code);
      this.updateKeyboardFallback();
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keys.delete(e.code);
      this.updateKeyboardFallback();
    });
  }

  private updateKeyboardFallback(): void {
    if (this.pointerId !== null) return;
    let sx = 0;
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) sx -= 1;
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) sx += 1;
    this.state.steerX = sx;
    this.state.steerZ = 1.0;
    this.state.isMoving = true;
  }
}
