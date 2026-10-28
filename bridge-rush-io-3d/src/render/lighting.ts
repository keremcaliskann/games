import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export function setupDaylightLighting(scene: THREE.Scene): void {
  VisualEnhancer.enhanceScene(scene);

  scene.background = new THREE.Color(0xcfe8f7);
  scene.fog = new THREE.FogExp2(0xcfe8f7, 0.0065);

  const hemiLight = new THREE.HemisphereLight(0xeef7ff, 0xf3ead8, 0.88);
  hemiLight.position.set(0, 45, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
  dirLight.position.set(22, 42, -18);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  dirLight.shadow.camera.near = 2;
  dirLight.shadow.camera.far = 140;
  const d = 42;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.45);
  fillLight.position.set(-20, 22, 20);
  scene.add(fillLight);

  // Sunlit Tropical Sea Plane beneath the 3 Sky Islands
  const seaGeo = new THREE.PlaneGeometry(340, 340);
  seaGeo.rotateX(-Math.PI / 2);
  const seaMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    roughness: 0.35,
    metalness: 0.1,
  });
  const sea = new THREE.Mesh(seaGeo, seaMat);
  sea.position.set(0, -4.5, 45);
  scene.add(sea);
}
