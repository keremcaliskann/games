export class InputManager {
  private moveX = 0;
  private moveZ = 0;
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private keysDown = new Set<string>();
  private readonly joyBase: HTMLDivElement;
  private readonly joyKnob: HTMLDivElement;

  constructor(private readonly targetEl: HTMLElement) {
    this.joyBase = document.createElement('div');
    this.joyBase.style.cssText =
      'position:absolute;width:88px;height:88px;margin-left:-44px;margin-top:-44px;border-radius:50%;border:3px solid rgba(255,255,255,0.68);background:rgba(15,23,42,0.26);pointer-events:none;display:none;z-index:25;';
    this.joyKnob = document.createElement('div');
    this.joyKnob.style.cssText =
      'position:absolute;left:50%;top:50%;width:38px;height:38px;margin-left:-19px;margin-top:-19px;border-radius:50%;background:rgba(56,189,248,0.95);box-shadow:0 4px 10px rgba(0,0,0,0.3);';
    this.joyBase.appendChild(this.joyKnob);
    (this.targetEl.parentElement || document.body).appendChild(this.joyBase);

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
      if ((e.target as HTMLElement).closest('button, .hud-interactive, .modal, [data-hud-interactive="true"]')) {
        return;
      }

      this.isPointerDown = true;
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

      const rect = targetEl.getBoundingClientRect();
      this.joyBase.style.display = 'block';
      this.joyBase.style.left = `${this.pointerStartX - rect.left}px`;
      this.joyBase.style.top = `${this.pointerStartY - rect.top}px`;
      this.joyKnob.style.transform = 'translate(0px, 0px)';

      // Immediate steer toward tap position relative to screen center
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.52;
      const ox = e.clientX - cx;
      const oy = e.clientY - cy;
      const len = Math.hypot(ox, oy);
      if (len > 10) {
        this.moveX = ox / len;
        this.moveZ = oy / len;
      }
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isPointerDown) return;

      const dx = e.clientX - this.pointerStartX;
      const dy = e.clientY - this.pointerStartY;
      const dist = Math.hypot(dx, dy);
      const maxRadius = 46;

      if (dist > 4) {
        this.moveX = dx / dist;
        this.moveZ = dy / dist;

        // Dynamic floating anchor so changing direction is instant
        if (dist > maxRadius) {
          this.pointerStartX += (dx / dist) * (dist - maxRadius);
          this.pointerStartY += (dy / dist) * (dist - maxRadius);
          const rect = targetEl.getBoundingClientRect();
          this.joyBase.style.left = `${this.pointerStartX - rect.left}px`;
          this.joyBase.style.top = `${this.pointerStartY - rect.top}px`;
        }
        const knobDist = Math.min(dist, maxRadius);
        this.joyKnob.style.transform = `translate(${(dx / dist) * knobDist}px, ${(dy / dist) * knobDist}px)`;
      }
    });

    const endPointer = () => {
      this.isPointerDown = false;
      this.moveX = 0;
      this.moveZ = 0;
      this.joyBase.style.display = 'none';
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
      this.joyBase.style.display = 'none';
    });
  }
}
