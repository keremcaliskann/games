import * as THREE from 'three';
import { PrefabFactory } from '../../render/PrefabFactory';

export class GoodsItem {
  public readonly mesh: THREE.Group;
  public tier: number;
  public col: number;
  public slotIndex: number;
  public layer: number; // 0 = front, 1 = rear
  public isVip: boolean = false;
  public isGolden: boolean = false;

  private isAnimating = false;
  private animStartPos = new THREE.Vector3();
  private animTargetPos = new THREE.Vector3();
  private animProgress = 0;
  private animDuration = 0.28;
  private onAnimComplete?: () => void;

  private isSelected = false;

  constructor(
    public readonly id: string,
    public readonly typeId: string,
    tier: number,
    col: number,
    slotIndex: number,
    layer: number,
    initialPos: THREE.Vector3,
    isGolden: boolean = false
  ) {
    this.tier = tier;
    this.col = col;
    this.slotIndex = slotIndex;
    this.layer = layer;
    this.isGolden = isGolden;

    this.mesh = PrefabFactory.createItemMesh(typeId);
    this.mesh.position.copy(initialPos);
    this.mesh.name = id;

    if (isGolden) {
      this.mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            roughness: 0.18,
            metalness: 0.65,
          });
        }
      });
    }

    // Dim rear layer items slightly to show they are in the back
    if (layer === 1) {
      this.mesh.position.z -= 0.65;
      this.mesh.scale.setScalar(0.88);
    }
  }

  public setSelected(selected: boolean): void {
    this.isSelected = selected;
    if (selected) {
      this.mesh.position.y += 0.25;
      this.mesh.scale.setScalar(1.12);
    } else {
      this.mesh.scale.setScalar(this.layer === 1 ? 0.88 : 1.0);
    }
  }

  public get selected(): boolean {
    return this.isSelected;
  }

  public moveTo(targetPos: THREE.Vector3, onComplete?: () => void): void {
    this.isAnimating = true;
    this.animStartPos.copy(this.mesh.position);
    this.animTargetPos.copy(targetPos);
    this.animProgress = 0;
    this.onAnimComplete = onComplete;
  }

  public update(dt: number): void {
    if (this.isAnimating) {
      this.animProgress += dt / this.animDuration;
      if (this.animProgress >= 1.0) {
        this.animProgress = 1.0;
        this.isAnimating = false;
        this.mesh.position.copy(this.animTargetPos);
        if (this.onAnimComplete) {
          const cb = this.onAnimComplete;
          this.onAnimComplete = undefined;
          cb();
        }
      } else {
        // Arc interpolation
        this.mesh.position.lerpVectors(this.animStartPos, this.animTargetPos, this.animProgress);
        // Vertical arc parabola
        const arc = Math.sin(this.animProgress * Math.PI) * 0.8;
        this.mesh.position.y += arc;
      }
    }
  }
}
