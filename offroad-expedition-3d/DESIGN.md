# OFFROAD EXPEDITION 3D // 4X4 ROCK CRAWLER — Game Design Document

## 1. Core Loop & 2-Second Hook
- **Genre:** 3D Heavy Physics Rock Crawling & Mud Expedition (`Spintires`, `MudRunner`, `SnowRunner`, and `Offroad Outlaws` benchmark).
- **2-Second Hook:** Immediately upon clicking **`OYNA`** on the Minimalist Theme-Matched Start Menu (`#shell-start-menu`), the player pilots a lifted 4x4 Offroad Crawler carrying expedition supply crates across rugged mountain trails, deep mud bogs, boulder gardens, and suspended timber log bridges alongside 2 AI Expedition Support Trucks (`ATLAS_4X4`, `KODIAK_PRO`).
- **Interactive Winch & Diff-Lock Mechanics:**
  - When entering deep mud bogs or steep boulder inclines, the truck experiences realistic mud drag and axle articulation tilt.
  - Pressing `W` / `E` / `Space` (or tapping the **🪝 WINCH ANCHOR** action button) fires a glowing 3D steel winch line to the nearest trailside anchor tree/winch post, hoisting the truck up steep rock faces and out of mud pits!

## 2. Solvable Trail & Suspension Math Spec
- **4-Wheel Independent Articulation & Pitch/Roll Stability:**
  - Deterministic terrain height + boulder bump sampling across 4 wheel contact points computes live front/rear axle roll angles and chassis pitch without unrecoverable physics explosions.
  - Trail boundaries (`±6.5m`) gently guide the 4x4 truck back onto the expedition trail, and every mud bog or rock garden has roadside winch anchor trees within `18m` reach.

## 3. Three Mandatory Rewarded Ad Revenue Hooks (`65-monetization-ads`)
1. **Hook 1 — In-Trail Expedition Boosters (Bottom HUD Bar):**
   - **🪝 SUPER WINCH HOIST (`booster_winch`):** 2.5x cable winch pull speed + automatic anchor lock for 10 seconds.
   - **🛞 MUD MONSTER TIRES (`booster_tires`):** Zero mud-bog speed penalty and 100% rock traction for 15 seconds.
   - **⚙️ DIFF-LOCK OVERDRIVE (`booster_difflock`):** 2x low-range climb torque + 100% cargo stabilization for 15 seconds.
2. **Hook 2 — Near-Miss Overturn / Fuel Time Revive (`revive_crawler`):**
   - If the truck tips over on a steep boulder or fuel/time runs out near Base Camp, prompts **"TRUCK STALLED NEAR BASE CAMP! Watch Ad to Auto-Right Vehicle with Full Winch & Diff-Lock"**.
3. **Hook 3 — Victory Oscillating Multiplier Bar (`victory_multiplier`) & 4x4 Expedition Garage:**
   - Oscillating `1.5x / 2x / 3x / 5x` needle on the Base Camp Delivery screen + persistent **4x4 Expedition Garage** (6 Truck Liveries + Axle Lift, Winch Power & Mud Tire upgrades).

## 4. 360° Camera Ergonomics & Hybrid 3D Asset Spec
- **Camera:** Elevated 3/4 offroad follow camera that pitches with mountain slopes and zooms out slightly when the winch cable is active; zero terrain occlusion in **9:16 portrait** and **16:9 landscape**.
- **Hybrid 3D Prefab Pipeline:** Uses `AssetResolver.resolveHybridModel` (`public/models/crawler_truck.glb`) with `ProceduralMeshBuilder.createCarChassis` + `createDetailedWheel` fallback, roof rack cargo crates, snorkel intake, and 3D winch cable line.
