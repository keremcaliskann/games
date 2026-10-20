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
      color: 0x0b071e,
      emissive: 0x050210,
    });
    this.buildingMesh = new THREE.InstancedMesh(boxGeo, buildingMat, BUILDING_COUNT);
    this.buildingMesh.frustumCulled = false;

    const trimMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.neonTrimMesh = new THREE.InstancedMesh(boxGeo, trimMat, BUILDING_COUNT);
    this.neonTrimMesh.frustumCulled = false;

    const palette = [0x00f3ff, 0xff007f, 0x9d00ff, 0x00ff9d];

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

      _color.setHex(palette[i % palette.length]);
      this.neonTrimMesh.setColorAt(i, _color);
    }
    if (this.neonTrimMesh.instanceColor) {
      this.neonTrimMesh.instanceColor.needsUpdate = true;
    }

    const rainGeo = new THREE.BoxGeometry(0.035, 1.35, 0.035);
    const rainMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.rainMesh = new THREE.InstancedMesh(rainGeo, rainMat, MAX_RAIN_COUNT);
    this.rainMesh.frustumCulled = false;

    for (let i = 0; i < MAX_RAIN_COUNT; i++) {
      this.rainX[i] = ((i * 73) % 44) - 20;
      this.rainY[i] = ((i * 41) % 24) - 12;
      this.rainZ[i] = -2 - ((i * 19) % 18);
      this.rainSpeed[i] = 16 + (i % 9) * 1.5;
    }

    this.root.add(this.buildingMesh);
    this.root.add(this.neonTrimMesh);
    this.root.add(this.rainMesh);

    this.createBoundaryRails(ceilingY, floorY);
    this.syncTransforms();
  }

  private createBoundaryRails(ceilingY: number, floorY: number): void {
    const railGeo = new THREE.BoxGeometry(60, 0.28, 1.6);
    const railMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const glowGeo = new THREE.BoxGeometry(60, 0.9, 2.4);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xff007f,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const topRail = new THREE.Mesh(railGeo, railMat);
    topRail.position.set(2, ceilingY + 0.15, 0);
    topRail.matrixAutoUpdate = false;
    topRail.updateMatrix();

    const bottomRail = new THREE.Mesh(railGeo, railMat);
    bottomRail.position.set(2, floorY - 0.15, 0);
    bottomRail.matrixAutoUpdate = false;
    bottomRail.updateMatrix();

    const topGlow = new THREE.Mesh(glowGeo, glowMat);
    topGlow.position.set(2, ceilingY + 0.35, 0);
    topGlow.matrixAutoUpdate = false;
    topGlow.updateMatrix();

    const bottomGlow = new THREE.Mesh(glowGeo, glowMat);
    bottomGlow.position.set(2, floorY - 0.35, 0);
    bottomGlow.matrixAutoUpdate = false;
    bottomGlow.updateMatrix();

    this.root.add(topRail, bottomRail, topGlow, bottomGlow);
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

    _quat.setFromAxisAngle(_pos.set(0, 0, 1), -0.14);
    for (let i = 0; i < this.activeRainCount; i++) {
      let rx = this.rainX[i] - scrollSpeedMps * 0.45 * dtSec;
      let ry = this.rainY[i] - this.rainSpeed[i] * dtSec;
      if (ry < -12) {
        ry += 24;
        rx = ((rx + 22) % 44) - 20;
      }
      if (rx < -22) {
        rx += 44;
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
