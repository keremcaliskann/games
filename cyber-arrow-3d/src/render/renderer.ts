import * as THREE from 'three';

/**
 * Encapsulated Three.js WebGL renderer setup.
 * Clamps DPR to 2.0 to protect GPU fillrate and battery on mobile devices.
 */
export class RenderPipeline {
  public readonly renderer: THREE.WebGLRenderer;
  public readonly scene: THREE.Scene;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x090a14);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: true,
      alpha: false,
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onResize(container));
  }

  private onResize(container: HTMLElement): void {
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.renderer.setSize(width, height);
  }

  public render(camera: THREE.Camera): void {
    this.renderer.render(this.scene, camera);
  }
}
