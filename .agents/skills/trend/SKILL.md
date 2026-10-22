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

1. Read `backlog/scout-directives.json` to load user-configured priority genres, excluded themes, target platforms, and custom instructions.
2. Read `games.json` and `backlog/ideas-backlog.json` to review existing portfolio and pipeline items.
3. Search web for latest 90-day trending games matching the directive weights (prioritizing `.io` arenas, casual FPS/demolition physics, and voxel action).
4. Discover at least `batchSize` (3) mutually distinct new game concepts per run and score all candidates using the 100-Point Revenue Matrix in `yt-playable-trend-scout`.
5. Update and re-rank all `ready` items in `backlog/ideas-backlog.json` in descending order of `revenueScore`.
6. Output a **very concise Turkish post-run report (`<= 6 lines`)** listing the newly added games, the updated Top 3 queue order, and commit/push changes.
