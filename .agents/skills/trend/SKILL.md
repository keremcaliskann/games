---
name: trend
description: >-
  Scans YouTube Playables and web game trends over the last 90 days,
  evaluates ideas on the 100-point Revenue Matrix, and updates backlog/ideas-backlog.json.
  Use when the user types /trend or asks for a market trend scan.
---

# /trend — YouTube Playables & Hyper-Casual Trend Scout

Analyzes current top-performing mechanic combinations, updates `backlog/ideas-backlog.json`, and delivers a dual report (concise Turkish chat summary + detailed markdown artifact).

## Execution Guide

1. Read `games.json` and `backlog/ideas-backlog.json` to review existing portfolio and pipeline items.
2. Search web for latest 90-day trending YouTube Playables, CrazyGames, and Poki hits — **prioritizing high-play-count action genres**:
   - **Fake-Multiplayer `.io` Arenas** (*Hole.io, Bumper.io, Snake/Territory .io* with AI bots & live leaderboard),
   - **Simple FPS / Projectile / Physics Destruction** (1-tap aiming, Rapier rigid-body tower collapse, explosive barrels),
   - **Voxel / Minecraft-Style Block Action** (`InstancedMesh` voxel smashing, mining, and turret defense).
3. Discover **at least 3 mutually distinct new game concepts** per run (each from a different genre) and score all candidates using the 100-Point Revenue Matrix in `yt-playable-trend-scout`.
4. Update and re-rank all `ready` items in `backlog/ideas-backlog.json` in descending order of `revenueScore`.
5. Output a **very concise Turkish post-run report (`<= 6 lines`)** listing the 3 newly added games, the updated Top 3 queue order, and commit/push changes.
