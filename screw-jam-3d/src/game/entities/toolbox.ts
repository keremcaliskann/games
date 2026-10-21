import * as THREE from 'three';
import { ColorDef, GAME_CONFIG } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';
import { Screw } from './screw';

export class Toolbox {
  public readonly id: string;
  public readonly color: ColorDef;
  public readonly capacity = GAME_CONFIG.toolboxCapacity;
  public readonly screws: Screw[] = [];

  public readonly group: THREE.Group;
  public readonly bodyMesh: THREE.Mesh;
  public readonly socketRings: THREE.Mesh[];

  public isSlidingAway = false;
  public isCompleted = false;

  private socketOffsets = [-0.75, 0, 0.75];

  constructor(id: string, color: ColorDef, position: THREE.Vector3) {
    this.id = id;
    this.color = color;

    const { group, bodyMesh, socketRings } = PrefabFactory.createToolboxMesh(color);
    this.group = group;
    this.bodyMesh = bodyMesh;
    this.socketRings = socketRings;

    this.group.position.copy(position);
  }

  public getNextSocketWorldPosition(): THREE.Vector3 | null {
    if (this.screws.length >= this.capacity) return null;
    const idx = this.screws.length;
    const local = new THREE.Vector3(this.socketOffsets[idx], 0.22, 0);
    return local.applyMatrix4(this.group.matrixWorld);
  }

  public addScrew(screw: Screw): boolean {
    if (this.screws.length >= this.capacity) return false;
    this.screws.push(screw);
    if (this.screws.length === this.capacity) {
      this.isCompleted = true;
      return true; // Box full!
    }
    return false;
  }

  public isFull(): boolean {
    return this.screws.length >= this.capacity;
  }

  public startSlideAway(): void {
    this.isSlidingAway = true;
  }

  public update(dt: number): void {
    if (this.isSlidingAway) {
      this.group.position.y += dt * 4.5;
      this.group.scale.multiplyScalar(Math.max(0, 1 - dt * 2.5));
      if (this.group.scale.x < 0.05) {
        this.group.visible = false;
      }
    }
  }

  public dispose(): void {
    this.group.traverse((c) => {
      if ((c as THREE.Mesh).geometry) {
        (c as THREE.Mesh).geometry.dispose();
      }
    });
  }
}
