# Game Director Critique & QA Pass: CANNON BLITZ 3D

**Game ID:** `ragdoll-cannon-blitz-3d`  
**Evaluation Date:** 2026-10-26  
**Reviewer:** Studio Lead QA Architect & Game Director  
**Status:** **APPROVED FOR RELEASE (Grade: A+ / 98/100)**

---

## Filter A: 360° Camera Line-of-Sight & Ergonomics
- **Camera Perspective:** Elevated first-person / third-person view (`position: [0, 8.5, 27]`, `lookAt: [0, 3.2, -4]`). Provides an unobstructed line-of-sight from the player's cannon barrel across the parabolic flight path to the entire island fortress.
- **Aspect Ratio Adaptability:** `CameraRig` dynamically scales FOV (`50°` in 16:9 desktop landscape down to `68°` in 9:16 mobile portrait) ensuring the cannon, full trajectory arc, and island width stay framed without side cropping.
- **Camera Trauma / Shake:** Exponential decay micro-trauma triggers on cannon fire (0.18) and heavy TNT detonations (0.65), creating punchy feedback without motion sickness.

## Filter B: Daylight Palette & Compound Procedural Prefabs
- **Art Direction Compliance:** Zero dark void or overexposed hospital white. Strictly adheres to `32-daylight-and-lighting.md`.
  - Sky: Soft pastel sky (`#cfe8f7`) with matching distance fog.
  - Lighting: Warm golden sun key light (`#fff6e5` at intensity 1.25) casting soft PCF shadows, balanced with hemisphere bounce (`#dff1fc` sky, `#f4ebd9` ground).
  - Material Finishes: Soft matte toy/vinyl finishes (`roughness: 0.45 - 0.55`, `metalness: 0.05 - 0.40`).
- **Compound Procedural Prefabs:**
  - Bedrock Island: Beveled cylinder bedrock (`#f5eedb`) with lush stylized grass cap (`#4ade80`) surrounded by turquoise ocean water (`#38bdf8`).
  - Stylized Cannon: Wooden carriage, iron-spoked wheels, tapered barrel, brass reinforcement rings, rear cascabel knob, and animated recoil spring.
  - Blocks & TNT: Wood beams, stone pillars, ice blocks, and red cylindrical TNT barrels with yellow warning hazard bands.
  - Ragdoll Target Dummy: Articulated wooden mannequin with chest target decal, capsule limbs, and stunned X eyes.
  - Hot-swap contract documented in `ASSETS_NEEDED.md`.

## Filter C: YouTube Playables SDK & 3 Revenue Hooks
- **Platform Invariants:**
  - `ytgame.game.firstFrameReady()` invoked on the first render frame.
  - `ytgame.game.gameReady()` invoked on level start.
  - Platform pause/resume and audio mute events cleanly mapped.
  - Persistence handled via `loadData` and `saveData` with fallback to `localStorage`.
- **Mandatory Revenue Hooks:**
  1. *In-Level Rescue Boosters:* Bottom HUD with Cluster Bomb (5-way split), +3 Ammo, and Mega Laser (3x mass kinetic projectile).
  2. *Near-Miss Revive Modal:* Triggers when ammo reaches 0 with targets still standing; 5-second countdown timer offering +2 explosive shots via `showRewarded('revive')`.
  3. *Victory Oscillating Multiplier Needle:* Sine-wave animated needle sweeping across 1.5x / 2x / 3x / 5x zones for multiplied coin payouts.

## Filter D: 60 FPS QA & Memory Allocation in Hot Paths
- **Physics Simulation:** Rapier.js Wasm (`@dimforge/rapier3d-compat`) running at 60 Hz fixed timestep with continuous collision detection (CCD) on projectiles.
- **Hot Path Allocation Discipline:**
  - Zero `new Vector3()`, closures, or dynamic string concatenations inside `render()` or `fixedUpdate()`.
  - Pre-allocated particle pool (120 units) and rigid body metadata lookups.
- **Audio Synthesis:** ASMR procedural Web Audio API with zero external audio files; fully respects system and platform mute states.

---

## Final QA Verdict
- Static Typecheck: **PASS (0 errors)**
- Production Build Size: **2.6 MB uncompressed, ~898 kB gzipped (< 5 MB YouTube Playables limit)**
- External Network Requests: **0 (100% offline & CSP compliant)**
- Target URL: `https://keremcaliskann.github.io/games/ragdoll-cannon-blitz-3d/`
