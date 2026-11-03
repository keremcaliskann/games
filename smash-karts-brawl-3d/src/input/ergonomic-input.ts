import * as THREE from 'three';

const _TEMP_POS = new THREE.Vector3();
const _NDC = new THREE.Vector2();
const _RAYCASTER = new THREE.Raycaster();
const _GROUND_PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

export interface FloatingJoystickUI {
  baseEl: HTMLDivElement;
  knobEl: HTMLDivElement;
  show: (localX: number, localY: number) => void;
  update: (localAnchorX: number, localAnchorY: number, offsetX: number, offsetY: number) => void;
  hide: () => void;
}

export interface DynamicJoystickState {
  active: boolean;
  pointerId: number;
  anchorX: number;
  anchorY: number;
  normX: number;
  normY: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Genre-Agnostic Universal Input & Camera-Relative Ergonomics Toolkit.
 * Synchronized across all active games via scripts/sync-shared-core.mjs.
 * Provides:
 * - HUD / Modal / Form click-bleed isolation (`isHudElement`)
 * - Camera-relative 3D ground movement projection (`screenToCameraWorldXZ`)
 * - Zero-allocation screen-to-world horizontal plane intersection (`screenToGroundPlane`)
 * - Visual floating thumbstick + dynamic following anchor math (`createFloatingJoystick`, `updateDynamicJoystick`)
 * - Magnetic 3D raycast tap-assist fallback (`findMagneticRayTarget`)
 * - Focus-safe Keyboard Axis & Single-Shot Action tracker (`KeyboardTracker`)
 */
export class ErgonomicInput {
  /**
   * Checks whether an event target belongs to any interactive HUD control, modal, form input, or Arcade Shell element.
   */
  public static isHudElement(target: EventTarget | null): boolean {
    if (!(target instanceof Element)) return false;
    return Boolean(
      target.closest(
        '[data-hud-interactive="true"], [data-hud-interactive], button, a, input, select, textarea, label, [role="button"], .hud-btn, .booster-btn, .modal-card, .modal-overlay, .br-modal-overlay, .shell-sidebar, .shell-start-menu-overlay, .shell-stage-pause-btn'
      )
    );
  }

  /**
   * Projects 2D screen input deltas (screenRight = +1 right, screenUp = +1 up on screen)
   * onto the 3D XZ ground plane relative to the active camera's true viewing orientation.
   * Eliminates inverted Left/Right or Up/Down controls regardless of camera position or orbit angle.
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
   * Projects a screen pointer coordinate (clientX, clientY) onto a horizontal world plane (y = planeY)
   * with zero heap allocations. Returns true if the ray intersects the plane in front of the camera.
   */
  public static screenToGroundPlane(
    clientX: number,
    clientY: number,
    container: HTMLElement,
    camera: THREE.Camera,
    planeY: number,
    outWorldPos: THREE.Vector3
  ): boolean {
    const rect = container.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    _NDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    _NDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    _RAYCASTER.setFromCamera(_NDC, camera);
    _GROUND_PLANE.constant = -planeY;
    const hit = _RAYCASTER.ray.intersectPlane(_GROUND_PLANE, outWorldPos);
    return hit !== null;
  }

  /**
   * Updates a dynamic-anchor virtual joystick state from pointer coordinates.
   * Pulls the anchor along with the finger when `maxRadiusPx` is exceeded so direction reversals are instantaneous.
   */
  public static updateDynamicJoystick(
    localX: number,
    localY: number,
    state: DynamicJoystickState,
    maxRadiusPx = 46,
    deadzonePx = 4
  ): void {
    const dx = localX - state.anchorX;
    const dy = localY - state.anchorY;
    const dist = Math.hypot(dx, dy);

    if (dist <= deadzonePx) {
      state.normX = 0;
      state.normY = 0;
      state.offsetX = 0;
      state.offsetY = 0;
      return;
    }

    const dirX = dx / dist;
    const dirY = dy / dist;

    if (dist > maxRadiusPx) {
      const excess = dist - maxRadiusPx;
      state.anchorX += dirX * excess;
      state.anchorY += dirY * excess;
    }

    const clampedDist = Math.min(dist, maxRadiusPx);
    const mag = clampedDist / maxRadiusPx;
    state.normX = dirX * mag;
    state.normY = dirY * mag;
    state.offsetX = dirX * clampedDist;
    state.offsetY = dirY * clampedDist;
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
   * Finds the closest candidate 3D entity to a ray within `maxRadiusMeters` when a direct mesh raycast misses.
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

/**
 * Genre-Agnostic Keyboard Axis & Action Trigger Tracker.
 * Automatically clears held keys on window blur or visibility loss.
 */
export class KeyboardTracker {
  private readonly heldCodes = new Set<string>();
  private readonly justPressedCodes = new Set<string>();

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    if (ErgonomicInput.isHudElement(e.target)) return;
    if (!this.heldCodes.has(e.code)) {
      this.justPressedCodes.add(e.code);
    }
    this.heldCodes.add(e.code);
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    this.heldCodes.delete(e.code);
  };

  private readonly onReset = (): void => {
    this.heldCodes.clear();
    this.justPressedCodes.clear();
  };

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', this.onKeyDown);
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('blur', this.onReset);
      document.addEventListener('visibilitychange', this.onReset);
    }
  }

  public isHeld(code: string): boolean {
    return this.heldCodes.has(code);
  }

  /**
   * Returns true once per keydown press (ideal for toggle keys like Camera `KeyC`, Diff-Lock `KeyE`, Lights `KeyL`, Reset `KeyR`).
   */
  public consumePress(code: string): boolean {
    if (this.justPressedCodes.has(code)) {
      this.justPressedCodes.delete(code);
      return true;
    }
    return false;
  }

  /**
   * Reads standard WASD + Arrow key axes into `out` (`x`: -1 left .. +1 right, `y`: -1 down/brake .. +1 up/throttle).
   */
  public readAxes(out: { x: number; y: number }): { x: number; y: number } {
    let x = 0;
    let y = 0;
    if (this.heldCodes.has('KeyA') || this.heldCodes.has('ArrowLeft')) x -= 1;
    if (this.heldCodes.has('KeyD') || this.heldCodes.has('ArrowRight')) x += 1;
    if (this.heldCodes.has('KeyS') || this.heldCodes.has('ArrowDown')) y -= 1;
    if (this.heldCodes.has('KeyW') || this.heldCodes.has('ArrowUp')) y += 1;
    out.x = x;
    out.y = y;
    return out;
  }

  public clear(): void {
    this.onReset();
  }

  public dispose(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.onKeyDown);
      window.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('blur', this.onReset);
      document.removeEventListener('visibilitychange', this.onReset);
    }
  }
}
