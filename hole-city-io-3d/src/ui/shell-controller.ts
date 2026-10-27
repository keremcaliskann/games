/**
 * Standardized 3-Column Arcade Shell Controller (Single Source of Truth across all Arcade 3D games).
 * - Permanently preserves the 3-column layout (Left Navigation Sidebar + Center 3D Stage + Right Ad Rail).
 * - Zero fullscreen mode or sidebar hiding.
 * - Observes #app with ResizeObserver so canvas & camera aspect ratio never stretch.
 * - Wires #shell-restart-btn, arcade:restart custom event, and ../games.json cross-discovery.
 */

export interface ShellControllerOptions {
  currentGameId: string;
  onRestart: () => void;
  onResize?: (width: number, height: number) => void;
}

export type ShellOptions = ShellControllerOptions;

export function applyDualModeShell(): boolean {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('yt-embed-mode');
    document.body?.classList.remove('embed-fullscreen-mode');
  }
  return false;
}

export class ShellController {
  private readonly options: ShellControllerOptions;
  private readonly restartBtn: HTMLElement | null;
  private readonly otherGamesList: HTMLElement | null;
  private resizeObserver: ResizeObserver | null = null;
  private lastRestartTimestamp = 0;
  private lastObservedWidth = 0;
  private lastObservedHeight = 0;

  private readonly onArcadeRestartBound = () => this.triggerRestart();

  constructor(options: ShellControllerOptions) {
    this.options = options;
    applyDualModeShell();

    this.restartBtn = document.getElementById('shell-restart-btn');
    this.otherGamesList = document.getElementById('shell-other-games-list');

    // Remove any legacy fullscreen button or banner if present in DOM
    document.getElementById('shell-fullscreen-btn')?.remove();
    document.getElementById('fullscreen-ad-banner')?.remove();

    this.init();
  }

  private init(): void {
    window.addEventListener('arcade:restart', this.onArcadeRestartBound);

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('arcade:restart'));
      });
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

  private async loadOtherGames(): Promise<void> {
    if (!this.otherGamesList) return;

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
    this.resizeObserver?.disconnect();
  }
}
