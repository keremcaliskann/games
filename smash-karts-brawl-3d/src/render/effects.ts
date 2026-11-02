import * as THREE from 'three';

interface ParticleSlot {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

interface ShockwaveRingSlot {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  life: number;
  maxLife: number;
  active: boolean;
}

export class ParticleEffects {
  private readonly pool: ParticleSlot[] = [];
  private readonly ringPool: ShockwaveRingSlot[] = [];

  constructor(scene: THREE.Scene) {
    const geo = new THREE.BoxGeometry(0.26, 0.26, 0.26);
    for (let i = 0; i < 96; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.38,
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

    const ringGeo = new THREE.RingGeometry(0.35, 0.65, 24);
    ringGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(ringGeo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.ringPool.push({
        mesh,
        mat,
        life: 0,
        maxLife: 0.36,
        active: false,
      });
    }
  }

  public spawnBurst(pos: THREE.Vector3, colorHex: number, count = 14): void {
    let spawned = 0;
    for (let i = 0; i < this.pool.length && spawned < count; i++) {
      const p = this.pool[i];
      if (p.active) continue;
      p.active = true;
      p.maxLife = 0.36 + Math.random() * 0.26;
      p.life = p.maxLife;
      p.mesh.position.copy(pos);
      (p.mesh.material as THREE.MeshStandardMaterial).color.setHex(colorHex);
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.5 + Math.random() * 6.0;
      p.vel.set(Math.cos(angle) * speed, 3.4 + Math.random() * 5.0, Math.sin(angle) * speed);
      p.mesh.scale.setScalar(1.1);
      p.mesh.visible = true;
      spawned++;
    }
  }

  public spawnShockwaveRing(pos: THREE.Vector3, colorHex = 0xfacc15): void {
    for (let i = 0; i < this.ringPool.length; i++) {
      const r = this.ringPool[i];
      if (r.active) continue;
      r.active = true;
      r.maxLife = 0.36;
      r.life = r.maxLife;
      r.mesh.position.set(pos.x, pos.y + 0.08, pos.z);
      r.mesh.scale.setScalar(0.6);
      r.mat.color.setHex(colorHex);
      r.mat.opacity = 0.88;
      r.mesh.visible = true;
      return;
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
      p.vel.y -= 16.5 * dt;
      p.mesh.position.x += p.vel.x * dt;
      p.mesh.position.y += p.vel.y * dt;
      p.mesh.position.z += p.vel.z * dt;
      p.mesh.rotation.x += dt * 7.5;
      p.mesh.rotation.y += dt * 5.5;
      const s = Math.max(0.01, p.life / p.maxLife);
      p.mesh.scale.setScalar(s);
    }

    for (let i = 0; i < this.ringPool.length; i++) {
      const r = this.ringPool[i];
      if (!r.active) continue;
      r.life -= dt;
      if (r.life <= 0) {
        r.active = false;
        r.mesh.visible = false;
        continue;
      }
      const progress = 1.0 - r.life / r.maxLife;
      r.mesh.scale.setScalar(0.6 + progress * 3.8);
      r.mat.opacity = (1.0 - progress) * 0.88;
    }
  }
}
