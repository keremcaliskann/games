# ASSETS NEEDED — SMASH KARTS 3D // ROCKET BATTLE ROYALE .IO

This game uses **Tier-1 Compound Procedural 3D Prefabs** out of the box (multi-part armored kart chassis, roll cage, 4 spinning wheels, roof-mounted rotating twin-turret/rocket pod, glowing Mystery Weapon Crates, stunt ramps, and closing storm ring) and runs at 60 FPS with zero external assets required.

## Optional Hot-Swap `.glb` Upgrades (`public/models/`)

If you wish to replace the procedural prefabs with custom Blender/Blockbench `.glb` models, drop them into `public/models/` using the exact filenames below:

| File Path | Target Entity | Recommended Polycount | Pivot & Orientation |
| :--- | :--- | :--- | :--- |
| `public/models/battle_kart.glb` | Player & AI Combat Kart Chassis | `< 3,500 tris` | Bottom-center (`Y = 0`), facing `+Z` |
| `public/models/weapon_crate.glb` | Mystery Weapon Crate (`?`) | `< 800 tris` | Center (`0, 0, 0`), `1.2 × 1.2 × 1.2` m |
| `public/models/power_cube.glb` | Dropped Power Cube Pickup | `< 500 tris` | Center (`0, 0, 0`), `0.7 × 0.7 × 0.7` m |
