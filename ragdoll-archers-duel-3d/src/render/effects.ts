import * as THREE from 'three';

interface PooledParticle {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

export class ParticleEffects {
  private readonly pool: PooledParticle[] = [];

  constructor(scene: THREE.Scene) {
    const geo = new THREE.DodecahedronGeometry(0.11, 0);
    for (let i = 0; i < 64; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.4,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.pool.push({
        mesh,
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0.6,
        active: false,
      });
    }
  }

  public spawnBurst(pos: THREE.Vector3, colorHex: number, count = 12): void {
    let spawned = 0;
    for (let i = 0; i < this.pool.length && spawned < count; i++) {
      const p = this.pool[i];
      if (p.active) continue;
      p.active = true;
      p.life = 0;
      p.maxLife = 0.45 + Math.random() * 0.25;
      p.mesh.visible = true;
      p.mesh.position.copy(pos);
      p.mesh.scale.setScalar(1.0);
      (p.mesh.material as THREE.MeshStandardMaterial).color.setHex(colorHex);

      const angle = (spawned / count) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 2.5 + Math.random() * 4.5;
      p.vel.set(
        Math.cos(angle) * speed,
        2.0 + Math.random() * 4.5,
        (Math.random() - 0.5) * 3.0
      );
      spawned++;
    }
  }

  public update(dt: number): void {
    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (!p.active) continue;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }
      p.vel.y -= 14.0 * dt;
      p.mesh.position.x += p.vel.x * dt;
      p.mesh.position.y += p.vel.y * dt;
      p.mesh.position.z += p.vel.z * dt;
      const s = Math.max(0.05, 1.0 - p.life / p.maxLife);
      p.mesh.scale.setScalar(s);
    }
  }
}
