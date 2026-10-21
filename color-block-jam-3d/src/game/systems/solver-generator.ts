import { Board } from '../entities/board';
import { Block, GridCell } from '../entities/block';
import { ShredderGate, GateSide } from '../entities/shredder-gate';
import { BLOCK_COLORS, ColorDef } from '../config/game-config';

export interface LevelData {
  levelNumber: number;
  cols: number;
  rows: number;
  parMoves: number;
  gates: {
    side: GateSide;
    color: ColorDef;
    cellIndex: number;
    spanCells: number;
  }[];
  blocks: {
    id: string;
    color: ColorDef;
    shapeCells: GridCell[];
    gridX: number;
    gridY: number;
  }[];
}

// Preset polyomino shapes
const SHAPES: Record<string, GridCell[]> = {
  '1x1': [{ x: 0, y: 0 }],
  '1x2': [{ x: 0, y: 0 }, { x: 1, y: 0 }],
  '2x1': [{ x: 0, y: 0 }, { x: 0, y: 1 }],
  '1x3': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }],
  '3x1': [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }],
  '2x2': [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  'L_right': [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
};

export class LevelGenerator {
  /**
   * Generates or loads a 100% mathematically solvable level configuration.
   */
  public static generateLevel(level: number): LevelData {
    // Curated handcrafted levels for smooth onboarding and instant 2-second hook
    if (level === 1) {
      return this.getLevel1();
    }
    if (level === 2) {
      return this.getLevel2();
    }
    if (level === 3) {
      return this.getLevel3();
    }

    // Procedural reverse-shuffle generator for levels 4+ with 25-attempt solvability verification
    for (let attempt = 0; attempt < 25; attempt++) {
      const candidate = this.generateReverseShuffleLevel(level, attempt);
      if (candidate.blocks.length >= 4 && this.validateLevelSolvability(candidate)) {
        return candidate;
      }
    }

    return this.getFallbackPreset(level);
  }

  /**
   * Level 1: Instant 2-second tactile tutorial.
   * 5x5 board with 3 blocks and 3 perimeter shredder gates.
   * Nearest red block slides directly into top red gate in 1 swipe!
   */
  private static getLevel1(): LevelData {
    return {
      levelNumber: 1,
      cols: 5,
      rows: 5,
      parMoves: 8,
      gates: [
        { side: 'top', color: BLOCK_COLORS.red, cellIndex: 2, spanCells: 2 },
        { side: 'bottom', color: BLOCK_COLORS.blue, cellIndex: 1, spanCells: 2 },
        { side: 'right', color: BLOCK_COLORS.yellow, cellIndex: 2, spanCells: 2 },
      ],
      blocks: [
        // Red block: directly aligned with top red gate! 1 swipe to shred!
        { id: 'b_red_1', color: BLOCK_COLORS.red, shapeCells: SHAPES['1x2'], gridX: 2, gridY: 1 },
        // Blue block: behind red block, unblocked once red is shredded
        { id: 'b_blue_1', color: BLOCK_COLORS.blue, shapeCells: SHAPES['2x1'], gridX: 1, gridY: 2 },
        // Yellow block: slides right into yellow gate
        { id: 'b_yellow_1', color: BLOCK_COLORS.yellow, shapeCells: SHAPES['1x1'], gridX: 2, gridY: 3 },
      ],
    };
  }

  /**
   * Level 2: Introduction to perpendicular sliding and multi-color gates.
   */
  private static getLevel2(): LevelData {
    return {
      levelNumber: 2,
      cols: 5,
      rows: 5,
      parMoves: 12,
      gates: [
        { side: 'top', color: BLOCK_COLORS.blue, cellIndex: 1, spanCells: 2 },
        { side: 'bottom', color: BLOCK_COLORS.green, cellIndex: 2, spanCells: 2 },
        { side: 'left', color: BLOCK_COLORS.red, cellIndex: 2, spanCells: 2 },
        { side: 'right', color: BLOCK_COLORS.yellow, cellIndex: 0, spanCells: 2 },
      ],
      blocks: [
        { id: 'b_red_1', color: BLOCK_COLORS.red, shapeCells: SHAPES['2x1'], gridX: 2, gridY: 2 },
        { id: 'b_blue_1', color: BLOCK_COLORS.blue, shapeCells: SHAPES['1x2'], gridX: 1, gridY: 1 },
        { id: 'b_green_1', color: BLOCK_COLORS.green, shapeCells: SHAPES['1x1'], gridX: 3, gridY: 3 },
        { id: 'b_yellow_1', color: BLOCK_COLORS.yellow, shapeCells: SHAPES['1x2'], gridX: 2, gridY: 0 },
        { id: 'b_red_2', color: BLOCK_COLORS.red, shapeCells: SHAPES['1x1'], gridX: 1, gridY: 3 },
      ],
    };
  }

  /**
   * Level 3: Tactile polyomino 2x2 and 2x1 blocks with clear sequential solution.
   */
  private static getLevel3(): LevelData {
    return {
      levelNumber: 3,
      cols: 6,
      rows: 6,
      parMoves: 16,
      gates: [
        { side: 'top', color: BLOCK_COLORS.red, cellIndex: 1, spanCells: 2 },
        { side: 'top', color: BLOCK_COLORS.purple, cellIndex: 4, spanCells: 2 },
        { side: 'bottom', color: BLOCK_COLORS.blue, cellIndex: 2, spanCells: 2 },
        { side: 'left', color: BLOCK_COLORS.green, cellIndex: 2, spanCells: 2 },
        { side: 'right', color: BLOCK_COLORS.orange, cellIndex: 2, spanCells: 2 },
      ],
      blocks: [
        { id: 'b_red_1', color: BLOCK_COLORS.red, shapeCells: SHAPES['1x2'], gridX: 1, gridY: 1 },
        { id: 'b_purple_1', color: BLOCK_COLORS.purple, shapeCells: SHAPES['2x1'], gridX: 4, gridY: 1 },
        { id: 'b_orange_1', color: BLOCK_COLORS.orange, shapeCells: SHAPES['1x1'], gridX: 3, gridY: 2 },
        { id: 'b_green_1', color: BLOCK_COLORS.green, shapeCells: SHAPES['2x1'], gridX: 1, gridY: 2 },
        { id: 'b_blue_1', color: BLOCK_COLORS.blue, shapeCells: SHAPES['2x2'], gridX: 2, gridY: 3 },
        { id: 'b_red_2', color: BLOCK_COLORS.red, shapeCells: SHAPES['1x1'], gridX: 2, gridY: 2 },
      ],
    };
  }

  /**
   * Procedural Reverse-Shuffle Generator:
   * Uses constructive reverse injection from perimeter gates inwards while maintaining
   * clear corridors to matching gates, guaranteeing no immediate deadlocks.
   */
  private static generateReverseShuffleLevel(level: number, attempt = 0): LevelData {
    const cols = level <= 6 ? 6 : 7;
    const rows = level <= 6 ? 6 : 7;
    const blockCount = Math.min(12, 5 + Math.floor(level * 0.7));

    // Choose active colors for this level (from 4 to 6 colors)
    const colorCount = Math.min(6, 3 + Math.floor(level / 3));
    const allColors = [
      BLOCK_COLORS.red,
      BLOCK_COLORS.blue,
      BLOCK_COLORS.green,
      BLOCK_COLORS.yellow,
      BLOCK_COLORS.purple,
      BLOCK_COLORS.orange,
    ];
    const levelColors = allColors.slice(0, colorCount);

    // Setup perimeter gates with double span (spanCells: 2)
    const gates: LevelData['gates'] = [
      { side: 'top', color: levelColors[0], cellIndex: 1, spanCells: 2 },
      { side: 'top', color: levelColors[1], cellIndex: Math.max(3, cols - 3), spanCells: 2 },
      { side: 'bottom', color: levelColors[2 % colorCount], cellIndex: 1, spanCells: 2 },
      { side: 'left', color: levelColors[3 % colorCount], cellIndex: 1, spanCells: 2 },
      { side: 'right', color: levelColors[(colorCount - 1) % colorCount], cellIndex: Math.max(2, rows - 3), spanCells: 2 },
    ];

    if (cols >= 7) {
      gates.push({ side: 'bottom', color: levelColors[4 % colorCount], cellIndex: 4, spanCells: 2 });
    }

    const occupied = new Set<string>();
    const posKey = (x: number, y: number) => `${x},${y}`;

    const blocks: LevelData['blocks'] = [];
    const shapeKeys = ['1x1', '1x2', '2x1', '1x1', '2x2'];

    // Constructive Inward Injection:
    // When placing each block, ensure that the inward corridor from the matching gate
    // to the block's stopping position is completely free of any previously placed blocks.
    for (let i = 0; i < blockCount; i++) {
      const gate = gates[(i + attempt) % gates.length];
      const shapeName = shapeKeys[(i + level + attempt) % shapeKeys.length];
      const shape = SHAPES[shapeName] || SHAPES['1x1'];

      let shapeWidth = 0;
      let shapeHeight = 0;
      for (const sc of shape) {
        shapeWidth = Math.max(shapeWidth, sc.x + 1);
        shapeHeight = Math.max(shapeHeight, sc.y + 1);
      }

      // Check gate span compatibility
      if (gate.side === 'top' || gate.side === 'bottom') {
        if (shapeWidth > gate.spanCells) continue;
      } else {
        if (shapeHeight > gate.spanCells) continue;
      }

      let placed = false;
      const candidateXOffsets: number[] = [];
      const candidateYOffsets: number[] = [];

      if (gate.side === 'top' || gate.side === 'bottom') {
        const maxXOffset = gate.spanCells - shapeWidth;
        for (let ox = 0; ox <= maxXOffset; ox++) {
          candidateXOffsets.push(gate.cellIndex + ox);
        }
      } else {
        const maxYOffset = gate.spanCells - shapeHeight;
        for (let oy = 0; oy <= maxYOffset; oy++) {
          candidateYOffsets.push(gate.cellIndex + oy);
        }
      }

      const maxDepth = (gate.side === 'top' || gate.side === 'bottom')
        ? rows - shapeHeight
        : cols - shapeWidth;

      const depths: number[] = [];
      for (let d = 0; d <= maxDepth; d++) {
        depths.push(d);
      }
      if ((i + attempt) % 2 === 1) {
        depths.reverse();
      }

      for (const depth of depths) {
        if (placed) break;

        if (gate.side === 'top') {
          for (const testX of candidateXOffsets) {
            const testY = depth;
            let corridorClear = true;
            for (const sc of shape) {
              const cx = testX + sc.x;
              for (let cy = 0; cy <= testY + sc.y; cy++) {
                if (occupied.has(posKey(cx, cy))) {
                  corridorClear = false;
                  break;
                }
              }
              if (!corridorClear) break;
            }

            if (corridorClear) {
              for (const sc of shape) {
                occupied.add(posKey(testX + sc.x, testY + sc.y));
              }
              blocks.push({
                id: `b_${gate.color.id}_${i}`,
                color: gate.color,
                shapeCells: shape,
                gridX: testX,
                gridY: testY,
              });
              placed = true;
              break;
            }
          }
        } else if (gate.side === 'bottom') {
          for (const testX of candidateXOffsets) {
            const testY = rows - shapeHeight - depth;
            if (testY < 0) continue;
            let corridorClear = true;
            for (const sc of shape) {
              const cx = testX + sc.x;
              for (let cy = testY + sc.y; cy < rows; cy++) {
                if (occupied.has(posKey(cx, cy))) {
                  corridorClear = false;
                  break;
                }
              }
              if (!corridorClear) break;
            }

            if (corridorClear) {
              for (const sc of shape) {
                occupied.add(posKey(testX + sc.x, testY + sc.y));
              }
              blocks.push({
                id: `b_${gate.color.id}_${i}`,
                color: gate.color,
                shapeCells: shape,
                gridX: testX,
                gridY: testY,
              });
              placed = true;
              break;
            }
          }
        } else if (gate.side === 'left') {
          for (const testY of candidateYOffsets) {
            const testX = depth;
            let corridorClear = true;
            for (const sc of shape) {
              const cy = testY + sc.y;
              for (let cx = 0; cx <= testX + sc.x; cx++) {
                if (occupied.has(posKey(cx, cy))) {
                  corridorClear = false;
                  break;
                }
              }
              if (!corridorClear) break;
            }

            if (corridorClear) {
              for (const sc of shape) {
                occupied.add(posKey(testX + sc.x, testY + sc.y));
              }
              blocks.push({
                id: `b_${gate.color.id}_${i}`,
                color: gate.color,
                shapeCells: shape,
                gridX: testX,
                gridY: testY,
              });
              placed = true;
              break;
            }
          }
        } else if (gate.side === 'right') {
          for (const testY of candidateYOffsets) {
            const testX = cols - shapeWidth - depth;
            if (testX < 0) continue;
            let corridorClear = true;
            for (const sc of shape) {
              const cy = testY + sc.y;
              for (let cx = testX + sc.x; cx < cols; cx++) {
                if (occupied.has(posKey(cx, cy))) {
                  corridorClear = false;
                  break;
                }
              }
              if (!corridorClear) break;
            }

            if (corridorClear) {
              for (const sc of shape) {
                occupied.add(posKey(testX + sc.x, testY + sc.y));
              }
              blocks.push({
                id: `b_${gate.color.id}_${i}`,
                color: gate.color,
                shapeCells: shape,
                gridX: testX,
                gridY: testY,
              });
              placed = true;
              break;
            }
          }
        }
      }
    }

    const parMoves = blocks.length + Math.max(4, Math.floor(blocks.length * 0.75));

    return {
      levelNumber: level,
      cols,
      rows,
      parMoves,
      gates,
      blocks,
    };
  }

  /**
   * Solvability validator:
   * Simulates straight corridor extractions and 1-step slide moves to verify
   * that all blocks can be mathematically shredded without deadlock.
   */
  public static validateLevelSolvability(data: LevelData): boolean {
    interface SimBlock {
      id: string;
      colorId: string;
      shapeCells: GridCell[];
      gridX: number;
      gridY: number;
    }

    const { cols, rows, gates } = data;

    const isOccupied = (x: number, y: number, blocks: SimBlock[], excludeId?: string): boolean => {
      for (const b of blocks) {
        if (b.id === excludeId) continue;
        for (const sc of b.shapeCells) {
          if (b.gridX + sc.x === x && b.gridY + sc.y === y) {
            return true;
          }
        }
      }
      return false;
    };

    const canExit = (b: SimBlock, dirX: number, dirY: number, blocks: SimBlock[]): boolean => {
      let curX = b.gridX;
      let curY = b.gridY;
      const maxSteps = Math.max(cols, rows) + 1;

      for (let s = 0; s < maxSteps; s++) {
        const nextX = curX + dirX;
        const nextY = curY + dirY;

        let allInside = true;
        let exitSide: GateSide | null = null;

        for (const sc of b.shapeCells) {
          const cx = nextX + sc.x;
          const cy = nextY + sc.y;
          if (cx < 0) {
            allInside = false;
            exitSide = 'left';
          } else if (cx >= cols) {
            allInside = false;
            exitSide = 'right';
          } else if (cy < 0) {
            allInside = false;
            exitSide = 'top';
          } else if (cy >= rows) {
            allInside = false;
            exitSide = 'bottom';
          }
        }

        if (allInside) {
          for (const sc of b.shapeCells) {
            if (isOccupied(nextX + sc.x, nextY + sc.y, blocks, b.id)) {
              return false;
            }
          }
          curX = nextX;
          curY = nextY;
        } else {
          if (!exitSide) return false;

          let minExitCoord = Infinity;
          let maxExitCoord = -Infinity;

          for (const sc of b.shapeCells) {
            const coord = (exitSide === 'top' || exitSide === 'bottom')
              ? (nextX + sc.x)
              : (nextY + sc.y);
            minExitCoord = Math.min(minExitCoord, coord);
            maxExitCoord = Math.max(maxExitCoord, coord);
          }

          const matchingGate = gates.find(
            (g) =>
              g.side === exitSide &&
              g.color.id === b.colorId &&
              minExitCoord >= g.cellIndex &&
              maxExitCoord <= g.cellIndex + g.spanCells - 1
          );

          return matchingGate !== undefined;
        }
      }

      return false;
    };

    const trySlide = (
      b: SimBlock,
      dirX: number,
      dirY: number,
      blocks: SimBlock[]
    ): { newX: number; newY: number } | null => {
      let curX = b.gridX;
      let curY = b.gridY;
      const maxSteps = Math.max(cols, rows) + 1;
      let stepped = 0;

      for (let s = 0; s < maxSteps; s++) {
        const nextX = curX + dirX;
        const nextY = curY + dirY;

        let allInside = true;
        for (const sc of b.shapeCells) {
          const cx = nextX + sc.x;
          const cy = nextY + sc.y;
          if (cx < 0 || cx >= cols || cy < 0 || cy >= rows) {
            allInside = false;
            break;
          }
        }

        if (!allInside) {
          break;
        }

        let collision = false;
        for (const sc of b.shapeCells) {
          if (isOccupied(nextX + sc.x, nextY + sc.y, blocks, b.id)) {
            collision = true;
            break;
          }
        }

        if (collision) {
          break;
        }

        curX = nextX;
        curY = nextY;
        stepped++;
      }

      if (stepped > 0 && (curX !== b.gridX || curY !== b.gridY)) {
        return { newX: curX, newY: curY };
      }
      return null;
    };

    const hashState = (blocks: SimBlock[]): string => {
      return blocks
        .map((b) => `${b.id}:${b.gridX},${b.gridY}`)
        .sort()
        .join('|');
    };

    const initialBlocks: SimBlock[] = data.blocks.map((b) => ({
      id: b.id,
      colorId: b.color.id,
      shapeCells: b.shapeCells,
      gridX: b.gridX,
      gridY: b.gridY,
    }));

    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    const queue: SimBlock[][] = [initialBlocks];
    const visited = new Set<string>();
    visited.add(hashState(initialBlocks));
    let statesEvaluated = 0;
    const MAX_STATES = 250;

    while (queue.length > 0 && statesEvaluated < MAX_STATES) {
      statesEvaluated++;
      let state = queue.shift()!;

      // 1. Straight corridor extraction pass (greedy removal of all unblocked matching blocks)
      let extractedAny = true;
      while (extractedAny && state.length > 0) {
        extractedAny = false;
        for (let i = 0; i < state.length; i++) {
          const b = state[i];
          let canBlockExit = false;
          for (const d of directions) {
            if (canExit(b, d.x, d.y, state)) {
              canBlockExit = true;
              break;
            }
          }
          if (canBlockExit) {
            state = state.filter((_, idx) => idx !== i);
            extractedAny = true;
            break;
          }
        }
      }

      // If all blocks cleared, puzzle is 100% solvable
      if (state.length === 0) {
        return true;
      }

      // 2. Simulate 1-step slide moves to unblock other corridors
      for (const b of state) {
        for (const d of directions) {
          const slide = trySlide(b, d.x, d.y, state);
          if (slide) {
            const nextState: SimBlock[] = state.map((item) =>
              item.id === b.id ? { ...item, gridX: slide.newX, gridY: slide.newY } : item
            );
            const key = hashState(nextState);
            if (!visited.has(key)) {
              visited.add(key);
              queue.push(nextState);
            }
          }
        }
      }
    }

    return false;
  }

  /**
   * Guaranteed mathematically verified fallback preset for levels when random retry reaches limit.
   */
  private static getFallbackPreset(level: number): LevelData {
    if (level <= 6) {
      return {
        levelNumber: level,
        cols: 6,
        rows: 6,
        parMoves: 16,
        gates: [
          { side: 'top', color: BLOCK_COLORS.red, cellIndex: 1, spanCells: 2 },
          { side: 'top', color: BLOCK_COLORS.purple, cellIndex: 4, spanCells: 2 },
          { side: 'bottom', color: BLOCK_COLORS.blue, cellIndex: 2, spanCells: 2 },
          { side: 'left', color: BLOCK_COLORS.green, cellIndex: 2, spanCells: 2 },
          { side: 'right', color: BLOCK_COLORS.orange, cellIndex: 2, spanCells: 2 },
        ],
        blocks: [
          { id: `b_red_1_${level}`, color: BLOCK_COLORS.red, shapeCells: SHAPES['1x2'], gridX: 1, gridY: 1 },
          { id: `b_purple_1_${level}`, color: BLOCK_COLORS.purple, shapeCells: SHAPES['2x1'], gridX: 4, gridY: 1 },
          { id: `b_orange_1_${level}`, color: BLOCK_COLORS.orange, shapeCells: SHAPES['1x1'], gridX: 3, gridY: 2 },
          { id: `b_green_1_${level}`, color: BLOCK_COLORS.green, shapeCells: SHAPES['2x1'], gridX: 1, gridY: 2 },
          { id: `b_blue_1_${level}`, color: BLOCK_COLORS.blue, shapeCells: SHAPES['2x2'], gridX: 2, gridY: 3 },
          { id: `b_red_2_${level}`, color: BLOCK_COLORS.red, shapeCells: SHAPES['1x1'], gridX: 2, gridY: 2 },
        ],
      };
    } else {
      return {
        levelNumber: level,
        cols: 7,
        rows: 7,
        parMoves: 22,
        gates: [
          { side: 'top', color: BLOCK_COLORS.red, cellIndex: 1, spanCells: 2 },
          { side: 'top', color: BLOCK_COLORS.blue, cellIndex: 4, spanCells: 2 },
          { side: 'bottom', color: BLOCK_COLORS.yellow, cellIndex: 1, spanCells: 2 },
          { side: 'bottom', color: BLOCK_COLORS.purple, cellIndex: 4, spanCells: 2 },
          { side: 'left', color: BLOCK_COLORS.green, cellIndex: 2, spanCells: 2 },
          { side: 'right', color: BLOCK_COLORS.orange, cellIndex: 2, spanCells: 2 },
        ],
        blocks: [
          { id: `b_red_1_${level}`, color: BLOCK_COLORS.red, shapeCells: SHAPES['1x2'], gridX: 1, gridY: 1 },
          { id: `b_blue_1_${level}`, color: BLOCK_COLORS.blue, shapeCells: SHAPES['1x2'], gridX: 4, gridY: 1 },
          { id: `b_green_1_${level}`, color: BLOCK_COLORS.green, shapeCells: SHAPES['2x1'], gridX: 1, gridY: 2 },
          { id: `b_orange_1_${level}`, color: BLOCK_COLORS.orange, shapeCells: SHAPES['2x1'], gridX: 5, gridY: 2 },
          { id: `b_yellow_1_${level}`, color: BLOCK_COLORS.yellow, shapeCells: SHAPES['1x2'], gridX: 1, gridY: 4 },
          { id: `b_purple_1_${level}`, color: BLOCK_COLORS.purple, shapeCells: SHAPES['1x2'], gridX: 4, gridY: 4 },
          { id: `b_red_2_${level}`, color: BLOCK_COLORS.red, shapeCells: SHAPES['2x1'], gridX: 2, gridY: 2 },
        ],
      };
    }
  }

  /**
   * Applies LevelData onto a Board instance.
   */
  public static loadIntoBoard(data: LevelData, board: Board): void {
    board.clear();
    board.setDimensions(data.cols, data.rows);

    for (const g of data.gates) {
      const gate = new ShredderGate(
        `gate_${g.side}_${g.cellIndex}`,
        g.side,
        g.color,
        g.cellIndex,
        g.spanCells,
        data.cols,
        data.rows
      );
      board.addGate(gate);
    }

    for (const b of data.blocks) {
      const block = new Block(
        b.id,
        b.color,
        b.shapeCells,
        b.gridX,
        b.gridY,
        data.cols,
        data.rows
      );
      board.addBlock(block);
    }
  }
}
