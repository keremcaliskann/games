# YouTube Playables & Hybrid-Casual 90-Day Revenue Trend Report

- **Scan Window:** Last 90 Days (August – October 2026)
- **Scan & Validation Date:** `2026-10-22`
- **Primary Target:** YouTube Playables (`ytgame` SDK) + Universal Multi-Portal (Yandex Games, CrazyGames, Poki, GitHub Pages)
- **Scoring Framework:** 100-Point Revenue Matrix (`Rewarded Ad Conversion: 35` | `Session Retention: 25` | `YouTube Ergonomics: 20` | `WebGL/<5MB Feasibility: 20`)

---

## 1. Executive Summary & Market Dynamics

1. **Market Scale & Revenue Drivers:**
   - The hybrid-casual puzzle market expanded +23% in 2026, reaching over $2.4B in H1 2026 alone. While ad-only hyper-casual games declined, hybrid loops pairing accessible mechanics with rewarded ad fail-offers, progression metas, and cosmetic skins dominate.
   - Loom Games' conveyor-belt puzzle breakout *Pixel Flow* scaled past $140M+ lifetime IAP, triggering Scopely's ~$1B acquisition in early 2026. This has cemented conveyor flow and kinetic loop puzzles as premier growth vectors.
   - Top-grossing physical match and shelf-organization titles (*Goods Sort*, *Goods Master 3D*, *Match Factory!*) demonstrate top-tier player engagement and record-high rewarded ad booster usage.

2. **Active Portfolio Status (`games.json`):**
   - `screw-jam-3d` (**SCREW JAM 3D // HYPER UNBOLT**) — Deployed & Live (`completed`).
   - `color-block-jam-3d` (**COLOR BLOCK JAM 3D // SHREDDER ESCAPE**) — Deployed & Live (`completed`).
   - `cyber-arrow-3d` (**CYBER ARROW 3D**) — Deployed & Live (`completed`).
   - `cyber-flap` (**CYBER FLAP // 2099**) — Deployed & Live (`completed`).

3. **Newly Ingested Breakout Blueprints:**
   - **`goods-sort-3d` // GOODS SORT 3D (Score: 94/100, Tier S):** Capitalizes on the massive shelf-organization / closet-tidy craze with high booster conversion.
   - **`physics-drop-merge-3d` // DROP MERGE 3D (Score: 93/100, Tier S):** Captures viral 3D Suika / sphere merge demand with Rapier 3D physics and seamless single-finger portrait controls.

4. **Current Top 3 Production Queue:**
   1. **`hexa-sort-3d` (95/100)** — *3D Honeycomb Stack & Domino Cascade* (Designated Rank #1 for next Studio Squad cycle).
   2. **`goods-sort-3d` (94/100)** — *3D Shelf Tidy & Triple Match Master*.
   3. **`physics-drop-merge-3d` (93/100)** — *3D Translucent Cylinder Sphere Drop & Physics Merge*.

---

## 2. Active Queue Ranking & Revenue Score Breakdown

| Rank | ID | Title | Category | Total Score | Rewarded Ad (35) | Retention (25) | Ergonomics (20) | WebGL Fit (20) | Asset Strategy | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| **#1** | `hexa-sort-3d` | **HEXA SORT 3D // CASCADE STACK** | `3d-sort-stack` | **95** | 33 | 25 | 19 | 18 | Tier-1 Compound Procedural | `ready` |
| **#2** | `goods-sort-3d` | **GOODS SORT 3D // SHELF TIDY MASTER** | `3d-sort-stack` | **94** | 34 | 24 | 19 | 17 | Tier-1 Procedural + Optional GLB | `ready` |
| **#3** | `physics-drop-merge-3d` | **DROP MERGE 3D // SPHERE SUIKA** | `physics-merge-drop` | **93** | 31 | 24 | 20 | 18 | Tier-1 Compound Procedural | `ready` |
| **#4** | `conveyor-marble-sort-3d` | **CONVEYOR FLOW 3D // MARBLE FACTORY** | `3d-sort-stack` | **92** | 33 | 24 | 18 | 17 | Tier-1 Compound Procedural | `ready` |
| **#5** | `bus-escape-jam-3d` | **BUS ESCAPE 3D // PASSENGER JAM** | `3d-spatial-jam` | **89** | 33 | 22 | 17 | 17 | Tier-2 Hybrid + Optional GLB | `ready` |

---

## 3. Re-Validation Changelog (`2026-10-21`)

* **`hexa-sort-3d` (`93` ➔ `95`, +2 pts, Holds Rank #1):**
  - *Retention Score:* Retains category peak (25/25). Average playtime per active user remains 12+ minutes.
  - *WebGL Feasibility:* Re-verified at 18/20. Fully procedural beveled cylinder hex tiles guarantee 60 FPS performance without heavy GLB load times.
  - *Status:* Cleared as immediate candidate for Phase 1 of the Studio Squad.
* **`conveyor-marble-sort-3d` (`90` ➔ `92`, +2 pts, Shifts to Rank #4):**
  - *Rewarded Ad Score:* Upgraded from 32 to 33 pts. High monetization around dock-slot capacity expansion and emergency jam clearing.
  - *Market Momentum:* Boosted by market data surrounding Loom Games' $125M+ *Pixel Flow* monetization loop.
* **`bus-escape-jam-3d` (`88` ➔ `89`, +1 pt, Shifts to Rank #5):**
  - *Rewarded Ad Score:* Holds solid 33/35. VIP parking slot unlocks and passenger shuffle boosters remain consistent revenue generators.
  - *Ergonomics:* Held at 17/20 due to higher vehicle density requirements on small mobile screens.
* **`color-block-jam-3d` & `screw-jam-3d` (Rank: `null`, Status: `completed`):**
  - Transitioned out of the ready queue following production completion and live deployment.

---

## 4. Deep-Dive Monetization & Architectural Blueprints

### #1. `hexa-sort-3d` — HEXA SORT 3D // CASCADE STACK (Score: 95/100)
- **90-Day Market Signal:** Market-wide benchmark for session length and organic player retention. Domino-style tile flip cascades create unbeatable ASMR sensory feedback.
- **Core Loop:**
  - Drag 3D hexagonal tile stacks from a bottom 3-slot dispenser tray onto an elevated honeycomb grid.
  - When a placed stack shares a top color with adjacent stacks, tiles automatically arc-flip across cells in a rapid domino sequence to consolidate color groups.
  - Assembling 10 matching tiles in a single stack triggers an explosive popping particle clear.
- **Deterministic Solvability Math:**
  - Dynamic tray bias: When board occupancy exceeds 65%, spawned tray stacks are mathematically biased toward current top colors on the board, preventing impossible deadlocks while rewarding forward planning.
- **Camera & Ergonomics:**
  - 45° elevated orbital camera overlooking a floating honeycomb plateau.
  - Zero ground occlusion; dynamic FOV recalculation automatically guarantees 100% stage visibility in both 9:16 vertical mobile and 16:9 desktop viewports.
- **3 Mandatory Rewarded Ad Hooks:**
  1. *Rescue Boosters:* **Stack Hammer** (shatters 1 full stack), **Swap Hand** (rerolls 3 tray stacks), **Move Stack** (transfers any stack to an open cell).
  2. *Near-Miss Revive:* When all honeycomb cells fill with no valid matches: *"No Space Left! Watch Ad to Clear 3 Random Stacks & Keep Streak"*.
  3. *Victory Multiplier:* Oscillating 1.5x / 2x / 3x / 5x needle gauge on Level Complete.
- **Compound Procedural Prefabs & Asset Strategy:**
  - 100% procedural `CylinderGeometry` hex tiles with beveled top rims and embossed icons.
  - Warm daylight palette: Cream board foundation (`0xfcf8ee`), warm golden sun key (`0xfff6e5`), soft pastel sky (`0xcfe8f7`).
  - Zero external GLB meshes required; bundle stays strictly under 2.5 MB.

---

### #2. `goods-sort-3d` — GOODS SORT 3D // SHELF TIDY MASTER (Score: 94/100)
- **90-Day Market Signal:** Breakout hybrid-casual category pioneered by *Goods Sort* and *Goods Master 3D*, generating $10M+/month in sustained IAP and rewarded ad revenue through universal "tidy-up" psychology.
- **Core Loop:**
  - Players view a sunlit multi-level wooden shelf cabinet filled with 3D consumer items (soda cans, snack boxes, toy jars).
  - Tapping an item moves it to an open shelf slot. Matching 3 identical items in the same compartment clears them with an ASMR pop, revealing hidden back-row items.
- **Deterministic Solvability Math:**
  - Reverse-stocking generator: All triplets are staged from back-to-front during generation, ensuring every puzzle is 100% solvable without requiring paid boosters.
- **Camera & Ergonomics:**
  - Front-angled 3D perspective with soft vertical touch-drag parallax.
  - Shelf widths auto-fit within safe margins on 9:16 mobile screens without horizontal truncation.
- **3 Mandatory Rewarded Ad Hooks:**
  1. *Rescue Boosters:* **Tidy Wand** (instantly auto-matches 1 visible trio), **Shelf Expander** (adds a temporary holding compartment), **Shuffle Restock** (rearranges front-row items).
  2. *Near-Miss Revive:* When the timer expires with 1–2 trios left: *"Out of Time! Watch Ad for +30s & Free Tidy Wand"*.
  3. *Victory Multiplier:* Oscillating 1.5x–5x needle gauge on Level Complete screen.
- **Compound Procedural Prefabs & Asset Strategy:**
  - Procedural 3D items: `LatheGeometry` soda cans, beveled `BoxGeometry` cereal packs with canvas-generated procedural labels, rounded glass jars.
  - Optional GLB Hot-Swap: `public/models/goods_cart.glb` (<2k tris shopping basket).

---

### #3. `physics-drop-merge-3d` — DROP MERGE 3D // SPHERE SUIKA (Score: 93/100)
- **90-Day Market Signal:** The 3D physical evolution of the Suika / Fruit Merge phenomenon. Exceptional watch-time and virality on YouTube Playables and web game portals.
- **Core Loop:**
  - Horizontal drag to aim, release to drop bouncy 3D spheres into a suspended translucent acrylic cylinder.
  - Identical spheres merge upon contact with Rapier 3D physics impulse and squish-pop audio, evolving into higher-tier spheres up to the Tier-11 Golden Core.
- **Deterministic Solvability Math:**
  - Progressive mass and radius scaling: Sphere radii scale by $r_{n+1} = r_n \times 1.22$; container volume allows reaching Tier 11 through skilled spatial distribution.
- **Camera & Ergonomics:**
  - Top-down 3D high angle looking into a translucent container. Camera smoothly tracks upward and zooms out as sphere stack height increases.
  - Frictionless single-finger horizontal drag-and-drop.
- **3 Mandatory Rewarded Ad Hooks:**
  1. *Rescue Boosters:* **Pop Shake** (Rapier impulse shake to dislodge wedged spheres), **Bomb Sphere** (vaporizes low-tier clutter in an explosive radius), **Evolution Beam** (promotes next dropped sphere by +1 tier).
  2. *Near-Miss Revive:* When spheres cross the top warning threshold for >3 continuous seconds: *"Container Overflow! Watch Ad to Vaporize Top 3 Spheres & Continue"*.
  3. *Victory Multiplier:* High-score milestone multiplier needle gauge.
- **Compound Procedural Prefabs & Asset Strategy:**
  - Procedural `SphereGeometry` meshes with glossy daylight candy shaders, squash/stretch spring deformation, and translucent cylinder walls.
  - Zero external GLB meshes needed (<2 MB bundle, 60 FPS guaranteed).
