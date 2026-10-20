import * as THREE from 'three';

export interface RenderPipelineCallbacks {
  onResize?: (width: number, height: number) => void;
}

/**
 * Encapsulated Three.js WebGL renderer setup.
 * Clamps DPR to 2.0 to protect GPU fillrate and battery on mobile devices.
 * Observes container with ResizeObserver to adapt dynamically to Arcade Shell dimensions.
 */
export class RenderPipeline {
  public readonly renderer: THREE.WebGLRenderer;
  public readonly scene: THREE.Scene;
  private readonly resizeObserver: ResizeObserver;

  constructor(container: HTMLElement, callbacks?: RenderPipelineCallbacks) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090a14);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(container.clientWidth, container.clientHeight, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (let i = 0; i < entries.length; i++) {
        const rect = entries[i].contentRect;
        if (rect.width <= 0 || rect.height <= 0) return;
        this.renderer.setSize(rect.width, rect.height, false);
        callbacks?.onResize?.(rect.width, rect.height);
      }
    });
    this.resizeObserver.observe(container);
  }

  public render(camera: THREE.Camera): void {
    this.renderer.render(this.scene, camera);
  }

  public dispose(): void {
    this.resizeObserver.disconnect();
    this.renderer.dispose();
  }
}
