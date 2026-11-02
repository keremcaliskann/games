import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private currentLookAt = new THREE.Vector3(0, 0, 0);
  private targetLookAt = new THREE.Vector3(0, 0, 0);

  // Dynamic scaling parameters
  private readonly baseElevation = 21;
  private readonly baseDistance = 15;
  private currentElevation = 21;
  private currentDistance = 15;
  private stageZoomKick = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.5, 320);
    this.updateFov(aspect);
    this.camera.position.set(0, this.baseElevation, this.baseDistance);
    this.camera.lookAt(0, 0, 0);
  }

  public triggerStageZoomKick(): void {
    this.stageZoomKick = 5.5;
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

    if (this.stageZoomKick > 0) {
      this.stageZoomKick = Math.max(0, this.stageZoomKick - dt * 6.5);
    }

    // Target camera distance based on hole scale (stronger scale shift per meter grown)
    const growthDelta = Math.max(0, playerRadius - 1.15);
    const targetElev = this.baseElevation + growthDelta * 6.4 + this.stageZoomKick;
    const targetDist = this.baseDistance + growthDelta * 5.2 + this.stageZoomKick * 0.7;

    // Smooth lerp (frame-rate independent)
    const factor = Math.min(dt * 4.5, 1.0);
    this.currentElevation += (targetElev - this.currentElevation) * factor;
    this.currentDistance += (targetDist - this.currentDistance) * factor;
    this.currentLookAt.lerp(this.targetLookAt, Math.min(dt * 8.0, 1.0));

    this.camera.position.set(
      this.currentLookAt.x,
      this.currentLookAt.y + this.currentElevation,
      this.currentLookAt.z + this.currentDistance
    );
    this.camera.lookAt(this.currentLookAt);
  }
}
