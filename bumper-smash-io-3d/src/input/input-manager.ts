export interface SteerState {
  active: boolean;
  dx: number;
  dz: number;
}

export class InputManager {
  public readonly steer: SteerState = {
    active: false,
    dx: 0,
    dz: 0,
  };

  private enabled = true;
  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private readonly keys = new Set<string>();

  constructor(private readonly stageEl: HTMLElement) {
    this.bindEvents();
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.pointerId = null;
      this.steer.active = false;
      this.steer.dx = 0;
      this.steer.dz = 0;
    }
  }

  private bindEvents(): void {
    this.stageEl.addEventListener('pointerdown', (e: PointerEvent) => {
      if (!this.enabled) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-hud-interactive="true"]')) return;

      this.pointerId = e.pointerId;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.steer.active = true;

      // Also steer immediately toward tap offset relative to stage center
      const rect = this.stageEl.getBoundingClientRect();
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.55;
      const ox = e.clientX - cx;
      const oy = e.clientY - cy;
      const len = Math.hypot(ox, oy);
      if (len > 8) {
        this.steer.dx = ox / len;
        this.steer.dz = oy / len;
      }
    });

    window.addEventListener('pointermove', (e: PointerEvent) => {
      if (!this.enabled || this.pointerId !== e.pointerId) return;
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        this.steer.dx = dx / dist;
        this.steer.dz = dy / dist;
        // Softly pull anchor so virtual thumbstick follows finger smoothly
        if (dist > 54) {
          this.startX += (dx / dist) * (dist - 54);
          this.startY += (dy / dist) * (dist - 54);
        }
      }
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
    let kx = 0;
    let kz = 0;
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) kx -= 1;
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) kx += 1;
    if (this.keys.has('ArrowUp') || this.keys.has('KeyW')) kz -= 1;
    if (this.keys.has('ArrowDown') || this.keys.has('KeyS')) kz += 1;

    const len = Math.hypot(kx, kz);
    if (len > 0) {
      this.steer.active = true;
      this.steer.dx = kx / len;
      this.steer.dz = kz / len;
    } else {
      this.steer.active = false;
      this.steer.dx = 0;
      this.steer.dz = 0;
    }
  }
}
