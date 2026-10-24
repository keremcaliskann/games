import { PlatformBridge, VoxelSaveDataPayload } from '../../platform/sdk';

export class EconomySystem {
  public coins = 0;
  public highScore = 0;
  public highestWave = 1;
  public turretLevel = 1;

  public async init(): Promise<void> {
    const data = await PlatformBridge.loadData<VoxelSaveDataPayload>({
      coins: 0,
      highScore: 0,
      highestWave: 1,
      turretLevel: 1,
      unlockedSkins: ['default'],
    });

    this.coins = data.coins;
    this.highScore = data.highScore;
    this.highestWave = data.highestWave || 1;
    this.turretLevel = data.turretLevel || 1;
  }

  public addCoins(amount: number): void {
    this.coins += amount;
    this.persist();
  }

  public recordWaveComplete(wave: number, score: number): void {
    if (wave > this.highestWave) this.highestWave = wave;
    if (score > this.highScore) this.highScore = score;
    this.persist();
    PlatformBridge.sendScore(score);
  }

  private persist(): void {
    PlatformBridge.saveData({
      coins: this.coins,
      highScore: this.highScore,
      highestWave: this.highestWave,
      turretLevel: this.turretLevel,
      unlockedSkins: ['default'],
    });
  }
}
