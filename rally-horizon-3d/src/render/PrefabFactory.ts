import * as THREE from 'three';
import { AssetResolver } from './asset-resolver';
import { ProceduralMeshBuilder } from './procedural-mesh-builder';
import { VisualEnhancer } from './visual-enhancer';

export interface RallyLiverySpec {
  id: number;
  name: string;
  price: number;
  baseHex: number;
  accentHex: number;
  stripeHex: number;
  numberText: string;
}

export const RALLY_LIVERIES: RallyLiverySpec[] = [
  {
    id: 0,
    name: 'SUBARU HORIZON 555',
    price: 0,
    baseHex: 0x2563eb,
    accentHex: 0xfacc15,
    stripeHex: 0xfef08a,
    numberText: '01',
  },
  {
    id: 1,
    name: 'MONTE CARLO EVO',
    price: 220,
    baseHex: 0xef4444,
    accentHex: 0xffffff,
    stripeHex: 0xfacc15,
    numberText: '07',
  },
  {
    id: 2,
    name: 'ALPINE MARTINI RS',
    price: 360,
    baseHex: 0xf8fafc,
    accentHex: 0x0284c7,
    stripeHex: 0xef4444,
    numberText: '14',
  },
  {
    id: 3,
    name: 'BAJA DESERT FOX',
    price: 520,
    baseHex: 0xf97316,
    accentHex: 0x1e293b,
    stripeHex: 0xfde047,
    numberText: '23',
  },
  {
    id: 4,
    name: 'NORDIC APEX GR',
    price: 700,
    baseHex: 0x10b981,
    accentHex: 0xfef08a,
    stripeHex: 0xffffff,
    numberText: '42',
  },
  {
    id: 5,
    name: 'GROUP-B GOLDEN LEGEND',
    price: 950,
    baseHex: 0xfacc15,
    accentHex: 0x0f172a,
    stripeHex: 0xef4444,
    numberText: '99',
  },
];

export interface RallyCarRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  wheels: THREE.Object3D[];
  frontWheelPivots: THREE.Group[];
  leftNitroFlame: THREE.Mesh;
  rightNitroFlame: THREE.Mesh;
  gripAuraRing: THREE.Mesh;
}

export class PrefabFactory {
  public static createRallyCar(
    livery: RallyLiverySpec,
    isGhost = false
  ): RallyCarRig {
    const root = new THREE.Group();
    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    if (!isGhost) {
      const shadow = VisualEnhancer.createContactShadow(1.35, 0.42);
      root.add(shadow);
    }

    // 1. Hybrid 3D Rally Chassis (ProceduralMeshBuilder + optional GLB hot-swap)
    const chassis = AssetResolver.resolveHybridModel({
      modelUrl: 'models/rally_car.glb',
      targetSize: { maxDim: 2.5 },
      tintColorHex: livery.baseHex,
      proceduralFallback: () =>
        ProceduralMeshBuilder.createCarChassis(2.5, 1.32, 0.68, {
          baseColorHex: livery.baseHex,
          accentColorHex: livery.accentHex,
          stripeColorHex: livery.stripeHex,
          numberText: livery.numberText,
        }),
    });
    chassis.position.y = 0.24;
    bodyPivot.add(chassis);

    // 2. WRC Roof Air Scoop & Mudflaps
    const scoopGeo = VisualEnhancer.createBeveledBox(0.42, 0.14, 0.52, 0.03, 1);
    const scoopMat = new THREE.MeshStandardMaterial({
      color: livery.accentHex,
      roughness: 0.35,
      metalness: 0.2,
    });
    const scoop = new THREE.Mesh(scoopGeo, scoopMat);
    scoop.position.set(0, 0.96, 0.08);
    bodyPivot.add(scoop);

    const flapGeo = new THREE.BoxGeometry(0.28, 0.22, 0.04);
    const flapMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.6,
    });
    const leftFlap = new THREE.Mesh(flapGeo, flapMat);
    leftFlap.position.set(-0.56, 0.22, -1.16);
    const rightFlap = new THREE.Mesh(flapGeo, flapMat);
    rightFlap.position.set(0.56, 0.22, -1.16);
    bodyPivot.add(leftFlap, rightFlap);

    // 3. 4 Multi-Spoke Rally Wheels with front steering pivots
    const wheels: THREE.Object3D[] = [];
    const frontWheelPivots: THREE.Group[] = [];
    const offsets: Array<[number, number, boolean]> = [
      [-0.68, 0.82, true],
      [0.68, 0.82, true],
      [-0.68, -0.82, false],
      [0.68, -0.82, false],
    ];

    for (let i = 0; i < offsets.length; i++) {
      const [wx, wz, isFront] = offsets[i];
      const wRig = ProceduralMeshBuilder.createDetailedWheel(0.28, 0.22, 6);
      if (isFront) {
        const steerPivot = new THREE.Group();
        steerPivot.position.set(wx, 0.28, wz);
        steerPivot.add(wRig.group);
        root.add(steerPivot);
        frontWheelPivots.push(steerPivot);
      } else {
        wRig.group.position.set(wx, 0.28, wz);
        root.add(wRig.group);
      }
      wheels.push(wRig.group);
    }

    // 4. Twin-Turbo Afterburner Flames
    const flameGeo = new THREE.ConeGeometry(0.18, 0.78, 8);
    flameGeo.rotateX(-Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.88,
    });
    const leftNitroFlame = new THREE.Mesh(flameGeo, flameMat);
    leftNitroFlame.position.set(-0.34, 0.32, -1.55);
    leftNitroFlame.visible = false;
    const rightNitroFlame = new THREE.Mesh(flameGeo, flameMat);
    rightNitroFlame.position.set(0.34, 0.32, -1.55);
    rightNitroFlame.visible = false;
    bodyPivot.add(leftNitroFlame, rightNitroFlame);

    // 5. Gravel Grip Compound Aura Ring
    const ringGeo = new THREE.RingGeometry(1.15, 1.42, 28);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const gripAuraRing = new THREE.Mesh(ringGeo, ringMat);
    gripAuraRing.position.y = 0.05;
    gripAuraRing.visible = false;
    root.add(gripAuraRing);

    if (isGhost) {
      root.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          if (Array.isArray(m.material)) return;
          const cloneMat = m.material.clone() as THREE.MeshStandardMaterial;
          cloneMat.transparent = true;
          cloneMat.opacity = 0.72;
          m.material = cloneMat;
        }
      });
    }

    return {
      root,
      bodyPivot,
      wheels,
      frontWheelPivots,
      leftNitroFlame,
      rightNitroFlame,
      gripAuraRing,
    };
  }

  public static createCheckpointArch(width: number, isFinish: boolean): THREE.Group {
    const group = new THREE.Group();
    const colorHex = isFinish ? 0xfacc15 : 0x0284c7;
    const pillarGeo = VisualEnhancer.createBeveledBox(0.75, 5.2, 0.75, 0.1, 2);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.12,
    });

    const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
    leftPillar.position.set(-width * 0.5, 2.6, 0);
    leftPillar.castShadow = true;

    const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
    rightPillar.position.set(width * 0.5, 2.6, 0);
    rightPillar.castShadow = true;

    const bannerGeo = VisualEnhancer.createBeveledBox(width + 1.4, 1.05, 0.9, 0.12, 2);
    const bannerMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.24,
      roughness: 0.3,
    });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 5.1, 0);
    banner.castShadow = true;

    group.add(leftPillar, rightPillar, banner);
    return group;
  }

  public static createPineTree(scale = 1.0): THREE.Group {
    const group = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.22, 0.32, 1.4, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.7;
    group.add(trunk);

    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.55 });
    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.35, 2.2, 8), foliageMat);
    cone1.position.y = 2.1;
    cone1.castShadow = true;
    const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.0, 1.8, 8), foliageMat);
    cone2.position.y = 3.2;
    cone2.castShadow = true;
    group.add(cone1, cone2);
    group.scale.setScalar(scale);
    return group;
  }
}
