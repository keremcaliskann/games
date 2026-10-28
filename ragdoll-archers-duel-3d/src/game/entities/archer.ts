import * as THREE from 'three';
import { ArcherRig, PrefabFactory } from '../../render/PrefabFactory';

export type HitZone = 'head' | 'torso' | 'limb' | 'none';

export class ArcherEntity {
  public readonly rig: ArcherRig;
  public readonly bastion: THREE.Group;
  public readonly basePos = new THREE.Vector3();
  public readonly ragdollVel = new THREE.Vector3();
  public maxHp: number;
  public hp: number;
  public isDead = false;
  public isRagdollFalling = false;
  public shieldCharges = 0;

  // Enemy AI timers
  public aiShotCooldown = 2.4;
  public aiShotTimer = 1.6;
  public aiJitterRad = 0.14;

  // Procedural joint recoil springs
  private recoilTorsoAngle = 0;
  private recoilTorsoVel = 0;
  private recoilHeadAngle = 0;
  private recoilHeadVel = 0;
  private ragdollSpinSpeed = 0;
  private idlePhase = 0;

  constructor(
    scene: THREE.Scene,
    public readonly isPlayer: boolean,
    x: number,
    y: number,
    colorHex: number,
    public readonly isBoss = false,
    maxHp = 100
  ) {
    this.maxHp = maxHp;
    this.hp = maxHp;
    this.basePos.set(x, y, 0);
    this.idlePhase = Math.random() * Math.PI * 2;

    const facingDir: 1 | -1 = isPlayer ? 1 : -1;
    const trimColor = isPlayer ? 0x2563eb : isBoss ? 0xd97706 : 0xef4444;

    this.bastion = PrefabFactory.createBastionColumn(y, isBoss ? 1.5 : 1.32, trimColor);
    this.bastion.position.set(x, y, 0);
    scene.add(this.bastion);

    this.rig = PrefabFactory.createArcherPrefab(colorHex, facingDir, isBoss);
    this.rig.root.position.set(x, y, 0);
    scene.add(this.rig.root);
  }

  public setBowAim(angleRad: number, draw01: number): void {
    const dir = this.isPlayer ? 1 : -1;
    this.rig.bowArmGroup.rotation.z = dir * angleRad;
    // Displace middle vertex of bowstring backward proportional to draw01
    const pullX = (0.42 - draw01 * 0.34) * dir;
    this.rig.bowStringAttr.setXYZ(1, pullX, 0, 0);
    this.rig.bowStringAttr.needsUpdate = true;
  }

  public setShieldCharges(charges: number): void {
    this.shieldCharges = charges;
    this.rig.shieldDome.visible = charges > 0;
  }

  public checkArrowHit(arrowPos: THREE.Vector3): HitZone {
    if (this.isDead) return 'none';
    const scale = this.isBoss ? 1.22 : 1.0;
    const rx = this.rig.root.position.x;
    const ry = this.rig.root.position.y;

    // 1. Headshot sphere check
    const headX = rx + Math.sin(this.recoilTorsoAngle) * 0.4;
    const headY = ry + 1.72 * scale;
    if (Math.hypot(arrowPos.x - headX, arrowPos.y - headY) <= 0.39 * scale) {
      return 'head';
    }

    // 2. Torso check
    const torsoX = rx + Math.sin(this.recoilTorsoAngle) * 0.2;
    const torsoY = ry + 1.08 * scale;
    if (Math.hypot(arrowPos.x - torsoX, arrowPos.y - torsoY) <= 0.43 * scale) {
      return 'torso';
    }

    // 3. Limb/leg check
    const legY = ry + 0.45 * scale;
    if (Math.hypot(arrowPos.x - rx, arrowPos.y - legY) <= 0.38 * scale) {
      return 'limb';
    }

    return 'none';
  }

  public applyDamage(damage: number, hitZone: HitZone, knockDirX: number): boolean {
    if (this.isDead) return false;

    const recoilSign = knockDirX >= 0 ? -1 : 1;
    if (hitZone === 'head') {
      this.recoilHeadVel += recoilSign * 14.0;
      this.recoilTorsoVel += recoilSign * 9.5;
    } else {
      this.recoilTorsoVel += recoilSign * 6.5;
    }

    // Visually pin an impacting arrow onto the hit joint (capped at 4 per archer)
    if (this.rig.torsoGroup.children.length < 10) {
      const pinnedArrow = PrefabFactory.createArrowProjectile(false);
      pinnedArrow.scale.setScalar(0.78);
      pinnedArrow.rotation.z = knockDirX >= 0 ? -0.15 : Math.PI + 0.15;
      pinnedArrow.position.set(knockDirX >= 0 ? -0.22 : 0.22, hitZone === 'head' ? 0.12 : 0.0, 0);
      if (hitZone === 'head') {
        this.rig.headGroup.add(pinnedArrow);
      } else {
        this.rig.torsoGroup.add(pinnedArrow);
      }
    }

    this.hp = Math.max(0, this.hp - damage);
    const ratio = Math.max(0.001, this.hp / this.maxHp);
    this.rig.hpBarFill.scale.x = ratio;
    this.rig.hpBarFill.position.x = -(1 - ratio) * 0.52;

    if (this.hp <= 0) {
      this.isDead = true;
      this.isRagdollFalling = true;
      this.rig.hpBarBg.visible = false;
      this.rig.hpBarFill.visible = false;
      this.rig.shieldDome.visible = false;
      // Launch ragdoll off bastion with comedic tumble
      this.ragdollVel.set(
        knockDirX * (hitZone === 'head' ? 5.8 : 3.6),
        hitZone === 'head' ? 6.8 : 4.5,
        (Math.random() - 0.5) * 2.0
      );
      this.ragdollSpinSpeed = -knockDirX * (hitZone === 'head' ? 9.5 : 5.5);
      return true;
    }
    return false;
  }

  public reviveFull(): void {
    this.isDead = false;
    this.isRagdollFalling = false;
    this.hp = this.maxHp;
    this.rig.root.position.copy(this.basePos);
    this.rig.bodyPivot.rotation.set(0, 0, 0);
    this.recoilTorsoAngle = 0;
    this.recoilTorsoVel = 0;
    this.recoilHeadAngle = 0;
    this.recoilHeadVel = 0;
    this.rig.hpBarBg.visible = true;
    this.rig.hpBarFill.visible = true;
    this.rig.hpBarFill.scale.x = 1;
    this.rig.hpBarFill.position.x = 0;
  }

  public heal(amount: number): void {
    if (this.isDead) return;
    this.hp = Math.min(this.maxHp, this.hp + amount);
    const ratio = Math.max(0.001, this.hp / this.maxHp);
    this.rig.hpBarFill.scale.x = ratio;
    this.rig.hpBarFill.position.x = -(1 - ratio) * 0.52;
  }

  public update(dt: number): void {
    this.idlePhase += dt * 3.0;

    if (this.isRagdollFalling) {
      this.ragdollVel.y -= 17.5 * dt;
      this.rig.root.position.x += this.ragdollVel.x * dt;
      this.rig.root.position.y += this.ragdollVel.y * dt;
      this.rig.root.position.z += this.ragdollVel.z * dt;
      this.rig.bodyPivot.rotation.z += this.ragdollSpinSpeed * dt;
      this.rig.leftLeg.rotation.z = Math.sin(this.idlePhase * 5) * 0.8;
      this.rig.rightLeg.rotation.z = -Math.sin(this.idlePhase * 5) * 0.8;
      return;
    }

    // Damped harmonic spring for articulated torso & head hit reaction
    const k = 42.0;
    const damp = 6.5;
    this.recoilTorsoVel += (-k * this.recoilTorsoAngle - damp * this.recoilTorsoVel) * dt;
    this.recoilTorsoAngle += this.recoilTorsoVel * dt;

    this.recoilHeadVel += (-k * this.recoilHeadAngle - damp * this.recoilHeadVel) * dt;
    this.recoilHeadAngle += this.recoilHeadVel * dt;

    this.rig.torsoGroup.rotation.z =
      this.recoilTorsoAngle + Math.sin(this.idlePhase) * 0.025;
    this.rig.headGroup.rotation.z = this.recoilHeadAngle;

    if (this.rig.shieldDome.visible) {
      this.rig.shieldDome.rotation.y += dt * 1.2;
    }
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.rig.root);
    scene.remove(this.bastion);
  }
}
