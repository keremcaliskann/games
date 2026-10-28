import * as THREE from 'three';
import { FactoryManager } from '../game/systems/factory-manager';
import { CameraRig } from '../render/camera-rig';

const _GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5);
const _PLANE_HIT = new THREE.Vector3();

export class InputManager {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();

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
    window.addEventListener('keydown', this.onKeyDown);
  }

  private readonly onPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    this.raycaster.setFromCamera(this.pointer, this.cameraRig.camera);

    // 1. Direct recursive raycast against full dispenser 3D groups
    const roots = this.factoryManager.dispensers.map((d) => d.root);
    const intersects = this.raycaster.intersectObjects(roots, true);

    if (intersects.length > 0) {
      let cur: THREE.Object3D | null = intersects[0].object;
      while (cur) {
        const dispenser = this.factoryManager.dispensers.find((d) => d.root === cur);
        if (dispenser) {
          this.factoryManager.handleDispenserTap(dispenser);
          return;
        }
        cur = cur.parent;
      }
    }

    // 2. Magnetic Proximity Assist: pick closest dispenser within 2.3m on ground plane
    if (this.raycaster.ray.intersectPlane(_GROUND_PLANE, _PLANE_HIT)) {
      let bestDisp = null;
      let bestDist = 2.3;
      for (let i = 0; i < this.factoryManager.dispensers.length; i++) {
        const d = this.factoryManager.dispensers[i];
        if (d.remainingCount <= 0) continue;
        const dist = Math.hypot(
          d.root.position.x - _PLANE_HIT.x,
          d.root.position.z - _PLANE_HIT.z
        );
        if (dist < bestDist) {
          bestDist = dist;
          bestDisp = d;
        }
      }
      if (bestDisp) {
        this.factoryManager.handleDispenserTap(bestDisp);
      }
    }
  };

  private readonly onPointerMove = (e: PointerEvent): void => {
    const rect = this.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    this.cameraRig.setParallax(x, y);
  };

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    const idxMap: Record<string, number> = {
      Digit1: 0,
      Digit2: 1,
      Digit3: 2,
      Digit4: 3,
      KeyA: 0,
      KeyW: 1,
      KeyD: 2,
      KeyS: 3,
      ArrowLeft: 0,
      ArrowUp: 1,
      ArrowRight: 2,
      ArrowDown: 3,
    };
    if (e.code in idxMap) {
      const disp = this.factoryManager.dispensers[idxMap[e.code]];
      if (disp && disp.remainingCount > 0) {
        this.factoryManager.handleDispenserTap(disp);
      }
    } else if (e.code === 'Space') {
      e.preventDefault();
      // Smart Spacebar: trigger dispenser matching an active crate's needed color
      for (let i = 0; i < this.factoryManager.activeCrates.length; i++) {
        const crate = this.factoryManager.activeCrates[i];
        const match = this.factoryManager.dispensers.find(
          (d) => d.colorId === crate.colorId && d.remainingCount > 0
        );
        if (match) {
          this.factoryManager.handleDispenserTap(match);
          return;
        }
      }
      const fallback = this.factoryManager.dispensers.find((d) => d.remainingCount > 0);
      if (fallback) this.factoryManager.handleDispenserTap(fallback);
    }
  };

  public destroy(): void {
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('keydown', this.onKeyDown);
  }
}
