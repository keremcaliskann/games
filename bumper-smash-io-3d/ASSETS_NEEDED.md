# ASSETS_NEEDED.md — Optional Hot-Swap 3D Models (`bumper-smash-io-3d`)

This game uses **Tier-1 Compound Procedural 3D Prefabs** (`src/render/PrefabFactory.ts`) enhanced by `VisualEnhancer` (`RoomEnvironment` IBL + `RoundedBoxGeometry` + Fresnel rim-lighting) so it runs at 60 FPS with `0 KB` external asset downloads.

You can optionally drop custom `.glb` models into `public/models/` for automatic hot-swap loading via `assetintegrator`:

| Slot ID | File Path | Target Triangle Budget | Pivot / Forward Axis | Description |
| :--- | :--- | :--- | :--- | :--- |
| `kart_chassis` | `public/models/kart_chassis.glb` | `< 2,000 tris` | Bottom-center `(0,0,0)`, `+Z` forward | Stylized arcade bumper kart body with driver |
| `energy_orb` | `public/models/energy_orb.glb` | `< 500 tris` | Center `(0,0,0)` | Glowing collectible arena power cell |
| `arena_island` | `public/models/arena_island.glb` | `< 2,500 tris` | Top-center `(0,0,0)`, radius `1.0m` (scaled dynamically) | Floating stone knockout ring platform |
