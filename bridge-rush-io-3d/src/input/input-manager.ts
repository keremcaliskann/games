export class InputManager {
  public steerX = 0;
  public steerZ = 0;
  public isSteering = false;

  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private readonly keys = new Set<string>();
  private readonly joyBase: HTMLDivElement;
  private readonly joyKnob: HTMLDivElement;

  constructor(private readonly container: HTMLElement) {
    // Visual Floating Thumbstick for immediate tactile feedback
    this.joyBase = document.createElement('div');
    this.joyBase.style.cssText =
      'position:absolute;width:88px;height:88px;margin-left:-44px;margin-top:-44px;border-radius:50%;border:3px solid rgba(255,255,255,0.65);background:rgba(15,23,42,0.28);pointer-events:none;display:none;z-index:30;backdrop-filter:blur(2px);';
    this.joyKnob = document.createElement('div');
    this.joyKnob.style.cssText =
      'position:absolute;left:50%;top:50%;width:38px;height:38px;margin-left:-19px;margin-top:-19px;border-radius:50%;background:rgba(250,204,21,0.92);box-shadow:0 4px 12px rgba(0,0,0,0.3);';
    this.joyBase.appendChild(this.joyKnob);
    this.container.appendChild(this.joyBase);

    container.addEventListener('pointerdown', (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        target.closest('[data-hud-interactive="true"], button, .br-modal-overlay, .shell-sidebar')
      ) {
        return;
      }
      if (this.pointerId === null) {
        this.pointerId = e.pointerId;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.currentX = e.clientX;
        this.currentY = e.clientY;
        this.isSteering = true;

        const rect = this.container.getBoundingClientRect();
        this.joyBase.style.display = 'block';
        this.joyBase.style.left = `${this.startX - rect.left}px`;
        this.joyBase.style.top = `${this.startY - rect.top}px`;
        this.joyKnob.style.transform = 'translate(0px, 0px)';

        // Immediate steer toward tap position relative to screen center
        this.applyHoldSteerFromPosition(e.clientX, e.clientY, rect);
      }
    });

    window.addEventListener('pointermove', (e: PointerEvent) => {
      if (e.pointerId !== this.pointerId) return;
      this.currentX = e.clientX;
      this.currentY = e.clientY;
      const dx = e.clientX - this.startX;
      const dy = e.clientY - this.startY;
      const dist = Math.hypot(dx, dy);
      const maxRadius = 46;

      if (dist > 4) {
        const clampedDist = Math.min(dist, maxRadius);
        const normX = dx / dist;
        const normY = dy / dist;

        // Camera looks toward +Z: Screen Right (+dx) is World -X, Screen Up (-dy) is World +Z
        const strength = Math.max(0.45, clampedDist / maxRadius);
        this.steerX = -normX * strength;
        this.steerZ = -normY * strength;

        if (dist > maxRadius) {
          this.startX = e.clientX - normX * maxRadius;
          this.startY = e.clientY - normY * maxRadius;
          const rect = this.container.getBoundingClientRect();
          this.joyBase.style.left = `${this.startX - rect.left}px`;
          this.joyBase.style.top = `${this.startY - rect.top}px`;
        }
        this.joyKnob.style.transform = `translate(${normX * clampedDist}px, ${normY * clampedDist}px)`;
      }
    });

    const releasePointer = (e: PointerEvent) => {
      if (e.pointerId === this.pointerId) {
        this.pointerId = null;
        this.isSteering = false;
        this.steerX = 0;
        this.steerZ = 0;
        this.joyBase.style.display = 'none';
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

  private applyHoldSteerFromPosition(clientX: number, clientY: number, rect: DOMRect): void {
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.62;
    const ox = clientX - cx;
    const oy = clientY - cy;
    const len = Math.hypot(ox, oy);
    if (len > 12) {
      this.steerX = -(ox / len);
      this.steerZ = -(oy / len);
    } else {
      this.steerX = 0;
      this.steerZ = 1;
    }
  }

  public update(): void {
    // Camera looks toward +Z: Screen Right (D/ArrowRight) is World -X, Screen Left (A/ArrowLeft) is World +X
    let kx = 0;
    let kz = 0;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) kx += 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) kx -= 1;
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
