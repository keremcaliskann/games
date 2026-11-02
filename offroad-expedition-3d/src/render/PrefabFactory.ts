import * as THREE from 'three';
import { AssetResolver } from './asset-resolver';
import { ProceduralMeshBuilder } from './procedural-mesh-builder';
import { VisualEnhancer } from './visual-enhancer';

export interface CrawlerLiverySpec {
  id: number;
  name: string;
  price: number;
  baseHex: number;
  accentHex: number;
  stripeHex: number;
  numberText: string;
}

export const CRAWLER_LIVERIES: CrawlerLiverySpec[] = [
  {
    id: 0,
    name: 'RUBICON TRAILBLAZER',
    price: 0,
    baseHex: 0x16a34a,
    accentHex: 0xfacc15,
    stripeHex: 0xffffff,
    numberText: '4X4',
  },
  {
    id: 1,
    name: 'MOAB SANDSTORM',
    price: 220,
    baseHex: 0xd97706,
    accentHex: 0x1e293b,
    stripeHex: 0xfef08a,
    numberText: '08',
  },
  {
    id: 2,
    name: 'KODIAK RESCUE RED',
    price: 380,
    baseHex: 0xef4444,
    accentHex: 0xffffff,
    stripeHex: 0xfacc15,
    numberText: '12',
  },
  {
    id: 3,
    name: 'ARCTIC SHERPA 6X6',
    price: 540,
    baseHex: 0x0284c7,
    accentHex: 0xf8fafc,
    stripeHex: 0x38bdf8,
    numberText: '24',
  },
  {
    id: 4,
    name: 'CANYON TITAN PRO',
    price: 720,
    baseHex: 0x7c3aed,
    accentHex: 0xfacc15,
    stripeHex: 0x38bdf8,
    numberText: '55',
  },
  {
    id: 5,
    name: 'GOLDEN EXPEDITION KING',
    price: 960,
    baseHex: 0xfacc15,
    accentHex: 0x0f172a,
    stripeHex: 0xef4444,
    numberText: '99',
  },
];

export interface CrawlerTruckRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  frontAxleGroup: THREE.Group;
  rearAxleGroup: THREE.Group;
  wheels: THREE.Object3D[];
  cargoCrateMesh: THREE.Mesh;
  diffLockRing: THREE.Mesh;
  mudTireRing: THREE.Mesh;
}

export class PrefabFactory {
  public static createCrawlerTruck(
    livery: CrawlerLiverySpec,
    isSupportBot = false
  ): CrawlerTruckRig {
    const root = new THREE.Group();
    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    if (!isSupportBot) {
      const shadow = VisualEnhancer.createContactShadow(1.45, 0.44);
      root.add(shadow);
    }

    // 1. Lifted Hybrid 3D 4x4 Crawler Body
    const chassis = AssetResolver.resolveHybridModel({
      modelUrl: 'models/crawler_truck.glb',
      targetSize: { maxDim: 2.65 },
      tintColorHex: livery.baseHex,
      proceduralFallback: () =>
        ProceduralMeshBuilder.createCarChassis(2.6, 1.42, 0.78, {
          baseColorHex: livery.baseHex,
          accentColorHex: livery.accentHex,
          stripeColorHex: livery.stripeHex,
          numberText: livery.numberText,
        }),
    });
    chassis.position.y = 0.52;
    bodyPivot.add(chassis);

    // 2. Expedition Roof Rack + Cargo Supply Crate + Snorkel Intake
    const rackGeo = VisualEnhancer.createBeveledBox(1.18, 0.1, 1.32, 0.03, 1);
    const rackMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.4,
    });
    const rack = new THREE.Mesh(rackGeo, rackMat);
    rack.position.set(0, 1.32, -0.08);
    bodyPivot.add(rack);

    const crateGeo = VisualEnhancer.createBeveledBox(0.86, 0.38, 0.88, 0.05, 2);
    const crateMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.45,
      metalness: 0.1,
    });
    const cargoCrateMesh = new THREE.Mesh(crateGeo, crateMat);
    cargoCrateMesh.position.set(0, 1.56, -0.08);
    cargoCrateMesh.castShadow = true;
    bodyPivot.add(cargoCrateMesh);

    const snorkelGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.72, 8);
    const snorkel = new THREE.Mesh(snorkelGeo, rackMat);
    snorkel.position.set(0.68, 1.12, 0.45);
    bodyPivot.add(snorkel);

    // 3. Articulated Front & Rear High-Clearance Axles + 4 Knobby Offroad Tires
    const frontAxleGroup = new THREE.Group();
    frontAxleGroup.position.set(0, 0.36, 0.88);
    root.add(frontAxleGroup);

    const rearAxleGroup = new THREE.Group();
    rearAxleGroup.position.set(0, 0.36, -0.88);
    root.add(rearAxleGroup);

    const wheels: THREE.Object3D[] = [];
    const frontLeft = ProceduralMeshBuilder.createDetailedWheel(0.38, 0.28, 6);
    frontLeft.group.position.set(-0.78, 0, 0);
    const frontRight = ProceduralMeshBuilder.createDetailedWheel(0.38, 0.28, 6);
    frontRight.group.position.set(0.78, 0, 0);
    frontAxleGroup.add(frontLeft.group, frontRight.group);

    const rearLeft = ProceduralMeshBuilder.createDetailedWheel(0.38, 0.28, 6);
    rearLeft.group.position.set(-0.78, 0, 0);
    const rearRight = ProceduralMeshBuilder.createDetailedWheel(0.38, 0.28, 6);
    rearRight.group.position.set(0.78, 0, 0);
    rearAxleGroup.add(rearLeft.group, rearRight.group);

    wheels.push(frontLeft.group, frontRight.group, rearLeft.group, rearRight.group);

    // 4. Diff-Lock & Mud Monster Tire Aura Rings
    const diffGeo = new THREE.RingGeometry(1.2, 1.48, 28);
    diffGeo.rotateX(-Math.PI / 2);
    const diffMat = new THREE.MeshBasicMaterial({
      color: 0xfacc15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.78,
    });
    const diffLockRing = new THREE.Mesh(diffGeo, diffMat);
    diffLockRing.position.y = 0.06;
    diffLockRing.visible = false;
    root.add(diffLockRing);

    const mudGeo = new THREE.RingGeometry(1.5, 1.75, 28);
    mudGeo.rotateX(-Math.PI / 2);
    const mudMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const mudTireRing = new THREE.Mesh(mudGeo, mudMat);
    mudTireRing.position.y = 0.05;
    mudTireRing.visible = false;
    root.add(mudTireRing);

    return {
      root,
      bodyPivot,
      frontAxleGroup,
      rearAxleGroup,
      wheels,
      cargoCrateMesh,
      diffLockRing,
      mudTireRing,
    };
  }

  public static createBaseCampArch(width: number, isFinalCamp: boolean): THREE.Group {
    const group = new THREE.Group();
    const colorHex = isFinalCamp ? 0xfacc15 : 0x22c55e;
    const postGeo = new THREE.CylinderGeometry(0.34, 0.4, 5.2, 10);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.65 });

    const leftPost = new THREE.Mesh(postGeo, postMat);
    leftPost.position.set(-width * 0.5, 2.6, 0);
    leftPost.castShadow = true;
    const rightPost = new THREE.Mesh(postGeo, postMat);
    rightPost.position.set(width * 0.5, 2.6, 0);
    rightPost.castShadow = true;

    const bannerGeo = VisualEnhancer.createBeveledBox(width + 1.4, 1.0, 0.85, 0.1, 2);
    const bannerMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.22,
      roughness: 0.35,
    });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 5.0, 0);
    banner.castShadow = true;

    group.add(leftPost, rightPost, banner);
    return group;
  }

  public static createWinchAnchorTree(): THREE.Group {
    const group = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.28, 0.38, 1.8, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 0.9;
    group.add(trunk);

    // Glowing yellow winch anchor ring around trunk
    const ringGeo = new THREE.TorusGeometry(0.42, 0.07, 8, 18);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 1.15;
    group.add(ring);

    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.55 });
    const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.45, 2.4, 8), foliageMat);
    cone1.position.y = 2.5;
    cone1.castShadow = true;
    const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.05, 1.9, 8), foliageMat);
    cone2.position.y = 3.7;
    cone2.castShadow = true;
    group.add(cone1, cone2);
    return group;
  }

  public static createBoulder(radius: number): THREE.Mesh {
    const geo = new THREE.DodecahedronGeometry(radius, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.68,
      metalness: 0.05,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }
}
