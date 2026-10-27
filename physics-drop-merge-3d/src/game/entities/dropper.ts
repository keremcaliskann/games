import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';
import { PrefabFactory, TIER_DEFINITIONS } from '../../render/PrefabFactory';

export class DropperEntity {
  public readonly mesh: THREE.Group;
  private readonly trajectoryLine: THREE.Line;
  private currentX = 0;
  private primedMesh: THREE.Group | null = null;
  private currentTier = 1;
  private isBombPrimed = false;
  private isRainbowPrimed = false;

  constructor(scene: THREE.Scene) {
    this.mesh = new THREE.Group();
    this.mesh.position.set(0, GAME_CONFIG.dropper.spawnY, 0);
    scene.add(this.mesh);

    // Overhead Crane Slider Bar
    const railMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.5 });
    const rail = new THREE.Mesh(new THREE.BoxGeometry(GAME_CONFIG.dropper.maxHorizontalSpread * 2 + 1.2, 0.16, 0.3), railMat);
    rail.position.set(0, GAME_CONFIG.dropper.spawnY + 0.8, 0);
    scene.add(rail);

    // Dropper carriage indicator
    const carriage = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 0.4, 16), railMat);
    carriage.position.y = 0.5;
    this.mesh.add(carriage);

    // Vertical trajectory line
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -9.0, 0)];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.35,
      gapSize: 0.25,
      transparent: true,
      opacity: 0.65,
    });
    this.trajectoryLine = new THREE.Line(lineGeo, lineMat);
    this.trajectoryLine.computeLineDistances();
    this.mesh.add(this.trajectoryLine);

    this.setPrimed(1, false);
  }

  public setX(targetX: number): void {
    const max = GAME_CONFIG.dropper.maxHorizontalSpread;
    this.currentX = THREE.MathUtils.clamp(targetX, -max, max);
    this.mesh.position.x = this.currentX;
  }

  public get x(): number {
    return this.currentX;
  }

  public setPrimed(tier: number, isBomb: boolean = false, isRainbow: boolean = false): void {
    this.currentTier = tier;
    this.isBombPrimed = isBomb;
    this.isRainbowPrimed = isRainbow;

    if (this.primedMesh) {
      this.mesh.remove(this.primedMesh);
    }

    if (isBomb) {
      this.primedMesh = PrefabFactory.createBombMesh(0.8);
    } else if (isRainbow) {
      this.primedMesh = PrefabFactory.createRainbowMesh(0.85);
    } else {
      const def = TIER_DEFINITIONS[tier - 1] || TIER_DEFINITIONS[0];
      this.primedMesh = PrefabFactory.createSphereMesh(def);
    }

    this.primedMesh.position.set(0, 0, 0);
    this.mesh.add(this.primedMesh);
  }

  public get primedTier(): number {
    return this.currentTier;
  }

  public get isBomb(): boolean {
    return this.isBombPrimed;
  }

  public get isRainbow(): boolean {
    return this.isRainbowPrimed;
  }

  public setTrajectoryVisible(visible: boolean): void {
    this.trajectoryLine.visible = visible;
  }
}
