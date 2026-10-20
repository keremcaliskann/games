import * as THREE from 'three';
import { ArrowBlock } from './arrow-block';
import { DIRECTION_VECTORS } from '../config/game-config';
import { EventBus } from '../../core/events';

/**
 * 3D spatial grid representing the active puzzle structure.
 * Validates collision ray paths and handles block clearance state.
 */
export class PuzzleGrid {
  public readonly rootGroup = new THREE.Group();
  private readonly blocksMap = new Map<string, ArrowBlock>();
  private readonly blocksList: ArrowBlock[] = [];
  private readonly bus = EventBus.get();

  private activeHintBlock: ArrowBlock | null = null;

  public static key(gx: number, gy: number, gz: number): string {
    return `${gx},${gy},${gz}`;
  }

  public clear(): void {
    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      this.rootGroup.remove(b.group);
      b.dispose();
    }
    this.blocksMap.clear();
    this.blocksList.length = 0;
    this.activeHintBlock = null;
  }

  public addBlock(block: ArrowBlock): void {
    const k = PuzzleGrid.key(block.gx, block.gy, block.gz);
    this.blocksMap.set(k, block);
    this.blocksList.push(block);
    this.rootGroup.add(block.group);
  }

  public centerGrid(): void {
    if (this.blocksList.length === 0) return;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      if (b.group.position.x < minX) minX = b.group.position.x;
      if (b.group.position.x > maxX) maxX = b.group.position.x;
      if (b.group.position.y < minY) minY = b.group.position.y;
      if (b.group.position.y > maxY) maxY = b.group.position.y;
      if (b.group.position.z < minZ) minZ = b.group.position.z;
      if (b.group.position.z > maxZ) maxZ = b.group.position.z;
    }

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const midZ = (minZ + maxZ) / 2;

    this.rootGroup.position.set(-midX, -midY, -midZ);
  }

  /**
   * Evaluates whether an arrow block has an unobstructed path to escape.
   */
  public isPathClear(block: ArrowBlock): boolean {
    const dir = block.direction;
    const vec = DIRECTION_VECTORS[dir];
    const dx = Math.round(vec.x);
    const dy = Math.round(vec.y);
    const dz = Math.round(vec.z);

    let curX = block.gx + dx;
    let curY = block.gy + dy;
    let curZ = block.gz + dz;

    // Check bounds along the ray
    const maxSteps = 15;
    let steps = 0;

    while (steps < maxSteps) {
      const k = PuzzleGrid.key(curX, curY, curZ);
      const neighbor = this.blocksMap.get(k);

      if (neighbor && (neighbor.state === 'IDLE' || neighbor.state === 'BONK')) {
        return false; // Path obstructed
      }

      curX += dx;
      curY += dy;
      curZ += dz;
      steps++;
    }

    return true; // Path clear!
  }

  public tryTapBlock(block: ArrowBlock): boolean {
    if (block.state !== 'IDLE') return false;

    if (this.activeHintBlock === block) {
      block.setHint(false);
      this.activeHintBlock = null;
    }

    if (this.isPathClear(block)) {
      block.triggerFly();
      // Remove from map immediately so blocks behind it can fly
      const k = PuzzleGrid.key(block.gx, block.gy, block.gz);
      this.blocksMap.delete(k);
      this.bus.emit('block_cleared', block);
      return true;
    } else {
      block.triggerBonk();
      this.bus.emit('block_blocked', block);
      return false;
    }
  }

  public getRaycastTargets(): THREE.Object3D[] {
    const targets: THREE.Object3D[] = [];
    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      if (b.state === 'IDLE') {
        targets.push(b.baseMesh);
      }
    }
    return targets;
  }

  public showHint(): boolean {
    if (this.activeHintBlock) {
      this.activeHintBlock.setHint(false);
      this.activeHintBlock = null;
    }

    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      if (b.state === 'IDLE' && this.isPathClear(b)) {
        b.setHint(true);
        this.activeHintBlock = b;
        return true;
      }
    }
    return false;
  }

  public getRemainingCount(): number {
    let count = 0;
    for (let i = 0; i < this.blocksList.length; i++) {
      if (this.blocksList[i].state === 'IDLE' || this.blocksList[i].state === 'BONK') {
        count++;
      }
    }
    return count;
  }

  public update(delta: number, onBlockFinished: (block: ArrowBlock) => void): void {
    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      if (b.state === 'BONK' || b.state === 'FLYING') {
        b.update(delta, (finishedBlock) => {
          onBlockFinished(finishedBlock);

          if (this.getRemainingCount() === 0) {
            this.bus.emit('level_completed', null);
          }
        });
      }
    }
  }
}
