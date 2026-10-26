import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';
import { GAME_CONFIG } from '../config/game-config';
import { PhysicsWorld } from '../../physics/physics-world';
import { ParticleEffects } from '../../render/effects';
import { SoundController } from '../../core/audio';

export type ProjectileType = 'standard' | 'cluster' | 'megaLaser';

interface ActiveBall {
  body: RAPIER.RigidBody;
  mesh: THREE.Mesh;
  type: ProjectileType;
  life: number;
  hasSplit?: boolean;
}

export class ProjectileManager {
  private activeBalls: ActiveBall[] = [];

  constructor(
    private readonly scene: THREE.Scene,
    private readonly physics: PhysicsWorld,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController
  ) {}

  public spawnBall(
    origin: THREE.Vector3,
    velocity: THREE.Vector3,
    type: ProjectileType = 'standard'
  ): void {
    let mass = GAME_CONFIG.projectiles.standard.mass;
    let radius = GAME_CONFIG.projectiles.standard.radius;
    let color = GAME_CONFIG.projectiles.standard.color;

    if (type === 'cluster') {
      mass = GAME_CONFIG.projectiles.cluster.mass;
      radius = GAME_CONFIG.projectiles.cluster.radius;
      color = GAME_CONFIG.projectiles.cluster.color;
    } else if (type === 'megaLaser') {
      mass = GAME_CONFIG.projectiles.megaLaser.mass;
      radius = GAME_CONFIG.projectiles.megaLaser.radius;
      color = GAME_CONFIG.projectiles.megaLaser.color;
    }

    // 1. Three.js Visual Mesh
    const geo = new THREE.SphereGeometry(radius, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.35,
      metalness: 0.6,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(origin);
    mesh.castShadow = true;
    this.scene.add(mesh);

    // 2. Rapier Rigid Body
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(origin.x, origin.y, origin.z)
      .setLinvel(velocity.x, velocity.y, velocity.z)
      .setAdditionalMass(mass)
      .setCcdEnabled(true); // Continuous collision detection prevents tunneling

    const body = this.physics.world.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.ball(radius)
      .setRestitution(0.4)
      .setFriction(0.6);

    this.physics.world.createCollider(colliderDesc, body);
    this.physics.registerMeta(body.handle, { type: 'projectile', id: type });

    this.activeBalls.push({
      body,
      mesh,
      type,
      life: 0,
      hasSplit: false,
    });
  }

  public update(dt: number, onTntTrigger?: (pos: THREE.Vector3) => void): void {
    const toRemove: ActiveBall[] = [];

    for (const ball of this.activeBalls) {
      ball.life += dt;
      const pos = ball.body.translation();

      // Sync visual mesh
      ball.mesh.position.set(pos.x, pos.y, pos.z);
      const rot = ball.body.rotation();
      ball.mesh.quaternion.set(rot.x, rot.y, rot.z, rot.w);

      // Check Cluster Bomb Mid-air / Impact split
      if (ball.type === 'cluster' && !ball.hasSplit && ball.life > 0.65) {
        ball.hasSplit = true;
        this.splitCluster(pos);
      }

      // Check below sea level
      if (pos.y < GAME_CONFIG.seaKillY) {
        this.particles.spawnWaterSplash(new THREE.Vector3(pos.x, 0, pos.z));
        this.audio.playWaterSplash();
        toRemove.push(ball);
      } else if (ball.life > 7.0) {
        // Despawn after settling
        toRemove.push(ball);
      }
    }

    void onTntTrigger;

    for (const ball of toRemove) {
      this.removeBall(ball);
    }
  }

  private splitCluster(pos: { x: number; y: number; z: number }): void {
    this.particles.spawnExplosion(new THREE.Vector3(pos.x, pos.y, pos.z), 0xf97316, 20);
    this.audio.playCannonFire(false);

    // Spawn 5 sub-munitions radiating outwards
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const subVel = new THREE.Vector3(
        Math.cos(angle) * 12,
        6 + Math.random() * 4,
        Math.sin(angle) * 12 - 10
      );
      this.spawnBall(new THREE.Vector3(pos.x, pos.y + 0.3, pos.z), subVel, 'standard');
    }
  }

  private removeBall(ball: ActiveBall): void {
    const idx = this.activeBalls.indexOf(ball);
    if (idx !== -1) {
      this.activeBalls.splice(idx, 1);
    }
    this.scene.remove(ball.mesh);
    ball.mesh.geometry.dispose();
    this.physics.removeMeta(ball.body.handle);
    this.physics.world.removeRigidBody(ball.body);
  }

  public get activeCount(): number {
    return this.activeBalls.length;
  }

  public clearAll(): void {
    for (const ball of this.activeBalls) {
      this.scene.remove(ball.mesh);
      ball.mesh.geometry.dispose();
      this.physics.removeMeta(ball.body.handle);
      this.physics.world.removeRigidBody(ball.body);
    }
    this.activeBalls = [];
  }
}
