import * as THREE from 'three';
import { HexCell, HexGrid } from '../entities/hex-grid';
import { TileItem } from '../entities/tile-stack';
import { GAME_CONFIG, HexColorDef, tileLocalY } from '../config/game-config';
import { SoundController } from '../../core/audio';

interface FlyingTile {
  item: TileItem;
  fromPos: THREE.Vector3;
  toPos: THREE.Vector3;
  progress: number;
  duration: number;
  arcHeight: number;
  targetCell: HexCell;
}

interface Particle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  rotVel: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class CascadeAnimator {
  private readonly scene: THREE.Scene;
  private readonly grid: HexGrid;
  private readonly audio: SoundController;

  private isCascading = false;
  private comboChain = 0;

  // Active flying tiles
  private readonly flyingTiles: FlyingTile[] = [];

  // Particle pool for combo pops
  private readonly particles: Particle[] = [];
  private readonly particleGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  private readonly particleMaterials = new Map<number, THREE.MeshStandardMaterial>();
  private readonly particleGroup = new THREE.Group();

  // Deterministic step timer (replaces setTimeout so pause/resume stays synced)
  private pendingStepTimer = 0;
  private pendingFocusCells: HexCell[] | null = null;

  // Callbacks
  private onComboClearCallback: (color: HexColorDef, count: number, points: number) => void = () => {};
  private onCascadeFinishCallback: () => void = () => {};

  constructor(scene: THREE.Scene, grid: HexGrid, audio: SoundController) {
    this.scene = scene;
    this.grid = grid;
    this.audio = audio;
    this.scene.add(this.particleGroup);
  }

  public setCallbacks(
    onComboClear: (color: HexColorDef, count: number, points: number) => void,
    onCascadeFinish: () => void
  ): void {
    this.onComboClearCallback = onComboClear;
    this.onCascadeFinishCallback = onCascadeFinish;
  }

  public get isBusy(): boolean {
    return this.isCascading || this.flyingTiles.length > 0 || this.pendingFocusCells !== null;
  }

  /**
   * Evaluates cascade chains starting from the recently placed/modified cell
   */
  public evaluateCascades(placedCell: HexCell): void {
    this.isCascading = true;
    this.comboChain = 0;
    this.pendingFocusCells = null;
    this.pendingStepTimer = 0;
    this.stepCascade([placedCell]);
  }

  /**
   * One discrete step of the cascade simulation
   */
  private stepCascade(focusCells: HexCell[]): void {
    let transferFound = false;

    for (const targetCell of focusCells) {
      if (targetCell.stack.isEmpty()) continue;
      const targetTopColor = targetCell.stack.getTopColor();
      if (!targetTopColor) continue;

      const neighbors = this.grid.getNeighbors(targetCell);

      for (const neighbor of neighbors) {
        if (neighbor.stack.isEmpty()) continue;
        const neighborTopColor = neighbor.stack.getTopColor();

        // Matching top colors! Transfer matching tiles from neighbor to target
        if (neighborTopColor && neighborTopColor.id === targetTopColor.id) {
          const matchCount = neighbor.stack.getContiguousTopCount();
          if (matchCount > 0) {
            transferFound = true;
            this.transferTiles(neighbor, targetCell, matchCount);
            return; // Transfer launched, will re-evaluate on completion
          }
        }
      }
    }

    if (!transferFound) {
      // Check all occupied cells for 10-tile combo clears
      let comboFound = false;
      for (const cell of this.grid.getOccupiedCells()) {
        const check = cell.stack.checkComboClear();
        if (check.canClear && check.color) {
          comboFound = true;
          this.executeComboClear(cell, check.color, check.count);
          break;
        }
      }

      if (!comboFound) {
        // Cascade process fully settled
        this.isCascading = false;
        this.onCascadeFinishCallback();
      }
    }
  }

  /**
   * Animates tiles flying in an arc trajectory from donor cell to target cell
   */
  private transferTiles(donor: HexCell, target: HexCell, count: number): void {
    const tilesToMove = donor.stack.popContiguousTop(count);
    if (tilesToMove.length === 0) return;

    this.comboChain++;

    const baseStartY = donor.worldY + GAME_CONFIG.board.stackBaseY + tileLocalY(donor.stack.size);
    const baseTargetY = target.worldY + GAME_CONFIG.board.stackBaseY + tileLocalY(target.stack.size);

    for (let i = 0; i < tilesToMove.length; i++) {
      const item = tilesToMove[i];
      const startPos = new THREE.Vector3(
        donor.worldX,
        baseStartY + i * GAME_CONFIG.hex.height,
        donor.worldZ
      );
      const endPos = new THREE.Vector3(
        target.worldX,
        baseTargetY + i * GAME_CONFIG.hex.height,
        target.worldZ
      );

      // Attach mesh to world scene temporarily during flight
      this.scene.add(item.mesh);
      item.mesh.position.copy(startPos);

      const delayProgress = -i * 0.08; // staggered cascade stagger

      this.flyingTiles.push({
        item,
        fromPos: startPos,
        toPos: endPos,
        progress: delayProgress,
        duration: 0.22,
        arcHeight: 1.1 + i * 0.1,
        targetCell: target,
      });
    }

    this.audio.playFlip(this.comboChain);
  }

  /**
   * Clears 10 matching tiles with ASMR explosion
   */
  private executeComboClear(cell: HexCell, color: HexColorDef, count: number): void {
    const clearedTiles = cell.stack.popContiguousTop(count);

    // Spawn voxel particle bursts at cell position
    const popCenter = new THREE.Vector3(
      cell.worldX,
      cell.worldY + (cell.stack.size + 3) * GAME_CONFIG.hex.height,
      cell.worldZ
    );
    this.spawnVoxelBurst(popCenter, color.hex, 28);

    // Audio & Score
    this.audio.playComboClear();
    const points = count * 15 * Math.max(1, this.comboChain);
    this.onComboClearCallback(color, count, points);

    // Clean up popped tile meshes
    for (const item of clearedTiles) {
      item.mesh.parent?.remove(item.mesh);
    }

    // After combo pop, check if newly exposed top tile triggers further cascades
    this.pendingFocusCells = [cell, ...this.grid.getNeighbors(cell)];
    this.pendingStepTimer = 0.16;
  }

  /**
   * Shatters a stack instantly (Stack Hammer Booster)
   */
  public executeHammerSmash(cell: HexCell): void {
    if (cell.stack.isEmpty()) return;
    const count = cell.stack.size;
    const topColor = cell.stack.getTopColor();
    const colorHex = topColor ? topColor.hex : 0xf59e0b;

    const center = new THREE.Vector3(
      cell.worldX,
      cell.worldY + Math.max(0.4, count * GAME_CONFIG.hex.height * 0.5),
      cell.worldZ
    );

    this.spawnVoxelBurst(center, colorHex, 40);
    cell.stack.clear();
    this.audio.playHammer();

    this.evaluateCascades(cell);
  }

  private getParticleMaterial(colorHex: number): THREE.MeshStandardMaterial {
    let mat = this.particleMaterials.get(colorHex);
    if (!mat) {
      mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.45,
        metalness: 0.1,
      });
      this.particleMaterials.set(colorHex, mat);
    }
    return mat;
  }

  private spawnVoxelBurst(center: THREE.Vector3, colorHex: number, count: number): void {
    const mat = this.getParticleMaterial(colorHex);

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.particleGeo, mat);
      mesh.position.copy(center);
      this.particleGroup.add(mesh);

      const speed = 2.5 + Math.random() * 4.5;
      const angle = Math.random() * Math.PI * 2;
      const elev = 0.4 + Math.random() * 0.8;

      this.particles.push({
        mesh,
        vel: new THREE.Vector3(
          Math.cos(angle) * speed,
          elev * speed * 1.2,
          Math.sin(angle) * speed
        ),
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 12
        ),
        life: 0,
        maxLife: 0.5 + Math.random() * 0.4,
      });
    }
  }

  public update(dt: number): void {
    // 0. Process pending deterministic cascade step timer
    if (this.pendingFocusCells && this.flyingTiles.length === 0) {
      this.pendingStepTimer -= dt;
      if (this.pendingStepTimer <= 0) {
        const nextFocus = this.pendingFocusCells;
        this.pendingFocusCells = null;
        this.stepCascade(nextFocus);
      }
    }

    // 1. Update flying arc tiles
    if (this.flyingTiles.length > 0) {
      for (let i = this.flyingTiles.length - 1; i >= 0; i--) {
        const ft = this.flyingTiles[i];
        ft.progress += dt / ft.duration;

        if (ft.progress >= 0 && ft.progress < 1) {
          const t = ft.progress;
          // Smooth Hermite interpolation for horizontal motion
          const ease = t * t * (3 - 2 * t);
          const x = THREE.MathUtils.lerp(ft.fromPos.x, ft.toPos.x, ease);
          const z = THREE.MathUtils.lerp(ft.fromPos.z, ft.toPos.z, ease);

          // Parabolic vertical arc + slight flip tilt
          const y = THREE.MathUtils.lerp(ft.fromPos.y, ft.toPos.y, t) + 4 * ft.arcHeight * t * (1 - t);
          ft.item.mesh.position.set(x, y, z);
          ft.item.mesh.rotation.y = t * Math.PI * 2;
          ft.item.mesh.rotation.z = Math.sin(t * Math.PI) * 0.4;
        } else if (ft.progress >= 1) {
          // Landed into target stack!
          this.scene.remove(ft.item.mesh);
          ft.item.mesh.rotation.set(0, 0, 0);
          ft.targetCell.stack.pushTile(ft.item.color, ft.item.mesh);

          this.flyingTiles.splice(i, 1);
        }
      }

      // If all flying tiles in this batch landed, schedule next cascade step
      if (this.flyingTiles.length === 0) {
        this.pendingFocusCells = this.grid.getOccupiedCells();
        this.pendingStepTimer = 0.08;
      }
    }

    // 2. Update particle burst voxels
    if (this.particles.length > 0) {
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life += dt;

        if (p.life >= p.maxLife) {
          this.particleGroup.remove(p.mesh);
          this.particles.splice(i, 1);
        } else {
          p.vel.y -= 14 * dt; // gravity
          p.mesh.position.addScaledVector(p.vel, dt);
          p.mesh.rotation.x += p.rotVel.x * dt;
          p.mesh.rotation.y += p.rotVel.y * dt;

          const scale = 1 - p.life / p.maxLife;
          p.mesh.scale.set(scale, scale, scale);
        }
      }
    }
  }

  public clear(): void {
    for (const ft of this.flyingTiles) {
      this.scene.remove(ft.item.mesh);
    }
    this.flyingTiles.length = 0;

    for (const p of this.particles) {
      this.particleGroup.remove(p.mesh);
    }
    this.particles.length = 0;
    this.pendingFocusCells = null;
    this.pendingStepTimer = 0;
    this.isCascading = false;
  }
}
