import * as THREE from 'three';
import { GAME_CONFIG } from '../game/config/game-config';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly target = new THREE.Vector3(0, 0, 0);

  // Spherical coordinates
  private baseDistance = GAME_CONFIG.baseCameraDistance;
  private radius = 16;
  private theta = Math.PI / 4;
  private phi = Math.PI / 3;

  private targetTheta = Math.PI / 4;
  private targetPhi = Math.PI / 3;
  private targetRadius = 16;

  // Trauma screen shake dynamics
  private trauma = 0;
  private readonly shakeOffset = new THREE.Vector3();

  constructor(container: HTMLElement) {
    const aspect = container.clientWidth / Math.max(1, container.clientHeight);
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.resize(container.clientWidth, container.clientHeight);
    this.updateCameraPosition();
  }

  public resize(width: number, height: number): void {
    const aspect = width / Math.max(1, height);
    this.camera.aspect = aspect;

    // Responsive camera distance: zoom out on narrow mobile portrait screens (9:16)
    if (aspect < 0.75) {
      this.targetRadius = this.baseDistance / Math.max(0.6, aspect * 1.05);
    } else {
      this.targetRadius = this.baseDistance;
    }

    this.camera.updateProjectionMatrix();
  }

  public setBaseDistance(distance: number): void {
    this.baseDistance = distance;
    this.targetRadius = distance;
  }

  public addTrauma(amount = 0.3): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public rotateDelta(deltaX: number, deltaY: number): void {
    const factor = 0.007;
    this.targetTheta -= deltaX * factor;
    this.targetPhi -= deltaY * factor;

    // Full 360° inspection from top and bottom without pole flips
    this.targetPhi = Math.max(
      GAME_CONFIG.minPolarAngle,
      Math.min(GAME_CONFIG.maxPolarAngle, this.targetPhi)
    );
  }

  public update(dt: number): void {
    const smoothing = 1 - Math.exp(-15 * dt);
    this.theta += (this.targetTheta - this.theta) * smoothing;
    this.phi += (this.targetPhi - this.phi) * smoothing;
    this.radius += (this.targetRadius - this.radius) * smoothing;

    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 3.5);
      const shake = this.trauma * this.trauma * 0.22;
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
