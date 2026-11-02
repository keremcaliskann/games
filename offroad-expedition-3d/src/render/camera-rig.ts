import * as THREE from 'three';

const _TARGET_CAM_POS = new THREE.Vector3();
const _LOOK_TARGET = new THREE.Vector3();

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly smoothedPos = new THREE.Vector3(0, 11, -15);
  private readonly smoothedLook = new THREE.Vector3(0, 1.5, 9);
  private currentYaw = 0;
  private aspect = 1.0;

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

  public snapToTruck(truckPos: THREE.Vector3, headingRad: number): void {
    this.currentYaw = headingRad;
    const dist = this.aspect < 1.0 ? 15.8 : 13.4;
    const height = this.aspect < 1.0 ? 10.2 : 8.5;
    this.smoothedPos.set(
      truckPos.x - Math.sin(headingRad) * dist,
      truckPos.y + height,
      truckPos.z - Math.cos(headingRad) * dist
    );
    this.smoothedLook.set(
      truckPos.x + Math.sin(headingRad) * 9.0,
      truckPos.y + 1.4,
      truckPos.z + Math.cos(headingRad) * 9.0
    );
    this.camera.position.copy(this.smoothedPos);
    this.camera.lookAt(this.smoothedLook);
  }

  public update(
    dt: number,
    truckPos: THREE.Vector3,
    headingRad: number,
    winchActive: boolean
  ): void {
    let diff = headingRad - this.currentYaw;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    this.currentYaw += diff * Math.min(1.0, dt * 5.8);

    const baseDist = this.aspect < 1.0 ? 15.6 : 13.0;
    const dist = baseDist + (winchActive ? 1.8 : 0);
    const height = this.aspect < 1.0 ? 10.0 : 8.4;

    _TARGET_CAM_POS.set(
      truckPos.x - Math.sin(this.currentYaw) * dist,
      truckPos.y + height,
      truckPos.z - Math.cos(this.currentYaw) * dist
    );
    _LOOK_TARGET.set(
      truckPos.x + Math.sin(headingRad) * 9.5,
      truckPos.y + 1.35,
      truckPos.z + Math.cos(headingRad) * 9.5
    );

    const alpha = Math.min(1.0, dt * 8.8);
    this.smoothedPos.lerp(_TARGET_CAM_POS, alpha);
    this.smoothedLook.lerp(_LOOK_TARGET, alpha);
    this.camera.position.copy(this.smoothedPos);
    this.camera.lookAt(this.smoothedLook);
  }
}
