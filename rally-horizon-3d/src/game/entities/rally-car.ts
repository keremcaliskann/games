import * as THREE from 'three';
import { PrefabFactory, RallyCarRig, RallyLiverySpec } from '../../render/PrefabFactory';

export class RallyCarEntity {
  public readonly rig: RallyCarRig;
  public readonly pos = new THREE.Vector3();
  public trackDistance = 0;
  public lateralOffset = 0;
  public lateralVel = 0;
  public speed = 0; // m/s along stage spline
  public headingRad = 0;
  public driftAngleRad = 0;
  public verticalVel = 0;
  public jumpHeight = 0;

  // Upgrade multipliers
  public turboMult = 1.0;
  public gripMult = 1.0;
  public suspensionMult = 1.0;

  // Booster timers
  public nitroTimer = 0;
  public gripBoosterTimer = 0;
  public coDriverTimer = 0;

  // AI fields
  public aiBaseSpeed = 28.0;
  public aiTargetLateral = 0;
  public aiLaneTimer = 0;

  constructor(
    scene: THREE.Scene,
    public readonly id: string,
    public readonly name: string,
    public readonly isPlayer: boolean,
    livery: RallyLiverySpec
  ) {
    this.rig = PrefabFactory.createRallyCar(livery, !isPlayer);
    scene.add(this.rig.root);
  }

  public resetAtStart(lateralOffset: number, startDist = 0): void {
    this.trackDistance = startDist;
    this.lateralOffset = lateralOffset;
    this.lateralVel = 0;
    this.speed = 0;
    this.headingRad = 0;
    this.driftAngleRad = 0;
    this.verticalVel = 0;
    this.jumpHeight = 0;
    this.nitroTimer = 0;
    this.gripBoosterTimer = 0;
    this.coDriverTimer = 0;
  }

  public updateVisuals(
    dt: number,
    worldX: number,
    worldY: number,
    worldZ: number,
    roadTangentYaw: number,
    roadPitchRad: number,
    steerInput: number
  ): void {
    if (this.nitroTimer > 0) this.nitroTimer = Math.max(0, this.nitroTimer - dt);
    if (this.gripBoosterTimer > 0) this.gripBoosterTimer = Math.max(0, this.gripBoosterTimer - dt);
    if (this.coDriverTimer > 0) this.coDriverTimer = Math.max(0, this.coDriverTimer - dt);

    this.rig.leftNitroFlame.visible = this.nitroTimer > 0;
    this.rig.rightNitroFlame.visible = this.nitroTimer > 0;
    this.rig.gripAuraRing.visible = this.gripBoosterTimer > 0;

    if (this.rig.gripAuraRing.visible) {
      this.rig.gripAuraRing.rotation.z += dt * 4.0;
    }

    this.pos.set(worldX, worldY + this.jumpHeight, worldZ);
    this.rig.root.position.copy(this.pos);
    this.headingRad = roadTangentYaw;
    this.rig.root.rotation.y = roadTangentYaw + this.driftAngleRad;

    // Suspension pitch & centrifugal body roll
    const targetRoll = -steerInput * 0.12 / this.suspensionMult;
    const targetPitch = roadPitchRad - (this.nitroTimer > 0 ? 0.05 : 0);
    this.rig.bodyPivot.rotation.z += (targetRoll - this.rig.bodyPivot.rotation.z) * Math.min(1, dt * 10);
    this.rig.bodyPivot.rotation.x += (targetPitch - this.rig.bodyPivot.rotation.x) * Math.min(1, dt * 10);

    // Spin all 4 wheels & steer front wheel pivots
    const spinDelta = this.speed * dt * 2.4;
    for (let i = 0; i < this.rig.wheels.length; i++) {
      this.rig.wheels[i].rotation.x += spinDelta;
    }
    const steerAngle = -steerInput * 0.42;
    for (let i = 0; i < this.rig.frontWheelPivots.length; i++) {
      this.rig.frontWheelPivots[i].rotation.y = steerAngle;
    }
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.rig.root);
  }
}
