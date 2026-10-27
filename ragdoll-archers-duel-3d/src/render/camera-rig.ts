import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly basePos = new THREE.Vector3(0.5, 3.2, 19.5);
  private readonly lookTarget = new THREE.Vector3(0.8, 2.2, 0);
  private trauma = 0;
  private elapsed = 0;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(46, aspect, 0.5, 140);
    this.resize(aspect);
  }

  public resize(aspect: number): void {
    this.camera.aspect = aspect;
    // Ensure both player bastion (x = -6.5) and enemy bastions (x = +4.5..+9.0) stay 100% visible in 9:16 portrait and 16:9 landscape
    if (aspect < 0.75) {
      // Tall 9:16 mobile portrait
      this.camera.fov = 58;
      this.basePos.set(0.8, 3.8, 27.5);
      this.lookTarget.set(0.8, 2.2, 0);
    } else if (aspect < 1.1) {
      // Square / tablet
      this.camera.fov = 50;
      this.basePos.set(0.8, 3.5, 22.5);
      this.lookTarget.set(0.8, 2.2, 0);
    } else {
      // 16:9 desktop landscape
      this.camera.fov = 44;
      this.basePos.set(0.8, 3.2, 18.5);
      this.lookTarget.set(0.8, 2.3, 0);
    }
    this.camera.updateProjectionMatrix();
    this.camera.position.copy(this.basePos);
    this.camera.lookAt(this.lookTarget);
  }

  public addTrauma(amount: number): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public update(dt: number): void {
    this.elapsed += dt;
    if (this.trauma > 0) {
      const shake = this.trauma * this.trauma * 0.45;
      const ox = Math.sin(this.elapsed * 47) * shake;
      const oy = Math.cos(this.elapsed * 53) * shake;
      this.camera.position.set(
        this.basePos.x + ox,
        this.basePos.y + oy,
        this.basePos.z
      );
      this.trauma = Math.max(0, this.trauma - dt * 2.4);
    } else {
      this.camera.position.copy(this.basePos);
    }
    this.camera.lookAt(this.lookTarget);
  }
}
