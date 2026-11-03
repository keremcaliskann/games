---
name: game-studio-pipeline
description: Executes the Multi-Agent Studio Executor — processes pending feedback tasks in backlog/studio-todo.json and builds the next ready user-planned game from backlog/game-plans/<game-id>/ using the 4-Subagent Studio Squad (studio-architect -> parallel studio-3d-artist + studio-gameplay-engineer -> studio-qa-critic).
metadata:
  icon: groups
---

# Autonomous Multi-Agent Game Studio Pipeline (`game-studio-pipeline`)

This skill orchestrates the **Multi-Agent Studio Executor** (`12-multi-agent-orchestration.md` & `15-game-studio-pipeline.md`). Rather than overloading a single monolithic agent, the **Argon High** Lead Orchestrator dispatches specialized subagents via `define_subagent` and `invoke_subagent`, builds games verbatim from their user-planned folder in `backlog/game-plans/<game-id>/`, synchronizes the shared Arcade Portal, and deploys live to GitHub Pages.

---

## 1. Load-Balanced Dual-Queue Dispatcher (`studio-todo.json` -> `backlog/game-plans/<game-id>/`)

1. Read `backlog/studio-todo.json` and scan all folders in `backlog/game-plans/*/STATUS.json`.
2. **Load-Balanced Execution Policy:**
   - **Step 1 — Existing Game Feedback & Upgrades (`backlog/studio-todo.json`):**
     - Count all pending items in `backlog/studio-todo.json` where `status === "ready"` or `status === "in_progress"`.
     - If pending tasks exist, group them by `gameId` and execute up to **4 highest-priority tasks (`P0 -> P1 -> P2`)** per run.
     - For tasks spanning 2+ distinct games, use `define_subagent` (`EnableWriteTools: true`, `Model: "pro"` for `P0` and `Model: "inherit"` [Argon Medium] for `P1/P2`) to dispatch one dedicated Fixer Subagent per `gameId` in parallel.
     - After subagents finish, run `node scripts/sync-shared-core.mjs`, verify `npm --prefix <game-id> run typecheck` and `npm --prefix <game-id> run build`, and mark completed tasks `"completed"` in `backlog/studio-todo.json`.
   - **Step 2 — Load Gate for Building 1 Planned Game (`backlog/game-plans/<game-id>/`):**
     - **If the initial pending `studio-todo.json` count was `> 2`:** Stop after completing Step 1, commit, push, and output the Maintenance Log report.
     - **If the initial pending `studio-todo.json` count was `<= 2` (or `0`):** Select the highest-priority folder in `backlog/game-plans/<game-id>/` where `STATUS.json` has `status === "ready"` (ordered by ascending `priority`, e.g., `1` first) and build that game from scratch using the **4-Subagent Studio Squad** below.

---

## 2. The 4-Subagent Studio Squad (Building from `backlog/game-plans/<game-id>/`)

Define the 4 specialist subagents via `define_subagent` (`EnableWriteTools: true`) and execute them across 3 deterministic gates:

### Gate 1: `studio-architect` Subagent (Argon High — `Model: "pro"`)
Invoke `studio-architect` (`Model: "pro"`) to:
1. Read `backlog/game-plans/<game-id>/STATUS.json`, `DESIGN.md`, and `SPEC.json`.
2. Update `backlog/game-plans/<game-id>/STATUS.json` to `"status": "in_progress"`.
3. Create `<game-id>/` at workspace root and copy `backlog/game-plans/<game-id>/DESIGN.md` and `SPEC.json` into `<game-id>/DESIGN.md` and `<game-id>/SPEC.json` verbatim — preserving 100% of the user's planned mechanics, maps, AI rules, and models.
4. Write `<game-id>/package.json`, `tsconfig.json`, `vite.config.ts` (`base: './'`), `.gitignore`, and `public/manifest.json`.

### Gate 2: Parallel Domain Shards (`studio-3d-artist` + `studio-gameplay-engineer` on Argon Medium)
Once `<game-id>/SPEC.json` is written, invoke **`studio-3d-artist`** and **`studio-gameplay-engineer` in parallel** on **Argon Medium** (`Model: "inherit"`, strictly disjoint file ownership):

#### Shard 2A — `studio-3d-artist` Subagent (`Model: "inherit"`)
Reads `<game-id>/DESIGN.md`, `<game-id>/SPEC.json`, `30-three-render.md`, and `32-daylight-and-lighting.md`. Exclusively writes:
- `src/render/lighting.ts`: Soft Daylight palette matching `SPEC.json`, `VisualEnhancer.enhanceScene(scene)` (`environmentIntensity: 0.30`).
- `src/render/camera-rig.ts`: Responsive 9:16 portrait & 16:9 landscape framing, trauma screen-shake, zero ground occlusion.
- `src/render/effects.ts`: Pre-allocated object-pooled particle bursts & shockwave rings (zero per-frame allocations).
- `src/render/PrefabFactory.ts`: Implements every method in `SPEC.json` using `ProceduralMeshBuilder` and `AssetResolver.resolveHybridModel(...)`.
- `public/icon.svg` and `ASSETS_NEEDED.md`.

#### Shard 2B — `studio-gameplay-engineer` Subagent (`Model: "inherit"`)
Reads `<game-id>/DESIGN.md`, `<game-id>/SPEC.json`, `25-defensive-gameplay-and-hardening.md`, `55-arcade-layout-and-shell.md`, and `65-monetization-ads.md`. Exclusively writes:
- `index.html`: `<script src="https://www.youtube.com/game_api/v1"></script>`, 3-column `#arcade-shell`, HUD modals with `data-hud-interactive="true"`, and `toneMappingExposure: 0.90` styling.
- `src/platform/sdk.ts`: Universal portal bridge (`ytgame`, `YaGames`, `CrazyGames`, `Poki`, `localStorage`).
- `src/core/audio.ts`: Procedural Web Audio synthesizer governed by `onAudioEnabledChange`.
- `src/input/input-manager.ts`: Camera-relative movement projection, floating joystick, and `pointerdown` handlers.
- `src/game/**`: Every entity, AI bot behavior, map/biome, weapon/ability, and Garage/Upgrade progression specified in `DESIGN.md` and `SPEC.json`.
- `src/ui/hud.ts` and `src/main.ts`: Wires `initArcadeShell` with Universal Start Menu lock (`!shell.isMenuOpen`), difficulty scaling (`Kolay / Normal / Zor`), and all 3 mandatory Rewarded Ad hooks.

### Gate 3: `studio-qa-critic` Subagent (Argon High — `Model: "pro"`)
After both Shard 2A and Shard 2B complete, invoke `studio-qa-critic` on **Argon High** (`Model: "pro"`):
1. Register `<game-id>` in root `games.json`, `index.html`, and `shared/ui/shell-controller.ts` (`GAME_THEMES`), then run `node scripts/sync-shared-core.mjs`.
2. Run `npm --prefix <game-id> install --prefer-offline --no-audit --no-fund`, `npm --prefix <game-id> run typecheck`, and `npm --prefix <game-id> run build`.
3. Audit against all **4 Game Director Filters** and verify 100% fidelity to `<game-id>/DESIGN.md`.
4. Apply immediate surgical fixes if any compiler error or rule violation is found, and write `<game-id>/CRITIQUE.md`.

---

## 3. Portal Release, Git Push & Concise Report (Lead Orchestrator)

1. Mark `backlog/game-plans/<game-id>/STATUS.json` as `"status": "completed"`.
2. Stage, commit with a clean English Conventional Commit (`feat(studio): ...`), and push to `origin/main`.
3. Output a **concise (`<= 6 lines`, max 20 words per sentence) Turkish ASD-STE100 Maintenance Log report** (`DISCREPANCY / ROOT CAUSE / CORRECTIVE ACTION / VERIFICATION`).
