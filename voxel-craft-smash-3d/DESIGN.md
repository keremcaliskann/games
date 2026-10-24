# VOXEL SMASH 3D // BLOCK MINER & TURRET — Game Design Document (DESIGN.md)

## 1. Executive Summary & Vision
- **Concept:** High-energy 3D voxel destruction & turret defense game built for YouTube Playables (`ytgame` SDK) and web portals (Yandex Games, CrazyGames, Poki).
- **Core Loop:** Aim and fire a rapid-fire ballista/cannon turret at towering 3D Minecraft-style voxel castles and advancing voxel golems. Shattered blocks rain down as bouncy physics loot cubes that vacuum into the base, awarding Coins, Fire Rate boosts, Multi-Shot upgrades, and TNT detonations.
- **Instant 2-Second Hook:** Player drags finger -> turret swivels and fires a rapid volley of energy projectiles into the front voxel tower; blocks fracture into showering gold/ore cubes with crunchy ASMR audio pops. Zero unskippable tutorial text.

---

## 2. InstancedMesh Voxel Engine & Wave Progression
Each wave generates a structured voxel fortress assembled from ~600 to 1,000 individual blocks rendered via `THREE.InstancedMesh` in a single draw call:

| Voxel Block Type | HP | Drop / Reward | Physical & Visual Behavior |
|---|:---:|---|---|
| **Cobblestone** | 2 | +10 Gold | Gray stone block, fractures into 2 stone shards |
| **Oak Wood Planks** | 1 | +5 Gold | Warm brown lumber, breaks with wood splinter sound |
| **Gold / Diamond Ore**| 3 | +35 Gold | Glistening yellow/cyan ore, showers glowing treasure cubes |
| **Red TNT Block** | 1 | **3.5m Radius Explosion** | Flashes white for 0.15s, then detonates adjacent blocks in chain shockwave |
| **Voxel Golem Enemy** | 8–25 | +80 Gold | Multi-part walking voxel automaton advancing towards the turret base |

---

## 3. 3 Mandatory Rewarded Ad Revenue Hooks (`rules/65-monetization-ads.md`)
1. **Hook 1: In-Level Tactical Boosters (Bottom HUD)**
   - **TNT Mega-Barrage:** Drops 5 high-yield explosive TNT blocks directly into the fortress center.
   - **Double Cannon (20s):** Doubles fire rate, projectile velocity, and adds +1 spread projectile.
   - **Gold Magnet Vacuum:** Instantly vacuums all scattered loot cubes across the map and doubles their gold value.
2. **Hook 2: Near-Miss Revive Modal ("BASE UNDER SIEGE!")**
   - Triggers when advancing golems breach the perimeter defense line or when Turret HP reaches 0 on a Boss wave.
   - Reward: *"Watch Ad to Detonate Nuclear Shockwave, Repel Enemies & Restore 100% Base HP!"*.
3. **Hook 3: Victory Multiplier Needle Bar**
   - At wave completion, an oscillating needle sweeps across `1.5x`, `2x`, `3x`, `5x` multipliers for multiplied Coin payouts.

---

## 4. Visual Palette & Stylized Toony Soft Daylight
- **Sky & Atmosphere:** Soft pastel daylight sky `0xcfe8f7` with subtle horizon haze.
- **Sun Key Light:** Warm golden sunlight `0xfff6e5` at intensity `1.25` with PCFSoft shadows.
- **Hemisphere Ambient:** Sky `0xdff1fc`, ground biscuit bounce `0xf4ebd9` at intensity `0.85`.
- **Floating Island:** Grass top layer `0x86efac`, cliff bedrock `0xf5eedb`.
