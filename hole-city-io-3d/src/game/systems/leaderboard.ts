import { Hole } from '../entities/hole';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  isPlayer: boolean;
  rank: number;
}

export class LeaderboardSystem {
  private holes: Hole[] = [];

  public setHoles(holes: Hole[]): void {
    this.holes = holes;
  }

  public getRankings(): LeaderboardEntry[] {
    const sorted = [...this.holes].sort((a, b) => b.score - a.score);
    return sorted.map((h, index) => ({
      id: h.id,
      name: h.name,
      score: h.score,
      isPlayer: h.isPlayer,
      rank: index + 1,
    }));
  }

  public getPlayerRank(): number {
    const rankings = this.getRankings();
    const playerEntry = rankings.find((r) => r.isPlayer);
    return playerEntry ? playerEntry.rank : 8;
  }
}
