import * as THREE from 'three';

const MAX_PARTICLES = 300;

/**
 * Pre-allocated particle system for neon block explosion bursts.
 * Zero-allocation during runtime updates ensures steady 60 FPS on mobile.
 */
export class ParticleBurstEffect {
  public readonly points: THREE.Points;
  private readonly positions: Float32Array;
  private readonly velocities: Float32Array;
  private readonly lifetimes: Float32Array;
  private readonly maxLifetimes: Float32Array;
  private activeCount = 0;

  constructor() {
    this.positions = new Float32Array(MAX_PARTICLES * 3);
    this.velocities = new Float32Array(MAX_PARTICLES * 3);
    this.lifetimes = new Float32Array(MAX_PARTICLES);
    this.maxLifetimes = new Float32Array(MAX_PARTICLES);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    // Simple emissive particle material
    const material = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.25,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
  }

  public spawnBurst(origin: THREE.Vector3, count = 20): void {
    const burstCount = Math.min(count, MAX_PARTICLES - this.activeCount);
    for (let i = 0; i < burstCount; i++) {
      const idx = this.activeCount;
      const pIdx = idx * 3;

      this.positions[pIdx] = origin.x + (Math.random() - 0.5) * 0.4;
      this.positions[pIdx + 1] = origin.y + (Math.random() - 0.5) * 0.4;
      this.positions[pIdx + 2] = origin.z + (Math.random() - 0.5) * 0.4;

      const speed = 3.5 + Math.random() * 4.0;
      const angleTheta = Math.random() * Math.PI * 2;
      const anglePhi = Math.acos(2 * Math.random() - 1);

      this.velocities[pIdx] = Math.sin(anglePhi) * Math.cos(angleTheta) * speed;
      this.velocities[pIdx + 1] = Math.sin(anglePhi) * Math.sin(angleTheta) * speed;
      this.velocities[pIdx + 2] = Math.cos(anglePhi) * speed;

      this.lifetimes[idx] = 0;
      this.maxLifetimes[idx] = 0.4 + Math.random() * 0.3;

      this.activeCount++;
    }
  }

  public update(delta: number): void {
    if (this.activeCount === 0) return;

    for (let i = 0; i < this.activeCount; i++) {
      this.lifetimes[i] += delta;

      if (this.lifetimes[i] >= this.maxLifetimes[i]) {
        // Swap with last active particle to remove in O(1)
        const lastIdx = this.activeCount - 1;
        const pIdx = i * 3;
        const lastPIdx = lastIdx * 3;

        this.positions[pIdx] = this.positions[lastPIdx];
        this.positions[pIdx + 1] = this.positions[lastPIdx + 1];
        this.positions[pIdx + 2] = this.positions[lastPIdx + 2];

        this.velocities[pIdx] = this.velocities[lastPIdx];
        this.velocities[pIdx + 1] = this.velocities[lastPIdx + 1];
        this.velocities[pIdx + 2] = this.velocities[lastPIdx + 2];

        this.lifetimes[i] = this.lifetimes[lastIdx];
        this.maxLifetimes[i] = this.maxLifetimes[lastIdx];

        this.activeCount--;
        i--;
        continue;
      }

      const pIdx = i * 3;
      this.positions[pIdx] += this.velocities[pIdx] * delta;
      this.positions[pIdx + 1] += this.velocities[pIdx + 1] * delta;
      this.positions[pIdx + 2] += this.velocities[pIdx + 2] * delta;
    }

    const posAttr = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
  }
}
