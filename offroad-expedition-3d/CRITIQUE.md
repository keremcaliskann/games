# CRITIQUE.md — OFFROAD EXPEDITION 3D // 4X4 ROCK CRAWLER

## Game Director 4-Filter QA Critique Pass

### Filter A: Camera, 9:16 / 16:9 Ergonomics & Universal Input (`50-input-abstraction.md`)
- [x] **Unobstructed 360° Sightlines:** Elevated 3/4 offroad chase camera (`CameraRig`) with automatic zoom-out when the winch cable is engaged ensures clear sightlines across boulder ravines and mud bogs.
- [x] **Portrait (9:16) & Landscape (16:9) Responsive Framing:** Dynamic FOV (`64°` portrait / `54°` landscape) and distance scaling keep the 4x4 truck, roof cargo crate, and trailside winch anchor trees framed.
- [x] **Universal Input (`ErgonomicInput`):** Supports 1-hand floating virtual joystick + on-screen **🪝 WINCH CABLE** button on touch screens and `WASD` / Arrows + `Space`/`E` on desktop.

### Filter B: Art Direction, Compound Prefabs & ASMR Juice (`32-daylight-and-lighting.md`)
- [x] **Stylized Toony Soft Daylight:** Pastel sky (`0xcfe8f7`), studio `RoomEnvironment` IBL, warm golden sunlight (`0xfff6e5` at `1.25`), and 3 distinct expedition biomes (`Pine Mud Canyon`, `Moab Red Rock Ravine`, `Alaska Glacier Log Trail`).
- [x] **Dual-Path Hybrid 3D Prefab Pipeline:** Uses `AssetResolver.resolveHybridModel` (`public/models/crawler_truck.glb`) + `ProceduralMeshBuilder.createCarChassis` and `createDetailedWheel` with independent front/rear axle roll articulation, roof rack cargo crate, snorkel intake, and `ASSETS_NEEDED.md`.
- [x] **ASMR Audio & Visual Juice:** Pooled mud spray particles, live 3D steel winch cable line, outpost celebration bursts, and procedural Web Audio chimes.

### Filter C: YouTube Playables SDK, 3-Column Shell & Revenue Hooks (`62-youtube-playables.md`, `65-monetization-ads.md`)
- [x] **YouTube Playables SDK (`ytgame`):** `<script src="https://www.youtube.com/game_api/v1"></script>` first in `index.html`; `firstFrameReady()`, `gameReady()`, `onPause`/`onResume`, `onAudioEnabledChange`, and `loadData`/`saveData` wired.
- [x] **3 Mandatory Rewarded Ad Hooks:**
  1. In-Trail Expedition Boosters (`Super Winch Hoist`, `Mud Monster Tires`, `Diff-Lock Overdrive`).
  2. Near-Miss Stall/Overturn Revive (`Auto-Right + Super-Winch & +18s Fuel Time`).
  3. Victory Oscillating `1.5x / 2x / 3x / 5x` Multiplier Bar + persistent 4x4 Expedition Garage.
- [x] **3-Column Arcade Shell & Minimalist Theme-Matched Start Menu (`#shell-start-menu`):** Live 3D background behind `backdrop-filter: blur(12px)`, `MENU` State Lock (`!shell.isMenuOpen`), `Kolay / Normal / Zor` difficulty selector, and `ESC` / `⏸` pause toggle.

### Filter D: Technical & Release Integrity (`20-performance-budget.md`)
- [x] **Zero Hot-Path Allocations:** Pre-allocated `TrailSample` and pooled `ParticleEffects` (`96` reusable meshes) in `update()`.
- [x] **Build & Bundle Budget:** `npm run typecheck` and `npm run build` pass with 0 errors (`dist/` `< 2 MB`, well under `< 50 MB` limit).
