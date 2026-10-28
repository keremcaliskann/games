# DESIGN SPECIFICATION — BUMPER SMASH 3D // ARENA KNOCKOUT .IO (`bumper-smash-io-3d`)

## 1. Core Loop & 2-Second Hook
- **Genre:** 3D Fake-Multiplayer `.io` Physics Arena Knockout (`io-fake-multiplayer`).
- **2-Second Hook:** Within 2 seconds of `ytgame.game.gameReady()`, the player's spring-bumper kart is live on a sunlit floating octagonal island surrounded by 7 color-coded AI rival karts and a live 8-player leaderboard. Dragging anywhere steers and accelerates immediately.
- **Core Loop:**
  1. Steer a bouncy 3D spring-bumper kart across a floating circular stone arena (`R_initial = 15.0m`).
  2. Ram rival AI karts with high-momentum physics impulses (`v * mass * bumperElasticity`) to knock them over the perimeter danger curb into the sparkling turquoise sea.
  3. Collecting glowing Energy Orbs (+25 Score, +4% scale) and scoring Knockouts (+150 Score, +25 Coins, +14% bumper radius & mass) grows your kart into a juggernaut.
  4. The outer arena ring shrinks deterministically over 75 seconds (`R(t) = max(6.5, 15.0 - 8.5 * (t / 75))`), forcing intense center-stage collisions until 1 survivor remains.

## 2. Deterministic Physics & Fair Bot AI Spec
- **Elastic Bumper Impulse Math:**
  - When Kart $A$ and Kart $B$ collide (`dist < r_A + r_B`), normal vector $\mathbf{n} = (\mathbf{p}_B - \mathbf{p}_A) / \|\mathbf{p}_B - \mathbf{p}_A\|$.
  - Relative speed along normal plus active dash boost applies an instantaneous knockback impulse scaled by attacker mass ($m_A$) and defender inverse mass ($1 / m_B$), multiplied by `2.0x` if Spike Armor is active.
- **AI Steering & Threat Avoidance:**
  - 7 named AI bots (`TurboRex`, `BumpKing`, `NeonDrift`, `PixelRam`, `Vortex99`, `HyperKart`, `SmashBot`) evaluate arena center distance (urgent inward steering when `dist > 0.78 * arenaRadius`) and nearest rival vector every `0.25s`, guaranteeing brisk eliminations and a 100% deterministic match resolution within 75 seconds.

## 3. 3 Mandatory Rewarded Ad Revenue Hooks (`65-monetization-ads.md`)
1. **Hook 1 — In-Level Rescue Boosters (Bottom HUD Bar):**
   - **⚡ Mega Nitro Ram (`booster_nitro`):** Instant `2.2x` speed + golden shockwave aura for 8 seconds.
   - **🧲 Magnet Vortex (`booster_vortex`):** Pulls nearby Energy Orbs and pulls lighter bots into your bumper path for 8 seconds.
   - **⚙️ Spike Armor (`booster_spikes`):** Deploys chrome bumper spikes dealing `2.2x` knockback impulse and `0.5x` incoming knockback resistance for 10 seconds.
2. **Hook 2 — Near-Miss Revive Modal (`revive`):**
   - When knocked off the arena edge into the sea, prompts *"KNOCKED OFF ARENA! Watch Ad to Rocket-Drop Back to Center with Shockwave Blast & Spike Armor!"*.
3. **Hook 3 — Victory Multiplier Bar (`victory_multiplier`):**
   - Oscillating `1.5x / 2x / 3x / 5x` needle gauge on the Arena Victory / Match Summary modal to multiply earned coins.

## 4. Camera Ergonomics & Compound Procedural 3D Prefabs
- **Camera (`src/render/camera-rig.ts`):**
  - Elevated 50° orbital chase camera that tracks the player kart with smooth damping and dynamically zooms out as kart scale increases.
  - Adapts FOV and distance automatically for both **9:16 portrait** and **16:9 landscape** inside `#shell-stage` with zero floor/pedestal occlusion.
- **Stylized Toony Soft Daylight (`src/render/lighting.ts` + `visual-enhancer.ts`):**
  - Pastel sky `0xcfe8f7`, warm golden sun key `0xfff6e5` (`intensity: 1.25`), warm cream stone arena `0xfcf8ee`, `RoomEnvironment` IBL reflections, and Fresnel rim-lighting.
- **Compound Procedural Prefabs (`src/render/PrefabFactory.ts`):**
  - Multi-part Bumper Kart (`RoundedBoxGeometry` chassis, thick torus rubber bumper tube, 4 spinning wheels, driver helmet, spring antenna with waving flag, deployable golden spike ring, and nitro flame cone).
