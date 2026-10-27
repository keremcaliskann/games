---
name: visual-polish-3d
description: Applies zero-external-asset 60 FPS Three.js visual polish across HTML5 3D games using procedural studio IBL (PMREMGenerator + RoomEnvironment), beveled RoundedBoxGeometry, Fresnel rim-light shader injection, contact shadow decals, horizon gradient sky domes, and procedural micro-textures.
---

# 3D Visual Polish & Zero-Asset Shader Enhancement (`visual-polish-3d`)

This skill defines the standard 60 FPS visual upgrade pipeline for Three.js WebGL games under the `< 50 MB` bundle and zero external network call constraints (`32-daylight-and-lighting.md` & `30-three-render.md`).

---

## 1. Core Architectural Module (`shared/render/visual-enhancer.ts`)

All games in the monorepo receive `src/render/visual-enhancer.ts` (synchronized from `shared/render/visual-enhancer.ts` via `scripts/sync-shared-core.mjs`).

### The 5 Zero-Cost Visual Upgrade Pillars

1. **Procedural Studio IBL Reflections (`PMREMGenerator` + `RoomEnvironment`):**
   - Uses `RoomEnvironment` (`three/addons/environments/RoomEnvironment.js`) with `THREE.PMREMGenerator` or a procedural 2D equirectangular studio reflection `DataTexture` / `CanvasTexture` so `scene.environment` is populated at startup in `< 4 ms` with `0 KB` external `.hdr` downloads.
   - Automatically hooked via `VisualEnhancer.enhanceScene(scene)` inside `src/render/lighting.ts`, utilizing `scene.onBeforeRender` on frame 1 to bind the active `WebGLRenderer`, set `ACESFilmicToneMapping` (`toneMappingExposure = 1.0`), bake the PMREM studio environment map once, and self-detach.

2. **Beveled Toy / Vinyl Geometry (`RoundedBoxGeometry`):**
   - Sharp 90-degree `THREE.BoxGeometry` edges never catch specular highlights along their borders.
   - Use `VisualEnhancer.createBeveledBox(width, height, depth, radius, segments)` (wrapping `RoundedBoxGeometry` from `three/addons/geometries/RoundedBoxGeometry.js`) on hero characters, puzzle blocks, vehicles, and interactive props so edges catch warm golden sun specular highlights.

3. **Fresnel Rim-Light Shader Injection (`onBeforeCompile`):**
   - Injects a zero-draw-call view-space silhouette highlight (`pow(1.0 - saturate(dot(normal, viewDir)), 2.6)`) into `THREE.MeshStandardMaterial` via `VisualEnhancer.applyRimLight(material, rimColorHex, rimStrength)`.
   - Makes characters, blocks, and collectibles pop against the pastel daylight background without post-processing (`EffectComposer`) fill-rate overhead.

4. **Procedural Soft Contact Shadows (`createContactShadow`):**
   - Bakes a cached 128×128 radial soft-falloff `CanvasTexture` decal (`VisualEnhancer.createContactShadow(radius, opacity)`).
   - Grounds characters, ragdolls, marbles, and vehicles onto the board even when directional shadow map texels are coarse.

5. **Horizon Gradient Sky Dome & Procedural Micro-Textures (`createMicroTexture`):**
   - Replaces flat single-color backgrounds with a subtle zenith-to-horizon daylight sky dome (`0xb8dff5` -> `0xcfe8f7` -> `0xfcf8ee`) and provides cached 256×256 procedural surface textures (`wood`, `stone`, `grid`, `vinyl`) for tactile board surfaces.

---

## 2. Usage in Games

### Automatic Scene & Renderer Enhancement (`src/render/lighting.ts`)
Every game's lighting constructor (`LightingSetup`, `DaylightLighting`, or `setupCyberLighting`) calls:
```ts
import { VisualEnhancer } from './visual-enhancer';
// Inside constructor(scene: THREE.Scene):
VisualEnhancer.enhanceScene(scene);
```

### Prefab Material & Geometry Upgrade (`src/render/prefabs.ts`)
When constructing hero meshes or puzzle blocks:
```ts
import { VisualEnhancer } from './visual-enhancer';

const blockGeo = VisualEnhancer.createBeveledBox(1.0, 1.0, 1.0, 0.12, 3);
const blockMat = new THREE.MeshStandardMaterial({
  color: 0x3b82f6,
  roughness: 0.42,
  metalness: 0.08,
});
VisualEnhancer.applyRimLight(blockMat, 0xfff8eb, 0.28);
```

---

## 3. Synchronization & Verification

1. Run `node scripts/sync-shared-core.mjs` to propagate `shared/render/visual-enhancer.ts` and hook `VisualEnhancer.enhanceScene(scene)` into `src/render/lighting.ts` across all games in `games.json`.
2. Verify TypeScript compilation and bundle budgets (`< 50 MB`) across all games.
