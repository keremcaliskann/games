# Architecture

Table of Contents: folder structure · layering · game loop · interpolation · state machine · event bus · object pooling · entity pattern · configuration

## Folder Structure

```
src/
  main.ts
  core/        game-loop.ts · clock.ts · events.ts · pool.ts · assets.ts · logger.ts · boot.ts
  render/      renderer.ts · camera-rig.ts · lighting.ts · quality.ts · dispose.ts
  physics/     physics-world.ts · layers.ts · character.ts · debug.ts
  input/       input-state.ts · input-manager.ts · keyboard-mouse.ts · touch.ts · gamepad.ts
  platform/    lifecycle.ts · storage.ts · haptics.ts · orientation.ts · safe-area.ts
  game/
    config/    constants and balancing data (strictly typed)
    entities/  player.ts · enemy.ts · projectile.ts
    systems/   movement.ts · combat.ts · spawn.ts
    states/    menu.ts · playing.ts · paused.ts
  ui/          hud.ts · menus.ts
```
Create folders **on demand** as features require them; never generate empty boilerplate scaffolding.

## Layering Rules
`core` ← `render` / `physics` / `input` / `platform` ← `game` ← `ui`.
`render` and `physics` must never import each other; bridging is handled exclusively by `game/entities`.

## Game Loop (`core/game-loop.ts`)

```ts
export const FIXED_DT = 1 / 60;
const MAX_STEPS = 5;     // Death spiral protection
const MAX_FRAME_DT = 0.1; // Clamp large delta spikes after background tab restore

export interface LoopHandlers {
  fixedUpdate(dt: number): void;  // Physics + fixed game logic
  update(dt: number): void;       // Variable dt: animations, camera, UI
  render(alpha: number): void;    // alpha: fractional time / FIXED_DT (0..1)
}

export class GameLoop {
  private rafId = 0;
  private last = 0;
  private acc = 0;
  private running = false;

  constructor(private readonly h: LoopHandlers) {}

  start(): void {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    this.rafId = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  // Arrow function field avoids bind/closure allocations per frame
  private frame = (now: number): void => {
    if (!this.running) return;
    this.rafId = requestAnimationFrame(this.frame);

    const dt = Math.min((now - this.last) / 1000, MAX_FRAME_DT);
    this.last = now;
    this.acc += dt;

    let steps = 0;
    while (this.acc >= FIXED_DT && steps < MAX_STEPS) {
      this.h.fixedUpdate(FIXED_DT);
      this.acc -= FIXED_DT;
      steps++;
    }
    if (steps === MAX_STEPS) this.acc = 0; // Discard accumulated lag if falling behind

    this.h.update(dt);
    this.h.render(this.acc / FIXED_DT);
  };
}
```

Pausing: Invoke `stop()`, and restart via `start()` (which resets `last` and prevents time jumps).

## Physics–Render Interpolation
Each physical entity tracks two states: `prev` and `curr`. At the beginning of `fixedUpdate`, copy `prev ← curr`. Write the new state to `curr` after stepping physics. During render:

```ts
// Module-level scratch instances avoid allocations in hot paths
const _q = new THREE.Quaternion();

export function applyInterpolated(
  obj: THREE.Object3D,
  prevPos: THREE.Vector3, currPos: THREE.Vector3,
  prevRot: THREE.Quaternion, currRot: THREE.Quaternion,
  alpha: number,
): void {
  obj.position.lerpVectors(prevPos, currPos, alpha);
  obj.quaternion.slerpQuaternions(prevRot, currRot, alpha);
}
```
Apply interpolation exclusively to dynamic moving entities; do not touch static meshes. Camera follow logic runs in `update(dt)` after reading interpolated transforms.

## Game Clock

```ts
export class GameClock {
  time = 0;        // Elapsed game time in seconds (freezes on pause)
  timeScale = 1;
  tick(dt: number): void { this.time += dt * this.timeScale; }
}
```
All game timers (cooldowns, spawn intervals) should evaluate against this clock rather than browser `setTimeout`.

## State Machine (Menu / Playing / Paused)

```ts
export interface GameState {
  enter(): void;
  exit(): void;
  fixedUpdate(dt: number): void;
  update(dt: number): void;
}

export class StateMachine {
  private current: GameState | null = null;
  set(next: GameState): void {
    this.current?.exit();
    this.current = next;
    next.enter();
  }
  fixedUpdate(dt: number): void { this.current?.fixedUpdate(dt); }
  update(dt: number): void { this.current?.update(dt); }
}
```

## Typed Event Bus (Use Only When True Decoupling is Needed)

```ts
type Handler<T> = (payload: T) => void;

export class EventBus<E extends Record<string, unknown>> {
  private readonly map = new Map<keyof E, Set<Handler<never>>>();

  on<K extends keyof E>(type: K, h: Handler<E[K]>): () => void {
    let set = this.map.get(type);
    if (!set) { set = new Set(); this.map.set(type, set); }
    set.add(h as Handler<never>);
    return () => { set!.delete(h as Handler<never>); }; // Unsubscribe
  }

  emit<K extends keyof E>(type: K, payload: E[K]): void {
    const set = this.map.get(type);
    if (!set) return;
    for (const h of set) (h as Handler<E[K]>)(payload);
  }
}
```
Never emit events every frame in hot loops. Reserve the event bus for infrequent lifecycle events (player damage, death, stage clear).

## Object Pooling

```ts
export class Pool<T> {
  private readonly free: T[] = [];

  constructor(
    private readonly create: () => T,
    private readonly reset: (item: T) => void,
    prewarm = 0,
  ) {
    for (let i = 0; i < prewarm; i++) this.free.push(create());
  }

  acquire(): T { return this.free.pop() ?? this.create(); }

  release(item: T): void {
    this.reset(item); // Hide mesh, zero velocity, sleep physics body
    this.free.push(item);
  }
}
```
Use pools for projectiles, particles, damage indicators, and recurring enemies.

## Entity Pattern
Start with simple classes per entity type and loop through them inside functions under `systems/`.

```ts
export class Enemy {
  hp = 100;
  readonly mesh: THREE.Object3D;
  readonly body: RAPIER.RigidBody;
  readonly prevPos = new THREE.Vector3();
  readonly currPos = new THREE.Vector3();
  constructor(mesh: THREE.Object3D, body: RAPIER.RigidBody) { this.mesh = mesh; this.body = body; }
}
```
Only adopt full ECS architectures (e.g., `bitECS`) if profiling proves thousands of homogeneous entities cause demonstrable CPU iteration bottlenecks.

## Configuration & Balancing
`game/config/player.ts`:
```ts
export const PLAYER = {
  moveSpeedMps: 6,
  sprintMultiplier: 1.5,
  jumpSpeedMps: 7.5,
  capsuleHalfHeightM: 0.6,
  capsuleRadiusM: 0.35,
} as const;
```
Never embed magic numbers directly in gameplay logic. Configuration files serve as the lightweight TypeScript counterpart to Unity ScriptableObjects.
