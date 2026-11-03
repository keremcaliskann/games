import * as THREE from 'three';

/**
 * Genre-Agnostic Zero-Allocation Object Pool & Scene Lifecycle Tracker (shared/core/object-pool.ts)
 * Guarantees temporary 3D meshes, effects, and pooled entities are always removed/hidden on expiry or reset.
 */
export class ObjectPool<T> {
  private readonly freeList: T[] = [];
  private readonly activeList: T[] = [];
  private readonly factory: () => T;
  private readonly onReset?: (item: T) => void;

  constructor(factory: () => T, initialCapacity = 16, onReset?: (item: T) => void) {
    this.factory = factory;
    this.onReset = onReset;
    for (let i = 0; i < initialCapacity; i++) {
      this.freeList.push(this.factory());
    }
  }

  public acquire(): T {
    const item = this.freeList.length > 0 ? this.freeList.pop()! : this.factory();
    this.activeList.push(item);
    return item;
  }

  public release(item: T): void {
    const idx = this.activeList.indexOf(item);
    if (idx !== -1) {
      const last = this.activeList.pop()!;
      if (idx < this.activeList.length) {
        this.activeList[idx] = last;
      }
    }
    this.onReset?.(item);
    this.freeList.push(item);
  }

  public releaseAll(): void {
    while (this.activeList.length > 0) {
      const item = this.activeList.pop()!;
      this.onReset?.(item);
      this.freeList.push(item);
    }
  }

  public get activeItems(): readonly T[] {
    return this.activeList;
  }
}

interface TimedSceneObject {
  object: THREE.Object3D;
  remainingSec: number;
  totalSec: number;
  fadeOut: boolean;
}

/**
 * Tracks temporary scene objects (debris, popups, burst meshes, destroyed entities)
 * and guarantees 100% removal from the THREE.Scene when their lifetime expires or on reset.
 */
export class SceneDisposableTracker {
  private readonly scene: THREE.Scene;
  private readonly timedObjects: TimedSceneObject[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public addTimedObject(object: THREE.Object3D, lifetimeSec: number, fadeOut = false): void {
    if (!object.parent) {
      this.scene.add(object);
    }
    this.timedObjects.push({
      object,
      remainingSec: Math.max(0.01, lifetimeSec),
      totalSec: Math.max(0.01, lifetimeSec),
      fadeOut,
    });
  }

  public update(dt: number): void {
    for (let i = this.timedObjects.length - 1; i >= 0; i--) {
      const entry = this.timedObjects[i];
      entry.remainingSec -= dt;
      if (entry.fadeOut && entry.remainingSec > 0) {
        const ratio = Math.max(0, entry.remainingSec / entry.totalSec);
        entry.object.scale.setScalar(Math.max(0.001, ratio));
      }
      if (entry.remainingSec <= 0) {
        entry.object.removeFromParent();
        const last = this.timedObjects.pop()!;
        if (i < this.timedObjects.length) {
          this.timedObjects[i] = last;
        }
      }
    }
  }

  public clearAll(): void {
    while (this.timedObjects.length > 0) {
      const entry = this.timedObjects.pop()!;
      entry.object.removeFromParent();
    }
  }
}
