import * as THREE from 'three';
import { CardinalDirection, DIRECTION_VECTORS, DIRECTION_COLORS, GAME_CONFIG } from '../config/game-config';

export type BlockState = 'IDLE' | 'BONK' | 'FLYING' | 'CLEARED';

// Shared geometries to minimize memory and garbage collection
const boxGeo = new THREE.BoxGeometry(GAME_CONFIG.blockSize, GAME_CONFIG.blockSize, GAME_CONFIG.blockSize);
const arrowHeadGeo = new THREE.ConeGeometry(0.20, 0.32, 12);
const arrowShaftGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.26, 8);

function getLateralNormals(dir: CardinalDirection): THREE.Vector3[] {
  switch (dir) {
    case '+X':
    case '-X':
      return [
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
      ];
    case '+Y':
    case '-Y':
      return [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, -1),
      ];
    case '+Z':
    case '-Z':
      return [
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, -1, 0),
      ];
  }
}

/**
 * An individual 3D arrow block entity.
 * Represents a discrete node in the spatial untangling puzzle.
 */
export class ArrowBlock {
  public readonly group: THREE.Group;
  public readonly baseMesh: THREE.Mesh;
  public readonly arrowMeshes: THREE.Mesh[] = [];
  private readonly baseMaterial: THREE.MeshStandardMaterial;
  private readonly arrowMaterial: THREE.MeshStandardMaterial;
  private readonly defaultBlockColor: number;

  public state: BlockState = 'IDLE';

  // Grid index coordinates
  public readonly gx: number;
  public readonly gy: number;
  public readonly gz: number;

  // Direction it must travel
  public direction: CardinalDirection;
  public readonly dirVector: THREE.Vector3;

  // Animation state values
  private readonly originPos: THREE.Vector3;
  private animTimer = 0;
  private isHintHighlighted = false;

  constructor(gx: number, gy: number, gz: number, direction: CardinalDirection) {
    this.gx = gx;
    this.gy = gy;
    this.gz = gz;
    this.direction = direction;
    this.dirVector = DIRECTION_VECTORS[direction].clone();

    this.group = new THREE.Group();
    this.group.userData = { block: this };

    this.defaultBlockColor = DIRECTION_COLORS[direction];

    // Soft matte toy finish with cardinal direction color
    this.baseMaterial = new THREE.MeshStandardMaterial({
      color: this.defaultBlockColor,
      roughness: 0.48,
      metalness: 0.04,
    });

    // Warm cream embossed arrow glyph
    this.arrowMaterial = new THREE.MeshStandardMaterial({
      color: 0xfcf8ee,
      emissive: 0xfff8e7,
      emissiveIntensity: 0.25,
      roughness: 0.35,
      metalness: 0.02,
    });

    this.baseMesh = new THREE.Mesh(boxGeo, this.baseMaterial);
    this.baseMesh.castShadow = true;
    this.baseMesh.receiveShadow = true;
    this.baseMesh.userData = { block: this };
    this.group.add(this.baseMesh);

    // Build the directional arrow indicators (forward 3D arrow + 4 lateral embossed arrows)
    this.buildArrows();

    // Initial position in world space
    const sp = GAME_CONFIG.blockSpacing;
    this.originPos = new THREE.Vector3(gx * sp, gy * sp, gz * sp);
    this.group.position.copy(this.originPos);
  }

  private buildArrows(): void {
    // 1. Forward 3D arrow pointing along flight direction
    const forwardGroup = new THREE.Group();
    const fShaft = new THREE.Mesh(arrowShaftGeo, this.arrowMaterial);
    const fHead = new THREE.Mesh(arrowHeadGeo, this.arrowMaterial);
    fShaft.position.y = -0.10;
    fHead.position.y = 0.18;
    fShaft.castShadow = true;
    fHead.castShadow = true;
    fShaft.userData = { block: this };
    fHead.userData = { block: this };
    forwardGroup.add(fShaft);
    forwardGroup.add(fHead);

    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, this.dirVector);
    forwardGroup.quaternion.copy(quat);
    forwardGroup.position.copy(this.dirVector).multiplyScalar(0.42);
    forwardGroup.scale.set(1.25, 1.25, 1.25);
    this.arrowMeshes.push(fShaft, fHead);
    this.group.add(forwardGroup);

    // 2. Embossed arrows on all 4 lateral faces for 360° readability from any camera angle
    const lateralNormals = getLateralNormals(this.direction);
    for (let i = 0; i < lateralNormals.length; i++) {
      const normal = lateralNormals[i];
      const side = new THREE.Vector3().crossVectors(normal, this.dirVector).normalize();

      const faceGroup = new THREE.Group();
      const lShaft = new THREE.Mesh(arrowShaftGeo, this.arrowMaterial);
      const lHead = new THREE.Mesh(arrowHeadGeo, this.arrowMaterial);
      lShaft.position.y = -0.10;
      lHead.position.y = 0.18;
      lShaft.castShadow = true;
      lHead.castShadow = true;
      lShaft.userData = { block: this };
      lHead.userData = { block: this };
      faceGroup.add(lShaft);
      faceGroup.add(lHead);

      const basis = new THREE.Matrix4().makeBasis(side, this.dirVector, normal);
      basis.setPosition(normal.x * 0.51, normal.y * 0.51, normal.z * 0.51);
      faceGroup.applyMatrix4(basis);
      faceGroup.scale.set(1.1, 1.1, 0.38);

      this.arrowMeshes.push(lShaft, lHead);
      this.group.add(faceGroup);
    }
  }

  public triggerBonk(): void {
    if (this.state !== 'IDLE') return;
    this.state = 'BONK';
    this.animTimer = 0;
    this.arrowMaterial.color.setHex(0xef4444);
    this.arrowMaterial.emissive.setHex(0xef4444);
    this.arrowMaterial.emissiveIntensity = 1.8;
    this.baseMaterial.color.setHex(0xfecaca); // Coral warning tint on block
  }

  public triggerFly(): void {
    this.state = 'FLYING';
    this.animTimer = 0;
    const flyColor = 0x10b981; // Saturated Emerald Mint
    this.arrowMaterial.color.setHex(flyColor);
    this.arrowMaterial.emissive.setHex(flyColor);
    this.arrowMaterial.emissiveIntensity = 2.0;
    this.baseMaterial.color.setHex(0xd1fae5); // Mint victory tint on block
  }

  public setHint(highlight: boolean): void {
    this.isHintHighlighted = highlight;
    if (highlight) {
      this.arrowMaterial.color.setHex(0xf59e0b);
      this.arrowMaterial.emissive.setHex(0xf59e0b);
      this.arrowMaterial.emissiveIntensity = 1.8;
      this.baseMaterial.color.setHex(0xfef3c7); // Warm amber tint on block
    } else {
      this.arrowMaterial.color.setHex(0xfcf8ee);
      this.arrowMaterial.emissive.setHex(0xfff8e7);
      this.arrowMaterial.emissiveIntensity = 0.25;
      this.baseMaterial.color.setHex(this.defaultBlockColor);
    }
  }

  /**
   * Advances block animation without any heap allocations.
   * Returns true when escape flight finishes and block is cleared.
   */
  public update(delta: number): boolean {
    if (this.state === 'BONK') {
      this.animTimer += delta;
      const bonkDuration = 0.22;
      if (this.animTimer >= bonkDuration) {
        this.group.position.copy(this.originPos);
        this.state = 'IDLE';
        this.baseMaterial.color.setHex(this.defaultBlockColor);
        this.setHint(this.isHintHighlighted);
      } else {
        // Elastic rebound curve
        const progress = this.animTimer / bonkDuration;
        const offset = Math.sin(progress * Math.PI) * GAME_CONFIG.bonkDistance;
        this.group.position.copy(this.originPos).addScaledVector(this.dirVector, offset);
      }
      return false;
    } else if (this.state === 'FLYING') {
      this.animTimer += delta;
      // Fly with continuous acceleration
      const speed = GAME_CONFIG.flySpeed * (1 + this.animTimer * 2.5);
      this.group.position.addScaledVector(this.dirVector, speed * delta);
      this.group.scale.multiplyScalar(Math.max(0.01, 1 - delta * 3.0));

      if (this.animTimer > 0.45) {
        this.state = 'CLEARED';
        this.group.visible = false;
        return true;
      }
      return false;
    }
    return false;
  }

  public dispose(): void {
    this.baseMaterial.dispose();
    this.arrowMaterial.dispose();
  }
}
