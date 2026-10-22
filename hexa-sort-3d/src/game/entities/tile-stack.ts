import * as THREE from 'three';
import { GAME_CONFIG, HexColorDef, tileLocalY } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export interface TileItem {
  color: HexColorDef;
  mesh: THREE.Group;
}

export class TileStack {
  public readonly group: THREE.Group;
  public readonly tiles: TileItem[] = [];
  private badgeSprite: THREE.Sprite | null = null;
  private badgeCanvas: HTMLCanvasElement | null = null;
  private badgeTexture: THREE.CanvasTexture | null = null;
  private lastBadgeText = '';

  constructor() {
    this.group = new THREE.Group();
  }

  public pushTile(color: HexColorDef, customMesh?: THREE.Group): TileItem {
    const mesh = customMesh || PrefabFactory.createTileMesh(color);
    const item: TileItem = { color, mesh };

    const y = tileLocalY(this.tiles.length);
    mesh.position.set(0, y, 0);
    mesh.scale.set(1, 1, 1);
    this.group.add(mesh);
    this.tiles.push(item);
    this.updateCountBadge();

    return item;
  }

  public popTop(): TileItem | null {
    if (this.tiles.length === 0) return null;
    const item = this.tiles.pop()!;
    this.group.remove(item.mesh);
    this.updateCountBadge();
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
    this.updateCountBadge();
  }

  public refreshVisualPositions(): void {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].mesh.position.y = tileLocalY(i);
    }
    this.updateCountBadge();
  }

  /**
   * Renders a crisp floating count pill (e.g. "7/10") above the stack so the player
   * can immediately gauge combo proximity from any camera angle.
   */
  public updateCountBadge(): void {
    const topCount = this.getContiguousTopCount();
    const topColor = this.getTopColor();

    if (topCount < 2 || !topColor) {
      if (this.badgeSprite) {
        this.badgeSprite.visible = false;
      }
      return;
    }

    if (!this.badgeCanvas) {
      this.badgeCanvas = document.createElement('canvas');
      this.badgeCanvas.width = 128;
      this.badgeCanvas.height = 64;
      this.badgeTexture = new THREE.CanvasTexture(this.badgeCanvas);
      this.badgeTexture.colorSpace = THREE.SRGBColorSpace;
      const mat = new THREE.SpriteMaterial({
        map: this.badgeTexture,
        transparent: true,
        depthTest: false,
      });
      this.badgeSprite = new THREE.Sprite(mat);
      this.badgeSprite.scale.set(0.85, 0.425, 1);
      this.badgeSprite.renderOrder = 10;
      this.group.add(this.badgeSprite);
    }

    const label = `${topCount}/${GAME_CONFIG.hex.clearMatchCount}`;
    const stateKey = `${label}_${topColor.id}`;

    if (stateKey !== this.lastBadgeText && this.badgeCanvas && this.badgeTexture) {
      this.lastBadgeText = stateKey;
      const ctx = this.badgeCanvas.getContext('2d')!;
      ctx.clearRect(0, 0, 128, 64);

      // Pill background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.strokeStyle = topColor.css;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(8, 10, 112, 44, 22);
      ctx.fill();
      ctx.stroke();

      // Count text
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 64, 33);

      this.badgeTexture.needsUpdate = true;
    }

    if (this.badgeSprite) {
      this.badgeSprite.visible = true;
      this.badgeSprite.position.set(
        0,
        tileLocalY(this.tiles.length - 1) + GAME_CONFIG.hex.height + 0.32,
        0
      );
    }
  }
}
