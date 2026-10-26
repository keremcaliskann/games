# 3D Asset Hot-Swap Specification — CANNON BLITZ 3D

This game runs out-of-the-box with **100% procedural compound 3D prefabs** constructed in `src/render/PrefabFactory.ts`.
Optionally, glTF / GLB assets may be placed into `public/models/` to upgrade visual models. If present, the engine automatically swaps them in; otherwise, procedural fallbacks are used.

---

## Procedural Fallback vs. Optional GLB Upgrade

| Prefab Name | Procedural Fallback Composition | Optional GLB Path | Max Triangles |
| :--- | :--- | :--- | :---: |
| **Stylized Cannon** | Chamfered brass carriage, dark iron barrel cylinder, rear spherical knob, dual axle hubs | `public/models/cannon.glb` | < 1,500 |
| **Explosive Barrel** | Red cylindrical drum with hazard black/yellow warning band and metal top rim | `public/models/tnt_barrel.glb` | < 800 |
| **Ragdoll Target Dummy** | Wooden mannequin with rounded head, torso cylinder, articulated limb capsules, target face decal | `public/models/target_dummy.glb` | < 1,200 |
| **Tropical Fortress Island**| Beveled cylinder bedrock, sand shore ring, stylized grass cap, underwater reef shelf | `public/models/island.glb` | < 2,000 |

---

## Material & Lighting Calibration
- All models must use PBR Roughness/Metalness workflow.
- Calibrated for warm daylight key light (`#fff6e5`, 1.25 intensity) and soft sky ambient (`#cfe8f7`).
- Recommended roughness: `0.45` to `0.55`; metalness: `0.05` to `0.20`.
