import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export class LightingSetup {
  public static setup(scene: THREE.Scene): {
    hemiLight: THREE.HemisphereLight;
    dirLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
  } {
    VisualEnhancer.enhanceScene(scene);
    // 1. Hemisphere Light (Soft Sky Blue + Warm Biscuit Ground Bounce)
    // Warm ground bounce ensures shadowed faces stay bright and warm without blowout
    const hemiLight = new THREE.HemisphereLight(0xdbeefd, 0xf5e6ca, 0.92);
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    // 2. Main Sun Directional Light (Warm Golden Daylight with Soft PCF Shadows)
    const dirLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
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
    dirLight.shadow.bias = -0.0003;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);

    // 3. Subtle Rim / Secondary Light (Soft cool sky contour from opposite angle)
    const rimLight = new THREE.DirectionalLight(0xbae6fd, 0.52);
    rimLight.position.set(-18, 16, -18);
    scene.add(rimLight);

    return { hemiLight, dirLight, rimLight };
  }
}
