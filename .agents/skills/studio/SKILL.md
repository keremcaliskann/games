---
name: studio
description: >-
  Executes the autonomous Multi-Agent 4-Subagent Game Studio Squad (studio-architect ->
  parallel studio-3d-artist + studio-gameplay-engineer -> studio-qa-critic) to complete
  pending studio-todo tasks and build the #1 ranked game idea from scratch to release.
  Use when the user types /studio or asks to run the game studio pipeline.
---

# /studio — Autonomous Multi-Agent Game Studio Pipeline

This is the direct slash command for [`game-studio-pipeline`](file:///c:/Users/kerem/Desktop/Games/.agents/skills/game-studio-pipeline/SKILL.md). Read and execute the full Multi-Agent protocol defined in [12-multi-agent-orchestration.md](file:///c:/Users/kerem/Desktop/Games/.agents/rules/12-multi-agent-orchestration.md), [15-game-studio-pipeline.md](file:///c:/Users/kerem/Desktop/Games/.agents/rules/15-game-studio-pipeline.md), and [SKILL.md](file:///c:/Users/kerem/Desktop/Games/.agents/skills/game-studio-pipeline/SKILL.md):

1. **Load-Balanced Dual-Queue Intake:** Reads `backlog/studio-todo.json` and `backlog/ideas-backlog.json`. Completes up to 4 pending `ready` tasks in `studio-todo.json` (`P0 -> P1 -> P2`) using isolated per-game Fixer Subagents. If initial pending tasks were `<= 2`, proceeds immediately to build the Rank #1 `ready` blueprint from `ideas-backlog.json`.
2. **Gate 1 (`studio-architect` Subagent):** Writes `<game-name>/DESIGN.md`, the typed `<game-name>/SPEC.json` contract, and project configuration files.
3. **Gate 2 (Parallel `studio-3d-artist` + `studio-gameplay-engineer` Subagents):** Concurrently builds `src/render/**` + `public/icon.svg` + `ASSETS_NEEDED.md` (Artist) and `src/game/**` + `src/input/**` + `src/ui/**` + `src/core/**` + `src/platform/**` + `src/main.ts` + `index.html` (Gameplay Engineer) strictly following `SPEC.json`.
4. **Gate 3 (`studio-qa-critic` Subagent & Release):** Updates `games.json` / `index.html` / `shared/ui/shell-controller.ts`, runs `node scripts/sync-shared-core.mjs`, verifies `typecheck` & `build` (0 errors), writes `CRITIQUE.md`, commits & pushes to `origin/main`, and outputs a **concise (`<= 6 lines`) Turkish Maintenance Log summary**.
