import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

const _ORIGIN = new THREE.Vector3();
const _FORWARD = new THREE.Vector3();
const _QUAT = new THREE.Quaternion();
const _VELOCITY = new THREE.Vector3();

export class Cannon {
  public readonly mesh: THREE.Group;
  private readonly barrelGroup: THREE.Group;
  private readonly muzzleOffset: THREE.Vector3;
  private readonly trajectoryLine: THREE.Line;
  private readonly trajectoryPositions: Float32Array;

  private currentYaw = 0;
  private currentPitch = 0.35;
  private recoil = 0;

  constructor(scene: THREE.Scene) {
    const cannonData = PrefabFactory.createCannon();
    this.mesh = cannonData.root;
    this.barrelGroup = cannonData.barrelGroup;
    this.muzzleOffset = cannonData.muzzle;
    scene.add(this.mesh);

    // Trajectory Preview Arc
    const sampleCount = 45;
    this.trajectoryPositions = new Float32Array(sampleCount * 3);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(this.trajectoryPositions, 3));

    const lineMat = new THREE.LineDashedMaterial({
      color: 0xfef08a,
      linewidth: 3,
      scale: 1,
      dashSize: 0.5,
      gapSize: 0.25,
      transparent: true,
      opacity: 0.85,
    });

    this.trajectoryLine = new THREE.Line(lineGeo, lineMat);
    this.trajectoryLine.computeLineDistances();
    scene.add(this.trajectoryLine);

    this.updateAim(0, 0.35);
  }

  public get muzzle(): THREE.Vector3 {
    return this.muzzleOffset;
  }

  public updateAim(yaw: number, pitch: number): void {
    const cfg = GAME_CONFIG.cannon;
    this.currentYaw = THREE.MathUtils.clamp(yaw, -cfg.yawRange, cfg.yawRange);
    this.currentPitch = THREE.MathUtils.clamp(pitch, cfg.pitchMin, cfg.pitchMax);

    this.mesh.rotation.y = this.currentYaw;
    this.barrelGroup.rotation.x = -this.currentPitch;

    this.updateTrajectoryArc();
  }

  public triggerRecoil(): void {
    this.recoil = GAME_CONFIG.cannon.recoilDistance;
  }

  public update(dt: number): void {
    if (this.recoil > 0) {
      this.recoil = Math.max(0, this.recoil - dt * GAME_CONFIG.cannon.recoilSpeed);
      this.barrelGroup.position.z = 0.3 + this.recoil;
    } else {
      this.barrelGroup.position.z = 0.3;
    }
  }

  public getLaunchInfo(): { origin: THREE.Vector3; velocity: THREE.Vector3 } {
    this.barrelGroup.getWorldPosition(_ORIGIN);

    _FORWARD.set(0, 0, -1);
    this.barrelGroup.getWorldQuaternion(_QUAT);
    _FORWARD.applyQuaternion(_QUAT).normalize();

    // Spawn slightly ahead of muzzle
    _ORIGIN.addScaledVector(_FORWARD, 2.2);

    const speed = GAME_CONFIG.cannon.shotPower;
    _VELOCITY.copy(_FORWARD).multiplyScalar(speed);

    return { origin: _ORIGIN, velocity: _VELOCITY };
  }

  public setTrajectoryVisible(visible: boolean): void {
    this.trajectoryLine.visible = visible;
  }

  public setLaserMode(isLaser: boolean): void {
    const mat = this.trajectoryLine.material as THREE.LineDashedMaterial;
    if (isLaser) {
      mat.color.setHex(0x6366f1);
      mat.opacity = 1.0;
    } else {
      mat.color.setHex(0xfef08a);
      mat.opacity = 0.85;
    }
  }

  private updateTrajectoryArc(): void {
    const info = this.getLaunchInfo();
    const g = -9.81 * 2.2; // Match physics gravity
    const count = this.trajectoryPositions.length / 3;
    const dt = 0.04;

    for (let i = 0; i < count; i++) {
      const t = i * dt;
      const x = info.origin.x + info.velocity.x * t;
      const y = info.origin.y + info.velocity.y * t + 0.5 * g * t * t;
      const z = info.origin.z + info.velocity.z * t;

      this.trajectoryPositions[i * 3] = x;
      this.trajectoryPositions[i * 3 + 1] = Math.max(y, -1.5);
      this.trajectoryPositions[i * 3 + 2] = z;
    }

    const attr = this.trajectoryLine.geometry.getAttribute('position') as THREE.BufferAttribute;
    attr.needsUpdate = true;
    this.trajectoryLine.computeLineDistances();
  }
}
