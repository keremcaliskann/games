import * as THREE from 'three';
import { PrefabFactory } from '../../render/PrefabFactory';

const _UNIT_SCALE = new THREE.Vector3(1, 1, 1);

export class GolemEnemy {
  public readonly group: THREE.Group;
  private leftArm: THREE.Mesh;
  private rightArm: THREE.Mesh;

  public hp: number;
  public maxHp: number;
  public isAlive = true;
  public speed: number;
  public freezeTimer = 0;
  private walkTime = 0;

  constructor(x: number, z: number, hp = 10, speed = 2.2) {
    const parts = PrefabFactory.createGolem();
    this.group = parts.group;
    this.leftArm = parts.leftArm;
    this.rightArm = parts.rightArm;

    this.group.position.set(x, 0, z);
    this.hp = hp;
    this.maxHp = hp;
    this.speed = speed;
  }

  public get position(): THREE.Vector3 {
    return this.group.position;
  }

  public takeDamage(dmg: number): boolean {
    this.hp -= dmg;
    // Brief red flash or scale twitch
    this.group.scale.set(1.15, 0.9, 1.15);

    if (this.hp <= 0) {
      this.isAlive = false;
      this.group.visible = false;
      return true;
    }
    return false;
  }

  public freeze(duration = 3.0): void {
    this.freezeTimer = duration;
  }

  public update(dt: number, targetZ: number): boolean {
    if (!this.isAlive) return false;

    if (this.freezeTimer > 0) {
      this.freezeTimer = Math.max(0, this.freezeTimer - dt);
      return false; // Frozen in ice!
    }

    // Advance towards target Z (turret)
    this.group.position.z += this.speed * dt;

    // Arm swing animation
    this.walkTime += dt * 5.0;
    this.leftArm.rotation.x = Math.sin(this.walkTime) * 0.45;
    this.rightArm.rotation.x = -Math.sin(this.walkTime) * 0.45;

    // Recover squish scale
    this.group.scale.lerp(_UNIT_SCALE, dt * 8.0);

    // Reached perimeter line?
    if (this.group.position.z >= targetZ - 1.5) {
      return true; // Breached defense!
    }

    return false;
  }

  public reset(x: number, z: number, hp: number): void {
    this.group.position.set(x, 0, z);
    this.hp = hp;
    this.maxHp = hp;
    this.isAlive = true;
    this.group.visible = true;
    this.group.scale.set(1, 1, 1);
  }
}
