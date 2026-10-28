import * as THREE from 'three';
import { BusEntity } from '../game/entities/bus';

const _GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.4);
const _PLANE_HIT = new THREE.Vector3();

export class InputManager {
  private readonly raycaster = new THREE.Raycaster();
  private readonly mouse = new THREE.Vector2();
  private hasValidRay = false;

  constructor(
    private readonly container: HTMLElement,
    private readonly camera: THREE.Camera,
    private readonly onSelectBus: (bus: BusEntity) => void
  ) {
    this.setupListeners();
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
        this.hasValidRay = false;
        return;
      }

      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      this.hasValidRay = true;
    });
  }

  public checkBusRaycast(buses: BusEntity[]): BusEntity | null {
    if (!this.hasValidRay) return null;
    this.hasValidRay = false;

    const busRoots = buses.map((b) => b.root);
    const intersects = this.raycaster.intersectObjects(busRoots, true);

    if (intersects.length > 0) {
      let hitObj: THREE.Object3D | null = intersects[0].object;
      while (hitObj && hitObj.parent) {
        const found = buses.find((b) => b.root === hitObj);
        if (found) {
          this.onSelectBus(found);
          return found;
        }
        hitObj = hitObj.parent;
      }
    }

    // Magnetic Proximity Assist: if player tapped slightly beside a bus, pick nearest idle bus within 2.1m
    if (this.raycaster.ray.intersectPlane(_GROUND_PLANE, _PLANE_HIT)) {
      let bestBus: BusEntity | null = null;
      let bestDist = 2.1;
      for (let i = 0; i < buses.length; i++) {
        const b = buses[i];
        if (b.isDriving || b.isDeparting || b.isHeloFlying || b.isDocked) continue;
        const d = Math.hypot(
          b.root.position.x - _PLANE_HIT.x,
          b.root.position.z - _PLANE_HIT.z
        );
        if (d < bestDist) {
          bestDist = d;
          bestBus = b;
        }
      }
      if (bestBus) {
        this.onSelectBus(bestBus);
        return bestBus;
      }
    }

    return null;
  }
}
