export interface BridgeRaceSaveData {
  level: number;
  wins: number;
  coins: number;
  unlockedSkins: number[];
  selectedSkin: number;
  speedUpgradeLevel: number;
  magnetUpgradeLevel: number;
  buildSpeedUpgradeLevel: number;
}

const STORAGE_KEY = 'bridge_rush_io_3d_save_v1';

const DEFAULT_SAVE: BridgeRaceSaveData = {
  level: 1,
  wins: 0,
  coins: 120,
  unlockedSkins: [0],
  selectedSkin: 0,
  speedUpgradeLevel: 1,
  magnetUpgradeLevel: 1,
  buildSpeedUpgradeLevel: 1,
};

interface YtGameSDK {
  game?: {
    firstFrameReady?: () => void;
    gameReady?: () => void;
    loadData?: () => Promise<string>;
    saveData?: (data: string) => Promise<void>;
  };
  system?: {
    isAudioEnabled?: () => boolean;
    onAudioEnabledChange?: (cb: (isAudioEnabled: boolean) => void) => void;
    onPause?: (cb: () => void) => void;
    onResume?: (cb: () => void) => void;
  };
  engagement?: {
    sendScore?: (payload: { value: number }) => Promise<void>;
  };
}

function getYtGame(): YtGameSDK | undefined {
  return (window as unknown as { ytgame?: YtGameSDK }).ytgame;
}

export class PlatformBridge {
  private hasLoadedData = false;
  private cachedData: BridgeRaceSaveData = {
    ...DEFAULT_SAVE,
    unlockedSkins: [...DEFAULT_SAVE.unlockedSkins],
  };

  public firstFrameReady(): void {
    try {
      getYtGame()?.game?.firstFrameReady?.();
    } catch {
      // Ignore outside YouTube environment
    }
  }

  public gameReady(): void {
    try {
      getYtGame()?.game?.gameReady?.();
    } catch {
      // Ignore outside YouTube environment
    }
  }

  public async loadData(): Promise<BridgeRaceSaveData> {
    let raw = '';
    try {
      const yt = getYtGame();
      if (yt?.game?.loadData) {
        raw = (await yt.game.loadData()) || '';
      }
    } catch {
      raw = '';
    }

    if (!raw) {
      try {
        raw = localStorage.getItem(STORAGE_KEY) || '';
      } catch {
        raw = '';
      }
    }

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Partial<BridgeRaceSaveData>;
        this.cachedData = {
          level: Math.max(1, Number(parsed.level) || 1),
          wins: Math.max(0, Number(parsed.wins) || 0),
          coins: Math.max(0, Number(parsed.coins) ?? 120),
          unlockedSkins: Array.isArray(parsed.unlockedSkins) ? parsed.unlockedSkins : [0],
          selectedSkin: Number(parsed.selectedSkin) || 0,
          speedUpgradeLevel: Math.max(1, Number(parsed.speedUpgradeLevel) || 1),
          magnetUpgradeLevel: Math.max(1, Number(parsed.magnetUpgradeLevel) || 1),
          buildSpeedUpgradeLevel: Math.max(1, Number(parsed.buildSpeedUpgradeLevel) || 1),
        };
      } catch {
        this.cachedData = {
          ...DEFAULT_SAVE,
          unlockedSkins: [...DEFAULT_SAVE.unlockedSkins],
        };
      }
    }

    this.hasLoadedData = true;
    return this.cachedData;
  }

  public async saveData(partial: Partial<BridgeRaceSaveData>): Promise<void> {
    if (!this.hasLoadedData) {
      await this.loadData();
    }
    this.cachedData = { ...this.cachedData, ...partial };
    const serialized = JSON.stringify(this.cachedData);

    try {
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // Ignore storage quota errors
    }

    try {
      const yt = getYtGame();
      if (yt?.game?.saveData) {
        await yt.game.saveData(serialized);
      }
    } catch {
      // Ignore SDK errors
    }
  }

  public sendScore(score: number): void {
    try {
      getYtGame()?.engagement?.sendScore?.({ value: Math.max(0, Math.floor(score)) });
    } catch {
      // Ignore outside YouTube environment
    }
  }

  public bindLifecycle(
    onPause: () => void,
    onResume: () => void,
    onAudioChange: (enabled: boolean) => void
  ): void {
    try {
      const yt = getYtGame();
      if (yt?.system) {
        if (typeof yt.system.isAudioEnabled === 'function') {
          onAudioChange(Boolean(yt.system.isAudioEnabled()));
        }
        yt.system.onAudioEnabledChange?.((enabled: boolean) => {
          onAudioChange(Boolean(enabled));
        });
        yt.system.onPause?.(onPause);
        yt.system.onResume?.(onResume);
      }
    } catch {
      // Fallback to DOM visibility
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) onPause();
      else onResume();
    });
  }
}
