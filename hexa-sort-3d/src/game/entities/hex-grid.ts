import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';
import { TileStack } from './tile-stack';

export interface HexCell {
  q: number;
  r: number;
  key: string;
  worldX: number;
  worldY: number;
  worldZ: number;
  cellGroup: THREE.Group;
  innerMesh: THREE.Mesh;
  stack: TileStack;
  isBlocked: boolean;
}

export class HexGrid {
  public readonly group: THREE.Group;
  public readonly cells = new Map<string, HexCell>();
  private readonly neighborOffsets = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  constructor() {
    this.group = new THREE.Group();
  }

  /**
   * Builds concentric hex board.
   * boardRadius: 1 = 7 cells, 2 = 19 cells, 3 = 37 cells.
   */
  public generateBoard(boardRadius = 2, centerZ = -0.5): void {
    this.clear();

    const r = GAME_CONFIG.hex.radius;
    const spacing = GAME_CONFIG.hex.spacing;
    const horizDist = r * 1.5 * spacing;
    const vertDist = r * Math.sqrt(3) * spacing;

    for (let q = -boardRadius; q <= boardRadius; q++) {
      const r1 = Math.max(-boardRadius, -q - boardRadius);
      const r2 = Math.min(boardRadius, -q + boardRadius);

      for (let rCoord = r1; rCoord <= r2; rCoord++) {
        const key = `${q},${rCoord}`;
        const worldX = horizDist * q;
        const worldZ = vertDist * (rCoord + q / 2) + centerZ;
        const worldY = GAME_CONFIG.board.baseY;

        const { root, innerMesh } = PrefabFactory.createHexCellMesh();
        root.position.set(worldX, worldY, worldZ);
        this.group.add(root);

        const stack = new TileStack();
        stack.group.position.set(worldX, worldY + 0.12, worldZ);
        this.group.add(stack.group);

        const cell: HexCell = {
          q,
          r: rCoord,
          key,
          worldX,
          worldY,
          worldZ,
          cellGroup: root,
          innerMesh,
          stack,
          isBlocked: false,
        };

        this.cells.set(key, cell);
      }
    }
  }

  public getCell(q: number, r: number): HexCell | undefined {
    return this.cells.get(`${q},${r}`);
  }

  public getNeighbors(cell: HexCell): HexCell[] {
    const list: HexCell[] = [];
    for (const off of this.neighborOffsets) {
      const neighbor = this.getCell(cell.q + off.q, cell.r + off.r);
      if (neighbor && !neighbor.isBlocked) {
        list.push(neighbor);
      }
    }
    return list;
  }

  /**
   * Finds the closest empty (or matching) cell within snap distance
   */
  public findSnapTarget(worldX: number, worldZ: number, maxDistance = 1.3): HexCell | null {
    let bestCell: HexCell | null = null;
    let bestDistSq = maxDistance * maxDistance;

    for (const cell of this.cells.values()) {
      if (cell.isBlocked) continue;

      const dx = cell.worldX - worldX;
      const dz = cell.worldZ - worldZ;
      const distSq = dx * dx + dz * dz;

      if (distSq < bestDistSq) {
        bestDistSq = distSq;
        bestCell = cell;
      }
    }

    return bestCell;
  }

  public getOccupancyRatio(): number {
    if (this.cells.size === 0) return 0;
    let occupied = 0;
    let total = 0;

    for (const cell of this.cells.values()) {
      if (!cell.isBlocked) {
        total++;
        if (!cell.stack.isEmpty()) {
          occupied++;
        }
      }
    }

    return total > 0 ? occupied / total : 0;
  }

  public getOccupiedCells(): HexCell[] {
    const list: HexCell[] = [];
    for (const cell of this.cells.values()) {
      if (!cell.isBlocked && !cell.stack.isEmpty()) {
        list.push(cell);
      }
    }
    return list;
  }

  public getEmptyCells(): HexCell[] {
    const list: HexCell[] = [];
    for (const cell of this.cells.values()) {
      if (!cell.isBlocked && cell.stack.isEmpty()) {
        list.push(cell);
      }
    }
    return list;
  }

  /**
   * Returns a set of all unique exposed top color IDs currently on the board
   */
  public getExposedTopColorIds(): string[] {
    const colorIds = new Set<string>();
    for (const cell of this.cells.values()) {
      if (!cell.stack.isEmpty()) {
        const top = cell.stack.getTopColor();
        if (top) colorIds.add(top.id);
      }
    }
    return Array.from(colorIds);
  }

  public clearHighlights(): void {
    for (const cell of this.cells.values()) {
      PrefabFactory.setCellHighlight(cell.innerMesh, 'normal');
    }
  }

  public clear(): void {
    for (const cell of this.cells.values()) {
      cell.stack.clear();
      this.group.remove(cell.cellGroup);
      this.group.remove(cell.stack.group);
    }
    this.cells.clear();
  }
}
