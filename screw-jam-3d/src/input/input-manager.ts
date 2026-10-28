import * as THREE from 'three';

export class InputManager {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();

  private isPointerDown = false;
  private startX = 0;
  private startY = 0;
  private lastX = 0;
  private lastY = 0;
  private hasMovedSignificantly = false;
  private readonly dragThreshold = 18; // Generous 18px mobile tap tolerance so slight finger roll still registers tap

  private onTapCallback: ((raycaster: THREE.Raycaster) => void) | null = null;
  private onRotateCallback: ((deltaX: number, deltaY: number) => void) | null = null;

  constructor(
    private readonly domElement: HTMLElement,
    private readonly camera: THREE.PerspectiveCamera
  ) {
    this.domElement.addEventListener('pointerdown', this.onPointerDown, { passive: false });
    window.addEventListener('pointermove', this.onPointerMove, { passive: false });
    window.addEventListener('pointerup', this.onPointerUp, { passive: false });
    window.addEventListener('pointercancel', this.onPointerUp, { passive: false });
  }

  public setCallbacks(
    onTap: (raycaster: THREE.Raycaster) => void,
    onRotate: (deltaX: number, deltaY: number) => void
  ): void {
    this.onTapCallback = onTap;
    this.onRotateCallback = onRotate;
  }

  private onPointerDown = (e: PointerEvent): void => {
    // Ignore clicks on HUD interactive buttons
    if ((e.target as HTMLElement)?.closest('[data-hud-interactive="true"]')) {
      return;
    }

    this.isPointerDown = true;
    this.hasMovedSignificantly = false;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  };

  private onPointerMove = (e: PointerEvent): void => {
    if (!this.isPointerDown) return;

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    const totalDist = Math.hypot(e.clientX - this.startX, e.clientY - this.startY);
    if (totalDist > this.dragThreshold) {
      this.hasMovedSignificantly = true;
    }

    if (this.hasMovedSignificantly) {
      this.onRotateCallback?.(dx, dy);
    }
  };

  private onPointerUp = (e: PointerEvent): void => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;

    if (!this.hasMovedSignificantly) {
      // It's a clean tap!
      const rect = this.domElement.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      this.onTapCallback?.(this.raycaster);
    }
  };

  public dispose(): void {
    this.domElement.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
  }
}
