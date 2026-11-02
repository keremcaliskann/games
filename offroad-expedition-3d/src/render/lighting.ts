import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export function setupDaylightLighting(scene: THREE.Scene): THREE.DirectionalLight {
  // Rule 32: Stylized Toony Soft Daylight Art Direction
  scene.background = new THREE.Color(0xcfe8f7);
  scene.fog = new THREE.FogExp2(0xdff1fc, 0.0042);

  VisualEnhancer.enhanceScene(scene);

  const hemiLight = new THREE.HemisphereLight(0xeef7ff, 0xf3e5ab, 0.88);
  hemiLight.position.set(0, 60, 0);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
  sunLight.position.set(34, 66, -26);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.near = 5;
  sunLight.shadow.camera.far = 220;
  const d = 55;
  sunLight.shadow.camera.left = -d;
  sunLight.shadow.camera.right = d;
  sunLight.shadow.camera.top = d;
  sunLight.shadow.camera.bottom = -d;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  return sunLight;
}
