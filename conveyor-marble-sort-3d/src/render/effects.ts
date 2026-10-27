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
  private readonly maxParticles = 96;
  private readonly dummyVec = new THREE.Vector3();

  constructor(private readonly scene: THREE.Scene) {
    const geo = new THREE.SphereGeometry(0.12, 6, 6);

    for (let i = 0; i < this.maxParticles; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.25,
        metalness: 0.2,
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

  public spawnPopBurst(pos: THREE.Vector3, colors: number[] = [0xfacc15, 0x38bdf8, 0xef4444, 0x10b981]): void {
    let spawned = 0;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.life = 0;
        p.maxLife = 0.4 + Math.random() * 0.35;
        p.mesh.position.copy(pos);
        p.mesh.visible = true;

        const color = colors[Math.floor(Math.random() * colors.length)];
        (p.mesh.material as THREE.MeshStandardMaterial).color.setHex(color);

        const speed = 4.5 + Math.random() * 5.5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        p.velocity.set(
          Math.cos(theta) * Math.sin(phi) * speed,
          Math.cos(phi) * speed + 2.0,
          Math.sin(theta) * Math.sin(phi) * speed
        );

        p.mesh.scale.setScalar(0.7 + Math.random() * 0.5);
        spawned++;
        if (spawned >= 18) break;
      }
    }
  }

  public update(dt: number): void {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
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
        p.mesh.scale.setScalar(progress * 0.95);
      }
    }
  }
}
