import { ITEM_TYPES } from '../../render/PrefabFactory';

export interface LevelItemData {
  id: string;
  typeId: string;
  tier: number;
  col: number;
  slotIndex: number;
  layer: number; // 0 = front (accessible), 1 = rear (uncovered when front is cleared)
}

export interface GeneratedLevel {
  levelNumber: number;
  items: LevelItemData[];
  totalTrios: number;
  parTime: number;
}

export class LevelGenerator {
  public static generateLevel(levelNum: number): GeneratedLevel {
    // Number of trios increases with level
    const totalTrios = Math.min(4 + levelNum * 2, 12);
    const availableTypes = ITEM_TYPES.slice(0, Math.min(3 + levelNum, ITEM_TYPES.length));

    // 1. Create triplet list
    const itemsToPlace: string[] = [];
    for (let t = 0; t < totalTrios; t++) {
      const type = availableTypes[t % availableTypes.length].typeId;
      itemsToPlace.push(type, type, type);
    }

    // Shuffle items
    for (let i = itemsToPlace.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [itemsToPlace[i], itemsToPlace[j]] = [itemsToPlace[j], itemsToPlace[i]];
    }

    const tiers = 3;
    const cols = 3;
    const items: LevelItemData[] = [];
    let itemCounter = 0;

    // Distribute into compartments:
    // First fill front layer (layer 0), then rear layer (layer 1)
    for (let layer = 0; layer <= 1; layer++) {
      for (let t = 0; t < tiers; t++) {
        for (let c = 0; c < cols; c++) {
          for (let s = 0; s < 3; s++) {
            if (itemsToPlace.length === 0) break;

            // Keep a couple slots in the front row empty for initial movement space
            if (layer === 0 && t === 0 && (s === 2 || (c === 0 && s === 1))) {
              continue;
            }

            const typeId = itemsToPlace.pop()!;
            items.push({
              id: `item_${++itemCounter}`,
              typeId,
              tier: t,
              col: c,
              slotIndex: s,
              layer,
            });
          }
          if (itemsToPlace.length === 0) break;
        }
        if (itemsToPlace.length === 0) break;
      }
      if (itemsToPlace.length === 0) break;
    }

    // If any items remain, place them in available slots
    let overflowIndex = 0;
    while (itemsToPlace.length > 0) {
      const typeId = itemsToPlace.pop()!;
      items.push({
        id: `item_${++itemCounter}`,
        typeId,
        tier: overflowIndex % 3,
        col: Math.floor(overflowIndex / 3) % 3,
        slotIndex: (overflowIndex % 3),
        layer: 1,
      });
      overflowIndex++;
    }

    return {
      levelNumber: levelNum,
      items,
      totalTrios,
      parTime: Math.max(60, 100 - levelNum * 4),
    };
  }
}
