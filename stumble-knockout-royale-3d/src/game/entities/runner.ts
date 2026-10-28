import * as THREE from 'three';
import { PartyRunnerRig, PrefabFactory, RUNNER_SKINS } from '../../render/PrefabFactory';

const GRAVITY = -26.0;

export class RunnerEntity {
  public readonly rig: PartyRunnerRig;
  public readonly pos = new THREE.Vector3();
  public readonly vel = new THREE.Vector3();
  public headingRad = 0;
  public steerX = 0;
  public steerZ = 0;

  public isGrounded = true;
  public hasDiveAvailable = false;
  public qualified = false;
  public finishOrder = 99;
  public stunTimer = 0;
  public canRecoveryRoll = false;
  public rollSpinTimer = 0;
  public checkpointZ = 0;

  // Boosters
  public jetpackTimer = 0;
  public giantTimer = 0;
  public speedBootsTimer = 0;

  // Stat multipliers from Garage Upgrades
  public speedUpgradeMult = 1.0;
  public jumpUpgradeMult = 1.0;
  public stabilityUpgradeMult = 1.0;

  // AI fields
  public aiTargetLaneX = 0;
  public aiLaneTimer = 0;
  public aiSkillFactor = 1.0;
  private animPhase = 0;

  constructor(
    scene: THREE.Scene,
    public readonly id: string,
    public readonly name: string,
    public readonly isPlayer: boolean,
    public skinId: number,
    startX: number,
    startZ: number
  ) {
    this.rig = PrefabFactory.createPartyRunner(skinId, isPlayer);
    this.pos.set(startX, 0, startZ);
    this.checkpointZ = startZ;
    this.rig.root.position.copy(this.pos);
    this.animPhase = Math.random() * Math.PI * 2;
    scene.add(this.rig.root);
  }

  public applySkin(skinId: number): void {
    this.skinId = skinId;
    const spec = RUNNER_SKINS[skinId % RUNNER_SKINS.length];
    (this.rig.torsoMesh.material as THREE.MeshStandardMaterial).color.setHex(spec.colorHex);
    const hatChild = this.rig.hatGroup.children[0] as THREE.Mesh | undefined;
    if (hatChild) {
      (hatChild.material as THREE.MeshStandardMaterial).color.setHex(spec.hatColorHex);
    }
  }

  public triggerJumpOrDive(): 'jump' | 'dive' | 'none' {
    if (this.qualified) return 'none';

    // Mid-air Stumble Recovery Roll when knocked back
    if (!this.isGrounded && this.stunTimer > 0 && this.canRecoveryRoll) {
      this.canRecoveryRoll = false;
      this.stunTimer *= 0.35;
      this.rollSpinTimer = 0.36;
      this.vel.y = Math.max(this.vel.y, 4.8);
      this.vel.z += 5.5 * this.speedUpgradeMult;
      return 'dive';
    }

    if (this.stunTimer > 0) return 'none';

    if (this.isGrounded) {
      this.isGrounded = false;
      this.hasDiveAvailable = true;
      const bootMult = this.speedBootsTimer > 0 ? 1.18 : 1.0;
      this.vel.y = 11.2 * this.jumpUpgradeMult * bootMult;
      return 'jump';
    } else if (this.hasDiveAvailable) {
      this.hasDiveAvailable = false;
      this.vel.y = Math.max(this.vel.y, 4.2);
      this.vel.z += 7.5 * this.jumpUpgradeMult;
      this.rig.bodyPivot.rotation.x = 0.55;
      return 'dive';
    }
    return 'none';
  }

  public applyKnockback(nx: number, nz: number, force: number): void {
    if (this.giantTimer > 0 || this.jetpackTimer > 0) return;
    this.vel.x = nx * force;
    this.vel.z = nz * force;
    this.vel.y = 6.5;
    this.isGrounded = false;
    this.canRecoveryRoll = true;
    this.stunTimer = Math.max(0.15, 0.45 * this.stabilityUpgradeMult);
  }

  public update(dt: number, trackHalfWidth: number, finishZ: number): boolean {
    if (this.qualified) {
      this.animPhase += dt * 8.0;
      this.rig.bodyPivot.position.y = Math.abs(Math.sin(this.animPhase)) * 0.35;
      this.rig.bodyPivot.rotation.y += dt * 3.5;
      return false;
    }

    if (this.stunTimer > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - dt);
    }
    if (this.rollSpinTimer > 0) {
      this.rollSpinTimer = Math.max(0, this.rollSpinTimer - dt);
      this.rig.bodyPivot.rotation.x = (1.0 - this.rollSpinTimer / 0.36) * Math.PI * 2;
      if (this.rollSpinTimer <= 0) {
        this.rig.bodyPivot.rotation.x = 0;
      }
    }
    if (this.jetpackTimer > 0) this.jetpackTimer = Math.max(0, this.jetpackTimer - dt);
    if (this.giantTimer > 0) this.giantTimer = Math.max(0, this.giantTimer - dt);
    if (this.speedBootsTimer > 0) this.speedBootsTimer = Math.max(0, this.speedBootsTimer - dt);

    this.rig.jetpackFlame.visible = this.jetpackTimer > 0;
    this.rig.titanAura.visible = this.giantTimer > 0;
    const targetScale = this.giantTimer > 0 ? 1.65 : 1.0;
    this.rig.root.scale.setScalar(targetScale);

    const baseSpeed =
      (this.isPlayer ? 10.6 : 9.8 * this.aiSkillFactor) *
      this.speedUpgradeMult *
      (this.speedBootsTimer > 0 ? 1.42 : 1.0) *
      (this.jetpackTimer > 0 ? 1.85 : 1.0);

    if (this.jetpackTimer > 0) {
      this.pos.y = THREE.MathUtils.lerp(this.pos.y, 2.8, Math.min(1.0, dt * 8.0));
      this.vel.y = 0;
      this.isGrounded = false;
    } else {
      if (!this.isGrounded || this.pos.y > 0) {
        this.vel.y += GRAVITY * dt;
        this.pos.y += this.vel.y * dt;
        if (this.pos.y <= 0 && Math.abs(this.pos.x) <= trackHalfWidth + 0.4) {
          this.pos.y = 0;
          this.vel.y = 0;
          this.isGrounded = true;
          this.hasDiveAvailable = false;
          this.rig.bodyPivot.rotation.x = 0;
        }
      }
    }

    if (this.stunTimer <= 0) {
      const targetVx = this.steerX * baseSpeed * 0.85;
      const targetVz = this.steerZ * baseSpeed;
      this.vel.x = THREE.MathUtils.lerp(this.vel.x, targetVx, Math.min(1.0, dt * 10.0));
      this.vel.z = THREE.MathUtils.lerp(this.vel.z, targetVz, Math.min(1.0, dt * 10.0));
    } else {
      this.vel.x *= Math.exp(-3.0 * dt);
      this.vel.z *= Math.exp(-3.0 * dt);
    }

    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;

    // Update checkpoint progress every 22m
    if (this.pos.z > this.checkpointZ + 22 && this.pos.z < finishZ - 4) {
      this.checkpointZ = Math.floor(this.pos.z / 22) * 22;
    }

    // Check if knocked off side of sky track
    if (Math.abs(this.pos.x) > trackHalfWidth + 0.45 && this.jetpackTimer <= 0) {
      this.isGrounded = false;
    }

    // Respawn at last checkpoint if fallen into sea below
    if (this.pos.y < -4.2) {
      this.pos.set((Math.random() - 0.5) * 3.0, 1.2, this.checkpointZ);
      this.vel.set(0, 0, 0);
      this.isGrounded = false;
      this.stunTimer = 0;
    }

    this.rig.root.position.copy(this.pos);

    // Orient character toward movement direction
    const moveSpeed = Math.hypot(this.vel.x, this.vel.z);
    if (moveSpeed > 0.4) {
      this.headingRad = Math.atan2(this.vel.x, this.vel.z);
      this.rig.bodyPivot.rotation.y = this.headingRad;
    }

    // Run cycle limb swing
    this.animPhase += dt * (4.0 + moveSpeed * 1.15);
    const swing = this.isGrounded ? Math.sin(this.animPhase) * 0.65 : 0.45;
    this.rig.leftLeg.rotation.x = swing;
    this.rig.rightLeg.rotation.x = -swing;
    this.rig.leftArm.rotation.x = -swing * 0.8;
    this.rig.rightArm.rotation.x = swing * 0.8;

    if (this.pos.z >= finishZ) {
      this.qualified = true;
      return true; // Newly crossed finish line!
    }

    return false;
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.rig.root);
  }
}
