import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { VisualEnhancer } from './visual-enhancer';

export interface LiveryOptions {
  baseColorHex: number;
  stripeColorHex?: number;
  accentColorHex?: number;
  numberText?: string;
  hasCarbonHood?: boolean;
}

export interface DetailedWheelRig {
  group: THREE.Group;
  tireMesh: THREE.Mesh;
  rimGroup: THREE.Group;
}

export class ProceduralMeshBuilder {
  private static readonly textureCache = new Map<string, THREE.CanvasTexture>();

  /**
   * Creates a high-fidelity stylized aerodynamic vehicle body using beveled curved shapes.
   */
  public static createCarChassis(
    length = 2.4,
    width = 1.25,
    height = 0.65,
    options: LiveryOptions = { baseColorHex: 0x2563eb }
  ): THREE.Group {
    const root = new THREE.Group();

    // 1. Lower Aerodynamic Main Hull with smooth beveled corners
    const lowerHullGeo = new RoundedBoxGeometry(width, height * 0.55, length, 4, 0.12);
    const liveryTex = this.createRacingLiveryTexture(options);
    const bodyMat = new THREE.MeshStandardMaterial({
      map: liveryTex,
      roughness: 0.38,
      metalness: 0.18,
    });
    VisualEnhancer.applyRimLight(bodyMat, 0xfff6e5, 0.25);

    const lowerHull = new THREE.Mesh(lowerHullGeo, bodyMat);
    lowerHull.position.set(0, height * 0.38, 0);
    lowerHull.castShadow = true;
    lowerHull.receiveShadow = true;
    root.add(lowerHull);

    // 2. Tapered Cockpit & Cabin with curved windshield slope
    const cabinLength = length * 0.52;
    const cabinWidth = width * 0.82;
    const cabinHeight = height * 0.55;
    const cabinGeo = new RoundedBoxGeometry(cabinWidth, cabinHeight, cabinLength, 3, 0.1);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.85,
    });
    const cabin = new THREE.Mesh(cabinGeo, glassMat);
    cabin.position.set(0, height * 0.76, -length * 0.04);
    cabin.castShadow = true;
    root.add(cabin);

    // Front Windshield Glass Reflection Accent
    const windshieldGeo = new THREE.PlaneGeometry(cabinWidth * 0.9, cabinHeight * 0.7);
    const windshieldMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.1,
      metalness: 0.4,
      transparent: true,
      opacity: 0.45,
    });
    const windshield = new THREE.Mesh(windshieldGeo, windshieldMat);
    windshield.position.set(0, height * 0.78, cabinLength * 0.5 + 0.01);
    windshield.rotation.x = -0.32;
    root.add(windshield);

    // 3. Front Aerodynamic Splitter & Grille Bumper
    const splitterMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
      metalness: 0.25,
    });
    const splitter = new THREE.Mesh(
      new RoundedBoxGeometry(width * 1.05, 0.12, 0.42, 2, 0.04),
      splitterMat
    );
    splitter.position.set(0, 0.18, length * 0.52);
    splitter.castShadow = true;
    root.add(splitter);

    // Twin High-Intensity LED Headlights
    const headlightMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfde047,
      emissiveIntensity: 0.65,
      roughness: 0.2,
    });
    const hlGeo = new RoundedBoxGeometry(0.24, 0.12, 0.12, 2, 0.03);
    const leftHL = new THREE.Mesh(hlGeo, headlightMat);
    leftHL.position.set(-width * 0.36, height * 0.46, length * 0.5);
    const rightHL = new THREE.Mesh(hlGeo, headlightMat);
    rightHL.position.set(width * 0.36, height * 0.46, length * 0.5);
    root.add(leftHL, rightHL);

    // 4. Rear Aerodynamic Downforce Wing / Spoiler
    const spoilerWing = new THREE.Mesh(
      new RoundedBoxGeometry(width * 1.08, 0.08, 0.32, 2, 0.03),
      splitterMat
    );
    spoilerWing.position.set(0, height * 1.08, -length * 0.46);
    spoilerWing.castShadow = true;

    const leftStalk = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 0.12), splitterMat);
    leftStalk.position.set(-width * 0.35, height * 0.88, -length * 0.44);
    const rightStalk = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 0.12), splitterMat);
    rightStalk.position.set(width * 0.35, height * 0.88, -length * 0.44);
    root.add(spoilerWing, leftStalk, rightStalk);

    // Red LED Rear Brake Light Strip
    const brakeLightMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.75,
      roughness: 0.2,
    });
    const brakeStrip = new THREE.Mesh(
      new RoundedBoxGeometry(width * 0.72, 0.08, 0.1, 2, 0.02),
      brakeLightMat
    );
    brakeStrip.position.set(0, height * 0.48, -length * 0.51);
    root.add(brakeStrip);

    // 5. Dual Chrome Exhaust Pipes
    const pipeGeo = new THREE.CylinderGeometry(0.08, 0.09, 0.22, 10);
    pipeGeo.rotateX(Math.PI / 2);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.2,
    });
    const leftPipe = new THREE.Mesh(pipeGeo, chromeMat);
    leftPipe.position.set(-width * 0.22, 0.22, -length * 0.52);
    const rightPipe = new THREE.Mesh(pipeGeo, chromeMat);
    rightPipe.position.set(width * 0.22, 0.22, -length * 0.52);
    root.add(leftPipe, rightPipe);

    return root;
  }

  /**
   * Creates a detailed multi-part wheel assembly with rubber tire, metallic rim, and brake disc.
   */
  public static createDetailedWheel(
    radius = 0.32,
    width = 0.26,
    rimColorHex = 0xfacc15,
    tireColorHex = 0x0f172a
  ): DetailedWheelRig {
    const group = new THREE.Group();

    // 1. Rubber Tire with subtle bevel
    const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 18);
    tireGeo.rotateZ(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({
      color: tireColorHex,
      roughness: 0.65,
      metalness: 0.08,
    });
    const tireMesh = new THREE.Mesh(tireGeo, tireMat);
    tireMesh.castShadow = true;
    group.add(tireMesh);

    // 2. Metallic 5-Spoke Styled Rim
    const rimGroup = new THREE.Group();
    const rimOuterGeo = new THREE.TorusGeometry(radius * 0.68, 0.04, 8, 18);
    rimOuterGeo.rotateY(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({
      color: rimColorHex,
      metalness: 0.78,
      roughness: 0.25,
    });
    const rimOuter = new THREE.Mesh(rimOuterGeo, rimMat);
    rimOuter.position.x = width * 0.48;
    rimGroup.add(rimOuter);

    // Central hub
    const hubGeo = new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, 0.06, 12);
    hubGeo.rotateZ(Math.PI / 2);
    const hub = new THREE.Mesh(hubGeo, rimMat);
    hub.position.x = width * 0.48;
    rimGroup.add(hub);

    // 5 Spokes
    const spokeGeo = new THREE.BoxGeometry(0.04, radius * 0.56, 0.06);
    for (let i = 0; i < 5; i++) {
      const spoke = new THREE.Mesh(spokeGeo, rimMat);
      spoke.position.x = width * 0.48;
      spoke.rotation.x = (i * Math.PI * 2) / 5;
      rimGroup.add(spoke);
    }
    group.add(rimGroup);

    // 3. Inner Perforated Brake Disc & Red Caliper
    const discGeo = new THREE.CylinderGeometry(radius * 0.52, radius * 0.52, 0.03, 16);
    discGeo.rotateZ(Math.PI / 2);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.92,
      roughness: 0.28,
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.x = width * 0.15;
    group.add(disc);

    const caliperGeo = new THREE.BoxGeometry(0.06, radius * 0.28, radius * 0.28);
    const caliperMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.4,
      metalness: 0.3,
    });
    const caliper = new THREE.Mesh(caliperGeo, caliperMat);
    caliper.position.set(width * 0.16, radius * 0.32, 0);
    group.add(caliper);

    return { group, tireMesh, rimGroup };
  }

  /**
   * Bakes a procedural 512x512 racing livery canvas texture with twin stripes and race number.
   */
  public static createRacingLiveryTexture(options: LiveryOptions): THREE.CanvasTexture {
    const key = `livery_${options.baseColorHex}_${options.stripeColorHex ?? 0xffffff}_${options.numberText ?? '7'}`;
    const cached = this.textureCache.get(key);
    if (cached) return cached;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Base coat fill
    const baseHex = `#${options.baseColorHex.toString(16).padStart(6, '0')}`;
    ctx.fillStyle = baseHex;
    ctx.fillRect(0, 0, 512, 512);

    // Carbon fiber micro-pattern on front section if enabled
    if (options.hasCarbonHood !== false) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
      for (let y = 300; y < 512; y += 8) {
        for (let x = 60; x < 452; x += 8) {
          if ((x + y) % 16 === 0) {
            ctx.fillRect(x, y, 4, 4);
          }
        }
      }
    }

    // Bold Twin Center Racing Stripes
    const stripeHex = options.stripeColorHex !== undefined
      ? `#${options.stripeColorHex.toString(16).padStart(6, '0')}`
      : '#ffffff';
    ctx.fillStyle = stripeHex;
    ctx.fillRect(206, 0, 36, 512);
    ctx.fillRect(270, 0, 36, 512);

    // Accent pinstripes
    const accentHex = options.accentColorHex !== undefined
      ? `#${options.accentColorHex.toString(16).padStart(6, '0')}`
      : '#facc15';
    ctx.fillStyle = accentHex;
    ctx.fillRect(198, 0, 6, 512);
    ctx.fillRect(308, 0, 6, 512);

    // Circular Race Number Plate on Roof/Door
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(256, 170, 56, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#0f172a';
    ctx.stroke();

    ctx.font = '900 64px "Outfit", system-ui, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(options.numberText ?? '7', 256, 172);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    this.textureCache.set(key, texture);
    return texture;
  }

  /**
   * Bakes a procedural soft radial contact shadow plane decal.
   */
  public static createContactShadowMesh(radius = 1.4, opacity = 0.55): THREE.Mesh {
    return VisualEnhancer.createContactShadow(radius, opacity);
  }
}
