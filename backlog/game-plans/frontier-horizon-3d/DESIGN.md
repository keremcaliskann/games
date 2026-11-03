# FRONTIER HORIZON 3D // ALL-TERRAIN SIMULATOR (`frontier-horizon-3d`)
> **Complete Unabridged Game Architecture & Design Specification (6-Stage Workshop Output)**

---

## 1. Core Identity, Flow & Camera Ergonomics (Stage 1)

- **Game ID:** `frontier-horizon-3d`
- **Title:** `FRONTIER HORIZON 3D // ALL-TERRAIN SIMULATOR`
- **Genre:** Open-World All-Terrain Vehicle Physics, Waypoint Expedition & Hidden Collectible Exploration Simulator
- **Boot & Menu Flow:**
  1. **Full-Cover Start Menu (`#shell-start-menu`):** Covers 100% of `#shell-stage` with an opaque theme-matched background. Zero background simulation or rendering runs while `shell.isMenuOpen === true`. Selects difficulty (`Kolay / Normal / Zor`) and clicks `▶ OYNA`.
  2. **Panoramic 3D Showroom / Garage Studio (`GarageView`):** Immediately upon clicking `OYNA`, the player enters the 3D Showroom Studio where the currently selected vehicle rests on a sunlit stone turntable (`360°` mouse/touch drag orbit). From here, the player can:
     - Browse and purchase from the **7-Vehicle Fleet**.
     - Customize **12 Body Paint Colors**, **3 Paint Finishes** (`Matte`, `Gloss`, `Metallic`), and **3 Roof/Expedition Accessories** (`LED Light Bar`, `Roof Rack & Spare Tire`, `Desert Snorkel`).
     - Upgrade **4 Mechanical Systems** (`Engine Torque`, `Suspension Travel`, `Tire Tread Grip`, `4x4 AWD Gearbox`) with live stat bars.
     - Select one of the **3 Separate Open-World Biomes** (**Forest** [Unlocked], **Desert** [Unlocks after 5 Forest Waypoints], **Mountain** [Unlocks after 5 Desert Waypoints]) and click **`SÜRÜŞE BAŞLA`**.
  3. **Seamless Return to Garage:** At any time during open-world driving, clicking the top-left `🏠 GARAJ` button returns to the 3D Showroom Studio with all earned cash, unlocked biomes, and discovered collectibles persisted.

### 1.1 Multi-Mode Camera System (`C` Key / HUD Camera Button)
1. **Mode 1 — Dynamic TPS Chase Camera (Default):**
   - Smooth spring-damped follow camera (`fovPortrait: 60`, `fovLandscape: 50`, `followDistance: 9.5m`, `followHeight: 4.2m`, velocity look-ahead `+3.5m`).
   - Automatically elevates pitch slightly on steep downhill/uphill grades to prevent terrain occlusion.
2. **Mode 2 — 360° Free Orbit Camera:**
   - Mouse drag or single-finger touch drag orbits freely (`360°` yaw, `10°–80°` pitch) around the vehicle to inspect suspension articulation and scout surrounding cliffs/hidden paths.
3. **Mode 3 — Hood / Cockpit-Top Camera:**
   - Mounted just above the hood (`+0.6m` up, `+0.8m` forward), transmitting every chassis pitch/roll angle directly for immersive rock crawling and mud crossing.
4. **Mode 4 — Tactical Far Panoramic Camera:**
   - High-altitude wide overview (`followDistance: 18m`, `followHeight: 11m`) ideal for spotting distant terrain ridges, rivers, and hidden collectible alcoves.

### 1.2 Controls & Driving Actions
- **Throttle / Brake & Reverse:** `W / S` or `Up / Down` arrows on Desktop; Right-side proportional Gas/Brake pedals on Mobile.
- **Steering (Camera-Relative):** `A / D` or `Left / Right` arrows on Desktop; Left-side dynamic-anchor floating joystick or steering buttons on Mobile.
- **Handbrake (`Space` / HUD Button):** Locks rear wheels (`rearSlipMultiplier = 2.4`) for tight mountain hairpin turns or holding position on steep slopes.
- **4x4 AWD / Diff-Lock Toggle (`E` Key / `4x4 LOCK` HUD Button):**
  - **2WD / Open Mode:** Higher top speed on dry trails, tighter turning radius, lower rolling resistance.
  - **4x4 LOCK Mode:** Equalizes torque across all driven wheels, multiplying traction in deep mud (`+65%`), soft desert sand (`+55%`), and steep mountain rock (`+70%`), while slightly widening the turning radius (`steerRate * 0.85`).
- **Vehicle Recover / Flip Reset (`R` Key / `🔄 KURTAR` Button):** Smoothly rights the vehicle onto the nearest stable ground 2m above terrain with zero penalty if flipped or wedged.
- **Headlights Toggle (`L` Key / `💡` Button):** Toggles high-beam front LED spotlights and rear tail markers (crucial inside forest caves, waterfall caverns, and mountain mine tunnels).
- **Horn (`H` Key / `📯` Button):** Synthesizes vehicle-class horn; nearby friendly AI patrol vehicles honk back and flash their headlights.
- **Slow-Motion / Cinematic Suspension View (`V` Key / `🎬` Button):** Temporarily scales simulation time to `0.4x` to admire wheel suspension compression over boulders and jumps.

---

## 2. Realistic Vehicle & All-Terrain Physics Engine (Stage 2)

### 2.1 Independent Multi-Wheel Raycast Suspension & Weight Transfer
Every vehicle (4 wheels, or 6 wheels on the `Mammoth 6x6 Truck`) simulates independent vertical suspension rays at each wheel hub:
- **Spring-Damper Force Law (per wheel $i$):**
  $$F_{\text{spring}, i} = k_{\text{spring}} \cdot (L_{\text{rest}} - L_{i}) - c_{\text{damper}} \cdot v_{\text{compression}, i}$$
- **Chassis Pitch & Roll Dynamics:**
  - Longitudinal acceleration/braking shifts weight between front and rear axles ($\Delta W_{\text{long}} = \frac{h_{\text{cg}}}{L_{\text{wheelbase}}} m a_{\text{long}}$), producing realistic nose-dive under braking and squat under throttle.
  - Lateral cornering and cross-slope driving shift weight between left and right wheels, tilting the chassis (`rollAngleRad`, `pitchAngleRad`) and visually compressing/extending each wheel mesh and coil spring independently.
- **Pacejka-Inspired Lateral Slip & Traction Circle:**
  - Combined longitudinal traction ($F_{\text{traction}}$) and lateral cornering force ($F_{\text{lat}}$) are bounded by the tire friction ellipse:
    $$\sqrt{F_{\text{long}}^2 + F_{\text{lat}}^2} \le \mu_{\text{surface}} \cdot \mu_{\text{tire}} \cdot F_{\text{normal}}$$

### 2.2 Five Distinct Terrain Surface Physics Profiles

| Surface Type | Biomes Present | Base Grip ($\mu_{\text{surface}}$) | Rolling Drag | Sink Depth (m) | `4x4 LOCK` (`E`) Traction Boost | Particle & Audio Signature |
|---|---|---|---|---|---|---|
| **1. Packed Dirt Trail** | Forest, Desert, Mountain | `1.00` | `0.018` | `0.00m` | `+10%` | Light dust puffs, crisp gravel roll |
| **2. Deep Forest Mud** | Forest marshes, riverbanks | `0.42` (2WD) / `0.86` (4x4) | `0.085` | `0.18m` | `+65%` (Essential) | Thick brown mud chunks + squelch SFX |
| **3. Soft Desert Sand** | Desert dunes & basins | `0.50` (2WD) / `0.88` (4x4) | `0.068` | `0.14m` | `+55%` (Essential) | Golden sand spray + soft hiss SFX |
| **4. Steep Mountain Rock** | Mountain ledges, canyon slabs | `0.94` (Requires high torque) | `0.022` | `0.00m` | `+70%`爬坡 (Anti-slip) | Tire chirp + suspension coil creak |
| **5. Alpine Ice / Loose Gravel** | Mountain summit & scree | `0.36` (2WD) / `0.64` (4x4) | `0.012` | `0.02m` | `+45%` | Frost/pebble spray + slide scrape SFX |
| **Water / Oasis Crossing** | Forest river, Desert oasis | `0.68` | `0.110` (Hydro-drag) | `0.25m` | `+40%` | White water splashes + wading SFX |

### 2.3 Engine Torque Curve & 5-Speed Automatic Gearbox (`1–5 + R`)
- Simulates realistic engine `RPM` (`800 RPM` idle to `6,500 RPM` redline) with automatic gear shifting (`Gear 1` high torque ratio `3.6:1` for vertical rock/mud climbing down to `Gear 5` overdrive `0.85:1` for high-speed desert/forest straights, plus `R` Reverse).
- Steep uphill grades load the engine, causing automatic downshifts into `Gear 1` or `Gear 2` so the player hears and feels the engine roar under load.
- **Zero Annoyance Policy:** No fuel depletion and no mechanical breakdown damage that halts driving — 100% pure driving and exploration satisfaction.

### 2.4 Difficulty Selection (`Kolay / Normal / Zor`) Impact
- **`Kolay` (`easy`):** Tire grip `+25%`, anti-roll stabilization `+30%`, mud/sand drag `-25%`, standard waypoint rewards (`1.0x`).
- **`Normal` (`normal`):** Authentic baseline suspension, traction, and mud/sand resistance (`1.0x` rewards).
- **`Zor` (`hard`):** Full simulation physics — realistic center-of-gravity sensitivity, deeper mud/sand drag (`+20%`), lower ice/mud base grip (`-15%`), and **`+30%` bonus cash (`$`) on all Waypoints and Hidden Collectibles**!

---

## 3. Waypoint Expeditions, Hidden Collectibles & Navigation Systems (Stage 3)

### 3.1 Multi-Layered Waypoint Expedition System ("Hedefe Ulaşma")
- Each biome features an infinite/chained sequence of **Expedition Waypoint Missions** (Valley Checkpoints, Mud River Crossings, Ridge Climbs, Bridge Traversals, Summit/Oasis Deliveries).
- **Visual Guidance:**
  - The active destination projects a tall, glowing **3D Sky Beacon Pillar** visible from across the map, paired with a real-time distance readout (`340m`) and toggleable on-ground **Dynamic GPS Chevrons (`G` Key / HUD Toggle)**.
- **Progressive Biome Unlock Rule (Mandatory):**
  - **Biome 1 (Forest):** Unlocked from the start. Completing **5 Waypoint Targets (`5/5`)** in the Forest permanently unlocks **Biome 2 (Desert)**!
  - **Biome 2 (Desert):** Completing **5 Waypoint Targets (`5/5`)** in the Desert permanently unlocks **Biome 3 (Mountain)**!
  - **Biome 3 (Mountain):** Completing **5 Waypoint Targets (`5/5`)** in the Mountain awards the **Grand Frontier Explorer Badge** and `$1,000` milestone bonus, while endless new waypoint routes continue in all 3 biomes.

### 3.2 Hidden Collectibles & Proximity Radar ("Gizli Öğeler Bulma")
- Each of the 3 biomes hides **10 Hand-Crafted Secret Collectibles (`30 Total` across the game)**:
  - **5 Golden Expedition Crates (`Altın Keşif Sandığı`):** Hidden behind waterfalls, under wooden bridges, inside dense forest groves, or atop canyon ledges.
  - **5 Ancient Relics / Legendary Parts (`Antik Kalıntı`):** Hidden inside deep caves, oasis ruins, cliffside terraces, and mountain mine tunnels.
- **60m Proximity Signal Radar (`📡 GİZLİ ÖĞE SİNYALİ`):**
  - Whenever the player drives within `60m` of an undiscovered collectible, a pulsing signal strength bar (`1 to 5 bars`) appears at the top of the HUD accompanied by an accelerating sonar ping (`beep... beep... beep!`), guiding the player to search the immediate terrain.
- **10/10 Biome Completion Bonus:** Finding all 10 hidden collectibles in a biome grants a massive **`$1,200` Completion Jackpot** and unlocks a special **Biome Exclusive Paint Finish**.

### 3.3 Watchtowers (Keşif Gözetleme Kuleleri) & Navigation HUD
- Each biome features **3 High-Altitude Watchtowers / Radio Antennas** perched on challenging peaks or cliffs.
- Driving into a Watchtower's base zone activates the tower with a sweeping radar pulse animation, awards **`$120`**, and reveals **approximate search circles on the Minimap** for nearby undiscovered Hidden Collectibles!
- **Top Compass Bar & Corner Minimap:**
  - **Top Compass Strip:** Displays cardinal bearings (`N / NE / E / SE / S / SW / W / NW`), active Waypoint Beacon icon, Watchtower icons, and nearest Hidden Signal direction.
  - **Top-Right Circular Minimap:** Renders nearby terrain contours, trails, player heading arrow, friendly AI patrol vehicles, active waypoint, and Watchtower search rings.

### 3.4 Living Ecosystem (Friendly AI Patrol Vehicles)
- Each biome spawns **5 Friendly AI All-Terrain Expedition Vehicles** that autonomously patrol the main dirt trails and secondary ridges with realistic wheel suspension.
- They yield politely if the player approaches, flash their roof lights, and honk back when the player presses `H` (Horn).

---

## 4. Three Separate Open-World Biomes (`1400m x 1400m` Each) (Stage 4)

Each biome is an independent, self-contained **`1400m x 1400m` open world** with up to **`120m` vertical elevation relief**, interactive physics props (destructible wooden fences, barrels, crates, traffic cones, loose boulders), natural jump ramps (with **Airtime Bonus `$`**), and 3 Watchtowers:

| Biome ID & Name | Unlock Condition | Terrain & Landmarks | Surface Mix | Daylight Atmosphere Palette |
|---|---|---|---|---|
| **1. `forest` — ZÜMRÜT ORMAN VADİSİ (Emerald Pine Valley)** | **Unlocked at Start** | Dense pine & oak groves, deep mud marshland trails, shallow fordable river, **Hidden Waterfall Cavern**, wooden log bridges, Old Timber Mill Camp, 3 Fire Watchtowers | 45% Dirt Trail, 30% Deep Mud, 15% River Water, 10% Mossy Rock | Sky `0xcfe8f7`, Warm Sun `0xfff6e5`, Valley Meadow `0x5b8c5a`, Mud `0x5c4033` |
| **2. `desert` — KIZIL KANYON & ÇÖL (Sunburst Red Canyon)** | **Complete 5 Waypoints in Forest** | Sweeping golden sand dunes, towering red sandstone arches, **Palm Oasis Lake**, Ancient Sun Temple Ruins, narrow slot canyon, natural cliff jumps, 3 Mesa Watchtowers | 45% Soft Sand Dunes, 35% Red Sandstone Rock, 15% Hardpan Trail, 5% Oasis Water | Sky `0xdbeefd`, Golden Sun `0xfff3d6`, Warm Sand `0xe6c288`, Red Rock `0xc86d51` |
| **3. `mountain` — YABAN DAĞ ZİRVELERİ (Alpine High Peaks)** | **Complete 5 Waypoints in Desert** | Steep cliffside hairpin switchbacks, boulder-crawling steps, **Abandoned Mine Tunnel**, suspension bridge over chasm, icy snow-dusted summit plateau, 3 Summit Radio Towers | 40% Steep Mountain Rock, 30% Alpine Ice/Snow, 30% Loose Gravel Switchbacks | Sky `0xcfe8f7`, Crisp Sun `0xfff8eb`, Granite Ridge `0x94a3b8`, Alpine Snow `0xf1f5f9` |

---

## 5. Detailed 3D Garage Menu, 7-Vehicle Fleet, Customization & Economy (Stage 5)

### 5.1 The 7-Vehicle All-Terrain Fleet (Purchased with Earned Cash `$`)

| # | Vehicle ID | Name & Class | Price (`$`) | Drive & Wheels | Base Top Speed | Base Torque (Climb) | Base Grip | Base Suspension Travel | Signature Strength |
|---|---|---|---|---|---|---|---|---|---|
| **1** | `trail-scout` | **Trail Scout 4x4** (Classic Offroad Jeep) | **FREE (`$0`)** | 4x4 (4 Wheels) | `88 km/h` (52/100) | 58/100 | 62/100 | `0.38m` (60/100) | Balanced all-around starter 4x4 |
| **2** | `dune-buggy` | **Dune Buggy V6** (Lightweight Desert Rail) | **`$1,200`** | 4x4 (4 Wheels) | `118 km/h` (78/100) | 54/100 | 66/100 | `0.48m` (76/100) | High speed, huge airtime jumps & sand agility |
| **3** | `canyon-pickup` | **Canyon Pickup 4x4** (Heavy Duty Crew Cab) | **`$2,500`** | 4x4 (4 Wheels) | `102 km/h` (66/100) | 74/100 | 72/100 | `0.44m` (68/100) | Strong mud/towing torque & long wheelbase stability |
| **4** | `rally-raid` | **Rally Raid SUV** (Dakar Spec Expedition) | **`$4,200`** | 4x4 (4 Wheels) | `134 km/h` (88/100) | 76/100 | 80/100 | `0.50m` (80/100) | Fast across all terrains with responsive handling |
| **5** | `rock-crawler` | **Rock Crawler Pro** (Tube-Frame Monster) | **`$6,800`** | 4x4 Lock (4 Giant Tires) | `96 km/h` (62/100) | 92/100 | 94/100 | `0.68m` (96/100) | Extreme suspension articulation; climbs vertical boulders |
| **6** | `mammoth-6x6` | **Mammoth 6x6 Truck** (Heavy Expedition Rig) | **`$10,000`** | **6x6 (6 Driven Wheels)** | `92 km/h` (60/100) | **98/100** | 92/100 | `0.56m` (86/100) | 6 independent wheels; unstoppable in deep mud & steep peaks |
| **7** | `apex-hyper` | **Apex Hyper 4x4** (Ultimate Offroad Supercar) | **`$15,000`** | 4x4 Active (4 Wheels) | **`155 km/h` (98/100)** | 95/100 | 96/100 | `0.58m` (90/100) | Peak speed, torque, and suspension combined |

### 5.2 Visual Customization Studio (Body Paint, Finish & Roof Accessories)
1. **12 Body Paint Colors (Free instant preview & apply on owned vehicles):**
   - `0xf97316` (Expedition Orange), `0xef4444` (Crimson Red), `0xeab308` (Sandstorm Yellow), `0x22c55e` (Forest Emerald), `0x15803d` (Tactical Olive), `0x0ea5e9` (Alpine Cyan), `0x2563eb` ( Cobalt Blue), `0x6366f1` (Indigo Night), `0xa855f7` (Royal Amethyst), `0xf8fafc` (Glacier White), `0x94a3b8` (Titanium Silver), `0x334155` (Stealth Graphite).
2. **3 Paint Surface Finishes:**
   - **Mat Arazi Boyası (Matte):** `roughness: 0.55`, `metalness: 0.05`
   - **Parlak Vernikli (Gloss):** `roughness: 0.28`, `metalness: 0.12`
   - **Metalik Sedefli (Metallic):** `roughness: 0.32`, `metalness: 0.48`
3. **3 Roof & Body Expedition Accessories (Toggleable per vehicle):**
   - **Tavan LED Projektör Barı (Roof LED Light Bar):** Adds 4 high-intensity roof spotlights (`$250` or unlocked).
   - **Keşif Sepeti & Yedek Lastik (Expedition Roof Rack & Spare Wheel):** Mounts tubular roof cage, jerrycans, and full-size spare tire (`$400`).
   - **Çöl & Nehir Şnorkeli (Raised Air Intake Snorkel):** Mounts A-pillar expedition snorkel (`+15%` deep water/mud wading efficiency, `$350`).

### 5.3 Per-Vehicle 4-Stat Mechanical Upgrade System (Levels 1 to 5)
Each owned vehicle can be mechanically upgraded across 4 stats (Level 1 -> Level 5, each level adds `+6%` to that stat):
- **1. Motor Torku & Güç (`Engine`):** Increases acceleration, top speed, and steep hill-climbing torque.
- **2. Süspansiyon Esnemesi (`Suspension`):** Increases wheel travel, damping smoothness, and landing stability.
- **3. Arazi Lastik Tutunması (`Tires`):** Increases lateral and longitudinal grip on mud, sand, rock, and ice.
- **4. 4x4 AWD Şanzıman (`Drivetrain`):** Increases `4x4 LOCK` effectiveness and reduces mud/sand rolling resistance.
- *Upgrade Cost Curve (Challenging Economy):* Level 2: `$250`, Level 3: `$550`, Level 4: `$1,050`, Level 5: `$1,800`.

### 5.4 Challenging / Rewarding Progression Economy & 3 Mandatory Rewarded Ad Hooks
To ensure purchasing new vehicles (`$1,200` to `$15,000`) feels genuinely earned and rewarding:
- **Standard Earnings Table:**
  - **Waypoint Reached (`Hedefe Ulaşma`):** `$110` base + `$15` per difficulty tier (`+$40` on Hard) + distance bonus (`$110–$220` per waypoint).
  - **Hidden Golden Crate (`Altın Keşif Sandığı` — 5 per biome):** `$180` each.
  - **Hidden Ancient Relic (`Antik Kalıntı` — 5 per biome):** `$320` each.
  - **Watchtower Activated (`Gözetleme Kulesi` — 3 per biome):** `$120` each + reveals collectible search zones on Minimap.
  - **Airtime Jump Bonus (`Havada Kalma > 1.2s`):** `$25–$60` per clean ramp jump.
  - **Biome 10/10 Collectibles Master Bonus:** `$1,200` jackpot.
- **3 Mandatory Rewarded Ad Hooks (`UniversalAdProvider`):**
  1. **Hook 1 — In-Level Exploration Boosters (Bottom-Left / HUD Chips):**
     - **📡 Gizli Öğe Radar Pusulası (Secret Finder Pulse — 60s):** Points a direct 3D golden compass arrow to the nearest undiscovered Hidden Collectible for 60 seconds.
     - **⚡ Süper 6x6 Tork & Çekiş Gücü (Mega Torque & Grip — 45s):** Boosts engine torque and mud/sand traction by `+50%` for 45 seconds to conquer extreme cliffs.
  2. **Hook 2 — Near-Miss / Cliff Rescue & Instant Cash Drop (`KURTAR & +$250 DESTEK`):**
     - Triggered when the vehicle rolls over on a steep cliff, sinks in deep marsh/water, or when the player requests an instant field supply drop. Rights the vehicle with a 30s Super-Grip shield and grants `+$250` expedition funds.
  3. **Hook 3 — Waypoint / Milestone Victory Multiplier Bar (`1.5x -> 2x -> 3x -> 5x`):**
     - Upon completing a major Expedition Milestone (every 5th Waypoint / Biome Unlock or Collectible Milestone), displays the oscillating multiplier needle bar allowing the player to multiply the milestone payout up to `5x`!

---

## 6. 3D Visual Art (`PrefabFactory`), HUD Layout & Procedural Web Audio (Stage 6)

### 6.1 Compound Procedural 3D Prefabs & `.glb` Hot-Swap (`PrefabFactory.ts` + `ASSETS_NEEDED.md`)
All 7 vehicles and biome landmarks are built with multi-part hierarchical `THREE.Group` assemblies via `ProceduralMeshBuilder` and `VisualEnhancer` (`RoundedBoxGeometry`, Fresnel rim lighting, procedural tread/grille textures) and wrapped in `AssetResolver.resolveHybridModel()`:
- **Independent Wheel & Suspension Hierarchy:** Every vehicle prefab exposes `wheels: THREE.Object3D[]` (4 or 6 wheels with deep offroad tire treads, metallic rims, and visible coil springs) that dynamically translate vertically (`wheel.position.y`) and steer (`wheel.rotation.y`) every frame based on the physics solver.
- **Working Lights:** Front headlight cones + emissive lenses (`L` key) and rear red brake light meshes that brighten automatically when braking.
- **Roof Accessories:** Child groups `accLightBar`, `accRoofRack`, and `accSnorkel` toggled live in the Garage and in-world.

### 6.2 Driving HUD & Telemetry Layout (`src/ui/hud.ts`)
- **Top-Left Expedition & Wallet Card:** Current Cash (`$1,450`), Active Biome Name, Biome Waypoint Progress (`Hedef: 3/5`), Biome Secret Collectibles (`Gizli Öğe: 4/10`), Watchtowers (`Kule: 2/3`), and **`🏠 GARAJ & ARAÇLAR`** button.
- **Top-Center Compass & Proximity Signal Bar:**
  - Horizontal compass strip (`N — E — S — W`) with live markers for the active Waypoint Beacon and Watchtowers.
  - **`📡 GİZLİ ÖĞE SİNYALİ`** pulsing bar (automatically appears within `60m` of a hidden crate/relic).
- **Top-Right Circular Minimap & Camera Controls:**
  - 2D Canvas radar showing player position, trails, elevation rings, Watchtower collectible zones, and active Waypoint direction.
  - Quick action buttons: `📷 Kamera (C)`, `💡 Far (L)`, `📯 Korna (H)`, `🔄 Kurtar (R)`, `🎬 Ağır Çekim (V)`.
- **Bottom-Right Realistic Offroad Telemetry Cluster:**
  - Digital + Arc Speedometer (`km/h`), Engine `RPM` bar, current Gear indicator (`1 / 2 / 3 / 4 / 5 / R`), interactive **`4x4 LOCK (E)`** differential lock button with active amber indicator LED, **`EL FRENİ (Space)`** button, and live **Chassis Pitch / Roll Inclinometer (`°`)** gauge.

### 6.3 Procedural Web Audio Synthesizer (`src/core/audio.ts`)
- **Engine & Exhaust Synthesizer:** Continuous dual-oscillator (`sawtooth` + filtered `triangle` sub-bass) modulated smoothly by engine `RPM`, throttle load, and gear shift drops.
- **Suspension & Terrain SFX:** Spring compression creaks on heavy impacts, mud squelching, sand hiss, gravel crunch, water splash on river entry, sonar proximity pings (`880Hz -> 1320Hz`) near hidden collectibles, dual-tone horn, and celebratory chords on Waypoint/Collectible discovery.
