export class InputManager {
  private moveX = 0;
  private moveZ = 0;
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private keysDown = new Set<string>();

  constructor(targetEl: HTMLElement) {
    this.setupPointerEvents(targetEl);
    this.setupKeyboardEvents();
  }

  public getMoveVector(): { x: number; z: number } {
    let x = this.moveX;
    let z = this.moveZ;

    // Keyboard takes precedence if active
    let kx = 0;
    let kz = 0;
    if (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp')) kz -= 1;
    if (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown')) kz += 1;
    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) kx -= 1;
    if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) kx += 1;

    if (kx !== 0 || kz !== 0) {
      const len = Math.hypot(kx, kz);
      x = kx / len;
      z = kz / len;
    }

    return { x, z };
  }

  private setupPointerEvents(targetEl: HTMLElement): void {
    targetEl.addEventListener('pointerdown', (e) => {
      // Ignore HUD button clicks
      if ((e.target as HTMLElement).closest('button, .hud-interactive, .modal')) return;

      this.isPointerDown = true;
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isPointerDown) return;

      const dx = e.clientX - this.pointerStartX;
      const dy = e.clientY - this.pointerStartY;
      const dist = Math.hypot(dx, dy);

      if (dist > 8) {
        // Normalize steering direction
        this.moveX = dx / dist;
        this.moveZ = dy / dist; // Screen Y corresponds to 3D Z world
      } else {
        this.moveX = 0;
        this.moveZ = 0;
      }
    });

    const endPointer = () => {
      this.isPointerDown = false;
      this.moveX = 0;
      this.moveZ = 0;
    };

    window.addEventListener('pointerup', endPointer);
    window.addEventListener('pointercancel', endPointer);
  }

  private setupKeyboardEvents(): void {
    window.addEventListener('keydown', (e) => {
      this.keysDown.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.code);
    });

    window.addEventListener('blur', () => {
      this.keysDown.clear();
      this.isPointerDown = false;
      this.moveX = 0;
      this.moveZ = 0;
    });
  }
}
