---
trigger: glob
globs: "**/src/render/**/*.ts, **/src/**/*.glsl, **/src/**/*.vert, **/src/**/*.frag"
description: "Three.js renderer, scenes, materials, lighting, shadows, asset loading, and GPU resource disposal."
---

# Three.js Rendering Rules

## Renderer Configuration
- Use `WebGLRenderer` by default. WebGPU is only adopted when explicitly requested due to mobile WebView compatibility.
- Renderer initialization options: `powerPreference: 'high-performance'`, `alpha: false`, `stencil: false`. On mobile, default to `antialias: false`.
- Set pixel ratio: `setPixelRatio(Math.min(devicePixelRatio, tier.maxPixelRatio))`.
- Single `requestAnimationFrame` loop lives in `core/game-loop.ts`. The render module exposes `render(alpha)` and does not establish its own loop.
- Resizing: Use `ResizeObserver` on the canvas container + `renderer.setSize(w, h, false)` + update `camera.aspect` and `camera.updateProjectionMatrix()`. Avoid listening to `window.resize` directly due to mobile browser URL bar toggles.

## Scene Graph & Meshes
- Maintain a flat scene hierarchy; deep object trees multiply matrix transformations every frame.
- Static objects: set `mesh.matrixAutoUpdate = false` and invoke `mesh.updateMatrix()` once.
- Identical geometries and materials: use `InstancedMesh`. Compute bounding spheres (`computeBoundingSphere()`) or disable frustum culling (`frustumCulled = false`) if instances span a wide area.
- Group static environmental props using geometry merging or `BatchedMesh`.
- For pooled entities, set `visible = false` when inactive rather than repeatedly adding and removing them from the scene.

## Materials & Lighting
- Share material instances across objects; avoid calling `material.clone()`.
- Mobile defaults: Prefer `MeshLambertMaterial` or `MeshBasicMaterial` paired with baked lighting/ambient occlusion. Use `MeshStandardMaterial` or custom `ShaderMaterial` only when justified.
- Lighting: 1 directional sun light + hemisphere/ambient fill. Avoid multiple dynamic point lights.
- Shadows: 1 directional light with shadow map size 1024–2048. Fit `shadow.camera` frustum tightly to the playable volume. In static environments, set `renderer.shadowMap.autoUpdate = false` and trigger updates on demand via `needsUpdate = true`. Use `PCFShadowMap`.

## Color Management
- Color textures (diffuse/albedo, emissive): set `texture.colorSpace = THREE.SRGBColorSpace`.
- Non-color data maps (normal, roughness, metalness, AO, height): keep linear (do not assign sRGB).
- Leave `renderer.outputColorSpace` at default sRGB.

## Asset Pipeline
- Primary format: glTF 2.0 (`.glb`) compressed with Meshopt (`MeshoptDecoder`) and KTX2 textures (`KTX2Loader`).
- Import Three.js addons from `three/addons/...` (e.g., `three/addons/loaders/GLTFLoader.js`).
- Host decoders/transcoders in `public/` and resolve paths via `import.meta.env.BASE_URL` (essential for Capacitor relative paths).
- Manage loaders inside a centralized `AssetManager`. Do not instantiate new loaders per asset load.
- Resource ownership: The module that loaded or instantiated a resource is responsible for calling its `dispose()`.

## GPU Resource Disposal
- Always call `.dispose()` on geometries, materials, textures, and render targets. The JavaScript garbage collector does not free GPU memory.
- Verify memory cleanup: after 5 level/scene reloads, `renderer.info.memory` counters must return to baseline.

## WebGL Context Loss
- Handle `webglcontextlost`: invoke `event.preventDefault()` and pause the game loop.
- Handle `webglcontextrestored`: rebuild GPU resources or gracefully navigate back to the main menu (common when returning from background on mobile).

## Physics Synchronization
- The rendering layer strictly **reads** physics states; it never writes kinematic targets directly.
- Interpolate between previous and current physics ticks using the fractional `alpha` parameter provided by the game loop.

## Debugging
- Debug helpers (`AxesHelper`, `Box3Helper`, wireframe collision meshes, stat monitors) must only be created when `import.meta.env.DEV` is true or `?debug=1` is present in the URL.
