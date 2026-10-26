import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { PrefabFactory } from '../../render/PrefabFactory';
import { PhysicsWorld } from '../../physics/physics-world';
import { GAME_CONFIG } from '../config/game-config';

export class ContainerEntity {
  public readonly mesh: THREE.Group;
  private readonly dangerRing: THREE.Mesh;
  private dangerPulseTimer = 0;

  constructor(scene: THREE.Scene, physics: PhysicsWorld) {
    const cfg = GAME_CONFIG.container;
    const data = PrefabFactory.createContainer(cfg.innerRadius, cfg.height, cfg.dangerY);
    this.mesh = data.root;
    this.dangerRing = data.dangerRing;
    scene.add(this.mesh);

    // 1. Static Floor Collider in Rapier
    const floorBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, 0, 0);
    const floorBody = physics.world.createRigidBody(floorBodyDesc);
    const floorColliderDesc = RAPIER.ColliderDesc.cylinder(0.4, cfg.innerRadius + 0.5)
      .setFriction(0.65)
      .setRestitution(0.35);
    physics.world.createCollider(floorColliderDesc, floorBody);

    // 2. Segmented Wall Colliders (16 cuboids surrounding innerRadius)
    const wallSegments = 16;
    const wallHeight = cfg.height;
    const radius = cfg.innerRadius + 0.25;
    const segWidth = (2 * Math.PI * radius) / wallSegments + 0.2;

    for (let i = 0; i < wallSegments; i++) {
      const angle = (i / wallSegments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const wallBodyDesc = RAPIER.RigidBodyDesc.fixed()
        .setTranslation(x, wallHeight / 2, z)
        .setRotation({
          x: 0,
          y: Math.sin(-angle / 2),
          z: 0,
          w: Math.cos(-angle / 2),
        });

      const wallBody = physics.world.createRigidBody(wallBodyDesc);
      const wallColliderDesc = RAPIER.ColliderDesc.cuboid(0.3, wallHeight / 2, segWidth / 2)
        .setFriction(0.35)
        .setRestitution(0.38);

      physics.world.createCollider(wallColliderDesc, wallBody);
    }
  }

  public setDangerAlert(isDanger: boolean, dt: number): void {
    if (isDanger) {
      this.dangerPulseTimer += dt * 8.0;
      const opacity = 0.45 + (Math.sin(this.dangerPulseTimer) + 1) * 0.25;
      (this.dangerRing.material as THREE.MeshBasicMaterial).opacity = opacity;
    } else {
      this.dangerPulseTimer = 0;
      (this.dangerRing.material as THREE.MeshBasicMaterial).opacity = 0.35;
    }
  }
}
