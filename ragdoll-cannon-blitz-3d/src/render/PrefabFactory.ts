import * as THREE from 'three';

export class PrefabFactory {
  private static tntTextureCache: THREE.CanvasTexture | null = null;

  public static createEnvironment(scene: THREE.Scene): { island: THREE.Group; ocean: THREE.Mesh } {
    // 1. Tropical Ocean Water Plane
    const oceanGeo = new THREE.PlaneGeometry(160, 160);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.1,
    });
    const ocean = new THREE.Mesh(oceanGeo, oceanMat);
    ocean.rotation.x = -Math.PI / 2;
    ocean.position.y = -1.6;
    ocean.receiveShadow = true;
    scene.add(ocean);

    // 2. Island Bedrock Pedestal
    const island = new THREE.Group();
    island.position.set(0, 0, -4);

    // Sandy Shoreline Bedrock
    const bedrockGeo = new THREE.CylinderGeometry(15, 17, 3.2, 32);
    const bedrockMat = new THREE.MeshStandardMaterial({
      color: 0xf5eedb,
      roughness: 0.85,
    });
    const bedrock = new THREE.Mesh(bedrockGeo, bedrockMat);
    bedrock.position.y = 0;
    bedrock.receiveShadow = true;
    island.add(bedrock);

    // Lush Stylized Grass Top
    const grassGeo = new THREE.CylinderGeometry(14.5, 14.5, 0.4, 32);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      roughness: 0.65,
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.position.y = 1.7;
    grass.receiveShadow = true;
    island.add(grass);

    // Player Firing Platform
    const playerPlatformGeo = new THREE.BoxGeometry(10, 2.5, 8);
    const playerPlatformMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.7,
    });
    const playerPlatform = new THREE.Mesh(playerPlatformGeo, playerPlatformMat);
    playerPlatform.position.set(0, 0.5, 19);
    playerPlatform.receiveShadow = true;
    scene.add(playerPlatform);

    scene.add(island);
    return { island, ocean };
  }

  public static createCannon(): { root: THREE.Group; barrelGroup: THREE.Group; muzzle: THREE.Vector3 } {
    const root = new THREE.Group();
    root.position.set(0, 2.4, 18);

    // Carriage Base (Wood + Iron)
    const carriageMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
    const ironMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.4 });
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.35, metalness: 0.6 });

    const carriage = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 2.8), carriageMat);
    carriage.castShadow = true;
    carriage.receiveShadow = true;
    root.add(carriage);

    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.85, 0.85, 0.3, 18);
    wheelGeo.rotateZ(Math.PI / 2);
    const leftWheel = new THREE.Mesh(wheelGeo, ironMat);
    leftWheel.position.set(-1.3, -0.1, 0);
    leftWheel.castShadow = true;
    root.add(leftWheel);

    const rightWheel = leftWheel.clone();
    rightWheel.position.set(1.3, -0.1, 0);
    root.add(rightWheel);

    // Swivel Barrel Group
    const barrelGroup = new THREE.Group();
    barrelGroup.position.set(0, 0.5, 0.3);

    // Main Tapered Barrel
    const barrelGeo = new THREE.CylinderGeometry(0.36, 0.52, 3.4, 20);
    barrelGeo.rotateX(Math.PI / 2);
    const barrelMesh = new THREE.Mesh(barrelGeo, ironMat);
    barrelMesh.position.set(0, 0, -1.2);
    barrelMesh.castShadow = true;
    barrelGroup.add(barrelMesh);

    // Brass Reinforcement Rings
    const ringGeo = new THREE.TorusGeometry(0.48, 0.08, 12, 20);
    const ring1 = new THREE.Mesh(ringGeo, brassMat);
    ring1.position.set(0, 0, -0.4);
    barrelGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, brassMat);
    ring2.position.set(0, 0, -1.8);
    barrelGroup.add(ring2);

    // Rear Cascabel Knob
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), ironMat);
    knob.position.set(0, 0, 0.6);
    barrelGroup.add(knob);

    root.add(barrelGroup);

    return { root, barrelGroup, muzzle: new THREE.Vector3(0, 0, -3.0) };
  }

  public static createTntTexture(): THREE.CanvasTexture {
    if (this.tntTextureCache) return this.tntTextureCache;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Red base
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, 256, 256);

    // Yellow hazard warning stripe
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 80, 256, 96);

    // Black TNT bold text
    ctx.fillStyle = '#7f1d1d';
    ctx.font = 'bold 70px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TNT', 128, 128);

    this.tntTextureCache = new THREE.CanvasTexture(canvas);
    return this.tntTextureCache;
  }

  public static createTntBarrel(): THREE.Group {
    const group = new THREE.Group();
    const tex = this.createTntTexture();

    const drumGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.6, 20);
    const drumMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.45,
    });
    const drum = new THREE.Mesh(drumGeo, drumMat);
    drum.castShadow = true;
    drum.receiveShadow = true;
    group.add(drum);

    const rimMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.5 });
    const topRim = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.05, 8, 20), rimMat);
    topRim.rotation.x = Math.PI / 2;
    topRim.position.y = 0.78;
    group.add(topRim);

    const botRim = topRim.clone();
    botRim.position.y = -0.78;
    group.add(botRim);

    return group;
  }

  public static createBlock(hx: number, hy: number, hz: number, materialType: 'wood' | 'stone' | 'ice'): THREE.Mesh {
    const geo = new THREE.BoxGeometry(hx * 2, hy * 2, hz * 2);
    let color = 0xd97706;
    let roughness = 0.65;
    let metalness = 0.05;

    if (materialType === 'stone') {
      color = 0x94a3b8;
      roughness = 0.85;
    } else if (materialType === 'ice') {
      color = 0xbae6fd;
      roughness = 0.15;
    }

    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  public static createTargetDummy(): THREE.Group {
    const group = new THREE.Group();

    const woodMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 });
    const clothMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.7 });
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.6 });

    // Torso
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 1.3, 16), clothMat);
    torso.position.y = 0.65;
    torso.castShadow = true;
    group.add(torso);

    // Target Bullseye ring on chest
    const targetRing = new THREE.Mesh(new THREE.RingGeometry(0.12, 0.26, 16), woodMat);
    targetRing.position.set(0, 0.7, 0.43);
    group.add(targetRing);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 16), headMat);
    head.position.y = 1.65;
    head.castShadow = true;
    group.add(head);

    // Stunned X eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x7c2d12 });
    const eye1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.02), eyeMat);
    eye1.rotation.z = Math.PI / 4;
    eye1.position.set(-0.14, 1.7, 0.36);
    group.add(eye1);

    const eye2 = eye1.clone();
    eye2.position.set(0.14, 1.7, 0.36);
    group.add(eye2);

    // Arms
    const armGeo = new THREE.CapsuleGeometry(0.14, 0.7, 6, 8);
    const leftArm = new THREE.Mesh(armGeo, woodMat);
    leftArm.position.set(-0.65, 0.75, 0);
    leftArm.rotation.z = 0.4;
    leftArm.castShadow = true;
    group.add(leftArm);

    const rightArm = leftArm.clone();
    rightArm.position.set(0.65, 0.75, 0);
    rightArm.rotation.z = -0.4;
    group.add(rightArm);

    return group;
  }
}
