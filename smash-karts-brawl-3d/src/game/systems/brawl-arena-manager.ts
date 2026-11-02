import * as THREE from 'three';
import { SoundController } from '../../core/audio';
import { KART_SKINS, PrefabFactory } from '../../render/PrefabFactory';
import { CameraRig } from '../../render/camera-rig';
import { ParticleEffects } from '../../render/effects';
import { VisualEnhancer } from '../../render/visual-enhancer';
import { BattleKartEntity } from '../entities/battle-kart';

export interface BrawlArenaCallbacks {
  onHudUpdate: () => void;
  onCallout: (text: string, color: string) => void;
  onMatchVictory: (rank: number, baseCoins: number, kills: number) => void;
  onPlayerWrecked: (rank: number, killerName: string) => void;
}

interface MysteryCrateSlot {
  group: THREE.Group;
  x: number;
  z: number;
  active: boolean;
  respawnTimer: number;
}

interface PowerCubeSlot {
  group: THREE.Group;
  x: number;
  z: number;
  active: boolean;
}

interface ProjectileSlot {
  mesh: THREE.Mesh;
  owner: BattleKartEntity | null;
  target: BattleKartEntity | null;
  x: number;
  y: number;
  z: number;
  vx: number;
  vz: number;
  damage: number;
  isHoming: boolean;
  life: number;
  active: boolean;
}

interface MineSlot {
  mesh: THREE.Mesh;
  owner: BattleKartEntity | null;
  x: number;
  z: number;
  damage: number;
  armTimer: number;
  life: number;
  active: boolean;
}

interface BoostPadSlot {
  x: number;
  z: number;
  dirX: number;
  dirZ: number;
}

const BOT_NAMES = [
  'KART_SLAYER',
  'NITRO_VEX',
  'BLITZ_TANK',
  'DRIFT_KING',
  'ROCKET_ZED',
  'BOOM_QUEEN',
  'MECHA_MAX',
  'TURBO_ACE',
  'SPARK_99',
  'APEX_FURY',
  'CYBER_RAM',
];

const _BURST_POS = new THREE.Vector3();

export class BrawlArenaManager {
  public readonly arenaGroup = new THREE.Group();
  public readonly karts: BattleKartEntity[] = [];
  public player: BattleKartEntity | null = null;

  public levelNumber = 1;
  public matchEnded = false;
  public reviveUsedThisMatch = false;
  public aliveCount = 12;
  public stormRadius = 31.0;

  private readonly crates: MysteryCrateSlot[] = [];
  private readonly powerCubes: PowerCubeSlot[] = [];
  private readonly projectiles: ProjectileSlot[] = [];
  private readonly mines: MineSlot[] = [];
  private readonly boostPads: BoostPadSlot[] = [];
  private readonly coverPillars: [number, number, number][] = [
    [-9.5, -9.5, 1.25],
    [9.5, -9.5, 1.25],
    [-9.5, 9.5, 1.25],
    [9.5, 9.5, 1.25],
  ];

  private stormRingMesh: THREE.Mesh | null = null;
  private targetReticle!: THREE.Group;
  private hudSyncTimer = 0;
  private stormDamageTick = 0;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController,
    private readonly cameraRig: CameraRig,
    private readonly callbacks: BrawlArenaCallbacks
  ) {
    this.scene.add(this.arenaGroup);
    this.initPools();
  }

  private initPools(): void {
    this.targetReticle = PrefabFactory.createTargetReticle();
    this.targetReticle.visible = false;
    this.scene.add(this.targetReticle);

    for (let i = 0; i < 36; i++) {
      const mesh = PrefabFactory.createProjectileMesh();
      mesh.visible = false;
      this.scene.add(mesh);
      this.projectiles.push({
        mesh,
        owner: null,
        target: null,
        x: 0,
        y: 0.7,
        z: 0,
        vx: 0,
        vz: 0,
        damage: 35,
        isHoming: false,
        life: 0,
        active: false,
      });
    }

    for (let i = 0; i < 16; i++) {
      const mesh = PrefabFactory.createMineMesh();
      mesh.visible = false;
      this.scene.add(mesh);
      this.mines.push({
        mesh,
        owner: null,
        x: 0,
        z: 0,
        damage: 65,
        armTimer: 0,
        life: 0,
        active: false,
      });
    }

    for (let i = 0; i < 24; i++) {
      const group = PrefabFactory.createPowerCube();
      group.visible = false;
      this.scene.add(group);
      this.powerCubes.push({
        group,
        x: 0,
        z: 0,
        active: false,
      });
    }
  }

  public startMatch(
    level: number,
    selectedSkinId: number,
    armorLvl: number,
    turboLvl: number,
    weaponLvl: number
  ): void {
    this.clearArena();
    this.levelNumber = level;
    this.matchEnded = false;
    this.reviveUsedThisMatch = false;
    this.aliveCount = 12;
    this.stormRadius = 31.0;

    this.buildStadiumGeometry();
    this.spawnMysteryCrates();
    this.spawnCombatKarts(selectedSkinId, armorLvl, turboLvl, weaponLvl);

    VisualEnhancer.enhanceScene(this.scene);
    this.callbacks.onHudUpdate();
  }

  private clearArena(): void {
    for (let i = 0; i < this.karts.length; i++) {
      this.karts[i].dispose(this.scene);
    }
    this.karts.length = 0;
    this.player = null;

    for (let i = 0; i < this.crates.length; i++) {
      this.arenaGroup.remove(this.crates[i].group);
    }
    this.crates.length = 0;
    this.boostPads.length = 0;

    for (let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].active = false;
      this.projectiles[i].mesh.visible = false;
    }
    for (let i = 0; i < this.mines.length; i++) {
      this.mines[i].active = false;
      this.mines[i].mesh.visible = false;
    }
    for (let i = 0; i < this.powerCubes.length; i++) {
      this.powerCubes[i].active = false;
      this.powerCubes[i].group.visible = false;
    }

    while (this.arenaGroup.children.length > 0) {
      this.arenaGroup.remove(this.arenaGroup.children[0]);
    }
    this.stormRingMesh = null;
  }

  private buildStadiumGeometry(): void {
    // High-Contrast Sunlit Racing Asphalt & Warm Sandstone Arena Deck
    const floorGeo = new THREE.CylinderGeometry(32.5, 33.8, 1.8, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      roughness: 0.52,
      metalness: 0.06,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, -0.9, 0);
    floor.receiveShadow = true;
    this.arenaGroup.add(floor);

    // Outer Sunlit Turf Curb Ring
    const curbGeo = new THREE.RingGeometry(30.8, 32.5, 48);
    curbGeo.rotateX(-Math.PI / 2);
    const curbMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
    });
    const curbRing = new THREE.Mesh(curbGeo, curbMat);
    curbRing.position.y = 0.015;
    this.arenaGroup.add(curbRing);

    // Inner Decorative Combat Ring Markings
    const innerRingGeo = new THREE.RingGeometry(11.8, 12.4, 40);
    innerRingGeo.rotateX(-Math.PI / 2);
    const innerRingMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.position.y = 0.02;
    this.arenaGroup.add(innerRing);

    // Shrinking Storm Danger Ring
    const stormGeo = new THREE.RingGeometry(0.97, 1.03, 48);
    stormGeo.rotateX(-Math.PI / 2);
    const stormMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
    });
    this.stormRingMesh = new THREE.Mesh(stormGeo, stormMat);
    this.stormRingMesh.position.y = 0.06;
    this.stormRingMesh.scale.setScalar(this.stormRadius);
    this.arenaGroup.add(this.stormRingMesh);

    // 4 Turbo Jump Boost Pads arranged symmetrically
    const padCoords: [number, number, number, number][] = [
      [0, -14, 0, 1],
      [0, 14, 0, -1],
      [-14, 0, 1, 0],
      [14, 0, -1, 0],
    ];
    const padGeo = new THREE.BoxGeometry(2.8, 0.18, 3.4);
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.35,
      roughness: 0.3,
    });
    for (let i = 0; i < padCoords.length; i++) {
      const [px, pz, dx, dz] = padCoords[i];
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.position.set(px, 0.09, pz);
      pad.rotation.y = Math.atan2(dx, dz);
      this.arenaGroup.add(pad);
      this.boostPads.push({ x: px, z: pz, dirX: dx, dirZ: dz });
    }

    // 4 Tactical Cover Pillars inside the combat ring
    const pillarGeo = new THREE.CylinderGeometry(1.15, 1.28, 2.2, 16);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.45,
      metalness: 0.1,
    });
    const pillarTrimGeo = new THREE.CylinderGeometry(1.22, 1.22, 0.35, 16);
    const pillarTrimMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.35,
    });
    for (let i = 0; i < this.coverPillars.length; i++) {
      const [cx, cz] = this.coverPillars[i];
      const pGroup = new THREE.Group();
      const body = new THREE.Mesh(pillarGeo, pillarMat);
      body.position.y = 1.1;
      body.castShadow = true;
      body.receiveShadow = true;
      const trim = new THREE.Mesh(pillarTrimGeo, pillarTrimMat);
      trim.position.y = 1.9;
      pGroup.add(body, trim);
      pGroup.position.set(cx, 0, cz);
      this.arenaGroup.add(pGroup);
    }

    // 24 Alternating Red/White 3D Stadium Perimeter Barrier Blocks
    const barrierGeo = new THREE.BoxGeometry(2.6, 0.85, 0.9);
    const redBarrierMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.45 });
    const whiteBarrierMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const bx = Math.cos(angle) * 31.8;
      const bz = Math.sin(angle) * 31.8;
      const barrier = new THREE.Mesh(barrierGeo, i % 2 === 0 ? redBarrierMat : whiteBarrierMat);
      barrier.position.set(bx, 0.42, bz);
      barrier.rotation.y = -angle + Math.PI * 0.5;
      barrier.castShadow = true;
      this.arenaGroup.add(barrier);
    }
  }

  private spawnMysteryCrates(): void {
    const crateCount = 14;
    for (let i = 0; i < crateCount; i++) {
      const angle = (i / crateCount) * Math.PI * 2;
      const radius = i % 2 === 0 ? 18.5 : 8.5;
      const cx = Math.cos(angle) * radius;
      const cz = Math.sin(angle) * radius;
      const group = PrefabFactory.createMysteryCrate();
      group.position.set(cx, 0.65, cz);
      this.arenaGroup.add(group);
      this.crates.push({
        group,
        x: cx,
        z: cz,
        active: true,
        respawnTimer: 0,
      });
    }
  }

  private spawnCombatKarts(
    selectedSkinId: number,
    armorLvl: number,
    turboLvl: number,
    weaponLvl: number
  ): void {
    const playerSkin = KART_SKINS[selectedSkinId % KART_SKINS.length];

    for (let i = 0; i < 12; i++) {
      // Place i=0 (Player) at angle = +PI/2 (x = 0, z = +21.0) facing inward toward -Z
      const angle = Math.PI * 0.5 + (i / 12) * Math.PI * 2;
      const spawnRadius = 21.0;
      const sx = Math.cos(angle) * spawnRadius;
      const sz = Math.sin(angle) * spawnRadius;

      if (i === 0) {
        this.player = new BattleKartEntity(
          this.scene,
          'player',
          'YOU',
          true,
          playerSkin.chassisHex,
          playerSkin.accentHex,
          sx,
          sz
        );
        this.player.armorUpgradeMult = 1.0 + (armorLvl - 1) * 0.12;
        this.player.turboUpgradeMult = 1.0 + (turboLvl - 1) * 0.07;
        this.player.weaponUpgradeMult = 1.0 + (weaponLvl - 1) * 0.12;
        this.player.maxHp = Math.round(120 * this.player.armorUpgradeMult);
        this.player.hp = this.player.maxHp;
        this.player.weaponAmmo = 3; // Player starts with 3 rockets for instant action
        this.player.shieldTimer = 4.0; // 4s spawn invulnerability shield
        this.karts.push(this.player);
      } else {
        const botSkin = KART_SKINS[i % KART_SKINS.length];
        const bot = new BattleKartEntity(
          this.scene,
          `bot_${i}`,
          BOT_NAMES[(i - 1) % BOT_NAMES.length],
          false,
          botSkin.chassisHex,
          botSkin.accentHex,
          sx,
          sz
        );
        const levelScale = Math.min(1.2, 0.88 + this.levelNumber * 0.03);
        bot.turboUpgradeMult = levelScale;
        bot.weaponAmmo = 0; // Bots start unarmed and must smash Mystery Crates first
        bot.fireCooldown = 2.5 + Math.random() * 2.0;
        bot.aiTargetX = (Math.random() - 0.5) * 18;
        bot.aiTargetZ = (Math.random() - 0.5) * 18;
        this.karts.push(bot);
      }
    }
  }

  public activateBooster(type: 'mecha' | 'barrage' | 'repair'): void {
    if (!this.player || this.player.eliminated) return;
    if (type === 'mecha') {
      this.player.mechaTimer = 14.0;
      this.player.shieldTimer = Math.max(this.player.shieldTimer, 4.0);
      this.callbacks.onCallout('🤖 MECHA TANK TRANSFORMED (2X DMG)!', '#facc15');
    } else if (type === 'barrage') {
      this.fireMissileBarrage(this.player, 5);
      this.callbacks.onCallout('🚀 5X HOMING MISSILE BARRAGE LAUNCHED!', '#ef4444');
    } else {
      this.player.hp = this.player.maxHp;
      this.player.shieldTimer = 10.0;
      this.callbacks.onCallout('🛡️ 100% REPAIRED + TURBO SHIELD (10S)!', '#38bdf8');
    }
    _BURST_POS.copy(this.player.pos);
    this.particles.spawnBurst(_BURST_POS, 0xfacc15, 18);
    this.particles.spawnShockwaveRing(_BURST_POS, 0xfacc15);
    this.audio.playBoosterActivate();
    this.callbacks.onHudUpdate();
  }

  public reviveAndAirdropPlayer(): void {
    if (!this.player) return;
    this.reviveUsedThisMatch = true;
    this.matchEnded = false;
    this.player.eliminated = false;
    this.player.rig.root.visible = true;
    this.player.rig.hpBarGroup.visible = true;
    this.player.pos.set(0, 2.5, 0);
    this.player.rig.root.position.copy(this.player.pos);
    this.player.vel.set(0, 0, 0);
    this.player.hp = this.player.maxHp;
    this.player.mechaTimer = 12.0;
    this.player.shieldTimer = 8.0;
    this.player.updateHealthBar();
    this.aliveCount = this.countAliveKarts();

    _BURST_POS.copy(this.player.pos);
    this.particles.spawnBurst(_BURST_POS, 0x38bdf8, 22);
    this.particles.spawnShockwaveRing(_BURST_POS, 0x38bdf8);
    this.audio.playBoosterActivate();
    this.callbacks.onCallout('⚡ AIRDROP REVIVE! MECHA CANNON ONLINE!', '#4ade80');
    this.callbacks.onHudUpdate();
  }

  private countAliveKarts(): number {
    let c = 0;
    for (let i = 0; i < this.karts.length; i++) {
      if (!this.karts[i].eliminated) c++;
    }
    return c;
  }

  public update(dt: number, steerX: number, steerZ: number, manualFire: boolean): void {
    if (this.matchEnded) return;

    // Shrink storm ring smoothly down to 13.5m radius
    if (this.stormRadius > 13.5) {
      this.stormRadius = Math.max(13.5, this.stormRadius - dt * 0.22);
      if (this.stormRingMesh) {
        this.stormRingMesh.scale.setScalar(this.stormRadius);
      }
    }

    if (this.player && !this.player.eliminated) {
      this.player.steerX = steerX;
      this.player.steerZ = steerZ;
    }

    // 1. Update Mystery Crates & Power Cubes
    for (let i = 0; i < this.crates.length; i++) {
      const c = this.crates[i];
      if (c.active) {
        c.group.rotation.y += dt * 1.8;
      } else {
        c.respawnTimer -= dt;
        if (c.respawnTimer <= 0) {
          c.active = true;
          c.group.visible = true;
        }
      }
    }

    for (let i = 0; i < this.powerCubes.length; i++) {
      const pc = this.powerCubes[i];
      if (pc.active) {
        pc.group.rotation.y += dt * 2.5;
      }
    }

    // 2. Step all Karts, Auto-Aim & AI
    this.stormDamageTick += dt;
    const applyStormTick = this.stormDamageTick >= 0.65;
    if (applyStormTick) this.stormDamageTick = 0;

    for (let i = 0; i < this.karts.length; i++) {
      const k = this.karts[i];
      if (k.eliminated) continue;

      if (!k.isPlayer) {
        this.updateBotAI(k, dt);
      }

      k.update(dt);

      // Keep inside stadium outer rim (radius 31.5)
      const distFromCenter = Math.hypot(k.pos.x, k.pos.z);
      if (distFromCenter > 30.8) {
        const inv = 30.8 / distFromCenter;
        k.pos.x *= inv;
        k.pos.z *= inv;
      }

      // Collide against 4 Tactical Cover Pillars
      for (let pIdx = 0; pIdx < this.coverPillars.length; pIdx++) {
        const [px, pz, pr] = this.coverPillars[pIdx];
        const dx = k.pos.x - px;
        const dz = k.pos.z - pz;
        const dist = Math.hypot(dx, dz);
        const minDist = pr + 0.78;
        if (dist < minDist && dist > 0.001) {
          k.pos.x = px + (dx / dist) * minDist;
          k.pos.z = pz + (dz / dist) * minDist;
        }
      }

      // Storm damage if outside stormRadius
      if (applyStormTick && distFromCenter > this.stormRadius + 0.5) {
        const died = k.takeDamage(8, -k.pos.x / distFromCenter, -k.pos.z / distFromCenter);
        if (died) {
          this.handleKartEliminated(k, null);
          continue;
        }
      }

      this.checkBoostPads(k);
      this.checkCratePickups(k);
      this.checkPowerCubePickups(k);
      this.updateAutoAimAndWeapons(k, k.isPlayer && manualFire);
    }

    // 3.Kart-to-Kart Ramming Collisions
    for (let i = 0; i < this.karts.length; i++) {
      const a = this.karts[i];
      if (a.eliminated) continue;
      for (let j = i + 1; j < this.karts.length; j++) {
        const b = this.karts[j];
        if (b.eliminated) continue;

        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const d = Math.hypot(dx, dz);
        if (d < 1.35 && d > 0.001) {
          const nx = dx / d;
          const nz = dz / d;
          const overlap = (1.35 - d) * 0.5;
          a.pos.x -= nx * overlap;
          a.pos.z -= nz * overlap;
          b.pos.x += nx * overlap;
          b.pos.z += nz * overlap;

          // Mecha Tank ramming deals bonus collision damage
          if (a.mechaTimer > 0 && b.stunTimer <= 0) {
            const died = b.takeDamage(28, nx, nz);
            if (died) this.handleKartEliminated(b, a);
          } else if (b.mechaTimer > 0 && a.stunTimer <= 0) {
            const died = a.takeDamage(28, -nx, -nz);
            if (died) this.handleKartEliminated(a, b);
          }
        }
      }
    }

    // 4. Step Projectiles & Mines
    this.updateProjectiles(dt);
    this.updateMines(dt);

    this.hudSyncTimer += dt;
    if (this.hudSyncTimer >= 0.18) {
      this.hudSyncTimer = 0;
      this.callbacks.onHudUpdate();
    }
  }

  private checkBoostPads(k: BattleKartEntity): void {
    for (let i = 0; i < this.boostPads.length; i++) {
      const pad = this.boostPads[i];
      if (Math.hypot(k.pos.x - pad.x, k.pos.z - pad.z) < 1.85 && k.pos.y <= 0.1) {
        k.vel.x = pad.dirX * 19.5;
        k.vel.z = pad.dirZ * 19.5;
        k.vel.y = 5.8;
        k.pos.y = 0.15;
      }
    }
  }

  private checkCratePickups(k: BattleKartEntity): void {
    for (let i = 0; i < this.crates.length; i++) {
      const c = this.crates[i];
      if (!c.active) continue;
      if (Math.hypot(k.pos.x - c.x, k.pos.z - c.z) < 1.45) {
        c.active = false;
        c.group.visible = false;
        c.respawnTimer = 4.5;
        const w = k.equipRandomWeapon();
        if (k.isPlayer) {
          _BURST_POS.set(c.x, 0.7, c.z);
          this.particles.spawnBurst(_BURST_POS, 0xfacc15, 12);
          this.audio.playCrateSmash();
          const label =
            w === 'rockets'
              ? '🚀 HOMING ROCKETS EQUIPPED!'
              : w === 'gatling'
                ? '🔥 TWIN GATLING EQUIPPED!'
                : '💣 EMP MINES EQUIPPED!';
          this.callbacks.onCallout(label, '#facc15');
        }
      }
    }
  }

  private checkPowerCubePickups(k: BattleKartEntity): void {
    for (let i = 0; i < this.powerCubes.length; i++) {
      const pc = this.powerCubes[i];
      if (!pc.active) continue;
      if (Math.hypot(k.pos.x - pc.x, k.pos.z - pc.z) < 1.45) {
        pc.active = false;
        pc.group.visible = false;
        k.addPowerCube();
        if (k.isPlayer) {
          _BURST_POS.set(pc.x, 0.6, pc.z);
          this.particles.spawnBurst(_BURST_POS, 0x22c55e, 12);
          this.audio.playPowerCubePickup(k.powerCubes);
          this.callbacks.onCallout(`💎 POWER CUBE +1 (HP & DMG UP)!`, '#4ade80');
        }
      }
    }
  }

  private updateAutoAimAndWeapons(k: BattleKartEntity, forceFire: boolean): void {
    let nearest: BattleKartEntity | null = null;
    let bestDist = 21.0;

    for (let i = 0; i < this.karts.length; i++) {
      const other = this.karts[i];
      if (other === k || other.eliminated) continue;
      const d = Math.hypot(other.pos.x - k.pos.x, other.pos.z - k.pos.z);
      if (d < bestDist) {
        bestDist = d;
        nearest = other;
      }
    }

    if (nearest) {
      k.turretYawRad = Math.atan2(nearest.pos.x - k.pos.x, nearest.pos.z - k.pos.z);
      if (k.isPlayer) {
        this.targetReticle.visible = true;
        this.targetReticle.position.set(nearest.pos.x, 0.06, nearest.pos.z);
        this.targetReticle.rotation.y += 0.08;
      }
    } else {
      k.turretYawRad = k.headingRad;
      if (k.isPlayer) {
        this.targetReticle.visible = false;
      }
    }

    const hasAmmo = k.mechaTimer > 0 || k.weaponAmmo > 0;
    const shouldFire =
      hasAmmo &&
      (forceFire || (nearest !== null && (k.mechaTimer > 0 || bestDist < (k.isPlayer ? 19.5 : 15.0))));

    if (!shouldFire || k.fireCooldown > 0) return;

    const botFairnessMult = k.isPlayer ? 1.0 : 0.52;
    const dmgScale =
      botFairnessMult *
      k.weaponUpgradeMult *
      (1.0 + k.powerCubes * 0.12) *
      (k.mechaTimer > 0 ? 1.65 : 1.0);

    if (k.mechaTimer > 0 || k.activeWeapon === 'rockets') {
      this.spawnProjectile(k, nearest, 22.5, Math.round(44 * dmgScale), true);
      k.fireCooldown = k.mechaTimer > 0 ? 0.42 : k.isPlayer ? 0.62 : 1.45;
      if (k.mechaTimer <= 0) k.weaponAmmo = Math.max(0, k.weaponAmmo - 1);
      if (k.isPlayer) this.audio.playRocketLaunch();
    } else if (k.activeWeapon === 'gatling') {
      this.spawnProjectile(k, nearest, 28.0, Math.round(14 * dmgScale), false);
      k.fireCooldown = k.isPlayer ? 0.13 : 0.28;
      k.weaponAmmo = Math.max(0, k.weaponAmmo - 1);
      if (k.isPlayer) this.audio.playGatlingShot();
    } else if (k.activeWeapon === 'mines') {
      this.spawnMine(k, Math.round(62 * dmgScale));
      k.fireCooldown = k.isPlayer ? 0.75 : 1.5;
      k.weaponAmmo = Math.max(0, k.weaponAmmo - 1);
      if (k.isPlayer) this.audio.playRocketLaunch();
    }
  }

  private fireMissileBarrage(owner: BattleKartEntity, count: number): void {
    let fired = 0;
    for (let i = 0; i < this.karts.length && fired < count; i++) {
      const other = this.karts[i];
      if (other === owner || other.eliminated) continue;
      this.spawnProjectile(owner, other, 24.0, 58, true);
      fired++;
    }
  }

  private spawnProjectile(
    owner: BattleKartEntity,
    target: BattleKartEntity | null,
    speed: number,
    damage: number,
    isHoming: boolean
  ): void {
    for (let i = 0; i < this.projectiles.length; i++) {
      const p = this.projectiles[i];
      if (p.active) continue;
      p.active = true;
      p.owner = owner;
      p.target = target;
      p.isHoming = isHoming;
      p.damage = damage;
      p.life = 1.6;
      const dirX = Math.sin(owner.turretYawRad);
      const dirZ = Math.cos(owner.turretYawRad);
      p.x = owner.pos.x + dirX * 0.9;
      p.y = owner.pos.y + 0.85;
      p.z = owner.pos.z + dirZ * 0.9;
      p.vx = dirX * speed;
      p.vz = dirZ * speed;
      p.mesh.position.set(p.x, p.y, p.z);
      p.mesh.rotation.y = owner.turretYawRad;
      p.mesh.scale.setScalar(isHoming ? 1.15 : 0.72);
      p.mesh.visible = true;
      return;
    }
  }

  private spawnMine(owner: BattleKartEntity, damage: number): void {
    for (let i = 0; i < this.mines.length; i++) {
      const m = this.mines[i];
      if (m.active) continue;
      m.active = true;
      m.owner = owner;
      m.x = owner.pos.x - Math.sin(owner.headingRad) * 1.1;
      m.z = owner.pos.z - Math.cos(owner.headingRad) * 1.1;
      m.damage = damage;
      m.armTimer = 0.45;
      m.life = 12.0;
      m.mesh.position.set(m.x, 0.14, m.z);
      m.mesh.visible = true;
      return;
    }
  }

  private updateProjectiles(dt: number): void {
    for (let i = 0; i < this.projectiles.length; i++) {
      const p = this.projectiles[i];
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }

      if (p.isHoming && p.target && !p.target.eliminated) {
        const tx = p.target.pos.x - p.x;
        const tz = p.target.pos.z - p.z;
        const td = Math.hypot(tx, tz);
        if (td > 0.1) {
          const speed = Math.hypot(p.vx, p.vz);
          p.vx = THREE.MathUtils.lerp(p.vx, (tx / td) * speed, Math.min(1.0, dt * 6.5));
          p.vz = THREE.MathUtils.lerp(p.vz, (tz / td) * speed, Math.min(1.0, dt * 6.5));
          p.mesh.rotation.y = Math.atan2(p.vx, p.vz);
        }
      }

      p.x += p.vx * dt;
      p.z += p.vz * dt;
      p.mesh.position.set(p.x, p.y, p.z);

      // Check collision with Tactical Cover Pillars
      let hitPillar = false;
      for (let pIdx = 0; pIdx < this.coverPillars.length; pIdx++) {
        const [px, pz, pr] = this.coverPillars[pIdx];
        if (Math.hypot(p.x - px, p.z - pz) < pr + 0.2) {
          p.active = false;
          p.mesh.visible = false;
          _BURST_POS.set(p.x, 0.7, p.z);
          this.particles.spawnBurst(_BURST_POS, 0x94a3b8, 8);
          hitPillar = true;
          break;
        }
      }
      if (hitPillar) continue;

      for (let kIdx = 0; kIdx < this.karts.length; kIdx++) {
        const k = this.karts[kIdx];
        if (k === p.owner || k.eliminated) continue;
        if (Math.hypot(k.pos.x - p.x, k.pos.z - p.z) < 1.1) {
          p.active = false;
          p.mesh.visible = false;
          const speed = Math.hypot(p.vx, p.vz) || 1;
          const died = k.takeDamage(p.damage, p.vx / speed, p.vz / speed);

          _BURST_POS.set(p.x, 0.7, p.z);
          this.particles.spawnBurst(_BURST_POS, 0xfacc15, 14);
          if (p.isHoming) {
            this.particles.spawnShockwaveRing(_BURST_POS, 0xef4444);
          }
          if (k.isPlayer || p.owner?.isPlayer) {
            this.audio.playExplosion(true);
            this.cameraRig.addTrauma(0.28);
          }

          if (died) {
            this.handleKartEliminated(k, p.owner);
          }
          break;
        }
      }
    }
  }

  private updateMines(dt: number): void {
    for (let i = 0; i < this.mines.length; i++) {
      const m = this.mines[i];
      if (!m.active) continue;
      m.life -= dt;
      if (m.armTimer > 0) m.armTimer -= dt;
      if (m.life <= 0) {
        m.active = false;
        m.mesh.visible = false;
        continue;
      }

      if (m.armTimer > 0) continue;

      for (let kIdx = 0; kIdx < this.karts.length; kIdx++) {
        const k = this.karts[kIdx];
        if (k === m.owner || k.eliminated) continue;
        const dx = k.pos.x - m.x;
        const dz = k.pos.z - m.z;
        const d = Math.hypot(dx, dz);
        if (d < 1.65) {
          m.active = false;
          m.mesh.visible = false;
          const nx = d > 0.01 ? dx / d : 0;
          const nz = d > 0.01 ? dz / d : 1;
          const died = k.takeDamage(m.damage, nx, nz);
          _BURST_POS.set(m.x, 0.4, m.z);
          this.particles.spawnBurst(_BURST_POS, 0xef4444, 18);
          this.particles.spawnShockwaveRing(_BURST_POS, 0xef4444);
          this.audio.playExplosion(k.isPlayer || Boolean(m.owner?.isPlayer));
          if (died) {
            this.handleKartEliminated(k, m.owner);
          }
          break;
        }
      }
    }
  }

  private handleKartEliminated(victim: BattleKartEntity, killer: BattleKartEntity | null): void {
    if (victim.eliminated) return;
    const wreckX = victim.pos.x;
    const wreckZ = victim.pos.z;

    victim.eliminate();
    if (!victim.isPlayer) {
      victim.dispose(this.scene);
    }

    victim.finishRank = this.aliveCount;
    this.aliveCount = Math.max(1, this.aliveCount - 1);

    // Clear any projectiles locking onto the eliminated kart
    for (let i = 0; i < this.projectiles.length; i++) {
      if (this.projectiles[i].target === victim) {
        this.projectiles[i].target = null;
      }
    }

    if (killer && !killer.eliminated) {
      killer.kills++;
      if (killer.isPlayer) {
        this.callbacks.onCallout(`💥 WRECKED ${victim.name}! (${this.aliveCount} LEFT)`, '#facc15');
        this.cameraRig.addTrauma(0.35);
      }
    }

    // Spawn 2 Power Cubes at victim wreck coordinates
    let dropped = 0;
    for (let i = 0; i < this.powerCubes.length && dropped < 2; i++) {
      const pc = this.powerCubes[i];
      if (pc.active) continue;
      pc.active = true;
      pc.x = wreckX + (dropped === 0 ? -0.65 : 0.65);
      pc.z = wreckZ;
      pc.group.position.set(pc.x, 0.55, pc.z);
      pc.group.visible = true;
      dropped++;
    }

    _BURST_POS.set(wreckX, 0.5, wreckZ);
    this.particles.spawnBurst(_BURST_POS, victim.colorHex, 24);
    this.particles.spawnBurst(_BURST_POS, 0xf97316, 18);
    this.particles.spawnShockwaveRing(_BURST_POS, 0xfacc15);
    this.audio.playExplosion(victim.isPlayer || Boolean(killer?.isPlayer));
    this.callbacks.onHudUpdate();

    if (victim.isPlayer) {
      this.targetReticle.visible = false;
      this.matchEnded = true;
      this.callbacks.onPlayerWrecked(victim.finishRank, killer ? killer.name : 'STORM RING');
      return;
    }

    if (this.aliveCount <= 1 && this.player && !this.player.eliminated) {
      this.targetReticle.visible = false;
      this.matchEnded = true;
      this.audio.playVictoryFanfare();
      const baseCoins = 120 + this.levelNumber * 25 + this.player.kills * 20;
      this.callbacks.onMatchVictory(1, baseCoins, this.player.kills);
    }
  }

  private updateBotAI(bot: BattleKartEntity, dt: number): void {
    bot.aiDecisionTimer -= dt;
    if (bot.aiDecisionTimer <= 0) {
      bot.aiDecisionTimer = 0.65 + Math.random() * 0.55;

      // Priority 1: Stay inside Storm Ring
      if (Math.hypot(bot.pos.x, bot.pos.z) > this.stormRadius - 2.5) {
        bot.aiTargetX = (Math.random() - 0.5) * 8;
        bot.aiTargetZ = (Math.random() - 0.5) * 8;
      } else if (bot.weaponAmmo <= 0) {
        // Priority 2: Seek active Mystery Crate
        let bestDist = 999;
        for (let i = 0; i < this.crates.length; i++) {
          const c = this.crates[i];
          if (!c.active) continue;
          const d = Math.hypot(c.x - bot.pos.x, c.z - bot.pos.z);
          if (d < bestDist) {
            bestDist = d;
            bot.aiTargetX = c.x;
            bot.aiTargetZ = c.z;
          }
        }
      } else {
        // Priority 3: Roam & engage nearby rival kart
        let nearestRival: BattleKartEntity | null = null;
        let bestDist = 999;
        for (let i = 0; i < this.karts.length; i++) {
          const other = this.karts[i];
          if (other === bot || other.eliminated) continue;
          const d = Math.hypot(other.pos.x - bot.pos.x, other.pos.z - bot.pos.z);
          if (d < bestDist) {
            bestDist = d;
            nearestRival = other;
          }
        }
        if (nearestRival) {
          bot.aiTargetX = nearestRival.pos.x + (Math.random() - 0.5) * 6;
          bot.aiTargetZ = nearestRival.pos.z + (Math.random() - 0.5) * 6;
        }
      }
    }

    const dx = bot.aiTargetX - bot.pos.x;
    const dz = bot.aiTargetZ - bot.pos.z;
    const len = Math.hypot(dx, dz);
    if (len > 0.5) {
      bot.steerX = dx / len;
      bot.steerZ = dz / len;
    } else {
      bot.steerX = 0;
      bot.steerZ = 1;
    }
  }
}
