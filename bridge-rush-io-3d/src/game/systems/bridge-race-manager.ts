import * as THREE from 'three';
import { SoundController } from '../../core/audio';
import { BUILDER_SKINS, PrefabFactory } from '../../render/PrefabFactory';
import { CameraRig } from '../../render/camera-rig';
import { ParticleEffects } from '../../render/effects';
import { VisualEnhancer } from '../../render/visual-enhancer';
import { BuilderRunnerEntity } from '../entities/builder-runner';

export interface BridgeRaceCallbacks {
  onHudUpdate: () => void;
  onCallout: (text: string, color: string) => void;
  onMatchVictory: (rank: number, baseCoins: number, stepsBuilt: number) => void;
  onRivalNearFinish: (rivalName: string) => void;
}

interface FloorBrickSlot {
  mesh: THREE.Mesh;
  x: number;
  y: number;
  z: number;
  tier: number; // 1, 2, or 3
  teamId: number; // 0..3 or -1 for Neutral Gray scatter brick
  colorHex: number;
  active: boolean;
  respawnTimer: number;
}

interface BridgeStepSlot {
  mesh: THREE.Mesh;
  ownerTeamId: number; // -1 = unbuilt, 0..3 = built by team
}

interface BridgeStructure {
  id: number;
  fromTier: number; // 1 -> 2, 2 -> 3, 3 -> 4 (Podium)
  x: number;
  startZ: number;
  endZ: number;
  startY: number;
  endY: number;
  width: number;
  steps: BridgeStepSlot[];
}

const TEAM_COLORS = [0x2563eb, 0xef4444, 0x10b981, 0xf59e0b];
const NEUTRAL_COLOR = 0x94a3b8;
const BOT_NAMES = [
  'BRICK_KING',
  'MASON_X',
  'STAIR_PRO',
  'TURBO_BOB',
  'ARCH_QUEEN',
  'STACK_GOD',
  'BLITZ_JOE',
  'VORTEX_99',
  'TITAN_REX',
  'NEO_CRAFT',
  'SKY_DASH',
];

const _BURST_POS = new THREE.Vector3();

export class BridgeRaceManager {
  public readonly courseGroup = new THREE.Group();
  public readonly runners: BuilderRunnerEntity[] = [];
  public player: BuilderRunnerEntity | null = null;

  public levelNumber = 1;
  public matchEnded = false;
  public reviveUsedThisMatch = false;

  private readonly floorBricks: FloorBrickSlot[] = [];
  private readonly bridges: BridgeStructure[] = [];
  private trophyPodium: THREE.Group | null = null;
  private buildTickAccumulator = 0;
  private hudSyncTimer = 0;
  private pendingEndTimer = 0;
  private pendingWinner: BuilderRunnerEntity | null = null;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly cameraRig: CameraRig,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController,
    private readonly callbacks: BridgeRaceCallbacks
  ) {
    this.scene.add(this.courseGroup);
  }

  public startRace(
    levelNum: number,
    selectedSkinId: number,
    speedLvl: number,
    magnetLvl: number,
    buildSpeedLvl: number
  ): void {
    this.clearRace();
    this.levelNumber = levelNum;
    this.matchEnded = false;
    this.reviveUsedThisMatch = false;
    this.pendingWinner = null;
    this.pendingEndTimer = 0;

    const skinSpec = BUILDER_SKINS[selectedSkinId % BUILDER_SKINS.length];
    TEAM_COLORS[0] = skinSpec.teamColorHex;

    this.buildThreeTierIslandsAndBridges();
    this.spawnRunners(selectedSkinId, speedLvl, magnetLvl, buildSpeedLvl);
    this.initFloorBrickPool();

    this.callbacks.onCallout(
      `ISLAND RACE #${levelNum}: COLLECT BRICKS & BUILD BRIDGES TO THE TROPHY!`,
      '#facc15'
    );
    this.callbacks.onHudUpdate();
  }

  private buildThreeTierIslandsAndBridges(): void {
    const gridTex = VisualEnhancer.createMicroTexture('grid');
    if (gridTex) {
      gridTex.repeat.set(8, 8);
    }

    // Tier 1 Island (z: -12 to +14, y: 0, width: 28)
    this.addIslandDeck(0, 0, 1, 28, 26, 0xfcf8ee, 0x38bdf8, gridTex);

    // Tier 2 Island (z: 28 to 50, y: 2.8, width: 24)
    this.addIslandDeck(0, 2.8, 39, 24, 22, 0xf0f9ff, 0x8b5cf6, gridTex);

    // Tier 3 Island (z: 64 to 84, y: 5.6, width: 20)
    this.addIslandDeck(0, 5.6, 74, 20, 20, 0xfef3c7, 0xf59e0b, gridTex);

    // Final Trophy Podium Platform (z: 98 to 108, y: 8.6, width: 12)
    this.addIslandDeck(0, 8.6, 103, 12, 10, 0xfef08a, 0xeab308, gridTex);

    this.trophyPodium = PrefabFactory.createGoldenTrophyPodium();
    this.trophyPodium.position.set(0, 8.6, 103.5);
    this.courseGroup.add(this.trophyPodium);

    // 4 Bridges from Tier 1 (z: 14, y: 0) -> Tier 2 (z: 28, y: 2.8)
    const tier1BridgeXs = [-8.4, -2.8, 2.8, 8.4];
    for (let i = 0; i < tier1BridgeXs.length; i++) {
      this.createBridge(this.bridges.length, 1, tier1BridgeXs[i], 14, 28, 0, 2.8, 14, 2.5);
    }

    // 2 Bridges from Tier 2 (z: 50, y: 2.8) -> Tier 3 (z: 64, y: 5.6)
    const tier2BridgeXs = [-4.5, 4.5];
    for (let i = 0; i < tier2BridgeXs.length; i++) {
      this.createBridge(this.bridges.length, 2, tier2BridgeXs[i], 50, 64, 2.8, 5.6, 15, 2.7);
    }

    // 1 Grand Final Bridge from Tier 3 (z: 84, y: 5.6) -> Trophy Podium (z: 98, y: 8.6)
    this.createBridge(this.bridges.length, 3, 0, 84, 98, 5.6, 8.6, 16, 3.2);
  }

  private addIslandDeck(
    cx: number,
    topY: number,
    cz: number,
    width: number,
    depth: number,
    colorHex: number,
    borderHex: number,
    gridTex: THREE.CanvasTexture | null
  ): void {
    const geo = VisualEnhancer.createBeveledBox(width, 1.0, depth, 0.16, 2);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      map: gridTex,
      roughness: 0.48,
      metalness: 0.05,
    });
    const deck = new THREE.Mesh(geo, mat);
    deck.position.set(cx, topY - 0.5, cz);
    deck.receiveShadow = true;
    this.courseGroup.add(deck);

    const railGeo = new THREE.BoxGeometry(0.35, 0.3, depth);
    const railMat = new THREE.MeshStandardMaterial({ color: borderHex, roughness: 0.4 });
    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(cx - width * 0.5, topY + 0.15, cz);
    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(cx + width * 0.5, topY + 0.15, cz);
    this.courseGroup.add(leftRail, rightRail);
  }

  private createBridge(
    id: number,
    fromTier: number,
    x: number,
    startZ: number,
    endZ: number,
    startY: number,
    endY: number,
    stepCount: number,
    width: number
  ): void {
    const steps: BridgeStepSlot[] = [];
    for (let i = 0; i < stepCount; i++) {
      const t = (i + 0.5) / stepCount;
      const sz = THREE.MathUtils.lerp(startZ, endZ, t);
      const sy = THREE.MathUtils.lerp(startY, endY, t);
      const mesh = PrefabFactory.createBridgeStepMesh(width);
      mesh.position.set(x, sy - 0.08, sz);
      this.courseGroup.add(mesh);
      steps.push({
        mesh,
        ownerTeamId: -1,
      });
    }

    // Side handrails along bridge
    const length = Math.hypot(endZ - startZ, endY - startY);
    const pitch = Math.atan2(endY - startY, endZ - startZ);
    const railGeo = new THREE.BoxGeometry(0.16, 0.35, length);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.45 });
    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(x - width * 0.5 - 0.1, (startY + endY) * 0.5 + 0.15, (startZ + endZ) * 0.5);
    leftRail.rotation.x = -pitch;
    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(x + width * 0.5 + 0.1, (startY + endY) * 0.5 + 0.15, (startZ + endZ) * 0.5);
    rightRail.rotation.x = -pitch;
    this.courseGroup.add(leftRail, rightRail);

    this.bridges.push({
      id,
      fromTier,
      x,
      startZ,
      endZ,
      startY,
      endY,
      width,
      steps,
    });
  }

  private spawnRunners(
    selectedSkinId: number,
    speedLvl: number,
    magnetLvl: number,
    buildSpeedLvl: number
  ): void {
    const skinSpec = BUILDER_SKINS[selectedSkinId % BUILDER_SKINS.length];

    // 12 Competitors (Player + 11 AI bots distributed across 4 teams)
    for (let i = 0; i < 12; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const sx = (col - 1.5) * 4.2;
      const sz = -8.5 + row * 2.4;

      if (i === 0) {
        this.player = new BuilderRunnerEntity(
          this.scene,
          'player',
          'YOU',
          true,
          0,
          skinSpec.teamColorHex,
          skinSpec.accentHex,
          sx,
          sz
        );
        this.player.speedUpgradeMult = 1.0 + (speedLvl - 1) * 0.05;
        this.player.magnetBonusRadius = (magnetLvl - 1) * 0.45;
        this.player.buildSpeedMult = 1.0 + (buildSpeedLvl - 1) * 0.08;
        this.player.setBrickCount(4); // Start with 4 bricks for instant tactile feedback!
        this.runners.push(this.player);
      } else {
        const teamId = i % 4;
        const colorHex = TEAM_COLORS[teamId];
        const botName = BOT_NAMES[(i - 1) % BOT_NAMES.length];
        const bot = new BuilderRunnerEntity(
          this.scene,
          `bot_${i}`,
          botName,
          false,
          teamId,
          colorHex,
          0xffffff,
          sx,
          sz
        );
        bot.aiAssignedBridgeIndex = i % 4;
        bot.aiTargetThreshold = 7 + (i % 6);
        this.runners.push(bot);
      }
    }
  }

  private initFloorBrickPool(): void {
    // Tier 1: 44 bricks, Tier 2: 32 bricks, Tier 3: 24 bricks (100 total pre-allocated)
    const tierCounts = [
      { tier: 1, count: 44 },
      { tier: 2, count: 32 },
      { tier: 3, count: 24 },
    ];

    for (let tIdx = 0; tIdx < tierCounts.length; tIdx++) {
      const { tier, count } = tierCounts[tIdx];
      for (let i = 0; i < count; i++) {
        const mesh = PrefabFactory.createFloorBrick();
        this.courseGroup.add(mesh);
        const slot: FloorBrickSlot = {
          mesh,
          x: 0,
          y: 0,
          z: 0,
          tier,
          teamId: 0,
          colorHex: TEAM_COLORS[0],
          active: true,
          respawnTimer: 0,
        };
        this.placeBrickOnTier(slot, i);
        this.floorBricks.push(slot);
      }
    }
  }

  private placeBrickOnTier(slot: FloorBrickSlot, seedIndex = -1): void {
    // Guarantee at least 32% of bricks belong to Player Team (teamId = 0)
    const rTeam = seedIndex >= 0 ? seedIndex % 4 : Math.random() < 0.34 ? 0 : Math.floor(Math.random() * 4);
    slot.teamId = rTeam;
    slot.colorHex = TEAM_COLORS[rTeam];
    (slot.mesh.material as THREE.MeshStandardMaterial).color.setHex(slot.colorHex);

    if (slot.tier === 1) {
      slot.x = (Math.random() - 0.5) * 23.0;
      slot.z = -9.0 + Math.random() * 21.0;
      slot.y = 0.09;
    } else if (slot.tier === 2) {
      slot.x = (Math.random() - 0.5) * 19.5;
      slot.z = 30.0 + Math.random() * 18.0;
      slot.y = 2.89;
    } else {
      slot.x = (Math.random() - 0.5) * 16.0;
      slot.z = 66.0 + Math.random() * 16.0;
      slot.y = 5.69;
    }

    slot.mesh.position.set(slot.x, slot.y, slot.z);
    slot.mesh.rotation.y = (Math.random() - 0.5) * 0.6;
    slot.mesh.visible = true;
    slot.active = true;
  }

  private scatterNeutralBricks(origin: THREE.Vector3, tier: number, count: number): void {
    let spawned = 0;
    const toSpawn = Math.min(8, count);
    for (let i = 0; i < this.floorBricks.length && spawned < toSpawn; i++) {
      const slot = this.floorBricks[i];
      if (slot.tier !== tier) continue;
      slot.teamId = -1; // Neutral Gray — anyone can pick up!
      slot.colorHex = NEUTRAL_COLOR;
      (slot.mesh.material as THREE.MeshStandardMaterial).color.setHex(NEUTRAL_COLOR);
      const angle = (spawned / toSpawn) * Math.PI * 2;
      const dist = 1.2 + Math.random() * 1.8;
      slot.x = origin.x + Math.cos(angle) * dist;
      slot.z = origin.z + Math.sin(angle) * dist;
      slot.y = origin.y + 0.09;
      slot.mesh.position.set(slot.x, slot.y, slot.z);
      slot.mesh.visible = true;
      slot.active = true;
      spawned++;
    }
  }

  public activateBooster(type: 'bricks' | 'magnet' | 'shield'): void {
    if (!this.player) return;
    if (type === 'bricks') {
      this.player.setBrickCount(this.player.brickCount + 25);
      this.callbacks.onCallout('🧱 +25 INSTANT BRICKS STACKED!', '#38bdf8');
    } else if (type === 'magnet') {
      this.player.magnetBoardTimer = 12.0;
      this.callbacks.onCallout('🛹 MAGNET HOVERBOARD ACTIVE (12s)!', '#4ade80');
    } else {
      this.player.shieldTimer = 14.0;
      this.callbacks.onCallout('🛡️ UNSTOPPABLE TITAN SHIELD (14s)!', '#facc15');
    }
    _BURST_POS.copy(this.player.pos);
    this.particles.spawnBurst(_BURST_POS, 0xfacc15, 16);
    this.audio.playBoosterActivate();
    this.callbacks.onHudUpdate();
  }

  public reviveAndRewindRivals(): void {
    if (!this.player) return;
    this.reviveUsedThisMatch = true;
    this.matchEnded = false;
    this.pendingWinner = null;
    this.pendingEndTimer = 0;

    // Push back any rival on Tier 3 or the final staircase and grant player +30 bricks + hoverboard
    for (let i = 0; i < this.runners.length; i++) {
      const r = this.runners[i];
      if (!r.isPlayer && r.pos.z > 65) {
        r.pos.z = 68;
        r.pos.y = 5.6;
        r.currentTier = 3;
        r.setBrickCount(2);
        r.stunTimer = 2.0;
      }
    }

    this.player.setBrickCount(this.player.brickCount + 30);
    this.player.magnetBoardTimer = 10.0;
    this.player.shieldTimer = 10.0;
    this.audio.playBoosterActivate();
    this.callbacks.onCallout('⚡ RIVALS FROZEN & +30 BRICKS GRANTED!', '#facc15');
    this.callbacks.onHudUpdate();
  }

  public getPlayerRank(): number {
    if (!this.player) return 1;
    let ahead = 0;
    for (let i = 0; i < this.runners.length; i++) {
      const r = this.runners[i];
      if (r !== this.player && r.pos.z > this.player.pos.z) {
        ahead++;
      }
    }
    return ahead + 1;
  }

  public update(dt: number, steerX: number, steerZ: number): void {
    if (this.trophyPodium) {
      this.trophyPodium.rotation.y += dt * 1.8;
    }

    if (this.player && !this.matchEnded) {
      this.player.steerX = steerX;
      this.player.steerZ = steerZ;
    }

    this.buildTickAccumulator += dt;
    const canBuildStep = this.buildTickAccumulator >= 0.055;
    if (canBuildStep) {
      this.buildTickAccumulator = 0;
    }

    // 1. Update Floor Brick Respawns & Magnetic Pull
    for (let i = 0; i < this.floorBricks.length; i++) {
      const b = this.floorBricks[i];
      if (!b.active) {
        b.respawnTimer -= dt;
        if (b.respawnTimer <= 0) {
          this.placeBrickOnTier(b);
        }
      }
    }

    // 2. Step all Runners & AI
    for (let i = 0; i < this.runners.length; i++) {
      const r = this.runners[i];
      if (!r.isPlayer && !this.matchEnded) {
        this.updateBotAI(r, dt);
      }
      r.update(dt);
      this.constrainRunnerToCourseAndBridges(r, canBuildStep);
      this.collectMatchingBricks(r, dt);

      // Check if reached the Golden Trophy Podium at z >= 98.2
      if (!this.matchEnded && r.pos.z >= 98.2) {
        this.matchEnded = true;
        this.pendingWinner = r;
        this.pendingEndTimer = 0.65;
        _BURST_POS.copy(r.pos);
        this.particles.spawnBurst(_BURST_POS, 0xfacc15, 24);
        if (r.isPlayer) {
          this.audio.playVictory();
          this.callbacks.onCallout('🏆 CHAMPION! GOLDEN TROPHY CLAIMED!', '#4ade80');
        } else {
          this.audio.playDefeat();
          this.callbacks.onCallout(`⚠️ ${r.name} REACHED THE PODIUM!`, '#ef4444');
        }
      }
    }

    // 3. Pairwise Runner Tackle & Brick-Stealing Collisions
    for (let i = 0; i < this.runners.length; i++) {
      const a = this.runners[i];
      if (a.stunTimer > 0) continue;
      for (let j = i + 1; j < this.runners.length; j++) {
        const b = this.runners[j];
        if (b.stunTimer > 0) continue;
        if (Math.abs(a.pos.y - b.pos.y) > 0.9) continue;

        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz);
        if (d < 0.88 && d > 0.001) {
          const nx = dx / d;
          const nz = dz / d;

          const aEffective = a.shieldTimer > 0 ? 999 : a.brickCount;
          const bEffective = b.shieldTimer > 0 ? 999 : b.brickCount;

          if (aEffective > bEffective && b.brickCount > 0) {
            const dropped = b.applyTackleKnockdown(nx, nz);
            this.scatterNeutralBricks(b.pos, b.currentTier, dropped);
            if (a.isPlayer || b.isPlayer) {
              _BURST_POS.copy(b.pos);
              this.particles.spawnBurst(_BURST_POS, 0xfacc15, 14);
              this.audio.playTackleSmash(a.isPlayer);
              this.cameraRig.addTrauma(0.32);
              if (a.isPlayer) {
                this.callbacks.onCallout(`💥 TACKLED ${b.name}! (+${dropped} BRICKS)`, '#facc15');
              }
            }
          } else if (bEffective > aEffective && a.brickCount > 0) {
            const dropped = a.applyTackleKnockdown(-nx, -nz);
            this.scatterNeutralBricks(a.pos, a.currentTier, dropped);
            if (a.isPlayer || b.isPlayer) {
              _BURST_POS.copy(a.pos);
              this.particles.spawnBurst(_BURST_POS, 0xef4444, 14);
              this.audio.playTackleSmash(b.isPlayer);
              this.cameraRig.addTrauma(0.32);
              if (b.isPlayer) {
                this.callbacks.onCallout(`💥 TACKLED ${a.name}! (+${dropped} BRICKS)`, '#facc15');
              }
            }
          } else {
            // Equal brick counts: gentle separation
            const overlap = (0.88 - d) * 0.5;
            a.pos.x -= nx * overlap;
            a.pos.z -= nz * overlap;
            b.pos.x += nx * overlap;
            b.pos.z += nz * overlap;
          }
        }
      }
    }

    // 4. Handle Pending Match Completion
    if (this.matchEnded && this.pendingWinner !== null) {
      this.pendingEndTimer -= dt;
      if (this.pendingEndTimer <= 0) {
        const winner = this.pendingWinner;
        this.pendingWinner = null;
        if (winner.isPlayer) {
          const baseCoins = 110 + this.levelNumber * 25 + this.player!.totalStepsBuilt * 2;
          this.callbacks.onMatchVictory(1, baseCoins, this.player!.totalStepsBuilt);
        } else {
          this.callbacks.onRivalNearFinish(winner.name);
        }
      }
    }

    this.hudSyncTimer += dt;
    if (this.hudSyncTimer >= 0.18) {
      this.hudSyncTimer = 0;
      this.callbacks.onHudUpdate();
    }
  }

  private collectMatchingBricks(r: BuilderRunnerEntity, dt: number): void {
    if (r.stunTimer > 0) return;
    const pickupRadius =
      0.95 + r.magnetBonusRadius + (r.magnetBoardTimer > 0 ? 4.2 : 0);

    for (let i = 0; i < this.floorBricks.length; i++) {
      const b = this.floorBricks[i];
      if (!b.active || b.tier !== r.currentTier) continue;
      if (b.teamId !== r.teamId && b.teamId !== -1) continue;

      const dx = r.pos.x - b.x;
      const dz = r.pos.z - b.z;
      const d = Math.hypot(dx, dz);

      if (d < pickupRadius) {
        if (d > 1.05 && r.magnetBoardTimer > 0) {
          // Smooth magnetic vacuum slide toward runner
          b.x += (dx / d) * 16.0 * dt;
          b.z += (dz / d) * 16.0 * dt;
          b.mesh.position.set(b.x, b.y, b.z);
          continue;
        }
        b.active = false;
        b.mesh.visible = false;
        b.respawnTimer = 1.2 + Math.random() * 0.8;
        r.setBrickCount(r.brickCount + 1);
        if (r.isPlayer) {
          this.audio.playBrickPickup(r.brickCount);
        }
      }
    }
  }

  private constrainRunnerToCourseAndBridges(
    r: BuilderRunnerEntity,
    canBuildStep: boolean
  ): void {
    // Check if runner is on any Bridge
    for (let i = 0; i < this.bridges.length; i++) {
      const br = this.bridges[i];
      if (
        r.pos.z >= br.startZ - 0.5 &&
        r.pos.z <= br.endZ + 0.5 &&
        Math.abs(r.pos.x - br.x) <= br.width * 0.58
      ) {
        r.pos.x = THREE.MathUtils.clamp(
          r.pos.x,
          br.x - br.width * 0.42,
          br.x + br.width * 0.42
        );

        // Determine highest passable step index for this runner
        let maxPassableStep = br.steps.length - 1;
        for (let sIdx = 0; sIdx < br.steps.length; sIdx++) {
          const step = br.steps[sIdx];
          if (step.ownerTeamId !== r.teamId) {
            // Runner needs to build or paint this step using 1 brick!
            const stepZ = THREE.MathUtils.lerp(
              br.startZ,
              br.endZ,
              (sIdx + 0.5) / br.steps.length
            );
            if (r.pos.z >= stepZ - 0.65 && r.brickCount > 0 && canBuildStep) {
              step.ownerTeamId = r.teamId;
              (step.mesh.material as THREE.MeshStandardMaterial).color.setHex(r.colorHex);
              r.setBrickCount(r.brickCount - 1);
              r.totalStepsBuilt++;
              if (r.isPlayer) {
                this.audio.playBridgeStepPlace(sIdx);
              }
            }
            if (step.ownerTeamId !== r.teamId) {
              maxPassableStep = sIdx - 1;
              break;
            }
          }
        }

        const maxAllowedZ =
          maxPassableStep < 0
            ? br.startZ + 0.2
            : THREE.MathUtils.lerp(
                br.startZ,
                br.endZ,
                (maxPassableStep + 1) / br.steps.length
              );

        if (r.pos.z > maxAllowedZ) {
          r.pos.z = maxAllowedZ;
          if (!r.isPlayer && r.brickCount <= 0) {
            r.aiMode = 'gather';
          }
        }

        const progress = THREE.MathUtils.clamp(
          (r.pos.z - br.startZ) / (br.endZ - br.startZ),
          0,
          1
        );
        r.pos.y = THREE.MathUtils.lerp(br.startY, br.endY, progress);

        if (progress >= 0.96) {
          r.currentTier = Math.min(3, br.fromTier + 1);
        } else if (progress <= 0.05) {
          r.currentTier = br.fromTier;
        }
        return;
      }
    }

    // Constrain to current Island Tier bounds
    if (r.pos.z < 14.5) {
      r.currentTier = 1;
      r.pos.y = 0;
      r.pos.x = THREE.MathUtils.clamp(r.pos.x, -13.2, 13.2);
      r.pos.z = THREE.MathUtils.clamp(r.pos.z, -11.2, 14.0);
    } else if (r.pos.z >= 27.5 && r.pos.z < 50.5) {
      r.currentTier = 2;
      r.pos.y = 2.8;
      r.pos.x = THREE.MathUtils.clamp(r.pos.x, -11.2, 11.2);
      r.pos.z = THREE.MathUtils.clamp(r.pos.z, 28.0, 50.0);
    } else if (r.pos.z >= 63.5 && r.pos.z < 84.5) {
      r.currentTier = 3;
      r.pos.y = 5.6;
      r.pos.x = THREE.MathUtils.clamp(r.pos.x, -9.2, 9.2);
      r.pos.z = THREE.MathUtils.clamp(r.pos.z, 64.0, 84.0);
    } else if (r.pos.z >= 97.5) {
      r.pos.y = 8.6;
      r.pos.x = THREE.MathUtils.clamp(r.pos.x, -5.2, 5.2);
      r.pos.z = THREE.MathUtils.clamp(r.pos.z, 98.0, 106.0);
    }
  }

  private updateBotAI(bot: BuilderRunnerEntity, dt: number): void {
    bot.aiDecisionTimer -= dt;

    if (bot.brickCount >= bot.aiTargetThreshold) {
      bot.aiMode = 'build';
    } else if (bot.brickCount === 0) {
      bot.aiMode = 'gather';
      bot.aiTargetThreshold = 6 + Math.floor(Math.random() * 7);
    }

    if (bot.aiMode === 'build') {
      // Find bridge starting from bot's current tier
      let targetBridge: BridgeStructure | null = null;
      for (let i = 0; i < this.bridges.length; i++) {
        const br = this.bridges[i];
        if (br.fromTier === bot.currentTier) {
          targetBridge = br;
          if ((i + bot.aiAssignedBridgeIndex) % 2 === 0) break;
        }
      }

      if (targetBridge) {
        const onBridge = Math.abs(bot.pos.x - targetBridge.x) < targetBridge.width * 0.45 &&
          bot.pos.z >= targetBridge.startZ - 0.6;
        const tx = targetBridge.x;
        const tz = onBridge ? targetBridge.endZ + 1.5 : targetBridge.startZ + 0.3;
        const dx = tx - bot.pos.x;
        const dz = tz - bot.pos.z;
        const len = Math.hypot(dx, dz);
        if (len > 0.05) {
          bot.steerX = dx / len;
          bot.steerZ = dz / len;
        }
        return;
      }
    }

    // Gather mode: steer toward nearest active brick of matching color or neutral on current tier
    if (bot.aiDecisionTimer <= 0) {
      bot.aiDecisionTimer = 0.28 + Math.random() * 0.2;
      let bestDist = 999;
      let found = false;
      for (let i = 0; i < this.floorBricks.length; i++) {
        const b = this.floorBricks[i];
        if (!b.active || b.tier !== bot.currentTier) continue;
        if (b.teamId !== bot.teamId && b.teamId !== -1) continue;
        const d = Math.hypot(b.x - bot.pos.x, b.z - bot.pos.z);
        if (d < bestDist) {
          bestDist = d;
          bot.aiTargetX = b.x;
          bot.aiTargetZ = b.z;
          found = true;
        }
      }
      if (!found) {
        bot.aiTargetX = (Math.random() - 0.5) * 14;
        bot.aiTargetZ = bot.currentTier === 1 ? 2 : bot.currentTier === 2 ? 39 : 74;
      }
    }

    const dx = bot.aiTargetX - bot.pos.x;
    const dz = bot.aiTargetZ - bot.pos.z;
    const len = Math.hypot(dx, dz);
    if (len > 0.1) {
      bot.steerX = dx / len;
      bot.steerZ = dz / len;
    }
  }

  private clearRace(): void {
    for (let i = 0; i < this.runners.length; i++) {
      this.runners[i].dispose(this.scene);
    }
    this.runners.length = 0;
    this.player = null;

    while (this.courseGroup.children.length > 0) {
      this.courseGroup.remove(this.courseGroup.children[0]);
    }
    this.floorBricks.length = 0;
    this.bridges.length = 0;
    this.trophyPodium = null;
  }
}
