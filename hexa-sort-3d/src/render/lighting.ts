import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';
import { GAME_CONFIG } from '../game/config/game-config';

export class LightingSetup {
  public static setup(scene: THREE.Scene): void {
    VisualEnhancer.enhanceScene(scene);
    // 1. Hemisphere Light: Soft Sky Blue top + Warm Biscuit ground bounce (Rule 32)
    const hemiLight = new THREE.HemisphereLight(
      GAME_CONFIG.daylight.skyColor,
      GAME_CONFIG.daylight.groundBounceColor,
      GAME_CONFIG.daylight.hemiIntensity
    );
    scene.add(hemiLight);

    // 2. Main Key Sun: Warm golden sunlight
    const sunLight = new THREE.DirectionalLight(
      GAME_CONFIG.daylight.sunColor,
      GAME_CONFIG.daylight.sunIntensity
    );
    sunLight.position.set(10, 18, 12);
    sunLight.castShadow = true;

    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLight.shadow.bias = -0.0005;

    scene.add(sunLight);

    // 3. Subtle Soft Rim / Ambient Fill for clean bevel edge highlights
    const rimLight = new THREE.DirectionalLight(0xdbeafe, 0.4);
    rimLight.position.set(-12, 10, -10);
    scene.add(rimLight);
  }
}
