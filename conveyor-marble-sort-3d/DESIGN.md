# Phase 1: Game Design Specification — CONVEYOR FLOW 3D

**Game ID:** `conveyor-marble-sort-3d`  
**Title:** CONVEYOR FLOW 3D // MARBLE FACTORY  
**Genre:** 3D Conveyor Loop Marble Sorting & Factory Organization ASMR Puzzle  
**Platforms:** YouTube Playables (`ytgame`), Yandex Games, CrazyGames, Poki, GitHub Pages, Android/iOS (Capacitor)  
**Target Frame Rate:** 60 FPS locked  
**Bundle Budget:** Strictly < 5 MB (expected ~550 kB)

---

## 1. Core Loop & 2-Second Hook
- **The Hook:** Within 2 seconds of entering, the player sees a floating sunlit miniature marble factory. A looping oval conveyor belt rolls with animated tread grooves. In the center, 3 hopper dispensers hold colorful glossy marbles. A docked blue shipping crate needs 3 blue marbles. A subtle pulsing pointer prompts tapping the Blue hopper. Tapping it drops a gleaming blue marble onto the conveyor; the marble rolls smoothly along the track and vacuums into the crate with an ASMR pop, haptic pulse, and particle burst!
- **The Loop:**
  1. **Observe Orders:** Check the target color and quota of docked collector crates along the conveyor loop (e.g. Red 0/4, Yellow 0/3).
  2. **Release Marbles:** Tap color-coded dispenser hoppers to release marbles onto open conveyor belt slots.
  3. **Conveyor Circulation:** Marbles ride the conveyor belt loop at constant 60 FPS speed.
  4. **Collector Absorption:** When a rolling marble reaches a matching crate, it hops into the crate, increments quota, and frees the conveyor belt slot.
  5. **Crate Departure & Chain:** Filling a crate triggers a shipping chime, packs the crate, slides in the next order crate, and grants score/coins.
  6. **Buffer & Jam Management:** Prevent the belt from overflowing with unmatched circulating marbles before all orders are fulfilled.

---

## 2. 100% Solvable Level Math
- **Deterministic Order Matching:**
  - Every level specifies exact crate quotas (e.g., Level 1: 2 crates, Level 2: 3 crates, Level 3+: multi-wave crates).
  - The sum of marbles across all dispensers equals the total crate capacities exactly.
  - Active starting crates are guaranteed to match the front-most visible marbles in at least 2 dispensers, preventing unavoidable deadlocks.
  - Conveyor loop capacity is sized with a safety buffer ($\ge 1.5 \times$ active crate demand) so players have room to circulate non-matching marbles while targeting matching ones.

---

## 3. Mandatory Revenue Hooks (YouTube Playables & Multi-Portal)

### Hook 1: In-Level Rescue Boosters (Bottom HUD)
- **Belt Expansion (+5 Capacity):** Instantly adds 5 extra conveyor slots, lengthening the loop buffer (`showRewarded('booster_belt')`).
- **Magnet Crate:** Instantly draws all matching marbles from dispensers directly into active crates (`showRewarded('booster_magnet')`).
- **Undo Jam (Buffer Clear):** Clears non-matching circulating marbles from the conveyor belt back into their dispenser hoppers (`showRewarded('booster_undo')`).

### Hook 2: Near-Miss Revive Modal
- Triggers when the conveyor belt reaches 100% capacity with no open slots to circulate or release marbles.
- Displays a 5-second countdown modal: *"Conveyor Jammed! Watch Ad to Clear Buffer & Expand Belt Capacity!"* (`showRewarded('revive')`).

### Hook 3: Victory Oscillating Multiplier Needle
- Upon fulfilling all factory orders and clearing the level, an oscillating needle sweeps across 1.5x / 2x / 3x / 5x zones.
- Tapping "CLAIM MULTIPLIED" triggers `showRewarded('victory_multiplier')` to multiply coin rewards by the stopped needle segment.

---

## 4. Art Direction & Camera Ergonomics
- **Stylized Toony Soft Daylight:**
  - Sky: Soft pastel daylight sky `0xcfe8f7`.
  - Sunlight: Warm golden directional light `0xfff6e5` at intensity 1.25 with soft PCF shadows.
  - Factory Platform: Warm biscuit / cream base (`#f8fafc` / `#f1f5f9`), rounded floating island edges with zero ground obstruction.
  - Conveyor Belt: Matte industrial charcoal with yellow-gold hazard accents.
  - Marbles: Glossy toy/candy lacquer (`roughness: 0.15`, `metalness: 0.1`) in vibrant primary hues (Ruby Red, Sapphire Blue, Emerald Green, Sun Amber, Amethyst Purple).
- **Camera Ergonomics:**
  - Elevated 3D isometric view (38° tilt angle) centered over the floating conveyor circuit.
  - Responsive FOV: 48° in 16:9 landscape expanding smoothly to 68° in 9:16 portrait to guarantee 100% visibility of all dispensers, track rails, and bottom HUD booster buttons without edge clipping.
