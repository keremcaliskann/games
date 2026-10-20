import * as THREE from 'three';

const MAX_PARTICLES = 600;

// Vibrant confetti palette optimized for bright daylight skies
const PALETTE_CONFETTI = [
  { r: 0.0, g: 0.94, b: 1.0 },   // Electric Cyan
  { r: 0.98, g: 0.80, b: 0.08 }, // Solar Gold
  { r: 0.96, g: 0.25, b: 0.37 }, // Hot Coral
  { r: 0.29, g: 0.87, b: 0.50 }, // Neon Lime
  { r: 1.0, g: 1.0, b: 1.0 },    // Pure White
];

const PALETTE_BONK = [
  { r: 0.94, g: 0.27, b: 0.27 }, // Vivid Crimson
  { r: 0.98, g: 0.45, b: 0.09 }, // Fiery Orange
  { r: 0.98, g: 0.75, b: 0.14 }, // Solar Amber
];

/**
 * Pre-allocated multi-color particle system for tactile ASMR and juice feedback.
 * Uses NormalBlending with vibrant vertex colors for crisp visibility against bright daylight skies.
 * Zero per-frame allocations during gameplay.
 */
export class ParticleBurstEffect {
  public readonly points: THREE.Points;
  private readonly positions: Float32Array;
  private readonly velocities: Float32Array;
  private readonly colors: Float32Array;
  private readonly lifetimes: Float32Array;
  private readonly maxLifetimes: Float32Array;
  private readonly particleTypes: Uint8Array; // 0 = standard burst, 1 = bonk spark, 2 = gravity confetti
  private activeCount = 0;

  constructor() {
    this.positions = new Float32Array(MAX_PARTICLES * 3);
    this.velocities = new Float32Array(MAX_PARTICLES * 3);
    this.colors = new Float32Array(MAX_PARTICLES * 3);
    this.lifetimes = new Float32Array(MAX_PARTICLES);
    this.maxLifetimes = new Float32Array(MAX_PARTICLES);
    this.particleTypes = new Uint8Array(MAX_PARTICLES);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    // Normal blending ensures saturated colors remain crisp against bright daylight sky
    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(geometry, material);
    this.points.geometry.setDrawRange(0, 0);
    this.points.visible = false;
  }

  /**
   * Spawns multi-color confetti burst when an arrow block is successfully cleared.
   */
  public spawnBurst(origin: THREE.Vector3, count = 22): void {
    const burstCount = Math.min(count, MAX_PARTICLES - this.activeCount);
    for (let i = 0; i < burstCount; i++) {
      const idx = this.activeCount;
      const pIdx = idx * 3;

      this.positions[pIdx] = origin.x + (Math.random() - 0.5) * 0.35;
      this.positions[pIdx + 1] = origin.y + (Math.random() - 0.5) * 0.35;
      this.positions[pIdx + 2] = origin.z + (Math.random() - 0.5) * 0.35;

      const speed = 3.5 + Math.random() * 4.2;
      const angleTheta = Math.random() * Math.PI * 2;
      const anglePhi = Math.acos(2 * Math.random() - 1);

      this.velocities[pIdx] = Math.sin(anglePhi) * Math.cos(angleTheta) * speed;
      this.velocities[pIdx + 1] = Math.sin(anglePhi) * Math.sin(angleTheta) * speed;
      this.velocities[pIdx + 2] = Math.cos(anglePhi) * speed;

      const color = PALETTE_CONFETTI[Math.floor(Math.random() * PALETTE_CONFETTI.length)];
      this.colors[pIdx] = color.r;
      this.colors[pIdx + 1] = color.g;
      this.colors[pIdx + 2] = color.b;

      this.lifetimes[idx] = 0;
      this.maxLifetimes[idx] = 0.45 + Math.random() * 0.3;
      this.particleTypes[idx] = 0;

      this.activeCount++;
    }
  }

  /**
   * Spawns snappy warning sparks when an obstructed block bonks.
   */
  public spawnBonkSparks(origin: THREE.Vector3, direction: THREE.Vector3, count = 12): void {
    const sparkCount = Math.min(count, MAX_PARTICLES - this.activeCount);
    for (let i = 0; i < sparkCount; i++) {
      const idx = this.activeCount;
      const pIdx = idx * 3;

      this.positions[pIdx] = origin.x + direction.x * 0.5 + (Math.random() - 0.5) * 0.2;
      this.positions[pIdx + 1] = origin.y + direction.y * 0.5 + (Math.random() - 0.5) * 0.2;
      this.positions[pIdx + 2] = origin.z + direction.z * 0.5 + (Math.random() - 0.5) * 0.2;

      // Project outwards along the obstruction direction with lateral scatter
      const speed = 4.5 + Math.random() * 3.5;
      this.velocities[pIdx] = (direction.x + (Math.random() - 0.5) * 0.9) * speed;
      this.velocities[pIdx + 1] = (direction.y + (Math.random() - 0.5) * 0.9) * speed;
      this.velocities[pIdx + 2] = (direction.z + (Math.random() - 0.5) * 0.9) * speed;

      const color = PALETTE_BONK[Math.floor(Math.random() * PALETTE_BONK.length)];
      this.colors[pIdx] = color.r;
      this.colors[pIdx + 1] = color.g;
      this.colors[pIdx + 2] = color.b;

      this.lifetimes[idx] = 0;
      this.maxLifetimes[idx] = 0.18 + Math.random() * 0.12;
      this.particleTypes[idx] = 1;

      this.activeCount++;
    }
  }

  /**
   * Spawns an upward celebratory confetti fountain upon clearing a level.
   */
  public spawnCelebration(origin: THREE.Vector3, count = 75): void {
    const festCount = Math.min(count, MAX_PARTICLES - this.activeCount);
    for (let i = 0; i < festCount; i++) {
      const idx = this.activeCount;
      const pIdx = idx * 3;

      this.positions[pIdx] = origin.x + (Math.random() - 0.5) * 0.8;
      this.positions[pIdx + 1] = origin.y + (Math.random() - 0.5) * 0.4;
      this.positions[pIdx + 2] = origin.z + (Math.random() - 0.5) * 0.8;

      // Strong upward launch with radial fountain spread
      const angle = Math.random() * Math.PI * 2;
      const spread = 2.5 + Math.random() * 3.5;
      this.velocities[pIdx] = Math.cos(angle) * spread;
      this.velocities[pIdx + 1] = 5.5 + Math.random() * 4.5; // upward impulse
      this.velocities[pIdx + 2] = Math.sin(angle) * spread;

      const color = PALETTE_CONFETTI[Math.floor(Math.random() * PALETTE_CONFETTI.length)];
      this.colors[pIdx] = color.r;
      this.colors[pIdx + 1] = color.g;
      this.colors[pIdx + 2] = color.b;

      this.lifetimes[idx] = 0;
      this.maxLifetimes[idx] = 0.75 + Math.random() * 0.35;
      this.particleTypes[idx] = 2;

      this.activeCount++;
    }
  }

  public update(delta: number): void {
    this.points.visible = this.activeCount > 0;
    if (this.activeCount === 0) {
      this.points.geometry.setDrawRange(0, 0);
      return;
    }

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

        this.colors[pIdx] = this.colors[lastPIdx];
        this.colors[pIdx + 1] = this.colors[lastPIdx + 1];
        this.colors[pIdx + 2] = this.colors[lastPIdx + 2];

        this.lifetimes[i] = this.lifetimes[lastIdx];
        this.maxLifetimes[i] = this.maxLifetimes[lastIdx];
        this.particleTypes[i] = this.particleTypes[lastIdx];

        this.activeCount--;
        i--;
        continue;
      }

      const pIdx = i * 3;
      const pType = this.particleTypes[i];

      // Realistic gravity pull on confetti flutter
      if (pType === 2) {
        this.velocities[pIdx + 1] -= 9.5 * delta;
      } else if (pType === 0) {
        this.velocities[pIdx + 1] -= 4.0 * delta;
      }

      this.positions[pIdx] += this.velocities[pIdx] * delta;
      this.positions[pIdx + 1] += this.velocities[pIdx + 1] * delta;
      this.positions[pIdx + 2] += this.velocities[pIdx + 2] * delta;
    }

    const posAttr = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    const colorAttr = this.points.geometry.getAttribute('color') as THREE.BufferAttribute;
    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    this.points.geometry.setDrawRange(0, this.activeCount);
  }

  public dispose(): void {
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
