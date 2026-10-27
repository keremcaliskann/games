import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export class LightingSetup {
  public readonly hemisphere: THREE.HemisphereLight;
  public readonly sunLight: THREE.DirectionalLight;
  public readonly fillLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene) {
    VisualEnhancer.enhanceScene(scene);
    // Soft pastel daylight sky
    scene.background = new THREE.Color(0xcfe8f7);
    scene.fog = new THREE.FogExp2(0xcfe8f7, 0.0075);

    // Warm hemisphere light (sky soft cyan, ground warm biscuit bounce)
    this.hemisphere = new THREE.HemisphereLight(0xdff1fc, 0xf4ebd9, 0.85);
    scene.add(this.hemisphere);

    // Warm golden key sun
    this.sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
    this.sunLight.position.set(45, 80, 40);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 180;

    const d = 50;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    scene.add(this.sunLight);

    // Soft sky-blue fill light from opposite angle to prevent dark voids
    this.fillLight = new THREE.DirectionalLight(0xbae6fd, 0.35);
    this.fillLight.position.set(-40, 50, -35);
    scene.add(this.fillLight);
  }

  public update(targetPos: THREE.Vector3): void {
    // Keep sun shadow frustum centered around player's active area
    this.sunLight.position.set(targetPos.x + 45, 80, targetPos.z + 40);
    this.sunLight.target.position.copy(targetPos);
    this.sunLight.target.updateMatrixWorld();
  }
}
