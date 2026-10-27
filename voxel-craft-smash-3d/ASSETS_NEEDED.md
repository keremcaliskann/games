# Optional 3D Model Upgrades (`ASSETS_NEEDED.md`)

This game runs out-of-the-box with **100% lightweight procedural Compound & Instanced Voxel 3D Prefabs** (`src/render/PrefabFactory.ts`), guaranteeing instant startup, zero external network requests (CSP clean), and a bundle well under 50 MB.

If you wish to enhance visual fidelity with custom artist-crafted `.glb` models, you can place optional low-poly GLTF/GLB files into the `public/models/` folder:

| Model File | Target Usage | Scale & Pivot Spec | Preferred Polycount |
|---|---|---|---|
| `public/models/turret_cannon.glb` | Replaces procedural turret model | Centered base pivot, ~1.8m height | < 1,500 tris |
| `public/models/voxel_golem.glb` | Replaces procedural golem enemy | Base foot pivot, ~3.0m height | < 1,800 tris |
| `public/models/tnt_barrel.glb` | Replaces procedural TNT block | Center pivot, ~1.0m cube | < 500 tris |

The game's `PrefabFactory` automatically detects any supplied `.glb` files and hot-swaps them while maintaining identical collider footprints and daylight shading.
