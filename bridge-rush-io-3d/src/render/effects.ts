import * as THREE from 'three';

interface ParticleSlot {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

export class ParticleEffects {
  private readonly pool: ParticleSlot[] = [];

  constructor(scene: THREE.Scene) {
    const geo = new THREE.BoxGeometry(0.24, 0.16, 0.34);
    for (let i = 0; i < 72; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.42,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.pool.push({
        mesh,
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0.5,
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
      p.maxLife = 0.38 + Math.random() * 0.25;
      p.life = p.maxLife;
      p.mesh.position.copy(pos);
      (p.mesh.material as THREE.MeshStandardMaterial).color.setHex(colorHex);
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.0 + Math.random() * 5.2;
      p.vel.set(Math.cos(angle) * speed, 3.2 + Math.random() * 4.5, Math.sin(angle) * speed);
      p.mesh.scale.setScalar(1.0);
      p.mesh.visible = true;
      spawned++;
    }
  }

  public update(dt: number): void {
    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }
      p.vel.y -= 16.0 * dt;
      p.mesh.position.x += p.vel.x * dt;
      p.mesh.position.y += p.vel.y * dt;
      p.mesh.position.z += p.vel.z * dt;
      p.mesh.rotation.x += dt * 7.0;
      p.mesh.rotation.y += dt * 5.0;
      const s = Math.max(0.01, p.life / p.maxLife);
      p.mesh.scale.setScalar(s);
    }
  }
}
