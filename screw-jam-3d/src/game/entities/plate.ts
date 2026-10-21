import * as THREE from 'three';
import { ColorDef } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export class Plate {
  public readonly id: string;
  public readonly color: ColorDef;
  public readonly holdingScrewIds = new Set<string>();

  public readonly group: THREE.Group;
  public readonly mesh: THREE.Mesh;

  public isFalling = false;
  public isDropped = false;
  private velocityY = 0;
  private rotSpeedX = 0;
  private rotSpeedZ = 0;

  constructor(
    id: string,
    width: number,
    height: number,
    holes: { x: number; y: number }[],
    color: ColorDef,
    position: THREE.Vector3,
    quaternion: THREE.Quaternion
  ) {
    this.id = id;
    this.color = color;

    const { group, mesh } = PrefabFactory.createPlateMesh(width, height, holes, color);
    this.group = group;
    this.mesh = mesh;

    this.group.position.copy(position);
    this.group.quaternion.copy(quaternion);

    this.mesh.userData = { plate: this };
  }

  public addHoldingScrew(screwId: string): void {
    this.holdingScrewIds.add(screwId);
  }

  public removeHoldingScrew(screwId: string): boolean {
    this.holdingScrewIds.delete(screwId);
    if (this.holdingScrewIds.size === 0 && !this.isFalling) {
      this.startFalling();
      return true; // Just detached!
    }
    return false;
  }

  public startFalling(): void {
    this.isFalling = true;
    this.velocityY = 0.5; // Slight initial pop
    this.rotSpeedX = (Math.random() - 0.5) * 4.0;
    this.rotSpeedZ = (Math.random() - 0.5) * 4.0;
  }

  public update(dt: number): void {
    if (!this.isFalling || this.isDropped) return;

    // Gravity drop
    this.velocityY -= 14.0 * dt;
    this.group.position.y += this.velocityY * dt;

    // Tumble rotation
    this.group.rotation.x += this.rotSpeedX * dt;
    this.group.rotation.z += this.rotSpeedZ * dt;

    // Fade out and dispose when well beneath view
    if (this.group.position.y < -12) {
      this.isDropped = true;
      this.group.visible = false;
    }
  }

  public dispose(): void {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) {
      this.mesh.material.forEach((m) => m.dispose());
    } else {
      this.mesh.material.dispose();
    }
  }
}
