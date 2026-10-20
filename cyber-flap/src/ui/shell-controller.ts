export interface ShellControllerOptions {
  currentGameId: string;
  onRestart: () => void;
}

interface GameCatalogItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  iconEmoji?: string;
  tags?: string[];
}

/**
 * Standardized Arcade Shell Controller.
 * Manages sidebar actions:
 * - Return to portal (../)
 * - Restart game session
 * - Fullscreen toggle with ad banner preservation
 * - Dynamic discovery list from ../games.json
 */
export class ShellController {
  private readonly restartBtn: HTMLButtonElement | null;
  private readonly fullscreenBtn: HTMLButtonElement | null;
  private readonly shellEl: HTMLElement | null;
  private readonly otherGamesContainer: HTMLElement | null;

  private readonly onFullscreenChangeBound = (): void => {
    this.updateFullscreenButton();
  };

  private readonly onRestartClickBound = (): void => {
    this.options.onRestart();
    window.dispatchEvent(new CustomEvent('arcade:restart'));
  };

  private readonly onFullscreenClickBound = async (): Promise<void> => {
    await this.toggleFullscreen();
  };

  constructor(private readonly options: ShellControllerOptions) {
    this.restartBtn = document.getElementById('shell-restart-btn') as HTMLButtonElement | null;
    this.fullscreenBtn = document.getElementById('shell-fullscreen-btn') as HTMLButtonElement | null;
    this.shellEl = document.getElementById('arcade-shell');
    this.otherGamesContainer = document.getElementById('shell-other-games-list');

    this.bindEvents();
    void this.loadOtherGames();
  }

  private bindEvents(): void {
    this.restartBtn?.addEventListener('click', this.onRestartClickBound);
    this.fullscreenBtn?.addEventListener('click', this.onFullscreenClickBound);
    document.addEventListener('fullscreenchange', this.onFullscreenChangeBound);
  }

  private async toggleFullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        const target = this.shellEl || document.documentElement;
        if (target.requestFullscreen) {
          await target.requestFullscreen();
        }
      }
    } catch (err: unknown) {
      console.warn('Fullscreen request failed:', err);
    }
  }

  private updateFullscreenButton(): void {
    if (!this.fullscreenBtn) return;
    if (document.fullscreenElement) {
      this.fullscreenBtn.innerHTML = '<span class="btn-icon">⛷</span> Tam Ekrandan Çık';
    } else {
      this.fullscreenBtn.innerHTML = '<span class="btn-icon">⛶</span> Tam Ekran';
    }
  }

  private async loadOtherGames(): Promise<void> {
    if (!this.otherGamesContainer) return;

    let catalog: GameCatalogItem[] | null = null;

    try {
      const res = await fetch('../games.json');
      if (res.ok) {
        catalog = (await res.json()) as GameCatalogItem[];
      }
    } catch {
      // Cascading fallback
    }

    if (!catalog || !Array.isArray(catalog)) {
      try {
        const res = await fetch('/games.json');
        if (res.ok) {
          catalog = (await res.json()) as GameCatalogItem[];
        }
      } catch {
        // Cascading fallback
      }
    }

    if (!catalog || !Array.isArray(catalog)) {
      catalog = [
        {
          id: 'cyber-flap',
          title: 'CYBER FLAP // 2099',
          icon: '../cyber-flap/icon.svg',
          tags: ['3D Runner', 'Cyberpunk'],
        },
        {
          id: 'cyber-arrow-3d',
          title: 'CYBER ARROW 3D',
          icon: '../cyber-arrow-3d/icon.svg',
          tags: ['3D Puzzle', 'Spatial Logic'],
        },
      ];
    }

    const otherGames = catalog.filter((g) => g.id !== this.options.currentGameId);
    if (otherGames.length === 0) {
      this.otherGamesContainer.innerHTML = '<div class="other-games-empty">Başka oyun bulunamadı</div>';
      return;
    }

    this.otherGamesContainer.innerHTML = otherGames
      .map((g) => {
        let iconUrl = `../${g.id}/icon.svg`;
        if (g.icon) {
          if (g.icon.startsWith('./')) {
            iconUrl = `../${g.icon.slice(2)}`;
          } else if (g.icon.startsWith('../') || g.icon.startsWith('http')) {
            iconUrl = g.icon;
          }
        }
        const tag = g.tags?.[0] || '3D HTML5';
        return `
          <a href="../${g.id}/" class="other-game-item" title="${g.title}">
            <img src="${iconUrl}" class="other-game-icon" alt="" onerror="this.style.display='none'" />
            <div class="other-game-meta">
              <span class="other-game-title">${g.title}</span>
              <span class="other-game-tag">${tag}</span>
            </div>
          </a>
        `;
      })
      .join('');
  }

  public dispose(): void {
    this.restartBtn?.removeEventListener('click', this.onRestartClickBound);
    this.fullscreenBtn?.removeEventListener('click', this.onFullscreenClickBound);
    document.removeEventListener('fullscreenchange', this.onFullscreenChangeBound);
  }
}
