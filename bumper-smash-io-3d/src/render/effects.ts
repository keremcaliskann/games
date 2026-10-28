import * as THREE from 'three';

interface ParticleSlot {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

interface SkidSlot {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
  active: boolean;
}

interface RippleSlot {
  mesh: THREE.Mesh;
  life: number;
  maxLife: number;
  active: boolean;
}

export class ParticleEffects {
  private readonly pool: ParticleSlot[] = [];
  private readonly skids: SkidSlot[] = [];
  private readonly ripples: RippleSlot[] = [];

  constructor(scene: THREE.Scene) {
    const geo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
    for (let i = 0; i < 64; i++) {
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

    // Tire skid decal pool
    const skidGeo = new THREE.PlaneGeometry(0.42, 0.58);
    skidGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 28; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0x334155,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(skidGeo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.skids.push({ mesh, life: 0, maxLife: 1.2, active: false });
    }

    // Water splash foam ripple pool
    const rippleGeo = new THREE.RingGeometry(0.55, 0.95, 20);
    rippleGeo.rotateX(-Math.PI / 2);
    for (let i = 0; i < 8; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(rippleGeo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.ripples.push({ mesh, life: 0, maxLife: 0.75, active: false });
    }
  }

  public spawnSkidMark(x: number, z: number, headingRad: number): void {
    for (let i = 0; i < this.skids.length; i++) {
      const s = this.skids[i];
      if (s.active) continue;
      s.active = true;
      s.maxLife = 1.1;
      s.life = s.maxLife;
      s.mesh.position.set(x, 0.025, z);
      s.mesh.rotation.y = headingRad;
      (s.mesh.material as THREE.MeshBasicMaterial).opacity = 0.32;
      s.mesh.visible = true;
      break;
    }
  }

  public spawnWaterRipple(x: number, z: number): void {
    for (let i = 0; i < this.ripples.length; i++) {
      const r = this.ripples[i];
      if (r.active) continue;
      r.active = true;
      r.maxLife = 0.75;
      r.life = r.maxLife;
      r.mesh.position.set(x, -3.1, z);
      r.mesh.scale.setScalar(0.8);
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = 0.88;
      r.mesh.visible = true;
      break;
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
      const speed = 3.2 + Math.random() * 5.8;
      p.vel.set(Math.cos(angle) * speed, 3.5 + Math.random() * 4.5, Math.sin(angle) * speed);
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

    for (let i = 0; i < this.skids.length; i++) {
      const s = this.skids[i];
      if (!s.active) continue;
      s.life -= dt;
      if (s.life <= 0) {
        s.active = false;
        s.mesh.visible = false;
        continue;
      }
      (s.mesh.material as THREE.MeshBasicMaterial).opacity = (s.life / s.maxLife) * 0.32;
    }

    for (let i = 0; i < this.ripples.length; i++) {
      const r = this.ripples[i];
      if (!r.active) continue;
      r.life -= dt;
      if (r.life <= 0) {
        r.active = false;
        r.mesh.visible = false;
        continue;
      }
      const progress = 1.0 - r.life / r.maxLife;
      r.mesh.scale.setScalar(0.8 + progress * 2.8);
      (r.mesh.material as THREE.MeshBasicMaterial).opacity = (1.0 - progress) * 0.85;
    }
  }
}
