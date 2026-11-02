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
    // Standard Three.js camera at +Z looking toward -Z:
    // Screen Right = +X, Screen Left = -X, Screen Up = -Z, Screen Down = +Z
    this.camera.position.set(0, 16, 35);
    this.camera.lookAt(0, 0, 18);
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

  public update(dt: number, playerPos: THREE.Vector3, powerCubes: number): void {
    this.elapsed += dt;
    this.trauma = Math.max(0, this.trauma - dt * 2.5);
    const shake = this.trauma * this.trauma * 0.52;
    const sx = Math.sin(this.elapsed * 44.0) * shake;
    const sy = Math.cos(this.elapsed * 51.0) * shake;

    const zoomBonus = Math.min(4.0, powerCubes * 0.25);
    const distZ = (this.isPortrait ? 18.0 : 15.5) + zoomBonus * 0.6;
    const heightY = (this.isPortrait ? 16.0 : 14.0) + zoomBonus * 0.55;

    _TARGET_POS.set(
      playerPos.x * 0.92 + sx,
      playerPos.y + heightY + sy,
      playerPos.z + distZ
    );
    this.camera.position.lerp(_TARGET_POS, Math.min(1.0, dt * 8.5));

    _LOOK_AT.set(playerPos.x * 0.95, playerPos.y + 0.6, playerPos.z - 2.2);
    this.camera.lookAt(_LOOK_AT);
  }
}
