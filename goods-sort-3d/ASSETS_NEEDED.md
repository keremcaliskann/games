# 3D Asset Hot-Swap Specification — GOODS SORT 3D

This game runs out-of-the-box with **100% procedural compound 3D prefabs** constructed in `src/render/PrefabFactory.ts`.
Optionally, glTF / GLB assets may be placed into `public/models/` to upgrade visual models. If present, the engine automatically swaps them in; otherwise, procedural fallbacks are used.

---

## Procedural Fallback vs. Optional GLB Upgrade

| Prefab Name | Procedural Fallback Composition | Optional GLB Path | Max Triangles |
| :--- | :--- | :--- | :---: |
| **Stylized Wooden Cabinet** | Multi-tiered wooden shelf unit with side panels, shelves, backboard, and support ribs | `public/models/cabinet.glb` | < 1,500 |
| **Soda Can (Cola / Lemon / Berry)** | LatheGeometry aluminum can with curved rim, colored label, pull-tab indentation | `public/models/soda_can.glb` | < 600 |
| **Snack Box (Cookies / Chips / Cereal)** | Beveled rectangular prism with colorful front face decals and glossy coat | `public/models/snack_box.glb` | < 400 |
| **Jam Jar (Strawberry / Honey)** | Rounded cylinder glass jar with checkered fabric cloth lid and ribbon band | `public/models/jam_jar.glb` | < 600 |
| **Milk Carton** | Gable-top prism carton with pouring spout and pastoral label | `public/models/milk_carton.glb` | < 500 |

---

## Material & Lighting Calibration
- All models must use PBR Roughness/Metalness workflow.
- Calibrated for warm daylight key light (`#fff6e5`, 1.25 intensity) and soft sky ambient (`#cfe8f7`).
- Recommended roughness: `0.35` to `0.45`; metalness: `0.05` to `0.15`.
