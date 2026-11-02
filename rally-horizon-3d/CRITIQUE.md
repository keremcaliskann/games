# CRITIQUE.md — RALLY HORIZON 3D // TIME ATTACK & DRIFT

## Game Director 4-Filter QA Critique Pass

### Filter A: Camera, 9:16 / 16:9 Ergonomics & Universal Input (`50-input-abstraction.md`)
- [x] **Unobstructed 360° Sightlines:** Elevated 36° chase camera (`CameraRig`) with centrifugal drift yaw lag and road slope look-ahead ensures zero terrain or barrier occlusion.
- [x] **Portrait (9:16) & Landscape (16:9) Responsive Framing:** Dynamic FOV (`64°` portrait / `54°` landscape) and distance scaling keep the rally car, road shoulders, and upcoming checkpoint arches framed in both orientations.
- [x] **Universal Input (`ErgonomicInput`):** Supports 1-hand floating virtual joystick on touch screens and `WASD` / Arrow keys + `Space`/`Shift` power-slide on desktop.

### Filter B: Art Direction, Compound Prefabs & ASMR Juice (`32-daylight-and-lighting.md`)
- [x] **Stylized Toony Soft Daylight:** Pastel sky (`0xcfe8f7`), studio `RoomEnvironment` IBL (`exposure: 0.96`), warm golden sunlight (`0xfff6e5` at `1.25`), and 3 distinct surface biomes (`Alpine Tarmac`, `Canyon Gravel`, `Nordic Snow & Mud`).
- [x] **Dual-Path Hybrid 3D Prefab Pipeline:** Uses `AssetResolver.resolveHybridModel` (`public/models/rally_car.glb`) + `ProceduralMeshBuilder.createCarChassis` and `createDetailedWheel` with roof scoop, mudflaps, and `ASSETS_NEEDED.md`.
- [x] **ASMR Audio & Visual Juice:** Pooled drift dust/smoke puffs, twin-turbo blue afterburners, checkpoint confetti bursts, and procedural Web Audio chimes/screech.

### Filter C: YouTube Playables SDK, 3-Column Shell & Revenue Hooks (`62-youtube-playables.md`, `65-monetization-ads.md`)
- [x] **YouTube Playables SDK (`ytgame`):** `<script src="https://www.youtube.com/game_api/v1"></script>` first in `index.html`; `firstFrameReady()`, `gameReady()`, `onPause`/`onResume`, `onAudioEnabledChange`, and `loadData`/`saveData` wired.
- [x] **3 Mandatory Rewarded Ad Hooks:**
  1. In-Stage Rally Boosters (`Twin-Turbo Nitro`, `Gravel Grip Tires`, `Co-Driver Racing Line +8s`).
  2. Near-Miss Stage Clock Revive (`+16s Clock & Twin-Turbo Surge`).
  3. Victory Oscillating `1.5x / 2x / 3x / 5x` Multiplier Bar + persistent WRC Tuning Garage.
- [x] **3-Column Arcade Shell & Minimalist Theme-Matched Start Menu (`#shell-start-menu`):** Live 3D background behind `backdrop-filter: blur(12px)`, `MENU` State Lock (`!shell.isMenuOpen`), `Kolay / Normal / Zor` difficulty selector, and `ESC` / `⏸` pause toggle.

### Filter D: Technical & Release Integrity (`20-performance-budget.md`)
- [x] **Zero Hot-Path Allocations:** Pre-allocated `RoadSample` and pooled `ParticleEffects` (`96` reusable meshes) in `update()`.
- [x] **Build & Bundle Budget:** `npm run typecheck` and `npm run build` pass with 0 errors (`dist/` `< 2 MB`, well under `< 50 MB` limit).
