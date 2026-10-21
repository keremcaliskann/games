import * as THREE from 'three';

export class LightingSetup {
  public static setup(scene: THREE.Scene): void {
    // 1. Hemisphere Light: Soft Sky Blue top + Warm Biscuit ground bounce (Rule 32)
    const hemiLight = new THREE.HemisphereLight(0xcfe8f7, 0xfcf8ee, 0.95);
    scene.add(hemiLight);

    // 2. Main Key Sun: Warm golden sunlight
    const sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
    sunLight.position.set(12, 22, 14);
    sunLight.castShadow = true;

    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -12;
    sunLight.shadow.camera.right = 12;
    sunLight.shadow.camera.top = 12;
    sunLight.shadow.camera.bottom = -12;
    sunLight.shadow.bias = -0.0005;

    scene.add(sunLight);

    // 3. Subtle Rim / Backlight for crisp acrylic edge highlights
    const rimLight = new THREE.DirectionalLight(0xdbeafe, 0.45);
    rimLight.position.set(-14, 10, -12);
    scene.add(rimLight);
  }
}
