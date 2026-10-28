import * as THREE from 'three';
import { KartEntity } from '../entities/kart';
import { ArenaIslandRig, PrefabFactory } from '../../render/PrefabFactory';
import { ParticleEffects } from '../../render/effects';
import { SoundController } from '../../core/audio';
import { CameraRig } from '../../render/camera-rig';

const _BURST_POS = new THREE.Vector3();

const BOT_PROFILES: Array<{ name: string; color: number }> = [
  { name: 'TurboRex', color: 0x2563eb },
  { name: 'BumpKing', color: 0x16a34a },
  { name: 'NeonDrift', color: 0x9333ea },
  { name: 'PixelRam', color: 0x0284c7 },
  { name: 'Vortex99', color: 0xd97706 },
  { name: 'HyperKart', color: 0xdb2777 },
  { name: 'SmashBot', color: 0x0d9488 },
];

interface EnergyOrbSlot {
  mesh: THREE.Group;
  pos: THREE.Vector3;
  active: boolean;
  respawnTimer: number;
  phase: number;
}

export interface ArenaCallbacks {
  onHudUpdate: () => void;
  onCallout: (text: string, colorHex?: string) => void;
  onMatchVictory: (earnedCoins: number, knockouts: number, rank: number) => void;
  onPlayerKnockedOut: (rank: number, aliveRivals: number) => void;
}

export class ArenaManager {
  public readonly arenaRig: ArenaIslandRig;
  public player: KartEntity | null = null;
  public readonly karts: KartEntity[] = [];
  private readonly orbs: EnergyOrbSlot[] = [];

  public arenaNumber = 1;
  public initialRadius = 15.0;
  public currentRadius = 15.0;
  public minRadius = 6.5;
  public matchDuration = 75.0;
  public timeRemaining = 75.0;
  public matchCoinsEarned = 0;

  private matchEnded = false;
  private endDelayTimer = 0;
  private pendingOutcome: 'victory' | 'defeat' | null = null;
  private pendingRank = 1;
  private hudSyncAccumulator = 0;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController,
    private readonly cameraRig: CameraRig,
    private readonly callbacks: ArenaCallbacks
  ) {
    this.arenaRig = PrefabFactory.createArenaIsland(this.initialRadius);
    this.scene.add(this.arenaRig.root);
    this.initOrbs();
  }

  private initOrbs(): void {
    for (let i = 0; i < 12; i++) {
      const mesh = PrefabFactory.createEnergyOrb();
      this.scene.add(mesh);
      this.orbs.push({
        mesh,
        pos: new THREE.Vector3(),
        active: true,
        respawnTimer: 0,
        phase: i * 0.8,
      });
    }
  }

  private placeOrbRandomly(orb: EnergyOrbSlot): void {
    const r = Math.random() * Math.max(3.5, this.currentRadius - 2.2);
    const a = Math.random() * Math.PI * 2;
    orb.pos.set(Math.cos(a) * r, 0, Math.sin(a) * r);
    orb.mesh.position.copy(orb.pos);
    orb.mesh.visible = true;
    orb.active = true;
  }

  public startMatch(arenaNum: number): void {
    this.clearKarts();
    this.arenaNumber = arenaNum;
    this.currentRadius = this.initialRadius;
    this.arenaRig.platformGroup.scale.set(this.currentRadius, 1, this.currentRadius);
    this.timeRemaining = this.matchDuration;
    this.matchCoinsEarned = 0;
    this.matchEnded = false;
    this.pendingOutcome = null;
    this.endDelayTimer = 0;

    // Spawn Player + 7 AI Bots in a balanced perimeter ring
    const spawnDist = 8.8;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const sx = Math.sin(angle) * spawnDist;
      const sz = Math.cos(angle) * spawnDist;

      if (i === 0) {
        this.player = new KartEntity(
          this.scene,
          'player',
          'YOU',
          true,
          0xef4444,
          sx,
          sz
        );
        // Always give player an immediate gentle inward cruise so the 2-second hook feels alive
        this.player.setSteerDirection(-sx, -sz);
        this.karts.push(this.player);
      } else {
        const profile = BOT_PROFILES[(i - 1) % BOT_PROFILES.length];
        const bot = new KartEntity(
          this.scene,
          `bot_${i}`,
          profile.name,
          false,
          profile.color,
          sx,
          sz
        );
        bot.aiDecisionTimer = 0.1 * i;
        this.karts.push(bot);
      }
    }

    for (let i = 0; i < this.orbs.length; i++) {
      this.placeOrbRandomly(this.orbs[i]);
    }

    this.callbacks.onHudUpdate();
  }

  public get aliveKartCount(): number {
    let c = 0;
    for (let i = 0; i < this.karts.length; i++) {
      if (this.karts[i].isAlive) c++;
    }
    return c;
  }

  public revivePlayerWithShockwave(): void {
    if (!this.player) return;
    this.player.respawnAtCenter();
    this.matchEnded = false;
    this.pendingOutcome = null;
    this.endDelayTimer = 0;

    _BURST_POS.set(0, 0.5, 0);
    this.particles.spawnBurst(_BURST_POS, 0xfacc15, 24);
    this.audio.playBoosterActivate();
    this.cameraRig.addTrauma(0.5);
    this.callbacks.onCallout('🚀 ROCKET REVIVE! SPIKE ARMOR ACTIVE!', '#facc15');

    // Repel nearby bots away from center
    for (let i = 0; i < this.karts.length; i++) {
      const k = this.karts[i];
      if (k === this.player || !k.isAlive || k.isFallingInSea) continue;
      const dist = Math.hypot(k.pos.x, k.pos.z);
      if (dist < 7.0) {
        const nx = dist > 0.01 ? k.pos.x / dist : 1;
        const nz = dist > 0.01 ? k.pos.z / dist : 0;
        k.vel.x += nx * 15.0;
        k.vel.z += nz * 15.0;
      }
    }

    this.callbacks.onHudUpdate();
  }

  public activateBooster(type: 'nitro' | 'vortex' | 'spikes'): void {
    if (!this.player || !this.player.isAlive) return;
    if (type === 'nitro') {
      this.player.nitroTimer = 8.0;
      this.callbacks.onCallout('⚡ MEGA NITRO RAM (8s)!', '#38bdf8');
    } else if (type === 'vortex') {
      this.player.vortexTimer = 8.0;
      this.callbacks.onCallout('🧲 MAGNET VORTEX ACTIVE (8s)!', '#c084fc');
    } else {
      this.player.spikeTimer = 10.0;
      this.callbacks.onCallout('⚙️ 2.2x SPIKE ARMOR ACTIVE (10s)!', '#facc15');
    }
    _BURST_POS.copy(this.player.pos);
    this.particles.spawnBurst(_BURST_POS, 0xfacc15, 16);
    this.audio.playBoosterActivate();
    this.callbacks.onHudUpdate();
  }

  public update(dt: number, steerActive: boolean, steerDx: number, steerDz: number): void {
    if (!this.matchEnded) {
      this.timeRemaining = Math.max(0, this.timeRemaining - dt);
      const shrinkRatio = 1.0 - this.timeRemaining / this.matchDuration;
      this.currentRadius =
        this.initialRadius - (this.initialRadius - this.minRadius) * shrinkRatio;
      this.arenaRig.platformGroup.scale.set(this.currentRadius, 1, this.currentRadius);
    }

    // Apply player steering
    if (this.player && this.player.isAlive && !this.player.isFallingInSea) {
      if (steerActive) {
        this.player.setSteerDirection(steerDx, steerDz);
      } else {
        this.player.setSteerDirection(0, 0);
      }
    }

    // Step AI decisions & Kart movement
    for (let i = 0; i < this.karts.length; i++) {
      const k = this.karts[i];
      if (!k.isAlive) continue;

      if (!k.isPlayer && !k.isFallingInSea && !this.matchEnded) {
        k.aiDecisionTimer -= dt;
        if (k.aiDecisionTimer <= 0) {
          k.aiDecisionTimer = 0.22 + Math.random() * 0.16;
          this.updateBotSteering(k);
        }
      }

      const newlyEliminated = k.update(dt, this.currentRadius);
      if (newlyEliminated) {
        _BURST_POS.set(k.pos.x, -2.5, k.pos.z);
        this.particles.spawnBurst(_BURST_POS, 0x38bdf8, 18);
        this.audio.playKnockoutSplash();

        if (k.lastHitBy && k.lastHitBy.isAlive) {
          k.lastHitBy.knockouts++;
          k.lastHitBy.addGrowth(0.14, 150);
          if (k.lastHitBy.isPlayer) {
            this.matchCoinsEarned += 25;
            this.cameraRig.addTrauma(0.45);
            this.callbacks.onCallout(`💥 KO! ${k.name} SMASHED! (+25 🪙)`, '#facc15');
          }
        }
        this.callbacks.onHudUpdate();
      }
    }

    // Magnet Vortex attraction for player
    if (
      this.player &&
      this.player.isAlive &&
      !this.player.isFallingInSea &&
      this.player.vortexTimer > 0
    ) {
      for (let i = 0; i < this.orbs.length; i++) {
        const orb = this.orbs[i];
        if (!orb.active) continue;
        const dx = this.player.pos.x - orb.pos.x;
        const dz = this.player.pos.z - orb.pos.z;
        const d = Math.hypot(dx, dz);
        if (d < 6.5 && d > 0.01) {
          orb.pos.x += (dx / d) * 11.5 * dt;
          orb.pos.z += (dz / d) * 11.5 * dt;
          orb.mesh.position.copy(orb.pos);
        }
      }
    }

    // Update Orbs & Pickup checks
    for (let i = 0; i < this.orbs.length; i++) {
      const orb = this.orbs[i];
      if (!orb.active) {
        orb.respawnTimer -= dt;
        if (orb.respawnTimer <= 0) {
          this.placeOrbRandomly(orb);
        }
        continue;
      }

      orb.phase += dt * 3.0;
      orb.mesh.rotation.y += dt * 2.2;
      orb.mesh.position.y = Math.sin(orb.phase) * 0.14;

      for (let kIdx = 0; kIdx < this.karts.length; kIdx++) {
        const k = this.karts[kIdx];
        if (!k.isAlive || k.isFallingInSea) continue;
        if (Math.hypot(k.pos.x - orb.pos.x, k.pos.z - orb.pos.z) <= k.radius + 0.35) {
          orb.active = false;
          orb.mesh.visible = false;
          orb.respawnTimer = 3.5;
          k.addGrowth(0.04, 25);
          if (k.isPlayer) {
            this.matchCoinsEarned += 5;
            _BURST_POS.copy(orb.pos);
            this.particles.spawnBurst(_BURST_POS, 0xfacc15, 8);
            this.audio.playOrbPickup();
          }
          break;
        }
      }
    }

    // Pairwise Elastic Bumper Collisions
    for (let i = 0; i < this.karts.length; i++) {
      const a = this.karts[i];
      if (!a.isAlive || a.isFallingInSea) continue;

      for (let j = i + 1; j < this.karts.length; j++) {
        const b = this.karts[j];
        if (!b.isAlive || b.isFallingInSea) continue;

        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const dist = Math.hypot(dx, dz);
        const minDist = a.radius + b.radius;

        if (dist < minDist && dist > 0.0001) {
          const nx = dx / dist;
          const nz = dz / dist;
          const overlap = minDist - dist;

          // Separate overlapping karts
          a.pos.x -= nx * overlap * 0.5;
          a.pos.z -= nz * overlap * 0.5;
          b.pos.x += nx * overlap * 0.5;
          b.pos.z += nz * overlap * 0.5;

          const relVx = a.vel.x - b.vel.x;
          const relVz = a.vel.z - b.vel.z;
          const approachSpeed = Math.max(3.5, relVx * nx + relVz * nz);

          const aSpikeMult = a.spikeTimer > 0 ? 2.15 : a.nitroTimer > 0 ? 1.55 : 1.0;
          const bSpikeMult = b.spikeTimer > 0 ? 2.15 : b.nitroTimer > 0 ? 1.55 : 1.0;

          const impulseOnB = (approachSpeed * 1.32 + 5.2) * (a.mass / b.mass) * aSpikeMult;
          const impulseOnA = (approachSpeed * 1.32 + 5.2) * (b.mass / a.mass) * bSpikeMult;

          a.vel.x -= nx * impulseOnA;
          a.vel.z -= nz * impulseOnA;
          b.vel.x += nx * impulseOnB;
          b.vel.z += nz * impulseOnB;

          a.lastHitBy = b;
          a.lastHitTimer = 3.5;
          b.lastHitBy = a;
          b.lastHitTimer = 3.5;

          a.triggerBumpSquash();
          b.triggerBumpSquash();

          _BURST_POS.set((a.pos.x + b.pos.x) * 0.5, 0.4, (a.pos.z + b.pos.z) * 0.5);
          const isPlayerInvolved = a.isPlayer || b.isPlayer;
          this.particles.spawnBurst(
            _BURST_POS,
            isPlayerInvolved ? 0xfacc15 : 0xffffff,
            isPlayerInvolved ? 14 : 8
          );
          if (isPlayerInvolved) {
            this.audio.playBumpCollision(approachSpeed > 9.0);
            this.cameraRig.addTrauma(Math.min(0.45, approachSpeed * 0.035));
          }
        }
      }
    }

    // Check match victory / defeat conditions
    if (!this.matchEnded) {
      const aliveTotal = this.aliveKartCount;
      if (this.player && !this.player.isAlive) {
        this.matchEnded = true;
        this.pendingOutcome = 'defeat';
        this.pendingRank = aliveTotal + 1;
        this.endDelayTimer = 0.65;
      } else if (aliveTotal <= 1 || this.timeRemaining <= 0) {
        this.matchEnded = true;
        this.pendingOutcome = 'victory';
        this.pendingRank = 1;
        this.endDelayTimer = 0.75;
      }
    } else if (this.pendingOutcome !== null) {
      this.endDelayTimer -= dt;
      if (this.endDelayTimer <= 0) {
        const outcome = this.pendingOutcome;
        this.pendingOutcome = null;
        if (outcome === 'victory') {
          const baseCoins = 50 + this.arenaNumber * 15 + this.matchCoinsEarned;
          this.callbacks.onMatchVictory(
            baseCoins,
            this.player ? this.player.knockouts : 0,
            this.pendingRank
          );
        } else {
          this.callbacks.onPlayerKnockedOut(this.pendingRank, this.aliveKartCount);
        }
      }
    }

    this.hudSyncAccumulator += dt;
    if (this.hudSyncAccumulator >= 0.2) {
      this.hudSyncAccumulator = 0;
      this.callbacks.onHudUpdate();
    }
  }

  private updateBotSteering(bot: KartEntity): void {
    const distFromCenter = Math.hypot(bot.pos.x, bot.pos.z);
    // 1. Emergency edge recovery if near perimeter curb
    if (distFromCenter > this.currentRadius * 0.74) {
      bot.setSteerDirection(-bot.pos.x, -bot.pos.z);
      return;
    }

    // 2. Attack nearest kart that is closer to the outer edge than this bot
    let bestTarget: KartEntity | null = null;
    let bestDist = 14.0;
    for (let i = 0; i < this.karts.length; i++) {
      const other = this.karts[i];
      if (other === bot || !other.isAlive || other.isFallingInSea) continue;
      const d = Math.hypot(other.pos.x - bot.pos.x, other.pos.z - bot.pos.z);
      if (d < bestDist) {
        bestDist = d;
        bestTarget = other;
      }
    }

    if (bestTarget) {
      bot.setSteerDirection(
        bestTarget.pos.x - bot.pos.x,
        bestTarget.pos.z - bot.pos.z
      );
      return;
    }

    // 3. Patrol toward center
    bot.setSteerDirection(-bot.pos.x, -bot.pos.z);
  }

  private clearKarts(): void {
    for (let i = 0; i < this.karts.length; i++) {
      this.karts[i].dispose(this.scene);
    }
    this.karts.length = 0;
    this.player = null;
  }
}
