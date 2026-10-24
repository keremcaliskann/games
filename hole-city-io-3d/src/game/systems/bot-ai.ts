import * as THREE from 'three';
import { Hole } from '../entities/hole';
import { Prop } from '../entities/prop';

export class BotAISystem {
  private bots: Hole[] = [];
  private playerHole: Hole | null = null;
  private props: Prop[] = [];
  private nextDecisionTimes = new Map<string, number>();

  public setEntities(bots: Hole[], playerHole: Hole, props: Prop[]): void {
    this.bots = bots;
    this.playerHole = playerHole;
    this.props = props;
    this.nextDecisionTimes.clear();
  }

  public update(dt: number, currentTimeSec: number): void {
    if (!this.playerHole) return;

    for (const bot of this.bots) {
      if (!bot.isAlive) continue;

      const nextDecision = this.nextDecisionTimes.get(bot.id) || 0;
      if (currentTimeSec >= nextDecision) {
        this.makeDecision(bot);
        // Stagger decisions every 0.3s to 0.6s to distribute frame load
        this.nextDecisionTimes.set(bot.id, currentTimeSec + 0.3 + Math.random() * 0.3);
      }

      bot.update(dt);
    }
  }

  private makeDecision(bot: Hole): void {
    const botPos = bot.position;

    // 1. Check for immediate threats (Flee from larger holes)
    const allHoles = [this.playerHole!, ...this.bots.filter((b) => b !== bot)];
    let closestThreat: Hole | null = null;
    let minThreatDist = 14.0;

    for (const other of allHoles) {
      if (other.isAlive && other.radius > bot.radius * 1.15) {
        const dist = botPos.distanceTo(other.position);
        if (dist < minThreatDist) {
          minThreatDist = dist;
          closestThreat = other;
        }
      }
    }

    if (closestThreat) {
      // Flee away from threat
      const fleeDir = new THREE.Vector3().subVectors(botPos, closestThreat.position).normalize();
      bot.setMoveDirection(fleeDir.x, fleeDir.z);
      return;
    }

    // 2. Check for prey (Chase smaller holes)
    let closestPrey: Hole | null = null;
    let minPreyDist = 16.0;

    for (const other of allHoles) {
      if (other.isAlive && other.invulnerableTimer <= 0 && bot.radius > other.radius * 1.15) {
        const dist = botPos.distanceTo(other.position);
        if (dist < minPreyDist) {
          minPreyDist = dist;
          closestPrey = other;
        }
      }
    }

    if (closestPrey) {
      const chaseDir = new THREE.Vector3().subVectors(closestPrey.position, botPos).normalize();
      bot.setMoveDirection(chaseDir.x, chaseDir.z);
      return;
    }

    // 3. Hunt nearest swallowable prop
    let bestProp: Prop | null = null;
    let minPropDist = 32.0;

    for (let i = 0; i < this.props.length; i++) {
      const p = this.props[i];
      if (p.state === 'idle' && bot.canSwallowProp(p.radius)) {
        const dist = botPos.distanceTo(p.position);
        if (dist < minPropDist) {
          minPropDist = dist;
          bestProp = p;
        }
      }
    }

    if (bestProp) {
      const huntDir = new THREE.Vector3().subVectors(bestProp.position, botPos).normalize();
      bot.setMoveDirection(huntDir.x, huntDir.z);
      return;
    }

    // 4. Fallback: steer towards center with slight wandering offset
    const toCenter = new THREE.Vector3(
      -botPos.x + (Math.random() - 0.5) * 20,
      0,
      -botPos.z + (Math.random() - 0.5) * 20
    ).normalize();
    bot.setMoveDirection(toCenter.x, toCenter.z);
  }
}
