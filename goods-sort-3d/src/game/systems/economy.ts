import { PlatformBridge, CloudSaveData } from '../../platform/sdk';

export class EconomySystem {
  private data: CloudSaveData = {
    coins: 100,
    highestLevel: 1,
    stars: 0,
  };

  public async init(): Promise<void> {
    this.data = await PlatformBridge.loadData(this.data);
  }

  public get coins(): number {
    return this.data.coins;
  }

  public get highestLevel(): number {
    return this.data.highestLevel;
  }

  public addCoins(amount: number): void {
    this.data.coins += amount;
    void PlatformBridge.saveData(this.data);
  }

  public recordLevelCompleted(level: number): void {
    if (level >= this.data.highestLevel) {
      this.data.highestLevel = level + 1;
      void PlatformBridge.saveData(this.data);
    }
  }
}
