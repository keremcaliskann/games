import { ErgonomicInput, FloatingJoystickUI } from './ergonomic-input';

export class InputManager {
  private readonly joystick: FloatingJoystickUI;
  public steerInput = 0; // -1 (Left) .. +1 (Right)
  public throttleInput = 1.0; // +1 forward, -1 reverse
  public winchActive = false;

  private readonly keys = new Set<string>();
  private activePointerId: number | null = null;
  private anchorX = 0;
  private anchorY = 0;
  private joyX = 0;
  private joyY = 0;
  public manualWinchToggle = false;

  constructor(private readonly container: HTMLElement) {
    this.joystick = ErgonomicInput.createFloatingJoystick(container, 'rgba(245, 158, 11, 0.94)');

    container.addEventListener('pointerdown', (e) => {
      if (ErgonomicInput.isHudElement(e.target)) return;
      if (this.activePointerId !== null) return;
      this.activePointerId = e.pointerId;
      const rect = this.container.getBoundingClientRect();
      this.anchorX = e.clientX - rect.left;
      this.anchorY = e.clientY - rect.top;
      this.joyX = 0;
      this.joyY = 0;
      this.joystick.show(this.anchorX, this.anchorY);
    });

    window.addEventListener('pointermove', (e) => {
      if (e.pointerId !== this.activePointerId) return;
      const rect = this.container.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      let dx = cx - this.anchorX;
      let dy = cy - this.anchorY;
      const maxR = 54;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) {
        const pull = dist - maxR;
        this.anchorX += (dx / dist) * pull * 0.45;
        this.anchorY += (dy / dist) * pull * 0.45;
        dx = (dx / dist) * maxR;
        dy = (dy / dist) * maxR;
      }
      this.joyX = dx / maxR;
      this.joyY = dy / maxR;
      this.joystick.update(this.anchorX, this.anchorY, dx, dy);
    });

    const releasePointer = (e: PointerEvent) => {
      if (e.pointerId !== this.activePointerId) return;
      this.activePointerId = null;
      this.joyX = 0;
      this.joyY = 0;
      this.joystick.hide();
    };
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer);

    window.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.activePointerId = null;
      this.joyX = 0;
      this.joyY = 0;
      this.joystick.hide();
    });
  }

  public update(): void {
    let kbSteer = 0;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) kbSteer -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) kbSteer += 1;

    let kbThrottle = 1.0;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) {
      kbThrottle = -0.5;
    }

    if (this.activePointerId !== null) {
      this.steerInput = Math.max(-1, Math.min(1, this.joyX * 1.25));
      this.throttleInput = this.joyY > 0.55 ? -0.5 : 1.0;
    } else {
      this.steerInput = kbSteer;
      this.throttleInput = kbThrottle;
    }

    this.winchActive =
      this.manualWinchToggle ||
      this.keys.has('Space') ||
      this.keys.has('KeyE') ||
      this.keys.has('ShiftLeft');
  }
}
