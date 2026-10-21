---
name: studio
description: >-
  Executes the autonomous 3-Phase Game Studio Squad (Designer -> Implementer -> Critic)
  to build the #1 ranked game idea from the backlog from scratch to release.
  Use when the user types /studio or asks to create a new game project.
---

# /studio — Autonomous Game Studio Pipeline

This is the direct short slash command for `game-studio-pipeline`. It executes the exact autonomous 3-Phase Studio Squad protocol defined in [15-game-studio-pipeline.md](file:///c:/Users/kerem/Desktop/Games/.agents/rules/15-game-studio-pipeline.md) and [SKILL.md](file:///c:/Users/kerem/Desktop/Games/.agents/skills/game-studio-pipeline/SKILL.md):

1. **Queue Intake:** Pulls the #1 ranked `ready` blueprint from `backlog/ideas-backlog.json`.
2. **Phase 1: Game Designer:** Drafts `<game-name>/DESIGN.md`, 2-second hook, solvable math, and 3 mandatory rewarded ad hooks.
3. **Phase 2: Implementer:** Builds complete Vite + Three.js + Rapier.js project, platform bridges (`src/platform/`), compound procedural prefabs, Soft Daylight visuals, and ASMR audio.
4. **Phase 3: Game Director & QA Critic:** Evaluates against the 4-Filter Critique, runs preflight verification, updates portal catalog, and commits & pushes to Git.
