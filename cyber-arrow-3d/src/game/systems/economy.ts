import { PlatformBridge } from '../../platform/sdk';
import { GAME_CONFIG } from '../config/game-config';
import { EventBus } from '../../core/events';

export interface PlayerData {
  currentLevel: number;
  coins: number;
  completedLevels: number;
}

const DEFAULT_PLAYER_DATA: PlayerData = {
  currentLevel: 1,
  coins: 50,
  completedLevels: 0,
};

/**
 * Economy and monetization coordinator.
 * Manages soft currency (coins), rewarded ad hooks, and interstitial cadence.
 */
export class EconomySystem {
  private data: PlayerData;
  private readonly bus = EventBus.get();
  private levelsSinceLastAd = 0;

  constructor(cloudData?: Partial<PlayerData>) {
    this.data = { ...DEFAULT_PLAYER_DATA };
    if (cloudData) {
      if (cloudData.currentLevel && cloudData.currentLevel > this.data.currentLevel) {
        this.data.currentLevel = cloudData.currentLevel;
      }
      if (cloudData.coins !== undefined && cloudData.coins > this.data.coins) {
        this.data.coins = cloudData.coins;
      }
    }
  }

  public getLevel(): number {
    return this.data.currentLevel;
  }

  public getCoins(): number {
    return this.data.coins;
  }

  public advanceLevel(): void {
    this.data.currentLevel++;
    this.data.completedLevels++;
    this.data.coins += GAME_CONFIG.coinsPerLevel;
    this.levelsSinceLastAd++;
    this.save();
    this.bus.emit('coins_updated', this.data.coins);
  }

  public shouldShowInterstitial(): boolean {
    if (this.levelsSinceLastAd >= GAME_CONFIG.interstitialIntervalLevels) {
      this.levelsSinceLastAd = 0;
      return true;
    }
    return false;
  }

  public canAffordHint(): boolean {
    return this.data.coins >= GAME_CONFIG.hintCost;
  }

  public spendHint(): boolean {
    if (this.canAffordHint()) {
      this.data.coins -= GAME_CONFIG.hintCost;
      this.save();
      this.bus.emit('coins_updated', this.data.coins);
      return true;
    }
    return false;
  }

  public rewardAdWatched(): void {
    const bonus = 50;
    this.data.coins += bonus;
    this.save();
    this.bus.emit('coins_updated', this.data.coins);
  }

  public addCoins(amount: number): void {
    if (amount <= 0) return;
    this.data.coins += amount;
    this.save();
    this.bus.emit('coins_updated', this.data.coins);
  }

  private save(): void {
    PlatformBridge.saveData({
      level: this.data.currentLevel,
      coins: this.data.coins,
    });
  }
}
