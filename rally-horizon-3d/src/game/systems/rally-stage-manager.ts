import * as THREE from 'three';
import { SoundController } from '../../core/audio';
import { PrefabFactory, RALLY_LIVERIES } from '../../render/PrefabFactory';
import { CameraRig } from '../../render/camera-rig';
import { ParticleEffects } from '../../render/effects';
import { RallyCarEntity } from '../entities/rally-car';

export interface StageBiomeSpec {
  id: number;
  name: string;
  surfaceLabel: string;
  roadHex: number;
  shoulderHex: number;
  terrainHex: number;
  dustHex: number;
  gripFactor: number;
  stageLength: number;
  goldTargetSec: number;
}

export const STAGE_BIOMES: StageBiomeSpec[] = [
  {
    id: 0,
    name: 'ALPINE TARMAC PASS',
    surfaceLabel: 'HIGH-GRIP ASPHALT (100% GRIP)',
    roadHex: 0x334155,
    shoulderHex: 0xef4444,
    terrainHex: 0x86efac,
    dustHex: 0xe2e8f0,
    gripFactor: 1.0,
    stageLength: 1200,
    goldTargetSec: 46,
  },
  {
    id: 1,
    name: 'CANYON GRAVEL TRAIL',
    surfaceLabel: 'LOOSE TERRACOTTA GRAVEL (78% GRIP)',
    roadHex: 0xb45309,
    shoulderHex: 0xfacc15,
    terrainHex: 0xfde68a,
    dustHex: 0xfbbf24,
    gripFactor: 0.78,
    stageLength: 1260,
    goldTargetSec: 48,
  },
  {
    id: 2,
    name: 'NORDIC SNOW & MUD CREST',
    surfaceLabel: 'ICY SNOWSTAGE (66% GRIP)',
    roadHex: 0x64748b,
    shoulderHex: 0x38bdf8,
    terrainHex: 0xe0f2fe,
    dustHex: 0xffffff,
    gripFactor: 0.66,
    stageLength: 1320,
    goldTargetSec: 50,
  },
];

export interface RallyStageCallbacks {
  onHudUpdate: () => void;
  onCallout: (text: string, color: string) => void;
  onStageComplete: (rank: number, stageTimeSec: number, goldTargetSec: number, baseCoins: number) => void;
  onNearMissTimeExpired: (progressPct: number) => void;
}

interface RoadSample {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  curvature: number;
}

const GHOST_NAMES = ['LOEB_WRC', 'MCRAE_555', 'SOLBERG_X'];
const _BURST_POS = new THREE.Vector3();

export class RallyStageManager {
  public readonly stageGroup = new THREE.Group();
  public readonly cars: RallyCarEntity[] = [];
  public player: RallyCarEntity | null = null;

  public stageNumber = 1;
  public currentBiome: StageBiomeSpec = STAGE_BIOMES[0];
  public elapsedSec = 0;
  public remainingSec = 52;
  public currentSector = 1;
  public totalSectors = 4;
  public stageFinished = false;
  public reviveUsedThisStage = false;
  public currentCornerCallout = 'FLAT OUT ↑';

  private racingLineMesh: THREE.Mesh | null = null;
  private hudTimer = 0;
  private driftSoundCooldown = 0;
  private readonly sampleCache: RoadSample = {
    x: 0,
    y: 0,
    z: 0,
    yaw: 0,
    pitch: 0,
    curvature: 0,
  };

  constructor(
    private readonly scene: THREE.Scene,
    private readonly cameraRig: CameraRig,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController,
    private readonly callbacks: RallyStageCallbacks
  ) {
    this.scene.add(this.stageGroup);
  }

  public startStage(
    stageNum: number,
    selectedSkinId: number,
    turboLvl: number,
    gripLvl: number,
    suspLvl: number
  ): void {
    this.clearStage();
    this.stageNumber = stageNum;
    this.currentBiome = STAGE_BIOMES[(stageNum - 1) % STAGE_BIOMES.length];
    this.elapsedSec = 0;
    this.remainingSec = this.currentBiome.goldTargetSec + 10;
    this.currentSector = 1;
    this.stageFinished = false;
    this.reviveUsedThisStage = false;

    this.buildStageEnvironment();
    this.spawnRallyCars(selectedSkinId, turboLvl, gripLvl, suspLvl);

    if (this.player) {
      this.sampleRoad(0, 0, this.sampleCache);
      this.player.updateVisuals(
        0.016,
        this.sampleCache.x,
        this.sampleCache.y,
        this.sampleCache.z,
        this.sampleCache.yaw,
        this.sampleCache.pitch,
        0
      );
      this.cameraRig.snapToCar(this.player.pos, this.sampleCache.yaw);
    }

    this.callbacks.onCallout(
      `🏁 STAGE #${stageNum}: ${this.currentBiome.name} — ${this.currentBiome.surfaceLabel}`,
      '#facc15'
    );
    this.callbacks.onHudUpdate();
  }

  private sampleRoad(dist: number, lateralOffset: number, out: RoadSample): void {
    const seed = this.stageNumber * 1.37;
    const z = dist;
    // Multi-frequency winding mountain road curve + crest elevation
    const w1 = Math.sin(dist * 0.018 + seed) * 22.0;
    const w2 = Math.sin(dist * 0.042 + seed * 2.1) * 9.5;
    const centerX = w1 + w2;

    const dx =
      Math.cos(dist * 0.018 + seed) * 22.0 * 0.018 +
      Math.cos(dist * 0.042 + seed * 2.1) * 9.5 * 0.042;
    const ddx =
      -Math.sin(dist * 0.018 + seed) * 22.0 * 0.018 * 0.018 -
      Math.sin(dist * 0.042 + seed * 2.1) * 9.5 * 0.042 * 0.042;

    const elev =
      Math.sin(dist * 0.014 + seed * 0.7) * 3.8 +
      Math.max(0, Math.sin(dist * 0.055)) * 1.65;
    const dy =
      Math.cos(dist * 0.014 + seed * 0.7) * 3.8 * 0.014 +
      (Math.sin(dist * 0.055) > 0 ? Math.cos(dist * 0.055) * 1.65 * 0.055 : 0);

    const yaw = Math.atan2(dx, 1.0);
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);

    out.x = centerX + rightX * lateralOffset;
    out.y = elev;
    out.z = z + rightZ * lateralOffset;
    out.yaw = yaw;
    out.pitch = -Math.atan2(dy, 1.0);
    out.curvature = ddx;
  }

  private buildStageEnvironment(): void {
    const length = this.currentBiome.stageLength;
    const segments = 240;
    const roadWidth = 13.6;

    // 1. Extruded Road Ribbon + Red/White Rally Curbs
    const roadPositions: number[] = [];
    const roadIndices: number[] = [];
    const linePositions: number[] = [];
    const lineIndices: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const d = (i / segments) * (length + 80) - 20;
      this.sampleRoad(d, -roadWidth * 0.5, this.sampleCache);
      const lx = this.sampleCache.x;
      const ly = this.sampleCache.y;
      const lz = this.sampleCache.z;

      this.sampleRoad(d, roadWidth * 0.5, this.sampleCache);
      const rx = this.sampleCache.x;
      const ry = this.sampleCache.y;
      const rz = this.sampleCache.z;

      roadPositions.push(lx, ly + 0.04, lz, rx, ry + 0.04, rz);

      // Co-Driver Ideal Racing Line Ribbon
      this.sampleRoad(d, -0.55, this.sampleCache);
      const alx = this.sampleCache.x;
      const aly = this.sampleCache.y;
      const alz = this.sampleCache.z;
      this.sampleRoad(d, 0.55, this.sampleCache);
      const arx = this.sampleCache.x;
      const ary = this.sampleCache.y;
      const arz = this.sampleCache.z;
      linePositions.push(alx, aly + 0.1, alz, arx, ary + 0.1, arz);

      if (i < segments) {
        const base = i * 2;
        roadIndices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
        lineIndices.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
      }
    }

    const roadGeo = new THREE.BufferGeometry();
    roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadPositions, 3));
    roadGeo.setIndex(roadIndices);
    roadGeo.computeVertexNormals();

    const roadMat = new THREE.MeshStandardMaterial({
      color: this.currentBiome.roadHex,
      roughness: 0.62,
      metalness: 0.06,
      side: THREE.DoubleSide,
    });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.receiveShadow = true;
    this.stageGroup.add(roadMesh);

    // Co-Driver Racing Line (visible when Co-Driver booster active)
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeo.setIndex(lineIndices);
    const lineMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
    });
    this.racingLineMesh = new THREE.Mesh(lineGeo, lineMat);
    this.racingLineMesh.visible = false;
    this.stageGroup.add(this.racingLineMesh);

    // 2. Broad Valley Floor
    const groundGeo = new THREE.PlaneGeometry(520, length + 320);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({
      color: this.currentBiome.terrainHex,
      roughness: 0.72,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.set(0, -5.0, length * 0.5);
    ground.receiveShadow = true;
    this.stageGroup.add(ground);

    // 3. Sector Checkpoint Arches & Finish Gantry
    for (let s = 1; s <= this.totalSectors; s++) {
      const cpDist = (s / this.totalSectors) * length;
      this.sampleRoad(cpDist, 0, this.sampleCache);
      const arch = PrefabFactory.createCheckpointArch(roadWidth + 1.2, s === this.totalSectors);
      arch.position.set(this.sampleCache.x, this.sampleCache.y, this.sampleCache.z);
      arch.rotation.y = this.sampleCache.yaw;
      this.stageGroup.add(arch);
    }

    // 4. Roadside Pine Trees & Rally Chevron Posts
    const postGeo = new THREE.BoxGeometry(0.32, 1.3, 0.32);
    const postMat = new THREE.MeshStandardMaterial({
      color: this.currentBiome.shoulderHex,
      roughness: 0.4,
    });

    for (let d = 15; d < length; d += 22) {
      const side = (Math.floor(d / 22) % 2 === 0 ? 1 : -1);
      this.sampleRoad(d, side * (roadWidth * 0.5 + 0.65), this.sampleCache);
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(this.sampleCache.x, this.sampleCache.y + 0.65, this.sampleCache.z);
      this.stageGroup.add(post);

      this.sampleRoad(d + 8, side * (roadWidth * 0.5 + 5.2), this.sampleCache);
      const tree = PrefabFactory.createPineTree(0.9 + (d % 5) * 0.12);
      tree.position.set(this.sampleCache.x, this.sampleCache.y, this.sampleCache.z);
      this.stageGroup.add(tree);
    }
  }

  private spawnRallyCars(
    selectedSkinId: number,
    turboLvl: number,
    gripLvl: number,
    suspLvl: number
  ): void {
    const playerLivery = RALLY_LIVERIES[selectedSkinId % RALLY_LIVERIES.length];
    this.player = new RallyCarEntity(this.scene, 'player', 'YOU', true, playerLivery);
    this.player.turboMult = 1.0 + (turboLvl - 1) * 0.06;
    this.player.gripMult = 1.0 + (gripLvl - 1) * 0.07;
    this.player.suspensionMult = 1.0 + (suspLvl - 1) * 0.07;
    this.player.resetAtStart(0, 0);
    this.cars.push(this.player);

    // 3 Named Ghost/AI Rivals
    for (let i = 0; i < 3; i++) {
      const livery = RALLY_LIVERIES[(selectedSkinId + i + 1) % RALLY_LIVERIES.length];
      const ghost = new RallyCarEntity(
        this.scene,
        `ghost_${i}`,
        GHOST_NAMES[i],
        false,
        livery
      );
      const laneOffset = (i - 1) * 3.1;
      ghost.resetAtStart(laneOffset, 4 + i * 5);
      ghost.aiBaseSpeed = 25.5 + i * 1.45;
      this.cars.push(ghost);
    }
  }

  public activateBooster(type: 'nitro' | 'grip' | 'codriver'): void {
    if (!this.player) return;
    if (type === 'nitro') {
      this.player.nitroTimer = 8.0;
      this.callbacks.onCallout('🔥 TWIN-TURBO NITRO SURGE ACTIVE (8s)!', '#38bdf8');
    } else if (type === 'grip') {
      this.player.gripBoosterTimer = 12.0;
      this.callbacks.onCallout('🛞 GRAVEL GRIP COMPOUND TIRES ACTIVE (12s)!', '#4ade80');
    } else {
      this.player.coDriverTimer = 15.0;
      this.remainingSec += 8.0;
      if (this.racingLineMesh) {
        this.racingLineMesh.visible = true;
      }
      this.callbacks.onCallout('🧭 CO-DRIVER RACING LINE +8s STAGE CLOCK!', '#facc15');
    }
    _BURST_POS.copy(this.player.pos);
    this.particles.spawnBurst(_BURST_POS, 0xfacc15, 16);
    this.audio.playBoosterActivate();
    this.callbacks.onHudUpdate();
  }

  public reviveStageWithTurbo(): void {
    if (!this.player) return;
    this.reviveUsedThisStage = true;
    this.stageFinished = false;
    this.remainingSec = 16.0;
    this.player.nitroTimer = 8.0;
    this.player.gripBoosterTimer = 8.0;
    this.player.lateralOffset = 0;
    this.audio.playBoosterActivate();
    this.callbacks.onCallout('⚡ +16s CLOCK & TWIN-TURBO SURGE ENGAGED!', '#facc15');
    this.callbacks.onHudUpdate();
  }

  public getPlayerRank(): number {
    if (!this.player) return 1;
    let ahead = 0;
    for (let i = 0; i < this.cars.length; i++) {
      const c = this.cars[i];
      if (c !== this.player && c.trackDistance > this.player.trackDistance) {
        ahead++;
      }
    }
    return ahead + 1;
  }

  public getProgressRatio(): number {
    if (!this.player) return 0;
    return Math.min(1, Math.max(0, this.player.trackDistance / this.currentBiome.stageLength));
  }

  public update(
    dt: number,
    steerInput: number,
    throttleInput: number,
    driftHeld: boolean
  ): void {
    if (this.stageFinished || !this.player) return;

    this.elapsedSec += dt;
    this.remainingSec = Math.max(0, this.remainingSec - dt);
    if (this.driftSoundCooldown > 0) this.driftSoundCooldown -= dt;

    if (this.racingLineMesh) {
      this.racingLineMesh.visible = this.player.coDriverTimer > 0;
    }

    // 1. Update Player Rally Physics
    const p = this.player;
    const surfaceGrip =
      p.gripBoosterTimer > 0 ? 1.15 : this.currentBiome.gripFactor * p.gripMult;
    const maxSpeed =
      32.5 * p.turboMult * (p.nitroTimer > 0 ? 1.38 : 1.0) * (0.86 + surfaceGrip * 0.14);
    const accel = 21.0 * p.turboMult * (p.nitroTimer > 0 ? 1.55 : 1.0);

    if (throttleInput > 0) {
      p.speed = Math.min(maxSpeed, p.speed + accel * dt);
    } else {
      p.speed = Math.max(8.0, p.speed - 24.0 * dt);
    }

    // Sample road ahead for co-driver pace notes & centrifugal push
    this.sampleRoad(p.trackDistance + 24, 0, this.sampleCache);
    const aheadCurv = this.sampleCache.curvature;
    if (aheadCurv > 0.008) {
      this.currentCornerCallout = 'HAIRPIN RIGHT 2 →';
    } else if (aheadCurv < -0.008) {
      this.currentCornerCallout = '← HAIRPIN LEFT 2';
    } else if (aheadCurv > 0.0035) {
      this.currentCornerCallout = 'MEDIUM RIGHT 4 ↗';
    } else if (aheadCurv < -0.0035) {
      this.currentCornerCallout = '↖ MEDIUM LEFT 4';
    } else {
      this.currentCornerCallout = 'CREST FLAT OUT ↑';
    }

    this.sampleRoad(p.trackDistance, p.lateralOffset, this.sampleCache);
    const centrifugalPush = -this.sampleCache.curvature * p.speed * p.speed * 0.42;
    const steerAuthority = (14.5 + surfaceGrip * 4.5) * (driftHeld ? 1.22 : 1.0);
    p.lateralVel += (steerInput * steerAuthority + centrifugalPush) * dt;
    p.lateralVel *= Math.exp(-(driftHeld ? 3.2 : 5.8 * surfaceGrip) * dt);
    p.lateralOffset += p.lateralVel * dt;

    // Soft shoulder banking barrier at +/- 6.2m (prevents getting stuck off-road)
    if (Math.abs(p.lateralOffset) > 6.1) {
      p.lateralOffset = Math.sign(p.lateralOffset) * 6.1;
      p.lateralVel *= -0.35;
      p.speed *= 1 - 0.35 * dt;
    }

    // Drift slip angle calculation + tire smoke/dust particles
    const targetDriftAngle =
      steerInput * (driftHeld ? 0.36 : 0.18) * (p.speed / 28.0);
    p.driftAngleRad += (targetDriftAngle - p.driftAngleRad) * Math.min(1, dt * 8.5);

    if (Math.abs(p.driftAngleRad) > 0.14 && p.speed > 16) {
      this.particles.spawnDriftPuff(
        p.pos.x,
        p.pos.y,
        p.pos.z,
        this.currentBiome.dustHex
      );
      if (this.driftSoundCooldown <= 0) {
        this.driftSoundCooldown = 0.24;
        this.audio.playDriftScreech();
      }
    }

    p.trackDistance += p.speed * dt;
    this.sampleRoad(p.trackDistance, p.lateralOffset, this.sampleCache);
    p.updateVisuals(
      dt,
      this.sampleCache.x,
      this.sampleCache.y,
      this.sampleCache.z,
      this.sampleCache.yaw,
      this.sampleCache.pitch,
      steerInput
    );

    // Check sector checkpoint crossings
    const sectorLen = this.currentBiome.stageLength / this.totalSectors;
    const reachedSector = Math.floor(p.trackDistance / sectorLen) + 1;
    if (reachedSector > this.currentSector && this.currentSector <= this.totalSectors) {
      this.currentSector = reachedSector;
      this.remainingSec += 4.5;
      _BURST_POS.copy(p.pos);
      this.particles.spawnBurst(_BURST_POS, 0x38bdf8, 18);
      this.audio.playCheckpointChime(this.currentSector);
      this.callbacks.onCallout(
        `⏱️ SECTOR ${this.currentSector - 1} CLEARED! (+4.5s BONUS TIME)`,
        '#4ade80'
      );
    }

    // 2. Update AI Ghost Rivals
    for (let i = 1; i < this.cars.length; i++) {
      const g = this.cars[i];
      g.aiLaneTimer -= dt;
      if (g.aiLaneTimer <= 0) {
        g.aiLaneTimer = 1.5 + Math.random() * 1.5;
        g.aiTargetLateral = (Math.random() - 0.5) * 7.5;
      }
      // Subtle rubber-banding so rivals stay competitive near the player
      const distGap = p.trackDistance - g.trackDistance;
      const rubberMult = distGap > 35 ? 1.16 : distGap < -35 ? 0.88 : 1.0;
      g.speed = g.aiBaseSpeed * rubberMult;
      g.trackDistance += g.speed * dt;
      g.lateralOffset += (g.aiTargetLateral - g.lateralOffset) * Math.min(1, dt * 2.5);

      this.sampleRoad(g.trackDistance, g.lateralOffset, this.sampleCache);
      g.updateVisuals(
        dt,
        this.sampleCache.x,
        this.sampleCache.y,
        this.sampleCache.z,
        this.sampleCache.yaw,
        this.sampleCache.pitch,
        0
      );
    }

    // 3. Check Stage Finish or Time Expiry
    if (p.trackDistance >= this.currentBiome.stageLength) {
      this.stageFinished = true;
      const rank = this.getPlayerRank();
      const baseCoins = 125 + this.stageNumber * 30 + (rank === 1 ? 60 : 20);
      _BURST_POS.copy(p.pos);
      this.particles.spawnBurst(_BURST_POS, 0xfacc15, 28);
      this.audio.playVictory();
      this.callbacks.onStageComplete(
        rank,
        this.elapsedSec,
        this.currentBiome.goldTargetSec,
        baseCoins
      );
      return;
    }

    if (this.remainingSec <= 0) {
      this.stageFinished = true;
      this.audio.playTimeWarning();
      const pct = Math.round(this.getProgressRatio() * 100);
      this.callbacks.onNearMissTimeExpired(pct);
      return;
    }

    this.hudTimer += dt;
    if (this.hudTimer >= 0.12) {
      this.hudTimer = 0;
      this.callbacks.onHudUpdate();
    }
  }

  private clearStage(): void {
    for (let i = 0; i < this.cars.length; i++) {
      this.cars[i].dispose(this.scene);
    }
    this.cars.length = 0;
    this.player = null;

    while (this.stageGroup.children.length > 0) {
      this.stageGroup.remove(this.stageGroup.children[0]);
    }
  }
}
