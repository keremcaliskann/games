import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { Pool } from '../../core/pool';
import { ColliderFilter, ColliderTag } from '../../physics/layers';
import type { PhysicsWorld } from '../../physics/physics-world';
import { GAME_CONFIG } from '../config/game-config';
import {
  createSharedObstacleResources,
  disposeSharedObstacleResources,
  ObstaclePair,
  type SharedObstacleResources,
} from '../entities/obstacle-pair';

export class ObstacleSpawner {
  private readonly sharedRes: SharedObstacleResources;
  private readonly pool: Pool<ObstaclePair>;
  private readonly active: ObstaclePair[] = [];
  private readonly byPairId = new Map<number, ObstaclePair>();
  private readonly topBoundaryCollider: RAPIER.Collider;
  private readonly bottomBoundaryCollider: RAPIER.Collider;

  private nextSpawnTimerSec = 0;
  private rngState = 0x1337beef;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly physics: PhysicsWorld,
  ) {
    this.sharedRes = createSharedObstacleResources();

    let nextId = 1;
    this.pool = new Pool<ObstaclePair>(
      () => {
        const pair = new ObstaclePair(nextId++, this.physics, this.sharedRes);
        this.scene.add(pair.root);
        this.byPairId.set(pair.pairId, pair);
        return pair;
      },
      (pair: ObstaclePair) => {
        pair.deactivate();
      },
      GAME_CONFIG.obstaclePoolSize,
    );

    // Create ceiling and floor hazard colliders in Rapier
    const topBody = physics.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(0, GAME_CONFIG.ceilingY + 0.5, 0),
    );
    this.topBoundaryCollider = physics.world.createCollider(
      RAPIER.ColliderDesc.cuboid(30, 0.5, 2).setCollisionGroups(ColliderFilter.BOUNDARY),
      topBody,
    );
    physics.registerCollider(this.topBoundaryCollider, { tag: ColliderTag.Boundary, pairId: -2 });

    const bottomBody = physics.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(0, GAME_CONFIG.floorY - 0.5, 0),
    );
    this.bottomBoundaryCollider = physics.world.createCollider(
      RAPIER.ColliderDesc.cuboid(30, 0.5, 2).setCollisionGroups(ColliderFilter.BOUNDARY),
      bottomBody,
    );
    physics.registerCollider(this.bottomBoundaryCollider, {
      tag: ColliderTag.Boundary,
      pairId: -3,
    });
  }

  reset(): void {
    for (let i = this.active.length - 1; i >= 0; i--) {
      this.pool.release(this.active[i]);
    }
    this.active.length = 0;
    this.nextSpawnTimerSec = 0.35;
  }

  getScrollSpeedMps(score: number, hasSlowMo = false): number {
    const rawSpeed = Math.min(
      GAME_CONFIG.maxScrollSpeedMps,
      GAME_CONFIG.baseScrollSpeedMps + score * GAME_CONFIG.speedIncreasePerScoreMps,
    );
    return hasSlowMo && score < 10 ? rawSpeed * 0.7 : rawSpeed;
  }

  fixedUpdate(dtSec: number, elapsedSec: number, score: number, hasSlowMo = false): void {
    const scrollSpeed = this.getScrollSpeedMps(score, hasSlowMo);
    this.nextSpawnTimerSec -= dtSec;

    if (this.nextSpawnTimerSec <= 0) {
      this.spawnGate(score);
      const speedRatio = GAME_CONFIG.baseScrollSpeedMps / scrollSpeed;
      this.nextSpawnTimerSec = Math.max(
        GAME_CONFIG.minSpawnIntervalSec,
        GAME_CONFIG.spawnIntervalSec * speedRatio,
      );
    }

    for (let i = this.active.length - 1; i >= 0; i--) {
      const pair = this.active[i];
      pair.fixedUpdate(dtSec, scrollSpeed, elapsedSec);
      if (pair.currPos.x < GAME_CONFIG.despawnX) {
        // Swap-and-pop avoids array shifting overhead in hot loop
        const last = this.active.pop()!;
        if (i < this.active.length) {
          this.active[i] = last;
        }
        this.pool.release(pair);
      }
    }
  }

  tryConsumeScoreSensor(pairId: number): boolean {
    const pair = this.byPairId.get(pairId);
    if (!pair || !pair.isActive || pair.hasScored) {
      return false;
    }
    pair.hasScored = true;
    return true;
  }

  renderInterpolated(alpha: number): void {
    for (let i = 0; i < this.active.length; i++) {
      this.active[i].renderInterpolated(alpha);
    }
  }

  private spawnGate(score: number): void {
    const pair = this.pool.acquire();
    const gapHeight = Math.max(
      GAME_CONFIG.minGapHeightM,
      GAME_CONFIG.baseGapHeightM - score * GAME_CONFIG.gapShrinkPerScoreM,
    );

    const maxCenterY = GAME_CONFIG.ceilingY - gapHeight * 0.5 - 1.2;
    const minCenterY = GAME_CONFIG.floorY + gapHeight * 0.5 + 1.2;
    const centerY = minCenterY + this.nextRandom01() * (maxCenterY - minCenterY);

    let oscillateAmp = 0;
    if (score >= GAME_CONFIG.oscillationUnlockScore) {
      const factor = Math.min(1, (score - GAME_CONFIG.oscillationUnlockScore + 1) * 0.15);
      oscillateAmp = this.nextRandom01() * GAME_CONFIG.oscillationMaxAmpM * factor;
    }
    const phaseRad = this.nextRandom01() * Math.PI * 2;

    pair.spawn(GAME_CONFIG.spawnX, centerY, gapHeight, oscillateAmp, phaseRad);
    this.active.push(pair);
  }

  // Fast xorshift32 RNG avoids closures and allocations
  private nextRandom01(): number {
    let x = this.rngState;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.rngState = x;
    return (x >>> 0) / 0xffffffff;
  }

  dispose(): void {
    this.physics.unregisterCollider(this.topBoundaryCollider.handle);
    this.physics.unregisterCollider(this.bottomBoundaryCollider.handle);
    for (const pair of this.byPairId.values()) {
      pair.dispose();
    }
    this.byPairId.clear();
    this.active.length = 0;
    disposeSharedObstacleResources(this.sharedRes);
  }
}
