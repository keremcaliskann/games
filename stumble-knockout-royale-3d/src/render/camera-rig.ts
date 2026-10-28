import * as THREE from 'three';

const _TARGET_POS = new THREE.Vector3();
const _LOOK_POS = new THREE.Vector3();

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private aspect = 1;
  private trauma = 0;
  private elapsed = 0;

  constructor(aspect: number) {
    this.aspect = aspect;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.5, 220);
    this.updateProjection();
    this.camera.position.set(0, 8.5, -10.5);
    this.camera.lookAt(0, 1.2, 8);
  }

  public resize(aspect: number): void {
    this.aspect = aspect;
    this.updateProjection();
  }

  private updateProjection(): void {
    this.camera.aspect = this.aspect;
    this.camera.fov = this.aspect < 1.0 ? 60 : 48;
    this.camera.updateProjectionMatrix();
  }

  public addTrauma(amount: number): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public update(dt: number, playerX: number, playerY: number, playerZ: number): void {
    this.elapsed += dt;
    this.trauma = Math.max(0, this.trauma - dt * 2.5);
    const shake = this.trauma * this.trauma * 0.45;
    const sx = Math.sin(this.elapsed * 47.0) * shake;
    const sy = Math.cos(this.elapsed * 53.0) * shake;

    const portraitFactor = this.aspect < 1.0 ? 1.18 : 1.0;
    _TARGET_POS.set(
      playerX * 0.65 + sx,
      Math.max(4.5, playerY + 7.2 * portraitFactor) + sy,
      playerZ - 10.2 * portraitFactor
    );
    this.camera.position.lerp(_TARGET_POS, Math.min(1.0, dt * 8.0));

    _LOOK_POS.set(playerX * 0.45, Math.max(0.5, playerY + 1.1), playerZ + 7.5);
    this.camera.lookAt(_LOOK_POS);
  }
}
