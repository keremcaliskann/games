# ASSETS_NEEDED.md — HEXA SORT 3D // CASCADE STACK

> **Zero External Asset Dependency:** This game renders 100% of its visual assets procedurally via Three.js compound prefabs (`PrefabFactory.ts`), guaranteeing instant startup, < 2 MB bundle size, and 60 FPS performance without requiring any external `.glb` files.

---

## 1. Active Procedural 3D Prefabs (`src/render/PrefabFactory.ts`)

| Prefab Name | Geometry Architecture | Materials & Shaders | Purpose |
|---|---|---|---|
| **`HexCellMesh`** | Beveled 6-sided `CylinderGeometry` rim + sunken inner hex basin. | Soft cream biscuit foundation (`0xfcf8ee`), `roughness: 0.55`, `metalness: 0.05`. | Honeycomb board slot. Displays subtle golden highlight when hovered during drag. |
| **`HexTileMesh`** | 6-sided `CylinderGeometry` with chamfered top/bottom edges + embossed geometric face decal. | Vibrant pastel vinyl finish (`roughness: 0.48`), 6 distinct colors with soft specular sheen. | Individual stackable game tile. Stacked along Y axis with slight bevel spacing (`y = index * 0.14`). |
| **`TraySlotMesh`** | Rounded rectangular biscuit plate with 3 sunken circular hex docks. | Warm cream matte plastic (`0xf3ede2`), soft ambient contact shadow. | Bottom dispenser tray for draggable stacks. |
| **`CascadeParticleVoxel`** | Small beveled procedural cubes pooled in memory (`100` instances). | High-saturation vertex-colored plastic with physics velocity decay and alpha fade. | Emitted during 10-tile combo clears and Near-Miss hammer impacts. |

---

## 2. Optional Hot-Swap 3D Asset Upgrade (Drop-in Support)

If a 3D modeler provides custom `.glb` assets, place them in `public/models/` using these exact filenames. `PrefabFactory.ts` will automatically detect and prioritize them over procedural geometry:

1. **`public/models/hex_tile_custom.glb`**
   - **Target:** Stylized custom hex token (e.g., carved wood, futuristic gem, or collectible chip).
   - **Budget:** $\le 800$ triangles, single $512\times 512$ Albedo/ORM texture, centered pivot $(0,0,0)$, bounding box $1.0 \times 0.14 \times 1.0$.
2. **`public/models/tray_dock.glb`**
   - **Target:** Stylized 3D wooden or futuristic plastic tray station.
   - **Budget:** $\le 1500$ triangles, centered pivot.
