import * as THREE from 'three';
import { Cabinet } from '../game/entities/cabinet';
import { GoodsItem } from '../game/entities/goods-item';

export interface InputCallbacks {
  onItemMoved: () => void;
  onParallax: (x: number, y: number) => void;
  onPlayClickSound: () => void;
  onPlaySlideSound: () => void;
}

export class InputManager {
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private selectedItem: GoodsItem | null = null;

  constructor(
    private readonly container: HTMLElement,
    private readonly camera: THREE.Camera,
    private readonly cabinet: Cabinet,
    private readonly callbacks: InputCallbacks
  ) {
    this.setupListeners();
  }

  private setupListeners(): void {
    this.container.addEventListener('pointerdown', (e) => {
      // Isolate clicks on HUD interactive buttons
      const target = e.target as HTMLElement;
      if (
        target.closest('.hud-btn') ||
        target.closest('.booster-btn') ||
        target.closest('.modal-card') ||
        target.closest('.modal-overlay') ||
        target.closest('.arcade-sidebar') ||
        target.closest('.shell-sidebar') ||
        target.closest('[data-hud-interactive]')
      ) {
        return;
      }

      const rect = this.container.getBoundingClientRect();
      this.pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.handleTap();
    });

    window.addEventListener('pointermove', (e) => {
      const rect = this.container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      this.callbacks.onParallax(px, py);
    });
  }

  private handleTap(): void {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.cabinet.mesh.children, true);

    if (intersects.length === 0) {
      if (this.selectedItem) {
        this.selectedItem.setSelected(false);
        this.selectedItem = null;
      }
      return;
    }

    // 1. Check if an item mesh was clicked
    let clickedItem: GoodsItem | null = null;
    for (const hit of intersects) {
      let cur: THREE.Object3D | null = hit.object;
      while (cur && cur !== this.cabinet.mesh) {
        const found = this.cabinet.getAllItems().find((i) => i.mesh === cur);
        if (found) {
          clickedItem = found;
          break;
        }
        cur = cur.parent;
      }
      if (clickedItem) break;
    }

    // 2. Logic: Selecting vs Moving
    if (clickedItem) {
      // Cannot select rear items
      if (clickedItem.layer === 1) return;

      if (!this.selectedItem) {
        // First selection
        this.selectedItem = clickedItem;
        this.selectedItem.setSelected(true);
        this.callbacks.onPlayClickSound();
        return;
      } else if (this.selectedItem === clickedItem) {
        // Deselect
        this.selectedItem.setSelected(false);
        this.selectedItem = null;
        this.callbacks.onPlayClickSound();
        return;
      } else {
        // Clicked another item: if in a different compartment, attempt to move selected item to this compartment!
        const targetTier = clickedItem.tier;
        const targetCol = clickedItem.col;
        const isTargetVip = clickedItem.isVip;

        if (this.selectedItem.tier === targetTier && this.selectedItem.col === targetCol && !isTargetVip) {
          // Same compartment, switch selection
          this.selectedItem.setSelected(false);
          this.selectedItem = clickedItem;
          this.selectedItem.setSelected(true);
          this.callbacks.onPlayClickSound();
          return;
        } else {
          this.tryMoveSelectedItem(targetTier, targetCol, isTargetVip);
          return;
        }
      }
    }

    // 3. Clicked empty shelf area or cabinet wood
    if (this.selectedItem) {
      const hitPoint = intersects[0].point;
      const targetCompartment = this.calculateCompartmentFromPoint(hitPoint);
      if (targetCompartment) {
        this.tryMoveSelectedItem(targetCompartment.tier, targetCompartment.col, targetCompartment.isVip);
      }
    }
  }

  private tryMoveSelectedItem(targetTier: number, targetCol: number, isVip: boolean): void {
    if (!this.selectedItem) return;

    if (isVip) {
      const availableVipSlot = this.cabinet.getAvailableVipSlot();
      if (availableVipSlot !== -1) {
        const item = this.selectedItem;
        const oldTier = item.tier;
        const oldCol = item.col;
        const wasVip = item.isVip;

        item.setSelected(false);
        this.selectedItem = null;

        item.isVip = true;
        item.slotIndex = availableVipSlot;
        const targetPos = this.cabinet.getSlotPos(0, 0, availableVipSlot, true);
        item.moveTo(targetPos, () => {
          if (!wasVip) {
            this.cabinet.uncoverRearItems(oldTier, oldCol);
          }
          this.callbacks.onItemMoved();
        });

        this.callbacks.onPlaySlideSound();
      }
      return;
    }

    const availableSlot = this.cabinet.getAvailableSlot(targetTier, targetCol);
    if (availableSlot !== -1) {
      const item = this.selectedItem;
      const oldTier = item.tier;
      const oldCol = item.col;
      const wasVip = item.isVip;

      item.setSelected(false);
      this.selectedItem = null;

      item.tier = targetTier;
      item.col = targetCol;
      item.slotIndex = availableSlot;
      item.isVip = false;

      const targetPos = this.cabinet.getSlotPos(targetTier, targetCol, availableSlot, false);
      item.moveTo(targetPos, () => {
        if (!wasVip) {
          this.cabinet.uncoverRearItems(oldTier, oldCol);
        }
        this.callbacks.onItemMoved();
      });

      this.callbacks.onPlaySlideSound();
    }
  }

  private calculateCompartmentFromPoint(point: THREE.Vector3): { tier: number; col: number; isVip: boolean } | null {
    // Check VIP tray height
    if (point.y < -1.4) {
      return { tier: 0, col: 0, isVip: true };
    }

    // 3 columns: x from -3.9 to 3.9
    const col = Math.floor((point.x + 3.9) / 2.6);
    // 3 tiers: y from -2.5 to 4.1
    const tier = Math.floor((point.y + 2.5) / 2.2);

    if (col >= 0 && col < 3 && tier >= 0 && tier < 3) {
      return { tier, col, isVip: false };
    }
    return null;
  }

  public clearSelection(): void {
    if (this.selectedItem) {
      this.selectedItem.setSelected(false);
      this.selectedItem = null;
    }
  }
}
