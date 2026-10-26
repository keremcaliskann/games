export interface CloudSaveData {
  coins: number;
  highestLevel: number;
  stars: number;
}

export class PlatformBridge {
  private static isAudioMutedByPlatform = false;

  public static applyDualModeShell(): void {
    const isEmbedded =
      window.self !== window.top ||
      new URLSearchParams(window.location.search).get('embed') === '1' ||
      Boolean((window as unknown as { ytgame?: unknown }).ytgame) ||
      Boolean((window as unknown as { YaGames?: unknown }).YaGames) ||
      Boolean((window as unknown as { CrazyGames?: unknown }).CrazyGames);

    if (isEmbedded) {
      document.body.classList.add('embed-fullscreen-mode');
    }
  }

  public static async initPlatform(): Promise<void> {
    const w = window as unknown as {
      ytgame?: {
        game?: {
          firstFrameReady(): void;
          gameReady(): void;
        };
      };
      YaGames?: {
        init(): Promise<unknown>;
      };
    };

    if (w.ytgame?.game) {
      // YouTube Playables SDK detected
    } else if (w.YaGames) {
      try {
        await w.YaGames.init();
      } catch {
        // Fallback gracefully
      }
    }
  }

  public static firstFrameReady(): void {
    const w = window as unknown as {
      ytgame?: { game?: { firstFrameReady(): void } };
    };
    try {
      w.ytgame?.game?.firstFrameReady();
    } catch {
      // Ignored outside YouTube
    }
  }

  public static gameReady(): void {
    const w = window as unknown as {
      ytgame?: { game?: { gameReady(): void } };
    };
    try {
      w.ytgame?.game?.gameReady();
    } catch {
      // Ignored outside YouTube
    }
  }

  public static initLifecycle(options: {
    onPause: () => void;
    onResume: () => void;
    onAudioEnabledChange: (enabled: boolean) => void;
  }): void {
    const w = window as unknown as {
      ytgame?: {
        system?: {
          isAudioEnabled(): boolean;
          onAudioEnabledChange(cb: (enabled: boolean) => void): void;
          onPause(cb: () => void): void;
          onResume(cb: () => void): void;
        };
      };
    };

    if (w.ytgame?.system) {
      try {
        const initialAudio = w.ytgame.system.isAudioEnabled();
        this.isAudioMutedByPlatform = !initialAudio;
        options.onAudioEnabledChange(initialAudio);

        w.ytgame.system.onAudioEnabledChange((enabled: boolean) => {
          this.isAudioMutedByPlatform = !enabled;
          options.onAudioEnabledChange(enabled);
        });

        w.ytgame.system.onPause(() => options.onPause());
        w.ytgame.system.onResume(() => options.onResume());
      } catch {
        // Fallback
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        options.onPause();
      } else {
        options.onResume();
      }
    });
  }

  public static async loadData(defaults: CloudSaveData): Promise<CloudSaveData> {
    const w = window as unknown as {
      ytgame?: {
        storage?: {
          loadData(): Promise<string>;
        };
      };
    };

    if (w.ytgame?.storage) {
      try {
        const raw = await w.ytgame.storage.loadData();
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<CloudSaveData>;
          return { ...defaults, ...parsed };
        }
      } catch {
        // Fallback to local
      }
    }

    try {
      const local = localStorage.getItem('goods_sort_save');
      if (local) {
        return { ...defaults, ...JSON.parse(local) };
      }
    } catch {
      // Storage unavailable
    }

    return defaults;
  }

  public static async saveData(data: CloudSaveData): Promise<void> {
    const serialized = JSON.stringify(data);
    const w = window as unknown as {
      ytgame?: {
        storage?: {
          saveData(data: string): Promise<void>;
        };
      };
    };

    if (w.ytgame?.storage) {
      try {
        await w.ytgame.storage.saveData(serialized);
        return;
      } catch {
        // Fallback
      }
    }

    try {
      localStorage.setItem('goods_sort_save', serialized);
    } catch {
      // Ignore
    }
  }

  public static isPlatformAudioMuted(): boolean {
    return this.isAudioMutedByPlatform;
  }
}
