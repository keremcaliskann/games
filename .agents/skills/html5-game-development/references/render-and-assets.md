# Rendering & Asset Pipeline

Table of Contents: quality tiers · renderer setup · resize handling · glTF pipeline · asset manager · instanced meshes · disposal · camera rig

## Quality Tiers (`render/quality.ts`)

```ts
export interface QualityTier {
  readonly name: 'low' | 'medium' | 'high';
  readonly maxPixelRatio: number;
  readonly shadows: boolean;
  readonly antialias: boolean; // Set only at renderer creation
}

export const QUALITY_TIERS: readonly QualityTier[] = [
  { name: 'low',    maxPixelRatio: 1,   shadows: false, antialias: false },
  { name: 'medium', maxPixelRatio: 1.5, shadows: true,  antialias: false },
  { name: 'high',   maxPixelRatio: 2,   shadows: true,  antialias: true  },
];

export function pickInitialTier(): QualityTier {
  const isTouch = matchMedia('(pointer: coarse)').matches;
  return isTouch ? QUALITY_TIERS[1] : QUALITY_TIERS[2];
}
```
At runtime, only update `maxPixelRatio` and `shadows`. Changing `antialias` requires destroying and recreating the WebGL context; avoid doing so dynamically.

## Renderer Creation (`render/renderer.ts`)

```ts
import * as THREE from 'three';
import type { QualityTier } from './quality';

export function createRenderer(container: HTMLElement, tier: QualityTier): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    antialias: tier.antialias,
    powerPreference: 'high-performance',
    alpha: false,
    stencil: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier.maxPixelRatio));
  renderer.shadowMap.enabled = tier.shadows;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  container.appendChild(renderer.domElement);
  return renderer;
}

export function applyTier(renderer: THREE.WebGLRenderer, tier: QualityTier): void {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier.maxPixelRatio));
  renderer.shadowMap.enabled = tier.shadows;
}
```

## Resize Observer

```ts
export function observeResize(
  container: HTMLElement,
  renderer: THREE.WebGLRenderer,
  camera: THREE.PerspectiveCamera,
): () => void {
  const apply = (): void => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(apply);
  ro.observe(container);
  apply();
  return () => ro.disconnect();
}
```

## glTF Asset Pipeline
Export source 3D models as `.glb`, then optimize geometry and textures:

```bash
npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt
```
- Use KTX2 textures for GPU memory savings.
- Keep mobile textures at 1024–2048 maximum.
- Copy basis transcoders from `node_modules/three/examples/jsm/libs/basis/` to `public/basis/`.

## Asset Manager (`core/assets.ts`)

```ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

export class AssetManager {
  private readonly gltf: GLTFLoader;
  private readonly ktx2: KTX2Loader;
  private readonly cache = new Map<string, Promise<THREE.Group>>();

  constructor(renderer: THREE.WebGLRenderer) {
    this.ktx2 = new KTX2Loader()
      .setTranscoderPath(`${import.meta.env.BASE_URL}basis/`)
      .detectSupport(renderer);
    this.gltf = new GLTFLoader()
      .setKTX2Loader(this.ktx2)
      .setMeshoptDecoder(MeshoptDecoder);
  }

  loadModel(path: string): Promise<THREE.Group> {
    let p = this.cache.get(path);
    if (!p) {
      p = this.gltf.loadAsync(`${import.meta.env.BASE_URL}${path}`).then((g) => g.scene);
      this.cache.set(path, p);
    }
    return p;
  }

  dispose(): void {
    this.ktx2.dispose();
    this.cache.clear();
  }
}
```
Never insert cached scene roots directly into your Three.js scene; always instantiate using `.clone(true)` (or `SkeletonUtils.clone` for skinned animated meshes).

## Instanced Meshes

```ts
const MAX_INSTANCES = 512;
const mesh = new THREE.InstancedMesh(geometry, material, MAX_INSTANCES);
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
mesh.count = 0;
mesh.frustumCulled = false;

const _m = new THREE.Matrix4();
function setInstance(index: number, pos: THREE.Vector3, rot: THREE.Quaternion, scale: THREE.Vector3): void {
  _m.compose(pos, rot, scale);
  mesh.setMatrixAt(index, _m);
}

// Mark for GPU update once per frame:
mesh.instanceMatrix.needsUpdate = true;
```

## GPU Resource Disposal (`render/dispose.ts`)

```ts
import * as THREE from 'three';

export function disposeObject(root: THREE.Object3D): void {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const m of mats) {
      for (const v of Object.values(m)) {
        if (v instanceof THREE.Texture) v.dispose();
      }
      m.dispose();
    }
  });
}
```

## Third-Person Camera Follow
- Smooth following: `camera.position.lerp(desired, 1 - Math.exp(-k * dt))` (framerate-independent damping).
- Obstacle avoidance: cast a ray from character target to desired camera position; pull the camera inward if an obstruction is detected.
