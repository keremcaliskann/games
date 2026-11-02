export interface ExpeditionSaveData {
  trailNumber: number;
  coins: number;
  cratesDelivered: number;
  selectedSkin: number;
  unlockedSkins: number[];
  axleLiftLevel: number;
  winchPowerLevel: number;
  mudTireLevel: number;
}

const DEFAULT_SAVE: ExpeditionSaveData = {
  trailNumber: 1,
  coins: 120,
  cratesDelivered: 0,
  selectedSkin: 0,
  unlockedSkins: [0],
  axleLiftLevel: 1,
  winchPowerLevel: 1,
  mudTireLevel: 1,
};

const STORAGE_KEY = 'offroad_expedition_3d_save_v1';

interface YtGameSDK {
  game?: {
    firstFrameReady?: () => void;
    gameReady?: () => void;
    loadData?: () => Promise<string>;
    saveData?: (data: string) => Promise<void>;
  };
  system?: {
    isAudioEnabled?: () => boolean;
    onAudioEnabledChange?: (cb: (enabled: boolean) => void) => void;
    onPause?: (cb: () => void) => void;
    onResume?: (cb: () => void) => void;
  };
  engagement?: {
    sendScore?: (score: { value: number }) => void;
  };
}

declare global {
  interface Window {
    ytgame?: YtGameSDK;
    PokiSDK?: {
      init?: () => Promise<void>;
      gameLoadingFinished?: () => void;
      gameplayStart?: () => void;
      gameplayStop?: () => void;
    };
  }
}

export class PlatformBridge {
  private firstFrameSent = false;
  private gameReadySent = false;
  private dataLoaded = false;

  public firstFrameReady(): void {
    if (this.firstFrameSent) return;
    this.firstFrameSent = true;
    try {
      window.ytgame?.game?.firstFrameReady?.();
    } catch {
      // Ignore portal errors
    }
  }

  public gameReady(): void {
    if (this.gameReadySent) return;
    this.gameReadySent = true;
    try {
      window.ytgame?.game?.gameReady?.();
      window.PokiSDK?.gameLoadingFinished?.();
    } catch {
      // Ignore portal errors
    }
  }

  public bindLifecycle(
    onPause: () => void,
    onResume: () => void,
    onAudioChange: (enabled: boolean) => void
  ): void {
    try {
      const sys = window.ytgame?.system;
      if (sys) {
        if (typeof sys.isAudioEnabled === 'function') {
          onAudioChange(sys.isAudioEnabled());
        }
        sys.onAudioEnabledChange?.(onAudioChange);
        sys.onPause?.(onPause);
        sys.onResume?.(onResume);
      }
    } catch {
      // Fallback
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        onPause();
      } else {
        onResume();
      }
    });
  }

  public async loadData(): Promise<ExpeditionSaveData> {
    let raw = '';
    try {
      if (window.ytgame?.game?.loadData) {
        raw = (await window.ytgame.game.loadData()) || '';
      }
    } catch {
      // Fallback to localStorage
    }
    if (!raw) {
      try {
        raw = localStorage.getItem(STORAGE_KEY) || '';
      } catch {
        // Ignore storage errors
      }
    }
    this.dataLoaded = true;
    if (!raw) return { ...DEFAULT_SAVE, unlockedSkins: [...DEFAULT_SAVE.unlockedSkins] };

    try {
      const parsed = JSON.parse(raw) as Partial<ExpeditionSaveData>;
      return {
        trailNumber: Math.max(1, Number(parsed.trailNumber) || 1),
        coins: Math.max(0, Number(parsed.coins) ?? 120),
        cratesDelivered: Math.max(0, Number(parsed.cratesDelivered) || 0),
        selectedSkin: Math.max(0, Number(parsed.selectedSkin) || 0),
        unlockedSkins: Array.isArray(parsed.unlockedSkins) ? parsed.unlockedSkins : [0],
        axleLiftLevel: Math.max(1, Number(parsed.axleLiftLevel) || 1),
        winchPowerLevel: Math.max(1, Number(parsed.winchPowerLevel) || 1),
        mudTireLevel: Math.max(1, Number(parsed.mudTireLevel) || 1),
      };
    } catch {
      return { ...DEFAULT_SAVE, unlockedSkins: [...DEFAULT_SAVE.unlockedSkins] };
    }
  }

  public async saveData(data: ExpeditionSaveData): Promise<void> {
    if (!this.dataLoaded) return;
    const serialized = JSON.stringify(data);
    try {
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch {
      // Ignore quota errors
    }
    try {
      await window.ytgame?.game?.saveData?.(serialized);
    } catch {
      // Ignore portal errors
    }
  }

  public sendScore(value: number): void {
    try {
      window.ytgame?.engagement?.sendScore?.({ value: Math.round(value) });
    } catch {
      // Ignore
    }
  }
}
