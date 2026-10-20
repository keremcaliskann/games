import * as THREE from 'three';

/**
 * High contrast cyber/neon lighting setup.
 * Uses soft directional light with subtle ambient fill.
 */
export class LightingSetup {
  public static setup(scene: THREE.Scene): void {
    // Bright daylight hemisphere fill (sky white + warm ground bounce)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfde68a, 1.25);
    scene.add(hemiLight);

    // Warm sun directional light casting crisp contact shadows
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    dirLight.position.set(14, 22, 16);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    dirLight.shadow.camera.left = -15;
    dirLight.shadow.camera.right = 15;
    dirLight.shadow.camera.top = 15;
    dirLight.shadow.camera.bottom = -15;
    dirLight.shadow.bias = -0.0003;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);
  }
}
