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

    // Soft pastel ground pedestal beneath the puzzle structure
    const pedestalGeo = new THREE.CylinderGeometry(8.5, 9.2, 0.4, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe, // Soft daylight sky pastel
      roughness: 0.65,
      metalness: 0.05,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(0, -4.5, 0);
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Dedicated contact shadow plane on top of pedestal for soft shadow fidelity
    const shadowPlaneGeo = new THREE.CircleGeometry(8.4, 48);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.16 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -4.29, 0);
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
  }
}
