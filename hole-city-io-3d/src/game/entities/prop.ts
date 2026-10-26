import * as THREE from 'three';
import { PropPrefabData } from '../../render/PrefabFactory';

export class Prop {
  public readonly group: THREE.Group;
  public readonly type: string;
  public readonly tier: number;
  public readonly radius: number;
  public readonly points: number;
  public readonly initialX: number;
  public readonly initialZ: number;
  public readonly initialRotY: number;

  public state: 'idle' | 'swallowing' | 'consumed' = 'idle';
  private targetHolePos = new THREE.Vector3();
  private swallowProgress = 0;
  private readonly swallowDuration = 0.22; // snappy 220ms swallow
  private initialScale = 1.0;
  private onSwallowedCallback: (() => void) | null = null;

  constructor(prefab: PropPrefabData, x: number, z: number, rotationY = 0) {
    this.group = prefab.group;
    this.type = prefab.type;
    this.tier = prefab.tier;
    this.radius = prefab.radius;
    this.points = prefab.points;
    this.initialX = x;
    this.initialZ = z;
    this.initialRotY = rotationY;

    this.group.position.set(x, 0, z);
    this.group.rotation.y = rotationY;
    this.initialScale = this.group.scale.x;
  }

  public get position(): THREE.Vector3 {
    return this.group.position;
  }

  public startSwallow(holeCenter: THREE.Vector3, onComplete: () => void): void {
    if (this.state !== 'idle') return;
    this.state = 'swallowing';
    this.targetHolePos.copy(holeCenter);
    this.onSwallowedCallback = onComplete;
    this.swallowProgress = 0;
  }

  public update(dt: number): void {
    if (this.state === 'swallowing') {
      this.swallowProgress += dt / this.swallowDuration;

      // Ease in toward hole center
      const t = Math.min(this.swallowProgress, 1.0);
      const easeT = t * t;

      this.group.position.x += (this.targetHolePos.x - this.group.position.x) * (dt * 14.0);
      this.group.position.z += (this.targetHolePos.z - this.group.position.z) * (dt * 14.0);
      this.group.position.y = -easeT * 1.6;

      // Tumble rotation
      this.group.rotation.x += dt * 8.0;
      this.group.rotation.z += dt * 6.0;

      // Scale shrink to 0
      const currentScale = Math.max(0, this.initialScale * (1.0 - t));
      this.group.scale.setScalar(currentScale);

      if (t >= 1.0) {
        this.state = 'consumed';
        this.group.visible = false;
        if (this.onSwallowedCallback) {
          this.onSwallowedCallback();
          this.onSwallowedCallback = null;
        }
      }
    }
  }

  public reset(x = this.initialX, z = this.initialZ): void {
    this.state = 'idle';
    this.group.position.set(x, 0, z);
    this.group.rotation.set(0, this.initialRotY, 0);
    this.group.scale.setScalar(this.initialScale);
    this.group.visible = true;
  }
}
