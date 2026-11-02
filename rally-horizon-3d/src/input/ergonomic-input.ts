import * as THREE from 'three';

const _TEMP_POS = new THREE.Vector3();

export interface FloatingJoystickUI {
  baseEl: HTMLDivElement;
  knobEl: HTMLDivElement;
  show: (localX: number, localY: number) => void;
  update: (localAnchorX: number, localAnchorY: number, offsetX: number, offsetY: number) => void;
  hide: () => void;
}

/**
 * Shared Universal Input & Camera-Relative Ergonomics Toolkit.
 * Synchronized across all studio games via scripts/sync-shared-core.mjs.
 * Prevents inverted camera axes, laggy fixed-anchor joysticks, missed mobile taps, and HUD click-bleeding.
 */
export class ErgonomicInput {
  /**
   * Checks whether an event target belongs to an interactive HUD button, modal, or Arcade Shell sidebar.
   */
  public static isHudElement(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    return Boolean(
      target.closest(
        '[data-hud-interactive="true"], [data-hud-interactive], button, a, .hud-btn, .booster-btn, .modal-card, .modal-overlay, .br-modal-overlay, .shell-sidebar'
      )
    );
  }

  /**
   * Projects 2D screen input deltas (screenRight = +1 right, screenUp = +1 up on screen)
   * onto the 3D XZ ground plane relative to the active camera's true viewing orientation.
   * Eliminates inverted Left/Right or Up/Down controls regardless of camera position or angle.
   */
  public static screenToCameraWorldXZ(
    screenRight: number,
    screenUp: number,
    camera: THREE.Camera,
    out: { x: number; z: number }
  ): { x: number; z: number } {
    camera.updateMatrixWorld();
    const e = camera.matrixWorld.elements;

    // Camera local +X (Right) projected onto XZ plane
    let rx = e[0];
    let rz = e[2];
    const rLen = Math.hypot(rx, rz);
    if (rLen > 0.0001) {
      rx /= rLen;
      rz /= rLen;
    } else {
      rx = 1;
      rz = 0;
    }

    // Camera local -Z (Forward into screen) projected onto XZ plane
    let fx = -e[8];
    let fz = -e[10];
    const fLen = Math.hypot(fx, fz);
    if (fLen > 0.0001) {
      fx /= fLen;
      fz /= fLen;
    } else {
      fx = 0;
      fz = -1;
    }

    out.x = screenRight * rx + screenUp * fx;
    out.z = screenRight * rz + screenUp * fz;
    return out;
  }

  /**
   * Creates a responsive visual Floating Virtual Thumbstick overlay inside the given stage container.
   */
  public static createFloatingJoystick(
    container: HTMLElement,
    knobColor = 'rgba(250, 204, 21, 0.94)'
  ): FloatingJoystickUI {
    const baseEl = document.createElement('div');
    baseEl.style.cssText =
      'position:absolute;width:86px;height:86px;margin-left:-43px;margin-top:-43px;border-radius:50%;border:3px solid rgba(255,255,255,0.68);background:rgba(15,23,42,0.26);pointer-events:none;display:none;z-index:25;backdrop-filter:blur(2px);';
    const knobEl = document.createElement('div');
    knobEl.style.cssText = `position:absolute;left:50%;top:50%;width:36px;height:36px;margin-left:-18px;margin-top:-18px;border-radius:50%;background:${knobColor};box-shadow:0 4px 12px rgba(0,0,0,0.32);`;
    baseEl.appendChild(knobEl);
    container.appendChild(baseEl);

    return {
      baseEl,
      knobEl,
      show(localX: number, localY: number): void {
        baseEl.style.display = 'block';
        baseEl.style.left = `${localX}px`;
        baseEl.style.top = `${localY}px`;
        knobEl.style.transform = 'translate(0px, 0px)';
      },
      update(localAnchorX: number, localAnchorY: number, offsetX: number, offsetY: number): void {
        baseEl.style.left = `${localAnchorX}px`;
        baseEl.style.top = `${localAnchorY}px`;
        knobEl.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      },
      hide(): void {
        baseEl.style.display = 'none';
      },
    };
  }

  /**
   * Finds the closest candidate entity to a 3D ray within `maxRadiusMeters` when a direct mesh raycast misses.
   * Ideal for small screws, arrow blocks, buses, or dispensers on mobile touchscreens.
   */
  public static findMagneticRayTarget<T>(
    ray: THREE.Ray,
    candidates: readonly T[],
    getWorldPos: (item: T, out: THREE.Vector3) => THREE.Vector3,
    isEligible: (item: T) => boolean,
    maxRadiusMeters = 0.65
  ): T | null {
    let best: T | null = null;
    let bestDistSq = maxRadiusMeters * maxRadiusMeters;
    for (let i = 0; i < candidates.length; i++) {
      const item = candidates[i];
      if (!isEligible(item)) continue;
      getWorldPos(item, _TEMP_POS);
      const dSq = ray.distanceSqToPoint(_TEMP_POS);
      if (dSq < bestDistSq) {
        bestDistSq = dSq;
        best = item;
      }
    }
    return best;
  }
}
