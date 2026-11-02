import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { VisualEnhancer } from './visual-enhancer';

export interface ModelResolveOptions {
  modelUrl: string;
  targetSize?: { x?: number; y?: number; z?: number; maxDim?: number };
  pivotAlignment?: 'bottom-center' | 'center';
  proceduralFallback: () => THREE.Group;
  tintColorHex?: number;
  contactShadowRadius?: number;
  onLoaded?: (loadedGroup: THREE.Group) => void;
}

export class AssetResolver {
  private static loader: GLTFLoader | null = null;
  private static readonly modelCache = new Map<string, THREE.Group>();
  private static readonly pendingPromises = new Map<string, Promise<THREE.Group | null>>();

  private static getLoader(): GLTFLoader {
    if (!this.loader) {
      this.loader = new GLTFLoader();
    }
    return this.loader;
  }

  /**
   * Synchronously creates a placeholder container with the procedural fallback,
   * while asynchronously resolving and hot-swapping the CC0 .glb model if present.
   */
  public static resolveHybridModel(options: ModelResolveOptions): THREE.Group {
    const container = new THREE.Group();
    const fallback = options.proceduralFallback();
    container.add(fallback);

    // Attach procedural contact shadow decal underneath if requested
    if (options.contactShadowRadius) {
      const shadow = VisualEnhancer.createContactShadow(options.contactShadowRadius, 0.58);
      shadow.position.y = 0.02;
      container.add(shadow);
    }

    // Check if model was already cached and normalized
    const cached = this.modelCache.get(options.modelUrl);
    if (cached) {
      const instance = SkeletonUtils.clone(cached) as THREE.Group;
      if (options.tintColorHex !== undefined) {
        this.applyTint(instance, options.tintColorHex);
      }
      container.remove(fallback);
      container.add(instance);
      options.onLoaded?.(instance);
      return container;
    }

    // Asynchronously fetch .glb without blocking frame 1 game loop
    this.fetchAndNormalizeModel(options.modelUrl, options)
      .then((normalizedModel) => {
        if (normalizedModel) {
          const instance = SkeletonUtils.clone(normalizedModel) as THREE.Group;
          if (options.tintColorHex !== undefined) {
            this.applyTint(instance, options.tintColorHex);
          }
          container.remove(fallback);
          container.add(instance);
          options.onLoaded?.(instance);
        }
      })
      .catch(() => {
        // Fallback remains active seamlessly
      });

    return container;
  }

  /**
   * Asynchronously loads and normalizes a .glb model.
   */
  public static async fetchAndNormalizeModel(
    url: string,
    options: ModelResolveOptions
  ): Promise<THREE.Group | null> {
    if (this.modelCache.has(url)) {
      return this.modelCache.get(url)!;
    }

    if (this.pendingPromises.has(url)) {
      return this.pendingPromises.get(url)!;
    }

    const promise = new Promise<THREE.Group | null>((resolve) => {
      const loader = this.getLoader();
      loader.load(
        url,
        (gltf) => {
          const scene = gltf.scene || gltf.scenes[0];
          if (!scene) {
            resolve(null);
            return;
          }

          const group = new THREE.Group();
          group.add(scene);

          // 1. Calibrate Shadows & Materials for Stylized Daylight
          scene.traverse((child) => {
            const mesh = child as THREE.Mesh;
            if (mesh.isMesh) {
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              if (mesh.material) {
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                for (const mat of materials) {
                  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
                    mat.roughness = THREE.MathUtils.clamp(mat.roughness ?? 0.45, 0.35, 0.65);
                    mat.metalness = THREE.MathUtils.clamp(mat.metalness ?? 0.15, 0.05, 0.85);
                    VisualEnhancer.applyRimLight(mat, 0xfff6e5, 0.22);
                  }
                }
              }
            }
          });

          // 2. Compute Bounding Box & Normalize Scale / Pivot
          const box = new THREE.Box3().setFromObject(group);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);

          // Scale normalization
          if (options.targetSize) {
            let scaleMult = 1.0;
            if (options.targetSize.maxDim) {
              const maxCurrent = Math.max(size.x, size.y, size.z) || 1;
              scaleMult = options.targetSize.maxDim / maxCurrent;
            } else if (options.targetSize.y) {
              scaleMult = options.targetSize.y / (size.y || 1);
            } else if (options.targetSize.z) {
              scaleMult = options.targetSize.z / (size.z || 1);
            } else if (options.targetSize.x) {
              scaleMult = options.targetSize.x / (size.x || 1);
            }
            scene.scale.setScalar(scaleMult);
            box.setFromObject(group);
            box.getSize(size);
            box.getCenter(center);
          }

          // Pivot alignment (default: bottom-center where min.y = 0)
          if (options.pivotAlignment !== 'center') {
            scene.position.x -= center.x;
            scene.position.y -= box.min.y;
            scene.position.z -= center.z;
          } else {
            scene.position.x -= center.x;
            scene.position.y -= center.y;
            scene.position.z -= center.z;
          }

          this.modelCache.set(url, group);
          resolve(group);
        },
        undefined,
        () => {
          // File not found or failed to parse -> graceful procedural fallback
          resolve(null);
        }
      );
    });

    this.pendingPromises.set(url, promise);
    return promise;
  }

  private static applyTint(root: THREE.Object3D, tintHex: number): void {
    root.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        // Tint the primary/largest mesh
        const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial;
        if (mat && mat.color && !mesh.name.toLowerCase().includes('glass') && !mesh.name.toLowerCase().includes('wheel')) {
          mat.color.setHex(tintHex);
        }
      }
    });
  }
}
