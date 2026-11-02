import * as THREE from 'three';
import { AssetResolver } from './asset-resolver';
import { ProceduralMeshBuilder } from './procedural-mesh-builder';
import { VisualEnhancer } from './visual-enhancer';

export interface BumperKartRig {
  root: THREE.Group;
  bodyGroup: THREE.Group;
  bumperRing: THREE.Mesh;
  spikeGroup: THREE.Group;
  nitroFlame: THREE.Mesh;
  vortexRing: THREE.Mesh;
  antennaGroup: THREE.Group;
  wheels: THREE.Object3D[];
}

export interface ArenaIslandRig {
  root: THREE.Group;
  platformGroup: THREE.Group;
  topMesh: THREE.Mesh;
  dangerRing: THREE.Mesh;
  seaMesh: THREE.Mesh;
  themePropsGroup: THREE.Group;
}

export class PrefabFactory {
  public static createBumperKart(colorHex: number, isPlayer: boolean): BumperKartRig {
    const root = new THREE.Group();
    const bodyGroup = new THREE.Group();
    root.add(bodyGroup);

    // 1. Contact shadow decal
    const shadow = VisualEnhancer.createContactShadow(1.15, 0.38);
    root.add(shadow);

    // 2. Bouncy outer rubber bumper tube
    const bumperGeo = new THREE.TorusGeometry(0.88, 0.24, 14, 28);
    const bumperMat = new THREE.MeshStandardMaterial({
      color: isPlayer ? 0xfacc15 : 0x1e293b,
      roughness: 0.45,
      metalness: 0.15,
    });
    VisualEnhancer.applyRimLight(bumperMat, 0xfff8eb, 0.25);
    const bumperRing = new THREE.Mesh(bumperGeo, bumperMat);
    bumperRing.rotation.x = Math.PI / 2;
    bumperRing.position.y = 0.28;
    bumperRing.castShadow = true;
    bumperRing.receiveShadow = true;
    bodyGroup.add(bumperRing);

    // 3. Dual-Path Hybrid 3D Kart Chassis (ProceduralMeshBuilder + optional GLB override)
    const chassis = AssetResolver.resolveHybridModel({
      modelUrl: 'models/bumper_kart.glb',
      targetSize: { maxDim: 1.4 },
      tintColorHex: colorHex,
      proceduralFallback: () =>
        ProceduralMeshBuilder.createCarChassis(1.38, 1.08, 0.56, {
          baseColorHex: colorHex,
          accentColorHex: isPlayer ? 0xfacc15 : 0xffffff,
          stripeColorHex: 0xffffff,
        }),
    });
    chassis.position.y = 0.22;
    bodyGroup.add(chassis);

    // 4. Driver Helmet & Visor
    const helmetGeo = new THREE.SphereGeometry(0.32, 16, 14);
    const helmetMat = new THREE.MeshStandardMaterial({
      color: isPlayer ? 0xffffff : colorHex,
      roughness: 0.3,
      metalness: 0.15,
    });
    const helmet = new THREE.Mesh(helmetGeo, helmetMat);
    helmet.position.set(0, 0.88, -0.05);
    helmet.castShadow = true;
    bodyGroup.add(helmet);

    const visorGeo = VisualEnhancer.createBeveledBox(0.44, 0.17, 0.24, 0.05, 2);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.8,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.9, 0.19);
    bodyGroup.add(visor);

    // 5. Crown on Player Kart
    if (isPlayer) {
      const crownGeo = new THREE.ConeGeometry(0.22, 0.26, 6);
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.25,
        metalness: 0.65,
      });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.set(0, 1.28, -0.05);
      bodyGroup.add(crown);
    }

    // 6. Spring Antenna + Flag at rear
    const antennaGroup = new THREE.Group();
    antennaGroup.position.set(0, 0.62, -0.62);
    const rodGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.75, 8);
    const rodMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.7,
      roughness: 0.3,
    });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.position.y = 0.37;
    antennaGroup.add(rod);

    const tipGeo = new THREE.SphereGeometry(0.11, 10, 10);
    const tipMat = new THREE.MeshBasicMaterial({
      color: isPlayer ? 0x22c55e : 0xfacc15,
    });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.y = 0.76;
    antennaGroup.add(tip);
    bodyGroup.add(antennaGroup);

    // 7. 4 Multi-Spoke Detailed Wheels
    const wheels: THREE.Object3D[] = [];
    const wheelOffsets: Array<[number, number]> = [
      [-0.58, 0.45],
      [0.58, 0.45],
      [-0.58, -0.45],
      [0.58, -0.45],
    ];
    for (let i = 0; i < wheelOffsets.length; i++) {
      const [wx, wz] = wheelOffsets[i];
      const wRig = ProceduralMeshBuilder.createDetailedWheel(0.22, 0.18, 6);
      wRig.group.position.set(wx, 0.22, wz);
      bodyGroup.add(wRig.group);
      wheels.push(wRig.group);
    }

    // 9. Deployable Spike Armor Ring (hidden by default)
    const spikeGroup = new THREE.Group();
    spikeGroup.visible = false;
    const spikeGeo = new THREE.ConeGeometry(0.14, 0.42, 8);
    spikeGeo.rotateX(Math.PI / 2);
    const spikeMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.75,
      roughness: 0.22,
    });
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const s = new THREE.Mesh(spikeGeo, spikeMat);
      s.position.set(Math.sin(a) * 1.16, 0.28, Math.cos(a) * 1.16);
      s.rotation.y = a;
      spikeGroup.add(s);
    }
    bodyGroup.add(spikeGroup);

    // 10. Nitro Flame Cone (hidden by default)
    const flameGeo = new THREE.ConeGeometry(0.28, 0.9, 10);
    flameGeo.rotateX(-Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.88,
    });
    const nitroFlame = new THREE.Mesh(flameGeo, flameMat);
    nitroFlame.position.set(0, 0.35, -1.25);
    nitroFlame.visible = false;
    bodyGroup.add(nitroFlame);

    // 11. Magnet Vortex Ring (hidden by default)
    const vortexGeo = new THREE.RingGeometry(1.4, 1.75, 28);
    vortexGeo.rotateX(-Math.PI / 2);
    const vortexMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const vortexRing = new THREE.Mesh(vortexGeo, vortexMat);
    vortexRing.position.y = 0.08;
    vortexRing.visible = false;
    root.add(vortexRing);

    return {
      root,
      bodyGroup,
      bumperRing,
      spikeGroup,
      nitroFlame,
      vortexRing,
      antennaGroup,
      wheels,
    };
  }

  public static createArenaIsland(initialRadius: number): ArenaIslandRig {
    const root = new THREE.Group();
    const platformGroup = new THREE.Group();
    root.add(platformGroup);

    const topGeo = new THREE.CylinderGeometry(1.0, 0.94, 1.2, 40);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.52,
      metalness: 0.05,
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = -0.6;
    topMesh.receiveShadow = true;
    platformGroup.add(topMesh);

    // Perimeter warning curb
    const curbGeo = new THREE.TorusGeometry(0.985, 0.04, 10, 48);
    curbGeo.rotateX(Math.PI / 2);
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.4,
      metalness: 0.1,
    });
    const dangerRing = new THREE.Mesh(curbGeo, curbMat);
    dangerRing.position.y = 0.02;
    platformGroup.add(dangerRing);

    const themePropsGroup = new THREE.Group();
    root.add(themePropsGroup);

    platformGroup.scale.set(initialRadius, 1, initialRadius);

    // Sparkling sea below
    const seaGeo = new THREE.PlaneGeometry(180, 180);
    seaGeo.rotateX(-Math.PI / 2);
    const seaMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.45,
      metalness: 0.08,
    });
    const seaMesh = new THREE.Mesh(seaGeo, seaMat);
    seaMesh.position.y = -4.2;
    seaMesh.receiveShadow = true;
    root.add(seaMesh);

    return {
      root,
      platformGroup,
      topMesh,
      dangerRing,
      seaMesh,
      themePropsGroup,
    };
  }

  public static applyArenaTheme(rig: ArenaIslandRig, mapIndex: number): void {
    while (rig.themePropsGroup.children.length > 0) {
      rig.themePropsGroup.remove(rig.themePropsGroup.children[0]);
    }

    const topMat = rig.topMesh.material as THREE.MeshStandardMaterial;
    const curbMat = rig.dangerRing.material as THREE.MeshStandardMaterial;
    const seaMat = rig.seaMesh.material as THREE.MeshStandardMaterial;

    const theme = ((mapIndex % 4) + 4) % 4;
    if (theme === 0) {
      // Map 0: Tropik Kum Adası (Warm Sandstone & Coral Reef)
      topMat.color.setHex(0xd97706);
      topMat.roughness = 0.55;
      curbMat.color.setHex(0xfacc15);
      seaMat.color.setHex(0x0ea5e9);

      const ringGeo = new THREE.RingGeometry(4.2, 4.65, 36);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide });
      const innerRing = new THREE.Mesh(ringGeo, ringMat);
      innerRing.position.y = 0.02;
      rig.themePropsGroup.add(innerRing);
    } else if (theme === 1) {
      // Map 1: Buzul Glasiyeri (Slippery Arctic Ice Deck)
      topMat.color.setHex(0x0284c7);
      topMat.roughness = 0.22;
      curbMat.color.setHex(0x38bdf8);
      seaMat.color.setHex(0x1e3a8a);

      const iceRingGeo = new THREE.RingGeometry(3.8, 4.4, 6);
      iceRingGeo.rotateX(-Math.PI / 2);
      const iceRingMat = new THREE.MeshBasicMaterial({ color: 0xe0f2fe, side: THREE.DoubleSide });
      const iceRing = new THREE.Mesh(iceRingGeo, iceRingMat);
      iceRing.position.y = 0.02;
      rig.themePropsGroup.add(iceRing);
    } else if (theme === 2) {
      // Map 2: Magma Krateri (Volcanic Basalt & Central Lava Core)
      topMat.color.setHex(0x334155);
      topMat.roughness = 0.62;
      curbMat.color.setHex(0xef4444);
      seaMat.color.setHex(0xea580c);

      const lavaCoreGeo = new THREE.CylinderGeometry(2.1, 2.3, 0.16, 28);
      const lavaCoreMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        emissive: 0xf97316,
        emissiveIntensity: 0.65,
        roughness: 0.3,
      });
      const lavaCore = new THREE.Mesh(lavaCoreGeo, lavaCoreMat);
      lavaCore.position.y = 0.06;
      rig.themePropsGroup.add(lavaCore);
    } else {
      // Map 3: Siber Sekizgen (Cyber Pinball Bumper Arena)
      topMat.color.setHex(0x4c1d95);
      topMat.roughness = 0.42;
      curbMat.color.setHex(0xfacc15);
      seaMat.color.setHex(0x312e81);

      const bumperCoords: [number, number][] = [
        [4.5, 0],
        [-4.5, 0],
        [0, 4.5],
        [0, -4.5],
      ];
      const cylGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.9, 20);
      const cylMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xd97706,
        emissiveIntensity: 0.4,
        roughness: 0.25,
      });
      for (let i = 0; i < bumperCoords.length; i++) {
        const [bx, bz] = bumperCoords[i];
        const bMesh = new THREE.Mesh(cylGeo, cylMat);
        bMesh.position.set(bx, 0.45, bz);
        bMesh.castShadow = true;
        rig.themePropsGroup.add(bMesh);
      }
    }
  }

  public static createEnergyOrb(): THREE.Group {
    const group = new THREE.Group();
    const coreGeo = new THREE.OctahedronGeometry(0.32, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.4,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 0.38;
    core.castShadow = true;
    group.add(core);
    return group;
  }
}
