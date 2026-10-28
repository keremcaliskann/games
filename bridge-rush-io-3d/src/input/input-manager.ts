export class InputManager {
  public steerX = 0;
  public steerZ = 0;
  public isSteering = false;

  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private readonly keys = new Set<string>();

  constructor(container: HTMLElement) {
    container.addEventListener('pointerdown', (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-hud-interactive="true"]')) {
        return;
      }
      if (this.pointerId === null) {
        this.pointerId = e.pointerId;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.isSteering = true;
      }
    });

    window.addEventListener('pointermove', (e: PointerEvent) => {
      if (e.pointerId !== this.pointerId) return;
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
        const maxRadius = 56;
        const clamped = Math.min(dist, maxRadius) / maxRadius;
        this.steerX = (dx / dist) * clamped;
        // Dragging up on screen moves forward (+Z)
        this.steerZ = (-dy / dist) * clamped;
        if (dist > maxRadius) {
          this.startX = e.clientX - (dx / dist) * maxRadius;
          this.startY = e.clientY - (dy / dist) * maxRadius;
        }
      }
    });

    const releasePointer = (e: PointerEvent) => {
      if (e.pointerId === this.pointerId) {
        this.pointerId = null;
        this.isSteering = false;
        this.steerX = 0;
        this.steerZ = 0;
      }
    };

    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      this.keys.add(e.code);
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      this.keys.delete(e.code);
    });
  }

  public update(): void {
    let kx = 0;
    let kz = 0;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) kx -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) kx += 1;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) kz += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) kz -= 1;

    if (kx !== 0 || kz !== 0) {
      const len = Math.hypot(kx, kz);
      this.steerX = kx / len;
      this.steerZ = kz / len;
      this.isSteering = true;
    } else if (this.pointerId === null) {
      this.steerX = 0;
      this.steerZ = 0;
      this.isSteering = false;
    }
  }
}
