import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export function setupCyberLighting(scene: THREE.Scene): THREE.DirectionalLight {
    VisualEnhancer.enhanceScene(scene);
  // Horizon blending fog matching daylight sky
  scene.fog = new THREE.FogExp2(0xcfe8f7, 0.012);

  // Sky fill + warm ground bounce (no muddy or dark faces)
  const hemiLight = new THREE.HemisphereLight(0xdbeefd, 0xf5e6ca, 0.9);
  hemiLight.position.set(0, 24, 0);
  scene.add(hemiLight);

  // Warm golden sun key casting soft shadows
  const sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
  sunLight.position.set(12, 22, 14);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 1024;
  sunLight.shadow.mapSize.height = 1024;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 60;
  sunLight.shadow.camera.left = -16;
  sunLight.shadow.camera.right = 22;
  sunLight.shadow.camera.top = 12;
  sunLight.shadow.camera.bottom = -12;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // Subtle sky rim light for soft contouring
  const rimLight = new THREE.DirectionalLight(0xbae6fd, 0.5);
  rimLight.position.set(-18, 16, -18);
  scene.add(rimLight);

  return sunLight;
}
