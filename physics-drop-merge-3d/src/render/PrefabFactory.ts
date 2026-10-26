import * as THREE from 'three';

export interface TierVisualDef {
  tier: number;
  name: string;
  radius: number;
  mass: number;
  color: number;
  emoji: string;
  points: number;
}

export const TIER_DEFINITIONS: TierVisualDef[] = [
  { tier: 1, name: 'Grape', radius: 0.42, mass: 0.6, color: 0xa855f7, emoji: '🍇', points: 2 },
  { tier: 2, name: 'Cherry', radius: 0.54, mass: 0.9, color: 0xef4444, emoji: '🍒', points: 4 },
  { tier: 3, name: 'Orange', radius: 0.72, mass: 1.5, color: 0xf97316, emoji: '🍊', points: 8 },
  { tier: 4, name: 'Lemon', radius: 0.88, mass: 2.2, color: 0xfacc15, emoji: '🍋', points: 16 },
  { tier: 5, name: 'Kiwi', radius: 1.05, mass: 3.2, color: 0x84cc16, emoji: '🥝', points: 32 },
  { tier: 6, name: 'Tomato', radius: 1.25, mass: 4.6, color: 0xdc2626, emoji: '🍅', points: 64 },
  { tier: 7, name: 'Peach', radius: 1.45, mass: 6.4, color: 0xf472b6, emoji: '🍑', points: 128 },
  { tier: 8, name: 'Pineapple', radius: 1.68, mass: 8.8, color: 0xeab308, emoji: '🍍', points: 256 },
  { tier: 9, name: 'Coconut', radius: 1.90, mass: 11.5, color: 0x78350f, emoji: '🥥', points: 512 },
  { tier: 10, name: 'Watermelon', radius: 2.15, mass: 15.0, color: 0x16a34a, emoji: '🍉', points: 1024 },
  { tier: 11, name: 'Golden Sun Core', radius: 2.45, mass: 20.0, color: 0xfef08a, emoji: '☀️', points: 2048 },
];

export class PrefabFactory {
  private static faceTextureCache = new Map<string, THREE.CanvasTexture>();

  public static createContainer(
    innerRadius: number = 4.2,
    height: number = 10.0,
    dangerY: number = 7.5
  ): { root: THREE.Group; dangerRing: THREE.Mesh } {
    const root = new THREE.Group();

    // 1. Pedestal Base
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf5eedb,
      roughness: 0.8,
    });
    const baseMesh = new THREE.Mesh(new THREE.CylinderGeometry(innerRadius + 0.8, innerRadius + 1.2, 0.8, 32), baseMat);
    baseMesh.position.y = -0.4;
    baseMesh.receiveShadow = true;
    root.add(baseMesh);

    // 2. Translucent Double-Walled Acrylic Cylinder
    const wallGeo = new THREE.CylinderGeometry(innerRadius, innerRadius, height, 32, 1, true);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.y = height / 2;
    root.add(wallMesh);

    // Outer Rim Ring at top
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.3 });
    const topRim = new THREE.Mesh(new THREE.TorusGeometry(innerRadius, 0.08, 12, 32), rimMat);
    topRim.rotation.x = Math.PI / 2;
    topRim.position.y = height;
    root.add(topRim);

    // 3. Danger Overflow Glowing Ring
    const dangerMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.65,
    });
    const dangerRing = new THREE.Mesh(new THREE.TorusGeometry(innerRadius - 0.04, 0.06, 8, 32), dangerMat);
    dangerRing.rotation.x = Math.PI / 2;
    dangerRing.position.y = dangerY;
    root.add(dangerRing);

    return { root, dangerRing };
  }

  public static createFaceTexture(emoji: string, colorHex: string): THREE.CanvasTexture {
    const key = `${emoji}_${colorHex}`;
    if (this.faceTextureCache.has(key)) {
      return this.faceTextureCache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Background circle
    ctx.fillStyle = colorHex;
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();

    // Cute emoji face
    ctx.font = '60px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 64, 66);

    const tex = new THREE.CanvasTexture(canvas);
    this.faceTextureCache.set(key, tex);
    return tex;
  }

  public static createSphereMesh(def: TierVisualDef): THREE.Group {
    const group = new THREE.Group();

    // Shiny candy sphere
    const sphereGeo = new THREE.SphereGeometry(def.radius, 24, 24);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: def.color,
      roughness: 0.28,
      metalness: 0.08,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    group.add(sphere);

    // Face Decal
    const colorStr = '#' + def.color.toString(16).padStart(6, '0');
    const tex = this.createFaceTexture(def.emoji, colorStr);
    const decalMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(def.radius * 1.3, def.radius * 1.3), decalMat);
    decal.position.set(0, 0, def.radius + 0.02);
    group.add(decal);

    return group;
  }

  public static createBombMesh(radius: number = 0.85): THREE.Group {
    const group = new THREE.Group();

    const bombMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.4,
    });
    const bomb = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 20), bombMat);
    bomb.castShadow = true;
    group.add(bomb);

    // Fuse cap & golden ring
    const capMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3, metalness: 0.6 });
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.22, radius * 0.22, radius * 0.3, 12), capMat);
    cap.position.y = radius * 0.95;
    group.add(cap);

    // Skull/Bomb Decal
    const tex = this.createFaceTexture('💣', '#1e293b');
    const decalMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(radius * 1.2, radius * 1.2), decalMat);
    decal.position.set(0, 0, radius + 0.02);
    group.add(decal);

    return group;
  }
}
