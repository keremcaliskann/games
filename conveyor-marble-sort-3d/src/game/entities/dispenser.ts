import * as THREE from 'three';
import { PrefabFactory } from '../../render/PrefabFactory';
import { MARBLE_COLORS } from '../config/game-config';

export class DispenserEntity {
  public readonly id: string;
  public readonly colorId: string;
  public readonly colorHex: number;
  public readonly dropT: number;
  public queue: string[] = [];
  public readonly root: THREE.Group;
  public readonly hitTarget: THREE.Mesh;
  private readonly updateCountBadge: (count: number) => void;
  private previewMarbles: THREE.Mesh[] = [];

  constructor(
    id: string,
    colorId: string,
    count: number,
    position: THREE.Vector3,
    dropT: number
  ) {
    this.id = id;
    this.colorId = colorId;
    this.colorHex = MARBLE_COLORS[colorId]?.hex ?? 0x3b82f6;
    this.dropT = dropT;

    for (let i = 0; i < count; i++) {
      this.queue.push(colorId);
    }

    const { root, hitTarget, updateCount } = PrefabFactory.createDispenser(this.colorHex, count);
    this.root = root;
    this.hitTarget = hitTarget;
    this.updateCountBadge = updateCount;

    this.root.position.copy(position);
    this.rebuildPreviewMarbles();
  }

  public get remainingCount(): number {
    return this.queue.length;
  }

  public get isEmpty(): boolean {
    return this.queue.length === 0;
  }

  public popNext(): string | null {
    if (this.isEmpty) return null;
    const color = this.queue.shift() ?? null;
    this.updateCountBadge(this.remainingCount);
    this.rebuildPreviewMarbles();
    return color;
  }

  public addMarbles(count: number): void {
    for (let i = 0; i < count; i++) {
      this.queue.push(this.colorId);
    }
    this.updateCountBadge(this.remainingCount);
    this.rebuildPreviewMarbles();
  }

  private rebuildPreviewMarbles(): void {
    // Clear old visual preview marbles
    for (let i = 0; i < this.previewMarbles.length; i++) {
      this.root.remove(this.previewMarbles[i]);
    }
    this.previewMarbles = [];

    // Show up to 4 marbles inside the silo column
    const visibleCount = Math.min(this.remainingCount, 4);
    for (let i = 0; i < visibleCount; i++) {
      const marble = PrefabFactory.createMarbleMesh(this.colorHex);
      marble.scale.setScalar(0.85);
      marble.position.set(0, 0.75 + i * 0.55, 0);
      this.root.add(marble);
      this.previewMarbles.push(marble);
    }
  }

  public triggerSquash(): void {
    const startY = this.root.scale.y;
    this.root.scale.set(1.15, 0.85, 1.15);
    setTimeout(() => {
      this.root.scale.set(1.0, startY, 1.0);
    }, 120);
  }
}
