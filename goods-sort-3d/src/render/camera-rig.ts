import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly basePos = new THREE.Vector3(0, 1.2, 14.5);
  private readonly target = new THREE.Vector3(0, 0.8, 0);
  private parallaxX = 0;
  private parallaxY = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.5, 100);
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
    if (aspect < 0.75) {
      // 9:16 mobile portrait
      this.camera.fov = 64;
    } else if (aspect < 1.2) {
      this.camera.fov = 54;
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
    this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, this.basePos.x + this.parallaxX * 0.8, dt * 4.0);
    this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, this.basePos.y + this.parallaxY * 0.6, dt * 4.0);
    this.camera.lookAt(this.target);
  }
}
