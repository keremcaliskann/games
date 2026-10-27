import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { TargetSpec } from '../levels/level-data';
import { PhysicsWorld } from '../../physics/physics-world';
import { PrefabFactory } from '../../render/PrefabFactory';
import { ParticleEffects } from '../../render/effects';
import { SoundController } from '../../core/audio';
import { GAME_CONFIG } from '../config/game-config';

const _SPLASH_POS = new THREE.Vector3();

interface TargetItem {
  body: RAPIER.RigidBody;
  mesh: THREE.Group;
  eliminated: boolean;
  spawnPos: THREE.Vector3;
}

export class TargetDummyManager {
  private dummies: TargetItem[] = [];

  constructor(
    private readonly scene: THREE.Scene,
    private readonly physics: PhysicsWorld,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController
  ) {}

  public buildTargets(targetSpecs: TargetSpec[]): void {
    this.clear();

    for (const spec of targetSpecs) {
      const mesh = PrefabFactory.createTargetDummy();
      mesh.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
      this.scene.add(mesh);

      // Rapier rigid body with capsule collider
      const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(spec.pos[0], spec.pos[1], spec.pos[2])
        .setLinearDamping(0.25)
        .setAngularDamping(0.35)
        .setAdditionalMass(5.0);

      const body = this.physics.world.createRigidBody(bodyDesc);
      const colliderDesc = RAPIER.ColliderDesc.capsule(0.45, 0.4)
        .setRestitution(0.3)
        .setFriction(0.65);

      this.physics.world.createCollider(colliderDesc, body);
      this.physics.registerMeta(body.handle, { type: 'target', id: 'dummy' });

      this.dummies.push({
        body,
        mesh,
        eliminated: false,
        spawnPos: new THREE.Vector3(spec.pos[0], spec.pos[1], spec.pos[2]),
      });
    }
  }

  public update(dt: number, onTargetEliminated?: (remaining: number) => void): void {
    for (const d of this.dummies) {
      if (d.eliminated) continue;

      const pos = d.body.translation();
      const rot = d.body.rotation();

      d.mesh.position.set(pos.x, pos.y, pos.z);
      d.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

      // Check elimination criteria:
      // 1. Fallen into water below sea level
      // 2. Knocked far off island perimeter (radial distance > 14 from island center [0, 0, -4])
      const distFromIsland = Math.hypot(pos.x, pos.z - (-4));
      if (pos.y < GAME_CONFIG.seaKillY || (distFromIsland > 13.5 && pos.y < 1.0)) {
        d.eliminated = true;
        _SPLASH_POS.set(pos.x, 0, pos.z);
        this.particles.spawnWaterSplash(_SPLASH_POS);
        this.audio.playWaterSplash();
        this.audio.playTargetSqueak();

        if (onTargetEliminated) {
          onTargetEliminated(this.remainingCount);
        }
      }
    }

    void dt;
  }

  public get remainingCount(): number {
    return this.dummies.filter((d) => !d.eliminated).length;
  }

  public get totalCount(): number {
    return this.dummies.length;
  }

  public clear(): void {
    for (const d of this.dummies) {
      this.scene.remove(d.mesh);
      this.physics.removeMeta(d.body.handle);
      try {
        this.physics.world.removeRigidBody(d.body);
      } catch {
        // Ignored
      }
    }
    this.dummies = [];
  }
}
