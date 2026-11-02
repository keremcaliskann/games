import * as THREE from 'three';
import { AssetResolver } from './asset-resolver';
import { ProceduralMeshBuilder } from './procedural-mesh-builder';
import { VisualEnhancer } from './visual-enhancer';

export interface KartSkinSpec {
  id: number;
  name: string;
  chassisHex: number;
  accentHex: number;
  cost: number;
}

export const KART_SKINS: KartSkinSpec[] = [
  { id: 0, name: 'STRIKER BLUE', chassisHex: 0x2563eb, accentHex: 0xfacc15, cost: 0 },
  { id: 1, name: 'CRIMSON VIPER', chassisHex: 0xef4444, accentHex: 0x38bdf8, cost: 180 },
  { id: 2, name: 'EMERALD TANK', chassisHex: 0x10b981, accentHex: 0xfde047, cost: 280 },
  { id: 3, name: 'CYBER GOLD', chassisHex: 0xf59e0b, accentHex: 0xec4899, cost: 420 },
  { id: 4, name: 'PLASMA VIOLET', chassisHex: 0x8b5cf6, accentHex: 0x4ade80, cost: 600 },
  { id: 5, name: 'INFERNO MECHA', chassisHex: 0xea580c, accentHex: 0x22d3ee, cost: 850 },
];

export interface BattleKartRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  chassisMesh: THREE.Mesh | THREE.Group;
  helmetMesh: THREE.Mesh;
  turretPivot: THREE.Group;
  wheels: THREE.Mesh[];
  mechaCannonGroup: THREE.Group;
  shieldDome: THREE.Mesh;
}

export class PrefabFactory {
  public static createBattleKart(
    chassisHex: number,
    accentHex: number,
    isPlayer: boolean
  ): BattleKartRig {
    const root = new THREE.Group();
    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    const wheels: THREE.Mesh[] = [];

    // 1. Dual-Path Hybrid Vehicle Chassis
    // Checks public/models/rally_car.glb; falls back to Next-Gen Procedural Car Chassis
    const hybridChassis = AssetResolver.resolveHybridModel({
      modelUrl: './models/rally_car.glb',
      targetSize: { maxDim: 2.3 },
      pivotAlignment: 'bottom-center',
      tintColorHex: chassisHex,
      contactShadowRadius: 1.6,
      proceduralFallback: () => {
        return ProceduralMeshBuilder.createCarChassis(2.3, 1.25, 0.65, {
          baseColorHex: chassisHex,
          accentColorHex: accentHex,
          numberText: isPlayer ? '1' : String(Math.floor(Math.random() * 89 + 10)),
        });
      },
    });
    bodyPivot.add(hybridChassis);

    // 2. High-Detail 4 Wheels (with 5-spoke rims and brake calipers)
    const wheelOffsets: [number, number, number][] = [
      [-0.68, 0.28, 0.62],
      [0.68, 0.28, 0.62],
      [-0.68, 0.28, -0.62],
      [0.68, 0.28, -0.62],
    ];
    for (let i = 0; i < wheelOffsets.length; i++) {
      const [wx, wy, wz] = wheelOffsets[i];
      const wheelRig = ProceduralMeshBuilder.createDetailedWheel(0.29, 0.24, accentHex, 0x0f172a);
      wheelRig.group.position.set(wx, wy, wz);
      bodyPivot.add(wheelRig.group);
      wheels.push(wheelRig.tireMesh);
    }

    // 3. Driver Cockpit & Helmet
    const accentMat = new THREE.MeshStandardMaterial({
      color: accentHex,
      roughness: 0.35,
      metalness: 0.2,
    });
    const helmetGeo = new THREE.SphereGeometry(0.24, 14, 12);
    const helmetMesh = new THREE.Mesh(helmetGeo, accentMat);
    helmetMesh.position.set(0, 0.72, -0.06);
    helmetMesh.castShadow = true;
    bodyPivot.add(helmetMesh);

    // 4. Roof-Mounted Auto-Aiming Turret Pivot
    const turretPivot = new THREE.Group();
    turretPivot.position.set(0, 0.96, -0.12);
    bodyPivot.add(turretPivot);

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.3,
    });
    const podGeo = new THREE.BoxGeometry(0.48, 0.22, 0.52);
    const podMesh = new THREE.Mesh(podGeo, darkMat);
    podMesh.castShadow = true;
    turretPivot.add(podMesh);

    const barrelGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.52, 8);
    barrelGeo.rotateX(Math.PI / 2);
    const leftBarrel = new THREE.Mesh(barrelGeo, accentMat);
    leftBarrel.position.set(-0.13, 0.02, 0.34);
    const rightBarrel = new THREE.Mesh(barrelGeo, accentMat);
    rightBarrel.position.set(0.13, 0.02, 0.34);
    turretPivot.add(leftBarrel, rightBarrel);

    // 5. Mecha Tank Heavy Twin-Cannon Booster Group
    const mechaCannonGroup = new THREE.Group();
    const mechaMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.35,
      roughness: 0.28,
      metalness: 0.55,
    });
    const heavyPod = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.32, 0.68), mechaMat);
    const heavyBarrelL = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.76, 10).rotateX(Math.PI / 2),
      mechaMat
    );
    heavyBarrelL.position.set(-0.24, 0.05, 0.48);
    const heavyBarrelR = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.76, 10).rotateX(Math.PI / 2),
      mechaMat
    );
    heavyBarrelR.position.set(0.24, 0.05, 0.48);
    mechaCannonGroup.add(heavyPod, heavyBarrelL, heavyBarrelR);
    mechaCannonGroup.visible = false;
    turretPivot.add(mechaCannonGroup);

    // 6. Invulnerability Shield Dome
    const shieldGeo = new THREE.SphereGeometry(1.35, 16, 12);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.32,
      wireframe: true,
    });
    const shieldDome = new THREE.Mesh(shieldGeo, shieldMat);
    shieldDome.position.set(0, 0.55, 0);
    shieldDome.visible = false;
    root.add(shieldDome);

    if (isPlayer) {
      const ringGeo = new THREE.RingGeometry(0.92, 1.12, 28);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfacc15,
        side: THREE.DoubleSide,
      });
      const playerRing = new THREE.Mesh(ringGeo, ringMat);
      playerRing.position.y = 0.04;
      root.add(playerRing);
    }

    return {
      root,
      bodyPivot,
      chassisMesh: hybridChassis,
      helmetMesh,
      turretPivot,
      wheels,
      mechaCannonGroup,
      shieldDome,
    };
  }

  public static createMysteryCrate(): THREE.Group {
    const group = new THREE.Group();
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.36,
      metalness: 0.18,
    });
    VisualEnhancer.applyRimLight(boxMat, 0xfef08a, 0.3);

    const bandMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.3,
      roughness: 0.28,
    });

    const box = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.95), boxMat);
    box.castShadow = true;
    group.add(box);

    const band1 = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.22, 1.02), bandMat);
    const band2 = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.02, 1.02), bandMat);
    group.add(band1, band2);

    return group;
  }

  public static createPowerCube(): THREE.Group {
    const group = new THREE.Group();
    const cubeMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x16a34a,
      emissiveIntensity: 0.38,
      roughness: 0.26,
      metalness: 0.25,
    });
    VisualEnhancer.applyRimLight(cubeMat, 0x86efac, 0.35);

    const mesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.44, 0), cubeMat);
    mesh.castShadow = true;
    group.add(mesh);
    return group;
  }

  public static createProjectileMesh(): THREE.Mesh {
    const geo = new THREE.ConeGeometry(0.18, 0.58, 10);
    geo.rotateX(Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xef4444,
      emissiveIntensity: 0.48,
      roughness: 0.28,
    });
    return new THREE.Mesh(geo, mat);
  }

  public static createMineMesh(): THREE.Mesh {
    const geo = new THREE.CylinderGeometry(0.44, 0.5, 0.22, 14);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.42,
      roughness: 0.38,
    });
    return new THREE.Mesh(geo, mat);
  }
}
