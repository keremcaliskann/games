import * as THREE from 'three';

export class ParticleBurstEffect {
  public readonly points: THREE.Points;
  private readonly geometry: THREE.BufferGeometry;
  private readonly positions: Float32Array;
  private readonly colors: Float32Array;
  private readonly velocities: Float32Array;
  private readonly lifetimes: Float32Array;

  private readonly maxParticles = 600;
  private particleCount = 0;

  constructor() {
    this.positions = new Float32Array(this.maxParticles * 3);
    this.colors = new Float32Array(this.maxParticles * 3);
    this.velocities = new Float32Array(this.maxParticles * 3);
    this.lifetimes = new Float32Array(this.maxParticles);

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));

    // Procedural soft-glow circular sprite
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.35,
      map: texture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.points = new THREE.Points(this.geometry, material);
  }

  public spawnUnscrewSparks(pos: THREE.Vector3, colorHex: number, count = 18): void {
    const c = new THREE.Color(colorHex);
    for (let i = 0; i < count; i++) {
      if (this.particleCount >= this.maxParticles) break;
      const idx = this.particleCount++;
      const pIdx = idx * 3;

      this.positions[pIdx] = pos.x;
      this.positions[pIdx + 1] = pos.y;
      this.positions[pIdx + 2] = pos.z;

      this.colors[pIdx] = c.r;
      this.colors[pIdx + 1] = c.g;
      this.colors[pIdx + 2] = c.b;

      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 3.5;
      this.velocities[pIdx] = Math.cos(angle) * speed;
      this.velocities[pIdx + 1] = 1.5 + Math.random() * 3.0;
      this.velocities[pIdx + 2] = Math.sin(angle) * speed;

      this.lifetimes[idx] = 0.45 + Math.random() * 0.25;
    }
  }

  public spawnCelebration(pos: THREE.Vector3, count = 150): void {
    const palette = [0xfacc15, 0x38bdf8, 0xf472b6, 0x34d399, 0xa78bfa, 0xfb923c];
    for (let i = 0; i < count; i++) {
      if (this.particleCount >= this.maxParticles) break;
      const idx = this.particleCount++;
      const pIdx = idx * 3;

      this.positions[pIdx] = pos.x + (Math.random() - 0.5) * 4;
      this.positions[pIdx + 1] = pos.y + (Math.random() - 0.5) * 2;
      this.positions[pIdx + 2] = pos.z + (Math.random() - 0.5) * 4;

      const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)]);
      this.colors[pIdx] = c.r;
      this.colors[pIdx + 1] = c.g;
      this.colors[pIdx + 2] = c.b;

      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 6;
      this.velocities[pIdx] = Math.cos(angle) * speed;
      this.velocities[pIdx + 1] = 4 + Math.random() * 7;
      this.velocities[pIdx + 2] = Math.sin(angle) * speed;

      this.lifetimes[idx] = 1.2 + Math.random() * 0.8;
    }
  }

  public update(dt: number): void {
    if (this.particleCount === 0) return;

    let active = 0;
    for (let i = 0; i < this.particleCount; i++) {
      this.lifetimes[i] -= dt;
      if (this.lifetimes[i] > 0) {
        const fromIdx = i * 3;
        const toIdx = active * 3;

        // Apply gravity and drag
        this.velocities[fromIdx + 1] -= 9.8 * dt;
        this.positions[fromIdx] += this.velocities[fromIdx] * dt;
        this.positions[fromIdx + 1] += this.velocities[fromIdx + 1] * dt;
        this.positions[fromIdx + 2] += this.velocities[fromIdx + 2] * dt;

        if (toIdx !== fromIdx) {
          this.positions[toIdx] = this.positions[fromIdx];
          this.positions[toIdx + 1] = this.positions[fromIdx + 1];
          this.positions[toIdx + 2] = this.positions[fromIdx + 2];

          this.colors[toIdx] = this.colors[fromIdx];
          this.colors[toIdx + 1] = this.colors[fromIdx + 1];
          this.colors[toIdx + 2] = this.colors[fromIdx + 2];

          this.velocities[toIdx] = this.velocities[fromIdx];
          this.velocities[toIdx + 1] = this.velocities[fromIdx + 1];
          this.velocities[toIdx + 2] = this.velocities[fromIdx + 2];

          this.lifetimes[active] = this.lifetimes[i];
        }
        active++;
      }
    }

    this.particleCount = active;
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.setDrawRange(0, this.particleCount);
  }

  public dispose(): void {
    this.geometry.dispose();
  }
}
