import * as THREE from 'three';
import { CrawlerLiverySpec, CrawlerTruckRig, PrefabFactory } from '../../render/PrefabFactory';

export class CrawlerTruckEntity {
  public readonly rig: CrawlerTruckRig;
  public readonly winchLine: THREE.Line;
  private readonly winchPositions = new Float32Array(6);

  public readonly pos = new THREE.Vector3();
  public trailDistance = 0;
  public lateralOffset = 0;
  public lateralVel = 0;
  public speed = 0;
  public headingRad = 0;
  public cargoIntegrity = 100;

  // Upgrade multipliers
  public axleLiftMult = 1.0;
  public winchPowerMult = 1.0;
  public mudTireMult = 1.0;

  // Booster timers
  public superWinchTimer = 0;
  public mudTireBoosterTimer = 0;
  public diffLockTimer = 0;

  // AI fields
  public aiBaseSpeed = 16.5;

  constructor(
    scene: THREE.Scene,
    public readonly id: string,
    public readonly name: string,
    public readonly isPlayer: boolean,
    livery: CrawlerLiverySpec
  ) {
    this.rig = PrefabFactory.createCrawlerTruck(livery, !isPlayer);
    scene.add(this.rig.root);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(this.winchPositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    this.winchLine = new THREE.Line(lineGeo, lineMat);
    this.winchLine.visible = false;
    scene.add(this.winchLine);
  }

  public resetAtStart(lateralOffset: number, startDist = 0): void {
    this.trailDistance = startDist;
    this.lateralOffset = lateralOffset;
    this.lateralVel = 0;
    this.speed = 0;
    this.headingRad = 0;
    this.cargoIntegrity = 100;
    this.superWinchTimer = 0;
    this.mudTireBoosterTimer = 0;
    this.diffLockTimer = 0;
    this.winchLine.visible = false;
  }

  public updateWinchVisual(active: boolean, anchorPos: THREE.Vector3 | null): void {
    if (!active || !anchorPos) {
      this.winchLine.visible = false;
      return;
    }
    this.winchLine.visible = true;
    this.winchPositions[0] = this.pos.x;
    this.winchPositions[1] = this.pos.y + 0.65;
    this.winchPositions[2] = this.pos.z;
    this.winchPositions[3] = anchorPos.x;
    this.winchPositions[4] = anchorPos.y + 1.15;
    this.winchPositions[5] = anchorPos.z;
    this.winchLine.geometry.attributes.position.needsUpdate = true;
  }

  public updateVisuals(
    dt: number,
    worldX: number,
    worldY: number,
    worldZ: number,
    trailYaw: number,
    trailPitch: number,
    frontAxleRoll: number,
    rearAxleRoll: number
  ): void {
    if (this.superWinchTimer > 0) this.superWinchTimer = Math.max(0, this.superWinchTimer - dt);
    if (this.mudTireBoosterTimer > 0)
      this.mudTireBoosterTimer = Math.max(0, this.mudTireBoosterTimer - dt);
    if (this.diffLockTimer > 0) this.diffLockTimer = Math.max(0, this.diffLockTimer - dt);

    this.rig.diffLockRing.visible = this.diffLockTimer > 0 || this.superWinchTimer > 0;
    this.rig.mudTireRing.visible = this.mudTireBoosterTimer > 0;

    if (this.rig.diffLockRing.visible) {
      this.rig.diffLockRing.rotation.z += dt * 3.8;
    }

    this.pos.set(worldX, worldY, worldZ);
    this.rig.root.position.copy(this.pos);
    this.headingRad = trailYaw;
    this.rig.root.rotation.y = trailYaw;

    // Independent 4x4 axle articulation & chassis pitch/roll
    this.rig.frontAxleGroup.rotation.z = frontAxleRoll;
    this.rig.rearAxleGroup.rotation.z = rearAxleRoll;

    const bodyRoll = (frontAxleRoll + rearAxleRoll) * 0.45 / this.axleLiftMult;
    this.rig.bodyPivot.rotation.z += (bodyRoll - this.rig.bodyPivot.rotation.z) * Math.min(1, dt * 8);
    this.rig.bodyPivot.rotation.x += (trailPitch - this.rig.bodyPivot.rotation.x) * Math.min(1, dt * 8);

    // Spin knobby offroad tires
    const spinDelta = this.speed * dt * 2.1;
    for (let i = 0; i < this.rig.wheels.length; i++) {
      this.rig.wheels[i].rotation.x += spinDelta;
    }
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.rig.root);
    scene.remove(this.winchLine);
  }
}
