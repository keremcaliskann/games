import * as THREE from 'three';

/**
 * Spherical Orbit Camera Rig for responsive 3D puzzle inspection.
 * Decouples drag rotation input from arrow tapping logic.
 */
export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly target = new THREE.Vector3(0, 0, 0);

  // Spherical coordinates
  private radius = 18;
  private theta = Math.PI / 4; // Azimuthal angle
  private phi = Math.PI / 3;   // Polar angle

  private targetTheta = Math.PI / 4;
  private targetPhi = Math.PI / 3;
  private targetRadius = 18;

  // Trauma screen shake dynamics
  private trauma = 0;
  private readonly shakeOffset = new THREE.Vector3();

  constructor(container: HTMLElement) {
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.updateCameraPosition();
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  }

  /**
   * Sets target camera distance; smoothly lerps during frame updates.
   */
  public setDistance(distance: number): void {
    this.targetRadius = distance;
  }

  /**
   * Adds trauma impulse for tactile screen shake upon bonks or heavy impacts.
   */
  public addTrauma(amount = 0.35): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public rotateDelta(deltaX: number, deltaY: number): void {
    // Sensitivity factor
    const factor = 0.007;
    this.targetTheta -= deltaX * factor;
    this.targetPhi -= deltaY * factor;

    // Clamp polar angle to avoid pole flips
    const minPhi = 0.15;
    const maxPhi = Math.PI - 0.15;
    this.targetPhi = Math.max(minPhi, Math.min(maxPhi, this.targetPhi));
  }

  public update(delta: number): void {
    // Smooth damping
    const smoothing = 1 - Math.exp(-15 * delta);
    this.theta += (this.targetTheta - this.theta) * smoothing;
    this.phi += (this.targetPhi - this.phi) * smoothing;
    this.radius += (this.targetRadius - this.radius) * smoothing;

    // Trauma decay and non-linear quadratic shake
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - delta * 3.5);
      const shake = this.trauma * this.trauma * 0.18;
      this.shakeOffset.set(
        (Math.random() - 0.5) * 2 * shake,
        (Math.random() - 0.5) * 2 * shake,
        (Math.random() - 0.5) * 2 * shake
      );
    } else {
      this.shakeOffset.set(0, 0, 0);
    }

    this.updateCameraPosition();
  }

  private updateCameraPosition(): void {
    const x = this.radius * Math.sin(this.phi) * Math.sin(this.theta) + this.shakeOffset.x;
    const y = this.radius * Math.cos(this.phi) + this.shakeOffset.y;
    const z = this.radius * Math.sin(this.phi) * Math.cos(this.theta) + this.shakeOffset.z;

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }
}
