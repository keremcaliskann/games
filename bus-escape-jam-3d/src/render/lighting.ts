import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export class LightingSetup {
  public readonly sunLight: THREE.DirectionalLight;
  public readonly hemiLight: THREE.HemisphereLight;
  public readonly rimLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene) {
    VisualEnhancer.enhanceScene(scene);
    // 1. Soft Daylight Hemisphere Ambient
    this.hemiLight = new THREE.HemisphereLight(0xcfe8f7, 0xfcf8ee, 0.75);
    scene.add(this.hemiLight);

    // 2. Warm Sun Key Light
    this.sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
    this.sunLight.position.set(16, 28, 18);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 80;
    this.sunLight.shadow.camera.left = -16;
    this.sunLight.shadow.camera.right = 16;
    this.sunLight.shadow.camera.top = 16;
    this.sunLight.shadow.camera.bottom = -16;
    this.sunLight.shadow.bias = -0.0005;
    scene.add(this.sunLight);

    // 3. Gentle Rim / Fill Light
    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
    this.rimLight.position.set(-16, 12, -14);
    scene.add(this.rimLight);
  }
}
