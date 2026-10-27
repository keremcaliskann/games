import * as THREE from 'three';

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  scale: number;
}

export class ParticleEffects {
  private particles: Particle[] = [];
  private readonly group = new THREE.Group();
  private readonly sharedGeo = new THREE.SphereGeometry(0.12, 6, 6);

  constructor(scene: THREE.Scene) {
    scene.add(this.group);
  }

  public spawnBoardingBurst(pos: THREE.Vector3, colorHex: number, count = 10): void {
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.sharedGeo, mat);
      mesh.position.copy(pos);
      this.group.add(mesh);

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 3.5;
      const velocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        2.5 + Math.random() * 3.0,
        Math.sin(angle) * speed
      );

      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.45 + Math.random() * 0.2,
        scale: 1.0,
      });
    }
  }

  public spawnExhaustPuff(pos: THREE.Vector3): void {
    const mat = new THREE.MeshBasicMaterial({ color: 0x94a3b8, transparent: true, opacity: 0.7 });
    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(this.sharedGeo, mat);
      mesh.position.copy(pos);
      this.group.add(mesh);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        0.8 + Math.random() * 1.5,
        -1.5 - Math.random() * 2.0
      );

      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.5,
        scale: 1.4,
      });
    }
  }

  public spawnHeloSparks(pos: THREE.Vector3): void {
    const mat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    for (let i = 0; i < 16; i++) {
      const mesh = new THREE.Mesh(this.sharedGeo, mat);
      mesh.position.copy(pos);
      this.group.add(mesh);

      const angle = (i / 16) * Math.PI * 2;
      const velocity = new THREE.Vector3(
        Math.cos(angle) * 4.0,
        1.0 + Math.random() * 2.0,
        Math.sin(angle) * 4.0
      );

      this.particles.push({
        mesh,
        velocity,
        life: 0,
        maxLife: 0.6,
        scale: 1.2,
      });
    }
  }

  public update(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife) {
        this.group.remove(p.mesh);
        this.particles.splice(i, 1);
        continue;
      }

      const progress = p.life / p.maxLife;
      p.mesh.position.addScaledVector(p.velocity, dt);
      p.velocity.y -= 9.8 * dt * 0.7; // Gravity

      const currentScale = p.scale * (1.0 - progress * 0.7);
      p.mesh.scale.setScalar(Math.max(0.01, currentScale));
    }
  }

  public clear(): void {
    for (const p of this.particles) {
      this.group.remove(p.mesh);
    }
    this.particles = [];
  }
}
