import { PlatformBridge, SaveDataPayload } from '../../platform/sdk';
import { GAME_CONFIG } from '../config/game-config';

export class EconomySystem {
  private level = 1;
  private coins = GAME_CONFIG.initialCoins;
  private magnets = 1;
  private extraSlots = 0;

  constructor(initialData?: Partial<SaveDataPayload>) {
    if (initialData?.level) this.level = initialData.level;
    if (initialData?.coins !== undefined) this.coins = initialData.coins;
    if (initialData?.magnets !== undefined) this.magnets = initialData.magnets;
    if (initialData?.extraSlots !== undefined) this.extraSlots = initialData.extraSlots;
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
    this.coins += amount;
    this.save();
  }

  public spendCoins(amount: number): boolean {
    if (this.coins < amount) return false;
    this.coins -= amount;
    this.save();
    return true;
  }

  public getMagnets(): number {
    return this.magnets;
  }

  public addMagnet(amount = 1): void {
    this.magnets += amount;
    this.save();
  }

  public useMagnet(): boolean {
    if (this.magnets <= 0) return false;
    this.magnets--;
    this.save();
    return true;
  }

  private save(): void {
    PlatformBridge.saveData({
      level: this.level,
      coins: this.coins,
      magnets: this.magnets,
      extraSlots: this.extraSlots,
    });
  }
}
