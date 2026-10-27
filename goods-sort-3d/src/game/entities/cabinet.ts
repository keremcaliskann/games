import * as THREE from 'three';
import { PrefabFactory } from '../../render/PrefabFactory';
import { GoodsItem } from './goods-item';

export class Cabinet {
  public readonly mesh: THREE.Group;
  public readonly getSlotPos: (tier: number, col: number, slotIndex: number, isVip?: boolean) => THREE.Vector3;
  private readonly vipTrayMesh: THREE.Object3D | null = null;
  public isVipTrayActive = false;

  private items: GoodsItem[] = [];

  constructor(scene: THREE.Scene, tiers: number = 3, cols: number = 3) {
    const data = PrefabFactory.createCabinet(tiers, cols);
    this.mesh = data.root;
    this.getSlotPos = data.getSlotPos;
    scene.add(this.mesh);

    this.vipTrayMesh = this.mesh.getObjectByName('vip_tray') || null;
  }

  public enableVipTray(): void {
    this.isVipTrayActive = true;
    if (this.vipTrayMesh) {
      this.vipTrayMesh.visible = true;
    }
  }

  public addItem(item: GoodsItem): void {
    this.items.push(item);
    this.mesh.add(item.mesh);
  }

  public removeItem(item: GoodsItem): void {
    const idx = this.items.indexOf(item);
    if (idx !== -1) {
      this.items.splice(idx, 1);
    }
    this.mesh.remove(item.mesh);
  }

  public getAllItems(): GoodsItem[] {
    return this.items;
  }

  public getFrontItemAt(tier: number, col: number, slotIndex: number): GoodsItem | undefined {
    return this.items.find(
      (i) => !i.isVip && i.tier === tier && i.col === col && i.slotIndex === slotIndex && i.layer === 0
    );
  }

  public getVipItemAt(slotIndex: number): GoodsItem | undefined {
    return this.items.find((i) => i.isVip && i.slotIndex === slotIndex);
  }

  public getItemsInCompartment(tier: number, col: number, layer: number = 0): GoodsItem[] {
    return this.items.filter(
      (i) => !i.isVip && i.tier === tier && i.col === col && i.layer === layer
    );
  }

  public isTierEmpty(tier: number): boolean {
    return this.items.filter((i) => !i.isVip && i.tier === tier).length === 0;
  }

  public getAvailableSlot(tier: number, col: number): number {
    const occupiedSlots = new Set(
      this.items
        .filter((i) => !i.isVip && i.tier === tier && i.col === col && i.layer === 0)
        .map((i) => i.slotIndex)
    );

    for (let s = 0; s < 3; s++) {
      if (!occupiedSlots.has(s)) {
        return s;
      }
    }
    return -1; // Compartment is full
  }

  public getAvailableVipSlot(): number {
    if (!this.isVipTrayActive) return -1;
    const occupied = new Set(this.items.filter((i) => i.isVip).map((i) => i.slotIndex));
    for (let s = 0; s < 3; s++) {
      if (!occupied.has(s)) return s;
    }
    return -1;
  }

  public uncoverRearItems(tier: number, col: number): void {
    // If a front slot is empty and there's a rear item at the same slot, slide it forward!
    for (let s = 0; s < 3; s++) {
      const frontItem = this.getFrontItemAt(tier, col, s);
      if (!frontItem) {
        const rearItem = this.items.find(
          (i) => !i.isVip && i.tier === tier && i.col === col && i.slotIndex === s && i.layer === 1
        );
        if (rearItem) {
          rearItem.layer = 0;
          const targetPos = this.getSlotPos(tier, col, s, false);
          rearItem.moveTo(targetPos);
          rearItem.setSelected(false);
        }
      }
    }
  }

  public update(dt: number): void {
    for (const item of this.items) {
      item.update(dt);
    }
  }

  public clear(): void {
    for (const item of this.items) {
      this.mesh.remove(item.mesh);
    }
    this.items = [];
    this.isVipTrayActive = false;
    if (this.vipTrayMesh) {
      this.vipTrayMesh.visible = false;
    }
  }
}
