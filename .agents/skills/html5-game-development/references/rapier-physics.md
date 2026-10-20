# Rapier Physics Reference

Table of Contents: initialization · collision layers · PhysicsWorld · rigid bodies and colliders · character controller · raycasting · events · cleanup

## Initialization

```ts
import RAPIER from '@dimforge/rapier3d-compat';

// Execute once inside boot.ts before instantiating any physics objects
await RAPIER.init();
```

## Collision Layers & Groups (`physics/layers.ts`)

```ts
export const Layer = {
  World:      1 << 0,
  Player:     1 << 1,
  Enemy:      1 << 2,
  Projectile: 1 << 3,
  Trigger:    1 << 4,
} as const;

export function groups(membership: number, filter: number): number {
  return ((membership & 0xffff) << 16) | (filter & 0xffff);
}

export const GROUPS = {
  world:      groups(Layer.World,      Layer.Player | Layer.Enemy | Layer.Projectile),
  player:     groups(Layer.Player,     Layer.World | Layer.Enemy | Layer.Trigger),
  enemy:      groups(Layer.Enemy,      Layer.World | Layer.Player | Layer.Projectile),
  projectile: groups(Layer.Projectile, Layer.World | Layer.Enemy),
  trigger:    groups(Layer.Trigger,    Layer.Player),
} as const;
```

## `PhysicsWorld` (`physics/physics-world.ts`)

```ts
import RAPIER from '@dimforge/rapier3d-compat';
import { FIXED_DT } from '../core/game-loop';

export class PhysicsWorld {
  readonly world: RAPIER.World;
  private readonly events = new RAPIER.EventQueue(true);

  constructor(gravityY = -9.81) {
    this.world = new RAPIER.World({ x: 0, y: gravityY, z: 0 });
    this.world.timestep = FIXED_DT;
  }

  step(onCollision: (h1: number, h2: number, started: boolean) => void): void {
    this.world.step(this.events);
    this.events.drainCollisionEvents(onCollision);
  }

  dispose(): void {
    this.events.free();
    this.world.free();
  }
}
```

## Rigid Bodies and Colliders

```ts
import RAPIER from '@dimforge/rapier3d-compat';
import { GROUPS } from './layers';

// Static environment box
export function createStaticBox(
  world: RAPIER.World,
  halfExtents: { x: number; y: number; z: number },
  pos: { x: number; y: number; z: number },
): RAPIER.Collider {
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(pos.x, pos.y, pos.z));
  const desc = RAPIER.ColliderDesc.cuboid(halfExtents.x, halfExtents.y, halfExtents.z).setCollisionGroups(GROUPS.world);
  return world.createCollider(desc, body);
}

// Dynamic physical prop with CCD enabled
export function createDynamicBall(
  world: RAPIER.World,
  radius: number,
  pos: { x: number; y: number; z: number },
): { body: RAPIER.RigidBody; collider: RAPIER.Collider } {
  const body = world.createRigidBody(
    RAPIER.RigidBodyDesc.dynamic().setTranslation(pos.x, pos.y, pos.z).setCcdEnabled(true),
  );
  const collider = world.createCollider(
    RAPIER.ColliderDesc.ball(radius).setCollisionGroups(GROUPS.enemy),
    body,
  );
  return { body, collider };
}
```

## Kinematic Character Controller (`physics/character.ts`)

```ts
import RAPIER from '@dimforge/rapier3d-compat';
import { GROUPS } from './layers';

export class CharacterBody {
  readonly body: RAPIER.RigidBody;
  readonly collider: RAPIER.Collider;
  readonly controller: RAPIER.KinematicCharacterController;
  verticalVelocity = 0;

  constructor(world: RAPIER.World, halfHeight: number, radius: number, startPos: { x: number; y: number; z: number }) {
    this.body = world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(startPos.x, startPos.y, startPos.z),
    );
    const desc = RAPIER.ColliderDesc.capsule(halfHeight, radius).setCollisionGroups(GROUPS.player);
    this.collider = world.createCollider(desc, this.body);

    this.controller = world.createCharacterController(0.01);
    this.controller.enableAutostep(0.3, 0.2, true);
    this.controller.enableSnapToGround(0.2);
    this.controller.setMaxSlopeClimbAngle((45 * Math.PI) / 180);
  }

  move(desiredMovement: { x: number; y: number; z: number }): void {
    this.controller.computeColliderMovement(this.collider, desiredMovement);
    const corrected = this.controller.computedMovement();
    const current = this.body.translation();
    this.body.setNextKinematicTranslation({
      x: current.x + corrected.x,
      y: current.y + corrected.y,
      z: current.z + corrected.z,
    });
  }

  isGrounded(): boolean {
    return this.controller.computedGrounded();
  }

  dispose(): void {
    this.controller.free();
  }
}
```

## Raycasting

```ts
export function castRay(
  world: RAPIER.World,
  origin: { x: number; y: number; z: number },
  direction: { x: number; y: number; z: number },
  maxToi: number,
  filterGroups: number,
): RAPIER.RayColliderHit | null {
  const ray = new RAPIER.Ray(origin, direction);
  return world.castRay(ray, maxToi, true, undefined, filterGroups);
}
```
Always filter raycasts to ensure queries do not return self-intersections.
