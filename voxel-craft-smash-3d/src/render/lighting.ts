import * as THREE from 'three';

export class LightingSetup {
  public readonly hemisphere: THREE.HemisphereLight;
  public readonly sunLight: THREE.DirectionalLight;
  public readonly fillLight: THREE.DirectionalLight;

  constructor(scene: THREE.Scene) {
    scene.background = new THREE.Color(0xcfe8f7);
    scene.fog = new THREE.FogExp2(0xcfe8f7, 0.009);

    this.hemisphere = new THREE.HemisphereLight(0xdff1fc, 0xf4ebd9, 0.85);
    scene.add(this.hemisphere);

    this.sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
    this.sunLight.position.set(25, 45, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 5;
    this.sunLight.shadow.camera.far = 120;

    const d = 26;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0004;
    scene.add(this.sunLight);

    this.fillLight = new THREE.DirectionalLight(0xbae6fd, 0.35);
    this.fillLight.position.set(-20, 30, -25);
    scene.add(this.fillLight);
  }
}
