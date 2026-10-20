---
trigger: model_decision
description: "Performance budget, 60 FPS, frame time, draw calls, memory management, GC pauses, and mobile quality tiers."
---

# Performance Budget (60 FPS)

> The metrics below are **baseline targets**; always verify with real profiling data on target devices. Never optimize without measuring first.

## Frame Budget (16.6 ms)
| Section | Desktop | Mobile |
|---|---|---|
| Physics (`world.step`) | ≤ 3 ms | ≤ 4 ms |
| Game Logic | ≤ 3 ms | ≤ 3 ms |
| Render (CPU side) | ≤ 4 ms | ≤ 5 ms |
| Safety Margin / Headroom | ≥ 5 ms | ≥ 4 ms |

## Scene Budget
| Metric | Desktop Target | Mobile Target |
|---|---|---|
| Draw Calls | ≲ 300 | ≲ 100 |
| Triangles (visible) | ≲ 1 M | ≲ 250 K |
| Texture Dimensions | ≤ 2048–4096 | ≤ 1024–2048 |
| Real-Time Lights | ≤ 4 | ≤ 2 |
| Shadows | 1 directional | 1 directional or baked/blob |
| Post-Processing | Optional | None by default |

Texture memory cost formula: `width × height × 4 bytes × 1.33` (with mipmaps). A single 2048² texture consumes ~22 MB of GPU VRAM; resize textures exceeding target thresholds.

## Profiling & Measurement Tools
- Three.js runtime stats: `renderer.info.render.calls`, `.triangles`, `renderer.info.memory.geometries`, `.textures`.
- Calculate frame times using an Exponential Moving Average (EMA); avoid judging performance on single outlier frames.
- Chrome DevTools → Performance panel (CPU & GC tracking), Spector.js (WebGL draw call inspection), `chrome://inspect` on Android, and Safari Web Inspector on iOS.
- Procedure: follow the `game-performance-audit` skill.

## Memory & Garbage Collection (GC)
- Zero allocations in hot loops (refer to `10-code-quality`). Use `Pool<T>` for projectiles, particles, and floating damage numbers.
- Prefer TypedArrays (`Float32Array`) over arrays of objects for large numeric buffers.
- Note: Rapier's `body.translation()` and `rotation()` allocate new objects on each call. Only synchronize active, non-sleeping (`!isSleeping()`), and visible entities.
- Ensure the `dispose()` cascade executes cleanly on scene/level transitions. Verify that `renderer.info.memory` returns to baseline after 5 scene transitions.

## Rendering Efficiency
- Clamp pixel ratios: `renderer.setPixelRatio(Math.min(devicePixelRatio, tier.maxPixelRatio))`. Maximum limits: desktop 2.0, mobile 1.5.
- Antialiasing is fixed at renderer creation. Dynamically tune quality via pixel ratio, shadow map resolution, and camera draw distance.
- Disable matrix recalculation for static objects: `mesh.matrixAutoUpdate = false; mesh.updateMatrix();`.
- Use `InstancedMesh` whenever rendering ≥ 10 instances of identical geometry and materials.

## Adaptive Quality
- If the EMA frame time exceeds 20 ms (~50 FPS) for more than 1 second, reduce the quality tier by one step.
- Never automatically raise quality tiers (on a 60 Hz VSync display, spare capacity cannot be reliably measured). Let users increase quality in game settings.
- Account for thermal throttling: if performance drops after 3–5 minutes on mobile, investigate device thermals rather than chasing phantom regressions.

## Asset Loading & Delivery
- Initial asset bundle target: ≲ 5 MB downloaded data. Lazy-load non-essential scenes and assets with dynamic `import()`.
- Use glTF 2.0 with Meshopt geometry compression and KTX2 textures (which stay compressed in GPU memory).
- Note: WebP/PNG only reduces network transfer size, not GPU VRAM consumption.
