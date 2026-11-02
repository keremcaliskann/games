# ASSETS_NEEDED.md — RALLY HORIZON 3D // TIME ATTACK & DRIFT

This game uses the **Dual-Path Hybrid 3D Asset Pipeline** (`AssetResolver` + `ProceduralMeshBuilder`). It runs out-of-the-box at 60 FPS with zero external `.glb` files using multi-part procedural rally cars, spoke wheels, and spline road ribbons, while automatically hot-swapping optional CC0 `.glb` models if placed in `public/models/`.

## Optional Hot-Swap `.glb` Models

| File Path | Target Bounding Size | Pivot Alignment | Description |
|---|---|---|---|
| `public/models/rally_car.glb` | `maxDim: 2.6` | `bottom-center` | Stylized low-poly WRC/Group-B rally car (`< 4,500 tris`) with rear wing and roof scoop. |
| `public/models/checkpoint_arch.glb` | `maxDim: 14.0` | `bottom-center` | Rally stage timing gantry / inflatable checkpoint arch (`< 1,500 tris`). |
