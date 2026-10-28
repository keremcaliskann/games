# GAME DIRECTOR 4-FILTER CRITIQUE — `bumper-smash-io-3d`

### Filter A: Camera & 9:16 / 16:9 Ergonomics
- [x] Are bottom and side viewing angles 100% unobstructed (zero ground/pedestal blocking)?
  - Floating circular stone arena suspended over a bright pastel sea (`y = -4.2m`); zero foreground or bottom occlusion.
- [x] Does the game play effortlessly with one hand in both 9:16 portrait and 16:9 landscape?
  - 1-finger virtual thumbstick steering (`src/input/input-manager.ts`) + dynamic FOV (`58°` portrait / `46°` landscape) in `CameraRig`.

### Filter B: Art Direction, Compound Prefabs & ASMR Juice
- [x] Is the environment bright, sunlit, and vibrant?
  - Soft daylight sky `0xcfe8f7`, warm sun key `0xfff6e5` (`1.25`), warm cream arena `0xfcf8ee`, `VisualEnhancer` (`RoomEnvironment` IBL + Fresnel rim-lighting).
- [x] Are entities multi-part Compound Procedural Prefabs with `ASSETS_NEEDED.md` documented?
  - Multi-part `BumperKartRig` (beveled chassis, rubber torus bumper, driver helmet + visor, crown, spring antenna, 4 rotating wheels, deployable spike ring, nitro flame, vortex ring) + `ASSETS_NEEDED.md`.
- [x] Are particle bursts, squash-and-stretch, and Web Audio ASMR feedback satisfying?
  - Elastic bumper squash-and-stretch, pooled impact & splash particles, and Web Audio synth impact thuds, orb chimes, and victory arpeggios.

### Filter C: YouTube Playables SDK & Revenue Hooks
- [x] Is `<script src="https://www.youtube.com/game_api/v1"></script>` first in `index.html`?
- [x] Are `firstFrameReady()`, `gameReady()`, `onPause`/`onResume`, `onAudioEnabledChange`, and `loadData`/`saveData` wired?
- [x] Do all 3 Rewarded Ad hooks (In-Level Boosters: Mega Nitro / Magnet Vortex / Spike Armor, Near-Miss Rocket Revive, Victory Multiplier Bar) work end-to-end?
- [x] Does the 3-Column Arcade Shell render Left Navigation Sidebar and Right Ad Rail visibly with zero fullscreen toggle?
- [x] Zero external network fetches (CSP clean) and `dist/` bundle `< 50 MB`?

### Filter D: Technical & Release Integrity
- [x] Zero allocations in hot paths (`update`, `fixedUpdate`, `render`).
- [x] `npm run typecheck` and `npm run build` exit with code 0.
