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
  private cursor = 0;

  constructor(scene: THREE.Scene) {
    const geo = new THREE.DodecahedronGeometry(0.24, 0);
    for (let i = 0; i < 96; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
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

  public spawnBurst(origin: THREE.Vector3, colorHex: number, count = 12): void {
    for (let i = 0; i < count; i++) {
      const p = this.pool[this.cursor];
      this.cursor = (this.cursor + 1) % this.pool.length;

      p.active = true;
      p.life = 0;
      p.maxLife = 0.38 + Math.random() * 0.32;
      p.mesh.visible = true;
      p.mesh.position.set(
        origin.x + (Math.random() - 0.5) * 0.8,
        origin.y + 0.25 + Math.random() * 0.4,
        origin.z + (Math.random() - 0.5) * 0.8
      );
      p.mesh.scale.setScalar(0.85 + Math.random() * 0.65);

      const mat = p.mesh.material as THREE.MeshBasicMaterial;
      mat.color.setHex(colorHex);
      mat.opacity = 0.9;

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.2 + Math.random() * 4.5;
      p.vel.set(Math.cos(angle) * speed, 2.5 + Math.random() * 3.8, Math.sin(angle) * speed);
    }
  }

  public spawnDriftPuff(x: number, y: number, z: number, colorHex: number): void {
    const p = this.pool[this.cursor];
    this.cursor = (this.cursor + 1) % this.pool.length;

    p.active = true;
    p.life = 0;
    p.maxLife = 0.34;
    p.mesh.visible = true;
    p.mesh.position.set(x, y + 0.18, z);
    p.mesh.scale.setScalar(0.75);

    const mat = p.mesh.material as THREE.MeshBasicMaterial;
    mat.color.setHex(colorHex);
    mat.opacity = 0.72;
    p.vel.set((Math.random() - 0.5) * 1.4, 1.1 + Math.random() * 0.9, (Math.random() - 0.5) * 1.4);
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

      const t = p.life / p.maxLife;
      p.vel.y -= 9.5 * dt;
      p.mesh.position.x += p.vel.x * dt;
      p.mesh.position.y += p.vel.y * dt;
      p.mesh.position.z += p.vel.z * dt;
      p.mesh.scale.setScalar(Math.max(0.1, (1 - t * 0.75) * 1.1));
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.85;
    }
  }
}
