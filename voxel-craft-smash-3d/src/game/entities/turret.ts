import * as THREE from 'three';
import { PrefabFactory } from '../../render/PrefabFactory';
import { GAME_CONFIG } from '../config/game-config';

export class Turret {
  public readonly group: THREE.Group;
  private swivel: THREE.Group;
  private barrelLeft: THREE.Mesh;
  private barrelRight: THREE.Mesh;

  public hp = GAME_CONFIG.turretBaseHp;
  public maxHp = GAME_CONFIG.turretBaseHp;
  public doubleCannonTimer = 0;

  private fireCooldown = 0;
  private alternateBarrel = false;
  private recoilLeft = 0;
  private recoilRight = 0;

  constructor(x = 0, z = 16) {
    const parts = PrefabFactory.createTurret();
    this.group = parts.group;
    this.swivel = parts.swivel;
    this.barrelLeft = parts.barrelLeft;
    this.barrelRight = parts.barrelRight;

    this.group.position.set(x, 0, z);
  }

  public get position(): THREE.Vector3 {
    return this.group.position;
  }

  public aimAt(targetWorldPos: THREE.Vector3): void {
    const dx = targetWorldPos.x - this.group.position.x;
    const dz = targetWorldPos.z - this.group.position.z;
    const targetAngle = Math.atan2(dx, -dz); // 0 is forward along -Z

    // Smoothly rotate swivel
    this.swivel.rotation.y = THREE.MathUtils.lerp(this.swivel.rotation.y, targetAngle, 0.25);
  }

  public canFire(): boolean {
    return this.fireCooldown <= 0;
  }

  public fire(): { origin: THREE.Vector3; direction: THREE.Vector3 }[] {
    let interval = GAME_CONFIG.baseFireIntervalSec;
    if (this.doubleCannonTimer > 0) {
      interval *= 0.5; // Double fire rate
    }
    this.fireCooldown = interval;

    const angle = this.swivel.rotation.y;
    const forward = new THREE.Vector3(Math.sin(angle), 0, -Math.cos(angle)).normalize();

    const shots: { origin: THREE.Vector3; direction: THREE.Vector3 }[] = [];

    if (this.doubleCannonTimer > 0) {
      // Fire both barrels simultaneously
      shots.push({ origin: this.getBarrelTipWorldPos(-0.55), direction: forward.clone() });
      shots.push({ origin: this.getBarrelTipWorldPos(0.55), direction: forward.clone() });
      this.recoilLeft = 0.4;
      this.recoilRight = 0.4;
    } else {
      // Alternating fire
      this.alternateBarrel = !this.alternateBarrel;
      const offset = this.alternateBarrel ? 0.55 : -0.55;
      shots.push({ origin: this.getBarrelTipWorldPos(offset), direction: forward });

      if (this.alternateBarrel) {
        this.recoilRight = 0.4;
      } else {
        this.recoilLeft = 0.4;
      }
    }

    return shots;
  }

  private getBarrelTipWorldPos(xOffset: number): THREE.Vector3 {
    const pos = new THREE.Vector3(xOffset, 1.35, -2.4);
    pos.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.swivel.rotation.y);
    pos.add(this.group.position);
    return pos;
  }

  public update(dt: number): void {
    if (this.fireCooldown > 0) {
      this.fireCooldown = Math.max(0, this.fireCooldown - dt);
    }
    if (this.doubleCannonTimer > 0) {
      this.doubleCannonTimer = Math.max(0, this.doubleCannonTimer - dt);
    }

    // Recoil springs
    if (this.recoilLeft > 0) {
      this.recoilLeft = Math.max(0, this.recoilLeft - dt * 2.5);
      this.barrelLeft.position.z = -1.2 + this.recoilLeft;
    }
    if (this.recoilRight > 0) {
      this.recoilRight = Math.max(0, this.recoilRight - dt * 2.5);
      this.barrelRight.position.z = -1.2 + this.recoilRight;
    }
  }

  public takeDamage(dmg: number): void {
    this.hp = Math.max(0, this.hp - dmg);
  }

  public reset(): void {
    this.hp = this.maxHp;
    this.doubleCannonTimer = 0;
    this.fireCooldown = 0;
    this.swivel.rotation.y = 0;
  }
}
