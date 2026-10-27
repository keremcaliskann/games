import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';
import { BusEntity } from './bus';
import { PrefabFactory } from '../../render/PrefabFactory';

export interface LoadingBay {
  index: number;
  pos: THREE.Vector3;
  bus: BusEntity | null;
  isVip: boolean;
  unlocked: boolean;
  markerMat: THREE.MeshBasicMaterial;
}

export class ParkingLot {
  public readonly root = new THREE.Group();
  public readonly cols = GAME_CONFIG.grid.cols;
  public readonly rows = GAME_CONFIG.grid.rows;
  public readonly tileSize = GAME_CONFIG.grid.tileSize;

  public buses: BusEntity[] = [];
  public bays: LoadingBay[] = [];

  constructor(scene: THREE.Scene) {
    const lotWidth = this.cols * this.tileSize;
    const lotDepth = this.rows * this.tileSize;

    const stage = PrefabFactory.createLotStage(lotWidth, lotDepth);
    this.root.add(stage);

    const tunnel = PrefabFactory.createTunnelDispenser();
    tunnel.position.set(0, 0, -lotDepth * 0.5 - 1.35);
    this.root.add(tunnel);

    scene.add(this.root);

    this.setupBays();
  }

  private setupBays(): void {
    this.bays = [];
    const totalBays = GAME_CONFIG.bays.maxVipCount; // 4 bays
    const spacing = GAME_CONFIG.bays.spacing;
    const startX = -((totalBays - 1) * spacing) / 2;

    for (let i = 0; i < totalBays; i++) {
      const isVip = i === totalBays - 1; // 4th bay is VIP
      const bayPos = new THREE.Vector3(startX + i * spacing, 0.05, 3.6);

      // Create visual bay slot marking
      const markerGeo = new THREE.PlaneGeometry(1.6, 2.8);
      markerGeo.rotateX(-Math.PI * 0.5);
      const markerMat = new THREE.MeshBasicMaterial({
        color: isVip ? 0xf59e0b : 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: isVip ? 0.35 : 0.65,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(bayPos);
      this.root.add(marker);

      this.bays.push({
        index: i,
        pos: bayPos,
        bus: null,
        isVip,
        unlocked: !isVip, // 3 default bays unlocked, VIP locked initially
        markerMat,
      });
    }
  }

  public unlockVipBay(): void {
    const vip = this.bays.find((b) => b.isVip);
    if (vip) {
      vip.unlocked = true;
      vip.markerMat.opacity = 0.95;
      vip.markerMat.color.setHex(0xfbbf24);
    }
  }

  public getFirstFreeBay(): LoadingBay | undefined {
    return this.bays.find((b) => b.unlocked && b.bus === null);
  }

  public gridToWorld(col: number, row: number): THREE.Vector3 {
    const halfWidth = (this.cols * this.tileSize) / 2;
    const halfDepth = (this.rows * this.tileSize) / 2;
    const x = col * this.tileSize - halfWidth + this.tileSize / 2;
    const z = row * this.tileSize - halfDepth + this.tileSize / 2 - 1.0;
    return new THREE.Vector3(x, 0, z);
  }

  public canBusExit(bus: BusEntity): boolean {
    if (bus.isDocked || bus.isDriving) return false;

    // Build occupied grid tile lookup
    const occupied = new Set<string>();
    for (const other of this.buses) {
      if (other === bus || other.isDocked) continue;
      for (const t of other.tiles) {
        occupied.add(`${t.col}_${t.row}`);
      }
    }

    // Determine exit ray trajectory in front of the bus
    switch (bus.orientation) {
      case 'N': {
        const minRow = Math.min(...bus.tiles.map((t) => t.row));
        const col = bus.tiles[0].col;
        for (let r = minRow - 1; r >= 0; r--) {
          if (occupied.has(`${col}_${r}`)) return false;
        }
        return true;
      }
      case 'S': {
        const maxRow = Math.max(...bus.tiles.map((t) => t.row));
        const col = bus.tiles[0].col;
        for (let r = maxRow + 1; r < this.rows; r++) {
          if (occupied.has(`${col}_${r}`)) return false;
        }
        return true;
      }
      case 'W': {
        const minCol = Math.min(...bus.tiles.map((t) => t.col));
        const row = bus.tiles[0].row;
        for (let c = minCol - 1; c >= 0; c--) {
          if (occupied.has(`${c}_${row}`)) return false;
        }
        return true;
      }
      case 'E': {
        const maxCol = Math.max(...bus.tiles.map((t) => t.col));
        const row = bus.tiles[0].row;
        for (let c = maxCol + 1; c < this.cols; c++) {
          if (occupied.has(`${c}_${row}`)) return false;
        }
        return true;
      }
    }
  }

  public clear(): void {
    for (const b of this.buses) {
      this.root.remove(b.root);
    }
    this.buses = [];
    for (const bay of this.bays) {
      bay.bus = null;
      if (bay.isVip) {
        bay.unlocked = false;
        bay.markerMat.opacity = 0.35;
        bay.markerMat.color.setHex(0xf59e0b);
      }
    }
  }
}
