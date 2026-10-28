import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export class LightingSetup {
  public readonly sunLight: THREE.DirectionalLight;
  public readonly hemiLight: THREE.HemisphereLight;
  public readonly fillLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene) {
    VisualEnhancer.enhanceScene(scene);

    // Stylized Toony Soft Daylight Art Direction (32-daylight-and-lighting)
    scene.background = new THREE.Color(0xcfe8f7);
    scene.fog = new THREE.FogExp2(0xcfe8f7, 0.0065);

    this.hemiLight = new THREE.HemisphereLight(0xdff1fc, 0xfcf8ee, 0.92);
    this.hemiLight.position.set(0, 45, 0);
    scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
    this.sunLight.position.set(20, 38, -18);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 120;
    const d = 28;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    scene.add(this.sunLight);
    scene.add(this.sunLight.target);

    this.fillLight = new THREE.DirectionalLight(0xbae6fd, 0.42);
    this.fillLight.position.set(-18, 20, 18);
    scene.add(this.fillLight);
  }

  public updateShadowFocus(playerZ: number): void {
    this.sunLight.position.set(18, 36, playerZ - 14);
    this.sunLight.target.position.set(0, 0, playerZ + 12);
    this.sunLight.target.updateMatrixWorld();
  }
}
