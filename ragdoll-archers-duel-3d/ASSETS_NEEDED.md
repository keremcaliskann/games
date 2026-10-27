# Optional 3D `.glb` Asset Hot-Swap Guide (`ragdoll-archers-duel-3d`)

`ragdoll-archers-duel-3d` ships with multi-part **Compound Procedural 3D Prefabs** in [`src/render/PrefabFactory.ts`](file:///c:/Users/kerem/Desktop/Games/ragdoll-archers-duel-3d/src/render/PrefabFactory.ts) and requires zero external 3D files to run at 60 FPS under the `< 50 MB` bundle budget.

To hot-swap any procedural prefab with a custom Blender/Blockbench `.glb` model, drop the file into `public/models/` using the paths below:

| Entity | Target Path | Recommended Polycount | Pivot / Orientation |
|---|---|---|---|
| **Archer Character** | `public/models/archer_stickman.glb` | `< 1,800 tris` | Bottom-center feet at `(0,0,0)`, facing `+X` |
| **Composite Bow** | `public/models/composite_bow.glb` | `< 600 tris` | Grip center at `(0,0,0)`, aiming `+X` |
| **Arrow Projectile** | `public/models/arrow_projectile.glb` | `< 350 tris` | Center of mass at `(0,0,0)`, tip at `+X` |
| **Stone Duel Bastion** | `public/models/duel_bastion.glb` | `< 1,200 tris` | Top platform surface at `y = 0` |
| **Flying Apple Target** | `public/models/flying_apple.glb` | `< 400 tris` | Center at `(0,0,0)` |
