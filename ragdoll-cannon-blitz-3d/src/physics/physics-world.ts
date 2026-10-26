import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export interface CollisionEventPayload {
  handle1: number;
  handle2: number;
}

export class PhysicsWorld {
  public readonly world: RAPIER.World;
  private readonly eventQueue: RAPIER.EventQueue;
  private readonly bodyMetadata = new Map<number, { type: string; id: string; hp?: number }>();

  constructor() {
    const gravity = { x: 0.0, y: -9.81 * 2.2, z: 0.0 }; // Punchy arcade gravity
    this.world = new RAPIER.World(gravity);
    this.eventQueue = new RAPIER.EventQueue(true);
  }

  public registerMeta(bodyHandle: number, meta: { type: string; id: string; hp?: number }): void {
    this.bodyMetadata.set(bodyHandle, meta);
  }

  public getMeta(bodyHandle: number): { type: string; id: string; hp?: number } | undefined {
    return this.bodyMetadata.get(bodyHandle);
  }

  public removeMeta(bodyHandle: number): void {
    this.bodyMetadata.delete(bodyHandle);
  }

  private readonly contactPairsBuffer: [number, number][] = [];
  private readonly tempDir = new THREE.Vector3();

  public step(onCollision?: (h1: number, h2: number) => void): void {
    this.world.step(this.eventQueue);

    if (onCollision) {
      this.contactPairsBuffer.length = 0;
      this.eventQueue.drainCollisionEvents((cHandle1, cHandle2, started) => {
        if (started) {
          const b1 = this.world.getCollider(cHandle1)?.parent()?.handle;
          const b2 = this.world.getCollider(cHandle2)?.parent()?.handle;
          if (b1 !== undefined && b2 !== undefined) {
            this.contactPairsBuffer.push([b1, b2]);
          }
        }
      });

      for (let i = 0; i < this.contactPairsBuffer.length; i++) {
        const pair = this.contactPairsBuffer[i];
        onCollision(pair[0], pair[1]);
      }
    }
  }

  public applyRadialImpulse(
    center: THREE.Vector3,
    radius: number,
    peakStrength: number,
    upwardBias: number = 0.35
  ): { handle: number; distance: number }[] {
    const affected: { handle: number; distance: number }[] = [];
    const dir = this.tempDir;

    this.world.forEachRigidBody((body) => {
      if (body.isFixed()) return;

      const pos = body.translation();
      dir.set(pos.x - center.x, pos.y - center.y, pos.z - center.z);
      const dist = dir.length();

      if (dist < radius && dist > 0.001) {
        dir.normalize();
        dir.y += upwardBias;
        dir.normalize();

        const falloff = 1 - dist / radius;
        const impulseMag = peakStrength * falloff;
        body.applyImpulse({ x: dir.x * impulseMag, y: dir.y * impulseMag, z: dir.z * impulseMag }, true);
        body.applyTorqueImpulse(
          {
            x: (Math.random() - 0.5) * impulseMag * 0.4,
            y: (Math.random() - 0.5) * impulseMag * 0.4,
            z: (Math.random() - 0.5) * impulseMag * 0.4,
          },
          true
        );

        affected.push({ handle: body.handle, distance: dist });
      }
    });

    return affected;
  }

  public clearDynamicBodies(): void {
    const bodiesToRemove: RAPIER.RigidBody[] = [];
    this.world.forEachRigidBody((body) => {
      if (!body.isFixed()) {
        bodiesToRemove.push(body);
      }
    });

    for (const body of bodiesToRemove) {
      this.bodyMetadata.delete(body.handle);
      this.world.removeRigidBody(body);
    }
  }
}
