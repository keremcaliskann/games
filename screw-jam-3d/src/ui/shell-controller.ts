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
      if (!res.ok) return;
      const games = await res.json();

      const other = games.filter((g: any) => g.id !== this.options.currentGameId);
      this.otherGamesList.innerHTML = other
        .map(
          (g: any) => `
            <a href="${g.url}" class="shell-game-card">
              <span class="game-icon">${g.icon}</span>
              <div class="game-info">
                <span class="game-title">${g.title}</span>
                <span class="game-tag">${g.tag}</span>
              </div>
            </a>
          `
        )
        .join('');
    } catch {
      // Non-blocking in portal mode
    }
  }

  public dispose(): void {
    document.removeEventListener('fullscreenchange', this.onFullscreenChangeBound);
  }
}
