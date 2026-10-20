import * as THREE from 'three';

export function setupCyberLighting(scene: THREE.Scene): THREE.DirectionalLight {
  // Horizon blending fog matching sky
  scene.fog = new THREE.Fog(0x7dd3fc, 30, 95);

  // Sky fill + warm ground bounce (no muddy or dark faces)
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xfde68a, 1.3);
  hemiLight.position.set(0, 24, 0);
  scene.add(hemiLight);

  // Warm crisp sun casting soft contact shadows
  const sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
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

  return sunLight;
}
