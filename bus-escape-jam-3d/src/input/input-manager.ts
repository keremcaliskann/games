import * as THREE from 'three';
import { BusEntity } from '../game/entities/bus';

export class InputManager {
  private readonly raycaster = new THREE.Raycaster();
  private readonly mouse = new THREE.Vector2();

  constructor(
    private readonly container: HTMLElement,
    private readonly camera: THREE.Camera,
    private readonly onSelectBus: (bus: BusEntity) => void
  ) {
    this.setupListeners();
  }

  private setupListeners(): void {
    this.container.addEventListener('pointerup', (e) => {
      // Isolate clicks on HUD interactive buttons
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

      const rect = this.container.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
    });
  }

  public checkBusRaycast(buses: BusEntity[]): BusEntity | null {
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
    return null;
  }
}
