# Optional 3D Model Upgrades (`ASSETS_NEEDED.md`)

This game runs out-of-the-box with **100% lightweight procedural Compound 3D Prefabs** (`src/render/PrefabFactory.ts`), guaranteeing instant startup, zero external network requests (CSP clean), and a bundle well under 50 MB.

If you wish to enhance visual fidelity with custom artist-crafted `.glb` models, you can place optional low-poly GLTF/GLB files into the `public/models/` folder:

| Model File | Target Usage | Scale & Pivot Spec | Preferred Polycount |
|---|---|---|---|
| `public/models/city_car.glb` | Replaces procedural sedan props | Centered pivot, ~2.8m length, `roughness: 0.45` | < 1,500 tris |
| `public/models/city_bus.glb` | Replaces procedural bus props | Centered pivot, ~6.5m length, yellow/cyan palette | < 2,200 tris |
| `public/models/tree.glb` | Replaces procedural park trees | Ground-level pivot, ~3.5m height, stylized toony foliage | < 800 tris |
| `public/models/building_shop.glb` | Replaces procedural townhouses | Base pivot, ~7m height, pastel daylight textures | < 2,500 tris |

The game's `PrefabFactory` automatically detects any supplied `.glb` files and hot-swaps them while maintaining identical collider footprints and daylight shading.
