import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly basePos = new THREE.Vector3(0, 11.2, 17.8);
  private readonly lookTarget = new THREE.Vector3(0, 2.4, 0);
  private trauma = 0;
  private stackPullback = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.5, 120);
    this.updateFov(aspect);
    this.camera.position.copy(this.basePos);
    this.camera.lookAt(this.lookTarget);
  }

  public onResize(aspect: number): void {
    this.camera.aspect = aspect;
    this.updateFov(aspect);
    this.camera.updateProjectionMatrix();
  }

  private updateFov(aspect: number): void {
    if (aspect < 0.75) {
      // 9:16 mobile portrait
      this.camera.fov = 65;
    } else if (aspect < 1.2) {
      this.camera.fov = 56;
    } else {
      // 16:9 landscape
      this.camera.fov = 48;
    }
    this.camera.updateProjectionMatrix();
  }

  public setStackHeight(height: number): void {
    // Height typically ranges from 0 to 8
    this.stackPullback = THREE.MathUtils.clamp((height - 2.0) * 0.35, 0, 3.0);
  }

  public addTrauma(amount: number): void {
    this.trauma = Math.min(this.trauma + amount, 1.0);
  }

  public update(dt: number): void {
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 2.5);
      const shake = this.trauma * this.trauma * 0.6;
      this.camera.position.set(
        this.basePos.x + (Math.random() - 0.5) * shake,
        this.basePos.y + this.stackPullback * 0.4 + (Math.random() - 0.5) * shake,
        this.basePos.z + this.stackPullback + (Math.random() - 0.5) * shake
      );
    } else {
      this.camera.position.set(
        this.basePos.x,
        this.basePos.y + this.stackPullback * 0.4,
        this.basePos.z + this.stackPullback
      );
    }
    this.camera.lookAt(this.lookTarget);
  }
}
