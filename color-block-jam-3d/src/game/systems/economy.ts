import { GAME_CONFIG } from '../config/game-config';
import { PlatformBridge, SaveDataPayload } from '../../platform/sdk';

export class EconomySystem {
  private level = 1;
  private coins = 150;
  private hammers = 1;
  private colorVacuums = 1;

  constructor(initialData?: Partial<SaveDataPayload>) {
    if (initialData) {
      if (typeof initialData.level === 'number' && initialData.level >= 1) {
        this.level = initialData.level;
      }
      if (typeof initialData.coins === 'number' && initialData.coins >= 0) {
        this.coins = initialData.coins;
      }
      if (typeof initialData.hammers === 'number') {
        this.hammers = initialData.hammers;
      }
      if (typeof initialData.colorVacuums === 'number') {
        this.colorVacuums = initialData.colorVacuums;
      }
    }
  }

  public getLevel(): number {
    return this.level;
  }

  public nextLevel(): void {
    this.level++;
    this.save();
  }

  public getCoins(): number {
    return this.coins;
  }

  public addCoins(amount: number): void {
    this.coins = Math.max(0, this.coins + Math.floor(amount));
    this.save();
  }

  public spendCoins(amount: number): boolean {
    if (this.coins >= amount) {
      this.coins = Math.max(0, this.coins - amount);
      this.save();
      return true;
    }
    return false;
  }

  public getHammers(): number {
    return this.hammers;
  }

  public addHammer(): void {
    this.hammers++;
    this.save();
  }

  public useHammer(): boolean {
    if (this.hammers > 0) {
      this.hammers--;
      this.save();
      return true;
    }
    return false;
  }

  public canAffordHammer(): boolean {
    return this.coins >= GAME_CONFIG.hammerCost;
  }

  public buyHammer(): boolean {
    if (this.spendCoins(GAME_CONFIG.hammerCost)) {
      this.addHammer();
      return true;
    }
    return false;
  }

  public getColorVacuums(): number {
    return this.colorVacuums;
  }

  public addColorVacuum(): void {
    this.colorVacuums++;
    this.save();
  }

  public useColorVacuum(): boolean {
    if (this.colorVacuums > 0) {
      this.colorVacuums--;
      this.save();
      return true;
    }
    return false;
  }

  public save(): void {
    PlatformBridge.saveData({
      level: this.level,
      coins: this.coins,
      hammers: this.hammers,
      colorVacuums: this.colorVacuums,
    });
  }
}
