import * as THREE from 'three';

export interface PointerRaycastHit {
  point: THREE.Vector3;
  object: THREE.Object3D;
}

export type TapCallback = (raycaster: THREE.Raycaster) => void;
export type DragCallback = (deltaX: number, deltaY: number) => void;

/**
 * Unified pointer handling distinguishing short taps from rotational drags.
 * Prevents accidental block triggers while the player rotates the 3D model.
 */
export class InputManager {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointerNDC = new THREE.Vector2();

  private isPointerDown = false;
  private lastX = 0;
  private lastY = 0;
  private totalDragDistance = 0;

  private readonly dragThreshold = 18; // Generous 18px mobile tap tolerance
  private onTap: TapCallback | null = null;
  private onDrag: DragCallback | null = null;

  constructor(private readonly domElement: HTMLElement, private readonly camera: THREE.Camera) {
    this.domElement.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerCancel);
  }

  public setCallbacks(onTap: TapCallback, onDrag: DragCallback): void {
    this.onTap = onTap;
    this.onDrag = onDrag;
  }

  private handlePointerDown = (e: PointerEvent): void => {
    // Ignore clicks on interactive HUD elements (buttons, modals, chips)
    if (e.target instanceof Element && e.target.closest('[data-hud-interactive="true"]')) {
      return;
    }

    // Only respond to primary mouse click or direct touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    this.isPointerDown = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.totalDragDistance = 0;
  };

  private handlePointerMove = (e: PointerEvent): void => {
    if (!this.isPointerDown) return;

    const deltaX = e.clientX - this.lastX;
    const deltaY = e.clientY - this.lastY;

    this.totalDragDistance += Math.hypot(deltaX, deltaY);
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    if (this.onDrag && this.totalDragDistance > 3) {
      this.onDrag(deltaX, deltaY);
    }
  };

  private handlePointerUp = (e: PointerEvent): void => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;

    // Check if movement was below tap threshold
    if (this.totalDragDistance < this.dragThreshold && this.onTap) {
      const rect = this.domElement.getBoundingClientRect();
      this.pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointerNDC, this.camera);
      this.onTap(this.raycaster);
    }
  };

  private handlePointerCancel = (): void => {
    this.isPointerDown = false;
  };

  public dispose(): void {
    this.domElement.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerCancel);
  }
}
