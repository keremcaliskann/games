import * as THREE from 'three';
import { SoundController } from '../../core/audio';
import { CRAWLER_LIVERIES, PrefabFactory } from '../../render/PrefabFactory';
import { CameraRig } from '../../render/camera-rig';
import { ParticleEffects } from '../../render/effects';
import { CrawlerTruckEntity } from '../entities/crawler-truck';

export interface ExpeditionBiomeSpec {
  id: number;
  name: string;
  terrainLabel: string;
  trailHex: number;
  mudHex: number;
  groundHex: number;
  trailLength: number;
  timeLimitSec: number;
}

export const EXPEDITION_BIOMES: ExpeditionBiomeSpec[] = [
  {
    id: 0,
    name: 'PINE MUD CANYON',
    terrainLabel: 'DEEP MUD BOGS & BOULDERS',
    trailHex: 0x78350f,
    mudHex: 0x451a03,
    groundHex: 0x86efac,
    trailLength: 720,
    timeLimitSec: 54,
  },
  {
    id: 1,
    name: 'MOAB RED ROCK RAVINE',
    terrainLabel: 'STEEP SANDSTONE INCLINES',
    trailHex: 0xb45309,
    mudHex: 0x92400e,
    groundHex: 0xfde68a,
    trailLength: 760,
    timeLimitSec: 56,
  },
  {
    id: 2,
    name: 'ALASKA GLACIER LOG TRAIL',
    terrainLabel: 'SNOW SLUSH & TIMBER BRIDGES',
    trailHex: 0x475569,
    mudHex: 0x334155,
    groundHex: 0xe0f2fe,
    trailLength: 800,
    timeLimitSec: 58,
  },
];

export interface ExpeditionCallbacks {
  onHudUpdate: () => void;
  onCallout: (text: string, color: string) => void;
  onExpeditionComplete: (
    rank: number,
    cargoIntegrity: number,
    baseCoins: number
  ) => void;
  onNearMissStalled: (progressPct: number) => void;
}

interface TrailSample {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  inMudBog: boolean;
  frontRoll: number;
  rearRoll: number;
}

const SUPPORT_NAMES = ['ATLAS_4X4', 'KODIAK_PRO'];
const _BURST_POS = new THREE.Vector3();

export class ExpeditionTrailManager {
  public readonly trailGroup = new THREE.Group();
  public readonly trucks: CrawlerTruckEntity[] = [];
  public readonly winchAnchors: THREE.Vector3[] = [];
  public player: CrawlerTruckEntity | null = null;

  public trailNumber = 1;
  public currentBiome: ExpeditionBiomeSpec = EXPEDITION_BIOMES[0];
  public remainingSec = 54;
  public currentCampSector = 1;
  public totalSectors = 3;
  public expeditionEnded = false;
  public isWinchPulling = false;
  public terrainStatusLabel = 'TRAIL CLEAR // 4WD HIGH';

  private hudTimer = 0;
  private mudSoundCooldown = 0;
  private readonly sampleCache: TrailSample = {
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    inMudBog: false,
    frontRoll: 0,
    rearRoll: 0,
  };

  constructor(
    private readonly scene: THREE.Scene,
    private readonly cameraRig: CameraRig,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController,
    private readonly callbacks: ExpeditionCallbacks
  ) {
    this.scene.add(this.trailGroup);
  }

  public startExpedition(
    trailNum: number,
    selectedSkinId: number,
    axleLvl: number,
    winchLvl: number,
    mudTireLvl: number
  ): void {
    this.clearExpedition();
    this.trailNumber = trailNum;
    this.currentBiome = EXPEDITION_BIOMES[(trailNum - 1) % EXPEDITION_BIOMES.length];
    this.remainingSec = this.currentBiome.timeLimitSec;
    this.currentCampSector = 1;
    this.expeditionEnded = false;
    this.isWinchPulling = false;

    this.buildTrailEnvironment();
    this.spawnCrawlerTrucks(selectedSkinId, axleLvl, winchLvl, mudTireLvl);

    if (this.player) {
      this.sampleTrail(0, 0, this.sampleCache);
      this.player.updateVisuals(
        0.016,
        this.sampleCache.x,
        this.sampleCache.y,
        this.sampleCache.z,
        this.sampleCache.yaw,
        this.sampleCache.pitch,
        0,
        0
      );
      this.cameraRig.snapToTruck(this.player.pos, this.sampleCache.yaw);
    }

    this.callbacks.onCallout(
      `🛻 EXPEDITION #${trailNum}: ${this.currentBiome.name} — DELIVER CARGO TO BASE CAMP!`,
      '#facc15'
    );
    this.callbacks.onHudUpdate();
  }

  private sampleTrail(dist: number, lateralOffset: number, out: TrailSample): void {
    const seed = this.trailNumber * 1.19;
    const centerX =
      Math.sin(dist * 0.022 + seed) * 16.0 + Math.sin(dist * 0.051 + seed * 1.7) * 6.5;
    const dx =
      Math.cos(dist * 0.022 + seed) * 16.0 * 0.022 +
      Math.cos(dist * 0.051 + seed * 1.7) * 6.5 * 0.051;

    // Steep rock climbs + mud bog dips
    const climbWave = Math.sin(dist * 0.026 + seed * 0.5) * 4.5;
    const boulderRumble = Math.sin(dist * 0.35) * 0.22;
    const dy = Math.cos(dist * 0.026 + seed * 0.5) * 4.5 * 0.026;

    const yaw = Math.atan2(dx, 1.0);
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);

    // Periodic Mud Bog zones every ~140m
    const bogPhase = (dist % 140) / 140;
    const inMudBog = bogPhase > 0.38 && bogPhase < 0.62;

    out.x = centerX + rightX * lateralOffset;
    out.y = climbWave + (inMudBog ? -0.25 : boulderRumble);
    out.z = dist + rightZ * lateralOffset;
    out.yaw = yaw;
    out.pitch = -Math.atan2(dy, 1.0);
    out.inMudBog = inMudBog;
    out.frontRoll = Math.sin(dist * 0.42 + lateralOffset) * 0.16;
    out.rearRoll = Math.cos(dist * 0.38 - lateralOffset) * 0.16;
  }

  private buildTrailEnvironment(): void {
    const length = this.currentBiome.trailLength;
    const segments = 180;
    const trailWidth = 12.8;

    const positions: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const d = (i / segments) * (length + 60) - 15;
      this.sampleTrail(d, -trailWidth * 0.5, this.sampleCache);
      const lx = this.sampleCache.x;
      const ly = this.sampleCache.y;
      const lz = this.sampleCache.z;

      this.sampleTrail(d, trailWidth * 0.5, this.sampleCache);
      const rx = this.sampleCache.x;
      const ry = this.sampleCache.y;
      const rz = this.sampleCache.z;

      positions.push(lx, ly + 0.04, lz, rx, ry + 0.04, rz);

      if (i < segments) {
        const base = i * 2;
        indices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    }

    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    trailGeo.setIndex(indices);
    trailGeo.computeVertexNormals();

    const trailMat = new THREE.MeshStandardMaterial({
      color: this.currentBiome.trailHex,
      roughness: 0.72,
      side: THREE.DoubleSide,
    });
    const trailMesh = new THREE.Mesh(trailGeo, trailMat);
    trailMesh.receiveShadow = true;
    this.trailGroup.add(trailMesh);

    // Valley Floor
    const groundGeo = new THREE.PlaneGeometry(460, length + 280);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: this.currentBiome.groundHex,
      roughness: 0.75,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(0, -5.2, length * 0.5);
    ground.receiveShadow = true;
    this.trailGroup.add(ground);

    // Mud Bog Decals, Trailside Boulders & Winch Anchor Trees
    const mudGeo = new THREE.PlaneGeometry(trailWidth * 0.92, 28);
    mudGeo.rotateX(-Math.PI / 2);
    const mudMat = new THREE.MeshStandardMaterial({
      color: this.currentBiome.mudHex,
      roughness: 0.28,
      metalness: 0.15,
    });

    for (let d = 25; d < length; d += 24) {
      const side = Math.floor(d / 24) % 2 === 0 ? 1 : -1;
      this.sampleTrail(d, side * (trailWidth * 0.5 + 1.8), this.sampleCache);

      const tree = PrefabFactory.createWinchAnchorTree();
      tree.position.set(this.sampleCache.x, this.sampleCache.y, this.sampleCache.z);
      this.trailGroup.add(tree);
      this.winchAnchors.push(tree.position.clone());

      // Decorative roadside boulders
      this.sampleTrail(d + 10, -side * (trailWidth * 0.42), this.sampleCache);
      const boulder = PrefabFactory.createBoulder(0.55 + (d % 3) * 0.18);
      boulder.position.set(this.sampleCache.x, this.sampleCache.y + 0.2, this.sampleCache.z);
      this.trailGroup.add(boulder);
    }

    for (let cycle = 0; cycle * 140 + 70 < length; cycle++) {
      const bogDist = cycle * 140 + 70;
      this.sampleTrail(bogDist, 0, this.sampleCache);
      const patch = new THREE.Mesh(mudGeo, mudMat);
      patch.position.set(this.sampleCache.x, this.sampleCache.y + 0.08, this.sampleCache.z);
      patch.rotation.y = this.sampleCache.yaw;
      this.trailGroup.add(patch);
    }

    // Sector Outposts & Final Base Camp Timber Arch
    for (let s = 1; s <= this.totalSectors; s++) {
      const cpDist = (s / this.totalSectors) * length;
      this.sampleTrail(cpDist, 0, this.sampleCache);
      const arch = PrefabFactory.createBaseCampArch(trailWidth + 1.2, s === this.totalSectors);
      arch.position.set(this.sampleCache.x, this.sampleCache.y, this.sampleCache.z);
      arch.rotation.y = this.sampleCache.yaw;
      this.trailGroup.add(arch);
    }
  }

  private spawnCrawlerTrucks(
    selectedSkinId: number,
    axleLvl: number,
    winchLvl: number,
    mudTireLvl: number
  ): void {
    const playerLivery = CRAWLER_LIVERIES[selectedSkinId % CRAWLER_LIVERIES.length];
    this.player = new CrawlerTruckEntity(this.scene, 'player', 'YOU', true, playerLivery);
    this.player.axleLiftMult = 1.0 + (axleLvl - 1) * 0.08;
    this.player.winchPowerMult = 1.0 + (winchLvl - 1) * 0.08;
    this.player.mudTireMult = 1.0 + (mudTireLvl - 1) * 0.08;
    this.player.resetAtStart(0, 0);
    this.trucks.push(this.player);

    for (let i = 0; i < 2; i++) {
      const livery = CRAWLER_LIVERIES[(selectedSkinId + i + 1) % CRAWLER_LIVERIES.length];
      const bot = new CrawlerTruckEntity(
        this.scene,
        `support_${i}`,
        SUPPORT_NAMES[i],
        false,
        livery
      );
      bot.resetAtStart((i === 0 ? -1 : 1) * 3.2, 5 + i * 6);
      bot.aiBaseSpeed = 15.2 + i * 1.4;
      this.trucks.push(bot);
    }
  }

  private findNearestWinchAnchor(truckPos: THREE.Vector3, forwardZ: number): THREE.Vector3 | null {
    let best: THREE.Vector3 | null = null;
    let bestDist = 34.0;
    for (let i = 0; i < this.winchAnchors.length; i++) {
      const a = this.winchAnchors[i];
      if (a.z < forwardZ - 1.5) continue;
      const d = truckPos.distanceTo(a);
      if (d < bestDist) {
        bestDist = d;
        best = a;
      }
    }
    return best;
  }

  public activateBooster(type: 'winch' | 'tires' | 'difflock'): void {
    if (!this.player) return;
    if (type === 'winch') {
      this.player.superWinchTimer = 10.0;
      this.callbacks.onCallout('🪝 HYDRAULIC SUPER-WINCH ACTIVE (10s)!', '#38bdf8');
    } else if (type === 'tires') {
      this.player.mudTireBoosterTimer = 15.0;
      this.callbacks.onCallout('🛞 MUD MONSTER TIRES ENGAGED (15s)!', '#4ade80');
    } else {
      this.player.diffLockTimer = 15.0;
      this.player.cargoIntegrity = 100;
      this.callbacks.onCallout('⚙️ DIFF-LOCK OVERDRIVE + 100% CARGO SECURED!', '#facc15');
    }
    _BURST_POS.copy(this.player.pos);
    this.particles.spawnBurst(_BURST_POS, 0xfacc15, 16);
    this.audio.playBoosterActivate();
    this.callbacks.onHudUpdate();
  }

  public reviveCrawlerWithWinch(): void {
    if (!this.player) return;
    this.expeditionEnded = false;
    this.remainingSec = 18.0;
    this.player.cargoIntegrity = 100;
    this.player.superWinchTimer = 10.0;
    this.player.mudTireBoosterTimer = 10.0;
    this.player.diffLockTimer = 10.0;
    this.player.lateralOffset = 0;
    this.audio.playBoosterActivate();
    this.callbacks.onCallout('⚡ TRUCK RIGHTED + FULL SUPER-WINCH & DIFF-LOCK!', '#facc15');
    this.callbacks.onHudUpdate();
  }

  public getPlayerRank(): number {
    if (!this.player) return 1;
    let ahead = 0;
    for (let i = 0; i < this.trucks.length; i++) {
      const t = this.trucks[i];
      if (t !== this.player && t.trailDistance > this.player.trailDistance) {
        ahead++;
      }
    }
    return ahead + 1;
  }

  public getProgressRatio(): number {
    if (!this.player) return 0;
    return Math.min(1, Math.max(0, this.player.trailDistance / this.currentBiome.trailLength));
  }

  public update(
    dt: number,
    steerInput: number,
    throttleInput: number,
    winchRequested: boolean
  ): void {
    if (this.expeditionEnded || !this.player) return;

    this.remainingSec = Math.max(0, this.remainingSec - dt);
    if (this.mudSoundCooldown > 0) this.mudSoundCooldown -= dt;

    const p = this.player;
    this.sampleTrail(p.trailDistance, p.lateralOffset, this.sampleCache);

    const inMud = this.sampleCache.inMudBog;
    const wantWinch = winchRequested || p.superWinchTimer > 0;
    const anchor = wantWinch
      ? this.findNearestWinchAnchor(p.pos, p.trailDistance)
      : null;
    this.isWinchPulling = Boolean(anchor);
    p.updateWinchVisual(this.isWinchPulling, anchor);

    // Calculate speed with Mud Bog resistance, Slope Incline, and Winch Hoist
    const mudFactor =
      inMud && p.mudTireBoosterTimer <= 0
        ? Math.min(0.95, 0.56 * p.mudTireMult)
        : 1.0;
    const winchBoost = this.isWinchPulling
      ? (p.superWinchTimer > 0 ? 1.55 : 1.28) * p.winchPowerMult
      : 1.0;
    const diffBoost = p.diffLockTimer > 0 ? 1.25 : 1.0;

    if (this.isWinchPulling) {
      this.terrainStatusLabel = '🪝 WINCH CABLE HOISTING // 4WD LOCKED';
    } else if (inMud) {
      this.terrainStatusLabel = '⚠️ DEEP MUD BOG // ENGAGE WINCH OR DIFF-LOCK!';
    } else {
      this.terrainStatusLabel = '⛰️ ROCK TRAIL // 4WD LOW-RANGE';
    }

    const maxSpeed = 20.5 * mudFactor * winchBoost * diffBoost;
    const accel = 15.0 * winchBoost * diffBoost;

    if (throttleInput > 0) {
      p.speed = Math.min(maxSpeed, p.speed + accel * dt);
    } else {
      p.speed = Math.max(4.5, p.speed - 16.0 * dt);
    }

    p.lateralVel += steerInput * 13.5 * dt;
    p.lateralVel *= Math.exp(-5.2 * dt);
    p.lateralOffset = THREE.MathUtils.clamp(p.lateralOffset + p.lateralVel * dt, -5.6, 5.6);

    if (inMud && p.speed > 6) {
      this.particles.spawnMudSpray(
        p.pos.x,
        p.pos.y,
        p.pos.z,
        this.currentBiome.mudHex
      );
      if (this.mudSoundCooldown <= 0) {
        this.mudSoundCooldown = 0.28;
        this.audio.playMudSplash();
      }
    }

    p.trailDistance += p.speed * dt;
    this.sampleTrail(p.trailDistance, p.lateralOffset, this.sampleCache);
    p.updateVisuals(
      dt,
      this.sampleCache.x,
      this.sampleCache.y,
      this.sampleCache.z,
      this.sampleCache.yaw,
      this.sampleCache.pitch,
      this.sampleCache.frontRoll,
      this.sampleCache.rearRoll
    );

    // Outpost sector checkpoints
    const sectorLen = this.currentBiome.trailLength / this.totalSectors;
    const reachedSector = Math.floor(p.trailDistance / sectorLen) + 1;
    if (reachedSector > this.currentCampSector && this.currentCampSector <= this.totalSectors) {
      this.currentCampSector = reachedSector;
      this.remainingSec += 5.0;
      _BURST_POS.copy(p.pos);
      this.particles.spawnBurst(_BURST_POS, 0x22c55e, 18);
      this.audio.playCheckpointCamp();
      this.callbacks.onCallout(
        `⛺ OUTPOST ${this.currentCampSector - 1} REACHED! (+5.0s FUEL TIME)`,
        '#4ade80'
      );
    }

    // Update AI Support Trucks
    for (let i = 1; i < this.trucks.length; i++) {
      const bot = this.trucks[i];
      const gap = p.trailDistance - bot.trailDistance;
      const rubber = gap > 28 ? 1.15 : gap < -28 ? 0.88 : 1.0;
      bot.speed = bot.aiBaseSpeed * rubber;
      bot.trailDistance += bot.speed * dt;
      this.sampleTrail(bot.trailDistance, bot.lateralOffset, this.sampleCache);
      bot.updateVisuals(
        dt,
        this.sampleCache.x,
        this.sampleCache.y,
        this.sampleCache.z,
        this.sampleCache.yaw,
        this.sampleCache.pitch,
        this.sampleCache.frontRoll,
        this.sampleCache.rearRoll
      );
    }

    // Check Base Camp Arrival or Time Expiry
    if (p.trailDistance >= this.currentBiome.trailLength) {
      this.expeditionEnded = true;
      p.updateWinchVisual(false, null);
      const rank = this.getPlayerRank();
      const baseCoins = 130 + this.trailNumber * 30 + (rank === 1 ? 50 : 20);
      _BURST_POS.copy(p.pos);
      this.particles.spawnBurst(_BURST_POS, 0xfacc15, 28);
      this.audio.playVictory();
      this.callbacks.onExpeditionComplete(rank, Math.round(p.cargoIntegrity), baseCoins);
      return;
    }

    if (this.remainingSec <= 0) {
      this.expeditionEnded = true;
      p.updateWinchVisual(false, null);
      this.audio.playStallWarning();
      const pct = Math.round(this.getProgressRatio() * 100);
      this.callbacks.onNearMissStalled(pct);
      return;
    }

    this.hudTimer += dt;
    if (this.hudTimer >= 0.12) {
      this.hudTimer = 0;
      this.callbacks.onHudUpdate();
    }
  }

  private clearExpedition(): void {
    for (let i = 0; i < this.trucks.length; i++) {
      this.trucks[i].dispose(this.scene);
    }
    this.trucks.length = 0;
    this.winchAnchors.length = 0;
    this.player = null;

    while (this.trailGroup.children.length > 0) {
      this.trailGroup.remove(this.trailGroup.children[0]);
    }
  }
}
