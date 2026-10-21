import * as THREE from 'three';
import { ColorDef, GAME_CONFIG } from '../game/config/game-config';

export class PrefabFactory {
  private static sharedMaterials = new Map<string, THREE.Material>();

  private static getMaterial(key: string, create: () => THREE.Material): THREE.Material {
    let mat = this.sharedMaterials.get(key);
    if (!mat) {
      mat = create();
      this.sharedMaterials.set(key, mat);
    }
    return mat;
  }

  /**
   * Constructs a Compound Procedural 3D Polyomino Block mesh with glossy toy-plastic feel,
   * beveled top face, and embossed directional arrow indicator.
   */
  public static createBlockMesh(
    cells: { x: number; y: number }[],
    color: ColorDef
  ): { group: THREE.Group; interactiveMeshes: THREE.Mesh[] } {
    const group = new THREE.Group();
    const interactiveMeshes: THREE.Mesh[] = [];

    const cs = GAME_CONFIG.cellSize;
    const height = 0.95;
    const margin = 0.06;
    const unitSize = cs - margin * 2;

    const blockMat = this.getMaterial(`block_${color.id}`, () => {
      return new THREE.MeshStandardMaterial({
        color: color.hex,
        roughness: 0.18,
        metalness: 0.08,
        flatShading: false,
      });
    }) as THREE.MeshStandardMaterial;

    const accentMat = this.getMaterial(`block_accent_${color.id}`, () => {
      return new THREE.MeshStandardMaterial({
        color: color.accentHex,
        roughness: 0.25,
        metalness: 0.1,
      });
    }) as THREE.MeshStandardMaterial;

    // Base geometry for each unit cube in the polyomino
    const cubeGeo = new THREE.BoxGeometry(unitSize, height, unitSize);
    const topCapGeo = new THREE.BoxGeometry(unitSize * 0.85, 0.08, unitSize * 0.85);

    // Calculate center offset so group origin is centered on the polyomino bounds
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    for (const c of cells) {
      minX = Math.min(minX, c.x);
      maxX = Math.max(maxX, c.x);
      minY = Math.min(minY, c.y);
      maxY = Math.max(maxY, c.y);
    }
    const centerOffsetX = ((minX + maxX) / 2) * cs;
    const centerOffsetY = ((minY + maxY) / 2) * cs;

    for (const c of cells) {
      const posX = c.x * cs - centerOffsetX;
      const posZ = c.y * cs - centerOffsetY;

      // 1. Main Cube Body
      const bodyMesh = new THREE.Mesh(cubeGeo, blockMat);
      bodyMesh.position.set(posX, height / 2, posZ);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      group.add(bodyMesh);
      interactiveMeshes.push(bodyMesh);

      // 2. Embossed Top Cap with Accent Color
      const capMesh = new THREE.Mesh(topCapGeo, accentMat);
      capMesh.position.set(posX, height + 0.04, posZ);
      capMesh.castShadow = true;
      group.add(capMesh);
      interactiveMeshes.push(capMesh);

      // 3. Subtle Corner Rivets / Studs for tactile toy texture
      const studGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.06, 8);
      const studOffsets = [
        [-unitSize * 0.28, -unitSize * 0.28],
        [unitSize * 0.28, -unitSize * 0.28],
        [-unitSize * 0.28, unitSize * 0.28],
        [unitSize * 0.28, unitSize * 0.28],
      ];
      for (const [ox, oz] of studOffsets) {
        const stud = new THREE.Mesh(studGeo, accentMat);
        stud.position.set(posX + ox, height + 0.09, posZ + oz);
        group.add(stud);
      }
    }

    return { group, interactiveMeshes };
  }

  /**
   * Constructs a Compound Procedural Shredder Gate at perimeter with dual rotating
   * cylindrical rollers and color warning chevron lights.
   */
  public static createShredderGateMesh(
    color: ColorDef,
    spanCells = 1
  ): {
    group: THREE.Group;
    roller1: THREE.Mesh;
    roller2: THREE.Mesh;
    lightBar: THREE.Mesh;
  } {
    const group = new THREE.Group();
    const cs = GAME_CONFIG.cellSize;
    const gateWidth = spanCells * cs + 0.4;
    const gateHeight = 1.6;
    const gateDepth = 1.1;

    // Crisp light-silver/white painted chassis for bright daylight pop
    const steelMat = this.getMaterial('gate_steel', () => {
      return new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.25,
        metalness: 0.12,
      });
    });

    const rollerMat = this.getMaterial('gate_roller', () => {
      return new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.18,
        metalness: 0.85,
      });
    });

    const glowMat = this.getMaterial(`gate_glow_${color.id}`, () => {
      return new THREE.MeshStandardMaterial({
        color: color.hex,
        emissive: color.hex,
        emissiveIntensity: 1.6,
        roughness: 0.2,
      });
    }) as THREE.MeshStandardMaterial;

    // 1. Arch Posts (Left & Right)
    const postGeo = new THREE.BoxGeometry(0.35, gateHeight, gateDepth);
    const postL = new THREE.Mesh(postGeo, steelMat);
    postL.position.set(-gateWidth / 2 + 0.175, gateHeight / 2, 0);
    postL.castShadow = true;
    group.add(postL);

    const postR = new THREE.Mesh(postGeo, steelMat);
    postR.position.set(gateWidth / 2 - 0.175, gateHeight / 2, 0);
    postR.castShadow = true;
    group.add(postR);

    // 2. Top Crossbeam
    const beamGeo = new THREE.BoxGeometry(gateWidth, 0.45, gateDepth);
    const topBeam = new THREE.Mesh(beamGeo, steelMat);
    topBeam.position.set(0, gateHeight - 0.225, 0);
    topBeam.castShadow = true;
    group.add(topBeam);

    // 3. Color Light Bar / Warning Chevron
    const lightGeo = new THREE.BoxGeometry(gateWidth * 0.8, 0.12, gateDepth + 0.05);
    const lightBar = new THREE.Mesh(lightGeo, glowMat);
    lightBar.position.set(0, gateHeight - 0.225, 0);
    group.add(lightBar);

    // 4. Dual Rotating Steel Shredder Rollers with Teeth
    const rollerRadius = 0.22;
    const rollerLength = gateWidth - 0.8;
    const rollerGeo = new THREE.CylinderGeometry(rollerRadius, rollerRadius, rollerLength, 12);
    rollerGeo.rotateZ(Math.PI / 2); // Align cylinder across opening

    const roller1 = new THREE.Mesh(rollerGeo, rollerMat);
    roller1.position.set(0, 0.45, -0.2);
    roller1.castShadow = true;
    group.add(roller1);

    const roller2 = new THREE.Mesh(rollerGeo, rollerMat);
    roller2.position.set(0, 0.45, 0.2);
    roller2.castShadow = true;
    group.add(roller2);

    // Add teeth ridges to roller 1 & 2
    const toothGeo = new THREE.BoxGeometry(rollerLength * 0.95, 0.08, 0.08);
    for (let a = 0; a < 4; a++) {
      const angle = (a * Math.PI) / 2;
      const tooth1 = new THREE.Mesh(toothGeo, steelMat);
      tooth1.position.set(0, Math.sin(angle) * rollerRadius, Math.cos(angle) * rollerRadius);
      roller1.add(tooth1);

      const tooth2 = new THREE.Mesh(toothGeo, steelMat);
      tooth2.position.set(0, Math.sin(angle) * rollerRadius, Math.cos(angle) * rollerRadius);
      roller2.add(tooth2);
    }

    // 5. Intake Guide Slit
    const slitMat = this.getMaterial('gate_intake_slit', () => {
      return new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4 });
    });
    const slitGeo = new THREE.BoxGeometry(gateWidth - 0.7, 0.8, 0.15);
    const slit = new THREE.Mesh(slitGeo, slitMat);
    slit.position.set(0, 0.45, 0);
    group.add(slit);

    return { group, roller1, roller2, lightBar };
  }

  /**
   * Constructs the Floating 3D Board platform with beveled grid cells and zero bottom occlusion.
   */
  public static createBoardPlatform(
    cols: number,
    rows: number
  ): THREE.Group {
    const group = new THREE.Group();
    const cs = GAME_CONFIG.cellSize;
    const width = cols * cs;
    const depth = rows * cs;
    const thickness = 0.35;

    // Platform Base Frame (Bright porcelain floating island)
    const baseMat = this.getMaterial('board_base', () => {
      return new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.35,
        metalness: 0.05,
      });
    });

    const rimMat = this.getMaterial('board_rim', () => {
      return new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.3,
        metalness: 0.1,
      });
    });

    const tileMatDark = this.getMaterial('tile_dark', () => {
      return new THREE.MeshStandardMaterial({
        color: 0xf0f9ff, // Soft cheerful pastel cyan
        roughness: 0.35,
        metalness: 0.05,
      });
    });

    const tileMatLight = this.getMaterial('tile_light', () => {
      return new THREE.MeshStandardMaterial({
        color: 0xffffff, // Pure crisp cloud white
        roughness: 0.35,
        metalness: 0.05,
      });
    });

    // 1. Floating Base Slab
    const baseGeo = new THREE.BoxGeometry(width + 0.3, thickness, depth + 0.3);
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, -thickness / 2, 0);
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // 2. Beveled Outer Rim
    const rimGeo = new THREE.BoxGeometry(width + 0.5, 0.15, depth + 0.5);
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.position.set(0, -thickness - 0.07, 0);
    group.add(rimMesh);

    // 3. Grid Cell Tiles
    const tileGeo = new THREE.BoxGeometry(cs - 0.08, 0.05, cs - 0.08);
    const startX = -((cols - 1) / 2) * cs;
    const startZ = -((rows - 1) / 2) * cs;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isChecker = (r + c) % 2 === 0;
        const tile = new THREE.Mesh(tileGeo, isChecker ? tileMatDark : tileMatLight);
        tile.position.set(startX + c * cs, 0.02, startZ + r * cs);
        tile.receiveShadow = true;
        group.add(tile);
      }
    }

    return group;
  }
}
