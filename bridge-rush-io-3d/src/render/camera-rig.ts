import * as THREE from 'three';

const _TARGET_POS = new THREE.Vector3();
const _LOOK_AT = new THREE.Vector3();

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private trauma = 0;
  private elapsed = 0;
  private isPortrait = false;

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.5, 220);
    this.resize(aspect);
    this.camera.position.set(0, 14, -14);
    this.camera.lookAt(0, 0, 6);
  }

  public resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.isPortrait = aspect < 1.0;
    this.camera.fov = this.isPortrait ? 58 : 46;
    this.camera.updateProjectionMatrix();
  }

  public addTrauma(amount: number): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public update(dt: number, playerPos: THREE.Vector3, brickCount: number): void {
    this.elapsed += dt;
    this.trauma = Math.max(0, this.trauma - dt * 2.4);
    const shake = this.trauma * this.trauma * 0.45;
    const sx = Math.sin(this.elapsed * 42.0) * shake;
    const sy = Math.cos(this.elapsed * 49.0) * shake;

    const stackZoom = Math.min(6.0, brickCount * 0.12);
    const distZ = (this.isPortrait ? 15.8 : 13.8) + stackZoom * 0.7;
    const heightY = (this.isPortrait ? 13.8 : 11.8) + stackZoom * 0.65;

    _TARGET_POS.set(
      playerPos.x * 0.75 + sx,
      playerPos.y + heightY + sy,
      playerPos.z - distZ
    );
    this.camera.position.lerp(_TARGET_POS, Math.min(1.0, dt * 7.5));

    _LOOK_AT.set(playerPos.x * 0.85, playerPos.y + 1.2, playerPos.z + 4.8);
    this.camera.lookAt(_LOOK_AT);
  }
}
