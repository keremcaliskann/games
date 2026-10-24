import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

export class ParticleBurstEffect {
  private group = new THREE.Group();
  private pool: Particle[] = [];
  private readonly maxParticles = 120;
  private sharedGeo: THREE.BufferGeometry;
  private sharedMat: THREE.MeshBasicMaterial;

  constructor(scene: THREE.Scene) {
    this.sharedGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    this.sharedMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

    for (let i = 0; i < this.maxParticles; i++) {
      const mesh = new THREE.Mesh(this.sharedGeo, this.sharedMat.clone());
      mesh.visible = false;
      this.group.add(mesh);
      this.pool.push({
        mesh,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1.0,
        active: false,
      });
    }

    scene.add(this.group);
  }

  public spawnBurst(pos: THREE.Vector3, colorHex: number, count = 12): void {
    let spawned = 0;
    for (const p of this.pool) {
      if (!p.active) {
        p.active = true;
        p.life = 0;
        p.maxLife = 0.45 + Math.random() * 0.3;
        p.mesh.position.set(
          pos.x + (Math.random() - 0.5) * 0.4,
          pos.y + 0.2 + Math.random() * 0.3,
          pos.z + (Math.random() - 0.5) * 0.4
        );
        p.mesh.scale.setScalar(1.0 + Math.random() * 0.5);
        (p.mesh.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
        p.mesh.visible = true;

        const angle = Math.random() * Math.PI * 2;
        const speed = 3.5 + Math.random() * 5.5;
        p.velocity.set(
          Math.cos(angle) * speed,
          4.0 + Math.random() * 4.0,
          Math.sin(angle) * speed
        );

        spawned++;
        if (spawned >= count) break;
      }
    }
  }

  public update(dt: number): void {
    const gravity = -18.0;

    for (const p of this.pool) {
      if (p.active) {
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          p.mesh.visible = false;
          continue;
        }

        p.velocity.y += gravity * dt;
        p.mesh.position.x += p.velocity.x * dt;
        p.mesh.position.y += p.velocity.y * dt;
        p.mesh.position.z += p.velocity.z * dt;

        // Shrink towards death
        const progress = p.life / p.maxLife;
        const scale = (1.0 - progress);
        p.mesh.scale.setScalar(scale);

        if (p.mesh.position.y < 0) {
          p.mesh.position.y = 0;
          p.velocity.y = -p.velocity.y * 0.3; // subtle bounce
        }
      }
    }
  }
}
