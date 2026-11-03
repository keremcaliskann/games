---
name: trend
description: >-
  Scans YouTube Playables and web game trends over the last 90 days using parallel
  Argon Medium scout subagents and Argon High scoring, evaluates ideas on the 100-point
  Revenue Matrix, and updates backlog/ideas-backlog.json. Use when the user types /trend.
---

# /trend — Multi-Agent YouTube Playables & 3D .io Trend Scout

This is the direct slash command for [`yt-playable-trend-scout`](file:///c:/Users/kerem/Desktop/Games/.agents/skills/yt-playable-trend-scout/SKILL.md). Execute the full multi-agent scouting workflow:

1. Read `backlog/scout-directives.json`, `games.json`, and `backlog/ideas-backlog.json`.
2. Dispatch 2 parallel `research` subagents on **Argon Medium** (`Model: "inherit"`, never `flash`) across the 5 priority Large-Scale 3D Fake-Multiplayer (`.io` & Royale) sub-genres (`io-party-knockout-royale`, `io-collect-build-race`, `io-brawl-battle-royale`, `io-grow-evolve-arena`, `io-turf-mob-conquest`).
3. Ensure every candidate includes 12–24 named AI bots, 3+ distinct stages/biomes, a persistent Garage / Stat Upgrade shop, and all 3 mandatory Rewarded Ad hooks.
4. Score on the 100-point Revenue Matrix, re-rank all `ready` items in `backlog/ideas-backlog.json` (`rank: 1..N`), update `backlog/LATEST_TREND_REPORT.md`, commit & push to `origin/main`, and output a **concise (`<= 6 lines`) Turkish summary**.
