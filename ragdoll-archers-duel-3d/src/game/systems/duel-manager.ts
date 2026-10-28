import * as THREE from 'three';
import { ArcherEntity, HitZone } from '../entities/archer';
import { PrefabFactory } from '../../render/PrefabFactory';
import { ParticleEffects } from '../../render/effects';
import { SoundController } from '../../core/audio';
import { CameraRig } from '../../render/camera-rig';

const _BURST_POS = new THREE.Vector3();
const GRAVITY_Y = -18.5;

interface ArrowSlot {
  mesh: THREE.Group;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  fromPlayer: boolean;
  isLaser: boolean;
  active: boolean;
  stuckTimer: number;
}

interface AppleTarget {
  mesh: THREE.Group;
  basePos: THREE.Vector3;
  isGolden: boolean;
  active: boolean;
  phase: number;
}

export interface DuelCallbacks {
  onHudUpdate: () => void;
  onWaveVictory: (earnedCoins: number, headshots: number) => void;
  onPlayerDefeated: () => void;
  onCallout?: (text: string, colorHex?: string) => void;
}

export class DuelManager {
  public player: ArcherEntity | null = null;
  public readonly enemies: ArcherEntity[] = [];
  public windX = 0;
  public currentWave = 1;
  public waveHeadshots = 0;
  public waveCoinsEarned = 0;

  // Booster flags for next player shot
  public tripleShotArmed = false;
  public laserShotArmed = false;

  private readonly arrowPool: ArrowSlot[] = [];
  private readonly trajectoryDots: THREE.Mesh[] = [];
  private readonly apples: AppleTarget[] = [];
  private waveEnded = false;
  private endDelayTimer = 0;
  private pendingOutcome: 'victory' | 'defeat' | null = null;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly particles: ParticleEffects,
    private readonly audio: SoundController,
    private readonly cameraRig: CameraRig,
    private readonly callbacks: DuelCallbacks
  ) {
    this.initPools();
  }

  private initPools(): void {
    // 24 pooled arrows (18 standard + 6 laser)
    for (let i = 0; i < 24; i++) {
      const isLaser = i >= 18;
      const mesh = PrefabFactory.createArrowProjectile(isLaser);
      mesh.visible = false;
      this.scene.add(mesh);
      this.arrowPool.push({
        mesh,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        fromPlayer: true,
        isLaser,
        active: false,
        stuckTimer: 0,
      });
    }

    // 14 pooled trajectory preview spheres
    const dotGeo = new THREE.SphereGeometry(0.11, 10, 8);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.88,
    });
    for (let i = 0; i < 14; i++) {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.visible = false;
      this.scene.add(dot);
      this.trajectoryDots.push(dot);
    }
  }

  public startWave(wave: number): void {
    this.clearEntities();
    this.currentWave = wave;
    this.waveHeadshots = 0;
    this.waveCoinsEarned = 0;
    this.waveEnded = false;
    this.pendingOutcome = null;
    this.endDelayTimer = 0;

    // Deterministic wind speed per wave
    this.windX =
      wave === 1
        ? 0
        : Number((((wave * 17) % 11 - 5) * 0.42).toFixed(1));

    // Spawn Player Archer on left sunlit bastion
    const playerY = 0.8 + ((wave % 3) * 0.45);
    this.player = new ArcherEntity(
      this.scene,
      true,
      -6.2,
      playerY,
      0x2563eb,
      false,
      100
    );

    // Spawn 1 to 3 Enemy Archers across tiered right bastions
    const enemyCount = wave === 1 ? 1 : wave <= 3 ? 2 : 3;
    const enemyColors = [0xef4444, 0x9333ea, 0xd97706];
    const xCoords = [5.2, 7.6, 3.4];
    const yOffsets = [1.0, 2.8, -0.4];

    for (let i = 0; i < enemyCount; i++) {
      const isBoss = i === enemyCount - 1 && wave >= 2;
      const ex = xCoords[i];
      const ey = yOffsets[i] + ((wave + i) % 3) * 0.55;
      const hp = isBoss ? 120 + wave * 15 : 80 + wave * 10;
      const enemy = new ArcherEntity(
        this.scene,
        false,
        ex,
        ey,
        enemyColors[i % enemyColors.length],
        isBoss,
        hp
      );
      // Fair calibrated reaction delay & accuracy jitter
      enemy.aiShotCooldown = Math.max(2.1, 3.4 - wave * 0.08 + i * 0.45);
      enemy.aiShotTimer = 1.6 + i * 0.9;
      enemy.aiJitterRad = Math.max(0.045, 0.16 - wave * 0.01);
      this.enemies.push(enemy);
    }

    // Spawn 2 Flying Apples (1 Red Health Apple + 1 Golden Coin Apple) in mid-canyon
    const appleSpecs: Array<[number, number, boolean]> = [
      [-0.8, 3.6, false],
      [1.4, 5.1, true],
    ];
    for (let i = 0; i < appleSpecs.length; i++) {
      const [ax, ay, isGolden] = appleSpecs[i];
      const mesh = PrefabFactory.createFlyingApple(isGolden);
      mesh.position.set(ax, ay, 0);
      this.scene.add(mesh);
      this.apples.push({
        mesh,
        basePos: new THREE.Vector3(ax, ay, 0),
        isGolden,
        active: true,
        phase: i * 1.7,
      });
    }

    this.callbacks.onHudUpdate();
  }

  public updateAimPreview(isAiming: boolean, angleRad: number, power01: number): void {
    if (!this.player || this.player.isDead || !isAiming || this.waveEnded) {
      this.hideTrajectoryDots();
      if (this.player && !this.player.isDead) {
        this.player.setBowAim(0.15, 0);
      }
      return;
    }

    this.player.setBowAim(angleRad, power01);

    const speed = this.laserShotArmed ? 34.0 : 14.5 + power01 * 13.5;
    const startX = this.player.rig.root.position.x + Math.cos(angleRad) * 0.7;
    const startY = this.player.rig.root.position.y + 1.28 + Math.sin(angleRad) * 0.7;
    const vx = Math.cos(angleRad) * speed;
    const vy = Math.sin(angleRad) * speed;
    const grav = this.laserShotArmed ? 0 : GRAVITY_Y;
    const ax = this.laserShotArmed ? 0 : this.windX;

    for (let i = 0; i < this.trajectoryDots.length; i++) {
      const t = (i + 1) * 0.065;
      const dot = this.trajectoryDots[i];
      dot.visible = true;
      dot.position.set(
        startX + vx * t + 0.5 * ax * t * t,
        startY + vy * t + 0.5 * grav * t * t,
        0
      );
      const scale = 1.0 - (i / this.trajectoryDots.length) * 0.55;
      dot.scale.setScalar(scale);
    }
  }

  private hideTrajectoryDots(): void {
    for (let i = 0; i < this.trajectoryDots.length; i++) {
      this.trajectoryDots[i].visible = false;
    }
  }

  public firePlayerBow(angleRad: number, power01: number): void {
    if (!this.player || this.player.isDead || this.waveEnded) return;
    this.hideTrajectoryDots();
    this.player.setBowAim(angleRad, 0);

    const isLaser = this.laserShotArmed;
    const isTriple = this.tripleShotArmed;
    this.laserShotArmed = false;
    this.tripleShotArmed = false;

    const baseSpeed = isLaser ? 34.0 : 14.5 + power01 * 13.5;
    const startX = this.player.rig.root.position.x + Math.cos(angleRad) * 0.72;
    const startY = this.player.rig.root.position.y + 1.28 + Math.sin(angleRad) * 0.72;

    if (isTriple) {
      const offsets = [-0.11, 0, 0.11];
      for (let i = 0; i < offsets.length; i++) {
        const a = angleRad + offsets[i];
        this.spawnArrow(
          startX,
          startY,
          Math.cos(a) * baseSpeed,
          Math.sin(a) * baseSpeed,
          true,
          isLaser
        );
      }
    } else {
      this.spawnArrow(
        startX,
        startY,
        Math.cos(angleRad) * baseSpeed,
        Math.sin(angleRad) * baseSpeed,
        true,
        isLaser
      );
    }

    this.audio.playBowRelease(isLaser);
    this.callbacks.onHudUpdate();
  }

  private spawnArrow(
    x: number,
    y: number,
    vx: number,
    vy: number,
    fromPlayer: boolean,
    isLaser: boolean
  ): void {
    for (let i = 0; i < this.arrowPool.length; i++) {
      const slot = this.arrowPool[i];
      if (slot.active || slot.isLaser !== isLaser) continue;
      slot.active = true;
      slot.fromPlayer = fromPlayer;
      slot.stuckTimer = 0;
      slot.pos.set(x, y, 0);
      slot.vel.set(vx, vy, 0);
      slot.mesh.position.set(x, y, 0);
      slot.mesh.rotation.z = Math.atan2(vy, vx);
      slot.mesh.visible = true;
      return;
    }
  }

  private fireEnemyArrow(enemy: ArcherEntity): void {
    if (!this.player || this.player.isDead) return;
    const sx = enemy.rig.root.position.x - 0.65;
    const sy = enemy.rig.root.position.y + 1.28;
    const tx = this.player.rig.root.position.x;
    const ty = this.player.rig.root.position.y + 1.15;

    const flightTime = 1.05;
    const vxBase = (tx - sx - 0.5 * this.windX * flightTime * flightTime) / flightTime;
    const vyBase = (ty - sy - 0.5 * GRAVITY_Y * flightTime * flightTime) / flightTime;

    const baseAngle = Math.atan2(vyBase, vxBase);
    const speed = Math.hypot(vxBase, vyBase);
    const jitter = (Math.random() * 2 - 1) * enemy.aiJitterRad;
    const finalAngle = baseAngle + jitter;

    enemy.setBowAim(Math.PI - finalAngle, 0);
    this.spawnArrow(
      sx,
      sy,
      Math.cos(finalAngle) * speed,
      Math.sin(finalAngle) * speed,
      false,
      false
    );
    this.audio.playBowRelease(false);
  }

  public revivePlayerWithBonus(): void {
    if (!this.player) return;
    this.player.reviveFull();
    this.player.setShieldCharges(1);
    this.laserShotArmed = true;
    this.waveEnded = false;
    this.pendingOutcome = null;
    this.endDelayTimer = 0;
    this.callbacks.onHudUpdate();
  }

  public get aliveEnemyCount(): number {
    let count = 0;
    for (let i = 0; i < this.enemies.length; i++) {
      if (!this.enemies[i].isDead) count++;
    }
    return count;
  }

  public update(dt: number): void {
    if (this.player) {
      this.player.update(dt);
    }

    // Update Floating Apples + Enemy AI
    for (let i = 0; i < this.apples.length; i++) {
      const a = this.apples[i];
      if (!a.active) continue;
      a.phase += dt * 2.2;
      a.mesh.position.y = a.basePos.y + Math.sin(a.phase) * 0.38;
      a.mesh.rotation.y += dt * 1.1;
    }

    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      e.update(dt);
      if (!e.isDead && !this.waveEnded && this.player && !this.player.isDead) {
        e.aiShotTimer -= dt;
        const chargeRatio = Math.max(0, 1.0 - e.aiShotTimer / e.aiShotCooldown);
        e.setBowAim(0.28, chargeRatio * 0.85);
        if (e.aiShotTimer <= 0) {
          e.aiShotTimer = e.aiShotCooldown;
          this.fireEnemyArrow(e);
        }
      }
    }

    // Step active arrows
    for (let i = 0; i < this.arrowPool.length; i++) {
      const arrow = this.arrowPool[i];
      if (!arrow.active) continue;

      if (arrow.stuckTimer > 0) {
        arrow.stuckTimer -= dt;
        if (arrow.stuckTimer <= 0) {
          arrow.active = false;
          arrow.mesh.visible = false;
        }
        continue;
      }

      if (!arrow.isLaser) {
        arrow.vel.x += this.windX * dt;
        arrow.vel.y += GRAVITY_Y * dt;
      }

      arrow.pos.x += arrow.vel.x * dt;
      arrow.pos.y += arrow.vel.y * dt;
      arrow.mesh.position.copy(arrow.pos);
      arrow.mesh.rotation.z = Math.atan2(arrow.vel.y, arrow.vel.x);

      // Cull out-of-bounds arrows
      if (arrow.pos.x < -18 || arrow.pos.x > 18 || arrow.pos.y < -10 || arrow.pos.y > 22) {
        arrow.active = false;
        arrow.mesh.visible = false;
        continue;
      }

      if (arrow.fromPlayer) {
        // Check mid-air arrow-vs-arrow clash deflection against enemy arrows
        for (let otherIdx = 0; otherIdx < this.arrowPool.length; otherIdx++) {
          const other = this.arrowPool[otherIdx];
          if (!other.active || other.fromPlayer || other.stuckTimer > 0) continue;
          if (Math.hypot(arrow.pos.x - other.pos.x, arrow.pos.y - other.pos.y) <= 0.42) {
            _BURST_POS.copy(arrow.pos);
            this.particles.spawnBurst(_BURST_POS, 0xfacc15, 16);
            this.audio.playArrowClash();
            this.waveCoinsEarned += 15;
            this.callbacks.onCallout?.('⚔️ ARROW CLASH! +15 🪙', '#38bdf8');
            this.callbacks.onHudUpdate();
            other.vel.x = -other.vel.x * 0.45;
            other.vel.y = 4.5;
            other.stuckTimer = 0.28;
            if (!arrow.isLaser) {
              arrow.vel.x = -arrow.vel.x * 0.45;
              arrow.vel.y = 4.5;
              arrow.stuckTimer = 0.28;
            }
            break;
          }
        }
        if (arrow.stuckTimer > 0) continue;

        // Check apple hits
        for (let aIdx = 0; aIdx < this.apples.length; aIdx++) {
          const apple = this.apples[aIdx];
          if (!apple.active) continue;
          if (
            Math.hypot(
              arrow.pos.x - apple.mesh.position.x,
              arrow.pos.y - apple.mesh.position.y
            ) <= 0.46
          ) {
            apple.active = false;
            apple.mesh.visible = false;
            _BURST_POS.copy(apple.mesh.position);
            this.particles.spawnBurst(_BURST_POS, apple.isGolden ? 0xfacc15 : 0xef4444, 14);
            this.audio.playAppleCrunch();
            if (this.player) {
              this.player.heal(40);
            }
            this.waveCoinsEarned += apple.isGolden ? 35 : 20;
            this.callbacks.onCallout?.(
              apple.isGolden ? '🍎 GOLDEN APPLE! +40 HP & +35 🪙' : '🍎 +40 HP!',
              '#4ade80'
            );
            this.callbacks.onHudUpdate();
          }
        }

        // Check enemy hits
        for (let eIdx = 0; eIdx < this.enemies.length; eIdx++) {
          const enemy = this.enemies[eIdx];
          if (enemy.isDead) continue;
          const zone: HitZone = enemy.checkArrowHit(arrow.pos);
          if (zone !== 'none') {
            const dmg = arrow.isLaser
              ? 250
              : zone === 'head'
              ? 110
              : zone === 'torso'
              ? 55
              : 35;

            _BURST_POS.copy(arrow.pos);
            if (zone === 'head' || arrow.isLaser) {
              this.waveHeadshots++;
              this.waveCoinsEarned += 30;
              this.particles.spawnBurst(_BURST_POS, 0xfacc15, 18);
              this.audio.playHeadshotCrit();
              this.cameraRig.addTrauma(0.55);
              this.callbacks.onCallout?.('🎯 HEADSHOT! 3x CRIT (+30 🪙)', '#facc15');
            } else {
              this.waveCoinsEarned += 10;
              this.particles.spawnBurst(_BURST_POS, 0xef4444, 10);
              this.audio.playBodyHit();
              this.cameraRig.addTrauma(0.22);
            }

            enemy.applyDamage(dmg, zone, 1);
            this.callbacks.onHudUpdate();

            if (!arrow.isLaser) {
              arrow.stuckTimer = 0.25;
              break;
            }
          }
        }
      } else if (this.player && !this.player.isDead) {
        // Enemy arrow checking player
        const zone = this.player.checkArrowHit(arrow.pos);
        if (zone !== 'none') {
          _BURST_POS.copy(arrow.pos);
          if (this.player.shieldCharges > 0) {
            this.player.setShieldCharges(this.player.shieldCharges - 1);
            this.particles.spawnBurst(_BURST_POS, 0x38bdf8, 14);
            this.audio.playShieldBlock();
            arrow.active = false;
            arrow.mesh.visible = false;
            this.callbacks.onHudUpdate();
            continue;
          }

          const dmg = zone === 'head' ? 40 : zone === 'torso' ? 25 : 15;
          this.particles.spawnBurst(_BURST_POS, 0xef4444, 10);
          this.audio.playBodyHit();
          this.cameraRig.addTrauma(0.35);
          this.player.applyDamage(dmg, zone, -1);
          arrow.stuckTimer = 0.2;
          this.callbacks.onHudUpdate();
        }
      }
    }

    // Check wave completion state with brief ragdoll watch delay
    if (!this.waveEnded) {
      if (this.aliveEnemyCount === 0) {
        this.waveEnded = true;
        this.pendingOutcome = 'victory';
        this.endDelayTimer = 0.85;
        this.hideTrajectoryDots();
      } else if (this.player && this.player.isDead) {
        this.waveEnded = true;
        this.pendingOutcome = 'defeat';
        this.endDelayTimer = 0.75;
        this.hideTrajectoryDots();
      }
    } else if (this.pendingOutcome !== null) {
      this.endDelayTimer -= dt;
      if (this.endDelayTimer <= 0) {
        const outcome = this.pendingOutcome;
        this.pendingOutcome = null;
        if (outcome === 'victory') {
          const baseReward = 45 + this.currentWave * 15 + this.waveCoinsEarned;
          this.callbacks.onWaveVictory(baseReward, this.waveHeadshots);
        } else {
          this.callbacks.onPlayerDefeated();
        }
      }
    }
  }

  private clearEntities(): void {
    if (this.player) {
      this.player.dispose(this.scene);
      this.player = null;
    }
    for (let i = 0; i < this.enemies.length; i++) {
      this.enemies[i].dispose(this.scene);
    }
    this.enemies.length = 0;

    for (let i = 0; i < this.apples.length; i++) {
      this.scene.remove(this.apples[i].mesh);
    }
    this.apples.length = 0;

    for (let i = 0; i < this.arrowPool.length; i++) {
      this.arrowPool[i].active = false;
      this.arrowPool[i].mesh.visible = false;
    }
    this.hideTrajectoryDots();
  }
}
