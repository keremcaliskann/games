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

    // Biscuit/cream sidewalk foundational pavement (Strict Soft Daylight)
    const groundGeo = new THREE.PlaneGeometry(size, size);
    groundGeo.rotateX(-Math.PI * 0.5);

    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf5eedb,
      roughness: 0.75,
      metalness: 0.05,
    });

    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    groundMesh.position.y = -0.01;
    this.group.add(groundMesh);

    // Park grass zones in selected city quadrants
    const grassGeo = new THREE.PlaneGeometry(36, 36);
    grassGeo.rotateX(-Math.PI * 0.5);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x86efac,
      roughness: 0.85,
    });

    const parkPositions = [
      [-38, 0.01, -38],
      [38, 0.01, 38],
    ];

    parkPositions.forEach(([x, y, z]) => {
      const park = new THREE.Mesh(grassGeo, grassMat);
      park.position.set(x, y, z);
      park.receiveShadow = true;
      this.group.add(park);
    });
  }

  private buildRoadNetwork(): void {
    const size = GAME_CONFIG.arenaSize;
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0xd4cabb, // Clean light matte asphalt (no dark void black!)
      roughness: 0.65,
    });

    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.4,
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

    // Center Intersection Dashes
    const dashGeo = new THREE.PlaneGeometry(2.4, 0.4);
    dashGeo.rotateX(-Math.PI * 0.5);

    for (let i = -size / 2 + 5; i < size / 2; i += 7) {
      if (Math.abs(i) > 8) {
        // EW center line
        const dashEW = new THREE.Mesh(dashGeo, stripeMat);
        dashEW.position.set(i, 0.03, 0);
        this.group.add(dashEW);

        // NS center line
        const dashNS = new THREE.Mesh(dashGeo, stripeMat);
        dashNS.rotation.y = Math.PI * 0.5;
        dashNS.position.set(0, 0.03, i);
        this.group.add(dashNS);
      }
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
