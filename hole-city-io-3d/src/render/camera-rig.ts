import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private currentLookAt = new THREE.Vector3(0, 0, 0);
  private targetLookAt = new THREE.Vector3(0, 0, 0);

  // Dynamic scaling parameters
  private readonly baseElevation = 26;
  private readonly baseDistance = 18;
  private currentElevation = 26;
  private currentDistance = 18;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.5, 300);
    this.updateFov(aspect);
    this.camera.position.set(0, this.baseElevation, this.baseDistance);
    this.camera.lookAt(0, 0, 0);
  }

  public resize(width: number, height: number): void {
    const aspect = width / height;
    this.camera.aspect = aspect;
    this.updateFov(aspect);
    this.camera.updateProjectionMatrix();
  }

  private updateFov(aspect: number): void {
    // 9:16 portrait mobile app ergonomics: wider FOV to see arena around hole
    if (aspect < 1.0) {
      this.camera.fov = 62;
    } else {
      this.camera.fov = 48;
    }
  }

  public update(playerPos: THREE.Vector3, playerRadius: number, dt: number): void {
    this.targetLookAt.copy(playerPos);

    // Target camera distance based on hole scale
    const targetElev = this.baseElevation + (playerRadius - 1.15) * 4.6;
    const targetDist = this.baseDistance + (playerRadius - 1.15) * 3.8;

    // Smooth lerp (frame-rate independent)
    const factor = Math.min(dt * 5.0, 1.0);
    this.currentElevation += (targetElev - this.currentElevation) * factor;
    this.currentDistance += (targetDist - this.currentDistance) * factor;
    this.currentLookAt.lerp(this.targetLookAt, factor);

    this.camera.position.set(
      this.currentLookAt.x,
      this.currentLookAt.y + this.currentElevation,
      this.currentLookAt.z + this.currentDistance
    );
    this.camera.lookAt(this.currentLookAt);
  }
}
