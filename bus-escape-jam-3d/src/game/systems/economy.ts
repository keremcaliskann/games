import { PlatformBridge } from '../../platform/sdk';

export interface SaveState {
  coins: number;
  highestLevel: number;
  stars: number;
}

export class EconomySystem {
  public coins = 100;
  public highestLevel = 1;

  public async init(): Promise<void> {
    const raw = localStorage.getItem('bus_escape_save');
    let data: SaveState = { coins: 100, highestLevel: 1, stars: 0 };
    if (raw) {
      try {
        data = JSON.parse(raw);
        if (data.stars === undefined) data.stars = 0;
      } catch {
        // Ignored
      }
    }

    data = await PlatformBridge.loadData(data);
    this.coins = data.coins ?? 100;
    this.highestLevel = data.highestLevel ?? 1;
  }

  public addCoins(amount: number): void {
    this.coins += amount;
    this.save();
  }

  public spendCoins(amount: number): boolean {
    if (this.coins >= amount) {
      this.coins -= amount;
      this.save();
      return true;
    }
    return false;
  }

  public recordLevelCompleted(nextLevel: number): void {
    if (nextLevel > this.highestLevel) {
      this.highestLevel = nextLevel;
      this.save();
    }
  }

  private save(): void {
    const data: SaveState = {
      coins: this.coins,
      highestLevel: this.highestLevel,
      stars: 0,
    };
    localStorage.setItem('bus_escape_save', JSON.stringify(data));
    PlatformBridge.saveData(data);
  }
}
