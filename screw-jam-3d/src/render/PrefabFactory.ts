import * as THREE from 'three';
import { ColorDef, GAME_CONFIG } from '../game/config/game-config';

export class PrefabFactory {
  // Shared geometries
  private static screwHeadGeo: THREE.CylinderGeometry | null = null;
  private static screwShaftGeo: THREE.CylinderGeometry | null = null;
  private static crossSlotGeo: THREE.BoxGeometry | null = null;

  public static getScrewGeometries(): {
    headGeo: THREE.CylinderGeometry;
    shaftGeo: THREE.CylinderGeometry;
    slotGeo: THREE.BoxGeometry;
  } {
    if (!this.screwHeadGeo) {
      this.screwHeadGeo = new THREE.CylinderGeometry(
        GAME_CONFIG.screwHeadRadius,
        GAME_CONFIG.screwHeadRadius * 0.9,
        0.16,
        16
      );
      this.screwShaftGeo = new THREE.CylinderGeometry(
        GAME_CONFIG.screwHeadRadius * 0.42,
        GAME_CONFIG.screwHeadRadius * 0.38,
        GAME_CONFIG.screwShaftLength,
        12
      );
      this.crossSlotGeo = new THREE.BoxGeometry(0.32, 0.08, 0.07);
    }
    return {
      headGeo: this.screwHeadGeo!,
      shaftGeo: this.screwShaftGeo!,
      slotGeo: this.crossSlotGeo!,
    };
  }

  /**
   * Compound Procedural 3D Screw Entity
   */
  public static createScrewMesh(color: ColorDef): {
    group: THREE.Group;
    headMesh: THREE.Mesh;
    shaftMesh: THREE.Mesh;
    slot1: THREE.Mesh;
    slot2: THREE.Mesh;
  } {
    const { headGeo, shaftGeo, slotGeo } = this.getScrewGeometries();

    // Metallic PBR material for the bolt head
    const headMat = new THREE.MeshStandardMaterial({
      color: color.hex,
      metalness: 0.65,
      roughness: 0.35,
      emissive: color.emissiveHex,
      emissiveIntensity: 0.15,
    });

    const shaftMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8, // Galvanized steel shaft
      metalness: 0.75,
      roughness: 0.3,
    });

    const slotMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    });

    const group = new THREE.Group();
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headMesh.position.y = GAME_CONFIG.screwShaftLength * 0.5 + 0.08;

    const shaftMesh = new THREE.Mesh(shaftGeo, shaftMat);
    shaftMesh.castShadow = true;
    shaftMesh.receiveShadow = true;

    // Cross-head screwdriver slots
    const slot1 = new THREE.Mesh(slotGeo, slotMat);
    slot1.position.y = headMesh.position.y + 0.05;

    const slot2 = new THREE.Mesh(slotGeo, slotMat);
    slot2.rotation.y = Math.PI / 2;
    slot2.position.y = headMesh.position.y + 0.05;

    group.add(shaftMesh);
    group.add(headMesh);
    group.add(slot1);
    group.add(slot2);

    return { group, headMesh, shaftMesh, slot1, slot2 };
  }

  /**
   * Compound Procedural Acrylic Plate with Drilled Pin Holes
   */
  public static createPlateMesh(
    width: number,
    height: number,
    holes: { x: number; y: number }[],
    color: ColorDef,
    cornerRadius = 0.4
  ): { group: THREE.Group; mesh: THREE.Mesh } {
    const shape = new THREE.Shape();
    const halfW = width / 2;
    const halfH = height / 2;
    const r = Math.min(cornerRadius, halfW, halfH);

    // Rounded rectangle path
    shape.moveTo(-halfW + r, -halfH);
    shape.lineTo(halfW - r, -halfH);
    shape.quadraticCurveTo(halfW, -halfH, halfW, -halfH + r);
    shape.lineTo(halfW, halfH - r);
    shape.quadraticCurveTo(halfW, halfH, halfW - r, halfH);
    shape.lineTo(-halfW + r, halfH);
    shape.quadraticCurveTo(-halfW, halfH, -halfW, halfH - r);
    shape.lineTo(-halfW, -halfH + r);
    shape.quadraticCurveTo(-halfW, -halfH, -halfW + r, -halfH);

    // Subtract drilled circular holes
    const holeRadius = GAME_CONFIG.screwHeadRadius * 0.52;
    for (const h of holes) {
      const holePath = new THREE.Path();
      holePath.absarc(h.x, h.y, holeRadius, 0, Math.PI * 2, true);
      shape.holes.push(holePath);
    }

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: GAME_CONFIG.plateThickness,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center geometry along thickness
    geometry.center();

    // Translucent Frosted Acrylic Material
    const material = new THREE.MeshStandardMaterial({
      color: color.hex,
      roughness: 0.28,
      metalness: 0.04,
      transparent: true,
      opacity: 0.88,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const group = new THREE.Group();
    group.add(mesh);

    return { group, mesh };
  }

  /**
   * 3-Slot Color-Coded Toolbox Container
   */
  public static createToolboxMesh(color: ColorDef): {
    group: THREE.Group;
    bodyMesh: THREE.Mesh;
    socketRings: THREE.Mesh[];
  } {
    const group = new THREE.Group();

    // Main box body
    const bodyGeo = new THREE.BoxGeometry(2.4, 0.45, 0.9);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: color.hex,
      roughness: 0.45,
      metalness: 0.08,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    // 3 Socket Indentations
    const socketGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16);
    const socketMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
    });

    const socketRings: THREE.Mesh[] = [];
    const offsets = [-0.75, 0, 0.75];

    for (let i = 0; i < 3; i++) {
      const socket = new THREE.Mesh(socketGeo, socketMat);
      socket.position.set(offsets[i], 0.22, 0);
      group.add(socket);
      socketRings.push(socket);
    }

    return { group, bodyMesh, socketRings };
  }
}
