import * as THREE from 'three';

interface VoxelParticle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

export class ParticleEffects {
  private group = new THREE.Group();
  private pool: VoxelParticle[] = [];
  private readonly maxParticles = 120;
  private sharedGeo = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  private sharedMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });

  constructor(scene: THREE.Scene) {
    for (let i = 0; i < this.maxParticles; i++) {
      const mesh = new THREE.Mesh(this.sharedGeo, this.sharedMat.clone());
      mesh.visible = false;
      this.group.add(mesh);
      this.pool.push({
        mesh,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 0.6,
        active: false,
      });
    }
    scene.add(this.group);
  }

  public spawnBlockFracture(pos: THREE.Vector3, colorHex: number, count = 8): void {
    let spawned = 0;
    for (const p of this.pool) {
      if (!p.active) {
        p.active = true;
        p.life = 0;
        p.maxLife = 0.4 + Math.random() * 0.3;
        p.mesh.position.set(
          pos.x + (Math.random() - 0.5) * 0.5,
          pos.y + (Math.random() - 0.5) * 0.5,
          pos.z + (Math.random() - 0.5) * 0.5
        );
        p.mesh.scale.setScalar(0.7 + Math.random() * 0.5);
        (p.mesh.material as THREE.MeshBasicMaterial).color.setHex(colorHex);
        p.mesh.visible = true;

        const theta = Math.random() * Math.PI * 2;
        const speed = 4.0 + Math.random() * 6.0;
        p.velocity.set(
          Math.cos(theta) * speed,
          3.0 + Math.random() * 5.0,
          Math.sin(theta) * speed
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

        const progress = p.life / p.maxLife;
        p.mesh.scale.setScalar(Math.max(0, 1.0 - progress));
      }
    }
  }
}
