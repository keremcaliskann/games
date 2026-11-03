---
trigger: model_decision
description: "Decoupled 3-automation Producer-Consumer pipeline, Multi-Agent 4-Specialist Studio Squad (MetaGPT SPEC.json + BMAD Sharding + ChatDev QA Gate), 3D camera ergonomics, and 4-Filter Game Director critique loop."
---

# Game Studio Pipeline & Multi-Agent Critique Policy

## 1. Decoupled 3-Automation, Dual-Queue Multi-Agent Studio Architecture

To protect daytime working quota (`10:00–18:00`) while preventing context bloat and schedule collisions, the studio operates as **three decoupled automations** bridged by **two prioritized queues** (`backlog/ideas-backlog.json` and `backlog/studio-todo.json`), powered by **parallel subagents**:

```
+-----------------------------------------------------------------------------------------+
| AUTOMATION 1: TREND & GENRE SCOUT (Producer A — Every 3 Days at 18:00)                  |
| - Spawns parallel read-only `research` subagents (Model: "flash") across the 5          |
|   Large-Scale 3D Fake-Multiplayer (.io & Royale) sub-genres in `scout-directives.json`  |
| - Adds 3–4 mutually distinct game blueprints & re-ranks `backlog/ideas-backlog.json`    |
| - Outputs a concise <= 6-line Turkish summary + updates `backlog/LATEST_TREND_REPORT.md`|
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼ (backlog/ideas-backlog.json)
+-----------------------------------------------------------------------------------------+
| AUTOMATION 2: GAME DIRECTOR QA ARCHITECT (Producer B — Every 2 Days at 19:00)           |
| - Shifted to 19:00 to guarantee zero Git push collision with 18:00 Producer A           |
| - Spawns parallel `research` subagents (Model: "flash") auditing active games in        |
|   3–4 game batches (Rule compliance, hot-path allocations, Soft Daylight, mechanics)    |
| - STRICT PRODUCER ROLE: ZERO direct game code edits; ONLY queues P0/P1/P2 tickets into  |
|   `backlog/studio-todo.json` and outputs a concise Turkish summary + active task table  |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼ (backlog/studio-todo.json + ideas-backlog.json)
+-----------------------------------------------------------------------------------------+
| AUTOMATION 3: MULTI-AGENT STUDIO EXECUTOR (Consumer — Nightly at 23:00 & 04:00)         |
| - Load-Balanced Multi-Agent Execution (`12-multi-agent-orchestration.md`):              |
|   1) Priority 1 (Existing Games Queue): If `backlog/studio-todo.json` has `ready`       |
|      tasks, dispatches specialist subagents to complete up to 4 tasks (`P0 -> P1 -> P2`)|
|   2) Priority 2 (Load-Balanced New Game Build): If pending `studio-todo.json` count     |
|      at start of run was <= 2 (or 0), pulls Rank #1 `ready` blueprint from              |
|      `backlog/ideas-backlog.json` and builds it via the 4-Subagent Studio Squad         |
| - Outputs a concise <= 6-line Turkish ASD-STE100 Maintenance Log report after execution |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Multi-Agent 4-Subagent Studio Squad (New Game Builder)

Instead of overloading a single monolithic agent, the Lead Orchestrator (`studio` / `game-studio-pipeline`) defines and dispatches **4 specialized subagents** via `define_subagent` and `invoke_subagent` (`12-multi-agent-orchestration.md`):

### Phase 1: `studio-architect` Subagent (`DESIGN.md` + `SPEC.json` + Project Configs)
1. **Core Loop & Instant 2-Second Hook:** Zero-text tutorial; player performs the first satisfying action within 2 seconds after clicking `OYNA` on the Universal Start Menu (`#shell-start-menu`).
2. **Typed Contract Handoff (`<game-name>/SPEC.json` — MetaGPT SOP Pattern):**
   - Defines exact `PrefabFactory` method names/parameters, color palette constants, camera FOV/offset bounds, 12–20 named AI bot parameters, 3+ biome/stage configs, Garage/Upgrade tree, and the 3 mandatory Rewarded Ad hook IDs.
3. **Scaffolds Project Configs:** Writes `<game-name>/package.json`, `tsconfig.json`, `vite.config.ts` (`base: './'`), `.gitignore`, and `public/manifest.json`.

### Phase 2A & 2B (Parallel Shards — BMAD Domain Sharding Pattern):
Once `<game-name>/SPEC.json` exists on disk, the Lead Orchestrator dispatches **two non-overlapping specialist subagents in parallel**:

#### Shard A: `studio-3d-artist` Subagent (`src/render/**` + `public/icon.svg` + `ASSETS_NEEDED.md`)
1. **Stylized Toony Soft Daylight (`32-daylight-and-lighting.md`):** Soft pastel sky (`0xcfe8f7`), warm sun key (`0xfff6e5`), warm biscuit/cream ground (`0xfcf8ee`), `VisualEnhancer.enhanceScene(scene)` (`environmentIntensity: 0.30`), and `toneMappingExposure: 0.90`.
2. **360° Camera & Viewport Ergonomics (`src/render/camera-rig.ts`):** Dynamic FOV/distance scaling for 9:16 portrait and 16:9 landscape; zero ground/pedestal occlusion.
3. **Compound Procedural 3D Prefabs & Hot-Swap (`src/render/PrefabFactory.ts`):** Implements every method specified in `SPEC.json` using `ProceduralMeshBuilder` and `AssetResolver.resolveHybridModel(...)`, plus `src/render/effects.ts`, `public/icon.svg`, and `ASSETS_NEEDED.md`.

#### Shard B: `studio-gameplay-engineer` Subagent (`src/game/**` + `src/input/**` + `src/ui/**` + `src/core/**` + `src/platform/**` + `index.html`)
1. **YouTube Playables & Universal Portal Bridge (`src/platform/sdk.ts`, `index.html`):** `<script src="https://www.youtube.com/game_api/v1"></script>`, `firstFrameReady()`, `gameReady()`, `onPause`/`onResume`, `onAudioEnabledChange`, `loadData`/`saveData`.
2. **Large-Scale Gameplay, Physics & Bot AI (`src/game/**`):** Fixed 1/60s timestep, 12–20 named AI bot competitors with unstuck recovery steering, 3+ biomes/stages, and persistent Garage/Upgrade shop.
3. **Ergonomic Input, Web Audio & HUD (`src/input/input-manager.ts`, `src/core/audio.ts`, `src/ui/hud.ts`, `src/main.ts`):** Camera-relative movement, floating joystick, Universal Start Menu (`!shell.isMenuOpen` lock + `Kolay / Normal / Zor` difficulty scaling), and all 3 mandatory Rewarded Ad hooks (Boosters, Near-Miss Revive, Victory Multiplier Bar).

### Phase 3: `studio-qa-critic` Subagent (`CRITIQUE.md` — ChatDev Adversarial Gate)
An independent QA Critic subagent inspects and verifies the combined build:
1. Runs `node scripts/sync-shared-core.mjs`, `npm --prefix <game-name> install`, `npm --prefix <game-name> run typecheck`, and `npm --prefix <game-name> run build`.
2. Evaluates all **4 Game Director Filters**:
   - **Filter A (Camera & Ergonomics):** Zero occlusion; camera-relative input; 9:16 portrait & 16:9 landscape framing; Universal Start Menu lock.
   - **Filter B (Art, Daylight & ASMR Juice):** Soft Daylight palette, compound 3D prefabs, particle bursts, and Web Audio synthesis.
   - **Filter C (YouTube Playables SDK & Revenue Hooks):** `ytgame` lifecycle hooks wired, all 3 Rewarded Ad hooks functional, zero external network calls, bundle `< 50 MB`.
   - **Filter D (Technical & 60 FPS QA):** Zero per-frame heap allocations in hot paths; `typecheck` and `build` exit with code 0.
3. Applies surgical fixes if any defect is detected and writes `<game-name>/CRITIQUE.md`.
