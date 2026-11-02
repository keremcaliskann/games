/**
 * Standardized 3-Column Arcade Shell Controller & Minimalist Theme-Matched Start Menu
 * (Single Source of Truth across all active & future Arcade 3D games).
 * - Automatically mounts/enforces the canonical 3-Column Arcade Shell DOM around #app/#game-container and #hud/#hud-root.
 * - Permanently displays Left Navigation Sidebar + Center 3D Stage + Right Sponsor Ad Rail (zero fullscreen toggle).
 * - Enforces MENU State Lock on boot (`isMenuOpen = true`): gameplay physics, timers, bots, and player controls remain
 *   passive while the live 3D scene renders behind a `backdrop-filter: blur(12px)` glass overlay.
 * - Minimalist Start Menu Card: Game Title, Difficulty Selector (Kolay / Normal / Zor), prominent OYNA button,
 *   and optional minimal icon button for sound (only if the game already provides an audio toggle).
 * - Supports ESC key & top-right ⏸ button to pause gameplay and re-open the menu at any time.
 */

export type GameDifficulty = 'easy' | 'normal' | 'hard';

export interface ShellControllerOptions {
  currentGameId: string;
  onRestart: () => void;
  onResize?: (width: number, height: number) => void;
  onDifficultyChange?: (difficulty: GameDifficulty, multiplier: number) => void;
}

export type ShellOptions = ShellControllerOptions;

interface GameThemePalette {
  themeColor: string;
  accentGradient: string;
  glowRgba: string;
  tintBg: string;
}

const GAME_THEMES: Record<string, GameThemePalette> = {
  'rally-horizon-3d': {
    themeColor: '#0284c7',
    accentGradient: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
    glowRgba: 'rgba(2, 132, 199, 0.34)',
    tintBg: 'rgba(224, 242, 254, 0.88)',
  },
  'smash-karts-brawl-3d': {
    themeColor: '#ef4444',
    accentGradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
    glowRgba: 'rgba(239, 68, 68, 0.34)',
    tintBg: 'rgba(254, 226, 226, 0.88)',
  },
  'bridge-rush-io-3d': {
    themeColor: '#2563eb',
    accentGradient: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
    glowRgba: 'rgba(37, 99, 235, 0.34)',
    tintBg: 'rgba(224, 242, 254, 0.88)',
  },
  'stumble-knockout-royale-3d': {
    themeColor: '#ec4899',
    accentGradient: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    glowRgba: 'rgba(236, 72, 153, 0.34)',
    tintBg: 'rgba(252, 231, 243, 0.88)',
  },
  'bumper-smash-io-3d': {
    themeColor: '#f97316',
    accentGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    glowRgba: 'rgba(249, 115, 22, 0.34)',
    tintBg: 'rgba(255, 237, 213, 0.88)',
  },
  'ragdoll-archers-duel-3d': {
    themeColor: '#2563eb',
    accentGradient: 'linear-gradient(135deg, #2563eb 0%, #f59e0b 100%)',
    glowRgba: 'rgba(37, 99, 235, 0.34)',
    tintBg: 'rgba(219, 234, 254, 0.88)',
  },
  'physics-drop-merge-3d': {
    themeColor: '#22c55e',
    accentGradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    glowRgba: 'rgba(34, 197, 94, 0.34)',
    tintBg: 'rgba(220, 252, 231, 0.88)',
  },
  'voxel-craft-smash-3d': {
    themeColor: '#f97316',
    accentGradient: 'linear-gradient(135deg, #f97316 0%, #eab308 100%)',
    glowRgba: 'rgba(249, 115, 22, 0.34)',
    tintBg: 'rgba(254, 243, 199, 0.88)',
  },
  'hole-city-io-3d': {
    themeColor: '#06b6d4',
    accentGradient: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
    glowRgba: 'rgba(6, 182, 212, 0.34)',
    tintBg: 'rgba(207, 250, 254, 0.88)',
  },
  'hexa-sort-3d': {
    themeColor: '#f59e0b',
    accentGradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    glowRgba: 'rgba(245, 158, 11, 0.34)',
    tintBg: 'rgba(254, 243, 199, 0.88)',
  },
  'cyber-arrow-3d': {
    themeColor: '#6366f1',
    accentGradient: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
    glowRgba: 'rgba(99, 102, 241, 0.34)',
    tintBg: 'rgba(224, 231, 255, 0.88)',
  },
};

const DEFAULT_THEME: GameThemePalette = {
  themeColor: '#2563eb',
  accentGradient: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
  glowRgba: 'rgba(37, 99, 235, 0.34)',
  tintBg: 'rgba(224, 242, 254, 0.88)',
};

export function applyDualModeShell(): boolean {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('yt-embed-mode');
    document.body?.classList.remove('embed-fullscreen-mode');
  }
  return false;
}

export class ShellController {
  private readonly options: ShellControllerOptions;
  public isMenuOpen = true;
  public difficulty: GameDifficulty = 'normal';

  private hasStartedOnce = false;
  private difficultyChangedWhileOpen = false;

  private stageEl: HTMLElement | null = null;
  private restartBtn: HTMLElement | null = null;
  private menuBtn: HTMLElement | null = null;
  private stagePauseBtn: HTMLElement | null = null;
  private startMenuEl: HTMLElement | null = null;
  private otherGamesList: HTMLElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private lastRestartTimestamp = 0;
  private lastObservedWidth = 0;
  private lastObservedHeight = 0;

  private readonly onArcadeRestartBound = () => this.triggerRestart();
  private readonly onKeyDownBound = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      e.preventDefault();
      if (this.isMenuOpen) {
        if (this.hasStartedOnce) {
          this.hideStartMenuAndPlay();
        }
      } else {
        this.showStartMenu();
      }
    }
  };

  constructor(options: ShellControllerOptions) {
    this.options = options;
    applyDualModeShell();

    this.ensureCanonicalShellDom();

    this.restartBtn = document.getElementById('shell-restart-btn');
    this.menuBtn = document.getElementById('shell-menu-btn');
    this.otherGamesList = document.getElementById('shell-other-games-list');

    this.init();
  }

  /**
   * Returns the pacing/challenge multiplier for the currently selected difficulty:
   * - Kolay ('easy'): 0.78
   * - Normal ('normal'): 1.0
   * - Zor ('hard'): 1.28
   */
  public getDifficultyMultiplier(): number {
    if (this.difficulty === 'easy') return 0.78;
    if (this.difficulty === 'hard') return 1.28;
    return 1.0;
  }

  /**
   * Ensures the outer 3-Column Arcade Shell (#arcade-shell -> Left Nav + #shell-stage + Right Ad Rail)
   * and Minimalist Start Menu (#shell-start-menu) are 100% identical across all games.
   */
  private ensureCanonicalShellDom(): void {
    if (typeof document === 'undefined') return;

    const appEl = document.getElementById('app') || document.getElementById('game-container');
    const hudEl = document.getElementById('hud') || document.getElementById('hud-root');
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

    let stageEl =
      document.getElementById('shell-stage') ||
      (shellEl.querySelector('.shell-stage') as HTMLElement | null);
    if (!stageEl) {
      stageEl = document.createElement('main');
      stageEl.appendChild(appEl);
      if (hudEl) stageEl.appendChild(hudEl);
    }
    stageEl.id = 'shell-stage';
    stageEl.className = 'shell-stage is-menu-locked';
    this.stageEl = stageEl;

    // Apply game-specific theme palette variables immediately
    this.applyThemePalette(GAME_THEMES[this.options.currentGameId] || DEFAULT_THEME);

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
        <button id="shell-menu-btn" class="shell-btn shell-btn-menu" type="button">
          <span class="btn-icon">🏠</span> Başlangıç Menüsü
        </button>
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

    // Mount Top-Right Minimal Pause Button inside #shell-stage
    let pauseBtn = document.getElementById('shell-stage-pause-btn') as HTMLButtonElement | null;
    if (!pauseBtn) {
      pauseBtn = document.createElement('button');
      pauseBtn.id = 'shell-stage-pause-btn';
      pauseBtn.type = 'button';
      stageEl.appendChild(pauseBtn);
    }
    pauseBtn.className = 'shell-stage-pause-btn';
    pauseBtn.title = 'Menü / Duraklat (ESC)';
    pauseBtn.setAttribute('data-hud-interactive', 'true');
    pauseBtn.textContent = '⏸';
    pauseBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
    pauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showStartMenu();
    });
    this.stagePauseBtn = pauseBtn;

    // Mount Universal Minimalist Start Menu Overlay inside #shell-stage
    this.mountStartMenu(stageEl);

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

  private applyThemePalette(palette: GameThemePalette): void {
    if (!this.stageEl) return;
    this.stageEl.style.setProperty('--menu-theme-color', palette.themeColor);
    this.stageEl.style.setProperty('--menu-accent-gradient', palette.accentGradient);
    this.stageEl.style.setProperty('--menu-glow-rgba', palette.glowRgba);
    this.stageEl.style.setProperty('--menu-tint-bg', palette.tintBg);
  }

  private findNativeSoundButton(): HTMLElement | null {
    if (typeof document === 'undefined') return null;
    return document.querySelector<HTMLElement>(
      '#sk-mute-btn, #btn-sound, #sound-btn, #hud-sound-btn, [id*="mute"], [id*="sound"]'
    );
  }

  private mountStartMenu(stageEl: HTMLElement): void {
    let menuEl = document.getElementById('shell-start-menu');
    if (!menuEl) {
      menuEl = document.createElement('div');
      menuEl.id = 'shell-start-menu';
      stageEl.appendChild(menuEl);
    }
    menuEl.className = 'shell-start-menu-overlay';
    menuEl.setAttribute('data-hud-interactive', 'true');

    const titleParts = document.title.split('//');
    const mainTitle = (titleParts[0] || '3D ARCADE').trim();

    menuEl.innerHTML = `
      <div class="shell-start-card" data-hud-interactive="true">
        <div class="shell-start-mini-tools" id="shell-start-mini-tools">
          <button id="shell-menu-sound-btn" class="shell-mini-icon-btn" type="button" title="Ses Aç/Kapat" style="display:none" data-hud-interactive="true">🔊</button>
          <button id="shell-menu-reset-btn" class="shell-mini-icon-btn" type="button" title="Sıfırdan Başlat" style="display:none" data-hud-interactive="true">🔄</button>
        </div>
        <div class="shell-start-icon-wrap">
          <img src="./icon.svg" alt="${mainTitle}" class="shell-start-icon" onerror="this.style.display='none'" />
        </div>
        <h1 class="shell-start-title" id="shell-start-title">${mainTitle}</h1>
        <div class="shell-difficulty-group" role="radiogroup" aria-label="Zorluk Seçimi" data-hud-interactive="true">
          <button type="button" class="shell-diff-btn" data-difficulty="easy" data-hud-interactive="true">Kolay</button>
          <button type="button" class="shell-diff-btn is-active" data-difficulty="normal" data-hud-interactive="true">Normal</button>
          <button type="button" class="shell-diff-btn" data-difficulty="hard" data-hud-interactive="true">Zor</button>
        </div>
        <button id="shell-start-play-btn" class="shell-start-play-btn" type="button" data-hud-interactive="true">
          <span>▶</span> <span id="shell-start-play-label">OYNA</span>
        </button>
      </div>
    `;

    // Prevent pointer events on the start menu from bleeding into the 3D canvas
    const stopBleed = (e: Event) => {
      e.stopPropagation();
    };
    menuEl.addEventListener('pointerdown', stopBleed);
    menuEl.addEventListener('pointermove', stopBleed);
    menuEl.addEventListener('pointerup', stopBleed);
    menuEl.addEventListener('mousedown', stopBleed);
    menuEl.addEventListener('touchstart', stopBleed, { passive: true });

    // Wire Difficulty Selection buttons
    const diffButtons = menuEl.querySelectorAll<HTMLButtonElement>('.shell-diff-btn');
    diffButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selected = (btn.getAttribute('data-difficulty') as GameDifficulty) || 'normal';
        if (selected !== this.difficulty) {
          this.difficulty = selected;
          this.difficultyChangedWhileOpen = true;
        }
        diffButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
        const mult = this.getDifficultyMultiplier();
        this.options.onDifficultyChange?.(this.difficulty, mult);
        window.dispatchEvent(
          new CustomEvent('arcade:difficulty', {
            detail: { difficulty: this.difficulty, multiplier: mult },
          })
        );
      });
    });

    // Wire Optional Minimal Sound Icon Button (only shown if the game HUD has a sound toggle)
    const soundBtn = menuEl.querySelector<HTMLButtonElement>('#shell-menu-sound-btn');
    const syncSoundIcon = () => {
      if (!soundBtn) return;
      const nativeSound = this.findNativeSoundButton();
      if (nativeSound) {
        soundBtn.style.display = 'inline-flex';
        const txt = nativeSound.textContent?.trim() || '';
        soundBtn.textContent = txt.includes('🔇') ? '🔇' : '🔊';
      } else {
        soundBtn.style.display = 'none';
      }
    };
    setTimeout(syncSoundIcon, 60);

    if (soundBtn) {
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nativeSound = this.findNativeSoundButton();
        if (nativeSound) {
          nativeSound.click();
          syncSoundIcon();
        }
      });
    }

    // Wire Minimal Reset Icon Button (for clean reset from pause menu)
    const resetBtn = menuEl.querySelector<HTMLButtonElement>('#shell-menu-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.difficultyChangedWhileOpen = true;
        this.hideStartMenuAndPlay();
      });
    }

    const playBtn = menuEl.querySelector('#shell-start-play-btn') as HTMLButtonElement | null;
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideStartMenuAndPlay();
      });
    }

    this.startMenuEl = menuEl;
  }

  public showStartMenu(): void {
    if (!this.startMenuEl) return;
    this.isMenuOpen = true;
    this.difficultyChangedWhileOpen = false;
    this.stageEl?.classList.add('is-menu-locked');
    this.startMenuEl.classList.remove('is-hidden');

    // Sync optional sound & reset buttons
    const resetBtn = this.startMenuEl.querySelector<HTMLButtonElement>('#shell-menu-reset-btn');
    if (resetBtn) {
      resetBtn.style.display = this.hasStartedOnce ? 'inline-flex' : 'none';
    }
    const soundBtn = this.startMenuEl.querySelector<HTMLButtonElement>('#shell-menu-sound-btn');
    const nativeSound = this.findNativeSoundButton();
    if (soundBtn && nativeSound) {
      soundBtn.style.display = 'inline-flex';
      const txt = nativeSound.textContent?.trim() || '';
      soundBtn.textContent = txt.includes('🔇') ? '🔇' : '🔊';
    }
  }

  public hideStartMenuAndPlay(): void {
    if (!this.startMenuEl) return;
    const wasVisible = this.isMenuOpen || !this.startMenuEl.classList.contains('is-hidden');
    this.isMenuOpen = false;
    this.stageEl?.classList.remove('is-menu-locked');
    this.startMenuEl.classList.add('is-hidden');

    if (wasVisible && (!this.hasStartedOnce || this.difficultyChangedWhileOpen)) {
      this.hasStartedOnce = true;
      this.difficultyChangedWhileOpen = false;
      this.triggerRestart();
    }
  }

  private init(): void {
    window.addEventListener('arcade:restart', this.onArcadeRestartBound);
    window.addEventListener('keydown', this.onKeyDownBound);

    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        this.isMenuOpen = false;
        this.hasStartedOnce = true;
        this.difficultyChangedWhileOpen = false;
        this.stageEl?.classList.remove('is-menu-locked');
        this.startMenuEl?.classList.add('is-hidden');
        window.dispatchEvent(new CustomEvent('arcade:restart'));
      });
    }

    if (this.menuBtn) {
      this.menuBtn.addEventListener('click', () => {
        this.showStartMenu();
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
    const appEl =
      document.getElementById('app') ||
      document.getElementById('game-container') ||
      document.getElementById('shell-stage');
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

      // Hydrate current game's theme palette from games.json if present
      const currentEntry = catalog.find(
        (g: { id: string }) => g.id === this.options.currentGameId
      );
      if (currentEntry && currentEntry.themeColor && currentEntry.accentGradient && this.stageEl) {
        this.stageEl.style.setProperty('--menu-theme-color', currentEntry.themeColor);
        this.stageEl.style.setProperty('--menu-accent-gradient', currentEntry.accentGradient);
      }

      const others = catalog.filter(
        (g: { id: string; active?: boolean }) =>
          g.id !== this.options.currentGameId && g.active !== false
      );

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
    window.removeEventListener('keydown', this.onKeyDownBound);
    this.resizeObserver?.disconnect();
    void this.stagePauseBtn;
  }
}
