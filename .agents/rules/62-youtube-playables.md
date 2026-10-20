---
trigger: model_decision
description: "YouTube Playables SDK (ytgame) integration, universal multi-portal bridge (Yandex Games, CrazyGames, Poki), CSP & bundle budget, dual-mode viewport shell, and hot-swap 3D asset pipeline."
---

# YouTube Playables & Multi-Portal Architecture Policy

## 1. Primary Target & Universal Compatibility Principle
All games in this workspace are engineered **first and foremost for YouTube Playables (`ytgame` SDK)**. Because YouTube Playables enforces the strictest technical constraints in the HTML5 gaming ecosystem (strict zero-external-network CSP, `< 5 MB` initial load target, mandatory audio/pause lifecycle hooks, and responsive 9:16 portrait + 16:9 landscape ergonomics), every game built to this standard is **simultaneously compatible with Yandex Games, CrazyGames, Poki, and GitHub Pages** via a single `src/platform/` adapter.

---

## 2. YouTube Playables SDK (`ytgame`) Lifecycle Contract

### 2.1 Script Inclusion (`index.html`)
Every game's `index.html` must include the official YouTube Playables SDK script as the **very first `<script>` tag inside `<head>`** before any module bundles load:
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
  <script src="https://www.youtube.com/game_api/v1"></script>
  <!-- ... -->
</head>
```

### 2.2 Platform Bridge (`src/platform/sdk.ts`)
All platform lifecycle, cloud save, audio sync, and score reporting calls must flow through `src/platform/sdk.ts`:

1. **Boot & Readiness Signals:**
   - Call `ytgame.game.firstFrameReady()` immediately after the first WebGL frame or splash canvas renders.
   - Call `ytgame.game.gameReady()` immediately once the main menu or initial level is interactive (also triggers `CrazyGames.SDK.game.loadingStop()`, `ysdk.features.LoadingAPI?.ready()`, or `PokiSDK.gameLoadingFinished()` when running on those portals).
2. **System Pause & Resume Lifecycle:**
   - Subscribe to `ytgame.system.onPause(() => ...)` and `ytgame.system.onResume(() => ...)`.
   - Pause the `GameClock`, physics step, and audio synthesizer on pause; cleanly resume on unpause.
3. **Mandatory Platform Audio Sync:**
   - Query `ytgame.system.isAudioEnabled()` at startup and subscribe to `ytgame.system.onAudioEnabledChange((isEnabled: boolean) => ...)`.
   - Synchronize `SoundController.setMuted(!isEnabled)` immediately so YouTube's native mute toggle strictly governs all Web Audio synthesis.
4. **Cloud Save (`loadData` / `saveData`) with Local Fallback:**
   - Always `await ytgame.game.loadData()` **before** invoking `ytgame.game.saveData(jsonPayload)` (YouTube rejects `saveData` if `loadData` has not completed first).
   - Keep serialized JSON save payloads compact (`< 100 KB`, well below the 3 MiB hard cap).
   - Fall back to `localStorage` seamlessly when `!window.ytgame?.IN_PLAYABLES_ENV`.
5. **Engagement & Score Reporting:**
   - Invoke `ytgame.engagement.sendScore({ value: Math.floor(score) })` (must be an integer) upon level completion or high-score milestones.

---

## 3. Universal Multi-Portal Runtime Detection

Game code must never branch on portal globals directly. `src/platform/` detects the active host environment in priority order:

| Priority | Platform | Detection Condition | Viewport Mode |
|---|---|---|---|
| **1** | **YouTube Playables** | `Boolean(window.ytgame?.IN_PLAYABLES_ENV)` | **100% Full-Viewport** (Sidebars hidden) |
| **2** | **Yandex Games** | `Boolean((window as any).YaGames)` | **100% Full-Viewport** (Sidebars hidden) |
| **3** | **CrazyGames** | `Boolean((window as any).CrazyGames?.SDK)` | **100% Full-Viewport** (Sidebars hidden) |
| **4** | **Poki** | `Boolean((window as any).PokiSDK)` | **100% Full-Viewport** (Sidebars hidden) |
| **5** | **GitHub Pages Portal** | Default fallback (unless `?embed=1` is present) | **3-Column Arcade Shell** |

---

## 4. Strict CSP, Bundle Size & Aspect-Ratio Invariants

1. **Zero Unauthorized External Network Calls (CSP):**
   - Never fetch external fonts (Google Fonts CDN), external audio files, remote textures, or analytics trackers at runtime.
   - Use system UI font stacks (`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`), procedural Web Audio (`35-procedural-audio`), and bundled/procedural 3D assets.
2. **Bundle Budget:**
   - Target total production `dist/` size `< 5 MB` (YouTube Playables hard cap is 30 MB; keeping builds `< 5 MB` guarantees sub-second `firstFrameReady()` and maximum player conversion).
3. **Portrait (9:16) & Landscape (16:9) Universal Ergonomics:**
   - Because YouTube Playables is heavily played in **9:16 portrait mode** on the YouTube mobile app as well as **16:9 landscape** on desktop, the `CameraRig` FOV/distance and HUD overlays must dynamically adapt to both aspect ratios without clipping UI buttons or 3D puzzle bounds.

---

## 5. 3-Tier Asset & Hot-Swap 3D Prefab Architecture

To ensure games are 100% playable out-of-the-box while allowing effortless manual 3D model upgrades by the user:

1. **Tier 1 — Compound Procedural 3D Prefabs (`src/render/PrefabFactory.ts`):**
   - Never use bare primitive boxes/spheres as final art. Construct multi-part hierarchical `THREE.Group` prefabs using beveled `ExtrudeGeometry`, `LatheGeometry` (screws, bottles, pins, coins, tokens), procedural canvas textures, and crisp `MeshStandardMaterial` highlights.
   - Use the `image-generator` subagent when custom 2D icons, badges, or texture atlases are needed.
2. **Tier 2 — Hot-Swap `.glb` Loader Hook:**
   - `PrefabFactory` checks whether an optional override model exists in `public/models/<entity>.glb` (registered via a lightweight manifest flag). If present, it loads and clones the `.glb`; otherwise, it instantaneously returns the procedural prefab with zero errors or network delays.
3. **Tier 3 — `ASSETS_NEEDED.md` Specification Card:**
   - Whenever a game would visually benefit from bespoke external `.glb` models, the developer agent writes a concise `ASSETS_NEEDED.md` in the project root listing:
     - Exact file path (`public/models/<name>.glb`)
     - Target triangle budget (`< 3,000 tris`), bounding-box dimensions (`1x1x2 units`), and orientation (`Y-up, +Z forward`).
   - When the user drops files into `public/models/`, the `asset-integrator` skill calibrates scale, materials, shadows, and physics colliders automatically.
