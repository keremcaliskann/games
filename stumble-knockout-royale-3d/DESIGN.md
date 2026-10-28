# DESIGN SPECIFICATION — PARTY KNOCKOUT 3D // OBSTACLE ROYALE .IO (`stumble-knockout-royale-3d`)

## 1. Core Loop, Large-Scale Tournament & 2-Second Hook
- **Genre:** Large-Scale 3D Fake-Multiplayer Party Obstacle Knockout Royale (`io-party-knockout-royale`).
- **2-Second Hook:** Within 2 seconds of `ytgame.game.gameReady()`, the player's customized bean-runner stands at the starting line alongside 15 named AI competitors (`StumbleKing`, `BeanDash`, `CrownHunter`, `TurboBean`, `FlipMaster`, `MegaJump`, `NeonGuy`, `Bouncer99`, `PixelStar`, `SkyRunner`, `KnockoutKid`, `HyperBean`, `SpinDodger`, `GoldRusher`, `HammerBro`) on a vibrant sunlit 3D sky-parkour course. Dragging steers/sprints immediately; double-tapping or pressing the Jump/Dive button leaps over sweeping hazards.
- **3-Round Knockout Tournament Structure:**
  1. **Round 1 — WHIRLWIND GAUNTLET (`16 Runners -> Top 8 Qualify`, Length `76m`):**
     - Features rotating padded sweeper arms, bouncy yellow bumper pillars, turbo speed pads, and moving block gates.
  2. **Round 2 — ROLLER & TRAMPOLINE CANYON (`8 Qualified Runners -> Top 4 Qualify`, Length `92m`):**
     - Features high-speed counter-rotating log rollers over canyon gaps, spring trampolines launching runners across islands, and swinging pendulum hammers.
  3. **Round 3 — CROWN MOUNTAIN FINALE (`4 Finalists -> #1 Winner Takes Crown`, Length `108m`):**
     - Steep ascending final gauntlet with triple spinning hammers, shockwave bumpers, and a giant floating **Golden Crown** at the summit. First runner to touch the Golden Crown wins the Tournament Championship!

## 2. Persistent Garage, Skin Shop & Stat Upgrade Meta-System
- Saved persistently via `PlatformBridge.loadData` / `saveData`:
  - **6 Unlockable Character Skins & Hats:**
    1. `Royal Crown` (Default Red/Gold)
    2. `Cyber Visor` (Electric Cyan)
    3. `Viking Horned` (Amber Orange)
    4. `Emerald Dino` (Lime Green)
    5. `Shadow Ninja` (Royal Purple)
    6. `Golden Champion` (Metallic Gold)
  - **3 Persistent Stat Upgrades (Levels 1–10):**
    - `Sprint Speed` (`+4%` top speed per level)
    - `Jump & Dive Boost` (`+5%` jump height & forward dive impulse per level)
    - `Bumper Stability` (`-7%` knockback stun duration from spinning hammers per level)

## 3. Deterministic Obstacle Math & Rubber-Banding Bot AI
- **Guaranteed Safe Windows:** All rotating sweeper arms and pendulums use deterministic phase offsets (`theta(t) = omega * t + phi_i`) so there is always an open lane or jumpable bar height (`0.55m` low bar vs `1.45m` jump clearance).
- **Respawn Checkpoints:** Falling off the sky track into the pastel sea teleports the runner back to the most recent section checkpoint (`z = 0, 24, 48, 72, 90`) within `0.45s` with a brief golden invulnerability flash, preventing frustration while costing race time.
- **Fair Rubber-Banding AI:** 15 AI bots navigate waypoint lanes, jump over low sweepers with calibrated reaction probabilities, and dynamically pace their speed so qualification races always produce exciting photo-finish tension.

## 4. 3 Mandatory Rewarded Ad Revenue Hooks (`65-monetization-ads.md`)
1. **Hook 1 — In-Level Rescue Boosters (Bottom HUD Bar):**
   - **🚀 Rocket Jetpack (`booster_jetpack`):** Flies over obstacles at `2.3x` speed for 5.5 seconds.
   - **🛡️ Giant Titan Mode (`booster_giant`):** Scales runner `1.7x` larger and makes them 100% immune to hammer/bumper knockback for 9 seconds.
   - **⚡ Hyper Dash Boots (`booster_speed`):** Grants `+45%` sprint speed and high-jump springs for 12 seconds.
2. **Hook 2 — Near-Miss Qualification Revive Modal (`revive`):**
   - When eliminated just outside the qualification cutoff (e.g., `#9/8` in Round 1 or `#5/4` in Round 2), prompts *"ELIMINATED AT #9! Watch Ad to Qualify Instantly into Next Round with Speed Boots!"*.
3. **Hook 3 — Victory Multiplier Bar (`victory_multiplier`):**
   - Oscillating `1.5x / 2x / 3x / 5x` needle gauge on Round/Tournament Victory to multiply earned coins for the Garage & Upgrade Shop.
