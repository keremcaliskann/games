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
  private readonly joyBase: HTMLDivElement;
  private readonly joyKnob: HTMLDivElement;

  constructor(private readonly stageEl: HTMLElement) {
    this.joyBase = document.createElement('div');
    this.joyBase.style.cssText =
      'position:absolute;width:86px;height:86px;margin-left:-43px;margin-top:-43px;border-radius:50%;border:3px solid rgba(255,255,255,0.65);background:rgba(15,23,42,0.26);pointer-events:none;display:none;z-index:25;';
    this.joyKnob = document.createElement('div');
    this.joyKnob.style.cssText =
      'position:absolute;left:50%;top:50%;width:36px;height:36px;margin-left:-18px;margin-top:-18px;border-radius:50%;background:rgba(249,115,22,0.95);box-shadow:0 4px 10px rgba(0,0,0,0.3);';
    this.joyBase.appendChild(this.joyKnob);
    this.stageEl.appendChild(this.joyBase);

    this.bindEvents();
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.pointerId = null;
      this.steer.active = false;
      this.steer.dx = 0;
      this.steer.dz = 0;
      this.joyBase.style.display = 'none';
    }
  }

  private bindEvents(): void {
    this.stageEl.addEventListener('pointerdown', (e: PointerEvent) => {
      if (!this.enabled) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest('[data-hud-interactive="true"], button, .modal-overlay')) return;

      this.pointerId = e.pointerId;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.steer.active = true;

      const rect = this.stageEl.getBoundingClientRect();
      this.joyBase.style.display = 'block';
      this.joyBase.style.left = `${this.startX - rect.left}px`;
      this.joyBase.style.top = `${this.startY - rect.top}px`;
      this.joyKnob.style.transform = 'translate(0px, 0px)';

      // Also steer immediately toward tap offset relative to stage center
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
      const maxRadius = 46;
      if (dist > 4) {
        this.steer.dx = dx / dist;
        this.steer.dz = dy / dist;
        if (dist > maxRadius) {
          this.startX += (dx / dist) * (dist - maxRadius);
          this.startY += (dy / dist) * (dist - maxRadius);
          const rect = this.stageEl.getBoundingClientRect();
          this.joyBase.style.left = `${this.startX - rect.left}px`;
          this.joyBase.style.top = `${this.startY - rect.top}px`;
        }
        const knobDist = Math.min(dist, maxRadius);
        this.joyKnob.style.transform = `translate(${(dx / dist) * knobDist}px, ${(dy / dist) * knobDist}px)`;
      }
    });

    const releasePointer = (e: PointerEvent): void => {
      if (this.pointerId !== e.pointerId) return;
      this.pointerId = null;
      this.joyBase.style.display = 'none';
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
