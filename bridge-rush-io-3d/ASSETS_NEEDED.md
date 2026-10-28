# ASSETS_NEEDED.md — BRIDGE RACE 3D // STAIR BUILDER .IO (`bridge-rush-io-3d`)

This project ships with **100% self-contained Compound Procedural 3D Prefabs** (`src/render/PrefabFactory.ts`) and procedural `RoomEnvironment` IBL polish (`src/render/visual-enhancer.ts`). Zero external assets are required to build or run at 60 FPS.

## Optional Hot-Swap `.glb` Upgrades
Drop any of the following optional `.glb` models into `public/models/` to override the procedural prefabs:

| File Path | Description | Target Scale / Poly Budget |
| :--- | :--- | :--- |
| `public/models/bridge_runner.glb` | Stylized articulated runner character with backpack mount | `1.0m` height · `< 3,500 tris` |
| `public/models/trophy_cup.glb` | Championship Golden Trophy Cup for Tier 3 Podium | `1.8m` height · `< 1,500 tris` |
