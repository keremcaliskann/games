import * as THREE from 'three';
import { GAME_CONFIG, HexColorDef } from '../config/game-config';
import { TileStack } from './tile-stack';
import { PrefabFactory } from '../../render/PrefabFactory';

export interface TraySlot {
  index: number;
  worldPos: THREE.Vector3;
  stack: TileStack | null;
}

export class TraySpawner {
  public readonly group: THREE.Group;
  public readonly slots: TraySlot[] = [];
  public readonly trayPlatformMesh: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
    this.trayPlatformMesh = PrefabFactory.createTrayPlatform();
    this.trayPlatformMesh.position.set(0, 0, GAME_CONFIG.tray.zOffset);
    this.group.add(this.trayPlatformMesh);

    const xCoords = [-2.4, 0, 2.4];
    for (let i = 0; i < GAME_CONFIG.tray.slotCount; i++) {
      const pos = new THREE.Vector3(xCoords[i], GAME_CONFIG.tray.yPos, GAME_CONFIG.tray.zOffset);
      this.slots.push({
        index: i,
        worldPos: pos,
        stack: null,
      });
    }
  }

  /**
   * Refills any empty slots with smart solvability biased stacks
   */
  public refillSlots(
    activeColors: HexColorDef[],
    exposedBoardColors: string[],
    occupancyRatio: number
  ): void {
    for (const slot of this.slots) {
      if (!slot.stack) {
        slot.stack = this.generateStack(activeColors, exposedBoardColors, occupancyRatio);
        slot.stack.group.position.copy(slot.worldPos);
        this.group.add(slot.stack.group);
      }
    }
  }

  /**
   * Solvability stack generator: Biases top color toward board colors when board is crowded
   */
  public generateStack(
    activeColors: HexColorDef[],
    exposedBoardColors: string[],
    occupancyRatio: number
  ): TileStack {
    const stack = new TileStack();
    const count = 2 + Math.floor(Math.random() * 3); // 2 to 4 tiles per stack

    // Determine target top color
    let topColor: HexColorDef;
    const shouldBias = occupancyRatio >= 0.55 && exposedBoardColors.length > 0;

    if (shouldBias && Math.random() < 0.75) {
      const targetId = exposedBoardColors[Math.floor(Math.random() * exposedBoardColors.length)];
      topColor = activeColors.find((c) => c.id === targetId) || activeColors[0];
    } else {
      topColor = activeColors[Math.floor(Math.random() * activeColors.length)];
    }

    // Determine if stack is monochrome or 2-toned
    const isSingleColor = Math.random() < 0.6;
    let baseColor = topColor;
    if (!isSingleColor) {
      const otherColors = activeColors.filter((c) => c.id !== topColor.id);
      baseColor = otherColors.length > 0
        ? otherColors[Math.floor(Math.random() * otherColors.length)]
        : topColor;
    }

    // Push base tiles first, then top tiles
    const topTileCount = isSingleColor ? count : 1 + Math.floor(Math.random() * (count - 1));
    const baseTileCount = count - topTileCount;

    for (let i = 0; i < baseTileCount; i++) {
      stack.pushTile(baseColor);
    }
    for (let i = 0; i < topTileCount; i++) {
      stack.pushTile(topColor);
    }

    return stack;
  }

  /**
   * Rerolls all slots (Swap Hand Booster)
   */
  public rerollAll(
    activeColors: HexColorDef[],
    exposedBoardColors: string[],
    occupancyRatio: number
  ): void {
    for (const slot of this.slots) {
      if (slot.stack) {
        this.group.remove(slot.stack.group);
        slot.stack.clear();
        slot.stack = null;
      }
    }
    this.refillSlots(activeColors, exposedBoardColors, occupancyRatio);
  }

  /**
   * Finds the tray slot closest to raycasted world position
   */
  public findHoveredSlot(worldX: number, worldZ: number, maxDist = 1.2): TraySlot | null {
    let bestSlot: TraySlot | null = null;
    let bestDistSq = maxDist * maxDist;

    for (const slot of this.slots) {
      if (!slot.stack) continue;
      const dx = slot.worldPos.x - worldX;
      const dz = slot.worldPos.z - worldZ;
      const d2 = dx * dx + dz * dz;
      if (d2 < bestDistSq) {
        bestDistSq = d2;
        bestSlot = slot;
      }
    }

    return bestSlot;
  }

  public getAvailableStackCount(): number {
    return this.slots.filter((s) => s.stack !== null && !s.stack.isEmpty()).length;
  }

  public clear(): void {
    for (const slot of this.slots) {
      if (slot.stack) {
        this.group.remove(slot.stack.group);
        slot.stack.clear();
        slot.stack = null;
      }
    }
  }
}
