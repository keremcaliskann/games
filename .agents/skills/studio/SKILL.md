---
name: studio
description: >-
  Executes the autonomous 3-Phase Game Studio Squad (Designer -> Implementer -> Critic)
  to build the #1 ranked game idea from the backlog from scratch to release.
  Use when the user types /studio or asks to create a new game project.
---

# /studio — Autonomous Game Studio Pipeline

Pulls the highest-priority concept from `backlog/ideas-backlog.json` and runs the autonomous 3-Phase Studio Squad:

1. **Phase 1: Game Designer**
   Drafts architecture, camera rig, procedural generation rules, and 3 mandatory rewarded ad hooks.
2. **Phase 2: Implementer**
   Scaffolds the Vite + Three.js + Rapier.js project, creates game loop, input abstraction, and procedural prefabs (`ASSETS_NEEDED.md`).
3. **Phase 3: Game Director & QA Critic**
   Evaluates against the 4-Filter Critique (Camera ergonomics, Toony Soft Daylight, Revenue hooks, 60 FPS budget), verifies build, updates portal catalog, and pushes to Git repository.
