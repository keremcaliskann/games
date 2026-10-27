import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';

export class ProjectileManager {
  public readonly group = new THREE.Group();
  private pool: {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    active: boolean;
    life: number;
    bounces: number;
  }[] = [];
  private readonly maxProjectiles = 60;

  constructor(scene: THREE.Scene) {
    const geo = new THREE.SphereGeometry(GAME_CONFIG.projectileRadius, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    for (let i = 0; i < this.maxProjectiles; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.group.add(mesh);
      this.pool.push({
        mesh,
        velocity: new THREE.Vector3(),
        active: false,
        life: 0,
        bounces: 0,
      });
    }

    scene.add(this.group);
  }

  public spawn(origin: THREE.Vector3, direction: THREE.Vector3, isPowered = false): void {
    for (const p of this.pool) {
      if (!p.active) {
        p.active = true;
        p.life = 0;
        p.bounces = 0;
        p.mesh.position.copy(origin);
        p.mesh.scale.setScalar(isPowered ? 1.6 : 1.0);
        (p.mesh.material as THREE.MeshBasicMaterial).color.setHex(isPowered ? 0xf59e0b : 0x38bdf8);
        p.velocity.copy(direction).multiplyScalar(GAME_CONFIG.projectileSpeed);
        p.mesh.visible = true;
        break;
      }
    }
  }

  public update(
    dt: number,
    onHitCheck: (pos: THREE.Vector3, radius: number) => boolean
  ): void {
    for (const p of this.pool) {
      if (!p.active) continue;

      p.life += dt;
      if (p.life > 1.8) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }

      p.mesh.position.x += p.velocity.x * dt;
      p.mesh.position.y += p.velocity.y * dt;
      p.mesh.position.z += p.velocity.z * dt;

      // Check collision with voxels or golems
      const hit = onHitCheck(p.mesh.position, GAME_CONFIG.projectileRadius);
      if (hit) {
        if (p.bounces < 2) {
          p.bounces++;
          p.velocity.x *= -0.75;
          p.velocity.z *= -0.75;
          p.mesh.position.x += p.velocity.x * dt * 2.0;
        } else {
          p.active = false;
          p.mesh.visible = false;
        }
      }
    }
  }

  public clearAll(): void {
    for (const p of this.pool) {
      p.active = false;
      p.mesh.visible = false;
    }
  }
}
