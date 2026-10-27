import * as THREE from 'three';
import { VehicleColorDef } from '../config/game-config';
import { PrefabFactory } from '../../render/PrefabFactory';

export type BusOrientation = 'N' | 'S' | 'E' | 'W';

export interface GridCoord {
  col: number;
  row: number;
}

export class BusEntity {
  public readonly id: string;
  public readonly colorDef: VehicleColorDef;
  public readonly capacity: number;
  public readonly lengthTiles: number;
  public orientation: BusOrientation;
  public tiles: GridCoord[] = [];
  public currentPassengers = 0;

  public readonly root: THREE.Group;
  private readonly badgeSprite: THREE.Sprite;

  // Animation states
  public isDriving = false;
  public isDeparting = false;
  public isHeloFlying = false;
  public isDocked = false;
  public dockedBayIndex = -1;

  private animStart = new THREE.Vector3();
  private animTarget = new THREE.Vector3();
  private animProgress = 0;
  private animDuration = 0.35;
  private startRotY = 0;
  private targetRotY = 0;
  private alignRotation = false;
  private onAnimFinish?: () => void;
  private shakeTimer = 0;

  constructor(
    id: string,
    colorDef: VehicleColorDef,
    lengthTiles: number,
    orientation: BusOrientation,
    tiles: GridCoord[],
    worldPos: THREE.Vector3
  ) {
    this.id = id;
    this.colorDef = colorDef;
    this.lengthTiles = lengthTiles;
    this.orientation = orientation;
    this.tiles = tiles;
    this.capacity = lengthTiles === 2 ? 4 : 6;

    const data = PrefabFactory.createBusMesh(lengthTiles, colorDef, this.capacity);
    this.root = data.root;
    this.badgeSprite = data.badgeSprite;

    this.root.position.copy(worldPos);
    this.applyOrientationRotation();
  }

  private applyOrientationRotation(): void {
    switch (this.orientation) {
      case 'N':
        this.root.rotation.y = 0; // facing -Z
        break;
      case 'S':
        this.root.rotation.y = Math.PI; // facing +Z
        break;
      case 'E':
        this.root.rotation.y = -Math.PI * 0.5; // facing +X
        break;
      case 'W':
        this.root.rotation.y = Math.PI * 0.5; // facing -X
        break;
    }
  }

  public get isFull(): boolean {
    return this.currentPassengers >= this.capacity;
  }

  public addPassenger(): void {
    this.currentPassengers++;
    const tex = PrefabFactory.getSeatBadgeTexture(
      this.currentPassengers,
      this.capacity,
      this.colorDef.hex
    );
    this.badgeSprite.material.map = tex;
    this.badgeSprite.material.needsUpdate = true;

    // Happy bounce
    this.root.position.y += 0.2;
  }

  public triggerBlockedShake(): void {
    this.shakeTimer = 0.25;
  }

  public driveTo(
    targetPos: THREE.Vector3,
    duration = 0.35,
    onFinish?: () => void,
    alignToBay = false
  ): void {
    this.isDriving = true;
    this.animStart.copy(this.root.position);
    this.animTarget.copy(targetPos);
    this.animProgress = 0;
    this.animDuration = duration;
    this.alignRotation = alignToBay;
    this.startRotY = this.root.rotation.y;
    this.targetRotY = 0;
    this.onAnimFinish = onFinish;
  }

  public flyHeloTo(
    targetPos: THREE.Vector3,
    duration = 0.7,
    onFinish?: () => void,
    alignToBay = true
  ): void {
    this.isHeloFlying = true;
    this.animStart.copy(this.root.position);
    this.animTarget.copy(targetPos);
    this.animProgress = 0;
    this.animDuration = duration;
    this.alignRotation = alignToBay;
    this.startRotY = this.root.rotation.y;
    this.targetRotY = 0;
    this.onAnimFinish = onFinish;
  }

  public update(dt: number): void {
    // Shake dampening
    if (this.shakeTimer > 0) {
      this.shakeTimer = Math.max(0, this.shakeTimer - dt);
      const s = Math.sin(this.shakeTimer * 45) * 0.12;
      this.root.rotation.z = s;
    } else if (!this.isDriving && !this.isHeloFlying) {
      this.root.rotation.z = 0;
    }

    // Suspension recover
    if (this.root.position.y > 0 && !this.isDriving && !this.isHeloFlying) {
      this.root.position.y = Math.max(0, this.root.position.y - dt * 2.0);
    }

    // Linear driving animation
    if (this.isDriving) {
      this.animProgress += dt / this.animDuration;
      const t = Math.min(1.0, this.animProgress);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - t, 3);
      this.root.position.lerpVectors(this.animStart, this.animTarget, ease);
      if (this.alignRotation) {
        this.root.rotation.y = THREE.MathUtils.lerp(this.startRotY, this.targetRotY, ease);
      }

      // Slight suspension dip on motion
      this.root.rotation.x = Math.sin(t * Math.PI) * 0.08;

      if (t >= 1.0) {
        this.isDriving = false;
        this.root.position.copy(this.animTarget);
        this.root.rotation.x = 0;
        if (this.alignRotation) {
          this.root.rotation.y = this.targetRotY;
        }
        const cb = this.onAnimFinish;
        this.onAnimFinish = undefined;
        cb?.();
      }
    }

    // Helicopter lift arc
    if (this.isHeloFlying) {
      this.animProgress += dt / this.animDuration;
      const t = Math.min(1.0, this.animProgress);
      this.root.position.lerpVectors(this.animStart, this.animTarget, t);
      this.root.position.y += Math.sin(t * Math.PI) * 4.5; // High arc
      if (this.alignRotation) {
        this.root.rotation.y = THREE.MathUtils.lerp(this.startRotY, this.targetRotY, t);
      }

      if (t >= 1.0) {
        this.isHeloFlying = false;
        this.root.position.copy(this.animTarget);
        if (this.alignRotation) {
          this.root.rotation.y = this.targetRotY;
        }
        const cb = this.onAnimFinish;
        this.onAnimFinish = undefined;
        cb?.();
      }
    }
  }
}
