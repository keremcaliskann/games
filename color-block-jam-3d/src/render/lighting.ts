import * as THREE from 'three';

export class LightingSetup {
  public static setup(scene: THREE.Scene): {
    hemiLight: THREE.HemisphereLight;
    dirLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
  } {
    // 1. Hemisphere Light (Crisp Pure Sky + Warm Daylight Bounce)
    // Ground bounce color MUST be warm/light so shadowed faces never turn black/muddy
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfef08a, 1.55);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    // 2. Main Sun Directional Light (Warm high-contrast daylight with soft shadows)
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    dirLight.position.set(16, 28, 18);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    const d = 16;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);

    // 3. Subtle Rim / Secondary Light (Fill light preventing dark undersides)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(-18, 16, -18);
    scene.add(rimLight);

    return { hemiLight, dirLight, rimLight };
  }
}
