import * as THREE from 'three';

export class CameraRig {
  public readonly camera: THREE.PerspectiveCamera;
  private readonly target = new THREE.Vector3(0, 0, 0);

  // Spherical coordinates for smooth orbit
  private currentSpherical = new THREE.Spherical(20, Math.PI / 3.4, Math.PI / 4);
  private targetSpherical = new THREE.Spherical(20, Math.PI / 3.4, Math.PI / 4);

  private baseDistance = 20;
  private trauma = 0;
  private readonly shakeOffset = new THREE.Vector3();
  private readonly tempCamPos = new THREE.Vector3();

  constructor(container: HTMLElement) {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / height;

    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.updateCameraAspect(width, height);
    this.applySphericalImmediate();
  }

  public resize(width: number, height: number): void {
    this.updateCameraAspect(width, height);
  }

  private updateCameraAspect(width: number, height: number): void {
    const aspect = width / height;
    this.camera.aspect = aspect;

    // Portrait 9:16 adaptation: adjust FOV & distance so gates remain in clear view
    if (aspect < 0.8) {
      // Very tall portrait (mobile YouTube app / Playables)
      this.camera.fov = 54;
      this.targetSpherical.radius = this.baseDistance * 1.35;
    } else if (aspect < 1.2) {
      // Square / Tablet
      this.camera.fov = 48;
      this.targetSpherical.radius = this.baseDistance * 1.15;
    } else {
      // Landscape 16:9 (Desktop)
      this.camera.fov = 42;
      this.targetSpherical.radius = this.baseDistance;
    }

    this.camera.updateProjectionMatrix();
  }

  public setBaseDistance(distance: number): void {
    this.baseDistance = distance;
    const aspect = this.camera.aspect;
    if (aspect < 0.8) {
      this.targetSpherical.radius = distance * 1.35;
    } else if (aspect < 1.2) {
      this.targetSpherical.radius = distance * 1.15;
    } else {
      this.targetSpherical.radius = distance;
    }
  }

  public rotateDelta(deltaX: number, deltaY: number): void {
    const speed = 0.006;
    this.targetSpherical.theta -= deltaX * speed;
    this.targetSpherical.phi -= deltaY * speed;

    // Clamp vertical inclination so player cannot flip upside down or view straight from top
    const minPhi = Math.PI / 6; // 30 deg from vertical
    const maxPhi = Math.PI / 2.3; // 78 deg from vertical (keeps board visible from above)
    this.targetSpherical.phi = Math.max(minPhi, Math.min(maxPhi, this.targetSpherical.phi));
  }

  public addTrauma(amount: number): void {
    this.trauma = Math.min(1.0, this.trauma + amount);
  }

  public update(dt: number): void {
    // Smooth damping towards target spherical coordinates
    const lerpFactor = Math.min(1.0, dt * 10);
    this.currentSpherical.theta += (this.targetSpherical.theta - this.currentSpherical.theta) * lerpFactor;
    this.currentSpherical.phi += (this.targetSpherical.phi - this.currentSpherical.phi) * lerpFactor;
    this.currentSpherical.radius += (this.targetSpherical.radius - this.currentSpherical.radius) * lerpFactor;

    this.tempCamPos.setFromSpherical(this.currentSpherical).add(this.target);

    // Apply trauma shake decay
    if (this.trauma > 0.001) {
      const shakePower = this.trauma * this.trauma * 0.4;
      const angle = Math.random() * Math.PI * 2;
      this.shakeOffset.set(Math.cos(angle) * shakePower, (Math.random() - 0.5) * shakePower, Math.sin(angle) * shakePower);
      this.tempCamPos.add(this.shakeOffset);
      this.trauma = Math.max(0, this.trauma - dt * 2.5);
    }

    this.camera.position.copy(this.tempCamPos);
    this.camera.lookAt(this.target);
  }

  private applySphericalImmediate(): void {
    this.currentSpherical.copy(this.targetSpherical);
    this.tempCamPos.setFromSpherical(this.currentSpherical).add(this.target);
    this.camera.position.copy(this.tempCamPos);
    this.camera.lookAt(this.target);
  }
}
