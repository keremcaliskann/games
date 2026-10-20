import * as THREE from 'three';
import { CardinalDirection, DIRECTION_VECTORS, CYBER_THEMES, GAME_CONFIG } from '../config/game-config';

export type BlockState = 'IDLE' | 'BONK' | 'FLYING' | 'CLEARED';

// Shared geometries to minimize memory and garbage collection
const boxGeo = new THREE.BoxGeometry(GAME_CONFIG.blockSize, GAME_CONFIG.blockSize, GAME_CONFIG.blockSize);
const arrowHeadGeo = new THREE.ConeGeometry(0.24, 0.45, 12);
const arrowShaftGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.35, 8);

/**
 * An individual 3D arrow block entity.
 * Represents a discrete node in the spatial untangling puzzle.
 */
export class ArrowBlock {
  public readonly group: THREE.Group;
  public readonly baseMesh: THREE.Mesh;
  public readonly arrowGroup: THREE.Group;
  private readonly baseMaterial: THREE.MeshStandardMaterial;
  private readonly arrowMaterial: THREE.MeshStandardMaterial;

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

    const theme = CYBER_THEMES.neonCyan;

    this.baseMaterial = new THREE.MeshStandardMaterial({
      color: theme.blockColor,
      roughness: 0.3,
      metalness: 0.8,
    });

    this.arrowMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: theme.arrowEmissive,
      emissiveIntensity: 1.4,
      roughness: 0.2,
      metalness: 0.9,
    });

    this.baseMesh = new THREE.Mesh(boxGeo, this.baseMaterial);
    this.baseMesh.castShadow = true;
    this.baseMesh.receiveShadow = true;
    this.baseMesh.userData = { block: this };
    this.group.add(this.baseMesh);

    // Build the directional arrow indicator
    this.arrowGroup = new THREE.Group();
    const shaft = new THREE.Mesh(arrowShaftGeo, this.arrowMaterial);
    const head = new THREE.Mesh(arrowHeadGeo, this.arrowMaterial);
    shaft.position.y = -0.12;
    head.position.y = 0.2;
    this.arrowGroup.add(shaft);
    this.arrowGroup.add(head);

    this.orientArrow(this.dirVector);
    this.group.add(this.arrowGroup);

    // Initial position in world space
    const sp = GAME_CONFIG.blockSpacing;
    this.originPos = new THREE.Vector3(gx * sp, gy * sp, gz * sp);
    this.group.position.copy(this.originPos);
  }

  private orientArrow(dir: THREE.Vector3): void {
    // Default cone points along +Y
    const up = new THREE.Vector3(0, 1, 0);
    const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);
    this.arrowGroup.quaternion.copy(quat);
    // Push the arrow outward along the direction face so it is clearly visible
    this.arrowGroup.position.copy(dir).multiplyScalar(0.25);
  }

  public triggerBonk(): void {
    if (this.state !== 'IDLE') return;
    this.state = 'BONK';
    this.animTimer = 0;
    this.arrowMaterial.emissive.setHex(CYBER_THEMES.neonCyan.blockedEmissive);
    this.arrowMaterial.emissiveIntensity = 2.5;
  }

  public triggerFly(): void {
    this.state = 'FLYING';
    this.animTimer = 0;
    this.arrowMaterial.emissive.setHex(0x39ff14);
    this.arrowMaterial.emissiveIntensity = 3.0;
  }

  public setHint(highlight: boolean): void {
    this.isHintHighlighted = highlight;
    if (highlight) {
      this.arrowMaterial.emissive.setHex(CYBER_THEMES.neonCyan.highlightEmissive);
      this.arrowMaterial.emissiveIntensity = 3.0;
    } else {
      this.arrowMaterial.emissive.setHex(CYBER_THEMES.neonCyan.arrowEmissive);
      this.arrowMaterial.emissiveIntensity = 1.4;
    }
  }

  public update(delta: number, onFlyFinished: (block: ArrowBlock) => void): void {
    if (this.state === 'BONK') {
      this.animTimer += delta;
      const bonkDuration = 0.22;
      if (this.animTimer >= bonkDuration) {
        this.group.position.copy(this.originPos);
        this.state = 'IDLE';
        this.setHint(this.isHintHighlighted);
      } else {
        // Elastic rebound curve
        const progress = this.animTimer / bonkDuration;
        const offset = Math.sin(progress * Math.PI) * GAME_CONFIG.bonkDistance;
        this.group.position.copy(this.originPos).addScaledVector(this.dirVector, offset);
      }
    } else if (this.state === 'FLYING') {
      this.animTimer += delta;
      // Fly with continuous acceleration
      const speed = GAME_CONFIG.flySpeed * (1 + this.animTimer * 2.5);
      this.group.position.addScaledVector(this.dirVector, speed * delta);
      this.group.scale.multiplyScalar(Math.max(0.01, 1 - delta * 3.0));

      if (this.animTimer > 0.45) {
        this.state = 'CLEARED';
        this.group.visible = false;
        onFlyFinished(this);
      }
    }
  }

  public dispose(): void {
    this.baseMaterial.dispose();
    this.arrowMaterial.dispose();
  }
}
