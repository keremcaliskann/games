import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';
import { PhysicsWorld } from '../../physics/physics-world';
import { SphereItem } from '../entities/sphere-item';
import { TIER_DEFINITIONS } from '../../render/PrefabFactory';
import { SoundController } from '../../core/audio';
import { ParticleEffects } from '../../render/effects';
import { CameraRig } from '../../render/camera-rig';
import { GAME_CONFIG } from '../config/game-config';

interface MergePair {
  itemA: SphereItem;
  itemB: SphereItem;
  targetTier: number;
  midpoint: THREE.Vector3;
}

export class MergeSystem {
  private spheres: SphereItem[] = [];
  private pendingMerges: MergePair[] = [];
  private sphereIdCounter = 0;
  private totalMerges = 0;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly physics: PhysicsWorld,
    private readonly audio: SoundController,
    private readonly particles: ParticleEffects,
    private readonly cameraRig: CameraRig
  ) {}

  public get mergeCount(): number {
    return this.totalMerges;
  }

  public spawnSphere(x: number, y: number, z: number, tier: number, isBomb: boolean = false, isRainbow: boolean = false): SphereItem {
    const def = TIER_DEFINITIONS[tier - 1] || TIER_DEFINITIONS[0];
    const radius = isBomb ? 0.85 : (isRainbow ? 0.85 : def.radius);
    const mass = isBomb ? 4.0 : (isRainbow ? 2.5 : def.mass);

    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x, y, z)
      .setAdditionalMass(mass)
      .setLinearDamping(0.2)
      .setAngularDamping(0.3)
      .setCcdEnabled(true);

    const body = this.physics.world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.ball(radius)
      .setRestitution(0.38)
      .setFriction(0.45)
      .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);

    this.physics.world.createCollider(colliderDesc, body);

    const id = `sphere_${++this.sphereIdCounter}`;
    this.physics.registerMeta(body.handle, { id, tier, isBomb, isRainbow });

    const item = new SphereItem(id, tier, body, isBomb, isRainbow);
    this.scene.add(item.mesh);
    this.spheres.push(item);

    return item;
  }

  public handleContact(h1: number, h2: number, onMergePoints?: (points: number, newTier: number) => void): void {
    const meta1 = this.physics.getMeta(h1);
    const meta2 = this.physics.getMeta(h2);

    if (!meta1 || !meta2) return;

    const item1 = this.spheres.find((s) => s.id === meta1.id);
    const item2 = this.spheres.find((s) => s.id === meta2.id);

    if (!item1 || !item2 || item1.isMerging || item2.isMerging) return;

    // 1. Bomb Contact
    if (item1.isBomb || item2.isBomb) {
      const bomb = item1.isBomb ? item1 : item2;
      this.detonateBomb(bomb);
      return;
    }

    // 2. Fruit Sphere Contact: Check Same Tier Match or Rainbow Wildcard
    const isRainbowContact = item1.isRainbow || item2.isRainbow;
    if ((item1.tier === item2.tier || isRainbowContact) && Math.min(item1.tier, item2.tier) < TIER_DEFINITIONS.length) {
      item1.isMerging = true;
      item2.isMerging = true;
      this.totalMerges++;

      const p1 = item1.body.translation();
      const p2 = item2.body.translation();
      const midpoint = new THREE.Vector3((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, (p1.z + p2.z) / 2);

      const targetTier = isRainbowContact
        ? Math.min(TIER_DEFINITIONS.length, (item1.isRainbow ? item2.tier : item1.tier) + 1)
        : item1.tier + 1;

      this.pendingMerges.push({ itemA: item1, itemB: item2, targetTier, midpoint });

      const points = (TIER_DEFINITIONS[targetTier - 1]?.points || 10) * (isRainbowContact ? 2 : 1);
      if (onMergePoints) {
        onMergePoints(points, targetTier);
      }
    } else {
      this.audio.playBounce();
    }
  }

  private detonateBomb(bomb: SphereItem): void {
    const pos = bomb.body.translation();
    const vecPos = new THREE.Vector3(pos.x, pos.y, pos.z);

    this.audio.playBombExplosion();
    this.particles.spawnBombExplosion(vecPos);
    this.cameraRig.addTrauma(0.5);

    // Apply Radial Physics Blast
    const cfg = GAME_CONFIG.boosters;
    this.physics.applyRadialImpulse(vecPos, cfg.bombRadius, cfg.bombImpulse, 0.5);

    // Vaporize lower tier spheres within radius
    const toVaporize = this.spheres.filter((s) => {
      if (s === bomb) return true;
      const sp = s.body.translation();
      const dist = Math.hypot(sp.x - pos.x, sp.y - pos.y, sp.z - pos.z);
      return dist <= cfg.bombRadius * 0.75 && s.tier <= 4;
    });

    for (const s of toVaporize) {
      this.removeSphere(s);
    }
  }

  public update(dt: number): void {
    // Process pending merges
    while (this.pendingMerges.length > 0) {
      const merge = this.pendingMerges.shift()!;
      this.removeSphere(merge.itemA);
      this.removeSphere(merge.itemB);

      // Spawn upgraded tier
      const upgraded = this.spawnSphere(
        merge.midpoint.x,
        merge.midpoint.y,
        merge.midpoint.z,
        merge.targetTier,
        false
      );
      upgraded.triggerSquash();

      // Audio & Particle Effects
      this.audio.playMerge(merge.targetTier);
      const def = TIER_DEFINITIONS[merge.targetTier - 1];
      this.particles.spawnMergeBurst(merge.midpoint, def ? def.color : 0xfef08a, 24);
      this.cameraRig.addTrauma(0.12);

      // Micro impulse to nearby spheres
      this.physics.applyRadialImpulse(merge.midpoint, 2.5, 8.0, 0.2);
    }

    // Sync meshes to rigid bodies
    for (const sphere of this.spheres) {
      sphere.update(dt);
    }
  }

  public removeSphere(sphere: SphereItem): void {
    const idx = this.spheres.indexOf(sphere);
    if (idx !== -1) {
      this.spheres.splice(idx, 1);
    }

    this.scene.remove(sphere.mesh);
    this.physics.removeMeta(sphere.body.handle);
    try {
      this.physics.world.removeRigidBody(sphere.body);
    } catch {
      // Ignored
    }
  }

  public getHighestY(): number {
    let highest = 0;
    for (const s of this.spheres) {
      if (s.age < 0.9 || s.isMerging) continue;
      const y = s.body.translation().y + s.def.radius;
      if (y > highest) {
        highest = y;
      }
    }
    return highest;
  }

  public vaporizeTopSpheres(count: number = 3): void {
    // Sort descending by Y translation
    const sorted = [...this.spheres].sort((a, b) => b.body.translation().y - a.body.translation().y);
    const toRemove = sorted.slice(0, count);

    for (const s of toRemove) {
      const pos = s.body.translation();
      this.particles.spawnMergeBurst(new THREE.Vector3(pos.x, pos.y, pos.z), 0xef4444, 25);
      this.removeSphere(s);
    }
    this.audio.playBombExplosion();
  }

  public clear(): void {
    for (const s of this.spheres) {
      this.scene.remove(s.mesh);
      this.physics.removeMeta(s.body.handle);
      try {
        this.physics.world.removeRigidBody(s.body);
      } catch {
        // Ignored
      }
    }
    this.spheres = [];
    this.pendingMerges = [];
    this.totalMerges = 0;
  }
}
