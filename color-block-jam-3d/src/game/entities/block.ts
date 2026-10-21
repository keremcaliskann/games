import * as THREE from 'three';
import { ColorDef, GAME_CONFIG } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export type BlockState = 'idle' | 'sliding' | 'shredding' | 'shredded';

export interface GridCell {
  x: number;
  y: number;
}

export class Block {
  public readonly id: string;
  public readonly color: ColorDef;
  public readonly shapeCells: GridCell[]; // Relative cell offsets
  public gridX: number;
  public gridY: number;

  public readonly group: THREE.Group;
  public readonly interactiveMeshes: THREE.Mesh[];

  public state: BlockState = 'idle';

  // Animation values
  private currentWorldPos = new THREE.Vector3();
  private targetWorldPos = new THREE.Vector3();
  private slideStartWorldPos = new THREE.Vector3();
  private slideProgress = 1;
  private slideDuration = 0.16;

  // Shred animation
  private shredProgress = 0;
  private shredDuration = 0.32;
  private shredTargetPos = new THREE.Vector3();
  private shredDirection = new THREE.Vector3();

  // Squash and stretch scale
  private currentScale = new THREE.Vector3(1, 1, 1);

  // Tactile wiggle shake on blocked tap
  private isWiggling = false;
  private wiggleTimer = 0;
  private readonly wiggleDuration = 0.22;

  constructor(
    id: string,
    color: ColorDef,
    shapeCells: GridCell[],
    initialGridX: number,
    initialGridY: number,
    boardCols: number,
    boardRows: number
  ) {
    this.id = id;
    this.color = color;
    this.shapeCells = shapeCells;
    this.gridX = initialGridX;
    this.gridY = initialGridY;

    const { group, interactiveMeshes } = PrefabFactory.createBlockMesh(shapeCells, color);
    this.group = group;
    this.interactiveMeshes = interactiveMeshes;

    // Defensive Back-Pointer Tagging on all interactive child meshes
    for (const mesh of interactiveMeshes) {
      mesh.userData = { block: this };
    }

    this.calcWorldPosition(this.gridX, this.gridY, boardCols, boardRows, this.currentWorldPos);
    this.targetWorldPos.copy(this.currentWorldPos);
    this.group.position.copy(this.currentWorldPos);
  }

  public calcWorldPosition(
    gx: number,
    gy: number,
    boardCols: number,
    boardRows: number,
    out: THREE.Vector3
  ): void {
    const cs = GAME_CONFIG.cellSize;
    const startX = -((boardCols - 1) / 2) * cs;
    const startZ = -((boardRows - 1) / 2) * cs;

    // Center of this polyomino's bounding box
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (const c of this.shapeCells) {
      minX = Math.min(minX, c.x);
      maxX = Math.max(maxX, c.x);
      minY = Math.min(minY, c.y);
      maxY = Math.max(maxY, c.y);
    }
    const centerOffsetX = ((minX + maxX) / 2) * cs;
    const centerOffsetY = ((minY + maxY) / 2) * cs;

    out.set(
      startX + gx * cs + centerOffsetX,
      0,
      startZ + gy * cs + centerOffsetY
    );
  }

  public getOccupiedCells(atGx = this.gridX, atGy = this.gridY): GridCell[] {
    return this.shapeCells.map((c) => ({
      x: atGx + c.x,
      y: atGy + c.y,
    }));
  }

  public startSlideTo(
    newGx: number,
    newGy: number,
    boardCols: number,
    boardRows: number
  ): void {
    this.gridX = newGx;
    this.gridY = newGy;
    this.slideStartWorldPos.copy(this.group.position);
    this.calcWorldPosition(newGx, newGy, boardCols, boardRows, this.targetWorldPos);
    this.slideProgress = 0;
    this.state = 'sliding';
  }

  public startShred(
    gateWorldPos: THREE.Vector3,
    direction: THREE.Vector3
  ): void {
    this.state = 'shredding';
    this.shredProgress = 0;
    this.shredTargetPos.copy(gateWorldPos);
    this.shredDirection.copy(direction);
  }

  public triggerWiggle(): void {
    if (this.state !== 'idle') return;
    this.isWiggling = true;
    this.wiggleTimer = 0;
  }

  public update(dt: number): void {
    if (this.isWiggling) {
      this.wiggleTimer += dt;
      if (this.wiggleTimer >= this.wiggleDuration) {
        this.isWiggling = false;
        this.group.rotation.y = 0;
      } else {
        const p = this.wiggleTimer / this.wiggleDuration;
        const angle = Math.sin(p * Math.PI * 4) * 0.12;
        this.group.rotation.y = angle;
      }
    }

    if (this.state === 'sliding') {
      this.slideProgress += dt / this.slideDuration;
      if (this.slideProgress >= 1.0) {
        this.slideProgress = 1.0;
        this.state = 'idle';
        this.group.position.copy(this.targetWorldPos);
        this.currentScale.set(1, 1, 1);
        this.group.scale.copy(this.currentScale);
      } else {
        // Smooth quadratic ease-out
        const t = this.slideProgress;
        const ease = 1 - (1 - t) * (1 - t);
        this.group.position.lerpVectors(this.slideStartWorldPos, this.targetWorldPos, ease);

        // Subtle squash in travel direction
        const squash = Math.sin(t * Math.PI) * 0.12;
        this.currentScale.set(1.0 + squash * 0.3, 1.0 - squash * 0.5, 1.0 + squash * 0.3);
        this.group.scale.copy(this.currentScale);
      }
    } else if (this.state === 'shredding') {
      this.shredProgress += dt / this.shredDuration;
      const t = Math.min(1.0, this.shredProgress);

      // Pull into gate center while shrinking to 0
      this.group.position.lerp(this.shredTargetPos, t);
      const s = Math.max(0, 1.0 - t * t);
      this.group.scale.set(s, s * 0.8, s);

      // Slight rotation along pull direction
      this.group.rotation.x += this.shredDirection.z * dt * 14;
      this.group.rotation.z -= this.shredDirection.x * dt * 14;

      if (this.shredProgress >= 1.0) {
        this.state = 'shredded';
        this.group.visible = false;
      }
    }
  }

  public dispose(): void {
    // Meshes reuse shared materials from PrefabFactory
    this.group.traverse((child) => {
      if ((child as THREE.Mesh).geometry) {
        (child as THREE.Mesh).geometry.dispose();
      }
    });
  }
}
