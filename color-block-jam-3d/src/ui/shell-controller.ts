export interface ShellControllerOptions {
  currentGameId: string;
  onRestart: () => void;
}

export class ShellController {
  private readonly options: ShellControllerOptions;
  private readonly restartBtn: HTMLElement | null;
  private readonly fullscreenBtn: HTMLElement | null;
  private readonly otherGamesList: HTMLElement | null;

  private onFullscreenChangeBound = () => this.handleFullscreenChange();

  constructor(options: ShellControllerOptions) {
    this.options = options;
    this.restartBtn = document.getElementById('shell-restart-btn');
    this.fullscreenBtn = document.getElementById('shell-fullscreen-btn');
    this.otherGamesList = document.getElementById('shell-other-games-list');

    this.init();
  }

  private init(): void {
    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('arcade:restart'));
        this.options.onRestart();
      });
    }

    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
      document.addEventListener('fullscreenchange', this.onFullscreenChangeBound);
    }

    this.loadOtherGames();
  }

  private toggleFullscreen(): void {
    const shell = document.getElementById('arcade-shell') || document.documentElement;
    if (!document.fullscreenElement) {
      shell.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
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

    try {
      const res = await fetch('../games.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const catalog = await res.json();
      const others = catalog.filter((g: { id: string }) => g.id !== this.options.currentGameId);

      this.otherGamesList.innerHTML = others
        .map(
          (g: any) => `
        <a href="../${g.id}/" class="other-game-item">
          <img src="../${g.id}/icon.svg" class="other-game-icon" alt="" onerror="this.style.display='none'" />
          <div class="other-game-meta">
            <span class="other-game-title">${g.title}</span>
            <span class="other-game-tag">${g.tags?.[0] || '3D HTML5'}</span>
          </div>
        </a>
      `
        )
        .join('');
    } catch {
      // Graceful silent fallback for local testing
    }
  }

  public dispose(): void {
    document.removeEventListener('fullscreenchange', this.onFullscreenChangeBound);
  }
}
