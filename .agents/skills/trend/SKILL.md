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

1. Read `backlog/ideas-backlog.json` to review existing pipeline items.
2. Search web for latest 90-day trending playable mechanics (tap-away, color-jam, endless-runner, physics puzzle).
3. Score candidates using the 100-Point Revenue Matrix:
   - Instant Hook (0-20 pts)
   - Ad Hook Friction (0-25 pts)
   - Procedural Infinite Depth (0-20 pts)
   - < 5 MB Asset Fit (0-15 pts)
   - 9:16 Portrait Ergonomics (0-20 pts)
4. Update `backlog/ideas-backlog.json` with new or re-ranked top concepts.
5. Present a concise Turkish summary with the top 3 high-yield recommendations.
