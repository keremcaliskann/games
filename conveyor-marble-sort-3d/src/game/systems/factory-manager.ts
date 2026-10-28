import * as THREE from 'three';
import { ConveyorBelt, MarbleItem } from '../entities/conveyor';
import { DispenserEntity } from '../entities/dispenser';
import { CollectorCrateEntity } from '../entities/collector-crate';
import { LevelGenerator, LevelData, CrateSpec } from '../levels/level-generator';
import { PrefabFactory } from '../../render/PrefabFactory';
import { ParticleEffects } from '../../render/effects';
import { SoundController } from '../../core/audio';
import { EventBus } from '../../core/events';
import { MARBLE_COLORS, GAME_CONFIG } from '../config/game-config';

const _CRATE_HOP_OFFSET = new THREE.Vector3(0, 0.7, 0);
const _BOOSTER_BURST_POS = new THREE.Vector3(0, 2, 0);

export type FactoryGameState = 'playing' | 'jammed' | 'victory';

export class FactoryManager {
  public state: FactoryGameState = 'playing';
  public currentLevel = 1;
  public score = 0;
  public coins = 100;
  public totalClearedMarbles = 0;

  public conveyor: ConveyorBelt;
  public dispensers: DispenserEntity[] = [];
  public activeCrates: CollectorCrateEntity[] = [];
  public isSurging: boolean = false;
  private comboStreak: number = 0;
  private surgeTimer: number = 0;
  private queuedCrates: CrateSpec[] = [];
  private activeLevelData!: LevelData;

  private readonly scene: THREE.Scene;
  private readonly loopCurve: {
    root: THREE.Group;
    curvePoints: THREE.Vector3[];
    getPathPoint: (t: number) => THREE.Vector3;
    getPathTangent: (t: number) => THREE.Vector3;
  };
  private readonly effects: ParticleEffects;
  private readonly audio: SoundController;
  private readonly events: EventBus;

  // Dock stations along the conveyor loop (normalized t and world positions)
  private readonly dockStations = [
    { t: 0.25, pos: new THREE.Vector3(3.2, 0, -3.2) },
    { t: 0.75, pos: new THREE.Vector3(-3.2, 0, 3.2) },
  ];

  // Dispenser positions in the loop center
  private readonly dispenserLayout = [
    { pos: new THREE.Vector3(-2.2, 0, 0), dropT: 0.5 },
    { pos: new THREE.Vector3(0, 0, -0.6), dropT: 0.15 },
    { pos: new THREE.Vector3(2.2, 0, 0), dropT: 0.0 },
    { pos: new THREE.Vector3(0, 0, 1.2), dropT: 0.65 },
  ];

  constructor(
    scene: THREE.Scene,
    loopCurve: {
      root: THREE.Group;
      curvePoints: THREE.Vector3[];
      getPathPoint: (t: number) => THREE.Vector3;
      getPathTangent: (t: number) => THREE.Vector3;
    },
    effects: ParticleEffects,
    audio: SoundController,
    events: EventBus
  ) {
    this.scene = scene;
    this.loopCurve = loopCurve;
    this.effects = effects;
    this.audio = audio;
    this.events = events;

    this.conveyor = new ConveyorBelt(loopCurve);

    const gate = PrefabFactory.createSplitterGate();
    gate.root.position.set(0, 0.2, 3.2);
    this.scene.add(gate.root);
    this.conveyor.splitterGate = gate;
  }

  public startLevel(levelNum: number): void {
    this.currentLevel = levelNum;
    this.state = 'playing';
    this.comboStreak = 0;
    this.isSurging = false;
    this.surgeTimer = 0;
    this.conveyor.speed = GAME_CONFIG.conveyor.speed;
    this.conveyor.isGateOpen = false;
    this.audio.resetCombo();

    // Clean up existing entities
    this.conveyor.clearAllMarbles(this.scene);

    for (let i = 0; i < this.dispensers.length; i++) {
      this.scene.remove(this.dispensers[i].root);
    }
    this.dispensers = [];

    for (let i = 0; i < this.activeCrates.length; i++) {
      this.scene.remove(this.activeCrates[i].root);
    }
    this.activeCrates = [];

    // Generate level
    this.activeLevelData = LevelGenerator.generateLevel(levelNum);
    this.queuedCrates = [...this.activeLevelData.crates];

    // Spawn dispensers
    for (let i = 0; i < this.activeLevelData.dispensers.length; i++) {
      const spec = this.activeLevelData.dispensers[i];
      const layout = this.dispenserLayout[i % this.dispenserLayout.length];
      const disp = new DispenserEntity(spec.id, spec.colorId, spec.count, layout.pos, layout.dropT);
      this.dispensers.push(disp);
      this.scene.add(disp.root);
    }

    // Dock initial crates
    for (let i = 0; i < this.dockStations.length; i++) {
      this.dockNextCrate(i);
    }

    this.events.emit('state:updated', {
      level: this.currentLevel,
      score: this.score,
      coins: this.coins,
      state: this.state,
      conveyorOccupied: this.conveyor.occupiedCount,
      conveyorMax: this.conveyor.maxSlots,
    });
  }

  private dockNextCrate(stationIndex: number): void {
    if (this.queuedCrates.length === 0) return;
    const spec = this.queuedCrates.shift()!;
    const station = this.dockStations[stationIndex];

    const crate = new CollectorCrateEntity(
      spec.id,
      spec.colorId,
      spec.capacity,
      station.pos,
      station.t
    );

    this.activeCrates[stationIndex] = crate;
    this.scene.add(crate.root);
  }

  public handleDispenserTap(dispenser: DispenserEntity): boolean {
    if (this.state !== 'playing') return false;
    if (dispenser.isEmpty) return false;

    // Check if conveyor has space at dropT
    if (!this.conveyor.canAcceptAt(dispenser.dropT)) {
      this.audio.playTap();
      return false;
    }

    const colorId = dispenser.popNext();
    if (!colorId) return false;

    dispenser.triggerSquash();
    this.audio.playRelease();

    const colorHex = MARBLE_COLORS[colorId]?.hex ?? 0x3b82f6;
    const mesh = PrefabFactory.createMarbleMesh(colorHex);
    const dropPos = this.loopCurve.getPathPoint(dispenser.dropT);
    mesh.position.set(dropPos.x, dropPos.y + 0.38, dropPos.z);
    this.scene.add(mesh);

    const marbleItem: MarbleItem = {
      id: `marble_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      colorId,
      hex: colorHex,
      mesh,
      t: dispenser.dropT,
    };

    this.conveyor.addMarble(marbleItem);

    this.events.emit('state:updated', {
      conveyorOccupied: this.conveyor.occupiedCount,
      conveyorMax: this.conveyor.maxSlots,
    });

    return true;
  }

  public update(dt: number): void {
    if (this.state === 'victory') return;

    // Handle Speed Surge
    if (this.isSurging) {
      this.surgeTimer -= dt;
      if (this.surgeTimer <= 0) {
        this.isSurging = false;
        this.conveyor.speed = GAME_CONFIG.conveyor.speed;
        this.conveyor.isGateOpen = false;
        this.events.emit('surge:ended');
      }
    }

    // 1. Update conveyor loop
    this.conveyor.update(dt);

    // 2. Update active crates
    for (let i = 0; i < this.activeCrates.length; i++) {
      const crate = this.activeCrates[i];
      if (!crate) continue;
      crate.update(dt);

      // Check if crate finished departure and needs replacement
      if (crate.isDeparted) {
        this.scene.remove(crate.root);
        this.dockNextCrate(i);
      }
    }

    // 3. Check for marble absorption into matching crates
    const marbles = this.conveyor.marblesOnBelt;
    for (let i = marbles.length - 1; i >= 0; i--) {
      const m = marbles[i];

      // Handle absorbing marble animation
      if (m.isAbsorbing && m.absorbStartPos && m.absorbEndPos) {
        m.absorbProgress = (m.absorbProgress || 0) + dt * 4.0;
        const p = Math.min(m.absorbProgress, 1.0);
        m.mesh.position.lerpVectors(m.absorbStartPos, m.absorbEndPos, p);
        m.mesh.position.y += Math.sin(p * Math.PI) * 1.2; // arc hop
        m.mesh.scale.setScalar(0.75 * (1 - p * 0.4));

        if (p >= 1.0) {
          this.scene.remove(m.mesh);
          this.conveyor.removeMarble(m);
        }
        continue;
      }

      // Check proximity to active crates
      for (let c = 0; c < this.activeCrates.length; c++) {
        const crate = this.activeCrates[c];
        if (!crate || !crate.needsMarble) continue;

        if (crate.colorId === m.colorId) {
          const diff = Math.abs(m.t - crate.dockT);
          const wrapDiff = Math.min(diff, 1 - diff);

          if (wrapDiff < 0.04) {
            // Absorb!
            m.isAbsorbing = true;
            m.absorbProgress = 0;
            if (!m.absorbStartPos) m.absorbStartPos = new THREE.Vector3();
            if (!m.absorbEndPos) m.absorbEndPos = new THREE.Vector3();
            m.absorbStartPos.copy(m.mesh.position);
            m.absorbEndPos.copy(crate.root.position).add(_CRATE_HOP_OFFSET);

            crate.addMarble();
            this.score += GAME_CONFIG.economy.coinsPerMarble;
            this.coins += 2;
            this.totalClearedMarbles++;
            this.audio.playAbsorb();
            this.effects.spawnPopBurst(crate.root.position, [m.hex, 0xffffff]);

            // Combo & Speed Surge Trigger
            this.comboStreak++;
            if (this.comboStreak >= 5 && !this.isSurging) {
              this.isSurging = true;
              this.surgeTimer = 5.0;
              this.conveyor.speed = GAME_CONFIG.conveyor.speed * 1.6;
              this.conveyor.isGateOpen = true;
              this.effects.spawnPopBurst(crate.root.position, [0xfacc15, 0xffffff, 0xf59e0b]);
              this.events.emit('surge:started');
            }

            if (crate.isFull) {
              crate.triggerShipDeparture();
              this.score += GAME_CONFIG.economy.coinsPerCrate;
              this.coins += 15;
              this.audio.playCrateShip();
              this.effects.spawnPopBurst(crate.root.position, [0x10b981, 0xfacc15, 0xffffff]);
            }

            this.events.emit('state:updated', {
              score: this.score,
              coins: this.coins,
              conveyorOccupied: this.conveyor.occupiedCount,
              conveyorMax: this.conveyor.maxSlots,
            });
            break;
          }
        }
      }
    }

    // 4. Check for Jam
    if (this.state === 'playing' && this.conveyor.isFull) {
      // Is there any marble on the belt that matches an active needing crate?
      let canMatch = false;
      for (let i = 0; i < marbles.length; i++) {
        const m = marbles[i];
        if (m.isAbsorbing) continue;
        for (let c = 0; c < this.activeCrates.length; c++) {
          const crate = this.activeCrates[c];
          if (crate && crate.needsMarble && crate.colorId === m.colorId) {
            canMatch = true;
            break;
          }
        }
        if (canMatch) break;
      }

      if (!canMatch) {
        this.state = 'jammed';
        this.audio.playJamWarning();
        this.events.emit('game:jammed');
      }
    }

    // 5. Check for Victory
    if (this.state === 'playing') {
      const allDispensersEmpty = this.dispensers.every((d) => d.isEmpty);
      const allCratesDeparted =
        this.queuedCrates.length === 0 &&
        this.activeCrates.every((c) => !c || c.isDeparted || c.isShipping);
      const beltEmpty = this.conveyor.occupiedCount === 0;

      if (allDispensersEmpty && allCratesDeparted && beltEmpty) {
        this.state = 'victory';
        this.audio.playVictory();
        this.events.emit('game:victory', {
          score: this.score,
          level: this.currentLevel,
        });
      }
    }
  }

  // --- REVENUE BOOSTER HOOKS ---

  public applyBeltExpansion(): void {
    this.conveyor.expandCapacity(5);
    this.audio.playBooster();
    this.events.emit('state:updated', {
      conveyorOccupied: this.conveyor.occupiedCount,
      conveyorMax: this.conveyor.maxSlots,
    });
  }

  public applyMagnet(): void {
    let transferred = 0;
    for (let c = 0; c < this.activeCrates.length; c++) {
      const crate = this.activeCrates[c];
      if (!crate || !crate.needsMarble) continue;

      const matchingDisp = this.dispensers.find((d) => d.colorId === crate.colorId && !d.isEmpty);
      if (matchingDisp) {
        while (crate.needsMarble && !matchingDisp.isEmpty) {
          matchingDisp.popNext();
          crate.addMarble();
          transferred++;
        }
        if (crate.isFull) {
          crate.triggerShipDeparture();
          this.audio.playCrateShip();
        }
      }
    }

    if (transferred > 0) {
      this.audio.playBooster();
      this.effects.spawnPopBurst(_BOOSTER_BURST_POS, [0x38bdf8, 0xfacc15]);
      this.events.emit('state:updated', {
        score: this.score,
        coins: this.coins,
      });
    }
  }

  public applyUndoJam(): void {
    const removed = this.conveyor.clearAllMarbles(this.scene);
    for (let i = 0; i < removed.length; i++) {
      const m = removed[i];
      const disp = this.dispensers.find((d) => d.colorId === m.colorId);
      if (disp) {
        disp.addMarbles(1);
      }
    }
    this.audio.playBooster();
    if (this.state === 'jammed') {
      this.state = 'playing';
    }
    this.events.emit('state:updated', {
      conveyorOccupied: this.conveyor.occupiedCount,
      conveyorMax: this.conveyor.maxSlots,
    });
  }

  public applyRevive(): void {
    this.conveyor.expandCapacity(GAME_CONFIG.economy.reviveBonusSlots);
    this.applyUndoJam();
    this.state = 'playing';
  }
}
