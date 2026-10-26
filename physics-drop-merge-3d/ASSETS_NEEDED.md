# 3D Asset Hot-Swap Specification — DROP MERGE 3D

This game runs out-of-the-box with **100% procedural compound 3D prefabs** constructed in `src/render/PrefabFactory.ts`.
Optionally, glTF / GLB assets may be placed into `public/models/` to upgrade visual models. If present, the engine automatically swaps them in; otherwise, procedural fallbacks are used.

---

## Procedural Fallback vs. Optional GLB Upgrade

| Prefab Name | Procedural Fallback Composition | Optional GLB Path | Max Triangles |
| :--- | :--- | :--- | :---: |
| **Acrylic Jar Container** | Translucent double-walled cylinder with frosted base and warning danger ring | `public/models/container.glb` | < 1,000 |
| **Dropper Crane Guide** | Minimalist sliding rail crane with drop indicator pin | `public/models/dropper.glb` | < 600 |
| **Tier 1–11 Fruit Spheres** | Glossy candy sphere geometries with custom fruit faces & stem leaves | `public/models/fruit_spheres.glb` | < 800 / sphere |
| **Bomb Sphere** | Black hazard sphere with spark fuse and skull decal | `public/models/bomb_sphere.glb` | < 600 |

---

## Material & Lighting Calibration
- All models must use PBR Roughness/Metalness workflow.
- Calibrated for warm daylight key light (`#fff6e5`, 1.25 intensity) and soft sky ambient (`#cfe8f7`).
- Recommended roughness: `0.25` to `0.35`; metalness: `0.05` to `0.15`.
