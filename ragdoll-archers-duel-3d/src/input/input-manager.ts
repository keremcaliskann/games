export interface AimState {
  isAiming: boolean;
  angleRad: number;
  power01: number;
}

export class InputManager {
  public readonly aim: AimState = {
    isAiming: false,
    angleRad: 0.32,
    power01: 0.82,
  };

  private startX = 0;
  private startY = 0;
  private initialAngleRad = 0.32;
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

  private computeDirectAngleFromScreenY(clientY: number, rect: DOMRect): number {
    // Map vertical screen position (top = high arc, bottom = low flat shot) cleanly
    const normY = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / Math.max(1, rect.height)));
    return -0.25 + normY * 1.05;
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
      this.initialAngleRad = this.computeDirectAngleFromScreenY(e.clientY, rect);
      this.aim.isAiming = true;
      this.aim.angleRad = this.initialAngleRad;
      this.aim.power01 = 0.85;
      this.onAimStart();
    });

    window.addEventListener('pointermove', (e: PointerEvent) => {
      if (!this.enabled || !this.aim.isAiming || e.pointerId !== this.activePointerId) {
        return;
      }

      const rect = this.stageEl.getBoundingClientRect();
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      const dist = Math.hypot(dx, dy);

      if (dist < 6) {
        return;
      }

      // If dragging left/down (classic slingshot pull), pulling down increases elevation angle.
      // If dragging right/up (direct cursor aim), moving pointer up increases elevation angle.
      let targetAngle: number;
      if (dx < -18) {
        // Slingshot pull-back mode
        targetAngle = this.initialAngleRad + (dy / 160) * 0.95;
        this.aim.power01 = Math.max(0.55, Math.min(1.0, 0.65 + dist / 150));
      } else {
        // Direct cursor/finger elevation tracking
        targetAngle = this.computeDirectAngleFromScreenY(e.clientY, rect);
        this.aim.power01 = 0.88;
      }

      this.aim.angleRad = Math.max(-0.45, Math.min(1.12, targetAngle));
    });

    const handleRelease = (e: PointerEvent): void => {
      if (e.pointerId !== this.activePointerId) return;
      const wasAiming = this.aim.isAiming;
      const finalAngle = this.aim.angleRad;
      const finalPower = this.aim.power01;

      this.aim.isAiming = false;
      this.activePointerId = null;

      if (wasAiming && this.enabled) {
        this.onFireRelease(finalAngle, Math.max(0.65, finalPower));
      }
    };

    window.addEventListener('pointerup', handleRelease);
    window.addEventListener('pointercancel', handleRelease);

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (!this.enabled) return;
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.aim.isAiming = true;
        this.aim.angleRad = Math.min(1.12, this.aim.angleRad + 0.05);
        this.aim.power01 = 0.88;
        this.onAimStart();
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        this.aim.isAiming = true;
        this.aim.angleRad = Math.max(-0.45, this.aim.angleRad - 0.05);
        this.aim.power01 = 0.88;
        this.onAimStart();
      } else if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.aim.isAiming = false;
        this.onFireRelease(this.aim.angleRad, Math.max(0.75, this.aim.power01));
      }
    });
  }
}
