/**
 * Platform persistent storage wrapper.
 * Safely accesses localStorage and provides defaults if disabled or unavailable.
 */
export interface PlayerData {
  currentLevel: number;
  coins: number;
  completedLevels: number;
  soundEnabled: boolean;
}

const STORAGE_KEY = 'cyber_arrow_3d_data_v1';

const DEFAULT_DATA: PlayerData = {
  currentLevel: 1,
  coins: 50,
  completedLevels: 0,
  soundEnabled: true,
};

export class StorageManager {
  public static load(): PlayerData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_DATA };
      return { ...DEFAULT_DATA, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULT_DATA };
    }
  }

  public static save(data: PlayerData): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota or private mode write errors
    }
  }
}
