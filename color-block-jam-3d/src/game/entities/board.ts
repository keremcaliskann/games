import * as THREE from 'three';
import { Block } from './block';
import { ShredderGate, GateSide } from './shredder-gate';
import { PrefabFactory } from '../../render/PrefabFactory';

export type SlideOutcome =
  | { type: 'shredded'; gate: ShredderGate; steps: number }
  | { type: 'moved'; steps: number }
  | { type: 'blocked' };

export class Board {
  public readonly cols: number;
  public readonly rows: number;

  public readonly rootGroup = new THREE.Group();
  public readonly blocksGroup = new THREE.Group();
  public readonly gatesGroup = new THREE.Group();
  private platformMesh: THREE.Group | null = null;

  private blocks: Block[] = [];
  private gates: ShredderGate[] = [];

  constructor(cols = 6, rows = 6) {
    this.cols = cols;
    this.rows = rows;

    this.rootGroup.add(this.gatesGroup);
    this.rootGroup.add(this.blocksGroup);

    this.buildPlatform();
  }

  public buildPlatform(): void {
    if (this.platformMesh) {
      this.rootGroup.remove(this.platformMesh);
    }
    this.platformMesh = PrefabFactory.createBoardPlatform(this.cols, this.rows);
    this.rootGroup.add(this.platformMesh);
  }

  public addGate(gate: ShredderGate): void {
    this.gates.push(gate);
    this.gatesGroup.add(gate.group);
  }

  public addBlock(block: Block): void {
    this.blocks.push(block);
    this.blocksGroup.add(block.group);
  }

  public getBlocks(): Block[] {
    return this.blocks;
  }

  public getGates(): ShredderGate[] {
    return this.gates;
  }

  public getRemainingCount(): number {
    return this.blocks.filter((b) => b.state !== 'shredded').length;
  }

  public getActiveBlocks(): Block[] {
    return this.blocks.filter((b) => b.state !== 'shredded');
  }

  public isCellOccupied(x: number, y: number, ignoreBlockId?: string): boolean {
    for (const b of this.blocks) {
      if (b.state === 'shredded' || b.id === ignoreBlockId) continue;
      for (const cell of b.getOccupiedCells()) {
        if (cell.x === x && cell.y === y) return true;
      }
    }
    return false;
  }

  public findGate(side: GateSide, cellCoord: number): ShredderGate | undefined {
    return this.gates.find((g) => g.matchesCell(side, cellCoord));
  }

  /**
   * Tests sliding a block along (dirX, dirY).
   * Slides maximum possible distance along board or directly into a matching perimeter shredder gate.
   */
  public trySlideBlock(block: Block, dirX: number, dirY: number): SlideOutcome {
    if (block.state !== 'idle') return { type: 'blocked' };
    if (dirX === 0 && dirY === 0) return { type: 'blocked' };

    let currentGx = block.gridX;
    let currentGy = block.gridY;
    let steps = 0;
    const maxSteps = Math.max(this.cols, this.rows);

    while (steps < maxSteps) {
      const nextGx = currentGx + dirX;
      const nextGy = currentGy + dirY;
      const nextCells = block.getOccupiedCells(nextGx, nextGy);

      // Check if all next cells are within board boundaries
      let allInside = true;
      let exitSide: GateSide | null = null;

      for (const c of nextCells) {
        if (c.x < 0) {
          allInside = false;
          exitSide = 'left';
        } else if (c.x >= this.cols) {
          allInside = false;
          exitSide = 'right';
        } else if (c.y < 0) {
          allInside = false;
          exitSide = 'top';
        } else if (c.y >= this.rows) {
          allInside = false;
          exitSide = 'bottom';
        }
      }

      if (allInside) {
        // Check collision with other blocks
        let collision = false;
        for (const c of nextCells) {
          if (this.isCellOccupied(c.x, c.y, block.id)) {
            collision = true;
            break;
          }
        }

        if (collision) {
          // Blocked by another block; stop here
          break;
        } else {
          // Step forward
          currentGx = nextGx;
          currentGy = nextGy;
          steps++;
        }
      } else {
        // Block is attempting to cross the perimeter
        // Check if an aligned matching gate exists on exitSide overlapping the block
        if (exitSide) {
          let minExitCoord = Infinity;
          let maxExitCoord = -Infinity;

          if (exitSide === 'top' || exitSide === 'bottom') {
            for (const c of nextCells) {
              minExitCoord = Math.min(minExitCoord, c.x);
              maxExitCoord = Math.max(maxExitCoord, c.x);
            }
          } else {
            for (const c of nextCells) {
              minExitCoord = Math.min(minExitCoord, c.y);
              maxExitCoord = Math.max(maxExitCoord, c.y);
            }
          }

          const gate = this.gates.find((g) => g.matchesBlock(exitSide, minExitCoord, maxExitCoord));
          if (gate && gate.color.id === block.color.id) {
            // MATCH! Block slides smoothly from board directly into shredder gate
            steps++;
            block.startSlideIntoGate(gate.worldPosition, gate.intakeDirection);
            gate.pulseSuccess();
            return { type: 'shredded', gate, steps };
          }
        }
        // No matching gate: hit board boundary wall
        break;
      }
    }

    if (steps > 0 && (currentGx !== block.gridX || currentGy !== block.gridY)) {
      block.startSlideTo(currentGx, currentGy, this.cols, this.rows);
      return { type: 'moved', steps };
    }

    return { type: 'blocked' };
  }

  /**
   * Instantly shatters a block (Hammer Booster Hook)
   */
  public hammerBlock(block: Block): void {
    block.state = 'shredded';
    block.group.visible = false;
  }

  /**
   * Vacuums all blocks of a single color into their respective gates or removes them
   */
  public vacuumBlocksOfColor(colorId: string): Block[] {
    const matching = this.blocks.filter((b) => b.color.id === colorId && b.state !== 'shredded');
    for (const b of matching) {
      // Find matching gate
      const gate = this.gates.find((g) => g.color.id === colorId);
      if (gate) {
        b.startShred(gate.worldPosition, gate.intakeDirection);
        gate.pulseSuccess();
      } else {
        b.state = 'shredded';
        b.group.visible = false;
      }
    }
    return matching;
  }

  /**
   * Finds a block that can immediately slide into its matching gate
   */
  public findHintMove(): { block: Block; dirX: number; dirY: number } | null {
    const directions = [
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ];

    for (const b of this.getActiveBlocks()) {
      if (b.state !== 'idle') continue;
      for (const d of directions) {
        // Clone simulation check
        if (this.canSimulateShred(b, d.x, d.y)) {
          return { block: b, dirX: d.x, dirY: d.y };
        }
      }
    }
    return null;
  }

  public canBlockExitInDirection(block: Block, dirX: number, dirY: number): ShredderGate | null {
    if (block.state !== 'idle') return null;
    let currentGx = block.gridX;
    let currentGy = block.gridY;
    const maxSteps = Math.max(this.cols, this.rows);

    for (let s = 0; s < maxSteps; s++) {
      const nextGx = currentGx + dirX;
      const nextGy = currentGy + dirY;
      const nextCells = block.getOccupiedCells(nextGx, nextGy);

      let allInside = true;
      let exitSide: GateSide | null = null;

      for (const c of nextCells) {
        if (c.x < 0) {
          allInside = false;
          exitSide = 'left';
        } else if (c.x >= this.cols) {
          allInside = false;
          exitSide = 'right';
        } else if (c.y < 0) {
          allInside = false;
          exitSide = 'top';
        } else if (c.y >= this.rows) {
          allInside = false;
          exitSide = 'bottom';
        }
      }

      if (allInside) {
        for (const c of nextCells) {
          if (this.isCellOccupied(c.x, c.y, block.id)) {
            return null;
          }
        }
        currentGx = nextGx;
        currentGy = nextGy;
      } else {
        if (exitSide) {
          let minExitCoord = Infinity;
          let maxExitCoord = -Infinity;

          if (exitSide === 'top' || exitSide === 'bottom') {
            for (const c of nextCells) {
              minExitCoord = Math.min(minExitCoord, c.x);
              maxExitCoord = Math.max(maxExitCoord, c.x);
            }
          } else {
            for (const c of nextCells) {
              minExitCoord = Math.min(minExitCoord, c.y);
              maxExitCoord = Math.max(maxExitCoord, c.y);
            }
          }

          const gate = this.gates.find((g) => g.matchesBlock(exitSide, minExitCoord, maxExitCoord));
          if (gate && gate.color.id === block.color.id) {
            return gate;
          }
        }
        return null;
      }
    }
    return null;
  }

  private canSimulateShred(block: Block, dirX: number, dirY: number): boolean {
    return this.canBlockExitInDirection(block, dirX, dirY) !== null;
  }

  public getRaycastTargets(): THREE.Object3D[] {
    const targets: THREE.Object3D[] = [];
    for (const b of this.blocks) {
      if (b.state === 'idle' || b.state === 'sliding') {
        targets.push(...b.interactiveMeshes);
      }
    }
    return targets;
  }

  public update(dt: number): void {
    for (const b of this.blocks) {
      b.update(dt);
    }
    for (const g of this.gates) {
      g.update(dt);
    }
  }

  public clear(): void {
    for (const b of this.blocks) {
      this.blocksGroup.remove(b.group);
      b.dispose();
    }
    this.blocks = [];

    for (const g of this.gates) {
      this.gatesGroup.remove(g.group);
      g.dispose();
    }
    this.gates = [];
  }
}
