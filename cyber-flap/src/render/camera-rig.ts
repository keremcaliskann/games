import * as THREE from 'three';

export class CameraRig {
  readonly camera: THREE.PerspectiveCamera;
  private baseZ = 18;
  private shakeIntensity = 0;

  constructor(width: number, height: number) {
    this.camera = new THREE.PerspectiveCamera(50, width / Math.max(1, height), 0.5, 140);
    this.resize(width, height);
    this.camera.position.set(1.5, 0, this.baseZ);
    this.camera.lookAt(1.5, 0, 0);
  }

  resize(width: number, height: number): void {
    const aspect = width / Math.max(1, height);
    this.camera.aspect = aspect;
    // Scale camera distance on narrow portrait screens so the vertical playfield always fits
    this.baseZ = aspect < 0.85 ? 18 / Math.max(0.58, aspect * 0.95) : 18;
    this.camera.position.z = this.baseZ;
    this.camera.updateProjectionMatrix();
  }

  triggerShake(intensity: number): void {
    this.shakeIntensity = intensity;
  }

  triggerFlapKick(): void {
    // No-op: Removed jarring FOV warp on routine flaps to maintain a stable, comfortable view
  }

  update(dtSec: number, targetY: number): void {
    // Calmer, gentler vertical camera follow to prevent jarring jerks on flap
    const desiredY = THREE.MathUtils.clamp(targetY * 0.12, -1.2, 1.2);
    this.camera.position.y = THREE.MathUtils.lerp(
      this.camera.position.y,
      desiredY,
      Math.min(1, dtSec * 4),
    );

    if (this.shakeIntensity > 0.005) {
      const offsetX = (Math.sin(performance.now() * 0.09) * 0.5) * this.shakeIntensity;
      const offsetY = (Math.cos(performance.now() * 0.11) * 0.5) * this.shakeIntensity;
      this.camera.position.x = 1.5 + offsetX;
      this.camera.position.y += offsetY;
      this.shakeIntensity = Math.max(0, this.shakeIntensity - dtSec * 2.8);
    } else {
      this.camera.position.x = 1.5;
      this.shakeIntensity = 0;
    }

    this.camera.lookAt(2.0, this.camera.position.y * 0.35, 0);

    // Dynamic rotational roll kick only on genuine crash / impact shakes
    if (this.shakeIntensity > 0.005) {
      this.camera.rotation.z += Math.sin(performance.now() * 0.14) * 0.045 * this.shakeIntensity;
    }
  }
}
