import * as THREE from 'three';
import { ColorDef, GAME_CONFIG } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export type GateSide = 'top' | 'bottom' | 'left' | 'right';

export class ShredderGate {
  public readonly id: string;
  public readonly side: GateSide;
  public readonly color: ColorDef;
  public readonly cellIndex: number;
  public readonly spanCells: number;

  public readonly group: THREE.Group;
  public readonly roller1: THREE.Mesh;
  public readonly roller2: THREE.Mesh;
  public readonly lightBar: THREE.Mesh;

  public readonly worldPosition = new THREE.Vector3();
  public readonly intakeDirection = new THREE.Vector3(); // Direction pointing outwards
  private rollerRotationSpeed = 8.0;

  constructor(
    id: string,
    side: GateSide,
    color: ColorDef,
    cellIndex: number,
    spanCells: number,
    boardCols: number,
    boardRows: number
  ) {
    this.id = id;
    this.side = side;
    this.color = color;
    this.cellIndex = cellIndex;
    this.spanCells = spanCells;

    const { group, roller1, roller2, lightBar } = PrefabFactory.createShredderGateMesh(
      color,
      spanCells
    );
    this.group = group;
    this.roller1 = roller1;
    this.roller2 = roller2;
    this.lightBar = lightBar;

    this.calculatePlacement(boardCols, boardRows);
  }

  private calculatePlacement(boardCols: number, boardRows: number): void {
    const cs = GAME_CONFIG.cellSize;
    const startX = -((boardCols - 1) / 2) * cs;
    const startZ = -((boardRows - 1) / 2) * cs;
    const gateOffset = cs * 0.65; // Distance outside the outer grid cell

    const centerCell = this.cellIndex + (this.spanCells - 1) / 2;

    switch (this.side) {
      case 'top':
        // Negative Z side
        this.worldPosition.set(startX + centerCell * cs, 0, startZ - gateOffset);
        this.intakeDirection.set(0, 0, -1);
        this.group.rotation.y = 0;
        break;

      case 'bottom':
        // Positive Z side
        this.worldPosition.set(startX + centerCell * cs, 0, -startZ + gateOffset);
        this.intakeDirection.set(0, 0, 1);
        this.group.rotation.y = Math.PI;
        break;

      case 'left':
        // Negative X side
        this.worldPosition.set(startX - gateOffset, 0, startZ + centerCell * cs);
        this.intakeDirection.set(-1, 0, 0);
        this.group.rotation.y = Math.PI / 2;
        break;

      case 'right':
        // Positive X side
        this.worldPosition.set(-startX + gateOffset, 0, startZ + centerCell * cs);
        this.intakeDirection.set(1, 0, 0);
        this.group.rotation.y = -Math.PI / 2;
        break;
    }

    this.group.position.copy(this.worldPosition);
  }

  public matchesCell(side: GateSide, coord: number): boolean {
    return (
      this.side === side &&
      coord >= this.cellIndex &&
      coord < this.cellIndex + this.spanCells
    );
  }

  public matchesBlock(side: GateSide, minCoord: number, maxCoord: number): boolean {
    if (this.side !== side) return false;
    const gateMin = this.cellIndex;
    const gateMax = this.cellIndex + this.spanCells - 1;
    // Entire block must fit inside gate opening to enter rollers
    return minCoord >= gateMin && maxCoord <= gateMax;
  }

  public update(dt: number): void {
    // Continuous rotation of steel shredder rollers
    this.roller1.rotation.x += this.rollerRotationSpeed * dt;
    this.roller2.rotation.x -= this.rollerRotationSpeed * dt;
  }

  public pulseSuccess(): void {
    // Temporarily speed up rollers upon shredding a block
    this.rollerRotationSpeed = 26.0;
    setTimeout(() => {
      this.rollerRotationSpeed = 8.0;
    }, 450);
  }

  public dispose(): void {
    this.group.traverse((child) => {
      if ((child as THREE.Mesh).geometry) {
        (child as THREE.Mesh).geometry.dispose();
      }
    });
  }
}
