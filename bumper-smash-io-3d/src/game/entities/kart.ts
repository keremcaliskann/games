import * as THREE from 'three';
import { BumperKartRig, PrefabFactory } from '../../render/PrefabFactory';

export class KartEntity {
  public readonly rig: BumperKartRig;
  public readonly pos = new THREE.Vector3();
  public readonly vel = new THREE.Vector3();
  public headingRad = 0;
  public steerDirX = 0;
  public steerDirZ = 0;

  public scale = 1.0;
  public radius = 0.95;
  public mass = 1.0;
  public score = 0;
  public knockouts = 0;
  public isAlive = true;
  public isFallingInSea = false;
  public lastHitBy: KartEntity | null = null;
  public lastHitTimer = 0;

  // Booster timers
  public nitroTimer = 0;
  public vortexTimer = 0;
  public spikeTimer = 0;

  // AI fields
  public aiDecisionTimer = 0;
  private squashTimer = 0;

  constructor(
    scene: THREE.Scene,
    public readonly id: string,
    public readonly name: string,
    public readonly isPlayer: boolean,
    colorHex: number,
    startX: number,
    startZ: number
  ) {
    this.rig = PrefabFactory.createBumperKart(colorHex, isPlayer);
    this.pos.set(startX, 0, startZ);
    this.rig.root.position.copy(this.pos);
    this.headingRad = Math.atan2(-startX, -startZ);
    this.rig.bodyGroup.rotation.y = this.headingRad;
    scene.add(this.rig.root);
  }

  public setSteerDirection(dx: number, dz: number): void {
    const len = Math.hypot(dx, dz);
    if (len > 0.001) {
      this.steerDirX = dx / len;
      this.steerDirZ = dz / len;
    } else {
      this.steerDirX = 0;
      this.steerDirZ = 0;
    }
  }

  public addGrowth(scaleDelta: number, scoreDelta: number): void {
    this.score += scoreDelta;
    this.scale = Math.min(2.15, this.scale + scaleDelta);
    this.radius = 0.95 * this.scale;
    this.mass = this.scale * this.scale;
    this.rig.root.scale.setScalar(this.scale);
  }

  public triggerBumpSquash(): void {
    this.squashTimer = 0.18;
  }

  public respawnAtCenter(): void {
    this.isAlive = true;
    this.isFallingInSea = false;
    this.pos.set(0, 0, 0);
    this.vel.set(0, 0, 0);
    this.rig.root.position.set(0, 0, 0);
    this.rig.root.rotation.set(0, 0, 0);
    this.rig.root.visible = true;
    this.spikeTimer = 8.0;
    this.nitroTimer = 4.0;
  }

  public update(dt: number, currentArenaRadius: number): boolean {
    if (!this.isAlive) return false;

    if (this.lastHitTimer > 0) {
      this.lastHitTimer -= dt;
      if (this.lastHitTimer <= 0) {
        this.lastHitBy = null;
      }
    }

    // Booster timers & visual toggles
    if (this.nitroTimer > 0) this.nitroTimer = Math.max(0, this.nitroTimer - dt);
    if (this.vortexTimer > 0) this.vortexTimer = Math.max(0, this.vortexTimer - dt);
    if (this.spikeTimer > 0) this.spikeTimer = Math.max(0, this.spikeTimer - dt);

    this.rig.nitroFlame.visible = this.nitroTimer > 0;
    this.rig.vortexRing.visible = this.vortexTimer > 0;
    this.rig.spikeGroup.visible = this.spikeTimer > 0;

    if (this.rig.vortexRing.visible) {
      this.rig.vortexRing.rotation.z += dt * 4.5;
    }
    if (this.rig.spikeGroup.visible) {
      this.rig.spikeGroup.rotation.y += dt * 3.2;
    }

    if (this.isFallingInSea) {
      this.vel.y -= 22.0 * dt;
      this.pos.x += this.vel.x * dt;
      this.pos.y += this.vel.y * dt;
      this.pos.z += this.vel.z * dt;
      this.rig.root.position.copy(this.pos);
      this.rig.bodyGroup.rotation.x += dt * 5.0;
      this.rig.bodyGroup.rotation.z += dt * 4.0;

      if (this.pos.y <= -4.4) {
        this.isAlive = false;
        this.rig.root.visible = false;
        return true; // Newly eliminated this frame
      }
      return false;
    }

    // Acceleration along steering vector
    const accel = (this.isPlayer ? 22.5 : 19.2) * (this.nitroTimer > 0 ? 1.65 : 1.0);
    this.vel.x += this.steerDirX * accel * dt;
    this.vel.z += this.steerDirZ * accel * dt;

    // Damping / tire grip
    const damping = Math.exp(-3.1 * dt);
    this.vel.x *= damping;
    this.vel.z *= damping;

    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;
    this.rig.root.position.set(this.pos.x, 0, this.pos.z);

    // Smoothly orient chassis toward steering or velocity
    const speedSq = this.vel.x * this.vel.x + this.vel.z * this.vel.z;
    if (Math.abs(this.steerDirX) + Math.abs(this.steerDirZ) > 0.05) {
      const targetYaw = Math.atan2(this.steerDirX, this.steerDirZ);
      let diff = targetYaw - this.headingRad;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.headingRad += diff * Math.min(1.0, dt * 11.0);
    } else if (speedSq > 0.5) {
      this.headingRad = Math.atan2(this.vel.x, this.vel.z);
    }
    this.rig.bodyGroup.rotation.y = this.headingRad;

    // Spin wheels & wobble spring antenna
    const wheelSpin = Math.sqrt(speedSq) * dt * 2.5;
    for (let i = 0; i < this.rig.wheels.length; i++) {
      this.rig.wheels[i].rotation.x += wheelSpin;
    }
    this.rig.antennaGroup.rotation.x = -Math.min(0.45, Math.sqrt(speedSq) * 0.04);

    // Squash & stretch bounce after bumper collision
    if (this.squashTimer > 0) {
      this.squashTimer = Math.max(0, this.squashTimer - dt);
      const s = Math.sin((this.squashTimer / 0.18) * Math.PI) * 0.22;
      this.rig.bodyGroup.scale.set(1 + s, 1 - s * 0.65, 1 + s);
    } else {
      this.rig.bodyGroup.scale.set(1, 1, 1);
    }

    // Check if knocked over the shrinking island edge
    const distFromCenter = Math.hypot(this.pos.x, this.pos.z);
    if (distFromCenter > currentArenaRadius + 0.15) {
      this.isFallingInSea = true;
      this.vel.y = 2.2;
    }

    return false;
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.rig.root);
  }
}
