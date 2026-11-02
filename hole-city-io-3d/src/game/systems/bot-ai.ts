import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';
import { Hole } from '../entities/hole';
import { Prop } from '../entities/prop';

const _STEER_DIR = new THREE.Vector3();

export class BotAISystem {
  private bots: Hole[] = [];
  private playerHole: Hole | null = null;
  private props: Prop[] = [];
  private nextDecisionTimes = new Map<string, number>();
  private chaseStartTimes = new Map<string, number>();
  private chaseCooldownUntil = new Map<string, number>();

  public setEntities(bots: Hole[], playerHole: Hole, props: Prop[]): void {
    this.bots = bots;
    this.playerHole = playerHole;
    this.props = props;
    this.nextDecisionTimes.clear();
    this.chaseStartTimes.clear();
    this.chaseCooldownUntil.clear();
  }

  public resetState(): void {
    this.nextDecisionTimes.clear();
    this.chaseStartTimes.clear();
    this.chaseCooldownUntil.clear();
  }

  public update(dt: number, currentTimeSec: number): void {
    if (!this.playerHole) return;

    for (let i = 0; i < this.bots.length; i++) {
      const bot = this.bots[i];
      if (!bot.isAlive) continue;

      const nextDecision = this.nextDecisionTimes.get(bot.id) || 0;
      if (currentTimeSec >= nextDecision) {
        this.makeDecision(bot, currentTimeSec);
        // Stagger decisions every 0.35s to 0.65s to distribute frame load
        this.nextDecisionTimes.set(bot.id, currentTimeSec + 0.35 + Math.random() * 0.3);
      }

      bot.update(dt);
    }
  }

  private makeDecision(bot: Hole, currentTimeSec: number): void {
    const botPos = bot.position;
    const player = this.playerHole!;
    const halfArena = GAME_CONFIG.arenaSize * 0.5 - 12;

    // 1. Check for immediate threats (Flee from larger holes) without array allocations
    let closestThreat: Hole | null = null;
    let minThreatDist = 11.5;

    if (player.isAlive && player.radius > bot.radius * 1.15) {
      const dPlayer = botPos.distanceTo(player.position);
      if (dPlayer < minThreatDist) {
        minThreatDist = dPlayer;
        closestThreat = player;
      }
    }

    for (let i = 0; i < this.bots.length; i++) {
      const other = this.bots[i];
      if (other !== bot && other.isAlive && other.radius > bot.radius * 1.15) {
        const dist = botPos.distanceTo(other.position);
        if (dist < minThreatDist) {
          minThreatDist = dist;
          closestThreat = other;
        }
      }
    }

    if (closestThreat) {
      this.chaseStartTimes.delete(bot.id);
      _STEER_DIR.subVectors(botPos, closestThreat.position).normalize();
      // Wall-corner avoidance: pull inward if near arena border
      if (Math.abs(botPos.x) > halfArena) {
        _STEER_DIR.x = -Math.sign(botPos.x) * 0.85;
      }
      if (Math.abs(botPos.z) > halfArena) {
        _STEER_DIR.z = -Math.sign(botPos.z) * 0.85;
      }
      _STEER_DIR.normalize();
      bot.setMoveDirection(_STEER_DIR.x, _STEER_DIR.z);
      return;
    }

    // 2. Check for opportunistic prey (Short burst chase with strict stamina & cooldown)
    const cooldownUntil = this.chaseCooldownUntil.get(bot.id) || 0;
    if (currentTimeSec >= cooldownUntil) {
      let closestPrey: Hole | null = null;
      let minPreyDist = 9.2; // Only engage very close prey

      if (player.isAlive && player.invulnerableTimer <= 0 && bot.radius > player.radius * 1.18) {
        const dPlayer = botPos.distanceTo(player.position);
        if (dPlayer < minPreyDist) {
          minPreyDist = dPlayer;
          closestPrey = player;
        }
      }

      for (let i = 0; i < this.bots.length; i++) {
        const other = this.bots[i];
        if (
          other !== bot &&
          other.isAlive &&
          other.invulnerableTimer <= 0 &&
          bot.radius > other.radius * 1.18
        ) {
          const dist = botPos.distanceTo(other.position);
          if (dist < minPreyDist) {
            minPreyDist = dist;
            closestPrey = other;
          }
        }
      }

      if (closestPrey) {
        let chaseStart = this.chaseStartTimes.get(bot.id);
        if (chaseStart === undefined) {
          chaseStart = currentTimeSec;
          this.chaseStartTimes.set(bot.id, chaseStart);
        }

        // Break off chase after 2.5 seconds so bots never get stuck in endless pursuit
        if (currentTimeSec - chaseStart <= 2.5) {
          _STEER_DIR.subVectors(closestPrey.position, botPos).normalize();
          bot.setMoveDirection(_STEER_DIR.x, _STEER_DIR.z);
          return;
        } else {
          this.chaseStartTimes.delete(bot.id);
          this.chaseCooldownUntil.set(bot.id, currentTimeSec + 6.5);
        }
      } else {
        this.chaseStartTimes.delete(bot.id);
      }
    }

    // 3. Forage highest value swallowable prop nearby
    let bestProp: Prop | null = null;
    let bestScore = -1;

    for (let i = 0; i < this.props.length; i++) {
      const p = this.props[i];
      if (p.state === 'idle' && bot.canSwallowProp(p.radius)) {
        const dist = botPos.distanceTo(p.position);
        if (dist < 38.0) {
          const utility = p.points / (dist + 3.0);
          if (utility > bestScore) {
            bestScore = utility;
            bestProp = p;
          }
        }
      }
    }

    if (bestProp) {
      _STEER_DIR.subVectors(bestProp.position, botPos).normalize();
      bot.setMoveDirection(_STEER_DIR.x, _STEER_DIR.z);
      return;
    }

    // 4. Fallback: steer towards center with slight wandering offset
    _STEER_DIR.set(
      -botPos.x + (Math.random() - 0.5) * 24,
      0,
      -botPos.z + (Math.random() - 0.5) * 24
    ).normalize();
    bot.setMoveDirection(_STEER_DIR.x, _STEER_DIR.z);
  }
}
