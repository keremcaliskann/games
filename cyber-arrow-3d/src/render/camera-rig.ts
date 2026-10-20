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

  constructor(container: HTMLElement) {
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.updateCameraPosition();
  }

  public resize(width: number, height: number): void {
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
  }

  public setDistance(distance: number): void {
    this.targetRadius = distance;
    this.radius = distance;
    this.updateCameraPosition();
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

    this.updateCameraPosition();
  }

  private updateCameraPosition(): void {
    const x = this.radius * Math.sin(this.phi) * Math.sin(this.theta);
    const y = this.radius * Math.cos(this.phi);
    const z = this.radius * Math.sin(this.phi) * Math.cos(this.theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }
}
