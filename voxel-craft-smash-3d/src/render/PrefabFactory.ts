import * as THREE from 'three';

export class PrefabFactory {
  // Shared materials for efficient batching
  private static matTurretBase = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.3 });
  private static matTurretChassis = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.2 });
  private static matTurretBarrel = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.5 });
  private static matTurretCore = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  private static matGolemStone = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
  private static matGolemEye = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  private static matIslandGrass = new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.8 });
  private static matIslandRock = new THREE.MeshStandardMaterial({ color: 0xf5eedb, roughness: 0.85 });

  // 1. Floating Battle Island
  public static createIsland(width: number, depth: number): THREE.Group {
    const group = new THREE.Group();

    // Grass Top Surface
    const grassGeo = new THREE.BoxGeometry(width, 1.2, depth);
    const grass = new THREE.Mesh(grassGeo, this.matIslandGrass);
    grass.position.y = -0.6;
    grass.receiveShadow = true;
    group.add(grass);

    // Bedrock Base
    const rockGeo = new THREE.BoxGeometry(width - 2, 4.0, depth - 2);
    const rock = new THREE.Mesh(rockGeo, this.matIslandRock);
    rock.position.y = -3.2;
    rock.receiveShadow = true;
    group.add(rock);

    return group;
  }

  // 2. High-Tech Turret Cannon
  public static createTurret(): { group: THREE.Group; swivel: THREE.Group; barrelLeft: THREE.Mesh; barrelRight: THREE.Mesh } {
    const group = new THREE.Group();

    // Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.8, 0.6, 16);
    const base = new THREE.Mesh(baseGeo, this.matTurretBase);
    base.position.y = 0.3;
    base.castShadow = true;
    group.add(base);

    // Swivel Body
    const swivel = new THREE.Group();
    swivel.position.y = 0.6;

    const chassisGeo = new THREE.BoxGeometry(1.8, 1.4, 1.8);
    const chassis = new THREE.Mesh(chassisGeo, this.matTurretChassis);
    chassis.position.y = 0.7;
    chassis.castShadow = true;
    swivel.add(chassis);

    // Glowing Power Core
    const coreGeo = new THREE.SphereGeometry(0.35, 12, 12);
    const core = new THREE.Mesh(coreGeo, this.matTurretCore);
    core.position.set(0, 0.75, 0);
    swivel.add(core);

    // Dual Barrels
    const barrelGeo = new THREE.CylinderGeometry(0.18, 0.22, 2.8, 12);
    barrelGeo.rotateX(Math.PI * 0.5);

    const barrelLeft = new THREE.Mesh(barrelGeo, this.matTurretBarrel);
    barrelLeft.position.set(-0.55, 0.75, -1.2);
    barrelLeft.castShadow = true;
    swivel.add(barrelLeft);

    const barrelRight = new THREE.Mesh(barrelGeo, this.matTurretBarrel);
    barrelRight.position.set(0.55, 0.75, -1.2);
    barrelRight.castShadow = true;
    swivel.add(barrelRight);

    group.add(swivel);

    return { group, swivel, barrelLeft, barrelRight };
  }

  // 3. Advancing Voxel Golem
  public static createGolem(): { group: THREE.Group; leftArm: THREE.Mesh; rightArm: THREE.Mesh } {
    const group = new THREE.Group();

    // Torso
    const torsoGeo = new THREE.BoxGeometry(1.8, 2.2, 1.2);
    const torso = new THREE.Mesh(torsoGeo, this.matGolemStone);
    torso.position.y = 2.4;
    torso.castShadow = true;
    group.add(torso);

    // Head
    const headGeo = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const head = new THREE.Mesh(headGeo, this.matGolemStone);
    head.position.set(0, 3.8, 0.1);
    head.castShadow = true;
    group.add(head);

    // Glowing Eyes
    const eyeGeo = new THREE.BoxGeometry(0.25, 0.15, 0.1);
    const eyeL = new THREE.Mesh(eyeGeo, this.matGolemEye);
    eyeL.position.set(-0.35, 3.8, 0.72);
    group.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, this.matGolemEye);
    eyeR.position.set(0.35, 3.8, 0.72);
    group.add(eyeR);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.6, 2.0, 0.6);
    const leftArm = new THREE.Mesh(armGeo, this.matGolemStone);
    leftArm.position.set(-1.3, 2.2, 0);
    leftArm.castShadow = true;
    group.add(leftArm);

    const rightArm = new THREE.Mesh(armGeo, this.matGolemStone);
    rightArm.position.set(1.3, 2.2, 0);
    rightArm.castShadow = true;
    group.add(rightArm);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.7, 1.4, 0.7);
    const legL = new THREE.Mesh(legGeo, this.matGolemStone);
    legL.position.set(-0.55, 0.7, 0);
    legL.castShadow = true;
    group.add(legL);

    const legR = new THREE.Mesh(legGeo, this.matGolemStone);
    legR.position.set(0.55, 0.7, 0);
    legR.castShadow = true;
    group.add(legR);

    return { group, leftArm, rightArm };
  }
}
