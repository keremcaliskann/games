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
    this.camera = new THREE.PerspectiveCamera(48, aspect, 0.5, 160);
    this.updateProjection();
    this.camera.position.set(0, 19, 17);
    this.camera.lookAt(0, 0, 0);
  }

  public resize(aspect: number): void {
    this.aspect = aspect;
    this.updateProjection();
  }

  private updateProjection(): void {
    this.camera.aspect = this.aspect;
    // Dynamically widen FOV in 9:16 portrait so the circular arena fits cleanly
    this.camera.fov = this.aspect < 1.0 ? 58 : 46;
    this.camera.updateProjectionMatrix();
  }

  public addTrauma(amount: number): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public update(dt: number, focusX: number, focusZ: number, playerScale = 1.0): void {
    this.elapsed += dt;
    this.trauma = Math.max(0, this.trauma - dt * 2.4);
    const shake = this.trauma * this.trauma * 0.55;
    const sx = Math.sin(this.elapsed * 47.0) * shake;
    const sy = Math.cos(this.elapsed * 53.0) * shake;

    const portraitPullback = this.aspect < 1.0 ? 1.24 : 1.0;
    const scalePullback = 1.0 + (playerScale - 1.0) * 0.35;
    const distY = 18.5 * portraitPullback * scalePullback;
    const distZ = 16.5 * portraitPullback * scalePullback;

    _TARGET_POS.set(focusX * 0.55 + sx, distY + sy, focusZ * 0.55 + distZ);
    this.camera.position.lerp(_TARGET_POS, Math.min(1.0, dt * 6.5));

    _LOOK_POS.set(focusX * 0.45, 0.2, focusZ * 0.45);
    this.camera.lookAt(_LOOK_POS);
  }
}
