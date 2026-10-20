---
trigger: model_decision
description: "Token-optimized 3-Phase Studio Squad workflow, 3D camera line-of-sight ergonomics, and mandatory Game Director critique loop."
---

# Game Studio Pipeline & Critique Policy

## 1. Core Architectural Principle
Developing high-quality HTML5 3D games requires rigorous domain specialization without inducing massive multi-agent token overhead. The workspace adopts the **Token-Optimized 3-Phase Studio Squad Model**:
13 granular game studio responsibilities are consolidated into **3 focused phases** with strict domain checklists.

```
+-----------------------------------------------------------------------------------------+
| PHASE 1: STUDIO DESIGNER                                                                |
| - Trend & Market Scout | Core Loop & Level Math | Economy & Ad Cadence                  |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼ (DESIGN.md)
+-----------------------------------------------------------------------------------------+
| PHASE 2: STUDIO IMPLEMENTER                                                             |
| - Engine & Physics | Gameplay & Controls | 3D Camera & Line-of-Sight Ergonomics          |
| - Vibrant Daylight Lighting & Materials  | Procedural Audio (Web Audio API)             |
| - 3-Column Arcade Shell & Icon Pipeline                                                 |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼ (Working Build)
+-----------------------------------------------------------------------------------------+
| PHASE 3: GAME DIRECTOR CRITIQUE & POLISH LOOP                                           |
| - Filter A: Camera & Ergonomics (Zero occlusion from below/sides, line-of-sight check)  |
| - Filter B: Art & Game Feel (Sunlight, vibrant palette, squash & stretch, juice)       |
| - Filter C: Technical & Performance (Zero allocations in hot paths, typecheck, build)   |
| ──> [Apply Polish Patches] ──> [Game Director Sign-off] ──> [Git Push to Live]          |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Phase 1: Studio Designer Squad
Before writing code, the designer consolidates:
1. **Core Loop & Player Promise:** Ultra-simple entry point, pick-up-and-play mechanics, clear player feedback.
2. **Level Progression & Math:** Procedural or curated level generator with a **100% solvability guarantee** and smooth onboarding-to-mastery curve.
3. **Monetization & Economy:** Soft currency pricing, opt-in rewarded ad rewards, and non-intrusive interstitial intervals (minimum 90–120s between triggers).

---

## 3. Phase 2: Studio Implementer Squad
The implementer builds the game while strictly enforcing the 6 technical domain checkpoints:
1. **Engine & Physics (`core/`, `physics/`):** Fixed 1/60s timestep, simplified primitive colliders or spatial grid math, object pools (`Pool<T>`).
2. **Gameplay & Input (`input/`, `game/`):** Unified touch/mouse raycasting vs. drag detection, robust state machine (Menu, Playing, Paused, Victory).
3. **3D Camera & Line-of-Sight Ergonomics (Mandatory):**
   - The camera must allow 360° unobstructed inspection.
   - **Zero ground/pedestal occlusion:** Never place decorative pedestals, ground planes, or props that block the camera when viewing the puzzle or game entities from underneath or from extreme angles.
   - Dynamic target radius scaling based on level/world bounds.
4. **Art Direction & Lighting (`render/`):**
   - Vibrant, high-saturation color palette.
   - Sunlit daylight environment (`scene.background` matching sky tone, `HemisphereLight` white/warm ground bounce, `DirectionalLight` sun with tight contact shadows).
5. **Procedural Audio (`core/audio.ts`):** Zero-asset Web Audio API synthesis for clicks, whooshes, bonks, combos, and victory arpeggios.
6. **Arcade Shell (`ui/`, `index.html`):** 3-column desktop layout (left navigation & other games list, center ResizeObserver canvas, right ad rail) + sticky ad banner in fullscreen mode + `public/icon.svg`.

---

## 4. Phase 3: Game Director Critique & Polish Loop
Every new game or major feature must undergo a structured critique before being marked as done:

### 4.1 The 3 Evaluation Filters
- **Filter A (Camera & Playability):**
  - Does any geometry, pedestal, or UI overlay obstruct line-of-sight at any camera pitch?
  - Can a first-time player understand what to do within 3 seconds?
- **Filter B (Art & Juice):**
  - Is the scene bright, cheerful, and well-lit? Are interactive elements visually distinct from the background?
  - Does success feel rewarding? (Particle bursts, camera trauma impulse, tactile audio pitch ramps).
- **Filter C (Technical & QA):**
  - `npm run typecheck` and `npm run build` must exit with code 0.
  - Zero heap allocations inside `update`, `fixedUpdate`, or `render`.

### 4.2 Polish Patch Execution
If any filter identifies flaws (e.g., camera obstruction, dull colors, poor contrast), the implementer must immediately apply surgical polish patches. Only after all 3 filters pass may the code be committed and pushed to `origin/main`.
