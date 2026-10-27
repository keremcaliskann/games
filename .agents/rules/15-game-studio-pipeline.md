---
trigger: model_decision
description: "2-stage Producer-Consumer pipeline, token-optimized 3-Phase Studio Squad workflow, 3D camera line-of-sight ergonomics, YouTube Playables revenue hooks, and Game Director critique loop."
---

# Game Studio Pipeline & Critique Policy

## 1. Decoupled 3-Automation, Dual-Queue Studio Architecture

To protect the user's daytime working quota (`10:00–18:00`) across 5-hour token reset cycles while separating strategic planning (`Argon 4 High`) from hands-on execution, the studio operates as **three decoupled automations** bridged by **two prioritized queues**:
1. **`backlog/ideas-backlog.json`** — New Game Blueprint Queue (populated by Trend Scout).
2. **`backlog/studio-todo.json`** — Existing Games Bugfix, Mechanical Upgrade & Polish Queue (populated by Game Director QA Architect).

```
+-----------------------------------------------------------------------------------------+
| AUTOMATION 1: TREND & GENRE SCOUT (Producer A — Every 3 Days at 18:00, Argon 4 High)    |
| - Scans YouTube Playables, CrazyGames, Poki & mobile hits across diverse high-retention |
|   genres: Fake-Multiplayer .io Arenas (Hole.io style), Casual FPS/Shooters, 3D Physics  |
|   Demolition, and Voxel/Minecraft-style Sandbox Action (not just repetitive puzzles!)   |
| - Adds 3+ mutually distinct game concepts per run & re-ranks backlog/ideas-backlog.json |
| - Outputs a concise <= 6-line Turkish summary + updates backlog/LATEST_TREND_REPORT.md  |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼ (backlog/ideas-backlog.json)
+-----------------------------------------------------------------------------------------+
| AUTOMATION 2: GAME DIRECTOR QA ARCHITECT (Producer B — Every 2 Days at 18:05, Argon High)|
| - Pure Inspector / Queueing pass (STRICT: ZERO DIRECT CODE EDITS, ONLY QUEUES TO-DO)   |
| - Deep-audits all active games against latest rules (AGENTS.md & .agents/rules/*.md)   |
| - Verifies working status of all core features, controls, audio, and 3 ad hooks         |
| - Inspects code and identifies performance bottlenecks & heap allocations               |
| - Evaluates visuals (Soft Daylight, materials, particles) and mechanics                 |
| - Extracts design & mechanical feedback, ONLY logs P0/P1/P2 tasks to studio-todo.json   |
| - Outputs a concise <= 6-line Turkish ASD-STE100 post-run summary                       |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼ (backlog/studio-todo.json + ideas-backlog.json)
+-----------------------------------------------------------------------------------------+
| AUTOMATION 3: STUDIO EXECUTOR (Consumer — Nightly at 23:00 & 04:00)                     |
| - Reads BOTH backlog/studio-todo.json and backlog/ideas-backlog.json in strict order:   |
|   1) Priority 1 (Existing Games First): Completes ALL 'ready' / 'in_progress' tasks in  |
|      backlog/studio-todo.json (P0 -> P1 -> P2), syncs shared UI/Ads core, and verifies  |
|   2) Priority 2 (Then 1 New Game): Pulls Rank #1 'ready' game from ideas-backlog.json   |
|      and builds/publishes 1 complete game end-to-end via the 3-Phase Studio Squad       |
| - Outputs a concise <= 6-line Turkish ASD-STE100 Maintenance Log report after execution |
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
