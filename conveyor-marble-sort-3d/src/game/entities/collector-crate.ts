import * as THREE from 'three';
import { PrefabFactory } from '../../render/PrefabFactory';
import { MARBLE_COLORS } from '../config/game-config';

export class CollectorCrateEntity {
  public readonly id: string;
  public readonly colorId: string;
  public readonly colorHex: number;
  public readonly capacity: number;
  public currentCount: number = 0;
  public readonly dockT: number;
  public readonly root: THREE.Group;
  public readonly badgeMesh: THREE.Mesh;
  public isShipping = false;
  public isDeparted = false;
  private readonly updateProgressBadge: (count: number) => void;
  private collectedMeshes: THREE.Mesh[] = [];
  private shipProgress = 0;

  constructor(
    id: string,
    colorId: string,
    capacity: number,
    dockPosition: THREE.Vector3,
    dockT: number
  ) {
    this.id = id;
    this.colorId = colorId;
    this.colorHex = MARBLE_COLORS[colorId]?.hex ?? 0xef4444;
    this.capacity = capacity;
    this.dockT = dockT;

    const { root, badgeMesh, updateProgress } = PrefabFactory.createCollectorCrate(this.colorHex, capacity);
    this.root = root;
    this.badgeMesh = badgeMesh;
    this.updateProgressBadge = updateProgress;

    this.root.position.copy(dockPosition);
  }

  public get isFull(): boolean {
    return this.currentCount >= this.capacity;
  }

  public get needsMarble(): boolean {
    return !this.isShipping && !this.isDeparted && !this.isFull;
  }

  public addMarble(): void {
    if (this.isFull) return;
    this.currentCount++;
    this.updateProgressBadge(this.currentCount);

    // Add a miniature marble inside crate
    const m = PrefabFactory.createMarbleMesh(this.colorHex);
    m.scale.setScalar(0.75);
    const offsetX = ((this.currentCount - 1) % 2 === 0 ? -0.35 : 0.35);
    const offsetZ = (this.currentCount > 2 ? 0.35 : -0.35);
    m.position.set(offsetX, 0.75, offsetZ);
    this.root.add(m);
    this.collectedMeshes.push(m);

    // Bounce crate
    this.root.position.y += 0.2;
    setTimeout(() => {
      this.root.position.y -= 0.2;
    }, 100);
  }

  public triggerShipDeparture(): void {
    this.isShipping = true;
    this.shipProgress = 0;
  }

  public update(dt: number): void {
    if (this.isShipping && !this.isDeparted) {
      this.shipProgress += dt * 1.8;
      this.root.position.y += dt * 3.5;
      this.root.position.z += dt * 4.0;
      this.root.rotation.x += dt * 1.2;
      this.root.scale.subScalar(dt * 0.9);

      if (this.shipProgress >= 1.0) {
        this.isDeparted = true;
        this.root.visible = false;
      }
    }
  }
}
