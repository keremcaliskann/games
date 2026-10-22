---
name: game-director-qa-architect
description: Inspects all active games in the workspace as a Senior Game Director & Lead QA Architect, identifies bugs, mechanical upgrades, and visual polish tasks, prioritizes them in backlog/studio-todo.json, and outputs a concise Turkish post-run report.
metadata:
  icon:verified
---

# Game Director QA & To-Do Architect (`game-director-qa-architect`)

This skill operates **Producer B** of the autonomous studio pipeline (scheduled every 2 days with `Argon 4 High`). Instead of spending its token quota writing boilerplate across multiple projects in a single session, it performs a deep architectural, mechanical, and gameplay audit across all active games and writes concrete, file-level, prioritized tasks into **`backlog/studio-todo.json`** for the nightly **Studio Executor** to implement.

---

## 1. Execution Workflow (5 Steps)

### Step 1: Load Active Games & Current To-Do Queue
1. Read `games.json` at the workspace root to list all active released games.
2. Read `backlog/studio-todo.json` to inspect existing `ready`, `in_progress`, and `completed` tasks (never add duplicate tasks).

### Step 2: Run Static Health & Build Verification
Run `npm run typecheck` across all active game directories to detect any compilation or type regressions immediately.

### Step 3: Deep Studio Game Director Audit (Per Game)
Evaluate each active game across 4 Studio Pillars:
1. **P0 — Critical Bugs & Softlocks (`priority: "P0"`, score `95–100`):**
   - Level solvability deadlocks, buffer/tray softlocks, shared geometry/material disposal bugs, broken HUD/shell links, or `ytgame` SDK lifecycle violations.
2. **P1 — Mechanical Depth & Retention Upgrades (`priority: "P1"`, score `85–94`):**
   - High-impact gameplay features that increase session time and replayability: fake-multiplayer rival bots/ghosts, combo fever meters, new obstacle/hazard types, boss waves, or better drag/aim physics.
3. **P2 — Visual Juice, Daylight Readability & ASMR Polish (`priority: "P2"`, score `75–84`):**
   - Tactile hit-stop/trauma shake, particle burst variety, floating 3D score/streak badges, ghost trajectory previews, and pitch-ramped procedural Web Audio feedback.
4. **Performance & Bundle Hygiene:**
   - Zero per-frame allocations in `update`/`render`, unused dependencies in `package.json`, and `< 5 MB` bundle compliance.

### Step 4: Update & Re-Rank `backlog/studio-todo.json`
1. Add newly discovered bugfix, mechanical, and visual-juice tasks to `backlog/studio-todo.json` with exact `targetFiles` and actionable `description` specs.
2. Sort all `status === "ready"` items strictly by `priority` (`P0` first, then `P1`, then `P2`) and descending `priorityScore`.
3. Commit and push the updated `backlog/studio-todo.json` to `origin/main`.

### Step 5: Mandatory Concise Post-Run Report (≤ 6 Lines in Turkish)
Every run must conclude with a **very short Turkish summary (`<= 6 lines`)** in chat:
- Number of games audited & `typecheck` health status.
- Newly added tasks (`P0 / P1 / P2`) and their target games.
- Current Top 3 tasks waiting at the top of `backlog/studio-todo.json`.
