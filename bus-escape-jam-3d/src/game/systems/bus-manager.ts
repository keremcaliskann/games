import * as THREE from 'three';
import { BusEntity } from '../entities/bus';
import { PassengerEntity } from '../entities/passenger';
import { ParkingLot } from '../entities/parking-lot';
import { LevelGenerator, LevelData } from '../levels/level-generator';
import { SoundController } from '../../core/audio';
import { ParticleEffects } from '../../render/effects';
import { CameraRig } from '../../render/camera-rig';
import { EventBus } from '../../core/events';
import { GAME_CONFIG } from '../config/game-config';

export class BusManager {
  public buses: BusEntity[] = [];
  public passengers: PassengerEntity[] = [];
  private isProcessingBoarding = false;
  private currentLevel = 1;

  constructor(
    private readonly lot: ParkingLot,
    private readonly audio: SoundController,
    private readonly particles: ParticleEffects,
    private readonly cameraRig: CameraRig,
    private readonly events: EventBus
  ) {}

  public loadLevel(levelNum: number): void {
    this.currentLevel = levelNum;
    this.clear();

    const data: LevelData = LevelGenerator.generateLevel(levelNum);

    // 1. Spawn buses
    for (const b of data.buses) {
      const startTile = b.tiles[0];
      const worldPos = this.lot.gridToWorld(startTile.col, startTile.row);

      // Adjust pivot for 2-tile and 3-tile buses
      if (b.orientation === 'N' || b.orientation === 'S') {
        worldPos.z += ((b.lengthTiles - 1) * this.lot.tileSize) / 2;
      } else {
        worldPos.x += ((b.lengthTiles - 1) * this.lot.tileSize) / 2;
      }

      const bus = new BusEntity(b.id, b.colorDef, b.lengthTiles, b.orientation, b.tiles, worldPos);
      this.lot.root.add(bus.root);
      this.buses.push(bus);
    }
    this.lot.buses = this.buses;

    // 2. Spawn Passenger Conga Line (Front at x = -4.5, extending rightwards)
    const queueStartX = -4.5;
    for (let i = 0; i < data.passengerQueue.length; i++) {
      const colorDef = data.passengerQueue[i];
      const pos = new THREE.Vector3(queueStartX + i * 0.75, 0.15, 4.2);
      const passenger = new PassengerEntity(`p_${i}`, colorDef, pos);
      this.lot.root.add(passenger.root);
      this.passengers.push(passenger);
    }

    this.events.emit('level:started', {
      level: levelNum,
      remainingBuses: this.buses.length,
      remainingPassengers: this.passengers.length,
    });
  }

  public handleTapBus(bus: BusEntity): boolean {
    if (bus.isDocked || bus.isDriving || bus.isHeloFlying) return false;

    // Check if path forward is open
    const canExit = this.lot.canBusExit(bus);
    if (!canExit) {
      this.audio.playBlockedBonk();
      bus.triggerBlockedShake();
      this.cameraRig.addTrauma(0.15);
      return false;
    }

    // Find free loading bay
    const freeBay = this.lot.getFirstFreeBay();
    if (!freeBay) {
      this.audio.playBlockedBonk();
      bus.triggerBlockedShake();
      this.checkDeadlock();
      return false;
    }

    // Drive bus to free bay!
    freeBay.bus = bus;
    bus.isDocked = true;
    bus.dockedBayIndex = freeBay.index;

    this.audio.playDrive();
    this.particles.spawnExhaustPuff(bus.root.position);
    this.cameraRig.addTrauma(0.2);

    bus.driveTo(freeBay.pos, 0.38, () => {
      this.processBoarding();
    });

    return true;
  }

  public extractBusWithHelo(): boolean {
    // Finds first trapped bus and airlifts it to free bay
    const freeBay = this.lot.getFirstFreeBay();
    if (!freeBay) return false;

    const trappedBus = this.buses.find((b) => !b.isDocked && !this.lot.canBusExit(b));
    if (!trappedBus) return false;

    freeBay.bus = trappedBus;
    trappedBus.isDocked = true;
    trappedBus.dockedBayIndex = freeBay.index;

    this.audio.playHelo();
    this.particles.spawnHeloSparks(trappedBus.root.position);

    trappedBus.flyHeloTo(freeBay.pos, 0.75, () => {
      this.processBoarding();
    });

    return true;
  }

  public shufflePassengers(): void {
    if (this.passengers.length <= 1) return;

    // Reorder passenger queue to prioritize colors of currently docked buses
    const dockedColors = new Set(
      this.lot.bays
        .filter((b) => b.bus && !b.bus.isFull)
        .map((b) => b.bus!.colorDef.id)
    );

    const matching: PassengerEntity[] = [];
    const nonMatching: PassengerEntity[] = [];

    for (const p of this.passengers) {
      if (dockedColors.has(p.colorDef.id)) {
        matching.push(p);
      } else {
        nonMatching.push(p);
      }
    }

    this.passengers = [...matching, ...nonMatching];
    this.repositionQueue();
    this.audio.playClick();
    this.processBoarding();
  }

  private repositionQueue(): void {
    const queueStartX = -4.5;
    for (let i = 0; i < this.passengers.length; i++) {
      const p = this.passengers[i];
      const targetPos = new THREE.Vector3(queueStartX + i * 0.75, 0.15, 4.2);
      p.moveTo(targetPos, 0.2, 0.25);
    }
  }

  public processBoarding(): void {
    if (this.isProcessingBoarding) return;
    this.isProcessingBoarding = true;

    // Check if the front passenger matches any currently docked bus with available capacity
    const frontPassenger = this.passengers[0];
    if (!frontPassenger) {
      this.isProcessingBoarding = false;
      this.checkVictory();
      return;
    }

    const targetBay = this.lot.bays.find(
      (b) => b.bus && !b.bus.isFull && b.bus.colorDef.id === frontPassenger.colorDef.id
    );

    if (targetBay && targetBay.bus) {
      const bus = targetBay.bus;
      const passenger = this.passengers.shift()!;

      passenger.boardBus(bus.root.position, () => {
        bus.addPassenger();
        this.audio.playPassengerBoard();
        this.particles.spawnBoardingBurst(bus.root.position, bus.colorDef.hex);
        this.lot.root.remove(passenger.root);

        this.repositionQueue();

        if (bus.isFull) {
          // Bus departs!
          this.departBus(bus, targetBay);
        } else {
          this.isProcessingBoarding = false;
          // Continue boarding next passenger in line
          this.processBoarding();
        }
      });
    } else {
      this.isProcessingBoarding = false;
      this.checkDeadlock();
    }
  }

  private departBus(bus: BusEntity, bay: { bus: BusEntity | null }): void {
    this.audio.playBusDepart();
    this.cameraRig.addTrauma(0.3);

    // Drive forward out of the bay
    const departTarget = bus.root.position.clone().add(new THREE.Vector3(0, 0, 8.0));
    bus.driveTo(departTarget, 0.55, () => {
      this.lot.root.remove(bus.root);
      bay.bus = null;
      const busIdx = this.buses.indexOf(bus);
      if (busIdx !== -1) {
        this.buses.splice(busIdx, 1);
      }

      this.events.emit('bus:departed', {
        coinsEarned: GAME_CONFIG.economy.coinsPerBus,
        remainingBuses: this.buses.length,
      });

      this.isProcessingBoarding = false;
      // Recheck boarding for newly freed capacity or remaining docked vehicles
      this.processBoarding();
      this.checkVictory();
    });
  }

  private checkVictory(): void {
    if (this.buses.length === 0 && this.passengers.length === 0) {
      this.audio.playVictory();
      this.events.emit('level:victory', {
        level: this.currentLevel,
        coinsEarned: GAME_CONFIG.economy.coinsPerLevel,
      });
    }
  }

  private checkDeadlock(): void {
    // All available unlocked bays occupied by not-full buses
    const unlockedBays = this.lot.bays.filter((b) => b.unlocked);
    const allBaysOccupied = unlockedBays.every((b) => b.bus !== null && !b.bus.isFull);

    if (allBaysOccupied && this.passengers.length > 0) {
      const frontPassenger = this.passengers[0];
      const hasMatch = unlockedBays.some((b) => b.bus!.colorDef.id === frontPassenger.colorDef.id);

      if (!hasMatch) {
        // Grid Jam! No valid moves left.
        this.events.emit('level:jammed');
      }
    }
  }

  public update(dt: number): void {
    for (const b of this.buses) {
      b.update(dt);
    }
    for (const p of this.passengers) {
      p.update(dt);
    }
  }

  public clear(): void {
    this.audio.resetPitch();
    this.lot.clear();
    for (const p of this.passengers) {
      this.lot.root.remove(p.root);
    }
    this.buses = [];
    this.passengers = [];
    this.isProcessingBoarding = false;
  }
}
