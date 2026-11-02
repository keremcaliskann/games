# RALLY HORIZON 3D // TIME ATTACK & DRIFT — Game Design Document

## 1. Core Loop & 2-Second Hook
- **Genre:** 3D Sim-Cade Rally & Time-Attack Drift (`Art of Rally`, `Colin McRae Rally`, and `PolyTrack` benchmark).
- **2-Second Hook:** Immediately after clicking **`OYNA`** on the Minimalist Theme-Matched Start Menu (`#shell-start-menu`), the player pilots an articulated 3D Rally Car across a winding sunlit mountain stage against 3 named Ghost/AI Rally Rivals (`LOEB_X`, `SOLBERG_99`, `MCRAE_PRO`), sliding through banked hairpins, hitting crest jumps, and crossing split-time sector checkpoints to beat the Gold Medal stage clock.
- **3 Surface Biomes (Automatic Rotation & Selection):**
  1. **STAGE 1: ALPINE TARMAC PASS** — High-grip asphalt ribbon (`grip: 1.0`) with sweeping S-curves and sunlit pine ridges.
  2. **STAGE 2: CANYON GRAVEL TRAIL** — Medium-slip terracotta gravel (`grip: 0.78`) with wide Scandinavian-flick hairpins and dust plumes.
  3. **STAGE 3: NORDIC MUD & SNOW CREST** — Technical low-grip snow/mud banks (`grip: 0.64`) with high-speed crest jumps and Gold Medal bonus multipliers.

## 2. Solvable Physics & Road Math Spec
- **Spring-Damper Raycast Suspension & Simplified Pacejka Slip Curve:**
  - Deterministic lateral slip angle velocity damping allows smooth, controllable power-slides without spin-outs or wall-locking.
  - Road width (`13.5m`) and soft shoulder banking automatically nudge the car back toward the centerline if the player clips an outer barrier, guaranteeing 100% stage completability.
- **Difficulty Scaling (`ShellController.getDifficultyMultiplier()`):**
  - `Kolay` (`0.78x`): Generous stage clock & relaxed rival ghost pace.
  - `Normal` (`1.0x`): Balanced championship pace.
  - `Zor` (`1.28x`): Aggressive pro-rally ghost pace and tighter Gold Medal target times.

## 3. Three Mandatory Rewarded Ad Revenue Hooks (`65-monetization-ads`)
1. **Hook 1 — In-Stage Rally Boosters (Bottom HUD Bar):**
   - **🔥 TWIN-TURBO NITRO (`booster_nitro`):** +45% acceleration and top speed with dual blue afterburner flames for 8 seconds.
   - **🛞 GRAVEL GRIP TIRES (`booster_grip`):** 100% maximum traction on gravel/mud/snow and +30% cornering speed for 12 seconds.
   - **🧭 CO-DRIVER RACING LINE (`booster_codriver`):** Illuminates the ideal 3D apex racing ribbon + adds +8s bonus stage clock.
2. **Hook 2 — Near-Miss Stage Clock / Off-Track Revive (`revive_stage`):**
   - When the stage clock expires within 18% of the finish line, prompts **"SO CLOSE TO THE FINISH! Watch Ad for +15s Clock + Full Twin-Turbo Surge"**.
3. **Hook 3 — Victory Oscillating Multiplier Bar (`victory_multiplier`) & Rally Garage:**
   - Dynamic 1.5x / 2x / 3x / 5x oscillating needle on the Stage Finish modal + persistent **Rally Tuning Garage** (6 Liveries + Turbo, Suspension & Tire Grip upgrades).

## 4. 360° Camera Ergonomics & Hybrid 3D Asset Spec
- **Camera:** Elevated 36° chase camera with smooth centrifugal drift yaw lag and slope look-ahead; zero terrain or barrier occlusion in both **9:16 portrait** and **16:9 landscape**.
- **Hybrid 3D Prefab Pipeline:** Uses `AssetResolver.resolveHybridModel` (`public/models/rally_car.glb`) with `ProceduralMeshBuilder.createCarChassis` + `createDetailedWheel` fallback.
