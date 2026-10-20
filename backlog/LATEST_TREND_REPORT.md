# YouTube Playables & Multi-Portal 90-Day Revenue Trend Report

- **Scan Window:** Last 90 Days (July – October 2026)
- **Last Validated:** `2026-10-20`
- **Primary Target:** YouTube Playables (`ytgame` SDK) + Universal Multi-Portal (Yandex Games, CrazyGames, Poki, GitHub Pages)
- **Scoring Framework:** 100-Point Revenue Matrix (`Rewarded Ad: 35` | `Retention: 25` | `YT Ergonomics: 20` | `WebGL/<5MB Fit: 20`)

---

## 1. Executive Summary (Kısa Özet)
* **Yeni Eklenenler (5 Tier-S Oyun):** Son 90 günün en yüksek gelir üreten hybrid-casual ve YouTube Playables mekanikleri taranarak 5 yeni oyun (`color-block-jam-3d`, `screw-jam-3d`, `hexa-sort-3d`, `conveyor-marble-sort-3d`, `bus-escape-jam-3d`) kuyruğa eklendi.
* **Güncel İlk 3 Sıra (Üretime Hazır):**
  1. `color-block-jam-3d` (**96/100**) — *3D Spatial Block Shredder Escape*
  2. `screw-jam-3d` (**95/100**) — *3D Multi-Layer Pin & Toolbox Unbolt*
  3. `hexa-sort-3d` (**93/100**) — *3D Honeycomb Stack & Domino Cascade*
* **Tamamlananlar:** `cyber-arrow-3d` (89/100) ve `cyber-flap` (81/100) canlı yayında (`completed`).

---

## 2. Active Queue Ranking & Revenue Score Breakdown

| Rank | ID | Title | Category | Total Score | Rewarded Ad (35) | Retention (25) | Ergonomics (20) | WebGL Fit (20) | Asset Strategy | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| **#1** | `color-block-jam-3d` | **COLOR BLOCK JAM 3D** | `3d-spatial-jam` | **96** | 35 | 24 | 19 | 18 | Tier-1 Procedural | `ready` |
| **#2** | `screw-jam-3d` | **SCREW JAM 3D** | `3d-spatial-jam` | **95** | 34 | 24 | 19 | 18 | Tier-1 Procedural | `ready` |
| **#3** | `hexa-sort-3d` | **HEXA SORT 3D** | `3d-sort-stack` | **93** | 32 | 25 | 19 | 17 | Tier-1 Procedural | `ready` |
| **#4** | `conveyor-marble-sort-3d` | **CONVEYOR FLOW 3D** | `3d-sort-stack` | **90** | 32 | 23 | 18 | 17 | Tier-1 Procedural | `ready` |
| **#5** | `bus-escape-jam-3d` | **BUS ESCAPE 3D** | `3d-spatial-jam` | **88** | 33 | 22 | 17 | 16 | Tier-2 Hybrid + GLB | `ready` |

---

## 3. Deep-Dive Monetization & Asset Blueprints

### #1. `color-block-jam-3d` (Score: 96/100)
- **90-Day Market Signal:** Fastest-scaling hybrid-casual puzzle subgenre ($25M–$42M/quarter benchmark).
- **Core Loop:** Slide beveled 3D polyomino blocks across a floating sunlit grid into matching color-coded perimeter shredder gates; blocks shred into tactile voxel particle bursts on contact.
- **3 Mandatory Revenue Hooks:**
  1. *Boosters:* **Hammer Smash** (destroys 1 block), **Freeze Timer (+20s)**, **Color Vacuum** (clears all blocks of 1 color).
  2. *Near-Miss Revive:* Triggers when timer/moves run out with 1–2 blocks left (`Watch Ad for +15s & Free Hammer`).
  3. *Victory Multiplier:* 1.5x–5x oscillating needle bar on Level Complete.
- **Asset Strategy:** 100% self-contained Compound Procedural Prefabs (`ExtrudeGeometry` beveled polyominoes + rotating cylindrical shredder gates). Optional override: `public/models/shredder_gate.glb`.

### #2. `screw-jam-3d` (Score: 95/100)
- **90-Day Market Signal:** Undisputed pin-extraction leader with highest dock-slot booster conversion.
- **Core Loop:** Orbit a floating 3D sculpture of translucent plates and color-coded metallic bolts; tap exposed screws to fill 3-slot toolboxes while liberated plates drop away with physics.
- **3 Mandatory Revenue Hooks:**
  1. *Boosters:* **Extra Buffer Hole**, **Magnet Unbolt (3 screws)**, **Plate Shatter**.
  2. *Near-Miss Revive:* Triggers when all 5 buffer holes fill up (`Watch Ad to Clear Buffer & +2 Holes`).
  3. *Victory Multiplier:* 1.5x–5x oscillating needle bar.
- **Asset Strategy:** `LatheGeometry` threaded screws with cross-head slots + beveled `ExtrudeGeometry` translucent plates. Zero bottom pedestal occlusion.

### #3. `hexa-sort-3d` (Score: 93/100)
- **90-Day Market Signal:** Top session-duration leader (12+ min average watch-time) driven by domino-flip ASMR audio/visual cascades.
- **Core Loop:** Drag 3D hexagonal tile stacks onto a floating honeycomb grid; adjacent matching top colors automatically flip and stack until 10+ tiles pop.
- **3 Mandatory Revenue Hooks:**
  1. *Boosters:* **Stack Hammer**, **Swap Tray Hand**, **Relocate Stack**.
  2. *Near-Miss Revive:* Triggers when honeycomb grid fills completely (`Watch Ad to Clear 3 Stacks`).
  3. *Victory Multiplier:* 1.5x–5x oscillating needle bar.
