# HOLE SWALLOW 3D // CITY ARENA .IO — Game Design Document (DESIGN.md)

## 1. Executive Summary & Vision
- **Concept:** Fast-paced, high-retention 3D fake-multiplayer `.io` arena game built for YouTube Playables (`ytgame` SDK) and web gaming portals (Yandex Games, CrazyGames, Poki).
- **Core Loop:** Steer a hungry 3D black hole around a bright sunlit miniature city against 7 AI rival holes with simulated gamer tags. Swallow props to grow in size, vacuum up smaller competitor holes, and race to #1 on the live leaderboard before the 90-second match clock runs out.
- **Instant 2-Second Hook:** Player touches anywhere on the screen -> the black hole responds immediately, sucking in a nearby traffic cone with a satisfying tactile pop sound, elastic squash animation, and a "+5 pts" floating badge. Zero unskippable tutorials or text walls.

---

## 2. 100% Solvable Prop Density & Level Math
The city arena (140m × 140m) contains **350+ deterministic interactive props** categorized into 5 ascending size tiers:

| Tier | Required Radius | Entities | Points & XP Gain | Visual & Audio Sensation |
|:---:|:---:|---|:---:|---|
| **1** | `r >= 1.0` | Traffic cones, fire hydrants, trash bins, newspaper boxes, park benches | `+5 pts, +0.02r` | Quick snap-in, sharp Web Audio pop |
| **2** | `r >= 1.6` | Street lamps, park trees, hot dog carts, parked sedans, mini fountains | `+18 pts, +0.05r` | Tumble & whoosh, mid-frequency thud |
| **3** | `r >= 2.5` | Delivery vans, city buses, coffee shops, news kiosks, petrol pumps | `+45 pts, +0.10r` | Multi-part structural crunch & camera shake |
| **4** | `r >= 3.8` | Townhouses, bank branches, apartments, clock towers | `+120 pts, +0.22r` | Heavy rumble, golden shockwave ring |
| **5** | `r >= 5.0+` | Skyscrapers, stadium blocks & Smaller Rival Bots | `+350 pts, +0.45r` | Massive camera pulse, crowd cheer fanfare |

### Solvability Invariant
Prop densities are distributed uniformly across quadrant grids with high Tier 1-2 cluster concentrations near starting spawn points. Even if AI bots swallow 50% of the city, there are always sufficient props in every quadrant to reach Tier 4+ within 60 seconds.

---

## 3. Bot AI & Fake-Multiplayer Simulation
- **7 Simulated Competitors:** `ApexNomad`, `VortexQueen`, `CityChomp_99`, `NeonByte`, `TurboSink`, `PixelPulse`, `TitanCrush`.
- **Dynamic Behavior Tree:**
  - **Wander/Hunt:** Bots gravitate toward the nearest prop they can swallow within their detection radius.
  - **Chase:** If a bot detects a smaller hole within 14 units, it accelerates into pursuit mode.
  - **Flee:** If a bot detects a larger hole within 12 units, it steers 180° away with a panic wobble.
  - **Catch-Up Rubberbanding:** If the player falls below 6th place, bot growth rates slightly slow by 15%, giving the player a fair window to mount a comeback.

---

## 4. 3 Mandatory Rewarded Ad Revenue Hooks (`rules/65-monetization-ads.md`)
1. **Hook 1: In-Level Tactical Boosters (Bottom HUD)**
   - **Mega Magnet (12s):** Pulls all swallowable props within a 3.5× radius directly into the hole vortex.
   - **Speed Turbo (15s):** +40% movement speed with golden trailing speed lines.
   - **Size Surge:** Instantly expands hole radius by +25% (one full tier jump).
2. **Hook 2: Near-Miss Revive Modal ("SO CLOSE TO #1!")**
   - Automatically prompts if the player is swallowed by a rival bot OR if the 90s timer reaches 0 while placed in 2nd or 3rd position.
   - Reward: `+25s Overtime` and a `5-second Invulnerable Mega Shield`.
3. **Hook 3: Victory Multiplier Needle Bar**
   - At match finish, the podium screen showcases final rank, trophies, and base coins earned.
   - An oscillating needle bounces across `1.5x`, `2x`, `3x`, and `5x` multipliers. Clicking the rewarded ad button awards the multiplied coin payout.

---

## 5. Visual Palette & Stylized Toony Soft Daylight
- **Sky & Horizon:** Soft pastel daylight sky `0xcfe8f7`.
- **Key Light:** Warm golden sunlight `0xfff6e5` at intensity 1.25 with soft shadows.
- **Ambient / Bounce:** Hemisphere light sky `0xdff1fc`, ground bounce `0xf4ebd9` at intensity 0.85.
- **Ground & Roads:** Warm biscuit pavement `0xf5eedb`, clean matte asphalt roads `0xd4cabb`, toony white lane dashes.
- **Hole Asset:** Deep glowing abyss vortex surrounded by a vibrant cyan/magenta neon boundary ring with rotating particle suction spirals.
