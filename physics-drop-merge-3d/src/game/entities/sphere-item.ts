import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { PrefabFactory, TIER_DEFINITIONS, TierVisualDef } from '../../render/PrefabFactory';

export class SphereItem {
  public readonly mesh: THREE.Group;
  public readonly def: TierVisualDef;
  public isMerging = false;
  public isBomb: boolean;
  public isRainbow: boolean;
  public age = 0;

  private squashTimer = 0;

  constructor(
    public readonly id: string,
    public readonly tier: number,
    public readonly body: RAPIER.RigidBody,
    isBomb: boolean = false,
    isRainbow: boolean = false
  ) {
    this.isBomb = isBomb;
    this.isRainbow = isRainbow;
    this.def = TIER_DEFINITIONS[tier - 1] || TIER_DEFINITIONS[0];

    if (isBomb) {
      this.mesh = PrefabFactory.createBombMesh(0.85);
    } else if (isRainbow) {
      this.mesh = PrefabFactory.createRainbowMesh(0.85);
    } else {
      this.mesh = PrefabFactory.createSphereMesh(this.def);
    }

    const pos = body.translation();
    this.mesh.position.set(pos.x, pos.y, pos.z);
  }

  public triggerSquash(): void {
    this.squashTimer = 0.18;
  }

  public update(dt: number): void {
    this.age += dt;
    const pos = this.body.translation();
    const rot = this.body.rotation();

    this.mesh.position.set(pos.x, pos.y, pos.z);
    this.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

    if (this.squashTimer > 0) {
      this.squashTimer = Math.max(0, this.squashTimer - dt);
      const s = 1.0 + Math.sin(this.squashTimer * 30.0) * 0.18;
      this.mesh.scale.set(s, 2.0 - s, s);
    } else {
      this.mesh.scale.setScalar(1.0);
    }
  }
}
