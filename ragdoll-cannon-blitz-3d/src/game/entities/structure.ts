import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { BlockSpec, TntSpec } from '../levels/level-data';
import { PhysicsWorld } from '../../physics/physics-world';
import { PrefabFactory } from '../../render/PrefabFactory';
import { ParticleEffects } from '../../render/effects';
import { SoundController } from '../../core/audio';
import { CameraRig } from '../../render/camera-rig';
import { GAME_CONFIG } from '../config/game-config';

interface StructureItem {
  body: RAPIER.RigidBody;
  mesh: THREE.Object3D;
  isTnt: boolean;
  exploded?: boolean;
}

export class StructureManager {
  private items: StructureItem[] = [];
  private pendingTntQueue: StructureItem[] = [];

  constructor(
    private readonly scene: THREE.Scene,
    private readonly physics: PhysicsWorld,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController,
    private readonly cameraRig: CameraRig
  ) {}

  public buildLevel(blocks: BlockSpec[], tntList: TntSpec[]): void {
    this.clear();

    // 1. Spawn Structural Blocks
    for (const b of blocks) {
      const mesh = PrefabFactory.createBlock(b.size[0], b.size[1], b.size[2], b.material);
      mesh.position.set(b.pos[0], b.pos[1], b.pos[2]);
      this.scene.add(mesh);

      const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(b.pos[0], b.pos[1], b.pos[2])
        .setLinearDamping(0.2)
        .setAngularDamping(0.2);

      const body = this.physics.world.createRigidBody(bodyDesc);
      const colliderDesc = RAPIER.ColliderDesc.cuboid(b.size[0], b.size[1], b.size[2])
        .setRestitution(b.material === 'wood' ? 0.35 : 0.15)
        .setFriction(b.material === 'ice' ? 0.05 : 0.65);

      this.physics.world.createCollider(colliderDesc, body);
      this.physics.registerMeta(body.handle, { type: 'structure', id: b.material });

      this.items.push({ body, mesh, isTnt: false });
    }

    // 2. Spawn TNT Barrels
    for (const t of tntList) {
      const mesh = PrefabFactory.createTntBarrel();
      mesh.position.set(t.pos[0], t.pos[1], t.pos[2]);
      this.scene.add(mesh);

      const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(t.pos[0], t.pos[1], t.pos[2])
        .setLinearDamping(0.3)
        .setAngularDamping(0.3);

      const body = this.physics.world.createRigidBody(bodyDesc);
      const colliderDesc = RAPIER.ColliderDesc.cylinder(0.8, 0.65)
        .setRestitution(0.25)
        .setFriction(0.6);

      this.physics.world.createCollider(colliderDesc, body);
      this.physics.registerMeta(body.handle, { type: 'tnt', id: 'barrel' });

      this.items.push({ body, mesh, isTnt: true });
    }
  }

  public triggerTntByHandle(handle: number): void {
    const item = this.items.find((i) => i.body.handle === handle && i.isTnt && !i.exploded);
    if (item) {
      this.detonateTnt(item);
    }
  }

  public detonateTnt(item: StructureItem): void {
    if (item.exploded) return;
    item.exploded = true;

    const pos = item.body.translation();
    const vecPos = new THREE.Vector3(pos.x, pos.y, pos.z);

    // Audio & Visual Effects
    this.audio.playTntExplosion();
    this.particles.spawnExplosion(vecPos, 0xef4444, 35);
    this.cameraRig.triggerSlowMoDestruct(0.4);

    // Apply Radial Physics Impulse
    const cfg = GAME_CONFIG.explosions;
    this.physics.applyRadialImpulse(vecPos, cfg.tntRadius, cfg.tntImpulse, 0.45);

    // Remove Visual Mesh & Rigid Body
    this.scene.remove(item.mesh);
    this.physics.removeMeta(item.body.handle);
    this.physics.world.removeRigidBody(item.body);

    const idx = this.items.indexOf(item);
    if (idx !== -1) {
      this.items.splice(idx, 1);
    }

    // Check chain reactions for other TNT nearby
    for (const other of this.items) {
      if (other.isTnt && !other.exploded) {
        const oPos = other.body.translation();
        const dist = Math.hypot(oPos.x - pos.x, oPos.y - pos.y, oPos.z - pos.z);
        if (dist <= cfg.tntRadius * 0.75) {
          this.pendingTntQueue.push(other);
        }
      }
    }
  }

  public update(dt: number): void {
    // Process chain reactions with subtle delay for dramatic flair
    if (this.pendingTntQueue.length > 0) {
      const nextTnt = this.pendingTntQueue.shift()!;
      this.detonateTnt(nextTnt);
    }

    // Sync meshes to rigid bodies
    for (const item of this.items) {
      if (item.exploded) continue;

      const pos = item.body.translation();
      const rot = item.body.rotation();

      item.mesh.position.set(pos.x, pos.y, pos.z);
      item.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

      // Despawn if fallen into sea
      if (pos.y < GAME_CONFIG.seaKillY - 2.0) {
        this.scene.remove(item.mesh);
      }
    }

    void dt;
  }

  public clear(): void {
    for (const item of this.items) {
      this.scene.remove(item.mesh);
      this.physics.removeMeta(item.body.handle);
      try {
        this.physics.world.removeRigidBody(item.body);
      } catch {
        // Body might have already been removed
      }
    }
    this.items = [];
    this.pendingTntQueue = [];
  }
}
