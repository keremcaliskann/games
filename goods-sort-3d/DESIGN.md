# Phase 1: Game Design Specification — GOODS SORT 3D

**Game ID:** `goods-sort-3d`  
**Title:** GOODS SORT 3D // SHELF TIDY MASTER  
**Genre:** 3D Match-3 Shelf Organization ASMR Puzzle  
**Platforms:** YouTube Playables (`ytgame`), Yandex Games, CrazyGames, Poki, GitHub Pages, Android/iOS (Capacitor)  
**Target Frame Rate:** 60 FPS locked  
**Bundle Budget:** Strictly < 5 MB (expected ~550 kB)

---

## 1. Core Loop & 2-Second Hook
- **The Hook:** Within 2 seconds of entering, the player sees a sunlit wooden cabinet with colorful miniature 3D soda cans, snack boxes, and jam jars. A subtle golden bounce indicates 2 matching soda cans in one shelf compartment and a 3rd on an adjacent shelf. Tapping it instantly slides the can over, popping all 3 with an ASMR pop, star sparkle burst, and revealing the items hidden behind them!
- **The Loop:**
  1. **Identify & Select:** Tap an unobstructed front-row 3D item.
  2. **Relocate & Match:** Tap any target shelf compartment that has an empty slot (or matching items). The item animates along a smooth 3D arc into place.
  3. **Trio Clear (Match-3):** When 3 identical goods occupy the same compartment, they instantly merge and vanish with an explosive ASMR pop.
  4. **Uncover Rear Items:** When front items are cleared, rear-row items slide forward and unlock.
  5. **Clear All Shelves:** Clear all goods before the level timer expires.

---

## 2. 100% Solvable Reverse-Shuffle Level Math
- The puzzle level generator uses reverse-stocking:
  - Chooses $N$ trios of item types.
  - Distributes items from the back of compartments forward.
  - Guarantees at least 2 complete trios are accessible on the front row at all times.
  - No impossible deadlocks or unwinnable random distributions.

---

## 3. Mandatory Revenue Hooks (YouTube Playables & Multi-Portal)

### Hook 1: In-Level Rescue Boosters (Bottom HUD)
- **Tidy Magic Wand:** Instantly finds and merges 1 matching trio anywhere on the board (`showRewarded('booster_wand')`).
- **Extra VIP Shelf Slot:** Spawns a temporary 3-slot holding shelf at the bottom (`showRewarded('booster_slot')`).
- **Shuffle Restock:** Reorders all front-row items to create instant match-3 setups (`showRewarded('booster_shuffle')`).

### Hook 2: Near-Miss Revive Modal
- Triggers when the timer expires or all compartments are full with 1–2 trios remaining.
- Displays a 5-second countdown modal: *"Shelves Full! Watch Ad for +30s & Free Tidy Wand to Keep Playing!"* (`showRewarded('revive')`).

### Hook 3: Victory Oscillating Multiplier Needle
- Upon level clear, an oscillating needle sweeps across 1.5x / 2x / 3x / 5x zones.
- Tapping "CLAIM MULTIPLIED" triggers `showRewarded('victory_multiplier')` to multiply coin rewards by the stopped needle segment.

---

## 4. Art Direction & Camera Ergonomics
- **Stylized Toony Soft Daylight:**
  - Sky: Soft pastel sky blue `0xcfe8f7`.
  - Sunlight: Warm golden directional light `0xfff6e5` at intensity 1.25 with soft PCF shadows.
  - Cabinet: Warm biscuit / honey wood finish (`#f5eedb` / `#d97706`).
  - Items: Tactile, candy-like finishes (`roughness: 0.35 - 0.45`, `metalness: 0.05`).
- **Camera Ergonomics:**
  - Frontal 3D isometric perspective.
  - Dynamic FOV: 45° in 16:9 landscape adapting to 64° in 9:16 portrait to keep all shelves and bottom booster HUD fully visible without horizontal clipping.
