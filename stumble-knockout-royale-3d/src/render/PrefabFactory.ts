import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export interface SkinSpec {
  id: number;
  name: string;
  emoji: string;
  colorHex: number;
  hatColorHex: number;
  cost: number;
}

export const RUNNER_SKINS: SkinSpec[] = [
  { id: 0, name: 'Royal Bean', emoji: '👑', colorHex: 0xf43f5e, hatColorHex: 0xfacc15, cost: 0 },
  { id: 1, name: 'Cyber Visor', emoji: '🤖', colorHex: 0x0ea5e9, hatColorHex: 0x38bdf8, cost: 150 },
  { id: 2, name: 'Viking Fury', emoji: '⚔️', colorHex: 0xf97316, hatColorHex: 0xfef08a, cost: 250 },
  { id: 3, name: 'Emerald Dino', emoji: '🦖', colorHex: 0x22c55e, hatColorHex: 0x86efac, cost: 350 },
  { id: 4, name: 'Shadow Ninja', emoji: '🥷', colorHex: 0x8b5cf6, hatColorHex: 0xef4444, cost: 500 },
  { id: 5, name: 'Gold Champ', emoji: '🏆', colorHex: 0xeab308, hatColorHex: 0xffffff, cost: 750 },
];

export interface PartyRunnerRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  torsoMesh: THREE.Mesh;
  leftArm: THREE.Mesh;
  rightArm: THREE.Mesh;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  hatGroup: THREE.Group;
  jetpackFlame: THREE.Mesh;
  titanAura: THREE.Mesh;
}

export class PrefabFactory {
  public static createPartyRunner(skinId: number, isPlayer: boolean): PartyRunnerRig {
    const skin = RUNNER_SKINS[skinId % RUNNER_SKINS.length];
    const root = new THREE.Group();
    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    // 1. Contact Shadow
    const shadow = VisualEnhancer.createContactShadow(0.62, 0.35);
    root.add(shadow);

    // 2. Plump Bean Torso (Capsule)
    const torsoGeo = new THREE.CapsuleGeometry(0.42, 0.44, 10, 18);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: skin.colorHex,
      roughness: 0.36,
      metalness: skinId === 5 ? 0.65 : 0.08,
    });
    VisualEnhancer.applyRimLight(torsoMat, 0xffffff, 0.28);
    const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.y = 0.78;
    torsoMesh.castShadow = true;
    torsoMesh.receiveShadow = true;
    bodyPivot.add(torsoMesh);

    // 3. White Face Visor Plate + Eyes
    const faceGeo = VisualEnhancer.createBeveledBox(0.54, 0.32, 0.22, 0.08, 2);
    const faceMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.25,
    });
    const face = new THREE.Mesh(faceGeo, faceMat);
    face.position.set(0, 0.88, 0.28);
    bodyPivot.add(face);

    const eyeGeo = new THREE.SphereGeometry(0.055, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0f172a });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.12, 0.89, 0.39);
    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.12, 0.89, 0.39);
    bodyPivot.add(leftEye, rightEye);

    // 4. Arms & Legs
    const limbGeo = new THREE.CapsuleGeometry(0.11, 0.28, 6, 10);
    const leftArm = new THREE.Mesh(limbGeo, torsoMat);
    leftArm.position.set(-0.48, 0.78, 0);
    const rightArm = new THREE.Mesh(limbGeo, torsoMat);
    rightArm.position.set(0.48, 0.78, 0);

    const leftLeg = new THREE.Mesh(limbGeo, torsoMat);
    leftLeg.position.set(-0.2, 0.24, 0);
    const rightLeg = new THREE.Mesh(limbGeo, torsoMat);
    rightLeg.position.set(0.2, 0.24, 0);
    bodyPivot.add(leftArm, rightArm, leftLeg, rightLeg);

    // 5. Hat / Skin Headgear
    const hatGroup = new THREE.Group();
    hatGroup.position.set(0, 1.38, 0);
    const hatMat = new THREE.MeshStandardMaterial({
      color: skin.hatColorHex,
      roughness: 0.28,
      metalness: 0.45,
    });
    const crownGeo = new THREE.ConeGeometry(0.26, 0.32, 6);
    const crown = new THREE.Mesh(crownGeo, hatMat);
    hatGroup.add(crown);
    bodyPivot.add(hatGroup);

    // Player indicator ring around feet
    if (isPlayer) {
      const ringGeo = new THREE.RingGeometry(0.55, 0.7, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfacc15,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.03;
      root.add(ring);
    }

    // 6. Rocket Jetpack Flame (hidden by default)
    const flameGeo = new THREE.ConeGeometry(0.24, 0.75, 10);
    flameGeo.rotateX(Math.PI);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });
    const jetpackFlame = new THREE.Mesh(flameGeo, flameMat);
    jetpackFlame.position.set(0, 0.45, -0.42);
    jetpackFlame.visible = false;
    bodyPivot.add(jetpackFlame);

    // 7. Giant Titan Shield Aura
    const auraGeo = new THREE.RingGeometry(0.75, 0.95, 24);
    auraGeo.rotateX(-Math.PI / 2);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const titanAura = new THREE.Mesh(auraGeo, auraMat);
    titanAura.position.y = 0.06;
    titanAura.visible = false;
    root.add(titanAura);

    return {
      root,
      bodyPivot,
      torsoMesh,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      hatGroup,
      jetpackFlame,
      titanAura,
    };
  }

  public static createRotatingSweeper(barRadius = 5.2, colorHex = 0xef4444): THREE.Group {
    const group = new THREE.Group();

    const hubGeo = new THREE.CylinderGeometry(0.55, 0.65, 1.3, 16);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.2,
    });
    const hub = new THREE.Mesh(hubGeo, hubMat);
    hub.position.y = 0.65;
    hub.castShadow = true;
    group.add(hub);

    const barGeo = new THREE.CylinderGeometry(0.24, 0.24, barRadius * 2, 14);
    barGeo.rotateZ(Math.PI / 2);
    const barMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.4,
      metalness: 0.1,
    });
    VisualEnhancer.applyRimLight(barMat, 0xffffff, 0.25);
    const bar = new THREE.Mesh(barGeo, barMat);
    bar.position.y = 0.48;
    bar.castShadow = true;
    group.add(bar);

    return group;
  }

  public static createBumperPillar(colorHex = 0xf59e0b): THREE.Group {
    const group = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.5, 20);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.35,
      metalness: 0.15,
    });
    VisualEnhancer.applyRimLight(pillarMat, 0xfff8eb, 0.3);
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.y = 0.75;
    pillar.castShadow = true;
    group.add(pillar);

    const ringGeo = new THREE.TorusGeometry(0.88, 0.14, 10, 24);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.75;
    group.add(ring);

    return group;
  }

  public static createTrampolinePad(): THREE.Group {
    const group = new THREE.Group();
    const padGeo = new THREE.CylinderGeometry(1.35, 1.45, 0.26, 24);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x16a34a,
      emissiveIntensity: 0.25,
      roughness: 0.3,
    });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.y = 0.13;
    group.add(pad);
    return group;
  }

  public static createGoldenCrownGoal(): THREE.Group {
    const group = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(1.1, 1.35, 0.9, 8);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.3,
      roughness: 0.2,
      metalness: 0.75,
    });
    const base = new THREE.Mesh(baseGeo, goldMat);
    base.position.y = 1.6;
    group.add(base);

    const gemGeo = new THREE.OctahedronGeometry(0.45, 0);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.15,
      metalness: 0.5,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.y = 2.45;
    group.add(gem);
    return group;
  }
}
