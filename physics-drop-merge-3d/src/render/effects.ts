import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

export class ParticleEffects {
  private readonly particles: Particle[] = [];
  private readonly maxParticles = 100;
  private readonly dummyVec = new THREE.Vector3();

  constructor(private readonly scene: THREE.Scene) {
    const geo = new THREE.SphereGeometry(0.12, 8, 8);

    for (let i = 0; i < this.maxParticles; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.3,
        metalness: 0.1,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.scene.add(mesh);

      this.particles.push({
        mesh,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 0.8,
        active: false,
      });
    }
  }

  public spawnMergeBurst(pos: THREE.Vector3, color: number = 0xfef08a, count: number = 20): void {
    let spawned = 0;
    for (const p of this.particles) {
      if (!p.active) {
        p.active = true;
        p.life = 0;
        p.maxLife = 0.35 + Math.random() * 0.35;
        p.mesh.position.copy(pos);
        p.mesh.visible = true;

        (p.mesh.material as THREE.MeshStandardMaterial).color.setHex(color);

        const speed = 4 + Math.random() * 7;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        p.velocity.set(
          Math.cos(theta) * Math.sin(phi) * speed,
          Math.cos(phi) * speed + 1.2,
          Math.sin(theta) * Math.sin(phi) * speed
        );

        p.mesh.scale.setScalar(0.7 + Math.random() * 0.6);
        spawned++;
        if (spawned >= count) break;
      }
    }
  }

  public spawnBombExplosion(pos: THREE.Vector3): void {
    this.spawnMergeBurst(pos, 0xef4444, 40);
  }

  public update(dt: number): void {
    for (const p of this.particles) {
      if (p.active) {
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          p.mesh.visible = false;
          continue;
        }

        p.velocity.y -= 14 * dt;
        this.dummyVec.copy(p.velocity).multiplyScalar(dt);
        p.mesh.position.add(this.dummyVec);

        const progress = 1 - p.life / p.maxLife;
        p.mesh.scale.setScalar(progress * 0.85);
      }
    }
  }
}
