import * as THREE from 'three';

const _TARGET_CAM_POS = new THREE.Vector3();
const _LOOK_TARGET = new THREE.Vector3();

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly smoothedPos = new THREE.Vector3(0, 12, -16);
  private readonly smoothedLook = new THREE.Vector3(0, 1, 10);
  private currentYaw = 0;
  private aspect = 1.0;
  private trauma = 0;

  constructor(aspect: number) {
    this.aspect = aspect;
    const fov = aspect < 1.0 ? 64 : 54;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, 0.5, 320);
    this.camera.position.copy(this.smoothedPos);
    this.camera.lookAt(this.smoothedLook);
  }

  public resize(aspect: number): void {
    this.aspect = aspect;
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 1.0 ? 64 : 54;
    this.camera.updateProjectionMatrix();
  }

  public addTrauma(amount: number): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public snapToCar(carPos: THREE.Vector3, headingRad: number): void {
    this.currentYaw = headingRad;
    const dist = this.aspect < 1.0 ? 15.5 : 13.0;
    const height = this.aspect < 1.0 ? 9.8 : 8.2;
    this.smoothedPos.set(
      carPos.x - Math.sin(headingRad) * dist,
      carPos.y + height,
      carPos.z - Math.cos(headingRad) * dist
    );
    this.smoothedLook.set(
      carPos.x + Math.sin(headingRad) * 9.5,
      carPos.y + 1.2,
      carPos.z + Math.cos(headingRad) * 9.5
    );
    this.camera.position.copy(this.smoothedPos);
    this.camera.lookAt(this.smoothedLook);
  }

  public update(
    dt: number,
    carPos: THREE.Vector3,
    headingRad: number,
    driftAngleRad: number,
    nitroActive: boolean
  ): void {
    // Smooth centrifugal yaw follow
    let diff = headingRad - this.currentYaw;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.currentYaw += diff * Math.min(1.0, dt * 6.5);

    const baseDist = this.aspect < 1.0 ? 15.2 : 12.6;
    const dist = baseDist + (nitroActive ? 1.8 : 0);
    const height = this.aspect < 1.0 ? 9.6 : 8.0;

    _TARGET_CAM_POS.set(
      carPos.x - Math.sin(this.currentYaw) * dist,
      carPos.y + height,
      carPos.z - Math.cos(this.currentYaw) * dist
    );

    const lookYaw = headingRad + driftAngleRad * 0.35;
    _LOOK_TARGET.set(
      carPos.x + Math.sin(lookYaw) * 10.5,
      carPos.y + 1.15,
      carPos.z + Math.cos(lookYaw) * 10.5
    );

    const alpha = Math.min(1.0, dt * 9.5);
    this.smoothedPos.lerp(_TARGET_CAM_POS, alpha);
    this.smoothedLook.lerp(_LOOK_TARGET, alpha);

    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 2.6);
      const shake = this.trauma * this.trauma * 0.45;
      this.camera.position.set(
        this.smoothedPos.x + (Math.random() - 0.5) * shake,
        this.smoothedPos.y + (Math.random() - 0.5) * shake,
        this.smoothedPos.z + (Math.random() - 0.5) * shake
      );
    } else {
      this.camera.position.copy(this.smoothedPos);
    }

    this.camera.lookAt(this.smoothedLook);
  }
}
