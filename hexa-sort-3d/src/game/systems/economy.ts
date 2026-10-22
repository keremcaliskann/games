import { PlatformBridge, SaveDataPayload } from '../../platform/sdk';
import { HEX_COLORS, HexColorDef } from '../config/game-config';

export class EconomySystem {
  public level = 1;
  public score = 0;
  public highScore = 0;
  public coins = 150; // Starter coins for booster experimentation

  public targetQuota = 20;
  public currentClearedCount = 0;

  // Boosters
  public hammers = 1;
  public swaps = 2;
  public moves = 1;

  public async initialize(): Promise<void> {
    const data = await PlatformBridge.loadData<SaveDataPayload>({
      level: 1,
      coins: 150,
      highScore: 0,
      hammers: 1,
      swaps: 2,
      moves: 1,
    });

    this.level = Math.max(1, data.level || 1);
    this.coins = Math.max(0, data.coins ?? 150);
    this.highScore = Math.max(0, data.highScore || 0);
    this.hammers = Math.max(0, data.hammers ?? 1);
    this.swaps = Math.max(0, data.swaps ?? 2);
    this.moves = Math.max(0, data.moves ?? 1);

    this.calculateQuota();
  }

  public calculateQuota(): void {
    // Level 1: 20, Level 2: 30, Level 3: 40, capping gracefully
    this.targetQuota = Math.min(80, 20 + (this.level - 1) * 10);
    this.currentClearedCount = 0;
  }

  public getActiveColors(): HexColorDef[] {
    // Level 1: 3 colors (Coral, Teal, Amber)
    // Level 2: 4 colors (+ Purple)
    // Level 3+: 5-6 colors
    if (this.level === 1) {
      return HEX_COLORS.slice(0, 3);
    } else if (this.level === 2) {
      return HEX_COLORS.slice(0, 4);
    } else if (this.level === 3) {
      return HEX_COLORS.slice(0, 5);
    }
    return HEX_COLORS;
  }

  public addClearedTiles(count: number, points: number): void {
    this.currentClearedCount += count;
    this.score += points;

    if (this.score > this.highScore) {
      this.highScore = this.score;
    }

    // Award 1 coin for every 2 tiles cleared
    this.coins += Math.max(1, Math.floor(count * 0.5));
    PlatformBridge.sendScore(this.score);
  }

  public isLevelComplete(): boolean {
    return this.currentClearedCount >= this.targetQuota;
  }

  public nextLevel(): void {
    this.level++;
    this.calculateQuota();
    this.save();
  }

  public async save(): Promise<void> {
    await PlatformBridge.saveData({
      level: this.level,
      coins: this.coins,
      highScore: this.highScore,
      hammers: this.hammers,
      swaps: this.swaps,
      moves: this.moves,
    });
  }
}
