import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { ColliderFilter, ColliderTag } from '../../physics/layers';
import type { PhysicsWorld } from '../../physics/physics-world';
import { disposeObject3D } from '../../render/dispose';
import { GAME_CONFIG } from '../config/game-config';

const _axisZ = new THREE.Vector3(0, 0, 1);

export class CyberDrone {
  readonly mesh = new THREE.Group();
  readonly body: RAPIER.RigidBody;
  readonly collider: RAPIER.Collider;

  readonly prevPos = new THREE.Vector3();
  readonly currPos = new THREE.Vector3();
  readonly prevRot = new THREE.Quaternion();
  readonly currRot = new THREE.Quaternion();

  velocityY = 0;
  private pitchRad = 0;
  private thrusterPulse = 0;
  private readonly thrusterCore: THREE.Mesh;
  private readonly haloRing: THREE.Mesh;

  constructor(private readonly physics: PhysicsWorld) {
    const hullGeo = new THREE.OctahedronGeometry(GAME_CONFIG.droneRadiusM, 1);
    hullGeo.scale(1.35, 0.72, 0.9);
    const hullMat = new THREE.MeshLambertMaterial({
      color: 0x162238,
      emissive: 0x051824,
    });
    const hullMesh = new THREE.Mesh(hullGeo, hullMat);

    const visorGeo = new THREE.BoxGeometry(0.55, 0.18, 0.62);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x00f3ff });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0.28, 0.08, 0);

    const wingGeo = new THREE.BoxGeometry(0.7, 0.08, 1.35);
    const wingMat = new THREE.MeshLambertMaterial({
      color: 0x221035,
      emissive: 0xff007f,
      emissiveIntensity: 0.45,
    });
    const wingMesh = new THREE.Mesh(wingGeo, wingMat);
    wingMesh.position.set(-0.08, 0, 0);

    const thrusterGeo = new THREE.ConeGeometry(0.24, 0.65, 8);
    thrusterGeo.rotateZ(Math.PI * 0.5);
    const thrusterMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.thrusterCore = new THREE.Mesh(thrusterGeo, thrusterMat);
    this.thrusterCore.position.set(-0.72, 0, 0);

    const ringGeo = new THREE.TorusGeometry(0.52, 0.04, 8, 20);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00f3ff,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.haloRing = new THREE.Mesh(ringGeo, ringMat);

    this.mesh.add(hullMesh, visorMesh, wingMesh, this.thrusterCore, this.haloRing);

    const bodyDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(
      GAME_CONFIG.droneStartX,
      GAME_CONFIG.droneStartY,
      0,
    );
    this.body = physics.world.createRigidBody(bodyDesc);

    const colliderDesc = RAPIER.ColliderDesc.ball(GAME_CONFIG.droneRadiusM * 0.85)
      .setCollisionGroups(ColliderFilter.DRONE)
      .setActiveCollisionTypes(RAPIER.ActiveCollisionTypes.ALL)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

    this.collider = physics.world.createCollider(colliderDesc, this.body);
    physics.registerCollider(this.collider, { tag: ColliderTag.Drone, pairId: -1 });

    this.reset();
  }

  reset(): void {
    this.velocityY = 0;
    this.pitchRad = 0;
    this.thrusterPulse = 0;
    this.currPos.set(GAME_CONFIG.droneStartX, GAME_CONFIG.droneStartY, 0);
    this.prevPos.copy(this.currPos);
    this.currRot.identity();
    this.prevRot.identity();
    this.body.setTranslation({ x: this.currPos.x, y: this.currPos.y, z: 0 }, true);
    this.body.setNextKinematicTranslation({ x: this.currPos.x, y: this.currPos.y, z: 0 });
    this.mesh.position.copy(this.currPos);
    this.mesh.quaternion.copy(this.currRot);
  }

  flap(): void {
    this.velocityY = GAME_CONFIG.flapVelocityMps;
    this.thrusterPulse = 1.0;
  }

  updateIdleHover(elapsedSec: number): void {
    this.prevPos.copy(this.currPos);
    this.prevRot.copy(this.currRot);

    const hoverY = GAME_CONFIG.droneStartY + Math.sin(elapsedSec * 3.2) * 0.45;
    this.currPos.set(GAME_CONFIG.droneStartX, hoverY, 0);
    this.pitchRad = Math.cos(elapsedSec * 3.2) * 0.12;
    this.currRot.setFromAxisAngle(_axisZ, this.pitchRad);

    this.body.setNextKinematicTranslation({ x: this.currPos.x, y: this.currPos.y, z: 0 });
  }

  fixedUpdate(dtSec: number): void {
    this.prevPos.copy(this.currPos);
    this.prevRot.copy(this.currRot);

    this.velocityY = Math.max(
      GAME_CONFIG.maxFallSpeedMps,
      this.velocityY + GAME_CONFIG.gravityMps2 * dtSec,
    );

    const nextY = THREE.MathUtils.clamp(
      this.currPos.y + this.velocityY * dtSec,
      GAME_CONFIG.floorY - 0.5,
      GAME_CONFIG.ceilingY + 0.5,
    );
    this.currPos.set(GAME_CONFIG.droneStartX, nextY, 0);

    const targetPitch =
      this.velocityY > 0
        ? GAME_CONFIG.maxClimbPitchRad
        : THREE.MathUtils.clamp(
            (this.velocityY / Math.abs(GAME_CONFIG.maxFallSpeedMps)) *
              Math.abs(GAME_CONFIG.maxDivePitchRad),
            GAME_CONFIG.maxDivePitchRad,
            0,
          );

    this.pitchRad = THREE.MathUtils.lerp(
      this.pitchRad,
      targetPitch,
      Math.min(1, dtSec * GAME_CONFIG.pitchLerpRate),
    );
    this.currRot.setFromAxisAngle(_axisZ, this.pitchRad);

    this.body.setNextKinematicTranslation({ x: this.currPos.x, y: this.currPos.y, z: 0 });
  }

  updateVisuals(dtSec: number): void {
    this.thrusterPulse = Math.max(0, this.thrusterPulse - dtSec * 4.5);
    const scaleX = 1.0 + this.thrusterPulse * 1.35 + Math.sin(performance.now() * 0.04) * 0.15;
    this.thrusterCore.scale.set(scaleX, 1 + this.thrusterPulse * 0.35, 1 + this.thrusterPulse * 0.35);
    this.haloRing.rotation.x += dtSec * 3.5;
    this.haloRing.rotation.y += dtSec * 2.1;
  }

  renderInterpolated(alpha: number): void {
    this.mesh.position.lerpVectors(this.prevPos, this.currPos, alpha);
    this.mesh.quaternion.slerpQuaternions(this.prevRot, this.currRot, alpha);
  }

  dispose(): void {
    this.physics.unregisterCollider(this.collider.handle);
    disposeObject3D(this.mesh);
  }
}
