import * as THREE from 'three';

export function setupCyberLighting(scene: THREE.Scene): void {
  // Exponential fog hides distant clipping and intensifies neon contrast
  scene.fog = new THREE.FogExp2(0x060212, 0.018);

  const hemiLight = new THREE.HemisphereLight(0x00f0ff, 0xff007f, 0.9);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xa0d8ff, 1.4);
  dirLight.position.set(8, 16, 12);
  scene.add(dirLight);
}
