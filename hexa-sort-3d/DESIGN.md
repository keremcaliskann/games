# HEXA SORT 3D // CASCADE STACK — Game Design Document

- **Target Audience:** YouTube Playables (`ytgame` SDK) + Multi-Portal (Yandex, CrazyGames, Poki, GitHub Pages).
- **Genre:** 3D Hexagonal Tile Stack & Sort ASMR Puzzle.
- **Target Budget:** 60 FPS WebGL, < 5 MB bundle, zero external network CSP, zero GC allocations in hot paths.
- **Art Direction:** Stylized Toony Soft Daylight (Rule 32) — Soft pastel sky (`0xcfe8f7`), warm golden sunlight (`0xfff6e5`), warm biscuit honeycomb foundation (`0xfcf8ee`), matte vinyl/plastic tiles (`roughness: 0.48`).

---

## 1. Instant 2-Second Hook & Core Loop

- **Zero-Text Frictionless Onboarding:**
  - On first boot, the floating honeycomb has 1-2 pre-placed stacks with Coral and Teal tiles.
  - The bottom tray has an obvious bouncing stack with matching top color.
  - A gentle bouncing 3D finger pointer indicates dragging the tray stack to the adjacent cell.
  - Within 2 seconds of launch, the player drags, drops, and triggers a tactile 3-tile arc flip cascade and score burst.
- **Core Loop:**
  1. Inspect the floating honeycomb board and the 3 draggable tile stacks in the bottom tray.
  2. Drag a stack onto an empty hex slot on the board.
  3. **Auto-Cascade:** Adjacent stacks sharing the same top color automatically transfer matching top tiles in a fluid arc flip (*domino cascade*) onto the newly placed stack.
  4. If the transfer reveals a new top color on the donor stack, secondary cascades trigger chain reactions.
  5. **Pop Payoff:** Any stack reaching 10 identical tiles triggers an explosive ASMR confetti burst, clearing space and awarding coins.
  6. **Level Objective:** Clear the target quota of colored tiles (e.g. 30, 45, 60 tiles) to complete the level.

---

## 2. Honeycomb Coordinate Math & Solvability Engine

- **Axial Hex Grid Coordinates:**
  - Coordinates $(q, r)$ represent flat-topped or pointy-topped hexagons. We use flat-topped hexagons:
    - $\text{worldX} = \text{size} \times \frac{3}{2} \times q$
    - $\text{worldZ} = \text{size} \times \sqrt{3} \times \left(r + \frac{q}{2}\right)$
  - 6 Neighbors: $(+1, 0), (+1, -1), (0, -1), (-1, 0), (-1, +1), (0, +1)$.
- **Dynamic Board Radii:**
  - Level 1: Radius 2 (7 cells) — tutorial & rapid onboarding.
  - Levels 2–4: Radius 2 with layout cutouts (10–14 cells).
  - Levels 5+: Radius 3 (19 cells) — strategic depth.
- **Deterministic Solvability Guarantee:**
  - When board occupancy is $< 65\%$, tray stacks randomly generate from the level's 4 active pastel palette colors.
  - When occupancy reaches $\ge 65\%$, the `TraySpawner` applies a smart solvability bias: at least 2 of the 3 tray stacks are guaranteed to share their top color with an existing exposed top tile on the board, ensuring the player always has actionable cascade opportunities to avoid artificial deadlocks.

---

## 3. 3 Mandatory Rewarded Ad Revenue Hooks

1. **Hook 1 — In-Level Rescue Boosters:**
   - **Stack Hammer:** Tap any occupied cell to instantly vaporize its entire stack into particles (Cost: 1 Rewarded Ad or 100 Coins).
   - **Swap Hand:** Rerolls and restocks all 3 stacks in the bottom tray with fresh combinations (Cost: 1 Rewarded Ad or 60 Coins).
   - **Move Stack:** Relocate an existing stack from any board cell to another empty cell to open critical adjacency links (Cost: 1 Rewarded Ad or 80 Coins).
2. **Hook 2 — Near-Miss Revive:**
   - When all honeycomb cells are occupied and no valid moves/cascades remain, the game triggers a high-conversion Near-Miss modal:
     *"No Space Left! Watch Ad to Clear 3 Stacks & Keep Your Streak!"*
   - Accepting clears the 3 tallest stacks on the board with an explosion and awards +100 bonus score.
3. **Hook 3 — Victory Moving Multiplier Bar:**
   - On Level Complete, an oscillating needle gauge sweeps between `1.5x`, `2x`, `3x`, and `5x`.
   - Tapping "Claim Multiplier" plays a rewarded ad and multiplies level coin earnings by the needle value.

---

## 4. 360° Camera Line-of-Sight & Daylight Visual Spec

- **Camera Ergonomics:**
  - 45° elevated orbital angle overlooking the floating honeycomb plateau.
  - Touch/Mouse orbit rotation allowed within $\pm 40^\circ$ yaw and $35^\circ-55^\circ$ pitch.
  - Strictly **zero ground plane or bottom pedestal** — the honeycomb floats suspended over a serene pastel sky (`0xcfe8f7`), guaranteeing 100% unobstructed visibility from every angle.
  - Dynamic aspect-ratio adaptation: Automatically zooms out on 9:16 mobile portrait to keep the entire honeycomb and bottom tray comfortably within the safe area.
- **Compound Procedural Prefabs:**
  - Hex Cells: Beveled 6-sided `CylinderGeometry` rims with soft cream matte material (`0xfcf8ee`, `roughness: 0.55`).
  - Hex Tiles: Beveled flat-topped cylinders with rounded edges, vibrant pastel vinyl finish (`roughness: 0.48`), and subtle embossed geometric face icons.
  - Palette: Coral Orange (`0xf97316`), Teal Cyan (`0x06b6d4`), Sunny Amber (`0xf59e0b`), Lavender Purple (`0xa855f7`), Mint Lime (`0x10b981`), Rose Pink (`0xf43f5e`).
