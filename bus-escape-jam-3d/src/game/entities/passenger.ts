import * as THREE from 'three';
import { VehicleColorDef } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export class PassengerEntity {
  public readonly id: string;
  public readonly colorDef: VehicleColorDef;
  public readonly root: THREE.Group;

  public isMoving = false;
  public isBoarding = false;
  private animStart = new THREE.Vector3();
  private animTarget = new THREE.Vector3();
  private animProgress = 0;
  private animDuration = 0.22;
  private onFinish?: () => void;
  private hopHeight = 0.4;

  constructor(id: string, colorDef: VehicleColorDef, startPos: THREE.Vector3) {
    this.id = id;
    this.colorDef = colorDef;
    this.root = PrefabFactory.createPassengerPawn(colorDef);
    this.root.position.copy(startPos);
  }

  public moveTo(targetPos: THREE.Vector3, duration = 0.22, hop = 0.4, onFinish?: () => void): void {
    this.isMoving = true;
    this.animStart.copy(this.root.position);
    this.animTarget.copy(targetPos);
    this.animProgress = 0;
    this.animDuration = duration;
    this.hopHeight = hop;
    this.onFinish = onFinish;
  }

  public boardBus(busPos: THREE.Vector3, onComplete: () => void): void {
    this.isBoarding = true;
    const target = busPos.clone().add(new THREE.Vector3(0, 0.6, 0));
    this.moveTo(target, 0.28, 1.2, onComplete);
  }

  public update(dt: number): void {
    if (this.isMoving) {
      this.animProgress += dt / this.animDuration;
      const t = Math.min(1.0, this.animProgress);

      this.root.position.lerpVectors(this.animStart, this.animTarget, t);
      this.root.position.y += Math.sin(t * Math.PI) * this.hopHeight;

      if (t >= 1.0) {
        this.isMoving = false;
        this.root.position.copy(this.animTarget);
        this.onFinish?.();
      }
    }
  }
}
