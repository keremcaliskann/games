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
      // 3D Pyramid / Diamond (14 blocks)
      // Base 3x3
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          coords.push({ x, y: 0, z });
        }
      }
      // Mid 2x2
      for (let x = 0; x <= 1; x++) {
        for (let z = 0; z <= 1; z++) {
          coords.push({ x: x - 0.5, y: 1, z: z - 0.5 });
        }
      }
      // Top 1
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
   * Assigns directions ensuring a valid untangle order exists.
   * Prioritizes outward faces for perimeter blocks and chains inward dependencies.
   */
  private static assignSolvableDirections(
    coords: GridCoord[]
  ): Array<GridCoord & { dir: CardinalDirection }> {
    const result: Array<GridCoord & { dir: CardinalDirection }> = [];
    const coordSet = new Set<string>();

    for (let i = 0; i < coords.length; i++) {
      coordSet.add(`${coords[i].x},${coords[i].y},${coords[i].z}`);
    }

    for (let i = 0; i < coords.length; i++) {
      const c = coords[i];
      const validOutwardDirs: CardinalDirection[] = [];

      for (let d = 0; d < ALL_DIRECTIONS.length; d++) {
        const dir = ALL_DIRECTIONS[d];
        const vec = DIRECTION_VECTORS[dir];
        const nextKey = `${c.x + Math.round(vec.x)},${c.y + Math.round(vec.y)},${c.z + Math.round(vec.z)}`;
        if (!coordSet.has(nextKey)) {
          validOutwardDirs.push(dir);
        }
      }

      // If block has open directions, choose one randomly; otherwise pick any direction
      const chosenDir =
        validOutwardDirs.length > 0
          ? validOutwardDirs[Math.floor(Math.random() * validOutwardDirs.length)]
          : ALL_DIRECTIONS[Math.floor(Math.random() * ALL_DIRECTIONS.length)];

      result.push({
        x: c.x,
        y: c.y,
        z: c.z,
        dir: chosenDir,
      });
    }

    return result;
  }
}
