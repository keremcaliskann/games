export interface RallySaveData {
  stageNumber: number;
  coins: number;
  medals: number;
  selectedSkin: number;
  unlockedSkins: number[];
  turboUpgradeLevel: number;
  gripUpgradeLevel: number;
  suspensionUpgradeLevel: number;
}

const DEFAULT_SAVE: RallySaveData = {
  stageNumber: 1,
  coins: 120,
  medals: 0,
  selectedSkin: 0,
  unlockedSkins: [0],
  turboUpgradeLevel: 1,
  gripUpgradeLevel: 1,
  suspensionUpgradeLevel: 1,
};

const STORAGE_KEY = 'rally_horizon_3d_save_v1';

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

  public async loadData(): Promise<RallySaveData> {
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
      const parsed = JSON.parse(raw) as Partial<RallySaveData>;
      return {
        stageNumber: Math.max(1, Number(parsed.stageNumber) || 1),
        coins: Math.max(0, Number(parsed.coins) ?? 120),
        medals: Math.max(0, Number(parsed.medals) || 0),
        selectedSkin: Math.max(0, Number(parsed.selectedSkin) || 0),
        unlockedSkins: Array.isArray(parsed.unlockedSkins) ? parsed.unlockedSkins : [0],
        turboUpgradeLevel: Math.max(1, Number(parsed.turboUpgradeLevel) || 1),
        gripUpgradeLevel: Math.max(1, Number(parsed.gripUpgradeLevel) || 1),
        suspensionUpgradeLevel: Math.max(1, Number(parsed.suspensionUpgradeLevel) || 1),
      };
    } catch {
      return { ...DEFAULT_SAVE, unlockedSkins: [...DEFAULT_SAVE.unlockedSkins] };
    }
  }

  public async saveData(data: RallySaveData): Promise<void> {
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
