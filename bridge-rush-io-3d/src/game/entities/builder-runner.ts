import * as THREE from 'three';
import { BridgeRunnerRig, BUILDER_SKINS, PrefabFactory } from '../../render/PrefabFactory';

export class BuilderRunnerEntity {
  public readonly rig: BridgeRunnerRig;
  public readonly pos = new THREE.Vector3();
  public readonly vel = new THREE.Vector3();
  public headingRad = 0;
  public steerX = 0;
  public steerZ = 0;

  public teamId: number; // 0 = Player Team, 1 = Red, 2 = Green, 3 = Gold
  public colorHex: number;
  public brickCount = 0;
  public totalStepsBuilt = 0;
  public stunTimer = 0;
  public currentTier = 1; // 1, 2, or 3

  // Boosters
  public magnetBoardTimer = 0;
  public shieldTimer = 0;

  // Permanent Garage Multipliers
  public speedUpgradeMult = 1.0;
  public magnetBonusRadius = 0;
  public buildSpeedMult = 1.0;

  // AI State
  public aiMode: 'gather' | 'build' = 'gather';
  public aiTargetThreshold = 9;
  public aiAssignedBridgeIndex = 0;
  public aiDecisionTimer = 0;
  public aiTargetX = 0;
  public aiTargetZ = 0;

  private animPhase = 0;

  constructor(
    scene: THREE.Scene,
    public readonly id: string,
    public readonly name: string,
    public readonly isPlayer: boolean,
    teamId: number,
    colorHex: number,
    accentHex: number,
    startX: number,
    startZ: number
  ) {
    this.teamId = teamId;
    this.colorHex = colorHex;
    this.rig = PrefabFactory.createBridgeRunner(colorHex, accentHex, isPlayer, 32);
    this.pos.set(startX, 0, startZ);
    this.rig.root.position.copy(this.pos);
    this.animPhase = Math.random() * Math.PI * 2;
    scene.add(this.rig.root);
  }

  public applySkin(skinId: number): void {
    const spec = BUILDER_SKINS[skinId % BUILDER_SKINS.length];
    this.colorHex = spec.teamColorHex;
    (this.rig.torsoMesh.material as THREE.MeshStandardMaterial).color.setHex(spec.teamColorHex);
    (this.rig.helmetMesh.material as THREE.MeshStandardMaterial).color.setHex(spec.accentHex);
    for (let i = 0; i < this.rig.backpackSlots.length; i++) {
      (this.rig.backpackSlots[i].material as THREE.MeshStandardMaterial).color.setHex(
        spec.teamColorHex
      );
    }
  }

  public setBrickCount(count: number): void {
    this.brickCount = Math.max(0, Math.min(60, Math.floor(count)));
    const visibleSlots = Math.min(this.rig.backpackSlots.length, this.brickCount);
    for (let i = 0; i < this.rig.backpackSlots.length; i++) {
      this.rig.backpackSlots[i].visible = i < visibleSlots;
    }
  }

  public applyTackleKnockdown(nx: number, nz: number): number {
    if (this.shieldTimer > 0) return 0;
    const dropped = this.brickCount;
    this.setBrickCount(0);
    this.vel.x = nx * 9.5;
    this.vel.z = nz * 9.5;
    this.stunTimer = 0.85;
    this.rig.bodyPivot.rotation.x = -0.85;
    return dropped;
  }

  public update(dt: number): void {
    if (this.stunTimer > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - dt);
      if (this.stunTimer <= 0) {
        this.rig.bodyPivot.rotation.x = 0;
      }
    }
    if (this.magnetBoardTimer > 0) {
      this.magnetBoardTimer = Math.max(0, this.magnetBoardTimer - dt);
    }
    if (this.shieldTimer > 0) {
      this.shieldTimer = Math.max(0, this.shieldTimer - dt);
    }

    this.rig.hoverboardMesh.visible = this.magnetBoardTimer > 0;
    this.rig.shieldAura.visible = this.shieldTimer > 0;

    const baseSpeed =
      (this.isPlayer ? 9.8 : 8.7) *
      this.speedUpgradeMult *
      (this.magnetBoardTimer > 0 ? 1.45 : 1.0);

    if (this.stunTimer <= 0) {
      const targetVx = this.steerX * baseSpeed;
      const targetVz = this.steerZ * baseSpeed;
      this.vel.x = THREE.MathUtils.lerp(this.vel.x, targetVx, Math.min(1.0, dt * 11.0));
      this.vel.z = THREE.MathUtils.lerp(this.vel.z, targetVz, Math.min(1.0, dt * 11.0));
    } else {
      this.vel.x *= Math.exp(-4.0 * dt);
      this.vel.z *= Math.exp(-4.0 * dt);
    }

    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;

    const speed = Math.hypot(this.vel.x, this.vel.z);
    if (speed > 0.35 && this.stunTimer <= 0) {
      this.headingRad = Math.atan2(this.vel.x, this.vel.z);
      this.rig.bodyPivot.rotation.y = this.headingRad;
    }

    this.animPhase += dt * (4.0 + speed * 1.25);
    const swing = this.stunTimer <= 0 && speed > 0.4 ? Math.sin(this.animPhase) * 0.65 : 0;
    this.rig.leftLeg.rotation.x = swing;
    this.rig.rightLeg.rotation.x = -swing;
    this.rig.leftArm.rotation.x = -swing * 0.7;
    this.rig.rightArm.rotation.x = swing * 0.7;

    // Gentle spine sway on backpack bricks
    const swayBase = Math.sin(this.animPhase * 0.5) * 0.015 * Math.min(1.0, speed / 6.0);
    const visCount = Math.min(this.rig.backpackSlots.length, this.brickCount);
    for (let i = 0; i < visCount; i++) {
      this.rig.backpackSlots[i].position.x = swayBase * i;
    }

    this.rig.root.position.copy(this.pos);
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.rig.root);
  }
}
