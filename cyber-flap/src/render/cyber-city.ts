import * as THREE from 'three';
import { disposeObject3D } from './dispose';

const BUILDING_COUNT = 44;
const MAX_RAIN_COUNT = 160;
const CITY_SPAN_X = 110;

// Module-level scratch objects prevent hot-path GC allocations
const _mat4 = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _color = new THREE.Color();

export class CyberCity {
  readonly root = new THREE.Group();
  private readonly buildingMesh: THREE.InstancedMesh;
  private readonly neonTrimMesh: THREE.InstancedMesh;
  private readonly rainMesh: THREE.InstancedMesh;

  private readonly buildingX = new Float32Array(BUILDING_COUNT);
  private readonly buildingY = new Float32Array(BUILDING_COUNT);
  private readonly buildingZ = new Float32Array(BUILDING_COUNT);
  private readonly buildingW = new Float32Array(BUILDING_COUNT);
  private readonly buildingH = new Float32Array(BUILDING_COUNT);
  private readonly buildingD = new Float32Array(BUILDING_COUNT);
  private readonly buildingParallax = new Float32Array(BUILDING_COUNT);

  private readonly rainX = new Float32Array(MAX_RAIN_COUNT);
  private readonly rainY = new Float32Array(MAX_RAIN_COUNT);
  private readonly rainZ = new Float32Array(MAX_RAIN_COUNT);
  private readonly rainSpeed = new Float32Array(MAX_RAIN_COUNT);
  private activeRainCount = MAX_RAIN_COUNT;

  constructor(ceilingY: number, floorY: number) {
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    const buildingMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
    });
    this.buildingMesh = new THREE.InstancedMesh(boxGeo, buildingMat, BUILDING_COUNT);
    this.buildingMesh.frustumCulled = false;

    const trimMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.neonTrimMesh = new THREE.InstancedMesh(boxGeo, trimMat, BUILDING_COUNT);
    this.neonTrimMesh.frustumCulled = false;

    const buildingPalette = [0xbae6fd, 0xfef08a, 0xa7f3d0, 0xfecdd3, 0xe2e8f0];
    const trimPalette = [0x0284c7, 0xf59e0b, 0xec4899, 0x10b981];

    for (let i = 0; i < BUILDING_COUNT; i++) {
      const layer = i % 2; // 0 = mid-ground, 1 = deep background
      const w = 2.2 + ((i * 17) % 10) * 0.35;
      const h = 10 + ((i * 31) % 24);
      const d = 2.5 + ((i * 13) % 6) * 0.4;
      const x = -CITY_SPAN_X * 0.5 + (i / BUILDING_COUNT) * CITY_SPAN_X;
      const z = layer === 0 ? -14 - (i % 5) * 2.2 : -28 - (i % 7) * 3.0;
      const y = floorY - 6 + h * 0.5;

      this.buildingX[i] = x;
      this.buildingY[i] = y;
      this.buildingZ[i] = z;
      this.buildingW[i] = w;
      this.buildingH[i] = h;
      this.buildingD[i] = d;
      this.buildingParallax[i] = layer === 0 ? 0.38 : 0.18;

      _color.setHex(buildingPalette[i % buildingPalette.length]);
      this.buildingMesh.setColorAt(i, _color);

      _color.setHex(trimPalette[i % trimPalette.length]);
      this.neonTrimMesh.setColorAt(i, _color);
    }
    if (this.buildingMesh.instanceColor) {
      this.buildingMesh.instanceColor.needsUpdate = true;
    }
    if (this.neonTrimMesh.instanceColor) {
      this.neonTrimMesh.instanceColor.needsUpdate = true;
    }

    const moteGeo = new THREE.BoxGeometry(0.06, 0.45, 0.06);
    const moteMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    this.rainMesh = new THREE.InstancedMesh(moteGeo, moteMat, MAX_RAIN_COUNT);
    this.rainMesh.frustumCulled = false;

    for (let i = 0; i < MAX_RAIN_COUNT; i++) {
      this.rainX[i] = ((i * 73) % 44) - 20;
      this.rainY[i] = ((i * 41) % 24) - 12;
      this.rainZ[i] = -2 - ((i * 19) % 18);
      this.rainSpeed[i] = 10 + (i % 8) * 1.6;
    }

    this.root.add(this.buildingMesh);
    this.root.add(this.neonTrimMesh);
    this.root.add(this.rainMesh);

    this.createBoundaryRails(ceilingY, floorY);
    this.syncTransforms();
  }

  private createBoundaryRails(ceilingY: number, floorY: number): void {
    const deckGeo = new THREE.BoxGeometry(60, 0.5, 6);
    const deckMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });

    const stripeGeo = new THREE.BoxGeometry(60, 0.1, 0.25);
    const floorStripeMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const ceilStripeMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });

    const floorDeck = new THREE.Mesh(deckGeo, deckMat);
    floorDeck.position.set(2, floorY - 0.25, 0);
    floorDeck.receiveShadow = true;
    floorDeck.matrixAutoUpdate = false;
    floorDeck.updateMatrix();

    const floorStripe = new THREE.Mesh(stripeGeo, floorStripeMat);
    floorStripe.position.set(2, floorY + 0.02, 0.3);
    floorStripe.matrixAutoUpdate = false;
    floorStripe.updateMatrix();

    const ceilDeck = new THREE.Mesh(deckGeo, deckMat);
    ceilDeck.position.set(2, ceilingY + 0.25, 0);
    ceilDeck.receiveShadow = true;
    ceilDeck.matrixAutoUpdate = false;
    ceilDeck.updateMatrix();

    const ceilStripe = new THREE.Mesh(stripeGeo, ceilStripeMat);
    ceilStripe.position.set(2, ceilingY - 0.02, 0.3);
    ceilStripe.matrixAutoUpdate = false;
    ceilStripe.updateMatrix();

    this.root.add(floorDeck, floorStripe, ceilDeck, ceilStripe);
  }

  setRainCount(count: number): void {
    this.activeRainCount = Math.min(MAX_RAIN_COUNT, Math.max(0, count));
    this.rainMesh.count = this.activeRainCount;
  }

  update(dtSec: number, scrollSpeedMps: number): void {
    const halfSpan = CITY_SPAN_X * 0.5;

    for (let i = 0; i < BUILDING_COUNT; i++) {
      let x = this.buildingX[i] - scrollSpeedMps * this.buildingParallax[i] * dtSec;
      if (x < -halfSpan) {
        x += CITY_SPAN_X;
      }
      this.buildingX[i] = x;
    }

    _quat.setFromAxisAngle(_pos.set(0, 0, 1), -0.06);
    for (let i = 0; i < this.activeRainCount; i++) {
      let rx = this.rainX[i] - (scrollSpeedMps * 0.65 + this.rainSpeed[i]) * dtSec;
      let ry = this.rainY[i] - Math.sin((rx + i * 2) * 0.4) * 0.6 * dtSec;
      if (rx < -22) {
        rx += 44;
        ry = ((i * 41) % 24) - 12;
      }
      this.rainX[i] = rx;
      this.rainY[i] = ry;

      _pos.set(rx, ry, this.rainZ[i]);
      _scale.set(1, 1, 1);
      _mat4.compose(_pos, _quat, _scale);
      this.rainMesh.setMatrixAt(i, _mat4);
    }
    this.rainMesh.instanceMatrix.needsUpdate = true;

    this.syncTransforms();
  }

  private syncTransforms(): void {
    _quat.identity();
    for (let i = 0; i < BUILDING_COUNT; i++) {
      const x = this.buildingX[i];
      const y = this.buildingY[i];
      const z = this.buildingZ[i];
      const w = this.buildingW[i];
      const h = this.buildingH[i];
      const d = this.buildingD[i];

      _pos.set(x, y, z);
      _scale.set(w, h, d);
      _mat4.compose(_pos, _quat, _scale);
      this.buildingMesh.setMatrixAt(i, _mat4);

      // Rooftop neon beacon strip
      _pos.set(x, y + h * 0.5 + 0.14, z + d * 0.48);
      _scale.set(w * 0.92, 0.24, 0.25);
      _mat4.compose(_pos, _quat, _scale);
      this.neonTrimMesh.setMatrixAt(i, _mat4);
    }
    this.buildingMesh.instanceMatrix.needsUpdate = true;
    this.neonTrimMesh.instanceMatrix.needsUpdate = true;
  }

  dispose(): void {
    disposeObject3D(this.root);
  }
}
