export interface AimState {
  isAiming: boolean;
  angleRad: number;
  power01: number;
}

export class InputManager {
  public readonly aim: AimState = {
    isAiming: false,
    angleRad: 0.35,
    power01: 0,
  };

  private startX = 0;
  private startY = 0;
  private activePointerId: number | null = null;
  private enabled = true;

  constructor(
    private readonly stageEl: HTMLElement,
    private readonly onAimStart: () => void,
    private readonly onFireRelease: (angleRad: number, power01: number) => void
  ) {
    this.bindEvents();
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.aim.isAiming = false;
      this.activePointerId = null;
    }
  }

  private isHudElement(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(
      target.closest(
        '[data-hud-interactive="true"], button, a, .modal-overlay, .shell-sidebar'
      )
    );
  }

  private bindEvents(): void {
    window.addEventListener('pointerdown', (e: PointerEvent) => {
      if (!this.enabled || this.activePointerId !== null) return;
      if (this.isHudElement(e.target)) return;

      const rect = this.stageEl.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        return;
      }

      this.activePointerId = e.pointerId;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.aim.isAiming = true;
      this.aim.power01 = 0.65;
      this.aim.angleRad = 0.32;
      this.onAimStart();
    });

    window.addEventListener('pointermove', (e: PointerEvent) => {
      if (!this.enabled || !this.aim.isAiming || e.pointerId !== this.activePointerId) {
        return;
      }

      const dx = this.startX - e.clientX;
      const dy = e.clientY - this.startY;
      const dist = Math.hypot(dx, dy);

      if (dist < 8) {
        this.aim.power01 = 0.65;
        return;
      }

      // Support both slingshot pull-back (dragging left/down) and direct aim (dragging right/up)
      const pullX = dx >= -15 ? Math.max(25, dx + 55) : Math.max(25, -dx);
      const pullY = dx >= -15 ? dy : -dy;

      const rawAngle = Math.atan2(pullY, pullX);
      this.aim.angleRad = Math.max(-0.65, Math.min(1.18, rawAngle));
      this.aim.power01 = Math.max(0.35, Math.min(1.0, dist / 135));
    });

    const handleRelease = (e: PointerEvent): void => {
      if (e.pointerId !== this.activePointerId) return;
      const wasAiming = this.aim.isAiming;
      const finalAngle = this.aim.angleRad;
      const finalPower = this.aim.power01;

      this.aim.isAiming = false;
      this.activePointerId = null;

      if (wasAiming && this.enabled) {
        this.onFireRelease(finalAngle, Math.max(0.45, finalPower));
      }
    };

    window.addEventListener('pointerup', handleRelease);
    window.addEventListener('pointercancel', handleRelease);
  }
}
