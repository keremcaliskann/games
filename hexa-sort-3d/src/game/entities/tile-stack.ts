import * as THREE from 'three';
import { GAME_CONFIG, HexColorDef } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export interface TileItem {
  color: HexColorDef;
  mesh: THREE.Group;
}

export class TileStack {
  public readonly group: THREE.Group;
  public readonly tiles: TileItem[] = [];

  constructor() {
    this.group = new THREE.Group();
  }

  public pushTile(color: HexColorDef, customMesh?: THREE.Group): TileItem {
    const mesh = customMesh || PrefabFactory.createTileMesh(color);
    const item: TileItem = { color, mesh };

    const y = this.tiles.length * GAME_CONFIG.hex.height;
    mesh.position.set(0, y, 0);
    mesh.scale.set(1, 1, 1);
    this.group.add(mesh);
    this.tiles.push(item);

    return item;
  }

  public popTop(): TileItem | null {
    if (this.tiles.length === 0) return null;
    const item = this.tiles.pop()!;
    this.group.remove(item.mesh);
    return item;
  }

  public peekTop(): TileItem | null {
    return this.tiles.length > 0 ? this.tiles[this.tiles.length - 1] : null;
  }

  public getTopColor(): HexColorDef | null {
    const top = this.peekTop();
    return top ? top.color : null;
  }

  public get size(): number {
    return this.tiles.length;
  }

  public isEmpty(): boolean {
    return this.tiles.length === 0;
  }

  /**
   * Returns how many contiguous tiles from the top share the exact same color.
   */
  public getContiguousTopCount(): number {
    if (this.tiles.length === 0) return 0;
    const topColor = this.tiles[this.tiles.length - 1].color.id;
    let count = 0;
    for (let i = this.tiles.length - 1; i >= 0; i--) {
      if (this.tiles[i].color.id === topColor) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  /**
   * Pops up to 'count' contiguous top tiles and returns them
   */
  public popContiguousTop(count: number): TileItem[] {
    const popped: TileItem[] = [];
    const actual = Math.min(count, this.getContiguousTopCount());
    for (let i = 0; i < actual; i++) {
      const item = this.popTop();
      if (item) popped.push(item);
    }
    return popped;
  }

  /**
   * Checks if this stack has at least 10 identical contiguous tiles on top for a combo clear
   */
  public checkComboClear(): { canClear: boolean; color: HexColorDef | null; count: number } {
    const count = this.getContiguousTopCount();
    if (count >= GAME_CONFIG.hex.clearMatchCount) {
      return {
        canClear: true,
        color: this.getTopColor(),
        count,
      };
    }
    return { canClear: false, color: null, count: 0 };
  }

  /**
   * Cleans up and disposes all meshes in the stack
   */
  public clear(): void {
    while (this.tiles.length > 0) {
      const item = this.tiles.pop()!;
      this.group.remove(item.mesh);
    }
  }

  public refreshVisualPositions(): void {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].mesh.position.y = i * GAME_CONFIG.hex.height;
    }
  }
}
