# Phase 1: Game Design Specification — CANNON BLITZ 3D

**Game ID:** `ragdoll-cannon-blitz-3d`  
**Title:** CANNON BLITZ 3D // PHYSICS DEMOLITION  
**Genre:** 3D Casual FPS Demolition & Physics Puzzle  
**Platforms:** YouTube Playables (`ytgame`), Yandex Games, CrazyGames, Poki, GitHub Pages, Android/iOS (Capacitor)  
**Target Frame Rate:** 60 FPS locked  
**Bundle Budget:** Strictly < 50 MB (expected ~600 kB)

---

## 1. Core Loop & 2-Second Hook
- **The Hook:** Within 2 seconds of entering the game, the player touches the screen: a glowing trajectory arc appears projecting toward a precarious 3D block tower with funny wobbling target dummies. Releasing fires a heavy iron cannonball that smashes the base pillar, toppling the tower and launching target dummies into the ocean with satisfying physics impacts and ASMR sound effects.
- **The Loop:**
  1. **Aim & Trajectory:** Touch and drag to aim the cannon. Visual trajectory arc calculates parabolic physics path with gravity preview.
  2. **Fire & Demolition:** Release to fire. Rapier.js simulates rigid-body physics collisions, toppling beams, and triggering TNT chain reactions.
  3. **Target Elimination:** Any target dummy knocked off the island into the sea or crushed to 0 HP registers as eliminated.
  4. **Level Complete & Progression:** Clear all targets within the par ammo limit to earn coins and unlock subsequent challenges.

---

## 2. 100% Solvable Level Math
- Every fortress level is mathematically pre-calibrated:
  - Weak-point columns (wooden pillars with lower mass and friction).
  - Strategically positioned red explosive barrels where a single direct hit collapses key structural supports.
  - Par ammo provides sufficient shots for both direct weak-point hits and casual misses.
  - If ammo is exhausted with targets still standing, the Near-Miss Revive trigger grants +2 explosive shots to guarantee victory.

---

## 3. Mandatory Revenue Hooks (YouTube Playables & Multi-Portal)

### Hook 1: In-Level Rescue Boosters (Bottom HUD)
- **Cluster Bomb Shot:** Splits into 5 explosive sub-munitions upon impact or mid-air (`showRewarded('booster_cluster')`).
- **+3 Extra Ammo:** Adds 3 cannonballs directly into the active magazine (`showRewarded('booster_ammo')`).
- **Mega Laser Shot:** Fires a 3x mass, high-velocity cannonball with extended laser trajectory guide (`showRewarded('booster_laser')`).

### Hook 2: Near-Miss Revive Modal
- Triggers when ammo reaches 0 and 1–2 target dummies are still standing.
- Offers a 5-second countdown modal: *"So Close! Watch Ad for +2 Explosive Shots to Finish Them!"* (`showRewarded('revive')`).

### Hook 3: Victory Oscillating Multiplier Bar
- Upon level clear, an oscillating needle sweeps across 1.5x / 2x / 3x / 5x segments.
- Tapping "CLAIM MULTIPLIED" triggers `showRewarded('victory_multiplier')` to multiply level coin earnings by the active segment value.

---

## 4. Art Direction & Camera Ergonomics
- **Stylized Toony Soft Daylight:**
  - Sky: Soft pastel sky blue `0xcfe8f7`.
  - Sunlight: Warm golden directional light `0xfff6e5` at intensity 1.25 with soft PCF shadows.
  - Ambient: Hemisphere bounce light (`0xdff1fc` sky, `0xf4ebd9` ground).
  - Island & Water: Sandy bedrock `0xf5eedb`, stylized green grass cap `0x4ade80`, vibrant turquoise ocean `0x38bdf8`.
  - Finishes: Matte toy/vinyl finish (`roughness: 0.45 - 0.55`, `metalness: 0.05`).
- **Camera Ergonomics:**
  - First-person / elevated 3D perspective looking toward the island fortress.
  - Dynamic FOV: 50° in 16:9 landscape adapting to 68° in 9:16 portrait to maintain full view of the cannon, trajectory arc, and island without side clipping.
