import * as THREE from 'three';
import { FactoryManager } from '../game/systems/factory-manager';
import { CameraRig } from '../render/camera-rig';

export class InputManager {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly cameraRig: CameraRig,
    private readonly factoryManager: FactoryManager
  ) {
    this.init();
  }

  private init(): void {
    this.canvas.addEventListener('pointerdown', this.onPointerDown);
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerup', this.onPointerUp);
  }

  private readonly onPointerDown = (e: PointerEvent): void => {
    // Only handle primary button
    if (e.button !== 0) return;
    this.isPointerDown = true;
    this.pointerStartX = e.clientX;
    this.pointerStartY = e.clientY;
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    this.cameraRig.setParallax(x, y);
  };

  private readonly onPointerUp = (e: PointerEvent): void => {
    if (!this.isPointerDown) return;
    this.isPointerDown = false;

    // Reject long drags
    const dist = Math.hypot(e.clientX - this.pointerStartX, e.clientY - this.pointerStartY);
    if (dist > 15) return;

    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    this.raycaster.setFromCamera(this.pointer, this.cameraRig.camera);

    const hitTargets = this.factoryManager.dispensers.map((d) => d.hitTarget);
    const intersects = this.raycaster.intersectObjects(hitTargets, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const dispenser = this.factoryManager.dispensers.find((d) => d.hitTarget === hitMesh);
      if (dispenser) {
        this.factoryManager.handleDispenserTap(dispenser);
      }
    }
  };

  public destroy(): void {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerup', this.onPointerUp);
  }
}
