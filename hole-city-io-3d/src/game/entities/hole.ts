import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';

export class Hole {
  public readonly id: string;
  public readonly name: string;
  public readonly isPlayer: boolean;
  public readonly group = new THREE.Group();

  public radius: number = GAME_CONFIG.baseHoleRadius;
  public score: number = 0;
  public kills: number = 0;
  public isAlive: boolean = true;

  // Active booster timers
  public turboTimer: number = 0;
  public magnetTimer: number = 0;
  public invulnerableTimer: number = 0;

  // Movement
  public readonly velocity = new THREE.Vector3();
  private targetVelocity = new THREE.Vector3();

  // Visual Meshes
  private readonly vortexDisc: THREE.Mesh;
  private readonly borderRing: THREE.Mesh;
  private readonly innerWell: THREE.Mesh;
  private readonly particlesGroup = new THREE.Group();
  private pulseScale = 1.0;

  constructor(id: string, name: string, isPlayer: boolean, colorHex: string, ringColorHex: string) {
    this.id = id;
    this.name = name;
    this.isPlayer = isPlayer;

    const baseColor = new THREE.Color(colorHex);
    const ringColor = new THREE.Color(ringColorHex);

    // 1. Abyss Center Disc (Slightly above road to avoid z-fighting)
    const discGeo = new THREE.CircleGeometry(1.0, 32);
    discGeo.rotateX(-Math.PI * 0.5);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0x020617,
      depthWrite: true,
    });
    this.vortexDisc = new THREE.Mesh(discGeo, discMat);
    this.vortexDisc.position.y = 0.035;
    this.group.add(this.vortexDisc);

    // 2. Inner Well depth illusion
    const wellGeo = new THREE.CylinderGeometry(0.98, 0.6, 0.4, 32, 1, true);
    const wellMat = new THREE.MeshBasicMaterial({
      color: 0x050b14,
      side: THREE.BackSide,
    });
    this.innerWell = new THREE.Mesh(wellGeo, wellMat);
    this.innerWell.position.y = -0.18;
    this.group.add(this.innerWell);

    // 3. Glowing Neon Boundary Torus Ring
    const torusGeo = new THREE.TorusGeometry(1.0, 0.08, 12, 36);
    torusGeo.rotateX(Math.PI * 0.5);
    const ringMat = new THREE.MeshStandardMaterial({
      color: ringColor,
      emissive: baseColor,
      emissiveIntensity: 0.65,
      roughness: 0.3,
    });
    this.borderRing = new THREE.Mesh(torusGeo, ringMat);
    this.borderRing.position.y = 0.05;
    this.group.add(this.borderRing);

    // 4. Orbiting vortex dust particles
    const particleGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
    const particleMat = new THREE.MeshBasicMaterial({ color: ringColor });

    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      const angle = (i / 6) * Math.PI * 2;
      p.position.set(Math.cos(angle) * 0.65, 0.04, Math.sin(angle) * 0.65);
      this.particlesGroup.add(p);
    }
    this.group.add(this.particlesGroup);

    this.updateVisualScale();
  }

  public get position(): THREE.Vector3 {
    return this.group.position;
  }

  public setMoveDirection(dirX: number, dirZ: number): void {
    let speed = GAME_CONFIG.baseSpeed;
    if (this.turboTimer > 0) {
      speed *= GAME_CONFIG.turboSpeedMultiplier;
    }

    // Scale speed slightly as hole grows for balanced arcade feel
    const sizeDampen = Math.max(0.75, 1.0 - (this.radius - 1.15) * 0.045);
    speed *= sizeDampen;

    this.targetVelocity.set(dirX * speed, 0, dirZ * speed);
  }

  public addScore(points: number, radiusBonus: number): void {
    this.score += points;
    const oldRadius = this.radius;
    this.radius = Math.min(GAME_CONFIG.maxHoleRadius, this.radius + radiusBonus);

    // Trigger elastic grow pulse
    if (this.radius > oldRadius) {
      this.pulseScale = 1.22;
    }
  }

  public activateTurbo(): void {
    this.turboTimer = GAME_CONFIG.boosterTurboDurationSec;
  }

  public activateMagnet(): void {
    this.magnetTimer = GAME_CONFIG.boosterMagnetDurationSec;
  }

  public activateSizeSurge(): void {
    this.addScore(100, GAME_CONFIG.boosterSizeSurgeBonus);
  }

  public activateShield(durationSec: number): void {
    this.invulnerableTimer = durationSec;
  }

  public update(dt: number): void {
    if (!this.isAlive) return;

    // Tick timers
    if (this.turboTimer > 0) this.turboTimer = Math.max(0, this.turboTimer - dt);
    if (this.magnetTimer > 0) this.magnetTimer = Math.max(0, this.magnetTimer - dt);
    if (this.invulnerableTimer > 0) this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);

    // Smooth acceleration
    this.velocity.lerp(this.targetVelocity, Math.min(dt * 12.0, 1.0));
    this.group.position.x += this.velocity.x * dt;
    this.group.position.z += this.velocity.z * dt;

    // Clamp inside arena bounds
    const half = GAME_CONFIG.arenaSize / 2 - this.radius;
    this.group.position.x = Math.max(-half, Math.min(half, this.group.position.x));
    this.group.position.z = Math.max(-half, Math.min(half, this.group.position.z));

    // Rotate vortex particles
    this.particlesGroup.rotation.y += dt * 4.5;

    // Elastic pulse dampening
    if (this.pulseScale > 1.0) {
      this.pulseScale = Math.max(1.0, this.pulseScale - dt * 2.5);
    }

    this.updateVisualScale();
  }

  private updateVisualScale(): void {
    const s = this.radius * this.pulseScale;
    this.group.scale.set(s, 1.0, s);
  }

  public canSwallowProp(propRadius: number): boolean {
    return propRadius <= this.radius * 0.95;
  }

  public canSwallowHole(other: Hole): boolean {
    return this.isAlive && other.isAlive && other.invulnerableTimer <= 0 && this.radius > other.radius * 1.15;
  }

  public reset(x: number, z: number): void {
    this.radius = GAME_CONFIG.baseHoleRadius;
    this.score = 0;
    this.kills = 0;
    this.isAlive = true;
    this.turboTimer = 0;
    this.magnetTimer = 0;
    this.invulnerableTimer = 0;
    this.group.position.set(x, 0, z);
    this.velocity.set(0, 0, 0);
    this.targetVelocity.set(0, 0, 0);
    this.pulseScale = 1.0;
    this.group.visible = true;
    this.updateVisualScale();
  }
}
