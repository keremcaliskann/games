import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export interface BodyMetadata {
  id: string;
  tier: number;
  isBomb?: boolean;
}

export class PhysicsWorld {
  public readonly world: RAPIER.World;
  private readonly eventQueue: RAPIER.EventQueue;
  private readonly bodyMetadata = new Map<number, BodyMetadata>();

  constructor() {
    const gravity = { x: 0.0, y: -9.81 * 2.2, z: 0.0 };
    this.world = new RAPIER.World(gravity);
    this.eventQueue = new RAPIER.EventQueue(true);
  }

  public registerMeta(bodyHandle: number, meta: BodyMetadata): void {
    this.bodyMetadata.set(bodyHandle, meta);
  }

  public getMeta(bodyHandle: number): BodyMetadata | undefined {
    return this.bodyMetadata.get(bodyHandle);
  }

  public removeMeta(bodyHandle: number): void {
    this.bodyMetadata.delete(bodyHandle);
  }

  private readonly contactPairsBuffer: [number, number][] = [];
  private readonly tempDir = new THREE.Vector3();

  public step(onContact?: (h1: number, h2: number) => void): void {
    this.world.step(this.eventQueue);

    if (onContact) {
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
        onContact(pair[0], pair[1]);
      }
    }
  }

  public applyRadialImpulse(
    center: THREE.Vector3,
    radius: number,
    peakStrength: number,
    upwardBias: number = 0.4
  ): number[] {
    const affectedHandles: number[] = [];
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
        affectedHandles.push(body.handle);
      }
    });

    return affectedHandles;
  }

  public applyUpwardShake(strength: number = 18.0): void {
    this.world.forEachRigidBody((body) => {
      if (body.isFixed()) return;
      const vx = (Math.random() - 0.5) * strength * 0.4;
      const vy = strength * (0.8 + Math.random() * 0.4);
      const vz = (Math.random() - 0.5) * strength * 0.4;
      body.applyImpulse({ x: vx, y: vy, z: vz }, true);
    });
  }

  public clearDynamicBodies(): void {
    const toRemove: RAPIER.RigidBody[] = [];
    this.world.forEachRigidBody((body) => {
      if (!body.isFixed()) {
        toRemove.push(body);
      }
    });

    for (const body of toRemove) {
      this.bodyMetadata.delete(body.handle);
      this.world.removeRigidBody(body);
    }
  }
}
