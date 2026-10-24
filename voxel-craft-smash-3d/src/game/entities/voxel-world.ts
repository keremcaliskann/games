import * as THREE from 'three';
import { GAME_CONFIG, VoxelBlockConfig } from '../config/game-config';

export interface VoxelBlock {
  id: number;
  x: number;
  y: number;
  z: number;
  hp: number;
  config: VoxelBlockConfig;
  active: boolean;
}

export class VoxelWorld {
  public readonly group = new THREE.Group();
  private instancedMesh: THREE.InstancedMesh;
  private readonly maxBlocks = 1200;
  private blocks: VoxelBlock[] = [];
  private dummy = new THREE.Object3D();

  // Callbacks
  public onBlockShattered: ((block: VoxelBlock, pos: THREE.Vector3) => void) | null = null;
  public onTntDetonated: ((pos: THREE.Vector3) => void) | null = null;

  constructor() {
    const geo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
    const mat = new THREE.MeshStandardMaterial({
      roughness: 0.6,
      metalness: 0.1,
    });

    this.instancedMesh = new THREE.InstancedMesh(geo, mat, this.maxBlocks);
    this.instancedMesh.castShadow = true;
    this.instancedMesh.receiveShadow = true;
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    this.group.add(this.instancedMesh);
  }

  public get activeBlockCount(): number {
    return this.blocks.filter((b) => b.active).length;
  }

  public generateWaveFortress(wave: number): void {
    this.blocks = [];
    let id = 0;

    // Reset all instance matrices to scale 0
    for (let i = 0; i < this.maxBlocks; i++) {
      this.dummy.position.set(0, -999, 0);
      this.dummy.scale.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }

    const startZ = -12;

    if (wave === 1) {
      // Wave 1: Compact Voxel Tower (8x8 base, 6 height)
      for (let y = 0; y < 6; y++) {
        for (let x = -3; x <= 3; x++) {
          for (let z = -3; z <= 3; z++) {
            // Hollow interior
            if (Math.abs(x) < 2 && Math.abs(z) < 2 && y < 5) continue;

            const isTnt = (x === 0 && z === 0 && y === 1) || (x === 2 && z === -2 && y === 2);
            const isOre = y === 3 && (x === -2 || z === 2);
            const type = isTnt ? 'tnt' : isOre ? 'ore' : y < 2 ? 'stone' : 'wood';
            const cfg = GAME_CONFIG.blockTypes[type];

            this.createBlock(id++, x, y + 0.5, startZ + z, cfg);
            if (id >= this.maxBlocks) break;
          }
        }
      }
    } else if (wave === 2) {
      // Wave 2: Twin Guard Castles with connecting bridge
      for (let y = 0; y < 7; y++) {
        // Tower Left (-6)
        for (let x = -8; x <= -4; x++) {
          for (let z = -2; z <= 2; z++) {
            const isTnt = y === 2 && x === -6 && z === 0;
            const type = isTnt ? 'tnt' : y < 3 ? 'stone' : 'wood';
            this.createBlock(id++, x, y + 0.5, startZ + z, GAME_CONFIG.blockTypes[type]);
          }
        }
        // Tower Right (+6)
        for (let x = 4; x <= 8; x++) {
          for (let z = -2; z <= 2; z++) {
            const isTnt = y === 2 && x === 6 && z === 0;
            const type = isTnt ? 'tnt' : y < 3 ? 'stone' : 'wood';
            this.createBlock(id++, x, y + 0.5, startZ + z, GAME_CONFIG.blockTypes[type]);
          }
        }
        // Bridge at y = 4
        if (y === 4 || y === 5) {
          for (let x = -3; x <= 3; x++) {
            for (let z = -1; z <= 1; z++) {
              const isOre = x === 0;
              const type = isOre ? 'ore' : 'stone';
              this.createBlock(id++, x, y + 0.5, startZ + z, GAME_CONFIG.blockTypes[type]);
            }
          }
        }
      }
    } else {
      // Wave 3+: Massive Voxel Citadel
      for (let y = 0; y < 8; y++) {
        const span = Math.max(2, 6 - Math.floor(y / 2));
        for (let x = -span; x <= span; x++) {
          for (let z = -span; z <= span; z++) {
            if (Math.abs(x) < span - 1 && Math.abs(z) < span - 1 && y < 7) continue;

            const isTnt = (x % 3 === 0 && z % 3 === 0 && y === 2);
            const isOre = (x + z + y) % 5 === 0;
            const type = isTnt ? 'tnt' : isOre ? 'ore' : y < 3 ? 'stone' : 'wood';
            this.createBlock(id++, x, y + 0.5, startZ + z, GAME_CONFIG.blockTypes[type]);
            if (id >= this.maxBlocks) break;
          }
        }
      }
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }
  }

  private createBlock(id: number, x: number, y: number, z: number, cfg: VoxelBlockConfig): void {
    if (id >= this.maxBlocks) return;

    this.dummy.position.set(x, y, z);
    this.dummy.scale.set(1.0, 1.0, 1.0);
    this.dummy.updateMatrix();

    this.instancedMesh.setMatrixAt(id, this.dummy.matrix);
    this.instancedMesh.setColorAt(id, new THREE.Color(cfg.color));

    this.blocks.push({
      id,
      x,
      y,
      z,
      hp: cfg.maxHp,
      config: cfg,
      active: true,
    });
  }

  public checkProjectileHit(pos: THREE.Vector3, radius: number, damage: number): boolean {
    for (const b of this.blocks) {
      if (!b.active) continue;

      // Distance check to voxel cube center
      const dx = Math.abs(pos.x - b.x);
      const dy = Math.abs(pos.y - b.y);
      const dz = Math.abs(pos.z - b.z);

      if (dx < 0.5 + radius && dy < 0.5 + radius && dz < 0.5 + radius) {
        this.damageBlock(b, damage);
        return true;
      }
    }
    return false;
  }

  private damageBlock(b: VoxelBlock, damage: number): void {
    b.hp -= damage;

    if (b.hp <= 0) {
      b.active = false;

      // Scale instance to 0
      this.dummy.position.set(b.x, -999, b.z);
      this.dummy.scale.set(0, 0, 0);
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(b.id, this.dummy.matrix);
      this.instancedMesh.instanceMatrix.needsUpdate = true;

      const hitPos = new THREE.Vector3(b.x, b.y, b.z);
      if (this.onBlockShattered) {
        this.onBlockShattered(b, hitPos);
      }

      // Check TNT explosion
      if (b.config.isTnt) {
        this.triggerTntExplosion(hitPos);
      }
    }
  }

  public triggerTntExplosion(pos: THREE.Vector3): void {
    if (this.onTntDetonated) {
      this.onTntDetonated(pos);
    }

    const rad = GAME_CONFIG.tntExplosionRadius;

    for (const b of this.blocks) {
      if (!b.active) continue;
      const dist = Math.hypot(b.x - pos.x, b.y - pos.y, b.z - pos.z);
      if (dist <= rad) {
        this.damageBlock(b, 5); // Lethal damage to blast zone
      }
    }
  }
}
