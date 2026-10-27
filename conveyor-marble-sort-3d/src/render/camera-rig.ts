import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly basePos = new THREE.Vector3(0, 16.5, 17.5);
  private readonly target = new THREE.Vector3(0, 0, 0);
  private parallaxX = 0;
  private parallaxY = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.5, 120);
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
    if (aspect < 0.65) {
      // 9:16 mobile tall portrait
      this.camera.fov = 68;
    } else if (aspect < 0.95) {
      this.camera.fov = 58;
    } else if (aspect < 1.3) {
      this.camera.fov = 52;
    } else {
      // 16:9 landscape
      this.camera.fov = 46;
    }
    this.camera.updateProjectionMatrix();
  }

  public setParallax(px: number, py: number): void {
    this.parallaxX = px;
    this.parallaxY = py;
  }

  public update(dt: number): void {
    const targetX = this.basePos.x + this.parallaxX * 0.7;
    const targetY = this.basePos.y + this.parallaxY * 0.5;
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, targetX, dt * 3.5);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, targetY, dt * 3.5);
    this.camera.lookAt(this.target);
  }
}
