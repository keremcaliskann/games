import * as THREE from 'three';
import { EvolutionStage, GAME_CONFIG } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export class Hole {
  public readonly id: string;
  public readonly name: string;
  public readonly isPlayer: boolean;
  public readonly group = new THREE.Group();

  public radius: number = GAME_CONFIG.baseHoleRadius;
  public score: number = 0;
  public kills: number = 0;
  public isAlive: boolean = true;
  public currentStage: number = 1;

  // Active booster timers
  public turboTimer: number = 0;
  public magnetTimer: number = 0;
  public invulnerableTimer: number = 0;

  private tauntSprite: THREE.Sprite | null = null;
  private tauntTimer: number = 0;

  // Movement
  public readonly velocity = new THREE.Vector3();
  private targetVelocity = new THREE.Vector3();

  // Visual Meshes
  private readonly vortexDisc: THREE.Mesh;
  private readonly borderRing: THREE.Mesh;
  private readonly outerRing: THREE.Mesh;
  private readonly shockwaveRing: THREE.Mesh;
  private readonly innerWell: THREE.Mesh;
  private readonly particlesGroup = new THREE.Group();
  private readonly ringMat: THREE.MeshStandardMaterial;
  private readonly outerRingMat: THREE.MeshStandardMaterial;
  private readonly shockwaveMat: THREE.MeshBasicMaterial;
  private pulseScale = 1.0;
  private shockwaveProgress = 0;

  constructor(id: string, name: string, isPlayer: boolean, colorHex: string, ringColorHex: string) {
    this.id = id;
    this.name = name;
    this.isPlayer = isPlayer;

    const baseColor = new THREE.Color(colorHex);
    const ringColor = new THREE.Color(ringColorHex);

    // 1. Abyss Center Disc (Slightly above road to avoid z-fighting)
    const discGeo = new THREE.CircleGeometry(0.97, 36);
    discGeo.rotateX(-Math.PI * 0.5);
    const discMat = new THREE.MeshBasicMaterial({
      color: 0x090d16,
      depthWrite: true,
    });
    this.vortexDisc = new THREE.Mesh(discGeo, discMat);
    this.vortexDisc.position.y = 0.035;
    this.group.add(this.vortexDisc);

    // 2. Inner Well depth illusion
    const wellGeo = new THREE.CylinderGeometry(0.96, 0.45, 0.55, 32, 1, true);
    const wellMat = new THREE.MeshBasicMaterial({
      color: 0x0f172a,
      side: THREE.BackSide,
    });
    this.innerWell = new THREE.Mesh(wellGeo, wellMat);
    this.innerWell.position.y = -0.24;
    this.group.add(this.innerWell);

    // 3. Glowing Primary Boundary Torus Ring
    const torusGeo = new THREE.TorusGeometry(1.0, 0.095, 14, 42);
    torusGeo.rotateX(Math.PI * 0.5);
    this.ringMat = new THREE.MeshStandardMaterial({
      color: ringColor,
      emissive: baseColor,
      emissiveIntensity: 0.75,
      roughness: 0.25,
    });
    this.borderRing = new THREE.Mesh(torusGeo, this.ringMat);
    this.borderRing.position.y = 0.055;
    this.group.add(this.borderRing);

    // 4. Secondary Outer Accretion Bevel Ring (evolves with stage)
    const outerTorusGeo = new THREE.TorusGeometry(1.13, 0.038, 10, 42);
    outerTorusGeo.rotateX(Math.PI * 0.5);
    this.outerRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: ringColor,
      emissiveIntensity: 0.55,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    this.outerRing = new THREE.Mesh(outerTorusGeo, this.outerRingMat);
    this.outerRing.position.y = 0.045;
    this.group.add(this.outerRing);

    // 5. Stage-Up Expanding Shockwave Ring
    const shockGeo = new THREE.RingGeometry(1.05, 1.28, 36);
    shockGeo.rotateX(-Math.PI * 0.5);
    this.shockwaveMat = new THREE.MeshBasicMaterial({
      color: ringColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.0,
    });
    this.shockwaveRing = new THREE.Mesh(shockGeo, this.shockwaveMat);
    this.shockwaveRing.position.y = 0.06;
    this.shockwaveRing.visible = false;
    this.group.add(this.shockwaveRing);

    // 6. Orbiting vortex energy sparks (12 multi-radius particles)
    const particleGeo = new THREE.OctahedronGeometry(0.065, 0);
    const particleMat = new THREE.MeshBasicMaterial({ color: ringColor });

    for (let i = 0; i < 12; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      const angle = (i / 12) * Math.PI * 2;
      const radialDist = i % 2 === 0 ? 0.72 : 0.45;
      p.position.set(
        Math.cos(angle) * radialDist,
        0.04 + (i % 3) * 0.03,
        Math.sin(angle) * radialDist
      );
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
    if (!this.isPlayer) {
      speed *= GAME_CONFIG.botSpeedMultiplier;
    }
    if (this.turboTimer > 0) {
      speed *= GAME_CONFIG.turboSpeedMultiplier;
    }

    // Gentle speed scaling as hole grows so larger holes still feel responsive
    const sizeDampen = Math.max(0.82, 1.0 - (this.radius - 1.15) * 0.028);
    speed *= sizeDampen;

    this.targetVelocity.set(dirX * speed, 0, dirZ * speed);
  }

  public addScore(points: number, radiusBonus: number): boolean {
    this.score += points;
    const oldRadius = this.radius;
    const oldStage = this.currentStage;
    this.radius = Math.min(GAME_CONFIG.maxHoleRadius, this.radius + radiusBonus);

    // Trigger elastic grow pulse
    if (this.radius > oldRadius) {
      this.pulseScale = Math.min(1.32, 1.16 + radiusBonus * 0.4);
    }

    const newStageObj = this.getEvolutionStage();
    this.currentStage = newStageObj.stage;

    if (this.currentStage > oldStage) {
      this.triggerStageUpEffect(newStageObj);
      return true;
    }
    return false;
  }

  public getEvolutionStage(): EvolutionStage {
    const stages = GAME_CONFIG.evolutionStages;
    let active = stages[0];
    for (let i = 0; i < stages.length; i++) {
      if (this.radius >= stages[i].minRadius) {
        active = stages[i];
      }
    }
    return active;
  }

  public getStageProgress(): {
    current: EvolutionStage;
    next: EvolutionStage | null;
    progress01: number;
  } {
    const stages = GAME_CONFIG.evolutionStages;
    let currentIdx = 0;
    for (let i = 0; i < stages.length; i++) {
      if (this.radius >= stages[i].minRadius) {
        currentIdx = i;
      }
    }
    const current = stages[currentIdx];
    const next = currentIdx + 1 < stages.length ? stages[currentIdx + 1] : null;
    if (!next) {
      return { current, next: null, progress01: 1.0 };
    }
    const span = Math.max(0.01, next.minRadius - current.minRadius);
    const progress01 = Math.max(0, Math.min(1, (this.radius - current.minRadius) / span));
    return { current, next, progress01 };
  }

  private triggerStageUpEffect(stage: EvolutionStage): void {
    this.pulseScale = 1.36;
    this.shockwaveProgress = 0.01;
    this.shockwaveRing.visible = true;
    this.shockwaveRing.scale.setScalar(1.0);
    this.shockwaveMat.color.setHex(stage.accentHex);
    this.shockwaveMat.opacity = 0.95;

    if (this.isPlayer) {
      this.ringMat.emissive.setHex(stage.accentHex);
      this.ringMat.emissiveIntensity = 0.8 + stage.stage * 0.12;
      this.outerRingMat.emissive.setHex(stage.accentHex);
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

  public showTaunt(emoji: string, duration = 2.0): void {
    if (this.tauntSprite) {
      this.group.remove(this.tauntSprite);
      this.tauntSprite = null;
    }
    this.tauntSprite = PrefabFactory.createTauntSprite(emoji);
    this.tauntSprite.position.set(0, 3.8, 0);
    this.group.add(this.tauntSprite);
    this.tauntTimer = duration;
  }

  public update(dt: number): void {
    if (!this.isAlive) {
      if (this.tauntSprite) {
        this.group.remove(this.tauntSprite);
        this.tauntSprite = null;
      }
      return;
    }

    if (this.tauntTimer > 0) {
      this.tauntTimer -= dt;
      if (this.tauntTimer <= 0 && this.tauntSprite) {
        this.group.remove(this.tauntSprite);
        this.tauntSprite = null;
      }
    }

    // Tick timers
    if (this.turboTimer > 0) this.turboTimer = Math.max(0, this.turboTimer - dt);
    if (this.magnetTimer > 0) this.magnetTimer = Math.max(0, this.magnetTimer - dt);
    if (this.invulnerableTimer > 0) this.invulnerableTimer = Math.max(0, this.invulnerableTimer - dt);

    // Smooth acceleration (weighty, precise steering)
    this.velocity.lerp(this.targetVelocity, Math.min(dt * 7.8, 1.0));
    this.group.position.x += this.velocity.x * dt;
    this.group.position.z += this.velocity.z * dt;

    // Clamp inside arena bounds
    const half = GAME_CONFIG.arenaSize / 2 - this.radius;
    this.group.position.x = Math.max(-half, Math.min(half, this.group.position.x));
    this.group.position.z = Math.max(-half, Math.min(half, this.group.position.z));

    // Rotate vortex particles (faster at higher stages)
    this.particlesGroup.rotation.y += dt * (3.5 + this.currentStage * 0.8);

    // Animate Stage-Up Shockwave Ring
    if (this.shockwaveProgress > 0) {
      this.shockwaveProgress += dt * 1.8;
      if (this.shockwaveProgress >= 1.0) {
        this.shockwaveProgress = 0;
        this.shockwaveRing.visible = false;
      } else {
        const s = 1.0 + this.shockwaveProgress * 1.4;
        this.shockwaveRing.scale.setScalar(s);
        this.shockwaveMat.opacity = Math.max(0, (1.0 - this.shockwaveProgress) * 0.9);
      }
    }

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
    return propRadius <= this.radius * 0.96;
  }

  public canSwallowHole(other: Hole): boolean {
    return this.isAlive && other.isAlive && other.invulnerableTimer <= 0 && this.radius > other.radius * 1.15;
  }

  public reset(x: number, z: number): void {
    this.radius = GAME_CONFIG.baseHoleRadius;
    this.score = 0;
    this.kills = 0;
    this.isAlive = true;
    this.currentStage = 1;
    this.turboTimer = 0;
    this.magnetTimer = 0;
    this.invulnerableTimer = 0;
    this.shockwaveProgress = 0;
    this.shockwaveRing.visible = false;
    this.group.position.set(x, 0, z);
    this.velocity.set(0, 0, 0);
    this.targetVelocity.set(0, 0, 0);
    this.pulseScale = 1.0;
    this.group.visible = true;
    this.updateVisualScale();
  }
}
