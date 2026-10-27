# ASSETS_NEEDED.md — bus-escape-jam-3d

This game runs out-of-the-box with **100% lightweight procedural Compound 3D Prefabs** (`src/render/PrefabFactory.ts`), guaranteeing instant startup, zero external network requests (CSP clean), and a bundle well under 50 MB.

## Optional External 3D Models (`.glb`)
To upgrade visual fidelity, drop `.glb` files into `public/models/`:

| Asset File | Target Node / Prefab | Recommended Specs |
| :--- | :--- | :--- |
| `public/models/bus_4slot.glb` | 4-Seat Bus Chassis | Low-poly (< 5,000 tris), centered pivot, bottom min Y = 0 |
| `public/models/bus_6slot.glb` | 6-Seat Van / Coach | Low-poly (< 7,500 tris), centered pivot, bottom min Y = 0 |
| `public/models/passenger.glb` | Conga Passenger Pawn | Low-poly (< 1,500 tris), stylized vinyl finish |

The `PrefabFactory` will automatically hot-swap procedural geometry when external `.glb` models are detected.
