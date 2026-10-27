import * as THREE from 'three';
import { VehicleColorDef } from '../game/config/game-config';

export class PrefabFactory {
  private static canvasCache = new Map<string, THREE.CanvasTexture>();

  public static getSeatBadgeTexture(current: number, max: number, hexColor: number): THREE.CanvasTexture {
    const key = `${current}_${max}_${hexColor}`;
    if (this.canvasCache.has(key)) {
      return this.canvasCache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Rounded background pill
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(4, 4, 120, 56, 16);
    ctx.fill();

    const hexStr = '#' + hexColor.toString(16).padStart(6, '0');
    ctx.strokeStyle = hexStr;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${current}/${max}`, 64, 34);

    const tex = new THREE.CanvasTexture(canvas);
    this.canvasCache.set(key, tex);
    return tex;
  }

  /**
   * Creates the floating parking lot island with tarmac, lane lines, and dock bays
   */
  public static createLotStage(gridWidth = 10.5, gridDepth = 10.5): THREE.Group {
    const group = new THREE.Group();

    // 1. Pedestal Base
    const baseGeo = new THREE.BoxGeometry(gridWidth + 3.0, 1.2, gridDepth + 5.5);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.65,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, -0.6, -1.0);
    base.receiveShadow = true;
    group.add(base);

    // 2. Cream/Biscuit Asphalt Ground
    const tarmacGeo = new THREE.PlaneGeometry(gridWidth + 2.4, gridDepth + 4.8);
    tarmacGeo.rotateX(-Math.PI * 0.5);
    const tarmacMat = new THREE.MeshStandardMaterial({
      color: 0xfcf8ee,
      roughness: 0.75,
      metalness: 0.05,
    });
    const tarmac = new THREE.Mesh(tarmacGeo, tarmacMat);
    tarmac.position.set(0, 0.01, -1.0);
    tarmac.receiveShadow = true;
    group.add(tarmac);

    // 3. Grid Boundary Curb
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
    const curbGeo = new THREE.BoxGeometry(gridWidth + 0.4, 0.16, 0.2);
    const northCurb = new THREE.Mesh(curbGeo, curbMat);
    northCurb.position.set(0, 0.08, -(gridDepth * 0.5) - 1.2);
    northCurb.castShadow = true;
    group.add(northCurb);

    // 4. Passenger Station Platform (Front of the bays)
    const platformGeo = new THREE.BoxGeometry(gridWidth + 1.2, 0.2, 2.4);
    const platformMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.55 });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.set(0, 0.1, 3.8);
    platform.receiveShadow = true;
    group.add(platform);

    return group;
  }

  /**
   * Creates a multi-part compound 3D Bus entity
   */
  public static createBusMesh(
    lengthTiles: number,
    colorDef: VehicleColorDef,
    capacity: number
  ): { root: THREE.Group; badgeSprite: THREE.Sprite } {
    const root = new THREE.Group();
    const length = lengthTiles * 1.5;
    const width = 1.15;
    const height = 1.05;

    // 1. Bus Body
    const bodyGeo = new THREE.BoxGeometry(width, height, length);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: colorDef.hex,
      roughness: 0.35,
      metalness: 0.12,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.65;
    body.castShadow = true;
    body.receiveShadow = true;
    root.add(body);

    // 2. White Roof Accent
    const roofGeo = new THREE.BoxGeometry(width * 0.88, 0.12, length * 0.92);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 1.22;
    roof.castShadow = true;
    root.add(roof);

    // 3. Dark Windows Ribbon
    const windowGeo = new THREE.BoxGeometry(width + 0.04, 0.38, length * 0.82);
    const windowMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
      metalness: 0.5,
    });
    const windows = new THREE.Mesh(windowGeo, windowMat);
    windows.position.y = 0.82;
    root.add(windows);

    // 4. Twin Headlights & Bumper (Facing -Z)
    const lightGeo = new THREE.SphereGeometry(0.12, 10, 10);
    const lightMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfef08a, emissiveIntensity: 0.8 });
    const lightL = new THREE.Mesh(lightGeo, lightMat);
    lightL.position.set(-0.38, 0.48, -length * 0.5 - 0.02);
    root.add(lightL);

    const lightR = new THREE.Mesh(lightGeo, lightMat);
    lightR.position.set(0.38, 0.48, -length * 0.5 - 0.02);
    root.add(lightR);

    // 5. Four Rubber Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.18, 14);
    wheelGeo.rotateZ(Math.PI * 0.5);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85 });

    const wheelZOffsets = [-length * 0.32, length * 0.32];
    for (const wz of wheelZOffsets) {
      const wheelL = new THREE.Mesh(wheelGeo, wheelMat);
      wheelL.position.set(-width * 0.5 - 0.02, 0.24, wz);
      wheelL.castShadow = true;
      root.add(wheelL);

      const wheelR = new THREE.Mesh(wheelGeo, wheelMat);
      wheelR.position.set(width * 0.5 + 0.02, 0.24, wz);
      wheelR.castShadow = true;
      root.add(wheelR);
    }

    // 6. Floating Capacity / Seat Badge
    const tex = this.getSeatBadgeTexture(0, capacity, colorDef.hex);
    const badgeMat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const badgeSprite = new THREE.Sprite(badgeMat);
    badgeSprite.scale.set(1.4, 0.7, 1.0);
    badgeSprite.position.set(0, 1.85, 0);
    root.add(badgeSprite);

    return { root, badgeSprite };
  }

  /**
   * Creates a cute passenger pawn
   */
  public static createPassengerPawn(colorDef: VehicleColorDef): THREE.Group {
    const group = new THREE.Group();

    // Body Capsule / Cylinder
    const bodyGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.55, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: colorDef.hex, roughness: 0.45 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.28;
    body.castShadow = true;
    group.add(body);

    // Head Sphere
    const headGeo = new THREE.SphereGeometry(0.22, 14, 14);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.5 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 0.68;
    head.castShadow = true;
    group.add(head);

    // Cap / Beanie matching vehicle color
    const capGeo = new THREE.SphereGeometry(0.23, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const cap = new THREE.Mesh(capGeo, bodyMat);
    cap.position.y = 0.72;
    group.add(cap);

    return group;
  }
}
