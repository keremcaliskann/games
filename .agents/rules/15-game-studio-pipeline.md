---
trigger: model_decision
description: "User-driven folder-per-game planning (backlog/game-plans/<game-id>/), /feedback adaptation workflow, single Multi-Agent 4-Specialist Studio Executor, and 4-Filter Game Director critique loop."
---

# Game Studio Pipeline & Multi-Agent Critique Policy

## 1. User-Driven Game Planning, Feedback & Single Multi-Agent Executor Architecture

The studio operates with **zero automated external market research**. All new game concepts and existing game feedback originate from the user and flow into **one unified Multi-Agent Studio Executor**:

1. **`backlog/game-plans/<game-id>/`** — Dedicated Per-Game Blueprint Folders (created interactively via `/design` with zero question limits):
   - `STATUS.json`: `{ "id": "<game-id>", "title": "...", "status": "ready" | "in_progress" | "completed" | "draft", "priority": 1 }`
   - `DESIGN.md`: Exhaustive Game Design Document containing every mechanic, formula, map, AI rule, progression table, and UI layout agreed with the user.
   - `SPEC.json`: Machine-readable MetaGPT contract consumed by the 4 Studio Subagents.
2. **`backlog/studio-todo.json`** — Existing Games Feedback & Bugfix Queue (populated via `/feedback <oyun-adı>` or `/inspect <oyun-adı>`).

```
+-----------------------------------------------------------------------------------------+
| INTERACTIVE USER DESIGN (`/design`) & FEEDBACK (`/feedback <oyun-adı>`)                 |
| - `/design`: 6-stage unrestricted Q&A workshop -> saves complete game plan into         |
|   into `backlog/game-plans/<game-id>/` (`STATUS.json` + `DESIGN.md` + `SPEC.json`)      |
| - `/feedback <oyun-adı>`: Investigates root causes, clarifies choices, plans & applies  |
|   fixes directly to the game (or queues into `backlog/studio-todo.json`)                |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼ (`backlog/game-plans/<game-id>/` + `studio-todo.json`)
+-----------------------------------------------------------------------------------------+
| SINGLE AUTOMATION: MULTI-AGENT STUDIO EXECUTOR (`/studio` — Nightly at 23:00 & 04:00)   |
| - Argon High (Lead/Architect/QA Critic) + Argon Medium (3D Artist & Gameplay Engineer): |
|   1) Priority 1 (Existing Games Feedback Queue): If `backlog/studio-todo.json` has      |
|      `ready` tasks, dispatches specialist subagents to complete up to 4 tasks           |
|   2) Priority 2 (Planned New Game Build): Scans `backlog/game-plans/*/STATUS.json` for  |
|      the highest-priority folder with `status === "ready"` and builds it verbatim via   |
|      the 4-Subagent Studio Squad (`studio-architect` -> `studio-3d-artist` +            |
|      `studio-gameplay-engineer` -> `studio-qa-critic`)                                  |
| - Outputs a concise <= 6-line Turkish ASD-STE100 Maintenance Log report after execution |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Multi-Agent 4-Subagent Studio Squad (New Game Builder)

When `/studio` (or the scheduled Multi-Agent Studio Executor) builds a ready game from `backlog/game-plans/<game-id>/`, the Lead Orchestrator defines and dispatches **4 specialized subagents**:

### Phase 1: `studio-architect` Subagent (Argon High — `Model: "pro"`)
1. Reads `backlog/game-plans/<game-id>/DESIGN.md` and `backlog/game-plans/<game-id>/SPEC.json`, updates `STATUS.json` to `"in_progress"`, and copies `DESIGN.md` and `SPEC.json` into `<game-id>/` verbatim (preserving 100% of the user's planned details).
2. Scaffolds `<game-id>/package.json`, `tsconfig.json`, `vite.config.ts` (`base: './'`), `.gitignore`, and `public/manifest.json`.

### Phase 2A & 2B (Parallel Shards on Argon Medium — `Model: "inherit"`):
Once `<game-id>/SPEC.json` is in place, the Lead Orchestrator dispatches **two non-overlapping specialist subagents in parallel**:

#### Shard A: `studio-3d-artist` Subagent (`src/render/**` + `public/icon.svg` + `ASSETS_NEEDED.md`)
1. **Stylized Toony Soft Daylight (`32-daylight-and-lighting.md`):** Soft pastel sky (`0xcfe8f7`), warm sun key (`0xfff6e5`), warm biscuit/cream ground (`0xfcf8ee`), `VisualEnhancer.enhanceScene(scene)` (`environmentIntensity: 0.30`), and `toneMappingExposure: 0.90`.
2. **360° Camera & Viewport Ergonomics (`src/render/camera-rig.ts`):** Dynamic FOV/distance scaling for 9:16 portrait and 16:9 landscape matching `SPEC.json`; zero ground occlusion.
3. **Compound Procedural 3D Prefabs & Hot-Swap (`src/render/PrefabFactory.ts`):** Implements every method specified in `SPEC.json` using `ProceduralMeshBuilder` and `AssetResolver.resolveHybridModel(...)`, plus `src/render/effects.ts`, `public/icon.svg`, and `ASSETS_NEEDED.md`.

#### Shard B: `studio-gameplay-engineer` Subagent (`src/game/**` + `src/input/**` + `src/ui/**` + `src/core/**` + `src/platform/**` + `index.html`)
1. **YouTube Playables & Universal Portal Bridge (`src/platform/sdk.ts`, `index.html`):** `<script src="https://www.youtube.com/game_api/v1"></script>`, `firstFrameReady()`, `gameReady()`, `onPause`/`onResume`, `onAudioEnabledChange`, `loadData`/`saveData`.
2. **Full Planned Gameplay, Physics, Maps & Bot AI (`src/game/**`):** Implements every rule, map/biome, AI behavior, weapon/mechanic, and Garage/Upgrade progression specified in `DESIGN.md` and `SPEC.json`.
3. **Ergonomic Input, Web Audio & HUD (`src/input/input-manager.ts`, `src/core/audio.ts`, `src/ui/hud.ts`, `src/main.ts`):** Camera-relative movement, floating joystick, Universal Start Menu (`!shell.isMenuOpen` lock + `Kolay / Normal / Zor` difficulty scaling), and all 3 mandatory Rewarded Ad hooks.

### Phase 3: `studio-qa-critic` Subagent (Argon High — `Model: "pro"`)
An independent QA Critic subagent inspects and verifies the combined build:
1. Registers `<game-id>` in `games.json`, root `index.html`, and `shared/ui/shell-controller.ts`, then runs `node scripts/sync-shared-core.mjs`, `npm --prefix <game-id> install`, `npm --prefix <game-id> run typecheck`, and `npm --prefix <game-id> run build`.
2. Evaluates all **4 Game Director Filters** (Camera/Input Ergonomics, Soft Daylight & Prefabs, YouTube SDK & 3 Revenue Hooks, 60 FPS Zero Hot-Path Heap Allocations) and verifies every item in `DESIGN.md` is implemented.
3. Applies surgical fixes if any defect is detected, writes `<game-id>/CRITIQUE.md`, and sets `backlog/game-plans/<game-id>/STATUS.json` to `"completed"`.
