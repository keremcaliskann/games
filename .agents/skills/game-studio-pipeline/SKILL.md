---
name: game-studio-pipeline
description: Executes the Multi-Agent Consumer stage of the autonomous studio — processes backlog/studio-todo.json and builds the #1 ranked game from backlog/ideas-backlog.json using the 4-Subagent Studio Squad (studio-architect -> parallel studio-3d-artist + studio-gameplay-engineer -> studio-qa-critic).
metadata:
  icon: groups
---

# Autonomous Multi-Agent Game Studio Pipeline (`game-studio-pipeline`)

This skill orchestrates the **Multi-Agent Consumer (Studio Executor)** of the decoupled game studio (`12-multi-agent-orchestration.md` & `15-game-studio-pipeline.md`). Rather than overloading a single monolithic agent, the Lead Orchestrator dispatches specialized subagents via `define_subagent` and `invoke_subagent`, coordinates typed artifact handoffs (`SPEC.json`), synchronizes the shared Arcade Portal, and deploys live to GitHub Pages.

---

## 1. Load-Balanced Dual-Queue Dispatcher (`studio-todo.json` -> `ideas-backlog.json`)

1. Read **both** `backlog/studio-todo.json` and `backlog/ideas-backlog.json`.
2. **Load-Balanced Execution Policy:**
   - **Step 1 — Existing Game Fixes & Upgrades (`backlog/studio-todo.json`):**
     - Count all pending items in `backlog/studio-todo.json` where `status === "ready"` or `status === "in_progress"`.
     - If pending tasks exist, group them by `gameId` and execute up to **4 highest-priority tasks (`P0 -> P1 -> P2`)** per run.
     - For tasks spanning 2+ distinct games, use `define_subagent` (`EnableWriteTools: true`) to dispatch one dedicated Fixer Subagent per `gameId` in parallel (strictly 1 subagent per game directory so files never collide).
     - After subagents finish, run `node scripts/sync-shared-core.mjs`, verify `npm --prefix <game-id> run typecheck` and `npm --prefix <game-id> run build`, and mark completed tasks `"completed"` in `backlog/studio-todo.json`.
   - **Step 2 — Load Gate for Building 1 New Game (`backlog/ideas-backlog.json`):**
     - **If the initial pending `studio-todo.json` count was `> 2`:** Stop after completing Step 1, commit, push, and output the Maintenance Log report (protecting context depth and preventing agent fatigue).
     - **If the initial pending `studio-todo.json` count was `<= 2` (or `0`):** Proceed immediately to build **1 new game** — the item with `status === "ready"` and the highest `revenueScore` (Rank #1) in `backlog/ideas-backlog.json` using the **4-Subagent Studio Squad** below.

---

## 2. The 4-Subagent Studio Squad (New Game Construction)

Define the 4 specialist subagents via `define_subagent` (`EnableWriteTools: true`) and execute them across 3 deterministic gates:

### Gate 1: `studio-architect` Subagent (`DESIGN.md` + `SPEC.json` + Project Configs)
Invoke `studio-architect` on **Argon High** (`Model: "pro"`) to create `<game-name>/` and write:
1. **`<game-name>/DESIGN.md`:** Core loop, 2-second hook, deterministic level/bot AI math, 360° camera spec, and 3 mandatory Rewarded Ad hooks.
2. **`<game-name>/SPEC.json` (MetaGPT SOP Contract):**
   - Exact `PrefabFactory` method signatures (`name`, `params`, `returns`, child hierarchy notes).
   - Palette hex constants, camera FOV/offset bounds, 12–20 AI bot parameters, 3+ biome definitions, 6+ Garage skins, 3 stat upgrades, and 3 Rewarded Ad hook IDs.
3. **Config Scaffolding:** `<game-name>/package.json`, `tsconfig.json`, `vite.config.ts` (`base: './'`), `.gitignore`, and `public/manifest.json`.

### Gate 2: Parallel Domain Shards (`studio-3d-artist` + `studio-gameplay-engineer` on Argon Medium)
Once `<game-name>/SPEC.json` is written, invoke **`studio-3d-artist`** and **`studio-gameplay-engineer` in parallel** on **Argon Medium** (`Model: "inherit"`, strictly disjoint file ownership):

#### Shard 2A — `studio-3d-artist` Subagent
Reads `<game-name>/SPEC.json`, `30-three-render.md`, and `32-daylight-and-lighting.md`. Exclusively writes:
- `src/render/lighting.ts`: Soft Daylight palette (`0xcfe8f7` sky, `0xfff6e5` sun key, `0xfcf8ee` warm ground), `VisualEnhancer.enhanceScene(scene)` (`environmentIntensity: 0.30`).
- `src/render/camera-rig.ts`: Responsive 9:16 portrait & 16:9 landscape framing, trauma screen-shake, zero ground occlusion.
- `src/render/effects.ts`: Pre-allocated object-pooled particle bursts & shockwave rings (zero per-frame allocations).
- `src/render/PrefabFactory.ts`: Implements every method in `SPEC.json` using `ProceduralMeshBuilder` and `AssetResolver.resolveHybridModel(...)`.
- `public/icon.svg` and `ASSETS_NEEDED.md`.

#### Shard 2B — `studio-gameplay-engineer` Subagent
Reads `<game-name>/SPEC.json`, `25-defensive-gameplay-and-hardening.md`, `55-arcade-layout-and-shell.md`, and `65-monetization-ads.md`. Exclusively writes:
- `index.html`: `<script src="https://www.youtube.com/game_api/v1"></script>`, 3-column `#arcade-shell`, HUD modals with `data-hud-interactive="true"`, and `toneMappingExposure: 0.90` styling.
- `src/platform/sdk.ts`: Universal portal bridge (`ytgame`, `YaGames`, `CrazyGames`, `Poki`, `localStorage`).
- `src/core/audio.ts`: Procedural Web Audio synthesizer governed by `onAudioEnabledChange`.
- `src/input/input-manager.ts`: Camera-relative movement projection, floating joystick, and `pointerdown` handlers.
- `src/game/**`: Entity controllers, 12–20 named AI bot competitors with unstuck recovery, 3+ biomes/stages, and Garage/Upgrade system.
- `src/ui/hud.ts` and `src/main.ts`: Wires `initArcadeShell` with Universal Start Menu lock (`!shell.isMenuOpen`), difficulty scaling (`Kolay / Normal / Zor`), and all 3 mandatory Rewarded Ad hooks.

### Gate 3: `studio-qa-critic` Subagent (ChatDev Adversarial Verification Gate on Argon High)
After both Shard 2A and Shard 2B complete, invoke `studio-qa-critic` on **Argon High** (`Model: "pro"`):
1. Register `<game-name>` in root `games.json`, `index.html`, and `shared/ui/shell-controller.ts` (`GAME_THEMES`), then run `node scripts/sync-shared-core.mjs`.
2. Run `npm --prefix <game-name> install --prefer-offline --no-audit --no-fund`, `npm --prefix <game-name> run typecheck`, and `npm --prefix <game-name> run build`.
3. Audit against all **4 Game Director Filters** (Camera/Input Ergonomics, Soft Daylight & Prefabs, YouTube SDK & 3 Revenue Hooks, Zero Hot-Path Heap Allocations).
4. Apply immediate surgical fixes if any compiler error or rule violation is found, and write `<game-name>/CRITIQUE.md`.

---

## 3. Portal Release, Git Push & Concise Report (Lead Orchestrator)

1. Mark the finished game `"completed"` in `backlog/ideas-backlog.json` (and re-index remaining `ready` ranks `1..N`).
2. Stage, commit with a clean English Conventional Commit (`feat(studio): ...`), and push to `origin/main`.
3. Output a **concise (`<= 6 lines`, max 20 words per sentence) Turkish ASD-STE100 Maintenance Log report** (`DISCREPANCY / ROOT CAUSE / CORRECTIVE ACTION / VERIFICATION`).
