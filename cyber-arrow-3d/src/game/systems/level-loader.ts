import { ArrowBlock } from '../entities/arrow-block';
import { CardinalDirection, ALL_DIRECTIONS, DIRECTION_VECTORS } from '../config/game-config';
import { PuzzleGrid } from '../entities/puzzle-grid';

export interface GridCoord {
  x: number;
  y: number;
  z: number;
}

/**
 * Procedural & curated level generator for 3D arrow puzzles.
 * Guarantees every puzzle is solvable by verifying clear escape trajectories.
 */
export class LevelLoader {
  public static loadLevel(levelNum: number, grid: PuzzleGrid): void {
    grid.clear();

    const coords = this.generateCoordsForLevel(levelNum);
    const assigned = this.assignSolvableDirections(coords);

    for (let i = 0; i < assigned.length; i++) {
      const item = assigned[i];
      const block = new ArrowBlock(item.x, item.y, item.z, item.dir);
      grid.addBlock(block);
    }

    grid.centerGrid();
  }

  private static generateCoordsForLevel(level: number): GridCoord[] {
    const coords: GridCoord[] = [];

    if (level === 1) {
      // 2x2x2 Mini Cube (8 blocks) - Quick onboarding
      for (let x = 0; x <= 1; x++) {
        for (let y = 0; y <= 1; y++) {
          for (let z = 0; z <= 1; z++) {
            coords.push({ x, y, z });
          }
        }
      }
    } else if (level === 2) {
      // 3x3 Flat Plus Shape (9 blocks)
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          coords.push({ x, y, z: 0 });
        }
      }
    } else if (level === 3) {
      // 3x3x2 Dual Layer (18 blocks)
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = 0; z <= 1; z++) {
            coords.push({ x, y, z });
          }
        }
      }
    } else if (level === 4) {
      // 3D Stepped Pyramid (15 integer blocks)
      // Base layer 3x3 (y = 0)
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          coords.push({ x, y: 0, z });
        }
      }
      // Mid cross (y = 1)
      coords.push({ x: 0, y: 1, z: 0 });
      coords.push({ x: 1, y: 1, z: 0 });
      coords.push({ x: -1, y: 1, z: 0 });
      coords.push({ x: 0, y: 1, z: 1 });
      coords.push({ x: 0, y: 1, z: -1 });
      // Top tip (y = 2)
      coords.push({ x: 0, y: 2, z: 0 });
    } else {
      // 3x3x3 Hollow Cube or scaled variants
      const size = Math.min(2 + Math.floor(level / 3), 4);
      const half = Math.floor(size / 2);

      for (let x = -half; x <= half; x++) {
        for (let y = -half; y <= half; y++) {
          for (let z = -half; z <= half; z++) {
            // Keep hollow shell for engaging 3D untangling
            const isShell =
              Math.abs(x) === half || Math.abs(y) === half || Math.abs(z) === half;
            if (isShell) {
              coords.push({ x, y, z });
            }
          }
        }
      }
    }

    return coords;
  }

  /**
   * Assigns directions using a reverse-peel topological DAG decomposition.
   * Eliminates mutual block cycles (A -> B and B -> A) and guarantees 100% solvability.
   */
  private static assignSolvableDirections(
    coords: GridCoord[]
  ): Array<GridCoord & { dir: CardinalDirection }> {
    const result: Array<GridCoord & { dir: CardinalDirection }> = [];
    const remaining = new Map<string, GridCoord>();

    for (let i = 0; i < coords.length; i++) {
      const c = coords[i];
      remaining.set(`${c.x},${c.y},${c.z}`, c);
    }

    // Peel until all blocks are assigned a solvable escape direction
    while (remaining.size > 0) {
      const candidates: Array<{ coord: GridCoord; dir: CardinalDirection }> = [];

      for (const coord of remaining.values()) {
        for (let d = 0; d < ALL_DIRECTIONS.length; d++) {
          const dir = ALL_DIRECTIONS[d];
          const vec = DIRECTION_VECTORS[dir];
          const dx = Math.round(vec.x);
          const dy = Math.round(vec.y);
          const dz = Math.round(vec.z);

          let isClear = true;
          let curX = coord.x + dx;
          let curY = coord.y + dy;
          let curZ = coord.z + dz;

          // Raycast outward in remaining unpeeled blocks
          for (let step = 0; step < 25; step++) {
            if (remaining.has(`${curX},${curY},${curZ}`)) {
              isClear = false;
              break;
            }
            curX += dx;
            curY += dy;
            curZ += dz;
          }

          if (isClear) {
            candidates.push({ coord, dir });
          }
        }
      }

      if (candidates.length === 0) {
        // Fallback for mathematical completeness
        const first = remaining.values().next().value as GridCoord;
        result.push({ ...first, dir: ALL_DIRECTIONS[0] });
        remaining.delete(`${first.x},${first.y},${first.z}`);
        continue;
      }

      // Pick a random solvable candidate
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      result.push({
        x: chosen.coord.x,
        y: chosen.coord.y,
        z: chosen.coord.z,
        dir: chosen.dir,
      });

      // Remove peeled block from active set
      remaining.delete(`${chosen.coord.x},${chosen.coord.y},${chosen.coord.z}`);
    }

    return result;
  }
}
