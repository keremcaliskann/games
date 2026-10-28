import * as THREE from 'three';

export interface InputCallbacks {
  onAim(yaw: number, pitch: number): void;
  onFire(): void;
}

export class InputManager {
  private isPointerDown = false;
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
    return this.hasAimed || this.isPointerDown;
  }

  private updateAimFromScreenPoint(clientX: number, clientY: number): void {
    const rect = this.container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    // Normalized screen coordinates: normX in [-1, 1] (Left to Right), normY in [0, 1] (Bottom to Top)
    const normX = THREE.MathUtils.clamp(((clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
    const normY = THREE.MathUtils.clamp(1 - (clientY - rect.top) / rect.height, 0, 1);

    // Direct point-and-aim: cannon barrel points directly toward cursor/finger position on screen
    this.currentYaw = -normX * 0.65;
    this.currentPitch = THREE.MathUtils.clamp(0.08 + normY * 0.72, 0.05, 0.85);
    this.hasAimed = true;
    this.callbacks.onAim(this.currentYaw, this.currentPitch);
  }

  private setupListeners(): void {
    this.container.addEventListener('pointerdown', (e) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('.hud-btn') ||
        target.closest('.booster-btn') ||
        target.closest('.modal-card') ||
        target.closest('.modal-overlay') ||
        target.closest('.shell-sidebar') ||
        target.closest('[data-hud-interactive]')
      ) {
        return;
      }

      this.isPointerDown = true;
      this.updateAimFromScreenPoint(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
      // Update aim both while dragging on touch/mouse and while hovering with mouse inside stage
      const rect = this.container.getBoundingClientRect();
      const insideStage =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (this.isPointerDown || (e.pointerType === 'mouse' && insideStage)) {
        this.updateAimFromScreenPoint(e.clientX, e.clientY);
      }
    });

    const release = () => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;
      this.callbacks.onFire();
    };

    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const step = 0.06;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.currentYaw = THREE.MathUtils.clamp(this.currentYaw + step, -0.68, 0.68);
        this.hasAimed = true;
        this.callbacks.onAim(this.currentYaw, this.currentPitch);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.currentYaw = THREE.MathUtils.clamp(this.currentYaw - step, -0.68, 0.68);
        this.hasAimed = true;
        this.callbacks.onAim(this.currentYaw, this.currentPitch);
      } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.currentPitch = THREE.MathUtils.clamp(this.currentPitch + step, 0.05, 0.85);
        this.hasAimed = true;
        this.callbacks.onAim(this.currentYaw, this.currentPitch);
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        this.currentPitch = THREE.MathUtils.clamp(this.currentPitch - step, 0.05, 0.85);
        this.hasAimed = true;
        this.callbacks.onAim(this.currentYaw, this.currentPitch);
      } else if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.callbacks.onFire();
      }
    });
  }
}
