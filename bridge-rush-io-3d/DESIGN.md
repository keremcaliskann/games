# DESIGN.md — BRIDGE RACE 3D // STAIR BUILDER .IO (`bridge-rush-io-3d`)

**Genre:** Large-Scale 3D Fake-Multiplayer Collect-and-Build Race (`.io`)
**Revenue Score:** 97 / 100
**Target KPI:** 60 FPS WebGL · `< 100 MB` Bundle · Zero External Network Calls · 3-Column Arcade Shell

---

## 1. Core Loop & 2-Second Hook
- **Immediate Action:** Within 1.5 seconds of `ytgame.game.gameReady()`, the player and **11 AI competitors** (12 total runners grouped into 4 vibrant team colors: Royal Blue, Crimson Red, Emerald Green, Solar Gold, plus Neutral Gray scatter bricks) sprint across **Tier 1 Sky Island**.
- **Collect & Stack:** Running over bricks matching the player's color (or Neutral Gray bricks from tackled rivals) snaps them onto a towering 3D spine stack on the player's back with ascending pitch-ramped ASMR pops.
- **Tackle & Steal:** Colliding with any rival carrying **fewer bricks** than you knocks them flat, scattering their entire stack as Neutral Gray bricks that anyone can vacuum up!
- **3-Tier Island Progression:**
  - **Island Tier 1 -> Tier 2 (4 Bridges, 12 Steps Each):** Step onto any of the 4 bridges to lay bricks from your backpack, painting each stair in your color and raising the blocker gate so you can climb to the next island tier. You can even paint over rival-colored steps!
  - **Island Tier 2 -> Tier 3 (2 Bridges, 16 Steps Each):** Fiercer competition across 2 narrow high-altitude bridges leading to the Final Plaza.
  - **Island Tier 3 -> Trophy Podium (1 Grand Staircase, 20 Steps):** First runner to finish the Grand Staircase and reach the floating **Golden Trophy Podium** wins the championship!

---

## 2. Solvable Math & Fair AI Balancing
- **Guaranteed Color Brick Quota:** Each island tier maintains 48 live bricks on the floor, dynamically respawning within `1.2s` of pickup. At least `30%` of spawned bricks match the player's color, ensuring zero starvation.
- **AI State Machine:** The 11 AI bots cycle cleanly between `GATHER_BRICKS` (until backpack reaches `7–14` bricks), `BUILD_BRIDGE` (marching up their chosen bridge until backpack empties), and `OPPORTUNISTIC_TACKLE`, creating organic `.io` turf battles on the stairs.

---

## 3. 360° Camera & Viewport Ergonomics
- **Elevated 44° Chase Camera:** Positioned behind and above the player (`distance: 15.5 + brickCount * 0.14`, `pitch: 44°`, `lookAheadZ: +4.5m`), dynamically pulling back as the player's backpack brick tower grows so it never occludes upcoming bricks or bridge stairs.
- **Dual-Mode 9:16 & 16:9:** Responsive horizontal FOV scaling ensures all island bridges and rival brick counts remain readable on vertical mobile screens and desktop monitors.

---

## 4. Three Mandatory Rewarded Ad Revenue Hooks (`65-monetization-ads.md`)
1. **In-Level Rescue Boosters (Bottom Bar):**
   - `🧱 +25 BRICKS` (`40 🪙` or `📺 FREE` Rewarded Ad): Instantly stacks `+25` bricks onto the player's backpack.
   - `🧲 MAGNET BOARD` (`45 🪙` or `📺 FREE` Rewarded Ad): Activates a hoverboard (`+48%` move speed) and a `5.5m` magnetic brick vacuum for `12s`.
   - `🛡️ TITAN SHIELD` (`50 🪙` or `📺 FREE` Rewarded Ad): Grants knockback immunity and lets you tackle **any** rival regardless of their brick count for `14s`.
2. **Near-Miss Revive Modal:**
   - When an AI rival reaches the Trophy Podium first, prompt `"SO CLOSE! Rival Reached the Podium! Watch Ad to Rewind Rival & Grant +30 Instant Bricks!"` (`1x` per match).
3. **Victory Moving Multiplier Bar & Persistent Garage:**
   - Oscillating `1.5x -> 2x -> 3x -> 5x -> 3x -> 2x -> 1.5x` needle gauge on the Championship Victory screen, plus a persistent **Brick Skin & Stat Lab Garage** (6 unlockable Runner/Brick themes + 3 permanent upgrades: **Sprint Speed**, **Magnet Reach**, **Build Speed**).
