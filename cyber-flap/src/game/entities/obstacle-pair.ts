import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { ColliderFilter, ColliderTag } from '../../physics/layers';
import type { PhysicsWorld } from '../../physics/physics-world';
import { GAME_CONFIG } from '../config/game-config';

const OFFSTAGE_X = -200;
const OFFSTAGE_Y = -200;

export interface SharedObstacleResources {
  pillarGeo: THREE.BoxGeometry;
  coreGeo: THREE.BoxGeometry;
  capGeo: THREE.BoxGeometry;
  pillarMat: THREE.MeshLambertMaterial;
  cyanCoreMat: THREE.MeshBasicMaterial;
  magentaCapMat: THREE.MeshLambertMaterial;
}

export function createSharedObstacleResources(): SharedObstacleResources {
  return {
    pillarGeo: new THREE.BoxGeometry(
      GAME_CONFIG.gateWidthM,
      GAME_CONFIG.pillarHeightM,
      GAME_CONFIG.gateDepthM,
    ),
    coreGeo: new THREE.BoxGeometry(
      GAME_CONFIG.gateWidthM * 0.45,
      GAME_CONFIG.pillarHeightM + 0.05,
      GAME_CONFIG.gateDepthM * 1.08,
    ),
    capGeo: new THREE.BoxGeometry(
      GAME_CONFIG.gateWidthM * 1.28,
      0.42,
      GAME_CONFIG.gateDepthM * 1.28,
    ),
    pillarMat: new THREE.MeshLambertMaterial({
      color: 0xf1f5f9,
      emissive: 0x0f172a,
      emissiveIntensity: 0.05,
    }),
    cyanCoreMat: new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    }),
    magentaCapMat: new THREE.MeshLambertMaterial({
      color: 0xef4444,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.15,
    }),
  };
}

export function disposeSharedObstacleResources(res: SharedObstacleResources): void {
  res.pillarGeo.dispose();
  res.coreGeo.dispose();
  res.capGeo.dispose();
  res.pillarMat.dispose();
  res.cyanCoreMat.dispose();
  res.magentaCapMat.dispose();
}

export class ObstaclePair {
  readonly root = new THREE.Group();
  private readonly topGroup = new THREE.Group();
  private readonly bottomGroup = new THREE.Group();

  private readonly topBody: RAPIER.RigidBody;
  private readonly bottomBody: RAPIER.RigidBody;
  private readonly sensorBody: RAPIER.RigidBody;
  private readonly topCollider: RAPIER.Collider;
  private readonly bottomCollider: RAPIER.Collider;
  private readonly sensorCollider: RAPIER.Collider;

  readonly prevPos = new THREE.Vector3();
  readonly currPos = new THREE.Vector3();

  isActive = false;
  hasScored = false;
  gapHeightM: number = GAME_CONFIG.baseGapHeightM;
  baseCenterY = 0;
  oscillateAmpM = 0;
  oscillatePhaseRad = 0;

  constructor(
    readonly pairId: number,
    private readonly physics: PhysicsWorld,
    res: SharedObstacleResources,
  ) {
    const halfH = GAME_CONFIG.pillarHeightM * 0.5;

    const topPillar = new THREE.Mesh(res.pillarGeo, res.pillarMat);
    topPillar.castShadow = true;
    topPillar.receiveShadow = true;
    const topCore = new THREE.Mesh(res.coreGeo, res.cyanCoreMat);
    const topCap = new THREE.Mesh(res.capGeo, res.magentaCapMat);
    topCap.position.set(0, -halfH + 0.21, 0);
    topCap.castShadow = true;
    this.topGroup.add(topPillar, topCore, topCap);

    const bottomPillar = new THREE.Mesh(res.pillarGeo, res.pillarMat);
    bottomPillar.castShadow = true;
    bottomPillar.receiveShadow = true;
    const bottomCore = new THREE.Mesh(res.coreGeo, res.cyanCoreMat);
    const bottomCap = new THREE.Mesh(res.capGeo, res.magentaCapMat);
    bottomCap.position.set(0, halfH - 0.21, 0);
    bottomCap.castShadow = true;
    this.bottomGroup.add(bottomPillar, bottomCore, bottomCap);

    this.root.add(this.topGroup, this.bottomGroup);
    this.root.visible = false;

    const halfW = GAME_CONFIG.gateWidthM * 0.5;
    const halfD = GAME_CONFIG.gateDepthM * 0.5;

    this.topBody = physics.world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(OFFSTAGE_X, OFFSTAGE_Y, 0),
    );
    this.topCollider = physics.world.createCollider(
      RAPIER.ColliderDesc.cuboid(halfW, halfH, halfD).setCollisionGroups(ColliderFilter.OBSTACLE),
      this.topBody,
    );
    physics.registerCollider(this.topCollider, { tag: ColliderTag.Obstacle, pairId });

    this.bottomBody = physics.world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(OFFSTAGE_X, OFFSTAGE_Y, 0),
    );
    this.bottomCollider = physics.world.createCollider(
      RAPIER.ColliderDesc.cuboid(halfW, halfH, halfD).setCollisionGroups(ColliderFilter.OBSTACLE),
      this.bottomBody,
    );
    physics.registerCollider(this.bottomCollider, { tag: ColliderTag.Obstacle, pairId });

    this.sensorBody = physics.world.createRigidBody(
      RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(OFFSTAGE_X, OFFSTAGE_Y, 0),
    );
    this.sensorCollider = physics.world.createCollider(
      RAPIER.ColliderDesc.cuboid(0.15, GAME_CONFIG.baseGapHeightM * 0.5, halfD)
        .setSensor(true)
        .setCollisionGroups(ColliderFilter.SCORE_SENSOR),
      this.sensorBody,
    );
    physics.registerCollider(this.sensorCollider, { tag: ColliderTag.ScoreSensor, pairId });
  }

  spawn(
    x: number,
    centerY: number,
    gapHeightM: number,
    oscillateAmpM: number,
    phaseRad: number,
  ): void {
    this.isActive = true;
    this.hasScored = false;
    this.gapHeightM = gapHeightM;
    this.baseCenterY = centerY;
    this.oscillateAmpM = oscillateAmpM;
    this.oscillatePhaseRad = phaseRad;

    this.currPos.set(x, centerY, 0);
    this.prevPos.copy(this.currPos);

    const offset = gapHeightM * 0.5 + GAME_CONFIG.pillarHeightM * 0.5;
    this.topGroup.position.set(0, offset, 0);
    this.bottomGroup.position.set(0, -offset, 0);

    this.syncPhysicsImmediate(x, centerY, offset);
    this.root.position.copy(this.currPos);
    this.root.visible = true;
  }

  deactivate(): void {
    this.isActive = false;
    this.hasScored = false;
    this.root.visible = false;
    this.topBody.setTranslation({ x: OFFSTAGE_X, y: OFFSTAGE_Y, z: 0 }, true);
    this.bottomBody.setTranslation({ x: OFFSTAGE_X, y: OFFSTAGE_Y, z: 0 }, true);
    this.sensorBody.setTranslation({ x: OFFSTAGE_X, y: OFFSTAGE_Y, z: 0 }, true);
  }

  fixedUpdate(dtSec: number, scrollSpeedMps: number, elapsedSec: number): void {
    this.prevPos.copy(this.currPos);

    const nextX = this.currPos.x - scrollSpeedMps * dtSec;
    const nextY =
      this.baseCenterY +
      Math.sin(elapsedSec * GAME_CONFIG.oscillationSpeedRadPerSec + this.oscillatePhaseRad) *
        this.oscillateAmpM;

    this.currPos.set(nextX, nextY, 0);

    const offset = this.gapHeightM * 0.5 + GAME_CONFIG.pillarHeightM * 0.5;
    this.topBody.setNextKinematicTranslation({ x: nextX, y: nextY + offset, z: 0 });
    this.bottomBody.setNextKinematicTranslation({ x: nextX, y: nextY - offset, z: 0 });
    this.sensorBody.setNextKinematicTranslation({ x: nextX, y: nextY, z: 0 });
  }

  renderInterpolated(alpha: number): void {
    if (!this.isActive) return;
    this.root.position.lerpVectors(this.prevPos, this.currPos, alpha);
  }

  private syncPhysicsImmediate(x: number, centerY: number, offset: number): void {
    this.topBody.setTranslation({ x, y: centerY + offset, z: 0 }, true);
    this.topBody.setNextKinematicTranslation({ x, y: centerY + offset, z: 0 });
    this.bottomBody.setTranslation({ x, y: centerY - offset, z: 0 }, true);
    this.bottomBody.setNextKinematicTranslation({ x, y: centerY - offset, z: 0 });
    this.sensorBody.setTranslation({ x, y: centerY, z: 0 }, true);
    this.sensorBody.setNextKinematicTranslation({ x, y: centerY, z: 0 });
  }

  dispose(): void {
    this.physics.unregisterCollider(this.topCollider.handle);
    this.physics.unregisterCollider(this.bottomCollider.handle);
    this.physics.unregisterCollider(this.sensorCollider.handle);
  }
}
