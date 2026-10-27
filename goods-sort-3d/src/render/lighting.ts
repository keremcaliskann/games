import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export class LightingSetup {
  public readonly hemisphere: THREE.HemisphereLight;
  public readonly sunLight: THREE.DirectionalLight;
  public readonly fillLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene) {
    VisualEnhancer.enhanceScene(scene);
    // Stylized Soft Daylight Palette (32-daylight-and-lighting.md)
    scene.background = new THREE.Color(0xcfe8f7);
    scene.fog = new THREE.FogExp2(0xcfe8f7, 0.008);

    // Soft Ambient Sky/Ground bounce
    this.hemisphere = new THREE.HemisphereLight(0xdff1fc, 0xf4ebd9, 0.95);
    scene.add(this.hemisphere);

    // Warm golden key light
    this.sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
    this.sunLight.position.set(15, 30, 25);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 5;
    this.sunLight.shadow.camera.far = 80;

    const d = 16;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0003;
    scene.add(this.sunLight);

    // Soft fill light
    this.fillLight = new THREE.DirectionalLight(0xbae6fd, 0.4);
    this.fillLight.position.set(-18, 15, -15);
    scene.add(this.fillLight);
  }
}
