# SMASH KARTS 3D // ROCKET BATTLE ROYALE .IO — Game Design Document

## 1. Core Loop & 2-Second Hook
- **Genre:** Large-Scale 3D Weaponized Vehicular Battle Royale `.io` (`Smash Karts` & `Brawl Stars` benchmark).
- **2-Second Hook:** Within 2 seconds of `ytgame.game.gameReady()`, the player's armored battle kart is dropped onto a vibrant sunlit 3D multi-ramp stadium alongside 11 named AI rival combat karts. Dragging the floating thumbstick (or WASD / Arrows) immediately drives and drifts the kart into glowing Mystery Weapon Crates (`?`) while the roof-mounted turret auto-locks onto nearby rivals.
- **Core Loop:**
  1. **Drive & Drift:** Steer across the sunlit 3D stadium, launch off stunt ramps, and hit turbo boost pads.
  2. **Smash Mystery Crates (`?`):** Pick up high-impact weapons:
     - **Homing Rockets (3 charges):** Lock-on missiles with smoke trails that deal 45 damage and explosive knockback.
     - **Twin Gatling Cannon (18 rounds):** Rapid-fire tracer stream dealing 12 damage per hit.
     - **EMP Shockwave Mine (2 charges):** Drops an armed proximity mine that detonates for 65 damage when a rival drives near.
  3. **Collect Power Cubes:** Destroyed karts burst into glowing green Power Cubes; picking them up permanently increases Max HP (+25 HP) and Weapon Damage (+15%) for the match.
  4. **Survive the Closing Storm Ring:** Over 75 seconds, the perimeter storm ring shrinks inward, forcing an intense final showdown until 1 Survivor (or highest-scoring Champion) remains!

## 2. Deterministic Solvable Math & Auto-Aim Assist
- **1-Hand Ergonomics & Auto-Aim Cone:** While driving with one hand, the roof turret automatically rotates toward the nearest rival kart within a 22m range and 60° forward-biased cone, firing automatically when in weapon range (or on Spacebar / Fire button tap).
- **Balanced Crate & Power Cube Economy:** 14 Mystery Weapon Crates respawn every 4.5 seconds across outer and inner stadium rings, ensuring the player never runs dry on ammunition.
- **AI Bot Pacing:** 11 named AI karts (`KART_SLAYER`, `NITRO_VEX`, `BLITZ_TANK`, `DRIFT_KING`, `ROCKET_ZED`, `BOOM_QUEEN`, `MECHA_MAX`, `TURBO_ACE`, `SPARK_99`, `APEX_FURY`, `CYBER_RAM`) use dynamic target-switching so they fight each other as actively as the player, guaranteeing thrilling multi-kart chaos and fair #1 victory paths.

## 3. Three Mandatory Rewarded Ad Hooks (`UniversalAdProvider`)
1. **In-Level Rescue Boosters (Bottom HUD Bar):**
   - **Mecha Tank Drop (`booster_mecha`):** Transforms the player's kart into a Twin-Cannon Golden Mecha Tank with 2x damage, auto-firing missiles, and 50% damage reduction for 14 seconds.
   - **Missile Barrage (`booster_barrage`):** Instantly launches 5 homing lock-on rockets at the closest rivals across the stadium.
   - **Full Repair & Shield (`booster_repair`):** Restores 100% HP and activates an invulnerable energy dome for 10 seconds.
2. **Near-Miss Revive Modal (`revive`):**
   - When the player's kart HP hits 0 in the Top 6, prompts **"WRECKED AT #X! Watch Ad to Airdrop Back with Full HP, Shield & Mecha Cannon!"**
3. **Victory Multiplier Bar (`victory_multiplier`) + Persistent Kart Garage:**
   - Oscillating **1.5x / 2x / 3x / 5x** needle gauge on the Battle Royale Victory screen to multiply earned Coins.
   - **Persistent Kart Garage:** Unlock 6 distinct Armored Kart Skins (`STRIKER BLUE`, `CRIMSON VIPER`, `EMERALD TANK`, `CYBER GOLD`, `PLASMA VIOLET`, `INFERNO_X`) and upgrade **Chassis Armor**, **Turbo Engine**, and **Weapon Firepower** up to Lv. 10.

## 4. 360° Camera & Stylized Soft Daylight Visuals
- **Art Direction:** Stylized Toony Soft Daylight (`32-daylight-and-lighting.md`) — soft pastel sky (`0xcfe8f7`), warm golden sunlight (`0xfff6e5` at 1.25 intensity), warm cream stadium floor (`0xfcf8ee`), matte toy-vinyl kart materials (`roughness: 0.46`).
- **Camera Ergonomics:** Elevated 3D chase camera tilted at 42° with dynamic drift banking and zero bottom/foreground occlusion across both **9:16 portrait** and **16:9 landscape** viewports.
