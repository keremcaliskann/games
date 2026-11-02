import * as THREE from 'three';

interface ParticleSlot {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  active: boolean;
}

interface PickupPopSlot {
  sprite: THREE.Sprite;
  mat: THREE.SpriteMaterial;
  life: number;
  maxLife: number;
  active: boolean;
}

function createPlusOneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 64);
  ctx.font = '900 44px "Outfit", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 8;
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.strokeText('+1', 64, 34);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('+1', 64, 34);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export class ParticleEffects {
  private readonly pool: ParticleSlot[] = [];
  private readonly popPool: PickupPopSlot[] = [];

  constructor(scene: THREE.Scene) {
    const geo = new THREE.BoxGeometry(0.24, 0.16, 0.34);
    for (let i = 0; i < 72; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.42,
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

    const plusTex = createPlusOneTexture();
    for (let i = 0; i < 20; i++) {
      const mat = new THREE.SpriteMaterial({
        map: plusTex,
        color: 0xffffff,
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(1.1, 0.55, 1);
      sprite.visible = false;
      scene.add(sprite);
      this.popPool.push({
        sprite,
        mat,
        life: 0,
        maxLife: 0.55,
        active: false,
      });
    }
  }

  public spawnPickupPop(pos: THREE.Vector3, colorHex: number): void {
    for (let i = 0; i < this.popPool.length; i++) {
      const p = this.popPool[i];
      if (p.active) continue;
      p.active = true;
      p.maxLife = 0.52;
      p.life = p.maxLife;
      p.sprite.position.set(
        pos.x + (Math.random() - 0.5) * 0.45,
        pos.y + 1.85,
        pos.z
      );
      p.mat.color.setHex(colorHex);
      p.mat.opacity = 1.0;
      p.sprite.scale.set(1.15, 0.58, 1);
      p.sprite.visible = true;
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

    for (let i = 0; i < this.popPool.length; i++) {
      const pop = this.popPool[i];
      if (!pop.active) continue;
      pop.life -= dt;
      if (pop.life <= 0) {
        pop.active = false;
        pop.sprite.visible = false;
        continue;
      }
      pop.sprite.position.y += 2.4 * dt;
      const ratio = pop.life / pop.maxLife;
      pop.mat.opacity = Math.min(1.0, ratio * 1.5);
    }
  }
}
