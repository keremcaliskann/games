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
  private readonly joyBase: HTMLDivElement;
  private readonly joyKnob: HTMLDivElement;

  constructor(
    private readonly stageEl: HTMLElement,
    private readonly onJumpOrDive: () => void
  ) {
    this.joyBase = document.createElement('div');
    this.joyBase.style.cssText =
      'position:absolute;width:84px;height:84px;margin-left:-42px;margin-top:-42px;border-radius:50%;border:3px solid rgba(255,255,255,0.65);background:rgba(15,23,42,0.25);pointer-events:none;display:none;z-index:25;';
    this.joyKnob = document.createElement('div');
    this.joyKnob.style.cssText =
      'position:absolute;left:50%;top:50%;width:36px;height:36px;margin-left:-18px;margin-top:-18px;border-radius:50%;background:rgba(244,114,182,0.95);box-shadow:0 4px 10px rgba(0,0,0,0.3);';
    this.joyBase.appendChild(this.joyKnob);
    this.stageEl.appendChild(this.joyBase);

    this.bindEvents();
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.pointerId = null;
      this.state.steerX = 0;
      this.state.steerZ = 0;
      this.state.isMoving = false;
      this.joyBase.style.display = 'none';
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
      if (target && target.closest('[data-hud-interactive="true"], button, .modal-overlay')) return;

      // Right-click or double-tap triggers Jump / Dive immediately
      if (e.button === 2) {
        this.onJumpOrDive();
        return;
      }

      const now = performance.now();
      if (now - this.lastTapTimeMs < 280) {
        this.onJumpOrDive();
      }
      this.lastTapTimeMs = now;

      this.pointerId = e.pointerId;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.state.isMoving = true;
      this.state.steerZ = 1;

      const rect = this.stageEl.getBoundingClientRect();
      this.joyBase.style.display = 'block';
      this.joyBase.style.left = `${this.startX - rect.left}px`;
      this.joyBase.style.top = `${this.startY - rect.top}px`;
      this.joyKnob.style.transform = 'translate(0px, 0px)';
    });

    this.stageEl.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('pointermove', (e: PointerEvent) => {
      if (!this.enabled || this.pointerId !== e.pointerId) return;
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      const maxRadius = 42;
      const clampedX = Math.max(-1, Math.min(1, dx / maxRadius));

      // Camera looks toward +Z: Screen Right (+dx) is World -X, Screen Left (-dx) is World +X
      this.state.steerX = -clampedX;
      this.state.steerZ = dy > 36 ? -0.45 : 1.0;

      const dist = Math.hypot(dx, dy);
      if (dist > maxRadius) {
        this.startX = e.clientX - (dx / dist) * maxRadius;
        this.startY = e.clientY - (dy / dist) * maxRadius;
        const rect = this.stageEl.getBoundingClientRect();
        this.joyBase.style.left = `${this.startX - rect.left}px`;
        this.joyBase.style.top = `${this.startY - rect.top}px`;
      }
      const knobDist = Math.min(dist, maxRadius);
      const kx = dist > 0.01 ? (dx / dist) * knobDist : 0;
      const ky = dist > 0.01 ? (dy / dist) * knobDist : 0;
      this.joyKnob.style.transform = `translate(${kx}px, ${ky}px)`;
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
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        if (!e.repeat) {
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
    // Camera looks toward +Z: Screen Left (A/ArrowLeft) is +X, Screen Right (D/ArrowRight) is -X
    let sx = 0;
    if (this.keys.has('ArrowLeft') || this.keys.has('KeyA')) sx += 1;
    if (this.keys.has('ArrowRight') || this.keys.has('KeyD')) sx -= 1;
    const sz = this.keys.has('ArrowDown') || this.keys.has('KeyS') ? -0.45 : 1.0;
    this.state.steerX = sx;
    this.state.steerZ = sz;
    this.state.isMoving = true;
  }
}
