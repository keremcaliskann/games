---
name: studio
description: >-
  Executes the autonomous 3-Phase Game Studio Squad (Designer -> Implementer -> Critic)
  to build the #1 ranked game idea from the backlog from scratch to release.
  Use when the user types /studio or asks to create a new game project.
---

# /studio — Autonomous Game Studio Pipeline

This is the direct short slash command for `game-studio-pipeline`. It executes the exact autonomous 3-Phase Studio Squad protocol defined in [15-game-studio-pipeline.md](file:///c:/Users/kerem/Desktop/Games/.agents/rules/15-game-studio-pipeline.md) and [SKILL.md](file:///c:/Users/kerem/Desktop/Games/.agents/skills/game-studio-pipeline/SKILL.md):

1. **Dual-Queue Intake:** Reads both `backlog/studio-todo.json` (fixes any `P0` urgent bugs first, or executes top `P1/P2` upgrades in `TODO_MODE`) and `backlog/ideas-backlog.json` (pulls Rank #1 `ready` blueprint in `NEW_GAME_MODE`).
2. **Phase 1: Game Designer:** Drafts `<game-name>/DESIGN.md`, 2-second hook, solvable math / bot AI spec, and 3 mandatory rewarded ad hooks.
3. **Phase 2: Implementer:** Builds complete Vite + Three.js + Rapier.js project, platform bridges (`src/platform/`), compound procedural prefabs, Soft Daylight visuals, and ASMR audio.
4. **Phase 3: Game Director & QA Critic:** Evaluates against the 4-Filter Critique, runs preflight verification, updates portal catalog, commits & pushes to Git, and outputs a **very concise (`<= 6 lines`) Turkish post-run summary**.
