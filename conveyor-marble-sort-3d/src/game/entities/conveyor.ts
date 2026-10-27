import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';

export interface MarbleItem {
  id: string;
  colorId: string;
  hex: number;
  mesh: THREE.Mesh;
  t: number; // progress along conveyor loop [0, 1)
  isAbsorbing?: boolean;
  absorbProgress?: number;
  absorbStartPos?: THREE.Vector3;
  absorbEndPos?: THREE.Vector3;
}

export class ConveyorBelt {
  public maxSlots: number = GAME_CONFIG.conveyor.defaultSlotCount;
  public speed: number = GAME_CONFIG.conveyor.speed;
  public isGateOpen: boolean = false;
  public splitterGate: { root: THREE.Group; arm: THREE.Mesh } | null = null;
  private marbles: MarbleItem[] = [];
  private readonly loopPath: {
    getPathPoint: (t: number) => THREE.Vector3;
    getPathTangent: (t: number) => THREE.Vector3;
  };
  private beltOffset: number = 0;

  constructor(loopPath: {
    getPathPoint: (t: number) => THREE.Vector3;
    getPathTangent: (t: number) => THREE.Vector3;
  }) {
    this.loopPath = loopPath;
  }

  public get marblesOnBelt(): MarbleItem[] {
    return this.marbles;
  }

  public get occupiedCount(): number {
    return this.marbles.filter((m) => !m.isAbsorbing).length;
  }

  public get isFull(): boolean {
    return this.occupiedCount >= this.maxSlots;
  }

  public canAcceptAt(dropT: number, minDistance = 0.05): boolean {
    if (this.isFull) return false;
    for (let i = 0; i < this.marbles.length; i++) {
      const m = this.marbles[i];
      if (m.isAbsorbing) continue;
      const diff = Math.abs(m.t - dropT);
      const wrapDiff = Math.min(diff, 1 - diff);
      if (wrapDiff < minDistance) {
        return false;
      }
    }
    return true;
  }

  public addMarble(marble: MarbleItem): void {
    this.marbles.push(marble);
  }

  public removeMarble(marble: MarbleItem): void {
    const idx = this.marbles.indexOf(marble);
    if (idx !== -1) {
      this.marbles.splice(idx, 1);
    }
  }

  public expandCapacity(extra: number): void {
    this.maxSlots += extra;
  }

  public clearAllMarbles(scene: THREE.Scene): MarbleItem[] {
    const removed: MarbleItem[] = [];
    for (let i = 0; i < this.marbles.length; i++) {
      const m = this.marbles[i];
      scene.remove(m.mesh);
      removed.push(m);
    }
    this.marbles = [];
    return removed;
  }

  public update(dt: number): void {
    this.beltOffset = (this.beltOffset + this.speed * dt) % 1;

    if (this.splitterGate) {
      const targetRot = this.isGateOpen ? 0.95 : 0.0;
      this.splitterGate.arm.rotation.y = THREE.MathUtils.lerp(this.splitterGate.arm.rotation.y, targetRot, dt * 8.0);
    }

    // Advance circulating marbles
    for (let i = 0; i < this.marbles.length; i++) {
      const m = this.marbles[i];
      if (m.isAbsorbing) continue;

      m.t = (m.t + this.speed * dt) % 1;
      const pos = this.loopPath.getPathPoint(m.t);
      m.mesh.position.set(pos.x, pos.y + 0.38, pos.z);

      // Roll animation around tangent
      m.mesh.rotation.x += dt * 4.5;
      m.mesh.rotation.z += dt * 3.0;
    }
  }
}
