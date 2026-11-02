/**
 * Shared 3D Visual Enhancer (Single Source of Truth across all 13+ Arcade 3D games).
 * Implements 5 zero-external-asset 60 FPS Three.js visual polish techniques:
 * 1. Procedural Studio IBL Reflections via THREE.PMREMGenerator + RoomEnvironment.
 * 2. Beveled Toy / Vinyl Geometry via RoundedBoxGeometry.
 * 3. Fresnel Rim-Light Shader Injection via MeshStandardMaterial.onBeforeCompile.
 * 4. Procedural Soft Contact Shadow Decals (cached radial gradient CanvasTexture).
 * 5. Horizon Gradient Sky Dome & Procedural Micro-Textures (wood, stone, grid, vinyl).
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export type MicroTextureKind = 'wood' | 'stone' | 'grid' | 'vinyl';

export class VisualEnhancer {
  private static contactShadowTexture: THREE.CanvasTexture | null = null;
  private static skyGradientTexture: THREE.CanvasTexture | null = null;
  private static readonly microTextureCache = new Map<MicroTextureKind, THREE.CanvasTexture>();
  private static readonly enhancedScenes = new WeakSet<THREE.Scene>();
  private static cachedEnvMap: THREE.Texture | null = null;
  private static cachedRendererRef: THREE.WebGLRenderer | null = null;

  /**
   * Automatically upgrades a THREE.Scene with:
   * - Procedural Studio IBL environment map (baked once on first render frame via PMREMGenerator + RoomEnvironment)
   * - Balanced ACESFilmicToneMapping (exposure 1.0) + PCFSoftShadowMap on the active WebGLRenderer
   * - Subtle Fresnel rim-light & studio reflection tuning on existing and newly added Standard/Physical meshes
   */
  public static enhanceScene(scene: THREE.Scene): void {
    if (this.enhancedScenes.has(scene)) return;
    this.enhancedScenes.add(scene);

    // Ensure soft pastel daylight background if none set
    if (!scene.background) {
      scene.background = new THREE.Color(0xcfe8f7);
    }

    const prevOnBeforeRender = scene.onBeforeRender as ((...args: any[]) => void) | undefined;
    let iblBaked = false;

    scene.onBeforeRender = function (
      renderer: THREE.WebGLRenderer,
      s: THREE.Scene,
      camera: THREE.Camera,
      ...rest: any[]
    ) {
      if (prevOnBeforeRender) {
        prevOnBeforeRender.call(this, renderer, s, camera, ...rest);
      }
      if (!iblBaked && renderer) {
        iblBaked = true;
        VisualEnhancer.enhanceRendererAndIBL(renderer, s);
        VisualEnhancer.upgradeSceneMaterials(s);
      }
    };
  }

  /**
   * Configures renderer tone mapping and bakes a 0 KB procedural studio IBL environment map.
   */
  public static enhanceRendererAndIBL(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void {
    try {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      if (renderer.toneMappingExposure > 1.08 || renderer.toneMappingExposure < 0.85) {
        renderer.toneMappingExposure = 1.0;
      }
      if (renderer.shadowMap) {
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }

      if (!scene.environment) {
        if (this.cachedRendererRef !== renderer || !this.cachedEnvMap) {
          const pmremGenerator = new THREE.PMREMGenerator(renderer);
          pmremGenerator.compileEquirectangularShader();
          const roomEnv = new RoomEnvironment();
          const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
          this.cachedEnvMap = envRT.texture;
          this.cachedRendererRef = renderer;
          roomEnv.dispose();
          pmremGenerator.dispose();
        }
        scene.environment = this.cachedEnvMap;
      }
    } catch {
      // Graceful fallback if WebGL context is mocked or constrained
    }
  }

  /**
   * Traverses a scene or prefab group and upgrades Standard/Physical materials with
   * crisp IBL environment reflections and subtle cartoon Fresnel rim-lighting.
   */
  public static upgradeSceneMaterials(root: THREE.Object3D): void {
    root.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (!mesh.isMesh || !mesh.material) return;

      // Skip large ground/sea planes for rim-lighting so horizon stays clean
      const isLargeGround =
        mesh.rotation.x < -1.2 &&
        mesh.geometry?.boundingSphere &&
        mesh.geometry.boundingSphere.radius > 18;

      if (Array.isArray(mesh.material)) {
        for (let i = 0; i < mesh.material.length; i++) {
          this.tuneMaterial(mesh.material[i], !isLargeGround);
        }
      } else {
        this.tuneMaterial(mesh.material, !isLargeGround);
      }
    });
  }

  private static tuneMaterial(mat: THREE.Material, addRim: boolean): void {
    const std = mat as THREE.MeshStandardMaterial;
    if (!std || !std.isMeshStandardMaterial) return;

    // Enhance studio reflection presence without blowing out highlights
    if (std.envMapIntensity === undefined || std.envMapIntensity === 1) {
      std.envMapIntensity = 0.65;
    }

    if (addRim && !std.transparent) {
      this.applyRimLight(std, 0xfff8eb, 0.22);
    }
  }

  /**
   * Injects a zero-draw-call view-space Fresnel silhouette rim-light into a MeshStandardMaterial.
   */
  public static applyRimLight(
    material: THREE.MeshStandardMaterial,
    rimColorHex = 0xfff8eb,
    rimStrength = 0.26
  ): THREE.MeshStandardMaterial {
    if (material.userData?.hasVisualEnhancerRim) return material;
    material.userData = material.userData || {};
    material.userData.hasVisualEnhancerRim = true;

    const rimColor = new THREE.Color(rimColorHex);
    const prevCallback = material.onBeforeCompile;

    material.onBeforeCompile = (shader, renderer) => {
      if (prevCallback) prevCallback(shader, renderer);
      shader.uniforms.uRimColor = { value: rimColor };
      shader.uniforms.uRimStrength = { value: rimStrength };

      shader.fragmentShader =
        `uniform vec3 uRimColor;\nuniform float uRimStrength;\n` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        vec3 veViewDir = normalize(vViewPosition);
        float veRim = 1.0 - max(dot(normalize(normal), veViewDir), 0.0);
        veRim = pow(veRim, 2.75) * uRimStrength;
        gl_FragColor.rgb += uRimColor * veRim;`
      );
    };
    material.customProgramCacheKey = () => `ve-rim-${rimColorHex}-${rimStrength.toFixed(2)}`;
    return material;
  }

  /**
   * Creates a beveled toy/vinyl RoundedBoxGeometry that catches specular sun highlights along edges.
   */
  public static createBeveledBox(
    width = 1,
    height = 1,
    depth = 1,
    radius = 0.08,
    segments = 3
  ): THREE.BufferGeometry {
    return new RoundedBoxGeometry(width, height, depth, segments, radius);
  }

  /**
   * Creates a lightweight grounding contact shadow decal mesh using a cached radial gradient CanvasTexture.
   */
  public static createContactShadow(radius = 0.8, opacity = 0.35): THREE.Mesh {
    if (!this.contactShadowTexture && typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 60);
        grad.addColorStop(0, 'rgba(15, 23, 42, 0.55)');
        grad.addColorStop(0.55, 'rgba(15, 23, 42, 0.22)');
        grad.addColorStop(1, 'rgba(15, 23, 42, 0.0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      this.contactShadowTexture = new THREE.CanvasTexture(canvas);
      this.contactShadowTexture.needsUpdate = true;
    }

    const geo = new THREE.PlaneGeometry(radius * 2, radius * 2);
    const mat = new THREE.MeshBasicMaterial({
      map: this.contactShadowTexture,
      transparent: true,
      opacity,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.015;
    return mesh;
  }

  /**
   * Creates a soft pastel zenith-to-horizon sky dome mesh.
   */
  public static createSkyDome(radius = 120): THREE.Mesh {
    if (!this.skyGradientTexture && typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, 256);
        grad.addColorStop(0.0, '#a5d8f3');
        grad.addColorStop(0.48, '#cfe8f7');
        grad.addColorStop(0.85, '#f4f9fc');
        grad.addColorStop(1.0, '#fcf8ee');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 256);
      }
      this.skyGradientTexture = new THREE.CanvasTexture(canvas);
      this.skyGradientTexture.colorSpace = THREE.SRGBColorSpace;
      this.skyGradientTexture.needsUpdate = true;
    }

    const geo = new THREE.SphereGeometry(radius, 24, 16);
    const mat = new THREE.MeshBasicMaterial({
      map: this.skyGradientTexture,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
    });
    return new THREE.Mesh(geo, mat);
  }

  /**
   * Generates a cached 256x256 procedural micro-texture ('wood' | 'stone' | 'grid' | 'vinyl')
   * for tactile board surfaces and props with zero external image downloads.
   */
  public static createMicroTexture(kind: MicroTextureKind): THREE.CanvasTexture | null {
    if (this.microTextureCache.has(kind)) {
      return this.microTextureCache.get(kind)!;
    }
    if (typeof document === 'undefined') return null;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      if (kind === 'wood') {
        ctx.fillStyle = '#f5ebe0';
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = 'rgba(180, 140, 100, 0.14)';
        ctx.lineWidth = 2;
        for (let y = 0; y < 256; y += 6) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.bezierCurveTo(85, y + ((y % 12) - 6), 170, y - ((y % 10) - 5), 256, y);
          ctx.stroke();
        }
      } else if (kind === 'stone') {
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 420; i++) {
          const x = (i * 73) % 256;
          const y = (i * 137) % 256;
          ctx.fillStyle = i % 2 === 0 ? 'rgba(148, 163, 184, 0.12)' : 'rgba(255, 255, 255, 0.25)';
          ctx.fillRect(x, y, 3, 3);
        }
      } else if (kind === 'grid') {
        ctx.fillStyle = '#fcf8ee';
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
        ctx.lineWidth = 2;
        for (let p = 0; p <= 256; p += 32) {
          ctx.beginPath();
          ctx.moveTo(p, 0);
          ctx.lineTo(p, 256);
          ctx.moveTo(0, p);
          ctx.lineTo(256, p);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);
        const grad = ctx.createLinearGradient(0, 0, 256, 256);
        grad.addColorStop(0, 'rgba(255,255,255,0.12)');
        grad.addColorStop(1, 'rgba(226,232,240,0.12)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    this.microTextureCache.set(kind, tex);
    return tex;
  }
}
