import * as THREE from 'three';

export interface RenderPipelineOptions {
  onResize?: (width: number, height: number) => void;
}

export class RenderPipeline {
  public readonly renderer: THREE.WebGLRenderer;
  public readonly scene: THREE.Scene;
  private resizeObserver: ResizeObserver | null = null;

  constructor(container: HTMLElement, options: RenderPipelineOptions = {}) {
    this.scene = new THREE.Scene();
    // Soft pastel sky background (Rule 32: Stylized Toony Soft Daylight)
    this.scene.background = new THREE.Color(0xcfe8f7);
    this.scene.fog = new THREE.FogExp2(0xcfe8f7, 0.015);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ACESFilmic Tone Mapping for rich soft daylight
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    container.appendChild(this.renderer.domElement);

    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.floor(entry.contentRect.width);
          const h = Math.floor(entry.contentRect.height);
          if (w > 0 && h > 0) {
            this.renderer.setSize(w, h, false);
            options.onResize?.(w, h);
          }
        }
      });
      this.resizeObserver.observe(container);
    }
  }

  public render(camera: THREE.Camera): void {
    this.renderer.render(this.scene, camera);
  }

  public dispose(): void {
    this.resizeObserver?.disconnect();
    this.renderer.dispose();
  }
}
