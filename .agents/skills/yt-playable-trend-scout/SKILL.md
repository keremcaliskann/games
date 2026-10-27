---
name: yt-playable-trend-scout
description: Scans the last 90 days of YouTube Playables and hybrid-casual trends, scores ideas on a 100-point Revenue Matrix, re-validates and re-ranks backlog/ideas-backlog.json, and generates both a concise executive summary and a detailed trend report.
metadata:
  icon: trending_up
---

# YouTube Playables Trend & Revenue Scout (`yt-playable-trend-scout`)

This skill operates the **Producer** stage of the autonomous game studio pipeline. It scans the last 90 days (3 months) of market data, classifies and scores candidates specifically for **YouTube Playables revenue optimization** (plus Yandex Games / CrazyGames / Poki compatibility), re-validates existing backlog items, and outputs two structured reports.

---

## 1. Execution Workflow (5 Steps)

### Step 1: Read Scout Directives, Active Portfolio & Existing Queue
1. **Read `backlog/scout-directives.json` (MANDATORY):**
   - Load user-configured `priorityGenres`, `excludedGenres`, `customInstructions`, `targetPlatforms`, and `batchSize` (default: 3).
   - All market research and candidate generation must strictly align with the user's active directives in this file.
2. Read `games.json` at workspace root to identify already released games (never propose duplicate mechanics).
3. Read `backlog/ideas-backlog.json` to load all existing `ready`, `in_progress`, and `completed` blueprints.

### Step 2: 90-Day Market & Genre Scan (Driven by `scout-directives.json`)
Use `search_web` to analyze the **last 3 months (90 days)** across the platforms specified in `scout-directives.json` (`YouTube Playables`, `CrazyGames`, `Poki`, `Yandex Games`):
- Prioritize categories according to `priorityGenres` and their weights in `scout-directives.json`.
- Strictly filter out anything listed under `excludedGenres`.
- Comply with `customInstructions`.
- **Batch & Diversity Invariant:** Every scan must discover and add at least `batchSize` (3) new concepts, with **each concept coming from a DIFFERENT genre** so `backlog/ideas-backlog.json` maintains continuous variety.

### Step 3: 100-Point YouTube Playables Revenue & Engagement Matrix
Classify each candidate into its primary category (`io-fake-multiplayer`, `casual-fps-physics`, `voxel-sandbox-action`, `physics-merge-drop`, `arcade-skill-runner`, `3d-spatial-jam`, `3d-sort-stack`) and score across 4 pillars:

| Pillar | Max Points | Scoring Criteria |
|---|---|---|
| **1. Rewarded Ad Conversion (`rewardedAdScore`)** | **35 pts** | Natural friction points for **Hook 1: In-Level Rescue Boosters** (Hammer, Hint, Extra Slot, Shuffle), **Hook 2: Near-Miss Revive** (failing with 1 move/slot left), and **Hook 3: Victory 2x/3x/5x Multiplier Bar**. |
| **2. Session Retention & Watch-Time (`retentionScore`)** | **25 pts** | "Just one more level" compulsion, tactile ASMR visual/audio payoff, and cloud-saved meta-progression (`ytgame.game.saveData()` streaks, unlockable themes/skins). |
| **3. YouTube Playables Ergonomics (`ergonomicsScore`)** | **20 pts** | Instant 2-second comprehension with zero text walls, effortless single-finger control in both **9:16 portrait** and **16:9 landscape**, and 360° unobstructed camera line-of-sight. |
| **4. 3D WebGL & Prefab Fit (`webglFeasibilityScore`)** | **20 pts** | 60 FPS Three.js + Rapier.js performance, `< 50 MB` zero-external-network bundle, Compound Procedural 3D Prefab visual richness, and 100% solvable deterministic level math. |

- **Tier S (`85–100 pts`):** Top priority (`status: "ready"`).
- **Tier A (`78–84 pts`):** Secondary queue (`status: "ready"`).
- **Below `78 pts`:** Archive or discard (`status: "archived"`).

### Step 4: Re-Validate & Re-Rank Existing Backlog
For every existing item in `backlog/ideas-backlog.json` where `status === "ready"`:
1. Re-verify market momentum against current 90-day data.
2. Adjust `revenueScore` (and sub-scores) up or down based on trend velocity and portfolio diversity.
3. Update `lastValidatedAt` (ISO date) and `validationNote` explaining why its rank/score held, rose, or dropped.
4. Set `status = "archived"` if its updated `revenueScore` falls below `78`.
5. Sort all `status === "ready"` items in `backlog/ideas-backlog.json` in **strictly descending order of `revenueScore`** (Rank #1 at the top).

### Step 5: Generate Mandatory Dual Reports
Every run must produce **two distinct outputs**:

1. **Report 1 — Çok Kısa Yönetici Özeti (Chat Output, ≤ 6 Lines in Turkish):**
   - Newly added blueprint(s) and their scores.
   - Re-validated Top 3 queue order (`#1`, `#2`, `#3`) ready for the Builder automation.
   - Any score adjustments or archived ideas.
2. **Report 2 — Detaylı Trend & Gelir Raporu (`backlog/LATEST_TREND_REPORT.md`):**
   - Overwrite `backlog/LATEST_TREND_REPORT.md` with a comprehensive analysis containing:
     - Executive summary & scan date.
     - Full ranked table of all `ready` games with 4-pillar score breakdowns (`35 / 25 / 20 / 20`).
     - Re-validation changelog for previously queued games.
     - Deep-dive blueprint cards for the top candidates (Core Loop, 3 Mandatory Rewarded Ad Hooks, 360° Camera Spec, Compound Procedural Prefab & `ASSETS_NEEDED.md` assessment).

---

## 2. Schema for `backlog/ideas-backlog.json`

```json
[
  {
    "id": "screw-jam-3d",
    "title": "SCREW JAM 3D // HYPER UNBOLT",
    "category": "3d-spatial-jam",
    "status": "ready",
    "rank": 1,
    "revenueScore": 95,
    "scoreBreakdown": {
      "rewardedAdScore": 34,
      "retentionScore": 24,
      "ergonomicsScore": 19,
      "webglFeasibilityScore": 18
    },
    "createdAt": "2026-10-20",
    "lastValidatedAt": "2026-10-20",
    "validationNote": "Top #1 hybrid-casual puzzle mechanic across YouTube Playables & mobile charts over the last 90 days; extreme booster & near-miss revive conversion.",
    "coreLoop": "Orbit a suspended multi-layered 3D mechanical sculpture, tap color-coded metallic screws to extract them into matching 3-slot toolboxes, and drop liberated translucent plates with physics.",
    "solvableMathSpec": "Reverse-assembly generator: layers of plates and pins are placed in reverse removal order so at least one valid screw sequence is 100% guaranteed without deadlocks.",
    "cameraErgonomics": "Full 360° spherical orbit around floating central sculpture; zero ground plane or pedestal so bottom pins are 100% visible. Auto-zooms for 9:16 portrait and 16:9 landscape.",
    "revenueHooks": {
      "inLevelBoosters": [
        "Extra Hole (+1 buffer slot via Rewarded Ad or 100 Coins)",
        "Magnet Unbolt (Automatically clears 3 matching screws via Rewarded Ad)",
        "Plate Smash (Shatters obstructing plate via Rewarded Ad)"
      ],
      "nearMissRevive": "When buffer holes fill up with 1-2 screws remaining on a toolbox, prompt 'Buffer Full! Watch Ad to Clear Buffer & +2 Extra Holes'.",
      "victoryMultiplier": "Oscillating 1.5x / 2x / 3x / 5x needle bar on Level Complete screen for bonus Coins."
    },
    "assetSpec": {
      "complexity": "Tier-1 Compound Procedural + Optional GLB",
      "proceduralPrefabs": "LatheGeometry threaded bolts with cross-slot Phillips heads, beveled ExtrudeGeometry acrylic/metallic plates, and hinged 3D color toolboxes.",
      "optionalUserGlb": "public/models/mascot_wrench.glb (Optional <2k tris animated wrench effect)"
    }
  }
]
```
