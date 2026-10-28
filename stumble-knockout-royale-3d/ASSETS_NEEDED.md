# ASSETS_NEEDED.md — Optional Hot-Swap 3D Models (`stumble-knockout-royale-3d`)

This game uses **Large-Scale Compound Procedural 3D Prefabs** (`src/render/PrefabFactory.ts`) enhanced by `VisualEnhancer` (`RoomEnvironment` IBL + `RoundedBoxGeometry` + Fresnel rim-lighting) within the `< 100 MB` YouTube Playables ceiling.

You can optionally drop custom `.glb` models into `public/models/` for automatic hot-swap loading via `asset-integrator`:

| Slot ID | File Path | Target Triangle Budget | Pivot / Forward Axis | Description |
| :--- | :--- | :--- | :--- | :--- |
| `party_runner` | `public/models/party_runner.glb` | `< 5,000 tris` | Bottom-center `(0,0,0)`, `+Z` forward | Stylized bean-runner character with arms/legs |
| `sweeper_hammer` | `public/models/sweeper_hammer.glb` | `< 2,500 tris` | Center `(0,0,0)` | Rotating padded obstacle bar / pendulum hammer |
| `golden_crown` | `public/models/golden_crown.glb` | `< 2,000 tris` | Center `(0,0,0)` | Giant floating tournament finale crown |
