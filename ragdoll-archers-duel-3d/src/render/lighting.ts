import * as THREE from 'three';

export class DaylightLighting {
  public readonly sunLight: THREE.DirectionalLight;
  public readonly hemiLight: THREE.HemisphereLight;
  private readonly clouds: THREE.Group[] = [];

  constructor(scene: THREE.Scene) {
    // Stylized Toony Soft Daylight Art Direction (32-daylight-and-lighting)
    scene.background = new THREE.Color(0xcfe8f7);
    scene.fog = new THREE.FogExp2(0xcfe8f7, 0.012);

    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xe2e8f0, 0.92);
    this.hemiLight.position.set(0, 30, 0);
    scene.add(this.hemiLight);

    this.sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
    this.sunLight.position.set(12, 24, 16);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.camera.near = 2;
    this.sunLight.shadow.camera.far = 60;
    const d = 18;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    scene.add(this.sunLight);

    // Fill light from front-left for soft cartoon readability
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.45);
    fillLight.position.set(-14, 10, 12);
    scene.add(fillLight);

    this.buildSkyEnvironment(scene);
  }

  private buildSkyEnvironment(scene: THREE.Scene): void {
    // Distant pastel turquoise sea floor far below the floating bastions
    const seaGeo = new THREE.PlaneGeometry(160, 160);
    const seaMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      roughness: 0.5,
      metalness: 0.05,
    });
    const seaMesh = new THREE.Mesh(seaGeo, seaMat);
    seaMesh.rotation.x = -Math.PI / 2;
    seaMesh.position.y = -9.5;
    seaMesh.receiveShadow = true;
    scene.add(seaMesh);

    // Puffy sunlit cartoon clouds drifting in background
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.65,
      metalness: 0.0,
    });
    const sphereGeo = new THREE.SphereGeometry(1.2, 12, 10);

    const cloudCoords: Array<[number, number, number, number]> = [
      [-11, 8.5, -10, 1.2],
      [-2, 10.2, -13, 1.5],
      [8, 9.0, -11, 1.3],
      [15, 7.5, -9, 1.1],
      [-6, -4.5, -6, 1.0],
      [5, -5.0, -7, 1.2],
    ];

    for (let i = 0; i < cloudCoords.length; i++) {
      const [cx, cy, cz, scale] = cloudCoords[i];
      const group = new THREE.Group();
      const p1 = new THREE.Mesh(sphereGeo, cloudMat);
      const p2 = new THREE.Mesh(sphereGeo, cloudMat);
      p2.position.set(1.1, -0.2, 0.1);
      p2.scale.setScalar(0.8);
      const p3 = new THREE.Mesh(sphereGeo, cloudMat);
      p3.position.set(-1.0, -0.25, -0.1);
      p3.scale.setScalar(0.75);
      group.add(p1, p2, p3);
      group.position.set(cx, cy, cz);
      group.scale.setScalar(scale);
      scene.add(group);
      this.clouds.push(group);
    }
  }

  public update(dt: number): void {
    for (let i = 0; i < this.clouds.length; i++) {
      const c = this.clouds[i];
      c.position.x += dt * 0.25 * ((i % 2 === 0) ? 1 : 0.7);
      if (c.position.x > 22) {
        c.position.x = -22;
      }
    }
  }
}
