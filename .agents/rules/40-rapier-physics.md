---
trigger: glob
globs: "**/src/physics/**/*.ts"
description: "Rapier.js (Wasm) world setup, fixed timestep, collider selection, collision groups, character controller, and Wasm memory cleanup."
---

# Rapier Physics Rules

## Package & Initialization
- Package: `@dimforge/rapier3d-compat` (embeds Wasm, works out-of-the-box in Vite and Capacitor).
- Call `await RAPIER.init()` **once** at application startup in `core/boot.ts` before instantiating physics objects.
- Validate API signatures in `node_modules/@dimforge/rapier3d-compat/**/*.d.ts` when uncertain.

## Timestep & Game Loop
- Fixed timestep: `world.timestep = 1 / 60`. Never pass variable `dt` to `world.step()`.
- Run physics inside the fixed update accumulator in `core/game-loop.ts`. Clamp max steps to 5 to prevent death spirals.
- Clamp frame delta time to a maximum of 0.1 s when returning from background tabs.

## Rigid Body Selection
| Object Type | Body Type | Implementation Details |
|---|---|---|
| Terrain, Static Walls, Architecture | `fixed` | Zero runtime movement cost. |
| Player & Humanoid Characters | `kinematicPositionBased` | Controlled via `KinematicCharacterController`. |
| Physics Props (Crates, Debris) | `dynamic` | Keep active counts budgeted; allow bodies to sleep. |
| Projectiles & Bullets | Hitscan (`castRay`) | Prefer rays. For slow physical bullets, use small dynamic bodies with CCD enabled (`setCcdEnabled(true)`). |
| Triggers & Checkpoints | `fixed` + `setSensor(true)` | Fires collision events without physical reaction. |

## Collider Primitives (Simple to Expensive)
`ball` < `capsule` < `cuboid` < `convexHull` < `trimesh` (static only) / `heightfield` (terrain).
- Never attach high-poly visual meshes as colliders. Use dedicated, simplified primitive shapes.
- Player characters should use a `capsule`. Never assign `trimesh` to dynamic rigid bodies.

## Collision Groups & Layers
- Define all collision bitmasks in a single source file: `physics/layers.ts`.
- Rapier bit layout: upper 16 bits = membership, lower 16 bits = filter mask: `(membership << 16) | filter`.
- Explicitly set collision groups on every collider using `collider.setCollisionGroups(...)`.
- Always assign filter masks to raycasts and shape queries to prevent characters from intersecting their own colliders.

## Collision Events & Lifecycle
- Enable collision events on required colliders: `collider.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS)`.
- Use a dedicated event queue: `const events = new RAPIER.EventQueue(true); world.step(events);`. Drain events via `events.drainCollisionEvents(...)`.
- Never modify the physics world (e.g., removing bodies) directly inside event callbacks. Queue entity removals and execute them at the end of the physics tick.
- Maintain a handle-to-entity lookup map (`Map<number, EntityId>`) and clear mappings when deleting colliders.

## Kinematic Character Controller
- Setup: `world.createCharacterController(0.01)`, configuring `enableAutostep`, `enableSnapToGround`, and `setMaxSlopeClimbAngle`.
- Gravity is simulated in game code; the controller only resolves obstacle movement and stepping.
- Tick sequence: Calculate desired translation → `controller.computeColliderMovement(collider, desired)` → read `controller.computedMovement()` → apply via `body.setNextKinematicTranslation(...)`. Query ground state with `controller.computedGrounded()`.

## Wasm Memory Management
- Rapier objects (`World`, `EventQueue`, `CharacterController`) exist in Wasm memory and must be manually deallocated using `.free()`.
- `PhysicsWorld.dispose()` must free the world and its sub-resources.
- Recreate the physics world on scene/level restarts and free the preceding instance.
