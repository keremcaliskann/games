# Game Director & QA Critic Audit (`ragdoll-archers-duel-3d`)

### Filter A: Camera & 9:16 / 16:9 Ergonomics
- [x] Are bottom and side viewing angles 100% unobstructed (zero ground/pedestal blocking)?
  - Floating sunlit stone duel bastions (`createBastionColumn`) use tapered sky-island rock cones above a distant pastel sea (`y = -9.5`), eliminating floor grid clutter and bottom HUD occlusion.
- [x] Does the game play effortlessly with one hand in both 9:16 portrait and 16:9 landscape?
  - `CameraRig.resize()` dynamically adjusts FOV (`58°` in 9:16 portrait, `44°` in 16:9 landscape) and camera Z (`27.5` in portrait, `18.5` in landscape) so both player (`x = -6.2`) and tiered enemy bastions (`x = +3.4 .. +7.6`) remain 100% in frame.

### Filter B: Art Direction, Compound Prefabs & ASMR Juice
- [x] Is the environment bright, sunlit, and vibrant? (STRICT: scene.background >= 0xbae6fd or pastel daylight, warm Hemisphere ground bounce >= 0xd0d0d0, zero dark voids, zero black floor grids).
  - `DaylightLighting` enforces `scene.background = 0xcfe8f7`, `HemisphereLight(0xffffff, 0xe2e8f0, 0.92)`, and `DirectionalLight(0xfff6e5, 1.25)`.
- [x] Are entities multi-part Compound Procedural Prefabs (no raw placeholder boxes) with `ASSETS_NEEDED.md` documented?
  - `PrefabFactory` constructs articulated multi-joint archer rigs (head, helmet plume, torso sash, legs, bow arm, Catmull-Rom recurve bow, dynamic 3-vertex bowstring, 3D billboard HP bar, and Guardian Shield dome), crenellated stone bastions, feathered arrows, and balloon-tethered flying apples.
- [x] Are particle bursts, squash-and-stretch, and Web Audio ASMR feedback satisfying?
  - Pooled dodecahedron bursts (`ParticleEffects`), damped harmonic torso/head recoil springs, comedic ragdoll launch spin, and Web Audio synth cues (`playBowDraw`, `playBowRelease`, `playHeadshotCrit`, `playAppleCrunch`).

### Filter C: YouTube Playables SDK & Revenue Hooks
- [x] Is `<script src="https://www.youtube.com/game_api/v1"></script>` first in `index.html`?
- [x] Are `firstFrameReady()`, `gameReady()`, `onPause`/`onResume`, `onAudioEnabledChange`, and `loadData`/`saveData` wired?
- [x] Do all 3 Rewarded Ad hooks (In-Level Boosters: Triple Shot / Laser Arrow / Guardian Shield, Near-Miss Revive Modal, Victory Multiplier Bar) work end-to-end?
- [x] Does Dual-Mode Shell hide sidebars in embedded portal mode (`?embed=1` / `ytgame`) and show Arcade Shell on GitHub Pages?
- [x] Zero external network fetches (CSP clean) and `dist/` bundle `< 50 MB` (`~0.52 MB`).

### Filter D: Technical & Release Integrity
- [x] Zero allocations in hot paths (`update`, `fixedUpdate`, `render`).
- [x] `npm run typecheck` and `npm run build` exit with code 0.
