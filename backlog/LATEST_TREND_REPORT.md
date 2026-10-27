# YouTube Playables & Web Game 90-Day Revenue Trend Report

- **Scan Window:** Last 90 Days (August – October 2026)
- **Scan & Validation Date:** `2026-10-27`
- **Directives Alignment:** Strictly aligned with `backlog/scout-directives.json` (Prioritizing `.io` Arenas, Casual FPS/Demolition Physics, and Voxel Action).
- **Primary Target:** YouTube Playables (`ytgame` SDK, < 50 MB, zero external network) + Universal Multi-Portal (Yandex Games, CrazyGames, Poki, GitHub Pages).
- **Scoring Framework:** 100-Point Revenue Matrix (`Rewarded Ad Conversion: 35` | `Session Retention: 25` | `YouTube Ergonomics: 20` | `WebGL/<50MB Feasibility: 20`).

---

## 1. Executive Summary & Market Dynamics

1. **Market Scale & Strategic Shift:**
   - On YouTube Playables and major web portals (CrazyGames, Poki), instant lightweight games with dynamic competitive friction (such as *Snake Clash!* at 101M+ plays, *Going Balls* at 98M+ plays, and *Voxiom.io*) deliver the highest session lengths and repeat-play rates.
   - In accordance with studio scout directives (`backlog/scout-directives.json`), the pipeline has expanded beyond spatial puzzles into high-retention **Fake-Multiplayer .io Arenas**, **Casual FPS / Demolition Physics**, and **Voxel Sandbox Action**.

2. **Active Portfolio Status (`games.json` — 12 Released Titles):**
   - 12 verified titles live on GitHub Pages and ready for YouTube Playables / portal publishing, covering spatial jams, shelf sort, suika merge, cannon demolition, hole .io, and hex sorting.
   - All 12 games operate with 0 hot-path memory allocations, 60 FPS performance, Soft Daylight art direction, and dual-mode responsive arcade shells.

3. **Newly Ingested Breakout Blueprints:**
   - **`bumper-smash-io-3d` // BUMPER SMASH 3D (Score: 95/100, Tier S, Rank #1):** Bouncy spring-loaded 3D bumper arena with 7 AI bots, expanding mass upon knockouts, and high-converting near-miss revives.
   - **`giant-demolition-3d` // GIANT SMASH 3D (Score: 93/100, Tier S, Rank #2):** Heavy wrecking-ball crane demolition with cascading Rapier.js building collapse and explosive TNT chain reactions.
   - **`voxel-dungeon-miner-3d` // VOXEL MINER 3D (Score: 91/100, Tier S, Rank #3):** Single-finger rogue-lite voxel tunneling action with mega-drill boosters and rising lava tension.

---

## 2. Active Production Queue (`backlog/ideas-backlog.json`)

| Rank | ID | Title | Category | Total Score | Rewarded Ad (35) | Retention (25) | Ergonomics (20) | WebGL Fit (20) | Asset Strategy | Status |
|:---|:---|:---|:---|:---:|:---:|:---:|:---:|:---:|:---|:---:|
| **#1** | `bumper-smash-io-3d` | **BUMPER SMASH 3D // ARENA KNOCKOUT .IO** | `io-fake-multiplayer` | **95** | 34 | 24 | 19 | 18 | Tier-1 Compound Procedural | `ready` |
| **#2** | `giant-demolition-3d` | **GIANT SMASH 3D // WRECKING BALL CRUSH** | `casual-fps-physics` | **93** | 33 | 24 | 18 | 18 | Tier-1 Compound Procedural | `ready` |
| **#3** | `voxel-dungeon-miner-3d` | **VOXEL MINER 3D // DUNGEON ESCAPE** | `voxel-sandbox-action` | **91** | 32 | 23 | 18 | 18 | Tier-1 Compound Procedural | `ready` |

---

## 3. Deep-Dive Candidate Blueprints

### #1: `bumper-smash-io-3d` — BUMPER SMASH 3D // ARENA KNOCKOUT .IO
- **Core Loop:** Steer a bouncy 3D spring-bumper kart on a floating circular arena in sky daylight. Ram 7 AI bot opponents with physics impulses to knock them into the sea. Each KO expands bumper radius by +15% and increases mass while the arena ring shrinks over 75s.
- **Solvable Math & Bot AI Spec:** Dynamic steering vector AI with obstacle avoidance and threat evaluation; deterministic ring shrink curve ensures matches resolve to a single survivor within 75 seconds without stalemates.
- **Camera Ergonomics:** Elevated 3D orbital chase camera tilted at 50° with smooth look-ahead damping; auto-zooms out as bumper size scales up; floating sunlit arena with zero bottom occlusion.
- **3 Mandatory Rewarded Ad Hooks:**
  1. *In-Level Booster:* Mega Nitro Ram (Instant 2.5x speed surge with invulnerable golden shockwave shield via Rewarded Ad).
  2. *Near-Miss Revive:* When knocked off in Top 3, prompt 'Knocked Out at #2! Watch Ad to Rocket-Jump Back onto Arena Center with Repulsion Shockwave'.
  3. *Victory Multiplier:* Oscillating 1.5x / 2x / 3x / 5x needle gauge for multiplied Arena Trophy and Coin rewards.

### #2: `giant-demolition-3d` — GIANT SMASH 3D // WRECKING BALL CRUSH
- **Core Loop:** Drag and release a towering construction crane to swing a heavy physics wrecking ball into multi-story stylized building structures, towering voxel golems, and explosive TNT fuel barrels to achieve 100% demolition within limited par swings.
- **Physics Spec:** Rapier.js rigid compound bodies with structural load thresholds; destroying foundational support blocks (bottom 25%) reliably triggers cascading gravity collapse across remaining floors.
- **Camera Ergonomics:** High-angle 3/4 cinematic destruction camera with dynamic screen trauma shake, 360° unobstructed sightlines over the suspended demolition site, and auto-framing for 9:16 portrait and 16:9 landscape.
- **3 Mandatory Rewarded Ad Hooks:**
  1. *In-Level Booster:* Nuclear Wrecking Ball (Equips a giant glowing spiked ball with 5x shockwave radius via Rewarded Ad).
  2. *Near-Miss Revive:* When swings run out with 85%+ building damage, prompt 'Almost Crushed (88%)! Watch Ad for +2 Explosive Cluster Shots'.
  3. *Victory Multiplier:* Oscillating 1.5x / 2x / 3x / 5x needle gauge on demolition destruction score.

### #3: `voxel-dungeon-miner-3d` — VOXEL MINER 3D // DUNGEON ESCAPE
- **Core Loop:** 1-finger swipe / drag to dig and tunnel through soft voxel dirt and mineral walls in a sunlit subterranean canyon, mining emeralds, triggering TNT block traps to blast open sealed treasure vaults, and escaping before the rising lava reaches the player.
- **Solvable Math Spec:** Procedural grid maze with A* connectivity check guaranteeing at least one unobstructed tunnel path from spawn to exit, seeded with guaranteed mineral clusters and trap triggers.
- **Camera Ergonomics:** Top-down 60° tilted isometric camera centered on miner pawn; transparent dither cutaway shader for foreground blocks ensuring player and exit portal are never occluded.
- **3 Mandatory Rewarded Ad Hooks:**
  1. *In-Level Booster:* Mega Drill Aura (Instantly vaporizes a 3x3 block tunnel around player for 6s via Rewarded Ad).
  2. *Near-Miss Revive:* When caught by lava or slime near the exit portal, offer 'Trapped near Exit! Watch Ad to Revive with 5s Invulnerability & Lava Freeze'.
  3. *Victory Multiplier:* 2x / 3x / 5x gem multiplier roulette on successful dungeon escape.
