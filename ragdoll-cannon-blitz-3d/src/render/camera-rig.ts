import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private trauma = 0;
  private readonly basePos = new THREE.Vector3(0, 8.5, 27);
  private readonly lookTarget = new THREE.Vector3(0, 3.2, -4);

  constructor(aspect: number) {
    this.camera = new THREE.PerspectiveCamera(52, aspect, 0.5, 250);
    this.updateFov(aspect);
    this.camera.position.copy(this.basePos);
    this.camera.lookAt(this.lookTarget);
  }

  public onResize(aspect: number): void {
    this.camera.aspect = aspect;
    this.updateFov(aspect);
    this.camera.updateProjectionMatrix();
  }

  private updateFov(aspect: number): void {
    // 9:16 portrait gets wider FOV (~68°) to fit the island and cannon trajectory comfortably
    if (aspect < 1.0) {
      this.camera.fov = 68;
    } else if (aspect < 1.4) {
      this.camera.fov = 58;
    } else {
      this.camera.fov = 50;
    }
    this.camera.updateProjectionMatrix();
  }

  public addTrauma(amount: number): void {
    this.trauma = Math.min(this.trauma + amount, 1.0);
  }

  private slowMoTimer = 0;
  private zoomFactor = 1.0;

  public triggerSlowMoDestruct(duration = 0.35): void {
    this.slowMoTimer = duration;
    this.addTrauma(0.75);
  }

  public get isSlowMo(): boolean {
    return this.slowMoTimer > 0;
  }

  public update(dt: number): void {
    if (this.slowMoTimer > 0) {
      this.slowMoTimer = Math.max(0, this.slowMoTimer - dt);
      this.zoomFactor = THREE.MathUtils.lerp(this.zoomFactor, 0.88, dt * 8.0);
    } else {
      this.zoomFactor = THREE.MathUtils.lerp(this.zoomFactor, 1.0, dt * 5.0);
    }

    if (this.trauma > 0) {
      this.trauma = Math.max(0, this.trauma - dt * 2.2);
      const shake = this.trauma * this.trauma * 0.8;
      this.camera.position.set(
        this.basePos.x + (Math.random() - 0.5) * shake,
        this.basePos.y + (Math.random() - 0.5) * shake,
        this.basePos.z * this.zoomFactor + (Math.random() - 0.5) * shake * 0.5
      );
    } else {
      this.camera.position.set(this.basePos.x, this.basePos.y, this.basePos.z * this.zoomFactor);
    }
    this.camera.lookAt(this.lookTarget);
  }
}
