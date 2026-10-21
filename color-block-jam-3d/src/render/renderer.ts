import * as THREE from 'three';

export interface RenderPipelineCallbacks {
  onResize?: (width: number, height: number) => void;
}

export class RenderPipeline {
  public readonly scene: THREE.Scene;
  public readonly renderer: THREE.WebGLRenderer;
  private readonly container: HTMLElement;
  private resizeObserver: ResizeObserver | null = null;
  private callbacks: RenderPipelineCallbacks;

  constructor(container: HTMLElement, callbacks: RenderPipelineCallbacks = {}) {
    this.container = container;
    this.callbacks = callbacks;
    this.scene = new THREE.Scene();

    // Soft sky gradient / bright sunlit daylight background
    this.scene.background = new THREE.Color(0x0f172a);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth || window.innerWidth, container.clientHeight || window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    this.container.appendChild(this.renderer.domElement);

    this.setupResizeObserver();
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = Math.floor(entry.contentRect.width);
        const height = Math.floor(entry.contentRect.height);
        if (width > 0 && height > 0) {
          this.renderer.setSize(width, height, false);
          if (this.callbacks.onResize) {
            this.callbacks.onResize(width, height);
          }
        }
      }
    });

    this.resizeObserver.observe(this.container);
  }

  public render(camera: THREE.Camera): void {
    this.renderer.render(this.scene, camera);
  }

  public dispose(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
