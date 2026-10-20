# Assets Needed & Hot-Swap 3D Model Spec (`cyber-arrow-3d`)

This project uses **Tier-1 Compound Procedural Prefabs** and is 100% playable out-of-the-box with zero external downloads.
If you wish to enhance the visual fidelity with custom 3D models (`.glb`), you can drop the following assets into `public/models/`:

---

## 1. Optional 3D Model Overrides

| Target File Path | Description | Recommended Specs | Status |
|---|---|---|---|
| `public/models/arrow_block.glb` | Stylized sci-fi directional block with embossed neon chevron | Triangle count < 1,500 tris, dimensions 1.0 × 1.0 × 1.0 units, centered pivot, Y-up, +Z forward | `[ ] Ready for Drop-in` |
| `public/models/obstacle_core.glb` | Holographic obstacle anchor block | Triangle count < 1,000 tris, dimensions 1.0 × 1.0 × 1.0 units, centered pivot | `[ ] Ready for Drop-in` |

---

## 2. Integration
Once you place any `.glb` file into `public/models/`, invoke the `asset-integrator` skill or mention:
> *"Modelleri attım, entegre et"*
The integrator will calibrate scale, pivots, `HemisphereLight` / `DirectionalLight` materials, shadows, and colliders automatically.
