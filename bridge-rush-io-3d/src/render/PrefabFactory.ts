import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export interface BuilderSkinSpec {
  id: number;
  name: string;
  price: number;
  teamColorHex: number;
  accentHex: number;
}

export const BUILDER_SKINS: BuilderSkinSpec[] = [
  { id: 0, name: 'ROYAL ARCHITECT', price: 0, teamColorHex: 0x2563eb, accentHex: 0xfacc15 },
  { id: 1, name: 'CRIMSON BLAZER', price: 200, teamColorHex: 0xef4444, accentHex: 0xfef08a },
  { id: 2, name: 'EMERALD MASON', price: 320, teamColorHex: 0x10b981, accentHex: 0xa7f3d0 },
  { id: 3, name: 'SOLAR PHARAOH', price: 450, teamColorHex: 0xf59e0b, accentHex: 0xffffff },
  { id: 4, name: 'CYBER VIOLET', price: 600, teamColorHex: 0x8b5cf6, accentHex: 0x38bdf8 },
  { id: 5, name: 'AQUA TITAN', price: 800, teamColorHex: 0x06b6d4, accentHex: 0xfde047 },
];

export interface BridgeRunnerRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  torsoMesh: THREE.Mesh;
  helmetMesh: THREE.Mesh;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  backpackSlots: THREE.Mesh[];
  hoverboardMesh: THREE.Mesh;
  shieldAura: THREE.Mesh;
}

export class PrefabFactory {
  private static brickGeo: THREE.BufferGeometry | null = null;

  private static getBrickGeometry(): THREE.BufferGeometry {
    if (!this.brickGeo) {
      this.brickGeo = VisualEnhancer.createBeveledBox(0.56, 0.16, 0.34, 0.03, 1);
    }
    return this.brickGeo;
  }

  public static createBridgeRunner(
    teamColorHex: number,
    accentHex: number,
    isPlayer: boolean,
    maxStackVisuals = 32
  ): BridgeRunnerRig {
    const root = new THREE.Group();
    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    const shadow = VisualEnhancer.createContactShadow(0.65, 0.36);
    root.add(shadow);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: teamColorHex,
      roughness: 0.42,
      metalness: 0.1,
    });
    VisualEnhancer.applyRimLight(bodyMat, 0xffffff, 0.32);

    const torsoGeo = new THREE.CapsuleGeometry(0.32, 0.36, 8, 14);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
    torsoMesh.position.y = 0.68;
    torsoMesh.castShadow = true;
    bodyPivot.add(torsoMesh);

    // Visor
    const visorGeo = VisualEnhancer.createBeveledBox(0.38, 0.18, 0.16, 0.04, 1);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.2,
      metalness: 0.25,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.78, 0.25);
    bodyPivot.add(visor);

    // Hardhat / Crown Helmet
    const helmetGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.22, 12);
    const helmetMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      roughness: 0.35,
      metalness: 0.25,
    });
    const helmetMesh = new THREE.Mesh(helmetGeo, helmetMat);
    helmetMesh.position.y = 1.08;
    bodyPivot.add(helmetMesh);

    // Limbs
    const limbGeo = new THREE.CapsuleGeometry(0.1, 0.22, 6, 8);
    const limbMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
    });
    const leftLeg = new THREE.Mesh(limbGeo, limbMat);
    leftLeg.position.set(-0.15, 0.22, 0);
    const rightLeg = new THREE.Mesh(limbGeo, limbMat);
    rightLeg.position.set(0.15, 0.22, 0);
    const leftArm = new THREE.Mesh(limbGeo, bodyMat);
    leftArm.position.set(-0.38, 0.66, 0);
    const rightArm = new THREE.Mesh(limbGeo, bodyMat);
    rightArm.position.set(0.38, 0.66, 0);
    bodyPivot.add(leftLeg, rightLeg, leftArm, rightArm);

    // Backpack Brick Spine Stack (pre-allocated)
    const backpackSlots: THREE.Mesh[] = [];
    const brickGeo = this.getBrickGeometry();
    const stackBrickMat = new THREE.MeshStandardMaterial({
      color: teamColorHex,
      roughness: 0.38,
      metalness: 0.12,
    });
    for (let i = 0; i < maxStackVisuals; i++) {
      const bMesh = new THREE.Mesh(brickGeo, stackBrickMat);
      bMesh.position.set(0, 0.56 + i * 0.165, -0.34);
      bMesh.visible = false;
      bMesh.castShadow = i < 12;
      bodyPivot.add(bMesh);
      backpackSlots.push(bMesh);
    }

    // Hoverboard for Magnet Board Booster
    const boardGeo = VisualEnhancer.createBeveledBox(0.85, 0.1, 1.35, 0.04, 1);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      roughness: 0.25,
    });
    const hoverboardMesh = new THREE.Mesh(boardGeo, boardMat);
    hoverboardMesh.position.set(0, 0.08, 0);
    hoverboardMesh.visible = false;
    bodyPivot.add(hoverboardMesh);

    // Titan Shield Aura
    const shieldGeo = new THREE.RingGeometry(0.65, 0.85, 24);
    shieldGeo.rotateX(-Math.PI / 2);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.82,
    });
    const shieldAura = new THREE.Mesh(shieldGeo, shieldMat);
    shieldAura.position.y = 0.06;
    shieldAura.visible = false;
    root.add(shieldAura);

    if (isPlayer) {
      const playerRingGeo = new THREE.RingGeometry(0.46, 0.58, 24);
      playerRingGeo.rotateX(-Math.PI / 2);
      const playerRingMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const playerRing = new THREE.Mesh(playerRingGeo, playerRingMat);
      playerRing.position.y = 0.03;
      root.add(playerRing);
    }

    return {
      root,
      bodyPivot,
      torsoMesh,
      helmetMesh,
      leftLeg,
      rightLeg,
      leftArm,
      rightArm,
      backpackSlots,
      hoverboardMesh,
      shieldAura,
    };
  }

  public static createFloorBrick(): THREE.Mesh {
    const geo = this.getBrickGeometry();
    const mat = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.38,
      metalness: 0.12,
    });
    VisualEnhancer.applyRimLight(mat, 0xffffff, 0.25);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  public static createBridgeStepMesh(width = 2.5): THREE.Mesh {
    const geo = VisualEnhancer.createBeveledBox(width, 0.24, 0.92, 0.04, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.5,
      metalness: 0.08,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.receiveShadow = true;
    return mesh;
  }

  public static createGoldenTrophyPodium(): THREE.Group {
    const group = new THREE.Group();

    const baseGeo = new THREE.CylinderGeometry(2.2, 2.6, 0.6, 24);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.4,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.3;
    group.add(base);

    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      roughness: 0.22,
      metalness: 0.55,
    });
    const stemGeo = new THREE.CylinderGeometry(0.32, 0.58, 1.1, 16);
    const stem = new THREE.Mesh(stemGeo, cupMat);
    stem.position.y = 1.15;
    group.add(stem);

    const bowlGeo = new THREE.CylinderGeometry(0.95, 0.42, 1.1, 20);
    const bowl = new THREE.Mesh(bowlGeo, cupMat);
    bowl.position.y = 2.1;
    group.add(bowl);

    return group;
  }
}
