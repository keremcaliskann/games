# ASSETS_NEEDED.md — OFFROAD EXPEDITION 3D // 4X4 ROCK CRAWLER

This game uses the **Dual-Path Hybrid 3D Asset Pipeline** (`AssetResolver` + `ProceduralMeshBuilder`). It runs at 60 FPS out-of-the-box with zero external `.glb` files using compound procedural 4x4 crawler trucks, articulated knobby wheels, roof racks, and 3D winch cables, while automatically hot-swapping optional CC0 `.glb` models if placed in `public/models/`.

## Optional Hot-Swap `.glb` Models

| File Path | Target Bounding Size | Pivot Alignment | Description |
|---|---|---|---|
| `public/models/crawler_truck.glb` | `maxDim: 2.8` | `bottom-center` | Stylized low-poly 4x4 offroad rock crawler truck (`< 4,500 tris`) with roof rack and snorkel. |
| `public/models/base_camp_arch.glb` | `maxDim: 14.0` | `bottom-center` | Expedition Base Camp timber archway (`< 1,800 tris`). |
