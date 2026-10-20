---
name: html5-game-development
description: Builds high-performance, 60 FPS HTML5 3D games without Unity bloat using Vite + Three.js + Rapier.js (Wasm) + Capacitor. Use for game loops, scene/lighting, glTF asset loading, physics/collisions, character controllers, multi-source input abstraction, and game architecture.
---

# HTML5 3D Game Development

Operational guide for developing high-performance, 60 FPS browser-based 3D games that run on desktop and port cleanly to Android/iOS via Capacitor.

## Workflow Order
1. Apply the core principles in `AGENTS.md`: Think First → Write Minimal Code → Surgical Edits → Goal-Oriented Verification.
2. Select the specific document from the **Decision Tree** below and read only that reference.
3. Locate existing patterns in the codebase; adhere to them, or adopt the reference pattern.
4. Implement the feature. Validate against `references/checklist.md` before finalizing.

## Decision Tree

| Task | Primary Reference |
|---|---|
| New project scaffold, Vite config, scripts, tsconfig | `references/vite-setup.md` |
| Folder structure, game loop, state machines, events, pooling | `references/architecture.md` |
| Scene setup, cameras, lighting, glTF, instancing, quality tiers | `references/render-and-assets.md` |
| Collisions, character controllers, raycasts, physics–render sync | `references/rapier-physics.md` |
| Keyboard / mouse / virtual touch joystick / gamepads | `references/input-system.md` |
| Translating Unity concepts to this stack | `references/unity-mapping.md` |
| Pre-completion verification | `references/checklist.md` |
| Packaging web builds for Android / iOS | `capacitor-mobile-port` skill |
| Diagnosing FPS drops, frame stutter, or memory leaks | `game-performance-audit` skill |
| Complex, multi-file, or ambiguous game systems | `plan-then-implement` skill |

## Default Technical Decisions

| Category | Default Choice | Exceptions |
|---|---|---|
| Language | TypeScript `strict` | Adhere to plain JS only if the repo is pre-existing JS |
| Rendering | `WebGLRenderer` | WebGPU only when explicitly requested |
| Physics | `@dimforge/rapier3d-compat` | Omit completely for non-physics prototypes |
| Timing | Single rAF + Fixed Timestep (1/60s) + Alpha Interpolation | Invariant |
| Assets | glTF (`.glb`) + Meshopt + KTX2 | Uncompressed `.glb` acceptable for early prototypes |
| Architecture | Modular classes + Systems | Full ECS only when thousands of homogeneous entities require it |
| UI | DOM / CSS overlay HUD | In-canvas UI only when strictly justified |
| Audio | WebAudio (`AudioContext`) | Third-party audio libraries require approval |
| Input | Abstracted `InputState` | Invariant |

## Core Invariants
1. **Single rAF loop:** Fixed timestep physics and gameplay logic; variable render with fractional alpha interpolation.
2. **Physics is the source of truth:** Three.js objects read physics transforms, never write directly to them during simulation.
3. **Gameplay logic reads `InputState`:** Systems remain completely decoupled from specific hardware devices.
4. **Zero allocations in hot paths:** Pool reusable entities (`Pool<T>`) and maintain module-level scratch math instances.
5. **Platform abstraction:** All native Capacitor plugins and browser discrepancies reside in `src/platform/`.
6. **Explicit disposal:** Every GPU geometry/material and Wasm body must be released via `.dispose()` and `.free()`.
7. **No magic numbers:** Balancing constants reside in `src/game/config/`.

## Anti-Pattern Quick Reference

| Prohibited Anti-Pattern | Correct Approach |
|---|---|
| Multiple `requestAnimationFrame` calls | Single game loop in `core/game-loop.ts` |
| Calling `world.step()` with variable `dt` | Fixed accumulator timestep |
| Using visual meshes as colliders | Simplified primitive colliders (capsule, box, sphere) |
| `new THREE.Vector3()` in update loops | Module-level scratch vectors |
| Direct key checking in game logic (`if key == 'w'`) | Normalized axes: `input.moveY` |
| Browser `setTimeout` for gameplay timers | `GameClock`-based delta accumulation (pauses cleanly) |
| Instantiating new meshes/bodies per projectile | Pre-warmed object pools (`Pool<T>`) |
| Unsolicited abstractions / premature ECS | Keep systems simple until profiling proves a bottleneck |

## Initial Scaffold Commands (New Project)

```bash
npm create vite@latest <project-name> -- --template vanilla-ts
cd <project-name>
npm i three @dimforge/rapier3d-compat
npm i -D @types/three
```
Apply the configurations detailed in `references/vite-setup.md`.
