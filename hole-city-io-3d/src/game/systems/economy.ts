import { PlatformBridge, HoleSaveDataPayload } from '../../platform/sdk';
import { GAME_CONFIG } from '../config/game-config';

export class EconomySystem {
  public coins = 0;
  public highScore = 0;
  public bestRank = 8;
  public unlockedSkins: string[] = ['skin_default'];
  public equippedSkin: string = 'skin_default';

  public async init(): Promise<void> {
    const data = await PlatformBridge.loadData<HoleSaveDataPayload>({
      coins: 0,
      highScore: 0,
      bestRank: 8,
      unlockedSkins: ['skin_default'],
      equippedSkin: 'skin_default',
    });

    this.coins = data.coins;
    this.highScore = data.highScore;
    this.bestRank = data.bestRank;
    this.unlockedSkins = data.unlockedSkins || ['skin_default'];
    this.equippedSkin = data.equippedSkin || 'skin_default';
  }

  public addCoins(amount: number): void {
    this.coins += amount;
    this.persist();
  }

  public recordMatchResult(score: number, rank: number): number {
    let reward = GAME_CONFIG.coinsPerParticipation;
    if (rank === 1) reward = GAME_CONFIG.coinsPerFirstPlace;
    else if (rank === 2) reward = GAME_CONFIG.coinsPerSecondPlace;
    else if (rank === 3) reward = GAME_CONFIG.coinsPerThirdPlace;

    this.coins += reward;
    if (score > this.highScore) this.highScore = score;
    if (rank < this.bestRank) this.bestRank = rank;

    this.persist();
    PlatformBridge.sendScore(score);
    return reward;
  }

  public unlockSkin(skinId: string, price: number): boolean {
    if (this.unlockedSkins.includes(skinId)) return true;
    if (this.coins >= price) {
      this.coins -= price;
      this.unlockedSkins.push(skinId);
      this.equippedSkin = skinId;
      this.persist();
      return true;
    }
    return false;
  }

  public equipSkin(skinId: string): void {
    if (this.unlockedSkins.includes(skinId)) {
      this.equippedSkin = skinId;
      this.persist();
    }
  }

  private persist(): void {
    PlatformBridge.saveData({
      coins: this.coins,
      highScore: this.highScore,
      bestRank: this.bestRank,
      unlockedSkins: this.unlockedSkins,
      equippedSkin: this.equippedSkin,
    });
  }
}
