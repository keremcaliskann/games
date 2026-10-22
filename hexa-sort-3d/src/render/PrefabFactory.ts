import * as THREE from 'three';
import { GAME_CONFIG, HEX_COLORS, HexColorDef } from '../game/config/game-config';

export class PrefabFactory {
  // Shared geometries
  private static cellOuterGeo: THREE.CylinderGeometry | null = null;
  private static cellInnerGeo: THREE.CylinderGeometry | null = null;
  private static tileGeo: THREE.CylinderGeometry | null = null;
  private static tileEmbossGeo: THREE.CylinderGeometry | null = null;

  // Shared materials
  private static cellBaseMat: THREE.MeshStandardMaterial | null = null;
  private static cellRimMat: THREE.MeshStandardMaterial | null = null;
  private static cellHoverMat: THREE.MeshStandardMaterial | null = null;
  private static cellValidMat: THREE.MeshStandardMaterial | null = null;

  private static tileMaterials = new Map<string, THREE.MeshStandardMaterial>();
  private static tileEmbossMat: THREE.MeshStandardMaterial | null = null;

  public static init(): void {
    const r = GAME_CONFIG.hex.radius;
    const h = GAME_CONFIG.hex.height;

    // 1. Cell geometries
    this.cellOuterGeo = new THREE.CylinderGeometry(r * 1.04, r * 1.08, 0.22, 6);
    this.cellInnerGeo = new THREE.CylinderGeometry(r * 0.94, r * 0.94, 0.06, 6);

    // 2. Tile geometry (beveled hex cylinder)
    this.tileGeo = new THREE.CylinderGeometry(r * 0.9, r * 0.9, h, 6);
    this.tileEmbossGeo = new THREE.CylinderGeometry(r * 0.42, r * 0.42, 0.02, 6);

    // 3. Cell materials (Rule 32 Toony Soft Daylight)
    this.cellBaseMat = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.board.foundationColor,
      roughness: 0.55,
      metalness: 0.04,
    });

    this.cellRimMat = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.board.cellBorderColor,
      roughness: 0.6,
      metalness: 0.06,
    });

    this.cellHoverMat = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.board.hoverColor,
      roughness: 0.35,
      metalness: 0.1,
      emissive: 0xfef08a,
      emissiveIntensity: 0.35,
    });

    this.cellValidMat = new THREE.MeshStandardMaterial({
      color: GAME_CONFIG.board.activeColor,
      roughness: 0.3,
      metalness: 0.1,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.4,
    });

    // 4. Tile materials for each color definition
    for (const c of HEX_COLORS) {
      const mat = new THREE.MeshStandardMaterial({
        color: c.hex,
        roughness: 0.48,
        metalness: 0.08,
      });
      this.tileMaterials.set(c.id, mat);
    }

    this.tileEmbossMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.55,
    });
  }

  /**
   * Creates a 3D hex slot mesh on the honeycomb board
   */
  public static createHexCellMesh(): { root: THREE.Group; innerMesh: THREE.Mesh } {
    if (!this.cellOuterGeo) this.init();

    const group = new THREE.Group();

    // Outer rim bevel
    const outer = new THREE.Mesh(this.cellOuterGeo!, this.cellRimMat!);
    outer.receiveShadow = true;
    outer.castShadow = true;
    group.add(outer);

    // Inner plateau
    const inner = new THREE.Mesh(this.cellInnerGeo!, this.cellBaseMat!);
    inner.position.y = 0.09;
    inner.receiveShadow = true;
    group.add(inner);

    return { root: group, innerMesh: inner };
  }

  /**
   * Sets cell highlight state: default, hover, or valid target
   */
  public static setCellHighlight(innerMesh: THREE.Mesh, state: 'normal' | 'hover' | 'valid'): void {
    if (state === 'hover') {
      innerMesh.material = this.cellHoverMat!;
    } else if (state === 'valid') {
      innerMesh.material = this.cellValidMat!;
    } else {
      innerMesh.material = this.cellBaseMat!;
    }
  }

  /**
   * Creates a single 3D hexagonal tile
   */
  public static createTileMesh(colorDef: HexColorDef): THREE.Group {
    if (!this.tileGeo) this.init();

    const group = new THREE.Group();
    const mat = this.tileMaterials.get(colorDef.id) || this.tileMaterials.get('coral')!;

    const body = new THREE.Mesh(this.tileGeo!, mat);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // Subtle embossed top concentric facet
    const decal = new THREE.Mesh(this.tileEmbossGeo!, this.tileEmbossMat!);
    decal.position.y = GAME_CONFIG.hex.height * 0.5 + 0.01;
    group.add(decal);

    return group;
  }

  /**
   * Creates the 3-dock tray platform at the bottom
   */
  public static createTrayPlatform(): THREE.Group {
    const group = new THREE.Group();

    const trayMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede2,
      roughness: 0.55,
      metalness: 0.05,
    });

    const dockMat = new THREE.MeshStandardMaterial({
      color: 0xe8e0d2,
      roughness: 0.65,
    });

    // Main rounded biscuit backplate
    const baseGeo = new THREE.BoxGeometry(7.6, 0.22, 2.6);
    const base = new THREE.Mesh(baseGeo, trayMat);
    base.position.y = -0.11;
    base.receiveShadow = true;
    group.add(base);

    // 3 sunken docks for the 3 tray slots
    const dockGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.04, 6);
    const xOffsets = [-2.4, 0, 2.4];
    for (const x of xOffsets) {
      const dock = new THREE.Mesh(dockGeo, dockMat);
      dock.position.set(x, 0.01, 0);
      dock.receiveShadow = true;
      group.add(dock);
    }

    return group;
  }
}
