import * as THREE from 'three';

const _TO_TURRET = new THREE.Vector3();

export interface LootCubeData {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  goldValue: number;
  active: boolean;
  isVacuuming: boolean;
  vacuumSpeed: number;
}

export class LootCubeManager {
  public readonly group = new THREE.Group();
  private pool: LootCubeData[] = [];
  private readonly maxCubes = 100;

  constructor(scene: THREE.Scene) {
    const geo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
    const matGold = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.6,
      roughness: 0.3,
    });

    for (let i = 0; i < this.maxCubes; i++) {
      const mesh = new THREE.Mesh(geo, matGold);
      mesh.visible = false;
      this.group.add(mesh);
      this.pool.push({
        mesh,
        velocity: new THREE.Vector3(),
        goldValue: 10,
        active: false,
        isVacuuming: false,
        vacuumSpeed: 14.0,
      });
    }

    scene.add(this.group);
  }

  public spawn(pos: THREE.Vector3, goldValue: number, count = 2): void {
    let spawned = 0;
    for (const c of this.pool) {
      if (!c.active) {
        c.active = true;
        c.isVacuuming = false;
        c.goldValue = goldValue;
        c.mesh.position.set(
          pos.x + (Math.random() - 0.5) * 0.4,
          pos.y + 0.2 + Math.random() * 0.4,
          pos.z + (Math.random() - 0.5) * 0.4
        );
        c.mesh.visible = true;

        const angle = Math.random() * Math.PI * 2;
        const hSpeed = 2.5 + Math.random() * 3.5;
        c.velocity.set(
          Math.cos(angle) * hSpeed,
          4.0 + Math.random() * 4.0,
          Math.sin(angle) * hSpeed
        );

        // Auto-vacuum after 0.5s delay
        setTimeout(() => {
          if (c.active) c.isVacuuming = true;
        }, 450 + Math.random() * 200);

        spawned++;
        if (spawned >= count) break;
      }
    }
  }

  public triggerGlobalVacuum(): void {
    for (const c of this.pool) {
      if (c.active) {
        c.isVacuuming = true;
        c.vacuumSpeed = 28.0; // Double speed
        c.goldValue *= 2; // Double reward
      }
    }
  }

  public update(dt: number, turretPos: THREE.Vector3, onCollected: (gold: number) => void): void {
    const gravity = -16.0;

    for (const c of this.pool) {
      if (!c.active) continue;

      if (c.isVacuuming) {
        // Accelerate directly towards turret position
        _TO_TURRET.subVectors(turretPos, c.mesh.position);
        const dist = _TO_TURRET.length();

        if (dist < 1.4) {
          // Reached base!
          c.active = false;
          c.mesh.visible = false;
          onCollected(c.goldValue);
          continue;
        }

        _TO_TURRET.normalize().multiplyScalar(c.vacuumSpeed * dt);
        c.mesh.position.add(_TO_TURRET);
        c.mesh.rotation.x += dt * 10;
        c.mesh.rotation.y += dt * 8;
      } else {
        // Initial physics bounce on ground
        c.velocity.y += gravity * dt;
        c.mesh.position.addScaledVector(c.velocity, dt);

        if (c.mesh.position.y < 0.25) {
          c.mesh.position.y = 0.25;
          c.velocity.y = -c.velocity.y * 0.4;
          c.velocity.x *= 0.8;
          c.velocity.z *= 0.8;
        }

        c.mesh.rotation.x += dt * 4;
      }
    }
  }

  public clearAll(): void {
    for (const c of this.pool) {
      c.active = false;
      c.mesh.visible = false;
    }
  }
}
