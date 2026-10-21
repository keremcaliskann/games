# DESIGN BLUEPRINT: COLOR BLOCK JAM 3D // SHREDDER ESCAPE

## 1. Executive Concept & 2-Second Instant Hook
**COLOR BLOCK JAM 3D** is a hyper-tactile 3D spatial jam and escape puzzle engineered for **YouTube Playables**, **Yandex Games**, **CrazyGames**, **Poki**, and **GitHub Pages**.

### Instant 2-Second Hook:
- As soon as `ytgame.game.gameReady()` fires, the player is presented with a vibrant, sunlit floating 6x6 grid populated with beveled, glossy polyomino blocks (1x1, 1x2, 2x1, 1x3, 2x2, L-shapes) in primary high-contrast colors (Crimson Red, Cobalt Blue, Emerald Green, Golden Yellow, Royal Purple, Neon Orange).
- The perimeter of the grid features color-coded **Shredder Gates** with animated rotating steel teeth rollers.
- The nearest block has an active pulsating visual hint or directional arrow. With a single finger swipe or drag, the player immediately slides the block into its matching color gate.
- Upon touching the gate:
  - The block is instantly pulled into the rollers with an ASMR gear-crunch sound.
  - An explosive burst of colorful 3D mini-voxels fly out in physics.
  - Haptic feedback and a rising chord chime reward the player in under 2 seconds.

---

## 2. 100% Solvable Level Generation Math (Reverse-Shuffle Solver)

### Problem Statement:
Random puzzle placement produces unwinnable deadlocks where blocks block each other's path to their respective gates.

### Reverse-Decomposition Solver Specification:
1. **Target Board State:** Start with an empty $W \times H$ floating board.
2. **Reverse Injection:**
   - Select a perimeter shredder gate with a specific color $C$ and entry orientation $\vec{D}_{in} = -\vec{D}_{gate}$.
   - Spawn a polyomino block of color $C$ at the gate boundary.
   - Slide the block into the board along $-\vec{D}_{gate}$ into an unoccupied grid footprint.
   - Repeat for $N$ blocks ($N$ grows with level number: Level 1 has 3–4 blocks; Level 10 has 12–16 blocks).
3. **Internal Shuffle Steps:**
   - Once blocks are on the board, perform $K$ valid reverse sliding maneuvers without clipping existing blocks.
4. **Guaranteed Solution:**
   - Since the initial board configuration is generated strictly by reversing valid forward exit moves, there is **mathematically at least one sequence of moves** that completely clears the board.
   - The par move limit is set to:
     $$\text{MaxMoves} = \text{TotalBlocks} + \max(4, \lfloor\text{TotalBlocks} \times 0.75\rfloor)$$
     ensuring generous player leeway while maintaining tension.

---

## 3. 3 Mandatory Revenue Hooks (`rules/65-monetization-ads.md`)

### Hook 1: In-Level Rescue Boosters (Bottom Bar)
Three tactile bottom chips with `[🎬 FREE]` or Coin cost:
1. **Hammer Smash:**
   - *Action:* Turns cursor/touch into a glowing golden hammer. Tapping any blocking 3D block immediately obliterates it into a fountain of glowing voxel particles, freeing blocked pathways.
   - *Cost:* 100 Coins or `showRewarded('booster_hammer')`.
2. **Freeze & +5 Moves:**
   - *Action:* Adds +5 extra moves instantly and grants bonus time.
   - *Cost:* `showRewarded('booster_moves')` or 75 Coins.
3. **Color Vacuum:**
   - *Action:* Selects one color with the highest block count and automatically sucks all matching blocks directly into their shredder gates simultaneously with cascading ASMR sounds.
   - *Cost:* `showRewarded('booster_vacuum')`.
- *Disabled State:* If `!ads.isRewardedReady()`, the ad option displays `🎬 REKLAM YOK` with `opacity: 0.35` and `pointer-events: none`.

### Hook 2: Near-Miss Revive Modal ("ÇOK YAKLAŞTIN! // SO CLOSE!")
- Triggers when remaining moves reach 0 and $\le 3$ blocks remain on the board.
- Renders an emerald-green pulse card:
  - Header: `ÇOK YAKLAŞTIN! // 2 BLOK KALDI`
  - Reward CTA: `🎬 İZLE & DEVAM ET (+5 HAMLE & ÜCRETSİZ ÇEKİÇ)`
  - Rejection: Simple "Pes Et / Vazgeç" text link transitioning to Game Over.

### Hook 3: Victory Moving Multiplier Needle Bar
- Displayed immediately upon shredding the final block.
- An oscillating gauge oscillates continuously between `1.5x`, `2x`, `3x`, and `5x` (using sinusoidal ease):
  $$\text{Multiplier} = 1.5 + 3.5 \times \left|\sin(t \times 2.8)\right|$$
- When the player taps the golden CTA `🎬 ÇARPANI KATLA`, the ad plays and awards the exact stopped multiplier value onto the base level coin payout (e.g., $100 \times 5 = 500$ Coins).
- If ad is unavailable, the multiplier is cleanly hidden and only standard coin claim is shown.

---

## 4. 360° Camera Line-of-Sight & Ergonomics

### Zero Ground/Pedestal Occlusion:
- The puzzle grid is an **unobstructed floating cyber-pedestal** suspended in bright sky atmosphere.
- Zero opaque decorative terrain, side walls, or floor planes underneath the board.
- Players can orbit around the board without any geometry cutting into view or hiding blocks from extreme angles.

### Dynamic Aspect Ratio Adaptation:
- **Portrait (9:16 - YouTube Mobile App):**
  - Camera FOV auto-expands from $48^\circ$ to $62^\circ$, distance adjusts dynamically based on grid size ($W \times H$) to ensure all perimeter shredder gates and UI top/bottom bars have comfortable margins.
- **Landscape (16:9 - Desktop / Tablet):**
  - Camera FOV settles at $45^\circ$, centering the floating board perfectly between the left navigation rail and right ad rail.

---

## 5. Compound Procedural 3D Prefabs & Hot-Swap Architecture

### Prefabs:
1. **Beveled Polyomino Blocks (`ExtrudeGeometry` with bevelEnabled: true):**
   - High-gloss toy-plastic `MeshStandardMaterial` (`roughness: 0.22`, `metalness: 0.1`).
   - Embossed directional arrow or slide groove on top face.
   - Multi-part grouping with subtle inner core and emissive edge trim.
2. **Perimeter Shredder Gates:**
   - Multi-part hierarchical `THREE.Group`:
     - Heavy steel outer arch with color-coded warning chevron stripes.
     - Dual rotating cylindrical rollers with extruded cog teeth.
     - Luminous intake slit with matching color point light and particle exhaust port.
3. **Hot-Swap Hook (`ASSETS_NEEDED.md`):**
   - System checks `public/models/shredder_gate.glb`. If present, it clones the mesh; otherwise, uses the procedural compound prefab.

---

## 6. Procedural ASMR Web Audio (`src/core/audio.ts`)
- **Slide Whoosh:** Frequency-swept bandpass white noise.
- **Shredder Teeth Crunch:** Dual low-frequency modulated saw tooth waves simulating mechanical grinding.
- **Voxel Burst Pop:** High-frequency resonant sine pops with ascending pitch combo ramp ($440 \to 554 \to 659 \to 880 \text{ Hz}$).
- **Victory Arpeggio:** 5-note pentatonic celebratory chord progression.
- Strictly tied to `ytgame.system.onAudioEnabledChange` and muted when platform is muted.
