# Unity → Web Architecture Mapping

Use this guide when converting Unity game designs or mental models to this stack. The mapping emphasizes **minimalist, idiomatic TypeScript** solutions over 1:1 framework emulation.

## Lifecycle & Structure

| Unity Concept | Web / TS Architecture | Implementation Details |
|---|---|---|
| `MonoBehaviour` | Plain TS Class + `update(dt)` or system functions | Avoid deep component inheritance. |
| `GameObject` / Prefab | Factory function (`createEnemy(...)`) + glTF + config | Three.js scene hierarchy (`THREE.Object3D`). |
| `ScriptableObject` | `game/config/*.ts` (typed `as const` objects) | No inspector UI; balancing data lives in typed code. |
| `Awake` / `Start` | Constructor / `init()` | Inject dependencies explicitly via parameters. |
| `Update` | `update(dt)` | Variable delta time: animations, camera, UI. |
| `FixedUpdate` | `fixedUpdate(FIXED_DT)` | Fixed 1/60s timestep: physics and deterministic gameplay. |
| `LateUpdate` | End of `update(dt)` loop | Camera follow runs after interpolated transforms. |
| `OnDestroy` | `dispose()` | Manual GPU / Wasm / event listener deallocation. |
| `Coroutine` | `async/await` + `GameClock` timers | Avoid `setTimeout`; game timers must pause cleanly. |
| Singleton / `FindObjectOfType` | Constructor injection / pass down references | Avoid dynamic global search APIs. |
| `Time.deltaTime` | `dt` function argument | Passed into each loop handler. |
| `Time.timeScale` | `GameClock.timeScale` | Scaled game clock ticks. |
| Scene Management | `GameState` + level modules + `dispose()` | Teardown previous scene before mounting next. |

## Physics Mapping

| Unity Concept | Web Architecture |
|---|---|
| `Rigidbody` | `RAPIER.RigidBody` (`dynamic`, `kinematicPositionBased`, `fixed`). |
| `Collider` | `RAPIER.Collider` (`ball`, `capsule`, `cuboid`, `convexHull`, `trimesh`). |
| `CharacterController` | `KinematicCharacterController` (`physics/character.ts`). |
| `Physics.Raycast` | `world.castRay` with collision layer filters. |
| `LayerMask` / Collision Matrix | `physics/layers.ts` bitmasks + `setCollisionGroups`. |
| `OnTriggerEnter/Exit` | Sensor colliders + `EventQueue.drainCollisionEvents`. |
| `OnCollisionEnter` | Same event queue (`RAPIER.ActiveEvents.COLLISION_EVENTS`). |
| `Physics.gravity` | Assigned on `new RAPIER.World({ x, y, z })`. |

## Rendering, Animation & Assets

| Unity Concept | Web Architecture |
|---|---|
| `MeshRenderer` + Material | `THREE.Mesh` + shared `THREE.Material`. |
| GPU Instancing | `THREE.InstancedMesh` / `THREE.BatchedMesh`. |
| Animator / Animation Controller | `THREE.AnimationMixer` + `crossFadeTo`. |
| Cinemachine / Camera Rig | `camera-rig.ts` (framerate-independent damping + raycast zoom). |
| Light + Baked Lightmaps | 1 Directional light + Hemisphere fill + baked AO textures. |
| Particle System | `THREE.Points` or instanced quad particles with `Pool<T>`. |
| Addressables / Resources | `AssetManager` with dynamic `import()` and glTF loading. |

## Input, UI, Audio & Storage

| Unity Concept | Web Architecture |
|---|---|
| New Input System | Normalized `InputState` with polled `InputSource` providers. |
| Canvas UI | High-performance DOM / CSS HUD overlay (`#hud`) inside safe area. |
| AudioSource / Mixer | WebAudio (`AudioContext`, gain nodes); resume on initial user gesture. |
| `PlayerPrefs` | `platform/storage.ts` using `@capacitor/preferences`. |
| Object Pooling | Generic `Pool<T>`. |
| Unity Profiler | `renderer.info`, Chrome DevTools, Spector.js (`game-performance-audit`). |

## Key Pitfalls to Avoid
1. **Not everything needs to be a component.** Plain classes, functions, and arrays are simpler and significantly faster.
2. **Do not create complex prefab systems.** Simple factory functions returning scene groups and physics bodies are sufficient.
3. **Never use dynamic string queries (`GetComponent<T>()`).** Retain references upon creation.
4. **Never rely on Garbage Collection.** JavaScript GC stutter ruins 60 FPS experiences. Pre-allocate and pool scratch objects.
