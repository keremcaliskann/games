---
name: studio
description: >-
  Executes the autonomous Multi-Agent 4-Subagent Game Studio Squad (studio-architect ->
  parallel studio-3d-artist + studio-gameplay-engineer -> studio-qa-critic) to complete
  pending studio-todo feedback tasks and build the next ready user-planned game in
  backlog/game-plans/<game-id>/. Use when the user types /studio or asks to build a planned game.
---

# /studio — Autonomous Multi-Agent Game Studio Pipeline

This is the direct slash command for [`game-studio-pipeline`](file:///c:/Users/kerem/Desktop/Games/.agents/skills/game-studio-pipeline/SKILL.md). Read and execute the full Multi-Agent protocol defined in [12-multi-agent-orchestration.md](file:///c:/Users/kerem/Desktop/Games/.agents/rules/12-multi-agent-orchestration.md), [15-game-studio-pipeline.md](file:///c:/Users/kerem/Desktop/Games/.agents/rules/15-game-studio-pipeline.md), and [SKILL.md](file:///c:/Users/kerem/Desktop/Games/.agents/skills/game-studio-pipeline/SKILL.md):

1. **Load-Balanced Dual-Queue Intake:** Reads `backlog/studio-todo.json` and scans `backlog/game-plans/*/STATUS.json`. Completes up to 4 pending `ready` tasks in `studio-todo.json` (`P0 -> P1 -> P2`) using isolated per-game Fixer Subagents. If initial pending tasks were `<= 2`, proceeds immediately to build the highest-priority `ready` game folder from `backlog/game-plans/<game-id>/`.
2. **Gate 1 (`studio-architect` Subagent — Argon High):** Copies `backlog/game-plans/<game-id>/DESIGN.md` and `SPEC.json` into `<game-id>/` verbatim and generates project configuration files.
3. **Gate 2 (Parallel `studio-3d-artist` + `studio-gameplay-engineer` Subagents — Argon Medium):** Concurrently builds `src/render/**` + `public/icon.svg` + `ASSETS_NEEDED.md` (Artist) and `src/game/**` + `src/input/**` + `src/ui/**` + `src/core/**` + `src/platform/**` + `src/main.ts` + `index.html` (Gameplay Engineer) strictly following `DESIGN.md` and `SPEC.json`.
4. **Gate 3 (`studio-qa-critic` Subagent — Argon High & Release):** Updates `games.json` / `index.html` / `shared/ui/shell-controller.ts`, runs `node scripts/sync-shared-core.mjs`, verifies `typecheck` & `build` (0 errors), writes `CRITIQUE.md`, sets `STATUS.json` to `"completed"`, commits & pushes to `origin/main`, and outputs a **concise (`<= 6 lines`) Turkish Maintenance Log summary**.
