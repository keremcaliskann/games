---
name: audit
description: >-
  Runs parallel multi-agent QA inspection (Argon Medium subagents + Argon High lead),
  static analysis, TypeScript type checking, production bundle builds, and defensive
  gameplay/performance checks across all active HTML5 3D games. Use when the user types /audit.
---

# /audit — Multi-Agent Workspace Quality & Gameplay Audit (Batch Parallel Inspector)

Conducts an automated health check, rule verification, performance inspection, and design critique across all **active** games (`active !== false`) registered in root `games.json` using **parallel `research` subagents on Argon Medium (`Model: "inherit"`)** coordinated by the **Argon High** Lead Orchestrator.

> **PASSIVE GAMES EXCLUSION:** Strictly ignore any game marked `"active": false` in `games.json`. Do not read, typecheck, build, sync, or queue tasks for passive games.
> **STRICT AUDIT POLICY (QUEUE ONLY):** The audit pass is strictly an inspector and producer. It **DOES NOT modify game code directly**. All identified bugs, performance optimizations, visual juice, and mechanical depth upgrades must **ONLY be logged into `backlog/studio-todo.json`** for the Studio Executor (`/studio`) to implement.

## Multi-Agent Audit Steps

1. **Shared UI & Monetization Core Sync + Typecheck:**
   - Run `node scripts/sync-shared-core.mjs` to verify synchronization of `shared/platform/ads.ts`, `shared/ui/shell-controller.ts`, `shared/ui/arcade-shell.css`, `shared/render/`, and `shared/input/`.
   - Run `npm --prefix <game-id> run typecheck --silent` across active games to verify compilation health.

2. **Parallel Batch Subagent Dispatch (`invoke_subagent` with `TypeName: "research"`, `Model: "inherit"` — Argon Medium):**
   - Partition all active games (`active !== false` in `games.json`) into **batches of 3–4 games**.
   - Spawn one `research` subagent (`Model: "inherit"`, Argon Medium — never `flash`) per batch in parallel. Each subagent inspects its assigned games across 4 pillars:
     1. **P0 Bugs & Defensive Hardening (`25-defensive-gameplay-and-hardening.md`):** Spawn-death race conditions, AI bot stuck loops, missing `!shell.isMenuOpen` start-menu locks, missing `data-hud-interactive="true"`, camera-relative input inversion.
     2. **P1 Mechanics & Hot-Path Performance (`20-performance-budget.md`):** Progression pacing, map/biome variety, and per-frame heap allocations (`new THREE.Vector3`, `.map()`, `.filter()`, closures inside `update`/`render`).
     3. **P2 Soft Daylight & 3D Prefab Polish (`32-daylight-and-lighting.md`):** Overexposure (`toneMappingExposure > 0.92`, `environmentIntensity > 0.35`), dark voids, primitive box placeholders vs `ProceduralMeshBuilder` compound prefabs.
     4. **SDK & Revenue Hooks (`62-youtube-playables.md`, `65-monetization-ads.md`):** `ytgame` lifecycle hooks and all 3 Rewarded Ad hooks (Boosters, Near-Miss Revive, Victory Multiplier).
   - Each subagent returns structured JSON candidate tickets (`id`, `gameId`, `priority`, `score`, `type`, `title`, `description`, `targetFiles`).

3. **Aggregate, Deduplicate & Queue (`backlog/studio-todo.json`):**
   - The Lead Orchestrator collects all subagent reports, filters out any duplicates against `backlog/studio-todo.json`, sorts `ready` tasks by `P0 > P1 > P2` (and descending `score`), writes `backlog/studio-todo.json`, and commits/pushes to `origin/main`.

4. **Output Report (Aircraft Maintenance Log + Simple Task List):**
   - Provide the concise ASD-STE100 summary (`DISCREPANCY / ROOT CAUSE / CORRECTIVE ACTION / RETURN TO SERVICE`).
   - Append a **Simple Task List** showing all active `ready` tasks in `backlog/studio-todo.json` (Priority, Game, Task Title, Score).
