---
trigger: model_decision
description: "2-stage Producer-Consumer pipeline, token-optimized 3-Phase Studio Squad workflow, 3D camera line-of-sight ergonomics, YouTube Playables revenue hooks, and Game Director critique loop."
---

# Game Studio Pipeline & Critique Policy

## 1. Decoupled 2-Stage Studio Architecture (Producer – Consumer)

To maximize token efficiency, isolate market research from engineering context, and maintain a prioritized backlog of high-revenue game blueprints, the studio operates as **two decoupled automations** bridged by `backlog/ideas-backlog.json`:

```
+-----------------------------------------------------------------------------------------+
| AUTOMATION 1: TREND & REVENUE SCOUT (Producer)                                          |
| - Scans last 90 days of YouTube Playables, Hybrid-Casual mobile, and web portal hits    |
| - Re-validates & re-ranks existing 'ready' backlog items using 100-pt Revenue Matrix    |
| - Outputs Dual Reports: 1) Short Chat Summary  2) backlog/LATEST_TREND_REPORT.md        |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼ (backlog/ideas-backlog.json)
+-----------------------------------------------------------------------------------------+
| AUTOMATION 2: 3-PHASE STUDIO BUILDER & PUBLISHER (Consumer)                             |
| - Pulls #1 highest revenueScore 'ready' blueprint from backlog/ideas-backlog.json       |
| - Executes Phase 1 (DESIGN.md) -> Phase 2 (Implementation) -> Phase 3 (Director Audit)  |
| - Marks blueprint 'completed', updates portal, and pushes live to GitHub Pages          |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Token-Optimized 3-Phase Studio Squad (Inside Builder)

Instead of spawning a dozen disjoint subagents, the Builder executes **3 consolidated squads**:

### Phase 1: Studio Designer Squad (`DESIGN.md`)
1. **Core Loop & Instant 2-Second Hook:** Zero-text tutorial; player performs the first satisfying action within 2 seconds of `ytgame.game.gameReady()`.
2. **Deterministic Solvable Level Math:** Procedural or seeded level generator with a **100% solvability guarantee** and difficulty pacing.
3. **Revenue & Monetization Blueprint:** Defines the exact 3 mandatory Rewarded Ad hooks (In-Level Boosters, Near-Miss Revive, Victory 2x/3x/5x Multiplier Bar) and 90–120s Interstitial cooldown.
4. **3D Camera & Asset Spec:** Defines unobstructed 360° camera bounds, Compound Procedural 3D Prefabs, and optional `.glb` overrides for `ASSETS_NEEDED.md`.

### Phase 2: Studio Implementer Squad
Enforces all 7 technical domain checkpoints:
1. **YouTube Playables & Universal Portal Bridge (`src/platform/`):**
   - `<script src="https://www.youtube.com/game_api/v1"></script>` in `index.html`.
   - `firstFrameReady()`, `gameReady()`, `onPause`/`onResume`, `onAudioEnabledChange`, `loadData`/`saveData`, `sendScore`, and multi-portal auto-detection (`ytgame` -> `YaGames` -> `CrazyGames` -> `Poki` -> `Mock`).
2. **Engine & Physics (`core/`, `physics/`):** Fixed 1/60s timestep, spatial grid or lightweight Rapier colliders, object pools (`Pool<T>`).
3. **3D Camera & Line-of-Sight Ergonomics (Mandatory):**
   - **Zero ground/pedestal occlusion:** Never place decorative ground planes, pedestals, or props that obstruct viewing the puzzle/entities from underneath or extreme angles.
   - Dynamic FOV/distance scaling for both **9:16 portrait** (YouTube mobile app) and **16:9 landscape** (desktop).
4. **Compound Procedural 3D Prefabs & Hot-Swap Loader (`render/`):**
   - Multi-part hierarchical `THREE.Group` models (`ExtrudeGeometry`, `LatheGeometry`, procedural textures) + `public/models/` hot-swap `.glb` check + `ASSETS_NEEDED.md` specification.
   - Sunlit daylight environment (`HemisphereLight` + `DirectionalLight`) and high-saturation vibrant colors.
5. **Procedural ASMR Web Audio (`core/audio.ts`):** Zero-asset Web Audio synthesis strictly governed by `ytgame.system.onAudioEnabledChange`.
6. **3 Mandatory Revenue Loops (`ui/`, `game/`):** Working In-Level Boosters, Near-Miss Revive modal, and Victory Moving Multiplier bar.
7. **Dual-Mode Arcade Shell (`ui/`, `index.html`):** Auto-collapses sidebars for 100% full-viewport gameplay inside YouTube Playables / Yandex / CrazyGames (`?embed=1`), while displaying the 3-column Arcade Shell on GitHub Pages.

### Phase 3: Game Director Critique & Polish Loop (`CRITIQUE.md`)
Every build must pass all **4 Evaluation Filters** before deployment:
- **Filter A (Camera & Ergonomics):** Zero occlusion from bottom/sides; effortless one-hand play in both 9:16 portrait and 16:9 landscape.
- **Filter B (Art, Daylight & ASMR Juice):** Bright sunlit palette, multi-part 3D prefabs (no raw placeholder boxes), particle bursts, and tactile pitch-ramped audio.
- **Filter C (YouTube Playables SDK & Revenue Hooks):** `ytgame` lifecycle hooks wired, all 3 Rewarded Ad hooks (Booster, Revive, Multiplier) functional, zero external network calls (CSP clean), bundle `< 5 MB`.
- **Filter D (Technical & QA):** Zero per-frame heap allocations in hot paths; `npm run typecheck` and `npm run build` exit with code 0.

If any filter finds a defect, surgical polish patches must be applied immediately prior to `git push origin main`.
