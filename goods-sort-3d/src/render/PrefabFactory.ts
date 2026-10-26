import * as THREE from 'three';

export interface ItemVisualMeta {
  typeId: string;
  name: string;
  primaryColor: number;
  labelEmoji: string;
}

export const ITEM_TYPES: ItemVisualMeta[] = [
  { typeId: 'soda_cola', name: 'Star Cola', primaryColor: 0xef4444, labelEmoji: '⭐' },
  { typeId: 'soda_lemon', name: 'Lemon Lime', primaryColor: 0x84cc16, labelEmoji: '🍋' },
  { typeId: 'snack_chips', name: 'Crunch Chips', primaryColor: 0xf59e0b, labelEmoji: '🥔' },
  { typeId: 'jam_berry', name: 'Berry Jam', primaryColor: 0xd946ef, labelEmoji: '🍓' },
  { typeId: 'milk_carton', name: 'Fresh Milk', primaryColor: 0x38bdf8, labelEmoji: '🥛' },
  { typeId: 'juice_orange', name: 'Sunny Orange', primaryColor: 0xf97316, labelEmoji: '🍊' },
  { typeId: 'energy_drink', name: 'Volt Energy', primaryColor: 0x8b5cf6, labelEmoji: '⚡' },
];

export class PrefabFactory {
  private static textureCache = new Map<string, THREE.CanvasTexture>();

  public static createCabinet(tiers: number = 3, cols: number = 3): {
    root: THREE.Group;
    getSlotPos: (tier: number, col: number, slotIndex: number, isVip?: boolean) => THREE.Vector3;
    compartmentWidth: number;
    compartmentHeight: number;
  } {
    const root = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.6,
      metalness: 0.05,
    });
    const backMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.85,
    });
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xb45309,
      roughness: 0.5,
      metalness: 0.1,
    });

    const compWidth = 2.6;
    const compHeight = 2.2;
    const shelfDepth = 2.4;

    const totalWidth = cols * compWidth;
    const totalHeight = tiers * compHeight;

    // Backboard
    const backGeo = new THREE.BoxGeometry(totalWidth + 0.4, totalHeight + 0.4, 0.2);
    const backMesh = new THREE.Mesh(backGeo, backMat);
    backMesh.position.set(0, totalHeight / 2, -shelfDepth / 2 - 0.1);
    backMesh.receiveShadow = true;
    root.add(backMesh);

    // Outer Frame Left & Right
    const sideGeo = new THREE.BoxGeometry(0.3, totalHeight + 0.5, shelfDepth);
    const leftSide = new THREE.Mesh(sideGeo, rimMat);
    leftSide.position.set(-totalWidth / 2 - 0.15, totalHeight / 2, 0);
    leftSide.castShadow = true;
    leftSide.receiveShadow = true;
    root.add(leftSide);

    const rightSide = leftSide.clone();
    rightSide.position.x = totalWidth / 2 + 0.15;
    root.add(rightSide);

    // Shelves (Horizontal planks)
    const shelfGeo = new THREE.BoxGeometry(totalWidth + 0.4, 0.22, shelfDepth);
    for (let t = 0; t <= tiers; t++) {
      const shelf = new THREE.Mesh(shelfGeo, woodMat);
      shelf.position.set(0, t * compHeight, 0);
      shelf.castShadow = true;
      shelf.receiveShadow = true;
      root.add(shelf);
    }

    // Dividers (Vertical planks)
    const dividerGeo = new THREE.BoxGeometry(0.18, totalHeight, shelfDepth - 0.2);
    for (let c = 1; c < cols; c++) {
      const divider = new THREE.Mesh(dividerGeo, woodMat);
      const x = -totalWidth / 2 + c * compWidth;
      divider.position.set(x, totalHeight / 2, 0);
      divider.castShadow = true;
      divider.receiveShadow = true;
      root.add(divider);
    }

    // VIP Bottom Tray (Initially placed just below the main cabinet)
    const vipTrayGeo = new THREE.BoxGeometry(totalWidth * 0.85, 0.25, shelfDepth * 0.9);
    const vipMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.2 });
    const vipTray = new THREE.Mesh(vipTrayGeo, vipMat);
    vipTray.position.set(0, -0.6, 0.2);
    vipTray.name = 'vip_tray';
    vipTray.visible = false;
    root.add(vipTray);

    // Center the whole cabinet around Y
    root.position.y = -totalHeight / 2 + 0.8;

    const getSlotPos = (tier: number, col: number, slotIndex: number, isVip = false): THREE.Vector3 => {
      if (isVip) {
        const xOffset = (slotIndex - 1) * 0.72;
        return new THREE.Vector3(xOffset, root.position.y - 0.4, 0.2);
      }

      // X: spread 3 items horizontally within compartment
      const compCenterX = -totalWidth / 2 + col * compWidth + compWidth / 2;
      const xSlot = compCenterX + (slotIndex - 1) * 0.72;

      // Y: tier floor + offset
      const compFloorY = root.position.y + tier * compHeight + 0.65;

      // Z: front slot is z=0.55, rear slot is z=-0.35
      const zSlot = 0.55;

      return new THREE.Vector3(xSlot, compFloorY, zSlot);
    };

    return { root, getSlotPos, compartmentWidth: compWidth, compartmentHeight: compHeight };
  }

  public static createItemLabel(text: string, bgColor: string): THREE.CanvasTexture {
    const key = `${text}_${bgColor}`;
    if (this.textureCache.has(key)) return this.textureCache.get(key)!;

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 128, 128);

    ctx.fillStyle = '#ffffff';
    ctx.font = '54px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    this.textureCache.set(key, tex);
    return tex;
  }

  public static createItemMesh(typeId: string): THREE.Group {
    const group = new THREE.Group();
    const meta = ITEM_TYPES.find((m) => m.typeId === typeId) || ITEM_TYPES[0];

    const bodyMat = new THREE.MeshStandardMaterial({
      color: meta.primaryColor,
      roughness: 0.35,
      metalness: 0.1,
    });
    const silverMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.25,
      metalness: 0.6,
    });

    if (typeId.startsWith('soda_')) {
      // Cylinder Can
      const canGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.95, 20);
      const can = new THREE.Mesh(canGeo, bodyMat);
      can.castShadow = true;
      group.add(can);

      // Top silver rim
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.03, 8, 20), silverMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.48;
      group.add(rim);

      // Decal
      const decalTex = this.createItemLabel(meta.labelEmoji, '#ffffff');
      const decalMat = new THREE.MeshBasicMaterial({ map: decalTex, transparent: true });
      const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.35), decalMat);
      decal.position.set(0, 0, 0.33);
      group.add(decal);
    } else if (typeId === 'snack_chips') {
      // Snack Box
      const boxGeo = new THREE.BoxGeometry(0.68, 0.98, 0.45);
      const box = new THREE.Mesh(boxGeo, bodyMat);
      box.castShadow = true;
      group.add(box);

      const decalTex = this.createItemLabel(meta.labelEmoji, '#fef08a');
      const decalMat = new THREE.MeshBasicMaterial({ map: decalTex, transparent: true });
      const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.42), decalMat);
      decal.position.set(0, 0.05, 0.23);
      group.add(decal);
    } else if (typeId === 'jam_berry') {
      // Jam Jar
      const jarGeo = new THREE.CylinderGeometry(0.34, 0.32, 0.85, 18);
      const jar = new THREE.Mesh(jarGeo, bodyMat);
      jar.castShadow = true;
      group.add(jar);

      // Cloth Lid
      const lidMat = new THREE.MeshStandardMaterial({ color: 0xfce7f3, roughness: 0.6 });
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.36, 0.16, 18), lidMat);
      lid.position.y = 0.48;
      group.add(lid);

      const decalTex = this.createItemLabel(meta.labelEmoji, '#ffffff');
      const decalMat = new THREE.MeshBasicMaterial({ map: decalTex, transparent: true });
      const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), decalMat);
      decal.position.set(0, -0.05, 0.34);
      group.add(decal);
    } else {
      // Milk Carton / Drink Bottle
      const cartonGeo = new THREE.BoxGeometry(0.62, 0.95, 0.52);
      const carton = new THREE.Mesh(cartonGeo, bodyMat);
      carton.castShadow = true;
      group.add(carton);

      // Gable Top Roof
      const roofGeo = new THREE.ConeGeometry(0.4, 0.26, 4);
      roofGeo.rotateY(Math.PI / 4);
      const roof = new THREE.Mesh(roofGeo, silverMat);
      roof.position.y = 0.58;
      group.add(roof);

      const decalTex = this.createItemLabel(meta.labelEmoji, '#ffffff');
      const decalMat = new THREE.MeshBasicMaterial({ map: decalTex, transparent: true });
      const decal = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.38), decalMat);
      decal.position.set(0, 0, 0.27);
      group.add(decal);
    }

    return group;
  }
}
