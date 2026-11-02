import * as THREE from 'three';
import { ProceduralMeshBuilder } from './procedural-mesh-builder';

export interface PropPrefabData {
  group: THREE.Group;
  type: string;
  tier: number;
  radius: number;
  height: number;
  points: number;
}

export class PrefabFactory {
  // Shared materials for memory efficiency & draw-call batching
  private static matOrangeCone = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.45 });
  private static matWhiteStripe = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
  private static matDarkRubber = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
  private static matRedHydrant = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45 });
  private static matGoldMetal = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.4 });
  private static matDarkMetal = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.3 });
  private static matTreeTrunk = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
  private static matFoliage1 = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.5 });
  private static matFoliage2 = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.5 });
  private static matCarGlass = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.5 });
  private static matTire = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
  private static matBusBody = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.45 });
  private static matBuildingCream = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.6 });
  private static matBuildingPastelBlue = new THREE.MeshStandardMaterial({ color: 0xbae6fd, roughness: 0.55 });
  private static matBuildingMint = new THREE.MeshStandardMaterial({ color: 0xa7f3d0, roughness: 0.55 });
  private static matBuildingCoral = new THREE.MeshStandardMaterial({ color: 0xfecdd3, roughness: 0.55 });
  private static matRoofTile = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 });
  private static matSkyscraperGlass = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.25, metalness: 0.3 });

  // 1. Traffic Cone (Tier 1, required radius >= 1.0)
  public static createTornadoMesh(): THREE.Group {
    const group = new THREE.Group();
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.3,
      transparent: true,
      opacity: 0.65,
    });
    for (let i = 0; i < 4; i++) {
      const radius = 1.2 + i * 0.9;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.22, 8, 24), ringMat);
      ring.position.y = 0.5 + i * 1.5;
      ring.rotation.x = Math.PI / 2;
      group.add(ring);
    }
    return group;
  }

  public static createTauntSprite(emojiText: string): THREE.Sprite {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(4, 4, 120, 56, 16);
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = '28px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#1e293b';
    ctx.fillText(emojiText, 64, 34);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.5, 1.8, 1.0);
    return sprite;
  }

  public static createTrafficCone(): PropPrefabData {
    const group = new THREE.Group();

    // Base square
    const baseGeo = new THREE.BoxGeometry(0.7, 0.08, 0.7);
    const baseMesh = new THREE.Mesh(baseGeo, this.matOrangeCone);
    baseMesh.position.y = 0.04;
    baseMesh.castShadow = true;
    group.add(baseMesh);

    // Cone body
    const coneGeo = new THREE.CylinderGeometry(0.08, 0.28, 0.85, 12);
    const coneMesh = new THREE.Mesh(coneGeo, this.matOrangeCone);
    coneMesh.position.y = 0.46;
    coneMesh.castShadow = true;
    group.add(coneMesh);

    // White reflective ring
    const stripeGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.2, 12);
    const stripeMesh = new THREE.Mesh(stripeGeo, this.matWhiteStripe);
    stripeMesh.position.y = 0.45;
    group.add(stripeMesh);

    return {
      group,
      type: 'traffic_cone',
      tier: 1,
      radius: 0.5,
      height: 0.9,
      points: 5,
    };
  }

  // 2. Fire Hydrant (Tier 1, required radius >= 1.0)
  public static createFireHydrant(): PropPrefabData {
    const group = new THREE.Group();

    // Base rim
    const baseGeo = new THREE.CylinderGeometry(0.26, 0.3, 0.15, 12);
    const base = new THREE.Mesh(baseGeo, this.matDarkRubber);
    base.position.y = 0.075;
    group.add(base);

    // Main barrel
    const barrelGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.7, 12);
    const barrel = new THREE.Mesh(barrelGeo, this.matRedHydrant);
    barrel.position.y = 0.45;
    barrel.castShadow = true;
    group.add(barrel);

    // Top Dome
    const domeGeo = new THREE.SphereGeometry(0.22, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const dome = new THREE.Mesh(domeGeo, this.matRedHydrant);
    dome.position.y = 0.8;
    group.add(dome);

    // Side nozzle caps
    const nozzleGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.6, 8);
    nozzleGeo.rotateZ(Math.PI * 0.5);
    const nozzle = new THREE.Mesh(nozzleGeo, this.matGoldMetal);
    nozzle.position.y = 0.5;
    group.add(nozzle);

    return {
      group,
      type: 'fire_hydrant',
      tier: 1,
      radius: 0.55,
      height: 0.95,
      points: 8,
    };
  }

  // 3. Park Tree (Tier 2, required radius >= 1.6)
  public static createParkTree(): PropPrefabData {
    const group = new THREE.Group();

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.25, 0.38, 1.8, 8);
    const trunk = new THREE.Mesh(trunkGeo, this.matTreeTrunk);
    trunk.position.y = 0.9;
    trunk.castShadow = true;
    group.add(trunk);

    // Foliage layers (grouped stylized spheres)
    const folGeo1 = new THREE.DodecahedronGeometry(1.2, 1);
    const fol1 = new THREE.Mesh(folGeo1, this.matFoliage1);
    fol1.position.y = 2.4;
    fol1.scale.set(1.1, 1.0, 1.1);
    fol1.castShadow = true;
    group.add(fol1);

    const folGeo2 = new THREE.DodecahedronGeometry(0.9, 1);
    const fol2 = new THREE.Mesh(folGeo2, this.matFoliage2);
    fol2.position.set(0.2, 3.1, -0.1);
    fol2.castShadow = true;
    group.add(fol2);

    return {
      group,
      type: 'park_tree',
      tier: 2,
      radius: 1.25,
      height: 3.8,
      points: 18,
    };
  }

  // 4. Street Lamp (Tier 2, required radius >= 1.6)
  public static createStreetLamp(): PropPrefabData {
    const group = new THREE.Group();

    // Pole
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 3.0, 8);
    const pole = new THREE.Mesh(poleGeo, this.matDarkMetal);
    pole.position.y = 1.5;
    pole.castShadow = true;
    group.add(pole);

    // Curved head
    const armGeo = new THREE.BoxGeometry(0.7, 0.08, 0.1);
    const arm = new THREE.Mesh(armGeo, this.matDarkMetal);
    arm.position.set(0.3, 3.0, 0);
    group.add(arm);

    // Lantern
    const lanternGeo = new THREE.BoxGeometry(0.25, 0.2, 0.25);
    const lantern = new THREE.Mesh(lanternGeo, this.matGoldMetal);
    lantern.position.set(0.6, 2.9, 0);
    group.add(lantern);

    return {
      group,
      type: 'street_lamp',
      tier: 2,
      radius: 1.1,
      height: 3.2,
      points: 15,
    };
  }

  // 5. Sedan Car (Tier 2, required radius >= 1.65)
  public static createSedanCar(colorVariant = 0): PropPrefabData {
    const primaryHex = colorVariant === 0 ? 0xfacc15 : colorVariant === 1 ? 0xf43f5e : 0x06b6d4;
    const secondaryHex = colorVariant === 0 ? 0xd97706 : colorVariant === 1 ? 0xbe123c : 0x0284c7;
    const group = ProceduralMeshBuilder.createCarChassis(2.8, 1.45, 0.72, {
      baseColorHex: primaryHex,
      stripeColorHex: 0xffffff,
      accentColorHex: secondaryHex,
      numberText: String((colorVariant + 1) * 11),
      hasCarbonHood: false,
    });

    const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.24, 12);
    wheelGeo.rotateZ(Math.PI * 0.5);
    const wheelPositions = [
      [-0.78, 0.28, 0.9],
      [0.78, 0.28, 0.9],
      [-0.78, 0.28, -0.9],
      [0.78, 0.28, -0.9],
    ];
    wheelPositions.forEach(([x, y, z]) => {
      const w = new THREE.Mesh(wheelGeo, this.matTire);
      w.position.set(x, y, z);
      w.castShadow = true;
      group.add(w);
    });

    return {
      group,
      type: 'sedan_car',
      tier: 2,
      radius: 1.5,
      height: 1.3,
      points: 25,
    };
  }

  // 6. City Bus (Tier 3, required radius >= 2.5)
  public static createCityBus(): PropPrefabData {
    const group = new THREE.Group();

    // Bus body
    const bodyGeo = new THREE.BoxGeometry(2.3, 1.6, 5.8);
    const body = new THREE.Mesh(bodyGeo, this.matBusBody);
    body.position.y = 1.1;
    body.castShadow = true;
    group.add(body);

    // Panoramic window band
    const winGeo = new THREE.BoxGeometry(2.34, 0.5, 5.2);
    const win = new THREE.Mesh(winGeo, this.matCarGlass);
    win.position.set(0, 1.35, 0);
    group.add(win);

    // Roof A/C unit
    const acGeo = new THREE.BoxGeometry(1.2, 0.25, 1.8);
    const ac = new THREE.Mesh(acGeo, this.matWhiteStripe);
    ac.position.set(0, 1.95, 0.2);
    group.add(ac);

    // 6 Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 12);
    wheelGeo.rotateZ(Math.PI * 0.5);

    const wheelPositions = [
      [-1.2, 0.38, 2.0],
      [1.2, 0.38, 2.0],
      [-1.2, 0.38, -1.2],
      [1.2, 0.38, -1.2],
      [-1.2, 0.38, -2.1],
      [1.2, 0.38, -2.1],
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const w = new THREE.Mesh(wheelGeo, this.matTire);
      w.position.set(x, y, z);
      group.add(w);
    });

    return {
      group,
      type: 'city_bus',
      tier: 3,
      radius: 2.3,
      height: 2.2,
      points: 55,
    };
  }

  // 7. Townhouse / Shop (Tier 4, required radius >= 3.6)
  public static createTownhouse(variant = 0): PropPrefabData {
    const group = new THREE.Group();
    const wallMat = variant === 0 ? this.matBuildingCream : variant === 1 ? this.matBuildingPastelBlue : this.matBuildingMint;

    // Building body
    const bldgGeo = new THREE.BoxGeometry(4.2, 4.8, 4.2);
    const bldg = new THREE.Mesh(bldgGeo, wallMat);
    bldg.position.y = 2.4;
    bldg.castShadow = true;
    group.add(bldg);

    // Architectural window rows (Front & Back)
    const winGeo = new THREE.BoxGeometry(1.1, 0.85, 4.28);
    for (let row = 0; row < 2; row++) {
      for (let col = -1; col <= 1; col += 2) {
        const win = new THREE.Mesh(winGeo, this.matSkyscraperGlass);
        win.position.set(col * 1.05, 2.6 + row * 1.35, 0);
        group.add(win);
      }
    }

    // Slanted Roof + Chimney
    const roofGeo = new THREE.ConeGeometry(3.6, 1.6, 4);
    roofGeo.rotateY(Math.PI * 0.25);
    const roof = new THREE.Mesh(roofGeo, this.matRoofTile);
    roof.position.y = 5.6;
    roof.castShadow = true;
    group.add(roof);

    // Ground Shop Awning + Entrance Door
    const awningGeo = new THREE.BoxGeometry(3.6, 0.32, 1.1);
    awningGeo.rotateX(0.22);
    const awning = new THREE.Mesh(awningGeo, variant === 1 ? this.matRedHydrant : this.matOrangeCone);
    awning.position.set(0, 1.85, 2.35);
    group.add(awning);

    const doorGeo = new THREE.BoxGeometry(1.2, 1.5, 0.15);
    const door = new THREE.Mesh(doorGeo, this.matDarkMetal);
    door.position.set(0, 0.75, 2.12);
    group.add(door);

    return {
      group,
      type: 'townhouse',
      tier: 4,
      radius: 3.2,
      height: 6.4,
      points: 130,
    };
  }

  // 8. Modern Skyscraper (Tier 5, required radius >= 4.9)
  public static createSkyscraper(): PropPrefabData {
    const group = new THREE.Group();

    // Tower base
    const baseGeo = new THREE.BoxGeometry(5.4, 9.0, 5.4);
    const base = new THREE.Mesh(baseGeo, this.matBuildingCoral);
    base.position.y = 4.5;
    base.castShadow = true;
    group.add(base);

    // Wrap-around glass window bands on base tower
    const bandGeo = new THREE.BoxGeometry(5.52, 0.9, 5.52);
    for (let b = 0; b < 4; b++) {
      const band = new THREE.Mesh(bandGeo, this.matSkyscraperGlass);
      band.position.y = 2.0 + b * 2.0;
      group.add(band);
    }

    // Tower middle glass tier
    const midGeo = new THREE.BoxGeometry(4.1, 7.0, 4.1);
    const mid = new THREE.Mesh(midGeo, this.matSkyscraperGlass);
    mid.position.y = 12.5;
    mid.castShadow = true;
    group.add(mid);

    // White architectural crown frame
    const crownGeo = new THREE.BoxGeometry(4.35, 0.65, 4.35);
    const crown = new THREE.Mesh(crownGeo, this.matWhiteStripe);
    crown.position.y = 16.0;
    group.add(crown);

    // Rooftop Spire
    const spireGeo = new THREE.CylinderGeometry(0.1, 0.35, 3.5, 8);
    const spire = new THREE.Mesh(spireGeo, this.matGoldMetal);
    spire.position.y = 17.8;
    group.add(spire);

    return {
      group,
      type: 'skyscraper',
      tier: 5,
      radius: 4.5,
      height: 19.5,
      points: 380,
    };
  }
}
