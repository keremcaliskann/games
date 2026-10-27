import * as THREE from 'three';

export interface ArcherRig {
  root: THREE.Group;
  bodyPivot: THREE.Group;
  headGroup: THREE.Group;
  torsoGroup: THREE.Group;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  bowArmGroup: THREE.Group;
  bowStringAttr: THREE.BufferAttribute;
  shieldDome: THREE.Mesh;
  hpBarBg: THREE.Mesh;
  hpBarFill: THREE.Mesh;
}

export class PrefabFactory {
  public static createBastionColumn(topY: number, radius = 1.35, trimHex = 0xf97316): THREE.Group {
    const group = new THREE.Group();

    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xfcf8ee,
      roughness: 0.52,
      metalness: 0.05,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: trimHex,
      roughness: 0.45,
      metalness: 0.08,
    });
    const rockMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.65,
      metalness: 0.04,
    });

    // Upper stone deck at y = 0 (local)
    const deckHeight = 1.6;
    const deckGeo = new THREE.CylinderGeometry(radius, radius * 0.9, deckHeight, 16);
    const deckMesh = new THREE.Mesh(deckGeo, stoneMat);
    deckMesh.position.y = -deckHeight * 0.5;
    deckMesh.castShadow = true;
    deckMesh.receiveShadow = true;
    group.add(deckMesh);

    // Terracotta trim band
    const trimGeo = new THREE.CylinderGeometry(radius * 1.04, radius * 1.04, 0.24, 16);
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.y = -0.25;
    trimMesh.castShadow = true;
    group.add(trimMesh);

    // Battlement crenellations around perimeter
    const crenelGeo = new THREE.BoxGeometry(0.32, 0.28, 0.32);
    const crenelCount = 8;
    for (let i = 0; i < crenelCount; i++) {
      const angle = (i / crenelCount) * Math.PI * 2;
      // Leave front/inner firing lane slightly clear
      if (Math.abs(Math.sin(angle)) < 0.35) continue;
      const crenel = new THREE.Mesh(crenelGeo, stoneMat);
      crenel.position.set(
        Math.cos(angle) * (radius - 0.16),
        0.12,
        Math.sin(angle) * (radius - 0.16)
      );
      crenel.rotation.y = -angle;
      crenel.castShadow = true;
      group.add(crenel);
    }

    // Tapered floating sky-island rock cone underneath (zero floor obstruction)
    const rockGeo = new THREE.ConeGeometry(radius * 0.88, 2.6, 10);
    const rockMesh = new THREE.Mesh(rockGeo, rockMat);
    rockMesh.rotation.x = Math.PI;
    rockMesh.position.y = -deckHeight - 1.3;
    rockMesh.castShadow = true;
    group.add(rockMesh);

    group.position.y = topY;
    return group;
  }

  public static createArcherPrefab(
    colorHex: number,
    facingDir: 1 | -1,
    isBoss = false
  ): ArcherRig {
    const root = new THREE.Group();
    const scale = isBoss ? 1.22 : 1.0;
    root.scale.setScalar(scale);

    const bodyPivot = new THREE.Group();
    root.add(bodyPivot);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.45,
      metalness: 0.08,
    });
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xffedd5,
      roughness: 0.48,
      metalness: 0.02,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.5,
      metalness: 0.1,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.35,
    });

    // Legs (grounded at y = 0..0.75)
    const legGeo = new THREE.CapsuleGeometry(0.11, 0.48, 6, 10);
    const leftLeg = new THREE.Mesh(legGeo, bodyMat);
    leftLeg.position.set(-0.08 * facingDir, 0.36, -0.14);
    leftLeg.castShadow = true;
    const rightLeg = new THREE.Mesh(legGeo, bodyMat);
    rightLeg.position.set(0.08 * facingDir, 0.36, 0.14);
    rightLeg.castShadow = true;
    bodyPivot.add(leftLeg, rightLeg);

    // Torso group (pivots at hip y = 0.72)
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, 0.72, 0);
    bodyPivot.add(torsoGroup);

    const torsoGeo = new THREE.CapsuleGeometry(0.2, 0.5, 8, 12);
    const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
    torsoMesh.position.y = 0.38;
    torsoMesh.castShadow = true;
    torsoGroup.add(torsoMesh);

    // Chest armor sash / quiver strap
    const beltGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.12, 12);
    const beltMesh = new THREE.Mesh(beltGeo, goldMat);
    beltMesh.position.y = 0.18;
    torsoGroup.add(beltMesh);

    // Head group (pivots at neck y = 0.78 above hip -> world y = 1.50)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.82, 0);
    torsoGroup.add(headGroup);

    const headGeo = new THREE.SphereGeometry(0.26, 14, 12);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.position.y = 0.24;
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Stylized Archer Helmet / Headband + Plume
    const helmGeo = new THREE.SphereGeometry(0.275, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const helmMesh = new THREE.Mesh(helmGeo, isBoss ? goldMat : bodyMat);
    helmMesh.position.y = 0.25;
    headGroup.add(helmMesh);

    const plumeGeo = new THREE.ConeGeometry(0.09, 0.32, 8);
    const plumeMesh = new THREE.Mesh(plumeGeo, goldMat);
    plumeMesh.position.set(-0.18 * facingDir, 0.52, 0);
    plumeMesh.rotation.z = facingDir * 0.45;
    headGroup.add(plumeMesh);

    // Bow Arm Group (pivots at shoulder y = 0.56 in torsoGroup -> world y = 1.28)
    const bowArmGroup = new THREE.Group();
    bowArmGroup.position.set(0, 0.56, 0);
    torsoGroup.add(bowArmGroup);

    const armGeo = new THREE.CapsuleGeometry(0.08, 0.42, 6, 8);
    const armMesh = new THREE.Mesh(armGeo, bodyMat);
    armMesh.rotation.z = -Math.PI / 2;
    armMesh.position.set(0.28 * facingDir, 0, 0);
    bowArmGroup.add(armMesh);

    // Composite Recurve Bow at hand (x = 0.58 * facingDir)
    const bowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.42 * facingDir, 0.55, 0),
      new THREE.Vector3(0.64 * facingDir, 0.26, 0),
      new THREE.Vector3(0.68 * facingDir, 0.0, 0),
      new THREE.Vector3(0.64 * facingDir, -0.26, 0),
      new THREE.Vector3(0.42 * facingDir, -0.55, 0),
    ]);
    const bowGeo = new THREE.TubeGeometry(bowCurve, 16, 0.042, 8, false);
    const bowMesh = new THREE.Mesh(bowGeo, woodMat);
    bowMesh.castShadow = true;
    bowArmGroup.add(bowMesh);

    // Dynamic 3-vertex Bowstring Line
    const stringVerts = new Float32Array([
      0.42 * facingDir, 0.55, 0,
      0.42 * facingDir, 0.0, 0,
      0.42 * facingDir, -0.55, 0,
    ]);
    const stringGeo = new THREE.BufferGeometry();
    const bowStringAttr = new THREE.BufferAttribute(stringVerts, 3);
    stringGeo.setAttribute('position', bowStringAttr);
    const stringMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const stringLine = new THREE.Line(stringGeo, stringMat);
    bowArmGroup.add(stringLine);

    // Guardian Shield Dome (hidden until booster activated)
    const shieldGeo = new THREE.SphereGeometry(1.15, 18, 14);
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.32,
      roughness: 0.2,
    });
    const shieldDome = new THREE.Mesh(shieldGeo, shieldMat);
    shieldDome.position.set(0, 1.0, 0);
    shieldDome.visible = false;
    root.add(shieldDome);

    // Floating 3D Health Bar above archer
    const hpBarBgGeo = new THREE.PlaneGeometry(1.1, 0.16);
    const hpBarBgMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
    const hpBarBg = new THREE.Mesh(hpBarBgGeo, hpBarBgMat);
    hpBarBg.position.set(0, 2.35, 0);
    root.add(hpBarBg);

    const hpBarFillGeo = new THREE.PlaneGeometry(1.04, 0.11);
    const hpBarFillMat = new THREE.MeshBasicMaterial({
      color: facingDir === 1 ? 0x22c55e : 0xef4444,
    });
    const hpBarFill = new THREE.Mesh(hpBarFillGeo, hpBarFillMat);
    hpBarFill.position.set(0, 2.35, 0.01);
    root.add(hpBarFill);

    return {
      root,
      bodyPivot,
      headGroup,
      torsoGroup,
      leftLeg,
      rightLeg,
      bowArmGroup,
      bowStringAttr,
      shieldDome,
      hpBarBg,
      hpBarFill,
    };
  }

  public static createArrowProjectile(isLaser = false): THREE.Group {
    const group = new THREE.Group();

    const shaftMat = new THREE.MeshStandardMaterial({
      color: isLaser ? 0x38bdf8 : 0x92400e,
      emissive: isLaser ? 0x0284c7 : 0x000000,
      emissiveIntensity: isLaser ? 0.8 : 0,
      roughness: 0.4,
    });
    const tipMat = new THREE.MeshStandardMaterial({
      color: isLaser ? 0xfef08a : 0xfacc15,
      emissive: isLaser ? 0xfacc15 : 0x000000,
      emissiveIntensity: isLaser ? 0.6 : 0,
      roughness: 0.3,
      metalness: 0.4,
    });
    const fletchMat = new THREE.MeshStandardMaterial({
      color: isLaser ? 0xf43f5e : 0xef4444,
      roughness: 0.5,
    });

    // Shaft aligned along +X
    const shaftGeo = new THREE.CylinderGeometry(0.028, 0.028, 1.05, 8);
    shaftGeo.rotateZ(-Math.PI / 2);
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    shaft.castShadow = true;
    group.add(shaft);

    // Broadhead tip at +X
    const tipGeo = new THREE.ConeGeometry(0.065, 0.22, 8);
    tipGeo.rotateZ(-Math.PI / 2);
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.x = 0.58;
    group.add(tip);

    // Fletching feathers at -X
    const fletchGeo = new THREE.BoxGeometry(0.22, 0.12, 0.02);
    const f1 = new THREE.Mesh(fletchGeo, fletchMat);
    f1.position.x = -0.42;
    const f2 = new THREE.Mesh(fletchGeo, fletchMat);
    f2.position.x = -0.42;
    f2.rotation.x = Math.PI / 2;
    group.add(f1, f2);

    return group;
  }

  public static createFlyingApple(isGolden = false): THREE.Group {
    const group = new THREE.Group();

    const appleMat = new THREE.MeshStandardMaterial({
      color: isGolden ? 0xfacc15 : 0xef4444,
      emissive: isGolden ? 0xca8a04 : 0x000000,
      emissiveIntensity: isGolden ? 0.3 : 0,
      roughness: 0.32,
      metalness: isGolden ? 0.5 : 0.05,
    });
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.45,
    });
    const balloonMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.4,
    });

    const bodyGeo = new THREE.SphereGeometry(0.32, 14, 12);
    const body = new THREE.Mesh(bodyGeo, appleMat);
    body.scale.set(1.0, 0.92, 1.0);
    body.castShadow = true;
    group.add(body);

    const leafGeo = new THREE.ConeGeometry(0.09, 0.22, 6);
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(0.06, 0.34, 0);
    leaf.rotation.z = -0.6;
    group.add(leaf);

    // Mini tether balloon above apple so it floats visibly in mid-air
    const stringGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.7, 6);
    const stringMesh = new THREE.Mesh(
      stringGeo,
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    stringMesh.position.y = 0.65;
    group.add(stringMesh);

    const balloonGeo = new THREE.SphereGeometry(0.28, 12, 10);
    const balloon = new THREE.Mesh(balloonGeo, balloonMat);
    balloon.position.y = 1.12;
    group.add(balloon);

    return group;
  }
}
