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
  private readonly maxParticles = 120;
  private readonly dummyVec = new THREE.Vector3();

  constructor(private readonly scene: THREE.Scene) {
    const geo = new THREE.BoxGeometry(0.24, 0.24, 0.24);

    for (let i = 0; i < this.maxParticles; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.scene.add(mesh);

      this.particles.push({
        mesh,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1.0,
        active: false,
      });
    }
  }

  public spawnExplosion(pos: THREE.Vector3, color: number = 0xf97316, count: number = 24): void {
    let spawned = 0;
    for (const p of this.particles) {
      if (!p.active) {
        p.active = true;
        p.life = 0;
        p.maxLife = 0.4 + Math.random() * 0.4;
        p.mesh.position.copy(pos);
        p.mesh.visible = true;

        (p.mesh.material as THREE.MeshStandardMaterial).color.setHex(color);

        const speed = 6 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.5; // Upwards bias

        p.velocity.set(
          Math.cos(theta) * Math.sin(phi) * speed,
          Math.cos(phi) * speed + 2,
          Math.sin(theta) * Math.sin(phi) * speed
        );

        const scale = 0.6 + Math.random() * 0.8;
        p.mesh.scale.set(scale, scale, scale);

        spawned++;
        if (spawned >= count) break;
      }
    }
  }

  public spawnWaterSplash(pos: THREE.Vector3): void {
    this.spawnExplosion(pos, 0x38bdf8, 16);
  }

  public spawnSmoke(pos: THREE.Vector3): void {
    this.spawnExplosion(pos, 0xf1f5f9, 8);
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

        // Apply gravity & motion
        p.velocity.y -= 18 * dt;
        this.dummyVec.copy(p.velocity).multiplyScalar(dt);
        p.mesh.position.add(this.dummyVec);

        // Shrink
        const progress = 1 - p.life / p.maxLife;
        p.mesh.scale.setScalar(progress * 0.9);
      }
    }
  }
}
