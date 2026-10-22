import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly target = new THREE.Vector3(0, 0, 0.4);

  // Position settings
  private baseDistance = 14.5;
  private currentDistance = 14.5;
  private targetDistance = 14.5;

  private elevationAngle = Math.PI * 0.32; // ~57° from horizontal
  private azimuthAngle = 0; // centered frontal view

  private targetAzimuth = 0;
  private targetElevation = Math.PI * 0.32;

  // Trauma screen shake dynamics
  private trauma = 0;
  private readonly shakeOffset = new THREE.Vector3();

  constructor(container: HTMLElement) {
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.1, 100);
    this.resize(container.clientWidth, container.clientHeight);
    this.updateCameraPosition();
  }

  public resize(width: number, height: number): void {
    const aspect = width / Math.max(1, height);
    this.camera.aspect = aspect;

    // Responsive camera distance: zoom out on mobile portrait (9:16)
    if (aspect < 0.6) {
      this.targetDistance = this.baseDistance / Math.max(0.48, aspect * 1.15);
      this.target.set(0, 0, 0.6);
    } else if (aspect < 0.9) {
      this.targetDistance = this.baseDistance / Math.max(0.65, aspect * 1.05);
      this.target.set(0, 0, 0.5);
    } else {
      this.targetDistance = this.baseDistance;
      this.target.set(0, 0, 0.2);
    }

    this.camera.updateProjectionMatrix();
  }

  public addTrauma(amount = 0.25): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public nudgeParallax(deltaX: number, deltaY: number): void {
    // Subtle tilt parallax on drag without breaking stage line-of-sight
    const factor = 0.0008;
    this.targetAzimuth = Math.max(-0.25, Math.min(0.25, this.targetAzimuth + deltaX * factor));
    this.targetElevation = Math.max(
      Math.PI * 0.26,
      Math.min(Math.PI * 0.38, this.targetElevation - deltaY * factor)
    );
  }

  public resetParallax(): void {
    this.targetAzimuth = 0;
    this.targetElevation = Math.PI * 0.32;
  }

  public update(dt: number): void {
    const smoothing = 1 - Math.exp(-12 * dt);
    this.azimuthAngle += (this.targetAzimuth - this.azimuthAngle) * smoothing;
    this.elevationAngle += (this.targetElevation - this.elevationAngle) * smoothing;
    this.currentDistance += (this.targetDistance - this.currentDistance) * smoothing;

    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 4.0);
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
    const cosElev = Math.cos(this.elevationAngle);
    const sinElev = Math.sin(this.elevationAngle);
    const sinAzim = Math.sin(this.azimuthAngle);
    const cosAzim = Math.cos(this.azimuthAngle);

    const x = this.currentDistance * cosElev * sinAzim + this.target.x + this.shakeOffset.x;
    const y = this.currentDistance * sinElev + this.target.y + this.shakeOffset.y;
    const z = this.currentDistance * cosElev * cosAzim + this.target.z + this.shakeOffset.z;

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.target);
  }
}
