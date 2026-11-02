import * as THREE from 'three';
import { BattleKartRig, KART_SKINS, PrefabFactory } from '../../render/PrefabFactory';

export type WeaponType = 'rockets' | 'gatling' | 'mines';

export class BattleKartEntity {
  public readonly rig: BattleKartRig;
  public readonly pos = new THREE.Vector3();
  public readonly vel = new THREE.Vector3();
  public headingRad = 0;
  public turretYawRad = 0;
  public steerX = 0;
  public steerZ = 0;

  public hp = 100;
  public maxHp = 100;
  public powerCubes = 0;
  public kills = 0;
  public eliminated = false;
  public finishRank = 12;

  public activeWeapon: WeaponType = 'rockets';
  public weaponAmmo = 0;
  public fireCooldown = 0;
  public stunTimer = 0;

  // Boosters
  public mechaTimer = 0;
  public shieldTimer = 0;

  // Permanent Garage Multipliers
  public armorUpgradeMult = 1.0;
  public turboUpgradeMult = 1.0;
  public weaponUpgradeMult = 1.0;

  // AI State
  public aiDecisionTimer = 0;
  public aiTargetX = 0;
  public aiTargetZ = 0;

  private wheelSpinRad = 0;

  constructor(
    scene: THREE.Scene,
    public readonly id: string,
    public readonly name: string,
    public readonly isPlayer: boolean,
    public colorHex: number,
    accentHex: number,
    startX: number,
    startZ: number
  ) {
    this.rig = PrefabFactory.createBattleKart(colorHex, accentHex, isPlayer);
    this.pos.set(startX, 0, startZ);
    this.headingRad = Math.atan2(-startX, -startZ);
    this.turretYawRad = this.headingRad;
    this.rig.bodyPivot.rotation.y = this.headingRad;
    this.rig.root.position.copy(this.pos);
    scene.add(this.rig.root);
  }

  public applySkin(skinId: number): void {
    const spec = KART_SKINS[skinId % KART_SKINS.length];
    this.colorHex = spec.chassisHex;
    this.rig.chassisMesh.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
        if (mat.color && !mesh.name.toLowerCase().includes('glass') && !mesh.name.toLowerCase().includes('wheel')) {
          mat.color.setHex(spec.chassisHex);
        }
      }
    });
    (this.rig.helmetMesh.material as THREE.MeshStandardMaterial).color.setHex(spec.accentHex);
  }

  public equipRandomWeapon(): WeaponType {
    const roll = Math.random();
    if (roll < 0.44) {
      this.activeWeapon = 'rockets';
      this.weaponAmmo = 3;
    } else if (roll < 0.78) {
      this.activeWeapon = 'gatling';
      this.weaponAmmo = 18;
    } else {
      this.activeWeapon = 'mines';
      this.weaponAmmo = 2;
    }
    return this.activeWeapon;
  }

  public addPowerCube(): void {
    this.powerCubes = Math.min(15, this.powerCubes + 1);
    this.maxHp = Math.round(100 * this.armorUpgradeMult + this.powerCubes * 22);
    this.hp = Math.min(this.maxHp, this.hp + 30);
    const scale = 1.0 + Math.min(0.45, this.powerCubes * 0.035);
    this.rig.bodyPivot.scale.setScalar(scale);
  }

  public takeDamage(rawDamage: number, knockNx: number, knockNz: number): boolean {
    if (this.eliminated || this.shieldTimer > 0) return false;
    const dmgMult = this.mechaTimer > 0 ? 0.45 : 1.0;
    const actual = Math.max(4, Math.round(rawDamage * dmgMult));
    this.hp = Math.max(0, this.hp - actual);
    this.vel.x += knockNx * 9.5;
    this.vel.z += knockNz * 9.5;
    this.stunTimer = 0.22;
    return this.hp <= 0;
  }

  public update(dt: number): void {
    if (this.eliminated) {
      this.rig.root.visible = false;
      return;
    }

    if (this.stunTimer > 0) this.stunTimer = Math.max(0, this.stunTimer - dt);
    if (this.fireCooldown > 0) this.fireCooldown = Math.max(0, this.fireCooldown - dt);
    if (this.mechaTimer > 0) this.mechaTimer = Math.max(0, this.mechaTimer - dt);
    if (this.shieldTimer > 0) this.shieldTimer = Math.max(0, this.shieldTimer - dt);

    this.rig.mechaCannonGroup.visible = this.mechaTimer > 0;
    this.rig.shieldDome.visible = this.shieldTimer > 0;

    const baseSpeed =
      (this.isPlayer ? 12.2 : 10.6) *
      this.turboUpgradeMult *
      (this.mechaTimer > 0 ? 1.25 : 1.0);

    if (this.stunTimer <= 0) {
      const targetVx = this.steerX * baseSpeed;
      const targetVz = this.steerZ * baseSpeed;
      this.vel.x = THREE.MathUtils.lerp(this.vel.x, targetVx, Math.min(1.0, dt * 9.5));
      this.vel.z = THREE.MathUtils.lerp(this.vel.z, targetVz, Math.min(1.0, dt * 9.5));
    } else {
      this.vel.x *= Math.exp(-3.8 * dt);
      this.vel.z *= Math.exp(-3.8 * dt);
    }

    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;

    // Gravity return if launched off a stunt ramp
    if (this.pos.y > 0) {
      this.vel.y -= 24.0 * dt;
      this.pos.y += this.vel.y * dt;
      if (this.pos.y <= 0) {
        this.pos.y = 0;
        this.vel.y = 0;
      }
    }

    const speed = Math.hypot(this.vel.x, this.vel.z);
    if (speed > 0.4) {
      const targetHeading = Math.atan2(this.vel.x, this.vel.z);
      // Drift bank roll when turning sharply
      let angleDiff = targetHeading - this.headingRad;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      this.headingRad += angleDiff * Math.min(1.0, dt * 11.0);
      this.rig.bodyPivot.rotation.y = this.headingRad;
      this.rig.bodyPivot.rotation.z = THREE.MathUtils.clamp(-angleDiff * 0.35, -0.22, 0.22);
    } else {
      this.rig.bodyPivot.rotation.z *= 0.85;
    }

    this.wheelSpinRad += speed * dt * 2.8;
    for (let i = 0; i < this.rig.wheels.length; i++) {
      this.rig.wheels[i].rotation.x = this.wheelSpinRad;
    }

    this.rig.turretPivot.rotation.y = this.turretYawRad - this.headingRad;
    this.rig.root.position.copy(this.pos);
  }

  public dispose(scene: THREE.Scene): void {
    scene.remove(this.rig.root);
  }
}
