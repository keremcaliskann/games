import * as THREE from 'three';

export class PrefabFactory {
  private static canvasCache = new Map<string, THREE.CanvasTexture>();

  /**
   * Helper to create or reuse dynamic canvas badge textures
   */
  public static getBadgeTexture(text: string, bgColor: string, textColor: string = '#ffffff'): THREE.CanvasTexture {
    const key = `${text}_${bgColor}_${textColor}`;
    if (this.canvasCache.has(key)) {
      return this.canvasCache.get(key)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.roundRect(4, 4, 120, 56, 12);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = 'bold 30px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 64, 34);
    }

    const texture = new THREE.CanvasTexture(canvas);
    this.canvasCache.set(key, texture);
    return texture;
  }

  /**
   * Creates the floating factory platform and environment
   */
  public static createFactoryStage(): THREE.Group {
    const group = new THREE.Group();

    // Floating island pedestal
    const islandGeo = new THREE.CylinderGeometry(8.5, 9.2, 1.2, 32);
    const islandMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.55,
      metalness: 0.05,
    });
    const islandMesh = new THREE.Mesh(islandGeo, islandMat);
    islandMesh.position.y = -0.65;
    islandMesh.receiveShadow = true;
    group.add(islandMesh);

    // Beveled rim border
    const rimGeo = new THREE.TorusGeometry(8.5, 0.22, 12, 32);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.4,
      metalness: 0.15,
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = -0.05;
    group.add(rimMesh);

    return group;
  }

  /**
   * Creates the oval conveyor track loop with dual rails and belt surface
   */
  public static createConveyorLoop(radiusX = 5.6, radiusZ = 3.2): {
    root: THREE.Group;
    curvePoints: THREE.Vector3[];
    getPathPoint: (t: number) => THREE.Vector3;
    getPathTangent: (t: number) => THREE.Vector3;
  } {
    const root = new THREE.Group();

    // Generate an oval circuit (2 straight edges + 2 semi-circle caps)
    const points: THREE.Vector3[] = [];
    const segments = 64;
    const halfX = radiusX - radiusZ;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2;
      let x = 0;
      let z = 0;

      if (angle >= 0 && angle < Math.PI / 2) {
        x = halfX + Math.sin(angle) * radiusZ;
        z = Math.cos(angle) * radiusZ;
      } else if (angle >= Math.PI / 2 && angle < Math.PI) {
        x = halfX + Math.sin(angle) * radiusZ;
        z = Math.cos(angle) * radiusZ;
      } else if (angle >= Math.PI && angle < (3 * Math.PI) / 2) {
        x = -halfX + Math.sin(angle) * radiusZ;
        z = Math.cos(angle) * radiusZ;
      } else {
        x = -halfX + Math.sin(angle) * radiusZ;
        z = Math.cos(angle) * radiusZ;
      }

      points.push(new THREE.Vector3(x, 0.15, z));
    }

    const curve = new THREE.CatmullRomCurve3(points, true);
    const curvePoints = curve.getSpacedPoints(120);

    // Belt base track
    const trackShape = new THREE.Shape();
    trackShape.moveTo(-0.6, -0.08);
    trackShape.lineTo(0.6, -0.08);
    trackShape.lineTo(0.6, 0.08);
    trackShape.lineTo(-0.6, 0.08);
    trackShape.closePath();

    const trackGeo = new THREE.ExtrudeGeometry(trackShape, {
      extrudePath: curve,
      steps: 128,
      bevelEnabled: false,
    });

    const beltMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6,
      metalness: 0.1,
    });
    const trackMesh = new THREE.Mesh(trackGeo, beltMat);
    trackMesh.receiveShadow = true;
    root.add(trackMesh);

    // Outer & inner metallic guide rails
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.75,
    });

    const railOuterGeo = new THREE.TubeGeometry(curve, 128, 0.08, 8, true);
    const railOuterMesh = new THREE.Mesh(railOuterGeo, railMat);
    railOuterMesh.position.y = 0.22;
    railOuterMesh.scale.set(1.08, 1.0, 1.15);
    root.add(railOuterMesh);

    const railInnerMesh = new THREE.Mesh(railOuterGeo, railMat);
    railInnerMesh.position.y = 0.22;
    railInnerMesh.scale.set(0.92, 1.0, 0.85);
    root.add(railInnerMesh);

    return {
      root,
      curvePoints,
      getPathPoint: (t: number) => {
        const u = ((t % 1) + 1) % 1;
        return curve.getPointAt(u);
      },
      getPathTangent: (t: number) => {
        const u = ((t % 1) + 1) % 1;
        return curve.getTangentAt(u);
      },
    };
  }

  /**
   * Creates a glossy, reflective marble
   */
  public static createMarbleMesh(colorHex: number): THREE.Mesh {
    const geo = new THREE.SphereGeometry(0.38, 20, 20);
    const mat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.15,
      metalness: 0.2,
      emissive: colorHex,
      emissiveIntensity: 0.08,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    // Equator swirl ring for tactile rolling visibility
    const ringGeo = new THREE.TorusGeometry(0.382, 0.035, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 4;
    mesh.add(ring);

    return mesh;
  }

  /**
   * Creates a compound procedural dispenser hopper
   */
  public static createDispenser(colorHex: number, count: number): {
    root: THREE.Group;
    hitTarget: THREE.Mesh;
    counterMesh: THREE.Mesh;
    updateCount: (newCount: number) => void;
  } {
    const root = new THREE.Group();

    // Silo base cylinder
    const siloGeo = new THREE.CylinderGeometry(0.65, 0.75, 2.6, 20);
    const siloMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const silo = new THREE.Mesh(siloGeo, siloMat);
    silo.position.y = 1.3;
    silo.castShadow = true;
    root.add(silo);

    // Color ID indicator ring
    const ringGeo = new THREE.CylinderGeometry(0.76, 0.76, 0.35, 20);
    const ringMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.3,
      metalness: 0.25,
      emissive: colorHex,
      emissiveIntensity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 1.8;
    root.add(ring);

    // Top loading funnel
    const funnelGeo = new THREE.ConeGeometry(0.95, 0.7, 20, 1, true);
    const funnelMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.3,
      metalness: 0.6,
      side: THREE.DoubleSide,
    });
    const funnel = new THREE.Mesh(funnelGeo, funnelMat);
    funnel.position.y = 2.85;
    root.add(funnel);

    // Bottom discharge nozzle chute
    const chuteGeo = new THREE.CylinderGeometry(0.45, 0.52, 0.6, 16);
    const chuteMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.3,
      metalness: 0.5,
    });
    const chute = new THREE.Mesh(chuteGeo, chuteMat);
    chute.position.y = 0.25;
    root.add(chute);

    // Click / tap detection collider
    const hitGeo = new THREE.CylinderGeometry(0.9, 0.9, 3.4, 12);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitTarget = new THREE.Mesh(hitGeo, hitMat);
    hitTarget.position.y = 1.7;
    root.add(hitTarget);

    // Top remaining counter billboard
    const counterGeo = new THREE.PlaneGeometry(1.2, 0.6);
    const badgeTex = this.getBadgeTexture(String(count), '#0f172a');
    const counterMat = new THREE.MeshBasicMaterial({
      map: badgeTex,
      transparent: true,
      depthTest: true,
    });
    const counterMesh = new THREE.Mesh(counterGeo, counterMat);
    counterMesh.position.y = 3.6;
    counterMesh.rotation.x = -Math.PI / 6;
    root.add(counterMesh);

    const updateCount = (newCount: number) => {
      const tex = this.getBadgeTexture(String(newCount), '#0f172a');
      (counterMesh.material as THREE.MeshBasicMaterial).map = tex;
      (counterMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
    };

    return { root, hitTarget, counterMesh, updateCount };
  }

  /**
   * Creates a compound procedural collector crate with slots and progress badge
   */
  public static createCollectorCrate(colorHex: number, capacity: number): {
    root: THREE.Group;
    badgeMesh: THREE.Mesh;
    updateProgress: (current: number) => void;
  } {
    const root = new THREE.Group();

    // Wooden shipping container box
    const crateGeo = new THREE.BoxGeometry(1.8, 1.1, 1.8);
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.6,
      metalness: 0.05,
    });
    const crateMesh = new THREE.Mesh(crateGeo, woodMat);
    crateMesh.position.y = 0.55;
    crateMesh.castShadow = true;
    crateMesh.receiveShadow = true;
    root.add(crateMesh);

    // Colored glowing intake funnel rim on top
    const funnelGeo = new THREE.TorusGeometry(0.72, 0.12, 10, 24);
    const funnelMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      roughness: 0.25,
      metalness: 0.3,
      emissive: colorHex,
      emissiveIntensity: 0.35,
    });
    const funnelMesh = new THREE.Mesh(funnelGeo, funnelMat);
    funnelMesh.rotation.x = Math.PI / 2;
    funnelMesh.position.y = 1.12;
    root.add(funnelMesh);

    // Metal corner reinforcement brackets
    const bracketMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.3,
      metalness: 0.7,
    });

    const corners = [
      [-0.85, 0.55, -0.85],
      [0.85, 0.55, -0.85],
      [-0.85, 0.55, 0.85],
      [0.85, 0.55, 0.85],
    ];

    corners.forEach(([cx, cy, cz]) => {
      const bGeo = new THREE.BoxGeometry(0.18, 1.15, 0.18);
      const bMesh = new THREE.Mesh(bGeo, bracketMat);
      bMesh.position.set(cx, cy, cz);
      root.add(bMesh);
    });

    // Front progress badge (e.g. "0/4")
    const badgeGeo = new THREE.PlaneGeometry(1.2, 0.6);
    const initialTex = this.getBadgeTexture(`0 / ${capacity}`, '#0284c7');
    const badgeMat = new THREE.MeshBasicMaterial({
      map: initialTex,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 0.6, 0.92);
    root.add(badgeMesh);

    const updateProgress = (current: number) => {
      const isFull = current >= capacity;
      const bg = isFull ? '#10b981' : '#0284c7';
      const tex = this.getBadgeTexture(`${current} / ${capacity}`, bg);
      (badgeMesh.material as THREE.MeshBasicMaterial).map = tex;
      (badgeMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
    };

    return { root, badgeMesh, updateProgress };
  }
}
