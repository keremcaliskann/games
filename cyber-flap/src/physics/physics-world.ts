import RAPIER from '@dimforge/rapier3d-compat';
import { FIXED_DT } from '../core/game-loop';
import { ColliderTag, type ColliderTagType } from './layers';

export interface ColliderMeta {
  tag: ColliderTagType;
  pairId: number;
}

export interface PhysicsCallbacks {
  onHitHazard(): void;
  onPassScoreSensor(pairId: number): void;
}

export class PhysicsWorld {
  readonly world: RAPIER.World;
  private readonly eventQueue: RAPIER.EventQueue;
  private readonly metaMap = new Map<number, ColliderMeta>();
  private droneColliderHandle = -1;
  private pendingHazardHit = false;
  private readonly pendingScoredPairIds: number[] = [];

  constructor() {
    // Gravity is simulated deterministically in drone controller; Rapier resolves collisions & sensors
    this.world = new RAPIER.World({ x: 0, y: 0, z: 0 });
    this.world.timestep = FIXED_DT;
    this.eventQueue = new RAPIER.EventQueue(true);
  }

  registerCollider(collider: RAPIER.Collider, meta: ColliderMeta): void {
    this.metaMap.set(collider.handle, meta);
    if (meta.tag === ColliderTag.Drone) {
      this.droneColliderHandle = collider.handle;
    }
  }

  unregisterCollider(handle: number): void {
    this.metaMap.delete(handle);
  }

  step(callbacks: PhysicsCallbacks): void {
    this.pendingHazardHit = false;
    this.pendingScoredPairIds.length = 0;

    this.world.step(this.eventQueue);

    this.eventQueue.drainCollisionEvents((h1: number, h2: number, started: boolean) => {
      if (!started) return;

      const otherHandle =
        h1 === this.droneColliderHandle ? h2 : h2 === this.droneColliderHandle ? h1 : -1;
      if (otherHandle === -1) return;

      const meta = this.metaMap.get(otherHandle);
      if (!meta) return;

      if (meta.tag === ColliderTag.Obstacle || meta.tag === ColliderTag.Boundary) {
        this.pendingHazardHit = true;
      } else if (meta.tag === ColliderTag.ScoreSensor) {
        this.pendingScoredPairIds.push(meta.pairId);
      }
    });

    for (let i = 0; i < this.pendingScoredPairIds.length; i++) {
      callbacks.onPassScoreSensor(this.pendingScoredPairIds[i]);
    }
    if (this.pendingHazardHit) {
      callbacks.onHitHazard();
    }
  }

  dispose(): void {
    this.metaMap.clear();
    this.eventQueue.free();
    this.world.free();
  }
}
