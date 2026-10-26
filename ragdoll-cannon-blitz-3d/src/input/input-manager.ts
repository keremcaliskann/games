import * as THREE from 'three';

export interface InputCallbacks {
  onAim(yaw: number, pitch: number): void;
  onFire(): void;
}

export class InputManager {
  private isPointerDown = false;
  private startX = 0;
  private startY = 0;
  private currentYaw = 0;
  private currentPitch = 0.35;
  private hasAimed = false;

  constructor(
    private readonly container: HTMLElement,
    private readonly callbacks: InputCallbacks
  ) {
    this.setupListeners();
  }

  public get isAiming(): boolean {
    return this.hasAimed;
  }

  private setupListeners(): void {
    this.container.addEventListener('pointerdown', (e) => {
      // Isolate clicks on HUD interactive buttons
      const target = e.target as HTMLElement;
      if (
        target.closest('.hud-btn') ||
        target.closest('.booster-btn') ||
        target.closest('.modal-card') ||
        target.closest('.arcade-sidebar')
      ) {
        return;
      }

      this.isPointerDown = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
      this.hasAimed = false;
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isPointerDown) return;

      const dx = (e.clientX - this.startX) / (window.innerWidth * 0.5);
      const dy = (e.clientY - this.startY) / (window.innerHeight * 0.5);

      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
        this.hasAimed = true;
      }

      // Delta mapping to yaw and pitch
      const targetYaw = -dx * 0.9;
      const targetPitch = 0.35 + dy * 0.6;

      this.currentYaw = THREE.MathUtils.lerp(this.currentYaw, targetYaw, 0.4);
      this.currentPitch = THREE.MathUtils.lerp(this.currentPitch, targetPitch, 0.4);

      this.callbacks.onAim(this.currentYaw, this.currentPitch);
    });

    const release = () => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;
      this.callbacks.onFire();
    };

    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
  }
}
