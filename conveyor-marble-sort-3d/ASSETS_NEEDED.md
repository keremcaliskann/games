# 3D Asset Hot-Swap Specification — CONVEYOR FLOW 3D

This game runs out-of-the-box with **100% procedural compound 3D prefabs** constructed in `src/render/PrefabFactory.ts`.
Optionally, glTF / GLB assets may be placed into `public/models/` to upgrade visual models. If present, the engine automatically swaps them in; otherwise, procedural fallbacks are used.

---

## Procedural Fallback vs. Optional GLB Upgrade

| Prefab Name | Procedural Fallback Composition | Optional GLB Path | Max Triangles |
| :--- | :--- | :--- | :---: |
| **Collector Shipping Crate** | Beveled wooden shipping box with metallic corner brackets, colored glowing intake funnel, and progress badge | `public/models/collector_crate.glb` | < 1,200 |
| **Marble Dispenser Hopper** | Cylindrical acrylic silo with top funnel, metallic mounting ring, color ring, and bottom gate lever | `public/models/hopper_dispenser.glb` | < 1,500 |
| **Segmented Conveyor Track** | Extruded oval track with dual aluminum side rails, moving tread ridges, and yellow hazard indicators | `public/models/conveyor_track.glb` | < 2,000 |
| **Glossy Factory Marbles** | High-specular sphere with swirl decal texture, glass clearcoat reflection, and vibrant color core | `public/models/marble_sphere.glb` | < 400 |

---

## Material & Lighting Calibration
- All models must use PBR Roughness/Metalness workflow.
- Calibrated for warm daylight key light (`#fff6e5`, 1.25 intensity) and soft sky ambient (`#cfe8f7`).
- Recommended roughness: `0.15` to `0.45`; metalness: `0.10` to `0.25`.
