import * as THREE from 'three';
import { ColorDef, GAME_CONFIG } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export type ScrewState = 'idle' | 'unscrewing' | 'flying' | 'parked' | 'cleared';

export class Screw {
  public readonly id: string;
  public readonly color: ColorDef;
  public state: ScrewState = 'idle';

  public readonly group: THREE.Group;
  public readonly headMesh: THREE.Mesh;
  public readonly shaftMesh: THREE.Mesh;

  // Animation trajectories
  private animTimer = 0;
  private animDuration = 0.28;
  private startPos = new THREE.Vector3();
  private midPos = new THREE.Vector3();
  private targetPos = new THREE.Vector3();
  private onCompleteCallback: (() => void) | null = null;

  constructor(id: string, color: ColorDef, position: THREE.Vector3, orientation: THREE.Quaternion) {
    this.id = id;
    this.color = color;

    const { group, headMesh, shaftMesh } = PrefabFactory.createScrewMesh(color);
    this.group = group;
    this.headMesh = headMesh;
    this.shaftMesh = shaftMesh;

    this.group.position.copy(position);
    this.group.quaternion.copy(orientation);

    // Attach reference for raycasting
    this.headMesh.userData = { screw: this };
    this.shaftMesh.userData = { screw: this };
  }

  /**
   * Starts unscrewing spin and flight trajectory to target
   */
  public startUnscrewAndFly(targetWorldPos: THREE.Vector3, onComplete: () => void): void {
    if (this.state !== 'idle' && this.state !== 'parked') return;
    const fromParked = this.state === 'parked';
    this.state = fromParked ? 'flying' : 'unscrewing';
    this.onCompleteCallback = onComplete;
    this.animTimer = 0;
    this.animDuration = fromParked ? 0.32 : 0.42;

    this.startPos.copy(this.group.position);
    this.targetPos.copy(targetWorldPos);

    // Arc midpoint elevated outwards toward camera (+Z) and upward (+Y)
    this.midPos.copy(this.startPos).lerp(targetWorldPos, 0.5);
    this.midPos.y += 1.6;
    this.midPos.z += 1.2;
  }

  public update(dt: number): void {
    if (this.state === 'unscrewing' || this.state === 'flying') {
      this.animTimer += dt;
      const t = Math.min(1.0, this.animTimer / this.animDuration);

      if (this.state === 'unscrewing' && t < 0.25) {
        // Unscrewing spiral extraction along +Z out of plate hole
        const liftT = t / 0.25;
        this.group.rotation.z -= dt * 36;
        this.group.position.z = this.startPos.z + liftT * (GAME_CONFIG.screwShaftLength * 1.1);
      } else {
        // Quadratic bezier arc to destination
        const flyT = this.state === 'unscrewing' ? (t - 0.25) / 0.75 : t;
        const ease = flyT * (2 - flyT); // ease-out quad

        const p0 = this.startPos;
        const p1 = this.midPos;
        const p2 = this.targetPos;

        // B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        const omt = 1 - ease;
        this.group.position.x = omt * omt * p0.x + 2 * omt * ease * p1.x + ease * ease * p2.x;
        this.group.position.y = omt * omt * p0.y + 2 * omt * ease * p1.y + ease * ease * p2.y;
        this.group.position.z = omt * omt * p0.z + 2 * omt * ease * p1.z + ease * ease * p2.z;

        // Smooth spin
        this.group.rotation.z -= dt * 18;
      }

      if (t >= 1.0) {
        this.group.position.copy(this.targetPos);
        this.group.rotation.set(0, 0, 0);
        const cb = this.onCompleteCallback;
        this.onCompleteCallback = null;
        cb?.();
      }
    }
  }

  public triggerWiggle(): void {
    if (this.state !== 'idle') return;
    const startX = this.group.position.x;
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 0.03;
      this.group.position.x = startX + Math.sin(elapsed * 45) * 0.09;
      if (elapsed > 0.18) {
        clearInterval(interval);
        this.group.position.x = startX;
      }
    }, 30);
  }

  public dispose(): void {
    // Do NOT dispose shared geometries from PrefabFactory; only dispose per-instance materials
    this.group.traverse((c) => {
      const mat = (c as THREE.Mesh).material;
      if (mat) {
        if (Array.isArray(mat)) {
          mat.forEach((m) => m.dispose());
        } else {
          mat.dispose();
        }
      }
    });
  }
}
