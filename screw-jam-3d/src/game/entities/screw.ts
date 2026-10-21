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
    if (this.state !== 'idle') return;
    this.state = 'unscrewing';
    this.onCompleteCallback = onComplete;
    this.animTimer = 0;
    this.animDuration = 0.42;

    this.startPos.copy(this.group.position);
    this.targetPos.copy(targetWorldPos);

    // Arc midpoint elevated outwards along normal
    this.midPos.copy(this.startPos).lerp(targetWorldPos, 0.5);
    this.midPos.y += 2.0;
  }

  public update(dt: number): void {
    if (this.state === 'unscrewing' || this.state === 'flying') {
      this.animTimer += dt;
      const t = Math.min(1.0, this.animTimer / this.animDuration);

      if (t < 0.25) {
        // Unscrewing spiral lift
        const liftT = t / 0.25;
        this.group.rotation.y += dt * 36;
        this.group.position.y = this.startPos.y + liftT * (GAME_CONFIG.screwShaftLength * 1.2);
      } else {
        // Quadratic bezier arc to destination
        const flyT = (t - 0.25) / 0.75;
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
        this.group.rotation.y += dt * 18;
      }

      if (t >= 1.0) {
        this.group.position.copy(this.targetPos);
        const cb = this.onCompleteCallback;
        this.onCompleteCallback = null;
        cb?.();
      }
    }
  }

  public triggerWiggle(): void {
    if (this.state !== 'idle') return;
    const startY = this.group.position.y;
    let elapsed = 0;
    const interval = setInterval(() => {
      elapsed += 0.03;
      this.group.position.y = startY + Math.sin(elapsed * 40) * 0.08;
      if (elapsed > 0.18) {
        clearInterval(interval);
        this.group.position.y = startY;
      }
    }, 30);
  }

  public dispose(): void {
    this.group.traverse((c) => {
      if ((c as THREE.Mesh).geometry) {
        (c as THREE.Mesh).geometry.dispose();
      }
    });
  }
}
