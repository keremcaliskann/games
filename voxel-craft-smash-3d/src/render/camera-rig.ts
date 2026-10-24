import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private basePos = new THREE.Vector3(0, 22, 28);
  private lookTarget = new THREE.Vector3(0, 4, -4);
  private shakeIntensity = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.5, 200);
    this.updateFov(aspect);
    this.camera.position.copy(this.basePos);
    this.camera.lookAt(this.lookTarget);
  }

  public resize(width: number, height: number): void {
    const aspect = width / height;
    this.camera.aspect = aspect;
    this.updateFov(aspect);
    this.camera.updateProjectionMatrix();
  }

  private updateFov(aspect: number): void {
    if (aspect < 1.0) {
      this.camera.fov = 60; // Wider FOV for vertical phone displays
      this.basePos.set(0, 25, 32);
    } else {
      this.camera.fov = 46;
      this.basePos.set(0, 20, 26);
    }
    this.camera.updateProjectionMatrix();
  }

  public addShake(amount = 0.5): void {
    this.shakeIntensity = Math.min(this.shakeIntensity + amount, 1.2);
  }

  public update(dt: number): void {
    if (this.shakeIntensity > 0) {
      this.shakeIntensity = Math.max(0, this.shakeIntensity - dt * 3.5);
      const sx = (Math.random() - 0.5) * this.shakeIntensity * 0.8;
      const sy = (Math.random() - 0.5) * this.shakeIntensity * 0.6;
      const sz = (Math.random() - 0.5) * this.shakeIntensity * 0.8;
      this.camera.position.set(this.basePos.x + sx, this.basePos.y + sy, this.basePos.z + sz);
    } else {
      this.camera.position.copy(this.basePos);
    }

    this.camera.lookAt(this.lookTarget);
  }
}
