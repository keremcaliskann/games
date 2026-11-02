/**
 * Standardized 3-Column Arcade Shell Controller (Single Source of Truth across all Arcade 3D games).
 * - Automatically mounts/enforces the canonical 3-Column Arcade Shell DOM around #app and #hud
 *   so the inner game (#app + #hud) is 100% independent of the outer screen layout.
 * - Permanently displays Left Navigation Sidebar + Center 3D Stage + Right Sponsor Ad Rail.
 * - Zero fullscreen mode or sidebar hiding.
 * - Observes #app with ResizeObserver so canvas & camera aspect ratio always match #shell-stage.
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
  private restartBtn: HTMLElement | null = null;
  private otherGamesList: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private lastRestartTimestamp = 0;
  private lastObservedWidth = 0;
  private lastObservedHeight = 0;

  private readonly onArcadeRestartBound = () => this.triggerRestart();

  constructor(options: ShellControllerOptions) {
    this.options = options;
    applyDualModeShell();

    this.ensureCanonicalShellDom();

    this.restartBtn = document.getElementById('shell-restart-btn');
    this.otherGamesList = document.getElementById('shell-other-games-list');

    this.init();
  }

  /**
   * Ensures the outer 3-Column Arcade Shell (#arcade-shell -> Left Nav + #shell-stage + Right Ad Rail)
   * is 100% identical across all games, while keeping #app and #hud untouched inside #shell-stage.
   */
  private ensureCanonicalShellDom(): void {
    if (typeof document === 'undefined') return;

    const appEl = document.getElementById('app');
    const hudEl = document.getElementById('hud');
    if (!appEl) return;

    appEl.classList.add('game-canvas-container');
    if (hudEl) {
      hudEl.classList.add('game-hud-overlay');
    }

    let shellEl = document.getElementById('arcade-shell');
    if (!shellEl) {
      shellEl = document.createElement('div');
      shellEl.id = 'arcade-shell';
      document.body.prepend(shellEl);
    }
    shellEl.className = 'arcade-shell';

    let stageEl = document.getElementById('shell-stage') || shellEl.querySelector('.shell-stage') as HTMLElement | null;
    if (!stageEl) {
      stageEl = document.createElement('main');
      stageEl.appendChild(appEl);
      if (hudEl) stageEl.appendChild(hudEl);
    }
    stageEl.id = 'shell-stage';
    stageEl.className = 'shell-stage';

    // Remove any legacy fullscreen elements
    document.getElementById('shell-fullscreen-btn')?.remove();
    document.getElementById('fullscreen-ad-banner')?.remove();

    // Ensure canonical Left Navigation Sidebar
    let leftEl = shellEl.querySelector('.shell-sidebar-left') as HTMLElement | null;
    if (!leftEl) {
      leftEl = document.createElement('aside');
      shellEl.prepend(leftEl);
    }
    leftEl.className = 'shell-sidebar shell-sidebar-left';
    leftEl.innerHTML = `
      <div class="shell-brand">
        <a href="../" class="shell-brand-link">
          <span class="shell-brand-badge">ARCADE</span>
          <span class="shell-brand-title">3D GAMES</span>
        </a>
      </div>
      <nav class="shell-nav">
        <a href="../" class="shell-btn shell-btn-portal" title="Return to Central Arcade Portal">
          <span class="btn-icon">←</span> Portala Dön
        </a>
        <button id="shell-restart-btn" class="shell-btn shell-btn-restart" type="button">
          <span class="btn-icon">🔄</span> Yeniden Başlat
        </button>
      </nav>
      <section class="shell-other-games">
        <h3 class="shell-section-title">Diğer Oyunlar</h3>
        <div id="shell-other-games-list" class="other-games-list"></div>
      </section>
    `;

    // Ensure Stage is between Left and Right sidebars
    if (stageEl.parentElement !== shellEl) {
      shellEl.appendChild(stageEl);
    }

    // Ensure canonical Right Sponsor Ad Rail
    let rightEl = shellEl.querySelector('.shell-sidebar-right') as HTMLElement | null;
    if (!rightEl) {
      rightEl = document.createElement('aside');
      shellEl.appendChild(rightEl);
    }
    rightEl.className = 'shell-sidebar shell-sidebar-right';
    const shortTitle = document.title.split('//')[0].trim() || 'ARCADE 3D';
    rightEl.innerHTML = `
      <div class="ad-rail-wrapper">
        <span class="ad-header-tag">SPONSOR // REKLAM</span>
        <div id="ad-banner-desktop" class="ad-banner-slot banner-300x600">
          <div class="ad-mock-creative">
            <div class="ad-mock-glow"></div>
            <p class="ad-mock-brand">${shortTitle}</p>
            <p class="ad-mock-desc">Zero-install 60 FPS WebGL 3D Arcade</p>
            <div class="ad-mock-cta">ŞİMDİ OYNA</div>
          </div>
        </div>
      </div>
    `;
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
