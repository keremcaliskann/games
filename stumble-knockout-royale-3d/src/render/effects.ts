import * as THREE from 'three';

interface ParticleSlot {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

interface DustRingSlot {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  life: number;
  maxLife: number;
  active: boolean;
}

interface WindStreakSlot {
  mesh: THREE.Mesh;
  mat: THREE.MeshBasicMaterial;
  life: number;
  maxLife: number;
  active: boolean;
}

const CONFETTI_COLORS = [0xfacc15, 0xec4899, 0x38bdf8, 0x4ade80, 0xa855f7];

export class ParticleEffects {
  private readonly pool: ParticleSlot[] = [];
  private readonly ringPool: DustRingSlot[] = [];
  private readonly streakPool: WindStreakSlot[] = [];

  constructor(scene: THREE.Scene) {
    const geo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    for (let i = 0; i < 96; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.4,
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

    const ringGeo = new THREE.RingGeometry(0.28, 0.48, 20);
    ringGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 16; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(ringGeo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.ringPool.push({
        mesh,
        mat,
        life: 0,
        maxLife: 0.35,
        active: false,
      });
    }

    const streakGeo = new THREE.BoxGeometry(0.06, 0.06, 1.35);
    for (let i = 0; i < 24; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(streakGeo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.streakPool.push({
        mesh,
        mat,
        life: 0,
        maxLife: 0.22,
        active: false,
      });
    }
  }

  public spawnTouchdownRing(pos: THREE.Vector3): void {
    for (let i = 0; i < this.ringPool.length; i++) {
      const r = this.ringPool[i];
      if (r.active) continue;
      r.active = true;
      r.maxLife = 0.34;
      r.life = r.maxLife;
      r.mesh.position.set(pos.x, 0.05, pos.z);
      r.mesh.scale.setScalar(0.55);
      r.mat.opacity = 0.78;
      r.mesh.visible = true;
      return;
    }
  }

  public spawnDiveWindStreak(pos: THREE.Vector3): void {
    for (let i = 0; i < this.streakPool.length; i++) {
      const s = this.streakPool[i];
      if (s.active) continue;
      s.active = true;
      s.maxLife = 0.2;
      s.life = s.maxLife;
      s.mesh.position.set(
        pos.x + (Math.random() - 0.5) * 0.7,
        pos.y + 0.45 + Math.random() * 0.5,
        pos.z - 0.4
      );
      s.mat.opacity = 0.75;
      s.mesh.visible = true;
      return;
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

  public spawnConfettiCannons(finishZ: number, trackHalfWidth: number): void {
    let spawned = 0;
    for (let i = 0; i < this.pool.length && spawned < 24; i++) {
      const p = this.pool[i];
      if (p.active) continue;
      const isLeft = spawned % 2 === 0;
      p.active = true;
      p.maxLife = 0.65 + Math.random() * 0.35;
      p.life = p.maxLife;
      p.mesh.position.set(
        isLeft ? -trackHalfWidth + 0.3 : trackHalfWidth - 0.3,
        1.2,
        finishZ
      );
      const colorHex = CONFETTI_COLORS[spawned % CONFETTI_COLORS.length];
      (p.mesh.material as THREE.MeshStandardMaterial).color.setHex(colorHex);
      const inwardVx = (isLeft ? 1 : -1) * (2.5 + Math.random() * 4.0);
      p.vel.set(inwardVx, 6.5 + Math.random() * 4.5, (Math.random() - 0.5) * 3.5);
      p.mesh.scale.setScalar(1.15);
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
      r.mesh.scale.setScalar(0.55 + progress * 2.1);
      r.mat.opacity = (1.0 - progress) * 0.78;
    }

    for (let i = 0; i < this.streakPool.length; i++) {
      const s = this.streakPool[i];
      if (!s.active) continue;
      s.life -= dt;
      if (s.life <= 0) {
        s.active = false;
        s.mesh.visible = false;
        continue;
      }
      s.mesh.position.z -= 8.0 * dt;
      s.mat.opacity = (s.life / s.maxLife) * 0.75;
    }
  }
}
