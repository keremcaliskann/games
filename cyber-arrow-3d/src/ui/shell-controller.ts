/**
 * Standardized Dual-Mode Arcade Shell Controller (Single Source of Truth across all Arcade 3D games).
 * - Automatically collapses sidebars in embedded portals (YouTube Playables, Yandex, CrazyGames, Poki, ?embed=1).
 * - Observes #app with ResizeObserver so canvas & camera aspect ratio never stretch when sidebars toggle.
 * - Wires #shell-restart-btn, #shell-fullscreen-btn, arcade:restart custom event, and ../games.json cross-discovery.
 */

export interface ShellControllerOptions {
  currentGameId: string;
  onRestart: () => void;
  onResize?: (width: number, height: number) => void;
}

export type ShellOptions = ShellControllerOptions;

export function applyDualModeShell(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  const w = window as any;
  const isEmbedded = Boolean(
    w.ytgame?.IN_PLAYABLES_ENV ||
      w.YaGames ||
      w.CrazyGames?.SDK ||
      w.PokiSDK ||
      new URLSearchParams(window.location.search).get('embed') === '1'
  );
  if (isEmbedded) {
    document.documentElement.classList.add('yt-embed-mode');
    document.body?.classList.add('embed-fullscreen-mode');
  }
  return isEmbedded;
}

export class ShellController {
  private readonly options: ShellControllerOptions;
  private readonly restartBtn: HTMLElement | null;
  private readonly fullscreenBtn: HTMLElement | null;
  private readonly otherGamesList: HTMLElement | null;
  private resizeObserver: ResizeObserver | null = null;
  private lastRestartTimestamp = 0;
  private lastObservedWidth = 0;
  private lastObservedHeight = 0;

  private readonly onFullscreenChangeBound = () => this.handleFullscreenChange();
  private readonly onArcadeRestartBound = () => this.triggerRestart();

  constructor(options: ShellControllerOptions) {
    this.options = options;
    applyDualModeShell();

    this.restartBtn = document.getElementById('shell-restart-btn');
    this.fullscreenBtn = document.getElementById('shell-fullscreen-btn');
    this.otherGamesList = document.getElementById('shell-other-games-list');

    this.init();
  }

  private init(): void {
    window.addEventListener('arcade:restart', this.onArcadeRestartBound);

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('arcade:restart'));
      });
    }

    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
      document.addEventListener('fullscreenchange', this.onFullscreenChangeBound);
    }

    this.setupResizeObserver();
    void this.loadOtherGames();
  }

  private triggerRestart(): void {
    const now = performance.now();
    if (now - this.lastRestartTimestamp < 80) return;
    this.lastRestartTimestamp = now;
    this.options.onRestart();
  }

  private setupResizeObserver(): void {
    const appEl = document.getElementById('app');
    if (!appEl || typeof ResizeObserver === 'undefined') return;

    this.resizeObserver = new ResizeObserver((entries) => {
      for (let i = 0; i < entries.length; i++) {
        const rect = entries[i].contentRect;
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);
        if (w > 0 && h > 0 && (w !== this.lastObservedWidth || h !== this.lastObservedHeight)) {
          this.lastObservedWidth = w;
          this.lastObservedHeight = h;
          if (this.options.onResize) {
            this.options.onResize(w, h);
          }
          window.dispatchEvent(new Event('resize'));
        }
      }
    });
    this.resizeObserver.observe(appEl);
  }

  private toggleFullscreen(): void {
    const shell = document.getElementById('arcade-shell') || document.documentElement;
    if (!document.fullscreenElement) {
      shell.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }

  private handleFullscreenChange(): void {
    if (!this.fullscreenBtn) return;
    if (document.fullscreenElement) {
      this.fullscreenBtn.innerHTML = '<span class="btn-icon">⛷</span> Tam Ekrandan Çık';
    } else {
      this.fullscreenBtn.innerHTML = '<span class="btn-icon">⛶</span> Tam Ekran';
    }
  }

  private async loadOtherGames(): Promise<void> {
    if (!this.otherGamesList) return;
    if (
      document.body.classList.contains('embed-fullscreen-mode') ||
      document.documentElement.classList.contains('yt-embed-mode')
    ) {
      return;
    }

    try {
      const res = await fetch('../games.json');
      if (!res.ok) return;
      const catalog = await res.json();
      const others = catalog.filter((g: { id: string }) => g.id !== this.options.currentGameId);

      this.otherGamesList.innerHTML = others
        .map(
          (g: any) => `
        <a href="../${g.id}/" class="other-game-item shell-game-card">
          <img src="../${g.id}/icon.svg" class="other-game-icon" alt="" onerror="this.style.display='none'" />
          <div class="other-game-meta game-info">
            <span class="other-game-title game-title">${g.title}</span>
            <span class="other-game-tag game-tag">${g.tags?.[0] || '3D HTML5'}</span>
          </div>
        </a>
      `
        )
        .join('');
    } catch {
      // Graceful silent fallback in offline or standalone preview
    }
  }

  public dispose(): void {
    window.removeEventListener('arcade:restart', this.onArcadeRestartBound);
    document.removeEventListener('fullscreenchange', this.onFullscreenChangeBound);
    this.resizeObserver?.disconnect();
  }
}
