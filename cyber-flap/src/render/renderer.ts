import * as THREE from 'three';
import { logger } from '../core/logger';
import { detectInitialTierIndex, type QualityTier } from './quality';

export interface RendererCallbacks {
  onResize(width: number, height: number): void;
  onContextLost(): void;
  onContextRestored(): void;
}

export class RenderEngine {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  private readonly resizeObserver: ResizeObserver;
  private readonly onWebGLContextLost: (e: Event) => void;
  private readonly onWebGLContextRestored: () => void;

  constructor(
    private readonly container: HTMLElement,
    initialTier: QualityTier,
    callbacks: RendererCallbacks,
  ) {
    const isDesktop = detectInitialTierIndex() === 0;
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      alpha: false,
      stencil: false,
      antialias: isDesktop && initialTier.antialias,
    });

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.applyQualityTier(initialTier);
    this.renderer.setSize(container.clientWidth, container.clientHeight, false);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcfe8f7);
    this.scene.fog = new THREE.FogExp2(0xcfe8f7, 0.012);

    this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (let i = 0; i < entries.length; i++) {
        const rect = entries[i].contentRect;
        if (rect.width > 0 && rect.height > 0) {
          this.renderer.setSize(rect.width, rect.height, false);
          callbacks.onResize(rect.width, rect.height);
        }
      }
    });
    this.resizeObserver.observe(container);

    this.onWebGLContextLost = (e: Event): void => {
      e.preventDefault();
      logger.warn('WebGL context lost');
      callbacks.onContextLost();
    };

    this.onWebGLContextRestored = (): void => {
      logger.info('WebGL context restored');
      callbacks.onContextRestored();
    };

    this.renderer.domElement.addEventListener('webglcontextlost', this.onWebGLContextLost);
    this.renderer.domElement.addEventListener('webglcontextrestored', this.onWebGLContextRestored);
  }

  applyQualityTier(tier: QualityTier): void {
    const dpr = Math.min(window.devicePixelRatio || 1, tier.maxPixelRatio);
    this.renderer.setPixelRatio(dpr);
  }

  render(camera: THREE.Camera): void {
    this.renderer.render(this.scene, camera);
  }

  getDrawCalls(): number {
    return this.renderer.info.render.calls;
  }

  getGeometryCount(): number {
    return this.renderer.info.memory.geometries;
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onWebGLContextLost);
    this.renderer.domElement.removeEventListener(
      'webglcontextrestored',
      this.onWebGLContextRestored,
    );
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode === this.container) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
