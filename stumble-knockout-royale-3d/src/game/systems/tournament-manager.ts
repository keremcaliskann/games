import * as THREE from 'three';
import { RunnerEntity } from '../entities/runner';
import { PrefabFactory } from '../../render/PrefabFactory';
import { VisualEnhancer } from '../../render/visual-enhancer';
import { ParticleEffects } from '../../render/effects';
import { SoundController } from '../../core/audio';
import { CameraRig } from '../../render/camera-rig';

const _BURST_POS = new THREE.Vector3();

const BOT_NAMES = [
  'StumbleKing',
  'BeanDash',
  'CrownHunter',
  'TurboBean',
  'FlipMaster',
  'MegaJump',
  'NeonGuy',
  'Bouncer99',
  'PixelStar',
  'SkyRunner',
  'KnockoutKid',
  'HyperBean',
  'SpinDodger',
  'GoldRusher',
  'HammerBro',
];

interface SweeperHazard {
  group: THREE.Group;
  x: number;
  z: number;
  barRadius: number;
  speedRad: number;
  angleRad: number;
}

interface BumperHazard {
  group: THREE.Group;
  x: number;
  z: number;
  radius: number;
}

interface TrampolineHazard {
  group: THREE.Group;
  x: number;
  z: number;
  radius: number;
}

export interface TournamentCallbacks {
  onHudUpdate: () => void;
  onCallout: (text: string, colorHex?: string) => void;
  onRoundQualified: (roundNum: number, finishRank: number, earnedCoins: number, isFinalCrown: boolean) => void;
  onPlayerEliminated: (roundNum: number, finishRank: number, qualifyLimit: number) => void;
}

export class TournamentManager {
  public roundNumber = 1; // 1 = Qualify (16->8), 2 = Semifinal (8->4), 3 = Crown Final (4->1)
  public totalRunnersInRound = 16;
  public qualifySlots = 8;
  public qualifiedCount = 0;
  public trackHalfWidth = 5.6;
  public finishZ = 78.0;

  public player: RunnerEntity | null = null;
  public readonly runners: RunnerEntity[] = [];

  private readonly courseGroup = new THREE.Group();
  private readonly sweepers: SweeperHazard[] = [];
  private readonly bumpers: BumperHazard[] = [];
  private readonly trampolines: TrampolineHazard[] = [];
  private crownGoalMesh: THREE.Group | null = null;

  private roundEnded = false;
  private endDelayTimer = 0;
  private pendingOutcome: 'qualified' | 'eliminated' | null = null;
  private hudSyncTimer = 0;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController,
    private readonly cameraRig: CameraRig,
    private readonly callbacks: TournamentCallbacks
  ) {
    this.scene.add(this.courseGroup);
    this.buildSeaFloor();
  }

  private buildSeaFloor(): void {
    const seaGeo = new THREE.PlaneGeometry(240, 260);
    seaGeo.rotateX(-Math.PI / 2);
    const seaMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      roughness: 0.45,
      metalness: 0.06,
    });
    const seaMesh = new THREE.Mesh(seaGeo, seaMat);
    seaMesh.position.set(0, -4.6, 55);
    seaMesh.receiveShadow = true;
    this.scene.add(seaMesh);
  }

  public startRound(
    roundNum: number,
    playerSkinId: number,
    speedLvl: number,
    jumpLvl: number,
    stabilityLvl: number
  ): void {
    this.clearCourseAndRunners();
    this.roundNumber = roundNum;
    this.roundEnded = false;
    this.pendingOutcome = null;
    this.endDelayTimer = 0;
    this.qualifiedCount = 0;

    if (roundNum === 1) {
      this.totalRunnersInRound = 16;
      this.qualifySlots = 8;
      this.finishZ = 78.0;
    } else if (roundNum === 2) {
      this.totalRunnersInRound = 8;
      this.qualifySlots = 4;
      this.finishZ = 92.0;
    } else {
      this.totalRunnersInRound = 4;
      this.qualifySlots = 1;
      this.finishZ = 106.0;
    }

    this.buildCourseGeometry(roundNum);

    // Spawn Player + AI Competitors at starting grid
    for (let i = 0; i < this.totalRunnersInRound; i++) {
      const col = i % 4;
      const row = Math.floor(i / 4);
      const sx = (col - 1.5) * 2.2;
      const sz = -row * 2.1;

      if (i === 0) {
        this.player = new RunnerEntity(
          this.scene,
          'player',
          'YOU',
          true,
          playerSkinId,
          sx,
          sz
        );
        this.player.speedUpgradeMult = 1.0 + (speedLvl - 1) * 0.04;
        this.player.jumpUpgradeMult = 1.0 + (jumpLvl - 1) * 0.05;
        this.player.stabilityUpgradeMult = Math.max(0.35, 1.0 - (stabilityLvl - 1) * 0.07);
        this.runners.push(this.player);
      } else {
        const botName = BOT_NAMES[(i - 1) % BOT_NAMES.length];
        const botSkin = (i + roundNum) % 6;
        const bot = new RunnerEntity(
          this.scene,
          `bot_${i}`,
          botName,
          false,
          botSkin,
          sx,
          sz
        );
        bot.aiSkillFactor = 0.92 + ((i * 7) % 10) * 0.018;
        bot.aiTargetLaneX = sx;
        this.runners.push(bot);
      }
    }

    const roundTitles = [
      'ROUND 1/3: WHIRLWIND GAUNTLET (TOP 8 QUALIFY)',
      'ROUND 2/3: ROLLER CANYON (TOP 4 QUALIFY)',
      'ROUND 3/3: CROWN FINALE (#1 WINS CROWN!)',
    ];
    this.callbacks.onCallout(roundTitles[roundNum - 1] || roundTitles[0], '#facc15');
    this.callbacks.onHudUpdate();
  }

  private buildCourseGeometry(roundNum: number): void {
    const gridTex = VisualEnhancer.createMicroTexture('grid');
    if (gridTex) {
      gridTex.repeat.set(4, 24);
    }

    // Main sunlit biscuit-cream sky track
    const length = this.finishZ + 14;
    const deckGeo = VisualEnhancer.createBeveledBox(
      this.trackHalfWidth * 2,
      0.8,
      length,
      0.15,
      2
    );
    const deckMat = new THREE.MeshStandardMaterial({
      color: roundNum === 1 ? 0xfcf8ee : roundNum === 2 ? 0xf0f9ff : 0xfef3c7,
      map: gridTex,
      roughness: 0.48,
      metalness: 0.05,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, -0.4, length * 0.5 - 8);
    deck.receiveShadow = true;
    this.courseGroup.add(deck);

    // Side safety curbs
    const curbGeo = new THREE.BoxGeometry(0.38, 0.32, length);
    const curbMat = new THREE.MeshStandardMaterial({
      color: roundNum === 3 ? 0xf59e0b : 0xec4899,
      roughness: 0.4,
    });
    const leftCurb = new THREE.Mesh(curbGeo, curbMat);
    leftCurb.position.set(-this.trackHalfWidth - 0.15, 0.16, length * 0.5 - 8);
    const rightCurb = new THREE.Mesh(curbGeo, curbMat);
    rightCurb.position.set(this.trackHalfWidth + 0.15, 0.16, length * 0.5 - 8);
    this.courseGroup.add(leftCurb, rightCurb);

    // Finish Arch & Checkered Line
    const finishLineGeo = new THREE.PlaneGeometry(this.trackHalfWidth * 2, 2.2);
    finishLineGeo.rotateX(-Math.PI / 2);
    const finishLineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const finishLine = new THREE.Mesh(finishLineGeo, finishLineMat);
    finishLine.position.set(0, 0.02, this.finishZ);
    this.courseGroup.add(finishLine);

    if (roundNum === 3) {
      this.crownGoalMesh = PrefabFactory.createGoldenCrownGoal();
      this.crownGoalMesh.position.set(0, 0.2, this.finishZ);
      this.courseGroup.add(this.crownGoalMesh);
    }

    // Populate Obstacles along Z
    const sweeperCount = roundNum === 1 ? 4 : roundNum === 2 ? 5 : 6;
    for (let i = 0; i < sweeperCount; i++) {
      const sz = 14 + i * ((this.finishZ - 20) / sweeperCount);
      const speed = (i % 2 === 0 ? 1 : -1) * (2.3 + roundNum * 0.35 + (i % 3) * 0.25);
      const color = i % 2 === 0 ? 0xef4444 : 0x8b5cf6;
      const group = PrefabFactory.createRotatingSweeper(4.8, color);
      group.position.set(0, 0, sz);
      this.courseGroup.add(group);
      this.sweepers.push({
        group,
        x: 0,
        z: sz,
        barRadius: 4.8,
        speedRad: speed,
        angleRad: i * 1.1,
      });
    }

    // Bouncy Bumper Pillars between sweepers
    for (let z = 19; z < this.finishZ - 10; z += 16) {
      const offsets = [-2.6, 2.6];
      for (let j = 0; j < offsets.length; j++) {
        const bx = offsets[j];
        const group = PrefabFactory.createBumperPillar(0xf59e0b);
        group.position.set(bx, 0, z);
        this.courseGroup.add(group);
        this.bumpers.push({
          group,
          x: bx,
          z,
          radius: 0.92,
        });
      }
    }

    // Spring Trampoline Boost Pads
    for (let z = 25; z < this.finishZ - 14; z += 24) {
      const tx = ((z / 24) % 2 === 0 ? -1.8 : 1.8);
      const pad = PrefabFactory.createTrampolinePad();
      pad.position.set(tx, 0, z);
      this.courseGroup.add(pad);
      this.trampolines.push({
        group: pad,
        x: tx,
        z,
        radius: 1.35,
      });
    }
  }

  public activateBooster(type: 'jetpack' | 'giant' | 'speed'): void {
    if (!this.player) return;
    if (type === 'jetpack') {
      this.player.jetpackTimer = 5.5;
      this.callbacks.onCallout('🚀 ROCKET JETPACK ACTIVE!', '#38bdf8');
    } else if (type === 'giant') {
      this.player.giantTimer = 9.0;
      this.callbacks.onCallout('🛡️ GIANT TITAN MODE (IMMUNE)!', '#f472b6');
    } else {
      this.player.speedBootsTimer = 12.0;
      this.callbacks.onCallout('⚡ HYPER DASH BOOTS (+42% SPEED)!', '#facc15');
    }
    _BURST_POS.copy(this.player.pos);
    this.particles.spawnBurst(_BURST_POS, 0xfacc15, 16);
    this.audio.playBoosterActivate();
    this.callbacks.onHudUpdate();
  }

  public getPlayerRank(): number {
    if (!this.player) return 1;
    if (this.player.qualified) return this.player.finishOrder;
    let ahead = this.qualifiedCount;
    for (let i = 0; i < this.runners.length; i++) {
      const r = this.runners[i];
      if (r !== this.player && !r.qualified && r.pos.z > this.player.pos.z) {
        ahead++;
      }
    }
    return ahead + 1;
  }

  public update(dt: number, steerX: number, steerZ: number): void {
    if (this.crownGoalMesh) {
      this.crownGoalMesh.rotation.y += dt * 2.0;
    }

    // Rotate sweeper arms
    for (let i = 0; i < this.sweepers.length; i++) {
      const s = this.sweepers[i];
      s.angleRad += s.speedRad * dt;
      s.group.rotation.y = s.angleRad;
    }

    if (this.player && !this.player.qualified && !this.roundEnded) {
      this.player.steerX = steerX;
      this.player.steerZ = steerZ;
    }

    // Step all runners & AI
    for (let i = 0; i < this.runners.length; i++) {
      const r = this.runners[i];
      if (r.qualified) {
        r.update(dt, this.trackHalfWidth, this.finishZ);
        continue;
      }

      if (!r.isPlayer && !this.roundEnded) {
        this.updateBotAI(r, dt);
      }

      const newlyQualified = r.update(dt, this.trackHalfWidth, this.finishZ);
      if (newlyQualified) {
        this.qualifiedCount++;
        r.finishOrder = this.qualifiedCount;
        _BURST_POS.copy(r.pos);
        this.particles.spawnBurst(_BURST_POS, 0xfacc15, 18);

        if (r.isPlayer) {
          this.audio.playQualifyChime();
          this.callbacks.onCallout(
            this.roundNumber === 3
              ? '👑 TOURNAMENT CHAMPION (#1)!'
              : `🏁 QUALIFIED #${r.finishOrder}/${this.qualifySlots}!`,
            '#4ade80'
          );
          this.roundEnded = true;
          this.pendingOutcome = 'qualified';
          this.endDelayTimer = 0.75;
        } else if (this.qualifiedCount >= this.qualifySlots && !this.roundEnded) {
          // All qualification slots filled before player finished!
          this.roundEnded = true;
          this.pendingOutcome = 'eliminated';
          this.endDelayTimer = 0.65;
        }
        this.callbacks.onHudUpdate();
      }
    }

    // Check Sweeper Bar, Bumper & Trampoline Collisions for active runners
    for (let i = 0; i < this.runners.length; i++) {
      const r = this.runners[i];
      if (r.qualified || r.jetpackTimer > 0) continue;

      // 1. Rotating Sweeper Bars (jumpable if r.pos.y > 0.95)
      if (r.pos.y < 0.92) {
        for (let sIdx = 0; sIdx < this.sweepers.length; sIdx++) {
          const s = this.sweepers[sIdx];
          if (Math.abs(r.pos.z - s.z) > s.barRadius + 0.6) continue;
          // Project runner position onto rotating bar line segment
          const dirX = Math.cos(-s.angleRad);
          const dirZ = Math.sin(-s.angleRad);
          const dx = r.pos.x - s.x;
          const dz = r.pos.z - s.z;
          const proj = Math.max(-s.barRadius, Math.min(s.barRadius, dx * dirX + dz * dirZ));
          const closestX = s.x + dirX * proj;
          const closestZ = s.z + dirZ * proj;
          const dist = Math.hypot(r.pos.x - closestX, r.pos.z - closestZ);

          if (dist < 0.66) {
            const nx = dist > 0.01 ? (r.pos.x - closestX) / dist : 0;
            const nz = dist > 0.01 ? (r.pos.z - closestZ) / dist : -1;
            r.applyKnockback(nx, nz - 0.6, 9.5);
            if (r.isPlayer) {
              _BURST_POS.copy(r.pos);
              this.particles.spawnBurst(_BURST_POS, 0xef4444, 10);
              this.audio.playBumperBonk();
              this.cameraRig.addTrauma(0.35);
            }
          }
        }
      }

      // 2. Bouncy Bumper Pillars
      for (let bIdx = 0; bIdx < this.bumpers.length; bIdx++) {
        const b = this.bumpers[bIdx];
        const dx = r.pos.x - b.x;
        const dz = r.pos.z - b.z;
        const d = Math.hypot(dx, dz);
        if (d < b.radius + 0.42 && d > 0.001) {
          r.applyKnockback(dx / d, dz / d, 11.0);
          if (r.isPlayer) {
            _BURST_POS.copy(r.pos);
            this.particles.spawnBurst(_BURST_POS, 0xfacc15, 10);
            this.audio.playBumperBonk();
            this.cameraRig.addTrauma(0.28);
          }
        }
      }

      // 3. Trampoline Launch Pads
      if (r.pos.y < 0.6) {
        for (let tIdx = 0; tIdx < this.trampolines.length; tIdx++) {
          const pad = this.trampolines[tIdx];
          if (Math.hypot(r.pos.x - pad.x, r.pos.z - pad.z) < pad.radius) {
            r.isGrounded = false;
            r.vel.y = 15.5;
            r.vel.z = 14.5;
            if (r.isPlayer) {
              _BURST_POS.copy(r.pos);
              this.particles.spawnBurst(_BURST_POS, 0x22c55e, 14);
              this.audio.playTrampolineBounce();
            }
          }
        }
      }
    }

    // Gentle body-to-body jostling between runners
    for (let i = 0; i < this.runners.length; i++) {
      const a = this.runners[i];
      if (a.qualified) continue;
      for (let j = i + 1; j < this.runners.length; j++) {
        const b = this.runners[j];
        if (b.qualified) continue;
        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz);
        if (d < 0.84 && d > 0.001 && Math.abs(a.pos.y - b.pos.y) < 1.0) {
          const overlap = (0.84 - d) * 0.5;
          const nx = dx / d;
          const nz = dz / d;
          a.pos.x -= nx * overlap;
          a.pos.z -= nz * overlap;
          b.pos.x += nx * overlap;
          b.pos.z += nz * overlap;
        }
      }
    }

    // Handle pending round completion modal
    if (this.roundEnded && this.pendingOutcome !== null) {
      this.endDelayTimer -= dt;
      if (this.endDelayTimer <= 0) {
        const outcome = this.pendingOutcome;
        this.pendingOutcome = null;
        const rank = this.getPlayerRank();
        if (outcome === 'qualified') {
          const coins = this.roundNumber === 3 ? 180 : 65 + this.roundNumber * 25;
          this.callbacks.onRoundQualified(
            this.roundNumber,
            rank,
            coins,
            this.roundNumber === 3
          );
        } else {
          this.callbacks.onPlayerEliminated(this.roundNumber, rank, this.qualifySlots);
        }
      }
    }

    this.hudSyncTimer += dt;
    if (this.hudSyncTimer >= 0.18) {
      this.hudSyncTimer = 0;
      this.callbacks.onHudUpdate();
    }
  }

  private updateBotAI(bot: RunnerEntity, dt: number): void {
    bot.aiLaneTimer -= dt;
    if (bot.aiLaneTimer <= 0) {
      bot.aiLaneTimer = 0.6 + Math.random() * 0.8;
      bot.aiTargetLaneX = (Math.random() - 0.5) * (this.trackHalfWidth * 1.5);
    }

    const dx = bot.aiTargetLaneX - bot.pos.x;
    bot.steerX = Math.max(-1, Math.min(1, dx * 0.8));
    bot.steerZ = 1.0;

    // Jump when approaching a sweeper hazard
    if (bot.isGrounded) {
      for (let i = 0; i < this.sweepers.length; i++) {
        const s = this.sweepers[i];
        const distZ = s.z - bot.pos.z;
        if (distZ > 0.5 && distZ < 3.4 && Math.random() < 0.25) {
          bot.triggerJumpOrDive();
          break;
        }
      }
    }
  }

  private clearCourseAndRunners(): void {
    for (let i = 0; i < this.runners.length; i++) {
      this.runners[i].dispose(this.scene);
    }
    this.runners.length = 0;
    this.player = null;

    while (this.courseGroup.children.length > 0) {
      this.courseGroup.remove(this.courseGroup.children[0]);
    }
    this.sweepers.length = 0;
    this.bumpers.length = 0;
    this.trampolines.length = 0;
    this.crownGoalMesh = null;
  }
}
