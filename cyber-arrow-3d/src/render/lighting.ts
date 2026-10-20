import * as THREE from 'three';

/**
 * High contrast cyber/neon lighting setup.
 * Uses soft directional light with subtle ambient fill.
 */
export class LightingSetup {
  public static setup(scene: THREE.Scene): void {
    const ambient = new THREE.AmbientLight(0x22263a, 1.8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight.position.set(12, 20, 16);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    const rimCyan = new THREE.PointLight(0x00f0ff, 2.5, 30);
    rimCyan.position.set(-10, -5, -10);
    scene.add(rimCyan);

    const rimPink = new THREE.PointLight(0xff0077, 2.0, 30);
    rimPink.position.set(10, 8, -8);
    scene.add(rimPink);
  }
}
