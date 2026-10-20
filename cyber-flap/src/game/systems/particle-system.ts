import * as THREE from 'three';

const MAX_PARTICLES = 128;

// Module-level scratch instances to guarantee zero-allocation hot paths
const _mat4 = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _color = new THREE.Color();
const _axisZ = new THREE.Vector3(0, 0, 1);

export class ParticleSystem {
  readonly mesh: THREE.InstancedMesh;

  private readonly posX = new Float32Array(MAX_PARTICLES);
  private readonly posY = new Float32Array(MAX_PARTICLES);
  private readonly posZ = new Float32Array(MAX_PARTICLES);
  private readonly velX = new Float32Array(MAX_PARTICLES);
  private readonly velY = new Float32Array(MAX_PARTICLES);
  private readonly velZ = new Float32Array(MAX_PARTICLES);
  private readonly gravityY = new Float32Array(MAX_PARTICLES);
  private readonly life = new Float32Array(MAX_PARTICLES);
  private readonly maxLife = new Float32Array(MAX_PARTICLES);
  private readonly baseScale = new Float32Array(MAX_PARTICLES);
  private readonly colorR = new Float32Array(MAX_PARTICLES);
  private readonly colorG = new Float32Array(MAX_PARTICLES);
  private readonly colorB = new Float32Array(MAX_PARTICLES);
  private readonly spinZ = new Float32Array(MAX_PARTICLES);
  private readonly rotZ = new Float32Array(MAX_PARTICLES);

  private nextIndex = 0;

  constructor() {
    const geo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    this.mesh = new THREE.InstancedMesh(geo, mat, MAX_PARTICLES);
    this.mesh.frustumCulled = false;

    // Initialize all instances as collapsed/hidden
    _scale.set(0, 0, 0);
    _mat4.makeScale(0, 0, 0);
    _color.setRGB(1, 1, 1);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.mesh.setMatrixAt(i, _mat4);
      this.mesh.setColorAt(i, _color);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }
  }

  private allocate(): number {
    const idx = this.nextIndex;
    this.nextIndex = (this.nextIndex + 1) % MAX_PARTICLES;
    return idx;
  }

  /**
   * Spawns exhaust ring / puff motes behind the drone on boost/flap.
   */
  spawnFlapPuff(x: number, y: number, z: number): void {
    const count = 5;
    for (let i = 0; i < count; i++) {
      const idx = this.allocate();
      this.posX[idx] = x - 0.72 + (Math.random() - 0.5) * 0.12;
      this.posY[idx] = y + (Math.random() - 0.5) * 0.15;
      this.posZ[idx] = z + (Math.random() - 0.5) * 0.15;

      this.velX[idx] = -3.2 - Math.random() * 2.8;
      this.velY[idx] = (Math.random() - 0.5) * 1.8;
      this.velZ[idx] = (Math.random() - 0.5) * 1.2;
      this.gravityY[idx] = 0;

      const dur = 0.32 + Math.random() * 0.15;
      this.life[idx] = dur;
      this.maxLife[idx] = dur;
      this.baseScale[idx] = 1.0 + Math.random() * 0.6;
      this.spinZ[idx] = (Math.random() - 0.5) * 8.0;
      this.rotZ[idx] = Math.random() * Math.PI * 2;

      // Crisp daylight exhaust colors: pure white or electric cyan
      if (i % 2 === 0) {
        this.colorR[idx] = 1.0;
        this.colorG[idx] = 1.0;
        this.colorB[idx] = 1.0;
      } else {
        this.colorR[idx] = 0.02;
        this.colorG[idx] = 0.95;
        this.colorB[idx] = 1.0;
      }
    }
  }

  /**
   * Spawns radial starburst sparks on clearing obstacle gate.
   */
  spawnScoreBurst(x: number, y: number, z: number): void {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const idx = this.allocate();
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const speed = 4.2 + Math.random() * 3.5;

      this.posX[idx] = x;
      this.posY[idx] = y;
      this.posZ[idx] = z + (Math.random() - 0.5) * 0.4;

      this.velX[idx] = Math.cos(angle) * speed;
      this.velY[idx] = Math.sin(angle) * speed;
      this.velZ[idx] = (Math.random() - 0.5) * 1.5;
      this.gravityY[idx] = -5.0;

      const dur = 0.45 + Math.random() * 0.25;
      this.life[idx] = dur;
      this.maxLife[idx] = dur;
      this.baseScale[idx] = 1.2 + Math.random() * 0.6;
      this.spinZ[idx] = (Math.random() - 0.5) * 12.0;
      this.rotZ[idx] = angle;

      // Celebratory colors: solar amber gold & vibrant electric cyan
      if (i % 2 === 0) {
        this.colorR[idx] = 0.98;
        this.colorG[idx] = 0.8;
        this.colorB[idx] = 0.08;
      } else {
        this.colorR[idx] = 0.22;
        this.colorG[idx] = 0.74;
        this.colorB[idx] = 0.97;
      }
    }
  }

  /**
   * Spawns mechanical debris chunks and spark spray with gravity on crash.
   */
  spawnCrashExplosion(x: number, y: number, z: number): void {
    const count = 32;
    for (let i = 0; i < count; i++) {
      const idx = this.allocate();
      const angle = Math.random() * Math.PI * 2;
      const speed = 3.5 + Math.random() * 6.5;

      this.posX[idx] = x;
      this.posY[idx] = y;
      this.posZ[idx] = z;

      this.velX[idx] = Math.cos(angle) * speed + (Math.random() - 0.5) * 2;
      this.velY[idx] = Math.abs(Math.sin(angle)) * speed * 0.9 + 2.0;
      this.velZ[idx] = (Math.random() - 0.5) * 3.5;
      this.gravityY[idx] = -22.0;

      const dur = 0.7 + Math.random() * 0.4;
      this.life[idx] = dur;
      this.maxLife[idx] = dur;
      this.baseScale[idx] = 1.4 + Math.random() * 1.2;
      this.spinZ[idx] = (Math.random() - 0.5) * 16.0;
      this.rotZ[idx] = Math.random() * Math.PI * 2;

      // Drone livery palette: coral, aerodynamic white, cyan, and hazard yellow
      const mod = i % 4;
      if (mod === 0) {
        this.colorR[idx] = 0.96; // Coral #f43f5e
        this.colorG[idx] = 0.25;
        this.colorB[idx] = 0.37;
      } else if (mod === 1) {
        this.colorR[idx] = 0.97; // White #f8fafc
        this.colorG[idx] = 0.98;
        this.colorB[idx] = 0.99;
      } else if (mod === 2) {
        this.colorR[idx] = 0.02; // Cyan #06b6d4
        this.colorG[idx] = 0.71;
        this.colorB[idx] = 0.83;
      } else {
        this.colorR[idx] = 0.98; // Hazard amber #f59e0b
        this.colorG[idx] = 0.62;
        this.colorB[idx] = 0.04;
      }
    }
  }

  update(dtSec: number): void {
    let hasActive = false;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (this.life[i] <= 0) {
        continue;
      }

      hasActive = true;
      this.life[i] -= dtSec;

      if (this.life[i] <= 0) {
        _mat4.makeScale(0, 0, 0);
        this.mesh.setMatrixAt(i, _mat4);
        continue;
      }

      this.velY[i] += this.gravityY[i] * dtSec;
      this.posX[i] += this.velX[i] * dtSec;
      this.posY[i] += this.velY[i] * dtSec;
      this.posZ[i] += this.velZ[i] * dtSec;
      this.rotZ[i] += this.spinZ[i] * dtSec;

      const progress = this.life[i] / this.maxLife[i];
      const scaleMultiplier = Math.sin(progress * Math.PI) * this.baseScale[i];

      _pos.set(this.posX[i], this.posY[i], this.posZ[i]);
      _quat.setFromAxisAngle(_axisZ, this.rotZ[i]);
      _scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
      _mat4.compose(_pos, _quat, _scale);
      this.mesh.setMatrixAt(i, _mat4);

      _color.setRGB(this.colorR[i], this.colorG[i], this.colorB[i]);
      this.mesh.setColorAt(i, _color);
    }

    if (hasActive) {
      this.mesh.instanceMatrix.needsUpdate = true;
      if (this.mesh.instanceColor) {
        this.mesh.instanceColor.needsUpdate = true;
      }
    }
  }

  reset(): void {
    _mat4.makeScale(0, 0, 0);
    for (let i = 0; i < MAX_PARTICLES; i++) {
      this.life[i] = 0;
      this.mesh.setMatrixAt(i, _mat4);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    if (Array.isArray(this.mesh.material)) {
      for (let i = 0; i < this.mesh.material.length; i++) {
        this.mesh.material[i].dispose();
      }
    } else {
      this.mesh.material.dispose();
    }
  }
}
