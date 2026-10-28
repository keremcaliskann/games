import * as THREE from 'three';

const _HIT_POINT = new THREE.Vector3();

export class InputManager {
  private isPointerDown = false;
  private isKeyFiring = false;
  private pointerPos = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private aimWorldPos = new THREE.Vector3(0, 0, -10);

  constructor(targetEl: HTMLElement, camera: THREE.Camera) {
    this.setupEvents(targetEl, camera);
  }

  public get isFiring(): boolean {
    return this.isPointerDown || this.isKeyFiring;
  }

  public get aimPosition(): THREE.Vector3 {
    return this.aimWorldPos;
  }

  private setupEvents(targetEl: HTMLElement, camera: THREE.Camera): void {
    const updateAimFromPointer = (clientX: number, clientY: number) => {
      const rect = targetEl.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      this.pointerPos.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointerPos.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointerPos, camera);
      if (this.raycaster.ray.intersectPlane(this.groundPlane, _HIT_POINT)) {
        this.aimWorldPos.copy(_HIT_POINT);
        if (this.aimWorldPos.z > 10) this.aimWorldPos.z = 10;
      }
    };

    targetEl.addEventListener('pointerdown', (e) => {
      if (
        (e.target as HTMLElement).closest(
          'button, .hud-interactive, .modal, .modal-overlay, .shell-sidebar, [data-hud-interactive="true"]'
        )
      ) {
        return;
      }
      this.isPointerDown = true;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      updateAimFromPointer(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
      const rect = targetEl.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (this.isPointerDown || (e.pointerType === 'mouse' && inside)) {
        updateAimFromPointer(e.clientX, e.clientY);
      }
    });

    const stopFiring = () => {
      this.isPointerDown = false;
    };

    window.addEventListener('pointerup', stopFiring);
    window.addEventListener('pointercancel', stopFiring);

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.aimWorldPos.x = Math.max(-14, this.aimWorldPos.x - 1.5);
        this.isKeyFiring = true;
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.aimWorldPos.x = Math.min(14, this.aimWorldPos.x + 1.5);
        this.isKeyFiring = true;
      } else if (e.code === 'Space') {
        this.isKeyFiring = true;
      }
    });

    window.addEventListener('keyup', (e: KeyboardEvent) => {
      if (
        e.code === 'Space' ||
        e.code === 'ArrowLeft' ||
        e.code === 'KeyA' ||
        e.code === 'ArrowRight' ||
        e.code === 'KeyD'
      ) {
        this.isKeyFiring = false;
      }
    });
  }
}
