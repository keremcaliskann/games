import * as THREE from 'three';

export class InputManager {
  private isPointerDown = false;
  private pointerPos = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private aimWorldPos = new THREE.Vector3(0, 0, -10);

  constructor(targetEl: HTMLElement, camera: THREE.Camera) {
    this.setupEvents(targetEl, camera);
  }

  public get isFiring(): boolean {
    return this.isPointerDown;
  }

  public get aimPosition(): THREE.Vector3 {
    return this.aimWorldPos;
  }

  private setupEvents(targetEl: HTMLElement, camera: THREE.Camera): void {
    const updateAimFromPointer = (clientX: number, clientY: number) => {
      const rect = targetEl.getBoundingClientRect();
      this.pointerPos.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointerPos.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointerPos, camera);
      const hit = new THREE.Vector3();
      if (this.raycaster.ray.intersectPlane(this.groundPlane, hit)) {
        this.aimWorldPos.copy(hit);
        // Clamp aim in front of turret (negative Z)
        if (this.aimWorldPos.z > 10) this.aimWorldPos.z = 10;
      }
    };

    targetEl.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).closest('button, .hud-interactive, .modal')) return;
      this.isPointerDown = true;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      updateAimFromPointer(e.clientX, e.clientY);
    });

    window.addEventListener('pointermove', (e) => {
      if (this.isPointerDown) {
        updateAimFromPointer(e.clientX, e.clientY);
      }
    });

    const stopFiring = () => {
      this.isPointerDown = false;
    };

    window.addEventListener('pointerup', stopFiring);
    window.addEventListener('pointercancel', stopFiring);
  }
}
