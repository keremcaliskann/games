import * as THREE from 'three';

interface VoxelParticle {
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
  vrz: number;
  scale: number;
  life: number;
  maxLife: number;
}

const MAX_VOXELS = 180;
const _dummyMatrix = new THREE.Matrix4();
const _dummyPosition = new THREE.Vector3();
const _dummyRotation = new THREE.Euler();
const _dummyQuaternion = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3();
const _tempColor = new THREE.Color();

export class ParticleBurstEffect {
  public readonly instancedMesh: THREE.InstancedMesh;
  private readonly particles: VoxelParticle[] = [];
  private readonly boxGeo: THREE.BoxGeometry;
  private readonly material: THREE.MeshStandardMaterial;

  constructor() {
    this.boxGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
    this.material = new THREE.MeshStandardMaterial({
      roughness: 0.3,
      metalness: 0.1,
    });

    this.instancedMesh = new THREE.InstancedMesh(this.boxGeo, this.material, MAX_VOXELS);
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.instancedMesh.castShadow = true;

    for (let i = 0; i < MAX_VOXELS; i++) {
      this.particles.push({
        active: false,
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        rx: 0,
        ry: 0,
        rz: 0,
        vrx: 0,
        vry: 0,
        vrz: 0,
        scale: 1,
        life: 0,
        maxLife: 1,
      });

      // Hide off-screen initially
      _dummyPosition.set(0, -999, 0);
      _dummyScale.set(0, 0, 0);
      _dummyMatrix.compose(_dummyPosition, _dummyQuaternion, _dummyScale);
      this.instancedMesh.setMatrixAt(i, _dummyMatrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  /**
   * Spawn 3D flying voxel cubes bursting out from a shredder gate
   */
  public spawnShredBurst(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    hexColor: number,
    count = 28
  ): void {
    let spawned = 0;
    _tempColor.setHex(hexColor);

    for (let i = 0; i < MAX_VOXELS && spawned < count; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.x = origin.x + (Math.random() - 0.5) * 0.4;
        p.y = origin.y + 0.3 + (Math.random() - 0.5) * 0.3;
        p.z = origin.z + (Math.random() - 0.5) * 0.4;

        // Eject outwards along shredder exhaust with cone spread
        const speed = 4.0 + Math.random() * 5.0;
        const spreadX = (Math.random() - 0.5) * 2.5;
        const spreadY = 2.5 + Math.random() * 3.5;
        const spreadZ = (Math.random() - 0.5) * 2.5;

        p.vx = direction.x * speed + spreadX;
        p.vy = spreadY;
        p.vz = direction.z * speed + spreadZ;

        p.rx = Math.random() * Math.PI * 2;
        p.ry = Math.random() * Math.PI * 2;
        p.rz = Math.random() * Math.PI * 2;
        p.vrx = (Math.random() - 0.5) * 12;
        p.vry = (Math.random() - 0.5) * 12;
        p.vrz = (Math.random() - 0.5) * 12;

        p.scale = 0.8 + Math.random() * 0.5;
        p.life = 0;
        p.maxLife = 0.7 + Math.random() * 0.5;

        this.instancedMesh.setColorAt(i, _tempColor);
        spawned++;
      }
    }

    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }
  }

  /**
   * Spawn golden sparks when a hammer booster smashes a block
   */
  public spawnHammerSparks(origin: THREE.Vector3): void {
    let spawned = 0;
    _tempColor.setHex(0xf59e0b);

    for (let i = 0; i < MAX_VOXELS && spawned < 35; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.x = origin.x;
        p.y = origin.y + 0.5;
        p.z = origin.z;

        const angle = Math.random() * Math.PI * 2;
        const speed = 3.5 + Math.random() * 4.5;
        p.vx = Math.cos(angle) * speed;
        p.vy = 3.0 + Math.random() * 4.0;
        p.vz = Math.sin(angle) * speed;

        p.rx = Math.random() * Math.PI;
        p.ry = Math.random() * Math.PI;
        p.rz = Math.random() * Math.PI;
        p.vrx = (Math.random() - 0.5) * 10;
        p.vry = (Math.random() - 0.5) * 10;
        p.vrz = (Math.random() - 0.5) * 10;

        p.scale = 0.6 + Math.random() * 0.4;
        p.life = 0;
        p.maxLife = 0.6 + Math.random() * 0.4;

        this.instancedMesh.setColorAt(i, _tempColor);
        spawned++;
      }
    }

    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }
  }

  /**
   * Spawn celebration confetti on level victory
   */
  public spawnCelebration(origin: THREE.Vector3): void {
    const palette = [0xef4444, 0x3b82f6, 0x22c55e, 0xeab308, 0xa855f7, 0xf97316];
    let spawned = 0;

    for (let i = 0; i < MAX_VOXELS && spawned < 60; i++) {
      const p = this.particles[i];
      if (!p.active) {
        p.active = true;
        p.x = origin.x + (Math.random() - 0.5) * 4;
        p.y = origin.y + 6 + Math.random() * 2;
        p.z = origin.z + (Math.random() - 0.5) * 4;

        p.vx = (Math.random() - 0.5) * 3;
        p.vy = -1.5 - Math.random() * 2;
        p.vz = (Math.random() - 0.5) * 3;

        p.rx = Math.random() * Math.PI * 2;
        p.ry = Math.random() * Math.PI * 2;
        p.rz = Math.random() * Math.PI * 2;
        p.vrx = (Math.random() - 0.5) * 8;
        p.vry = (Math.random() - 0.5) * 8;
        p.vrz = (Math.random() - 0.5) * 8;

        p.scale = 0.5 + Math.random() * 0.5;
        p.life = 0;
        p.maxLife = 1.4 + Math.random() * 0.8;

        const colorHex = palette[Math.floor(Math.random() * palette.length)];
        _tempColor.setHex(colorHex);
        this.instancedMesh.setColorAt(i, _tempColor);
        spawned++;
      }
    }

    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }
  }

  public update(dt: number): void {
    const gravity = -11.0;
    let anyActive = false;

    for (let i = 0; i < MAX_VOXELS; i++) {
      const p = this.particles[i];
      if (!p.active) continue;

      anyActive = true;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        _dummyPosition.set(0, -999, 0);
        _dummyScale.set(0, 0, 0);
        _dummyMatrix.compose(_dummyPosition, _dummyQuaternion, _dummyScale);
        this.instancedMesh.setMatrixAt(i, _dummyMatrix);
        continue;
      }

      // Physics integration
      p.vy += gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      p.rx += p.vrx * dt;
      p.ry += p.vry * dt;
      p.rz += p.vrz * dt;

      const progress = p.life / p.maxLife;
      const currentScale = Math.max(0, p.scale * (1.0 - progress * progress));

      _dummyPosition.set(p.x, p.y, p.z);
      _dummyRotation.set(p.rx, p.ry, p.rz);
      _dummyQuaternion.setFromEuler(_dummyRotation);
      _dummyScale.set(currentScale, currentScale, currentScale);

      _dummyMatrix.compose(_dummyPosition, _dummyQuaternion, _dummyScale);
      this.instancedMesh.setMatrixAt(i, _dummyMatrix);
    }

    if (anyActive) {
      this.instancedMesh.instanceMatrix.needsUpdate = true;
    }
  }

  public dispose(): void {
    this.boxGeo.dispose();
    this.material.dispose();
  }
}
