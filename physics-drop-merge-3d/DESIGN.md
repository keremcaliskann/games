# Phase 1: Game Design Specification — DROP MERGE 3D

**Game ID:** `physics-drop-merge-3d`  
**Title:** DROP MERGE 3D // SPHERE SUIKA  
**Genre:** 3D Physics Sphere Merge & Puzzle (Suika / Watermelon style)  
**Platforms:** YouTube Playables (`ytgame`), Yandex Games, CrazyGames, Poki, GitHub Pages, Android/iOS (Capacitor)  
**Target Frame Rate:** 60 FPS locked  
**Bundle Budget:** Strictly < 50 MB (expected ~2.5 MB with Rapier Wasm)

---

## 1. Core Loop & 2-Second Hook
- **The Hook:** Within 2 seconds of entering, a primed Tier-1 Grape sphere hangs from the overhead dropper guide line above an acrylic cylinder container with a matching grape waiting below. Releasing drops the ball: it plunges with bouncy Rapier physics, collides, squishes, and merges with an ASMR pop and star sparkle burst into a Tier-2 Cherry!
- **The Loop:**
  1. **Aim:** Slide a finger/mouse horizontally to position the dropper above the cylinder. A vertical trajectory laser guide indicates the drop path.
  2. **Drop:** Release to drop the active sphere into the jar.
  3. **Rapier Physics Merge:** When two spheres of the same tier collide, they merge into the next higher tier, applying a subtle outward impulse to adjacent spheres and awarding combo points.
  4. **Tier Progression:** 11 total tiers (Grape ➔ Cherry ➔ Orange ➔ Lemon ➔ Kiwi ➔ Tomato ➔ Peach ➔ Pineapple ➔ Coconut ➔ Watermelon ➔ Golden Sun Core).
  5. **Danger Line:** Keep the sphere stack below the red container overflow line. If spheres breach the threshold for 3 continuous seconds, Near-Miss Revive is offered.

---

## 2. 100% Solvable / Balanced Container Math
- **Calibrated Radii & Mass:** Sphere radii scale smoothly from $0.45$ (Tier 1) to $2.1$ (Tier 11), with masses from $0.6$ kg to $18.0$ kg.
- **Weighted RNG Drop Distribution:** Dropper drops lower-tier spheres (Tier 1–3, with rare Tier 4), ensuring strategic planning and preventing premature jar congestion.
- **Physics Tuning:** High bounce restitution ($0.38$) and low roll resistance prevent premature stacking jams while maintaining stability.

---

## 3. Mandatory Revenue Hooks (YouTube Playables & Multi-Portal)

### Hook 1: In-Level Rescue Boosters (Bottom HUD)
- **Pop Shake:** Triggers an upward localized Rapier physics impulse to shake, settle, and unjam wedged spheres (`showRewarded('booster_shake')`).
- **Bomb Sphere:** Drops an explosive bomb sphere that vaporizes colliding lower-tier clutter (`showRewarded('booster_bomb')`).
- **Evolution Beam:** Instantly upgrades the next primed sphere by +1 tier (`showRewarded('booster_evolve')`).

### Hook 2: Near-Miss Revive Modal
- Triggers when spheres breach the danger line for 3 continuous seconds.
- Displays a 5-second countdown modal: *"Container Overflow! Watch Ad to Vaporize Top 3 Spheres & Keep Score Multiplier!"* (`showRewarded('revive')`).

### Hook 3: Victory / High Score Multiplier Needle
- Upon game over or milestone clear, an oscillating needle sweeps across 1.5x / 2x / 3x / 5x zones.
- Tapping "CLAIM MULTIPLIED" triggers `showRewarded('victory_multiplier')` to multiply earned coins.

---

## 4. Art Direction & Camera Ergonomics
- **Stylized Toony Soft Daylight:**
  - Sky: Soft pastel sky blue `0xcfe8f7`.
  - Sunlight: Warm golden directional light `0xfff6e5` at intensity 1.25 with soft PCF shadows.
  - Cylinder: Translucent acrylic jar with soft cyan tint `0xe0f2fe`, smooth lip, and glowing danger ring.
  - Spheres: Candy glossy finishes (`roughness: 0.25 - 0.35`, `metalness: 0.05`) with cute stylized fruit faces.
- **Camera Ergonomics:**
  - High-angle 3D view looking down into the jar opening.
  - Dynamic camera pullback: camera smoothly pulls backward and upward as the sphere stack height increases.
  - Dynamic FOV: 48° in 16:9 landscape adapting to 65° in 9:16 portrait.
