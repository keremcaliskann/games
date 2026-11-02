import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export class CityArena {
  public readonly group = new THREE.Group();
  public tornadoMesh: THREE.Group | null = null;
  private tornadoAngle = 0;

  constructor() {
    this.buildCityGround();
    this.buildRoadNetwork();
    this.buildPerimeterBounds();
  }

  private buildCityGround(): void {
    const size = GAME_CONFIG.arenaSize;

    // Warm sunlit sandstone sidewalk foundational pavement (Soft Daylight)
    const groundGeo = new THREE.PlaneGeometry(size, size);
    groundGeo.rotateX(-Math.PI * 0.5);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xeeddbe,
      roughness: 0.72,
      metalness: 0.04,
    });

    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = -0.01;
    this.group.add(groundMesh);

    // 4 Lush emerald park quadrants with decorative water ponds
    const grassGeo = new THREE.PlaneGeometry(30, 30);
    grassGeo.rotateX(-Math.PI * 0.5);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.75,
    });

    const pondRimGeo = new THREE.CircleGeometry(6.8, 24);
    pondRimGeo.rotateX(-Math.PI * 0.5);
    const pondRimMat = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      roughness: 0.65,
    });

    const pondGeo = new THREE.CircleGeometry(5.6, 24);
    pondGeo.rotateX(-Math.PI * 0.5);
    const pondMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.25,
      metalness: 0.15,
    });

    const parkPositions = [
      [-24, 0.01, -24],
      [24, 0.01, 24],
      [-24, 0.01, 24],
      [24, 0.01, -24],
    ];

    parkPositions.forEach(([x, y, z], idx) => {
      const park = new THREE.Mesh(grassGeo, grassMat);
      park.position.set(x, y, z);
      park.receiveShadow = true;
      this.group.add(park);

      if (idx < 2) {
        const rim = new THREE.Mesh(pondRimGeo, pondRimMat);
        rim.position.set(x, 0.015, z);
        this.group.add(rim);

        const pond = new THREE.Mesh(pondGeo, pondMat);
        pond.position.set(x, 0.02, z);
        this.group.add(pond);
      }
    });
  }

  private buildRoadNetwork(): void {
    const size = GAME_CONFIG.arenaSize;
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // Crisp slate-blue-grey asphalt for strong contrast
      roughness: 0.62,
    });

    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.4,
    });

    const yellowStripeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.45,
    });

    // Main Avenue Cross (North-South & East-West)
    const roadWidth = 14;

    // East-West road
    const roadEWGeo = new THREE.PlaneGeometry(size, roadWidth);
    roadEWGeo.rotateX(-Math.PI * 0.5);
    const roadEW = new THREE.Mesh(roadEWGeo, roadMat);
    roadEW.position.y = 0.02;
    roadEW.receiveShadow = true;
    this.group.add(roadEW);

    // North-South road
    const roadNSGeo = new THREE.PlaneGeometry(roadWidth, size);
    roadNSGeo.rotateX(-Math.PI * 0.5);
    const roadNS = new THREE.Mesh(roadNSGeo, roadMat);
    roadNS.position.y = 0.02;
    roadNS.receiveShadow = true;
    this.group.add(roadNS);

    // Secondary ring roads
    const secondaryWidth = 10;
    const offset = 42;

    const ringPositions = [
      { w: size, h: secondaryWidth, x: 0, z: offset },
      { w: size, h: secondaryWidth, x: 0, z: -offset },
      { w: secondaryWidth, h: size, x: offset, z: 0 },
      { w: secondaryWidth, h: size, x: -offset, z: 0 },
    ];

    ringPositions.forEach(({ w, h, x, z }) => {
      const rGeo = new THREE.PlaneGeometry(w, h);
      rGeo.rotateX(-Math.PI * 0.5);
      const rMesh = new THREE.Mesh(rGeo, roadMat);
      rMesh.position.set(x, 0.02, z);
      rMesh.receiveShadow = true;
      this.group.add(rMesh);
    });

    // Center Intersection Dashes & Zebra Crosswalks
    const dashGeo = new THREE.PlaneGeometry(2.6, 0.45);
    dashGeo.rotateX(-Math.PI * 0.5);

    for (let i = -size / 2 + 5; i < size / 2; i += 7) {
      if (Math.abs(i) > 9 && Math.abs(Math.abs(i) - offset) > 6) {
        // EW center line
        const dashEW = new THREE.Mesh(dashGeo, yellowStripeMat);
        dashEW.position.set(i, 0.032, 0);
        this.group.add(dashEW);

        // NS center line
        const dashNS = new THREE.Mesh(dashGeo, yellowStripeMat);
        dashNS.rotation.y = Math.PI * 0.5;
        dashNS.position.set(0, 0.032, i);
        this.group.add(dashNS);
      }
    }

    // Zebra Crosswalk stripes around center plaza
    const zebraGeo = new THREE.PlaneGeometry(2.2, 0.7);
    zebraGeo.rotateX(-Math.PI * 0.5);
    for (let s = -4.5; s <= 4.5; s += 1.8) {
      const cwN = new THREE.Mesh(zebraGeo, stripeMat);
      cwN.rotation.y = Math.PI * 0.5;
      cwN.position.set(s, 0.034, -8.5);
      this.group.add(cwN);

      const cwS = new THREE.Mesh(zebraGeo, stripeMat);
      cwS.rotation.y = Math.PI * 0.5;
      cwS.position.set(s, 0.034, 8.5);
      this.group.add(cwS);

      const cwE = new THREE.Mesh(zebraGeo, stripeMat);
      cwE.position.set(8.5, 0.034, s);
      this.group.add(cwE);

      const cwW = new THREE.Mesh(zebraGeo, stripeMat);
      cwW.position.set(-8.5, 0.034, s);
      this.group.add(cwW);
    }
  }

  private buildPerimeterBounds(): void {
    const size = GAME_CONFIG.arenaSize;
    const half = size / 2;

    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.5,
    });

    const curbGeo = new THREE.BoxGeometry(size, 1.2, 1.2);

    const bounds = [
      { x: 0, y: 0.6, z: half, rotY: 0 },
      { x: 0, y: 0.6, z: -half, rotY: 0 },
      { x: half, y: 0.6, z: 0, rotY: Math.PI * 0.5 },
      { x: -half, y: 0.6, z: 0, rotY: Math.PI * 0.5 },
    ];

    bounds.forEach(({ x, y, z, rotY }) => {
      const curb = new THREE.Mesh(curbGeo, curbMat);
      curb.position.set(x, y, z);
      curb.rotation.y = rotY;
      curb.castShadow = true;
      curb.receiveShadow = true;
      this.group.add(curb);
    });
  }

  public activateTornado(): void {
    if (this.tornadoMesh) return;
    this.tornadoMesh = PrefabFactory.createTornadoMesh();
    this.tornadoMesh.position.set(0, 0, 0);
    this.group.add(this.tornadoMesh);
  }

  public updateTornado(dt: number): THREE.Vector3 | null {
    if (!this.tornadoMesh) return null;
    this.tornadoAngle += dt * 0.8;
    this.tornadoMesh.rotation.y += dt * 6.0;
    const rx = Math.sin(this.tornadoAngle) * 24.0;
    const rz = Math.sin(this.tornadoAngle * 2.0) * 16.0;
    this.tornadoMesh.position.set(rx, 0, rz);
    return this.tornadoMesh.position;
  }
}
