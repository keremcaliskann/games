---
name: yt-playable-trend-scout
description: Scans the last 90 days of YouTube Playables and hybrid-casual trends using parallel Argon Medium scout subagents and an Argon High Lead Evaluator, scores ideas on the 100-point Revenue Matrix, re-validates and re-ranks backlog/ideas-backlog.json, and generates both a concise executive summary and a detailed trend report.
metadata:
  icon: trending_up
---

# YouTube Playables Multi-Agent Trend & Revenue Scout (`yt-playable-trend-scout`)

This skill operates **Producer A** of the autonomous multi-agent game studio pipeline (`12-multi-agent-orchestration.md` & `15-game-studio-pipeline.md`). It reads `backlog/scout-directives.json`, dispatches **parallel `research` subagents on Argon Medium (`Model: "inherit"`)** to scan the last 90 days of web/mobile hits across diverse 3D Fake-Multiplayer (`.io` & Royale) sub-genres, scores candidates on the 100-point Revenue Matrix via the **Argon High** Lead Orchestrator, and updates `backlog/ideas-backlog.json` + `backlog/LATEST_TREND_REPORT.md`.

---

## 1. Multi-Agent Execution Workflow (5 Steps)

### Step 1: Read Scout Directives, Active Portfolio & Existing Queue
1. **Read `backlog/scout-directives.json` (MANDATORY):**
   - Load user-configured `priorityGenres`, `excludedGenres`, `customInstructions`, `targetPlatforms`, `scaleStandards`, and `batchSize`.
2. Read `games.json` at workspace root to identify already released games (never propose duplicate mechanics).
3. Read `backlog/ideas-backlog.json` to load all existing `ready`, `in_progress`, and `completed` blueprints.

### Step 2: Parallel Subagent 90-Day Market Scan (`invoke_subagent` on Argon Medium + `search_web`)
1. Spawn **2 parallel `research` subagents on Argon Medium (`Model: "inherit"`, never `flash`)** partitioning the 5 priority `.io` sub-genres from `backlog/scout-directives.json`:
   - **Scout Subagent A:** Researches `io-party-knockout-royale` (Fall Guys / Stumble Guys 3D obstacle knockout), `io-collect-build-race` (Bridge Race / Shortcut Run 3D competitive build race), and `io-brawl-battle-royale` (Smash Karts / Brawl Stars 3D arena battle royale).
   - **Scout Subagent B:** Researches `io-grow-evolve-arena` (Snake Clash / Snowball.io 3D 10-tier evolution) and `io-turf-mob-conquest` (Paper.io 3D / Crowd City / Mob Control turf & swarm conquest) plus emerging 3D physics/vehicle `.io` hits on YouTube Playables, CrazyGames, Poki, and Yandex Games.
2. Enforce **Large-Scale Studio Scope** on every candidate:
   - Live competition against **12–24 named AI bots**, **3+ distinct stages/biomes**, and a **persistent Garage / Skin & Stat Upgrade Shop**.

### Step 3: 100-Point YouTube Playables Revenue & Engagement Matrix
Score each candidate across 4 pillars:
- **1. Rewarded Ad Conversion (`rewardedAdScore` — 35 pts):** Natural friction for Hook 1 (In-Level Boosters), Hook 2 (Near-Miss Revive), and Hook 3 (Victory 2x/3x/5x Multiplier Bar).
- **2. Session Retention & Watch-Time (`retentionScore` — 25 pts):** Multi-biome tournament loop, ASMR visual/audio payoff, and cloud-saved Garage/Upgrade progression.
- **3. YouTube Playables Ergonomics (`ergonomicsScore` — 20 pts):** 2-second comprehension after `OYNA`, effortless 9:16 portrait + 16:9 landscape control, 360° unobstructed camera.
- **4. 3D WebGL & Prefab Fit (`webglFeasibilityScore` — 20 pts):** 60 FPS Three.js + Rapier.js performance, `< 50 MB` zero-external-network bundle, `ProceduralMeshBuilder` + `.glb` hot-swap fit.

### Step 4: Re-Validate & Re-Rank `backlog/ideas-backlog.json`
1. Add `batchSize` (3–4) mutually distinct new blueprints to `backlog/ideas-backlog.json`.
2. Re-validate all existing `status === "ready"` items, update `lastValidatedAt` and `validationNote`, archive any item below `78`, and sort all `ready` items in **strictly descending order of `revenueScore`** (`rank: 1..N`).

### Step 5: Generate Mandatory Dual Reports & Push
1. **Report 1 (`backlog/LATEST_TREND_REPORT.md`):** Overwrite with full ranked table, 4-pillar score breakdowns, and blueprint cards.
2. Commit and push `backlog/ideas-backlog.json` and `backlog/LATEST_TREND_REPORT.md` to `origin/main`.
3. **Report 2 (Chat Output, ≤ 6 Lines in Turkish):** Concise ASD-STE100 summary listing newly added blueprints, updated Top 3 queue order (`#1`, `#2`, `#3`), and verification.
