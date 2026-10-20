---
name: game-performance-audit
description: Diagnoses and systematically resolves FPS drops, frame stutter (jank), GC pauses, excessive draw calls, memory leaks, and mobile thermal throttling in Three.js + Rapier.js games. Always measure first before modifying code.
---

# Game Performance Audit

**Core Principle:** Measure → Diagnose → Make a **Single** Change → Re-measure. Never perform speculative optimizations, and avoid changing multiple subsystems simultaneously.

## Step 1: Measure the Baseline

If the project lacks an active profiler, add a lightweight runtime monitor behind `?debug=1` (DEV only):

```ts
// core/perf-monitor.ts
export class PerfMonitor {
  frameMs = 16.7; // Exponential Moving Average (EMA)
  private last = performance.now();

  tick(now: number): void {
    const dt = now - this.last;
    this.last = now;
    this.frameMs += (dt - this.frameMs) * 0.05; // Smooth over outlier spikes
  }

  get fps(): number { return 1000 / this.frameMs; }
}
```
Record: average frame time, 1% low frame time, draw calls (`renderer.info.render.calls`), rendered triangles, geometry/texture counts, physics step duration, and logic duration. Test from a fixed camera perspective in the same scene.

## Step 2: CPU vs. GPU Bottleneck Isolation

A quick diagnostic: temporarily halve the pixel ratio: `renderer.setPixelRatio(0.5)`.
| Observation | Diagnosis |
|---|---|
| FPS increases significantly | **GPU / Fill-rate bound** (shader complexity, overdraw, resolution, shadows). |
| FPS remains unchanged | **CPU bound** (JS logic, physics simulation, draw call submission). |

## Step 3: Diagnostic Decision Tree

| Symptom | Likely Cause | First Diagnostic Step |
|---|---|---|
| Consistently high frame time, CPU bound | Excessive draw calls | Check `info.render.calls`; implement `InstancedMesh` or merge static props. |
| Periodic frame spikes (sawtooth pattern) | Garbage Collection in hot loops | Record CPU profile in DevTools; search for `new`, closures, or array methods in loops. |
| Stutter on initial action / spawn | Shader compilation / dynamic asset loading | Pre-warm shaders using `renderer.compile()` during loading screens. |
| GPU bound | High render resolution, heavy shadows, overdraw | Clamp pixel ratio, reduce shadow map size, convert `MeshStandard` to `MeshLambert`. |
| High physics timestep duration | Excessive dynamic bodies, complex trimeshes | Verify sleeping bodies, replace trimeshes with primitive capsules/cubes. |
| Memory increases continuously | Unreleased GPU resources, leaking event listeners | Perform 5 consecutive level transitions; inspect `renderer.info.memory`. |
| Performance degrades after 3–5 minutes | Mobile device thermal throttling | Check device thermals, lower quality tier, verify on multiple hardware targets. |

## Step 4: Resolution Hierarchy (Cheapest to Most Invasive)

1. Enforce pixel ratio caps and disable dynamic shadow maps on static scenes.
2. Clean up hot-path allocations: introduce scratch math objects, flat `for` loops, and object pools.
3. Merge static geometries or convert repeated models to `InstancedMesh`.
4. Set `matrixAutoUpdate = false` on static meshes.
5. Simplify materials (prefer Lambert/Basic materials with baked ambient occlusion).
6. Downscale textures and compress via KTX2.
7. Simplify colliders and restrict active dynamic bodies.
8. Invasive refactoring (ECS, Web Workers) should be the last resort and requires benchmark evidence plus a plan.

## Step 5: Adaptive Quality Controller

```ts
// render/adaptive-quality.ts
export class AdaptiveQuality {
  private level: number;
  private slowAccMs = 0;

  constructor(
    private readonly maxLevel: number,
    startLevel: number,
    private readonly apply: (level: number) => void,
  ) { this.level = startLevel; }

  update(frameMsAvg: number, dtMs: number): void {
    if (frameMsAvg > 20) this.slowAccMs += dtMs; // Operating below ~50 FPS
    else this.slowAccMs = 0;

    if (this.slowAccMs > 1000 && this.level > 0) {
      this.level--;
      this.slowAccMs = 0;
      this.apply(this.level); // Lower pixel ratio, reduce shadow resolution, or shorten draw distance
    }
  }
}
```
Never automatically raise quality tiers (on a 60 Hz VSync display, spare capacity cannot be accurately computed). Let users increase quality manually in settings.

## Step 6: Memory Leak Verification

1. Cycle through a scene or level restart 5 consecutive times.
2. Record `renderer.info.memory.geometries` and `.textures` after each restart.
3. If counts increase monotonically, identify un-disposed resources. Compare DevTools Heap Snapshots to find lingering event listeners.
4. Verify that previous Rapier `World` instances are deallocated via `.free()`.

## Audit Report Format (≤ 10 Lines)

```
Scene / Device: Level 1 on Pixel 7 (Android WebView)
Before: Frame 24.1 ms · Calls 410 · Triangles 880K · Physics 2.1 ms
Diagnosis: CPU bound; draw call bottleneck (180 separate foliage mesh draws)
Change: Converted foliage to InstancedMesh (single change)
After:  Frame 15.8 ms · Calls 62 · Triangles 880K · Physics 2.1 ms
Note: Stable 60 FPS achieved; memory counters flat after reload.
```
