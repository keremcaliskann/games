# ASSETS_NEEDED.md — COLOR BLOCK JAM 3D

This project operates out-of-the-box with 100% Compound Procedural 3D Prefabs (`render/PrefabFactory.ts`).
Optional user-supplied `.glb` 3D model upgrades can be placed in `public/models/` and will be automatically hot-swapped by `PrefabFactory`.

## Optional 3D Model Specifications

### 1. Stylized Shredder Gate
- **Target File:** `public/models/shredder_gate.glb`
- **Triangle Budget:** $\le 2,500$ triangles
- **Dimensions:** Bounding box approx $2.2 \times 1.4 \times 1.2$ units
- **Pivot:** Centered at base $(0, 0, 0)$, facing $-Z$ (intake opening towards $+Z$)
- **Material Requirements:** PBR Metallic/Roughness, color tintable via vertex colors or material named `GateColorMat`.
- **Parts:** Optional separate roller meshes named `Roller_L` and `Roller_R` for custom mechanical rotation.

### 2. Hammer Booster Prop (Optional)
- **Target File:** `public/models/hammer_booster.glb`
- **Triangle Budget:** $\le 1,200$ triangles
- **Dimensions:** Approx $0.8 \times 1.2 \times 0.5$ units
- **Pivot:** At the handle base $(0, 0, 0)$.

---
*Note: To integrate newly added `.glb` models, use the `asset-integrator` skill.*
