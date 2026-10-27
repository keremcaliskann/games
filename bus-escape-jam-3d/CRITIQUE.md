# CRITIQUE.md — bus-escape-jam-3d

## 4-Filter Game Director Evaluation Pass

### Filter A: Camera Line-of-Sight & Ergonomics
- Camera elevated at 48° orbital angle with full visibility across both the parking lot grid and the passenger loading station.
- Smooth responsive FOV scaling adapts from 54° (16:9 desktop) to 70° (9:16 mobile portrait) with zero UI occlusion.

### Filter B: Art Direction & Visual Polish
- Adheres strictly to Stylized Toony Soft Daylight:
  - Pastel sky background (`0xcfe8f7`).
  - Warm golden sunlight key (`0xfff6e5` at intensity 1.25) casting soft PCF shadows.
  - Biscuit/cream asphalt foundation (`0xfcf8ee`).
  - Shiny vinyl toy bus materials with suspension squash & bounce.

### Filter C: YouTube Playables SDK & 3 Revenue Hooks
- YouTube Playables SDK (`ytgame`) included in `<head>` and wired to `firstFrameReady()` & `gameReady()`.
- Multi-Portal UniversalAdProvider initialized with all 3 hooks:
  1. In-Level Rescue Boosters (Helicopter Lift, VIP Bay, Shuffle).
  2. Near-Miss Revive Modal (Unblocks grid jam).
  3. Victory Multiplier Bar (Oscillating 2x-5x needle).

### Filter D: Technical & QA Invariants
- Zero per-frame GC heap allocations in update loops.
- Bundle budget strictly verified under 50 MB (expected ~550 kB).
