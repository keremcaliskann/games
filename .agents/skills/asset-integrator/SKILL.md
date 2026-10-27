---
name: asset-integrator
description: Integrates user-supplied 3D models (.glb/.gltf), textures, or icons into an existing game's Hot-Swap PrefabFactory, calibrating scale, pivot, daylight materials, shadows, and physics colliders.
metadata:
  icon: view_in_ar
---

# 3D Asset & Model Integrator (`asset-integrator`)

Use this skill when the user provides external `.glb` / `.gltf` 3D models, textures, or custom assets (as specified in a game's `ASSETS_NEEDED.md`) or asks to replace/upgrade a game's procedural 3D prefabs.

---

## 1. Architectural Contract (Zero-Breakage Hot-Swap)

Every game in the workspace is built with a **3-Tier Asset Pipeline**:
1. **Compound Procedural Prefab (Default):** Guaranteed 100% playable out-of-the-box with zero external dependencies.
2. **`ASSETS_NEEDED.md` (Specification Card):** Documents exact paths (`public/models/<entity>.glb`), target dimensions, orientation (`Y-up, +Z forward`), and triangle budgets (`< 3,000 tris`).
3. **Hot-Swap `.glb` Integration (`src/render/PrefabFactory.ts`):** When a `.glb` file is placed in `public/models/`, `PrefabFactory` loads, normalizes, and caches the model while retaining the procedural prefab as an instant fallback.

---

## 2. Step-by-Step Integration Workflow

### Step 1: Inspect `ASSETS_NEEDED.md` & Incoming Files
1. Check `<game-name>/public/models/` and `<game-name>/ASSETS_NEEDED.md`.
2. Verify file size (optimized to protect the `< 50 MB` total bundle budget).

### Step 2: Normalize Bounding Box, Scale & Pivot
External `.glb` models often arrive with arbitrary scales or off-center pivots. Inside `PrefabFactory.ts`:
1. Compute the model's `THREE.Box3().setFromObject(gltfScene)`.
2. Center the geometry horizontally/vertically according to the entity's expected anchor (e.g., center-of-mass for floating puzzle pieces, bottom-center `min.y = 0` for vehicles/characters).
3. Normalize scale uniformly so the model matches the exact target unit dimensions used by gameplay/physics logic.

### Step 3: Daylight Material & Shadow Calibration (`30-three-render`)
1. Traverse all `THREE.Mesh` children in the loaded `.glb`.
2. Enable `mesh.castShadow = true` and `mesh.receiveShadow = true`.
3. Ensure materials respond vibrantly to the game's `HemisphereLight` + `DirectionalLight` setup (adjust `roughness`, `metalness`, or apply game palette tinting when color-coded gameplay requires it).

### Step 4: Physics & Raycast Collider Alignment
1. Keep Rapier.js / raycast hitboxes bound to clean primitive colliders (`Cuboid`, `Ball`, `Capsule`, or compound primitives) matching the normalized bounding box rather than expensive triangle meshes (`trimesh`), preserving 60 FPS mobile performance.
2. Verify raycasting (`input/`) hits the newly integrated `.glb` hierarchy (`intersectObjects(targets, true)` with recursive `true`).

### Step 5: Verify & Deploy
1. Run `npm run typecheck` and `npm run build`.
2. Update `ASSETS_NEEDED.md` marking the integrated asset as `[x] Integrated`.
3. Commit with `feat(<game-name>): integrate custom 3D glb assets` and push to `origin/main`.
