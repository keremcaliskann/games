import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly basePos = new THREE.Vector3(0, 16.5, 17.5);
  private readonly target = new THREE.Vector3(0, 0.4, 0.5);
  private trauma = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(54, aspect, 0.5, 150);
    this.updateFov(aspect);
    this.camera.position.copy(this.basePos);
    this.camera.lookAt(this.target);
  }

  public onResize(aspect: number): void {
    this.camera.aspect = aspect;
    this.updateFov(aspect);
    this.camera.updateProjectionMatrix();
  }

  private updateFov(aspect: number): void {
    if (aspect < 1.0) {
      // Mobile 9:16 portrait
      this.camera.fov = 70;
    } else if (aspect < 1.4) {
      this.camera.fov = 60;
    } else {
      // Desktop 16:9 landscape
      this.camera.fov = 52;
    }
    this.camera.updateProjectionMatrix();
  }

  public addTrauma(amount: number): void {
    this.trauma = Math.min(this.trauma + amount, 1.0);
  }

  public update(dt: number): void {
    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 2.5);
      const shake = this.trauma * this.trauma * 0.45;
      this.camera.position.set(
        this.basePos.x + (Math.random() - 0.5) * shake,
        this.basePos.y + (Math.random() - 0.5) * shake,
        this.basePos.z + (Math.random() - 0.5) * shake * 0.5
      );
    } else {
      this.camera.position.copy(this.basePos);
    }
    this.camera.lookAt(this.target);
  }
}
