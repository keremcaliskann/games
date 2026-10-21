/**
 * Universal Multi-Portal SDK & Lifecycle Bridge.
 * Prioritizes YouTube Playables (ytgame), with seamless runtime detection for
 * Yandex Games, CrazyGames, Poki, and local/GitHub Pages fallback.
 */

export interface SaveDataPayload {
  level: number;
  coins: number;
  highScore?: number;
  hammers?: number;
  colorVacuums?: number;
}

export class PlatformBridge {
  private static isFirstFrameSent = false;
  private static isGameReadySent = false;
  private static isAudioMutedByPlatform = false;

  public static isYouTubePlayables(): boolean {
    return Boolean((window as any).ytgame?.IN_PLAYABLES_ENV);
  }

  public static isEmbeddedMode(): boolean {
    const w = window as any;
    return Boolean(
      w.ytgame?.IN_PLAYABLES_ENV ||
      w.YaGames ||
      w.CrazyGames?.SDK ||
      w.PokiSDK ||
      new URLSearchParams(window.location.search).get('embed') === '1' ||
      new URLSearchParams(window.location.search).get('yt') === '1'
    );
  }

  public static applyDualModeShell(): void {
    if (this.isEmbeddedMode()) {
      document.body.classList.add('embed-fullscreen-mode');
    }
  }

  public static async initPlatform(): Promise<void> {
    const w = window as any;

    // Strict zero-external-network CSP invariant for YouTube Playables
    if (w.ytgame?.IN_PLAYABLES_ENV) {
      return;
    }

    const host = window.location.hostname;
    const search = window.location.search;
    const isYandex = host.includes('yandex') || search.includes('portal=yandex');
    const isCrazy = host.includes('crazygames') || search.includes('portal=crazygames');

    // 1. Dynamic script loader for Yandex Games if running on Yandex portal
    if (isYandex && !w.YaGames && !document.getElementById('yandex-sdk-script')) {
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.id = 'yandex-sdk-script';
        script.src = 'https://yandex.ru/games/sdk/v2';
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.head.appendChild(script);
      });
    }

    // 2. Dynamic script loader for CrazyGames if running on CrazyGames portal
    if (isCrazy && !w.CrazyGames && !document.getElementById('crazygames-sdk-script')) {
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.id = 'crazygames-sdk-script';
        script.src = 'https://sdk.crazygames.com/crazygames-sdk-v3.js';
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.head.appendChild(script);
      });
    }

    // 3. Auto-initialize Yandex Games SDK if YaGames global is present
    if (w.YaGames && !w.ysdk) {
      try {
        const ysdk = await w.YaGames.init();
        w.ysdk = ysdk;
        ysdk.features?.LoadingAPI?.ready?.();
      } catch {}
    }
  }

  public static gameplayStart(): void {
    const w = window as any;
    if (w.CrazyGames?.SDK?.game?.gameplayStart) {
      try {
        w.CrazyGames.SDK.game.gameplayStart();
      } catch {}
    }
  }

  public static gameplayStop(): void {
    const w = window as any;
    if (w.CrazyGames?.SDK?.game?.gameplayStop) {
      try {
        w.CrazyGames.SDK.game.gameplayStop();
      } catch {}
    }
  }

  public static signalFirstFrameReady(): void {
    if (this.isFirstFrameSent) return;
    this.isFirstFrameSent = true;

    const yt = (window as any).ytgame;
    if (yt?.game?.firstFrameReady) {
      try {
        yt.game.firstFrameReady();
      } catch {
        // Safe fallback outside YT environment
      }
    }
  }

  public static signalGameReady(): void {
    if (this.isGameReadySent) return;
    this.isGameReadySent = true;

    const w = window as any;
    // 1. YouTube Playables
    if (w.ytgame?.game?.gameReady) {
      try {
        w.ytgame.game.gameReady();
      } catch {}
    }
    // 2. CrazyGames
    if (w.CrazyGames?.SDK?.game?.loadingStop) {
      try {
        w.CrazyGames.SDK.game.loadingStop();
      } catch {}
    }
    // 3. Yandex Games
    if (w.ysdk?.features?.LoadingAPI?.ready) {
      try {
        w.ysdk.features.LoadingAPI.ready();
      } catch {}
    }
    // 4. Poki
    if (w.PokiSDK?.gameLoadingFinished) {
      try {
        w.PokiSDK.gameLoadingFinished();
      } catch {}
    }
  }

  public static initLifecycle(options: {
    onPause: () => void;
    onResume: () => void;
    onAudioEnabledChange: (enabled: boolean) => void;
  }): void {
    const w = window as any;

    // YouTube Playables System Callbacks
    if (w.ytgame?.system) {
      try {
        w.ytgame.system.onPause(() => options.onPause());
        w.ytgame.system.onResume(() => options.onResume());

        if (typeof w.ytgame.system.isAudioEnabled === 'function') {
          const initialAudio = w.ytgame.system.isAudioEnabled();
          this.isAudioMutedByPlatform = !initialAudio;
          options.onAudioEnabledChange(initialAudio);
        }

        w.ytgame.system.onAudioEnabledChange((enabled: boolean) => {
          this.isAudioMutedByPlatform = !enabled;
          options.onAudioEnabledChange(enabled);
        });
      } catch {}
    }

    // Standard VisibilityChange Fallback
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        options.onPause();
      } else {
        options.onResume();
      }
    });
  }

  public static async loadData<T extends SaveDataPayload>(fallback: T): Promise<T> {
    const w = window as any;
    // YouTube Playables loadData must be awaited before saveData
    if (w.ytgame?.game?.loadData) {
      try {
        const raw = await w.ytgame.game.loadData();
        if (raw) {
          return { ...fallback, ...JSON.parse(raw) };
        }
      } catch {}
    }

    try {
      const local = localStorage.getItem('color_block_jam_3d_save_data');
      if (local) {
        return { ...fallback, ...JSON.parse(local) };
      }
    } catch {}

    return fallback;
  }

  public static async saveData(payload: SaveDataPayload): Promise<void> {
    const str = JSON.stringify(payload);
    const w = window as any;

    if (w.ytgame?.game?.saveData) {
      try {
        await w.ytgame.game.saveData(str);
      } catch {}
    }

    try {
      localStorage.setItem('color_block_jam_3d_save_data', str);
    } catch {}
  }

  public static sendScore(score: number): void {
    const intVal = Math.floor(score);
    const w = window as any;
    if (w.ytgame?.engagement?.sendScore) {
      try {
        w.ytgame.engagement.sendScore({ value: intVal });
      } catch {}
    }
  }

  public static isAudioMuted(): boolean {
    return this.isAudioMutedByPlatform;
  }
}
