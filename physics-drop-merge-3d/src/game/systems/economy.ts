import { PlatformBridge, CloudSaveData } from '../../platform/sdk';

export class EconomySystem {
  private data: CloudSaveData = {
    highScore: 0,
    highestTier: 1,
    coins: 100,
  };

  public async init(): Promise<void> {
    this.data = await PlatformBridge.loadData(this.data);
  }

  public get highScore(): number {
    return this.data.highScore;
  }

  public get highestTier(): number {
    return this.data.highestTier;
  }

  public get coins(): number {
    return this.data.coins;
  }

  public recordScore(score: number): boolean {
    if (score > this.data.highScore) {
      this.data.highScore = score;
      void PlatformBridge.saveData(this.data);
      return true;
    }
    return false;
  }

  public recordTier(tier: number): void {
    if (tier > this.data.highestTier) {
      this.data.highestTier = tier;
      void PlatformBridge.saveData(this.data);
    }
  }

  public addCoins(amount: number): void {
    this.data.coins += amount;
    void PlatformBridge.saveData(this.data);
  }
}
