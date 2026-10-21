export interface HudCallbacks {
  onRestartClick: () => void;
  onSoundToggle: () => void;
  onNextLevel: () => void;
  onUseHammer: () => void;
  onUseFreeHammerAd: () => Promise<void>;
  onAddMovesAd: () => Promise<void>;
  onUseVacuumAd: () => Promise<void>;
  onReviveAd: () => Promise<void>;
  onClaimMultiplierAd: (multiplier: number) => Promise<void>;
  onClaimBaseVictory: () => void;
  isAdReady: () => boolean;
}

export class Hud {
  private readonly container: HTMLElement;
  private readonly callbacks: HudCallbacks;

  // DOM Elements
  private levelBadge!: HTMLElement;
  private blocksBadge!: HTMLElement;
  private movesBadge!: HTMLElement;
  private coinsBadge!: HTMLElement;
  private soundBtn!: HTMLButtonElement;

  private hammerBtn!: HTMLButtonElement;
  private movesBtn!: HTMLButtonElement;
  private vacuumBtn!: HTMLButtonElement;

  // Modals
  private modalContainer!: HTMLElement;

  // Active state
  private isHammerActive = false;
  private needleAnimId: number | null = null;
  private currentMultiplier = 2.0;

  // Idempotency Latches
  private isVictoryShowing = false;
  private isGameOverShowing = false;
  private isReviveShowing = false;

  constructor(container: HTMLElement, callbacks: HudCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    this.render();
  }

  private render(): void {
    this.container.innerHTML = `
      <!-- Top Navigation & Status Bar -->
      <header class="hud-top-bar" data-hud-interactive="true">
        <div class="hud-left-stats">
          <div class="hud-chip hud-level-chip">
            <span class="chip-label">BÖLÜM</span>
            <span id="hud-level-val" class="chip-val">1</span>
          </div>
          <div class="hud-chip hud-blocks-chip">
            <span class="chip-label">KALAN</span>
            <span id="hud-blocks-val" class="chip-val">4</span>
          </div>
        </div>

        <div class="hud-center-stats">
          <div class="hud-moves-pill">
            <span class="moves-icon">⚡</span>
            <span id="hud-moves-val" class="moves-val">16</span>
            <span class="moves-tag">HAMLE</span>
          </div>
        </div>

        <div class="hud-right-actions">
          <div class="hud-chip hud-coins-chip">
            <span class="coins-icon">🪙</span>
            <span id="hud-coins-val" class="chip-val">150</span>
          </div>
          <button id="hud-sound-btn" class="hud-icon-btn" type="button" title="Sesi Aç/Kapat" data-hud-interactive="true">
            🔊
          </button>
          <button id="hud-reset-btn" class="hud-icon-btn" type="button" title="Yeniden Başlat" data-hud-interactive="true">
            🔄
          </button>
        </div>
      </header>

      <!-- Hammer Active Banner -->
      <div id="hud-hammer-banner" class="hud-hammer-banner" style="display: none;">
        <span>🔨 PARÇALAMAK İSTEDİĞİN BLOK'A DOKUN!</span>
        <button id="hud-hammer-cancel-btn" type="button" class="hud-cancel-pill" data-hud-interactive="true">İPTAL</button>
      </div>

      <!-- Bottom Rescue Boosters Bar (Hook 1) -->
      <footer class="hud-bottom-bar" data-hud-interactive="true">
        <button id="booster-hammer-btn" class="booster-chip" type="button" data-hud-interactive="true">
          <span class="booster-icon">🔨</span>
          <div class="booster-meta">
            <span class="booster-title">ÇEKİÇ</span>
            <span id="booster-hammer-tag" class="booster-badge">100 🪙</span>
          </div>
        </button>

        <button id="booster-moves-btn" class="booster-chip" type="button" data-hud-interactive="true">
          <span class="booster-icon">⚡</span>
          <div class="booster-meta">
            <span class="booster-title">+5 HAMLE</span>
            <span id="booster-moves-tag" class="booster-badge booster-badge-ad">🎬 FREE</span>
          </div>
        </button>

        <button id="booster-vacuum-btn" class="booster-chip" type="button" data-hud-interactive="true">
          <span class="booster-icon">🌪️</span>
          <div class="booster-meta">
            <span class="booster-title">VAKUM</span>
            <span id="booster-vacuum-tag" class="booster-badge booster-badge-ad">🎬 FREE</span>
          </div>
        </button>
      </footer>

      <!-- Modals Container -->
      <div id="hud-modal-container" class="hud-modal-container" style="display: none;" data-hud-interactive="true"></div>
    `;

    this.injectStyles();
    this.cacheElements();
    this.bindEvents();
  }

  private injectStyles(): void {
    if (document.getElementById('hud-injected-styles')) return;

    const style = document.createElement('style');
    style.id = 'hud-injected-styles';
    style.textContent = `
      .hud-top-bar {
        position: absolute;
        top: 0; left: 0; right: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 100%);
        pointer-events: auto;
        z-index: 50;
      }
      .hud-left-stats, .hud-right-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .hud-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(226, 232, 240, 0.9);
        border-radius: 20px;
        padding: 6px 12px;
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
      }
      .chip-label {
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1px;
        color: #64748b;
      }
      .chip-val {
        font-size: 14px;
        font-weight: 800;
        color: #0f172a;
      }
      .hud-moves-pill {
        display: flex;
        align-items: center;
        gap: 6px;
        background: linear-gradient(135deg, #0284c7, #0369a1);
        border: 2px solid #bae6fd;
        border-radius: 24px;
        padding: 6px 16px;
        box-shadow: 0 4px 14px rgba(14, 165, 233, 0.3);
      }
      .moves-icon { font-size: 16px; }
      .moves-val { font-size: 18px; font-weight: 900; color: #fff; }
      .moves-tag { font-size: 10px; font-weight: 800; letter-spacing: 1px; color: #bae6fd; }

      .hud-icon-btn {
        width: 36px; height: 36px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(203, 213, 225, 0.9);
        color: #0f172a;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.15s ease;
      }
      .hud-icon-btn:hover {
        background: #f0f9ff;
        border-color: #38bdf8;
        transform: scale(1.08);
      }

      /* Hammer Active Banner */
      .hud-hammer-banner {
        position: absolute;
        top: 74px;
        left: 50%;
        transform: translateX(-50%);
        background: #f59e0b;
        color: #000;
        padding: 8px 18px;
        border-radius: 20px;
        font-weight: 800;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(245, 158, 11, 0.5);
        z-index: 55;
        animation: pulseBanner 1s infinite alternate;
      }
      @keyframes pulseBanner {
        from { transform: translateX(-50%) scale(1); }
        to { transform: translateX(-50%) scale(1.04); }
      }
      .hud-cancel-pill {
        background: #000;
        color: #fff;
        border: none;
        border-radius: 12px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
      }

      /* Bottom Boosters Bar */
      .hud-bottom-bar {
        position: absolute;
        bottom: 18px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(255, 255, 255, 0.94);
        border: 1px solid rgba(226, 232, 240, 0.9);
        border-radius: 36px;
        padding: 8px 16px;
        backdrop-filter: blur(12px);
        pointer-events: auto;
        z-index: 50;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      }
      .booster-chip {
        display: flex;
        align-items: center;
        gap: 8px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 24px;
        padding: 6px 14px;
        color: #0f172a;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .booster-chip:hover {
        background: #f0f9ff;
        border-color: #38bdf8;
        transform: translateY(-2px);
      }
      .booster-chip:active {
        transform: scale(0.96);
      }
      .booster-chip.disabled-ad {
        opacity: 0.35 !important;
        pointer-events: none !important;
        cursor: not-allowed !important;
      }
      .booster-icon { font-size: 20px; }
      .booster-meta {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }
      .booster-title {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.5px;
        color: #0f172a;
      }
      .booster-badge {
        font-size: 9px;
        font-weight: 800;
        background: rgba(245, 158, 11, 0.15);
        color: #d97706;
        padding: 1px 6px;
        border-radius: 6px;
      }
      .booster-badge-ad {
        background: rgba(16, 185, 129, 0.15);
        color: #059669;
      }

      /* Modals */
      .hud-modal-container {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.5);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        z-index: 100;
      }
      .hud-card {
        background: #ffffff;
        border: 2px solid #bae6fd;
        border-radius: 20px;
        padding: 32px 28px;
        width: 90%;
        max-width: 420px;
        text-align: center;
        box-shadow: 0 20px 50px rgba(14, 165, 233, 0.18);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
        color: #0f172a;
      }
      .hud-card-title {
        margin: 0;
        font-size: 26px;
        font-weight: 900;
        letter-spacing: 2px;
        color: #0f172a;
      }
      .hud-card-subtitle {
        margin: 0;
        font-size: 13px;
        color: #64748b;
      }

      /* Multiplier Needle Bar (Hook 3) */
      .multiplier-gauge-wrapper {
        width: 100%;
        margin: 12px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      .multiplier-track {
        width: 100%;
        height: 38px;
        background: linear-gradient(90deg, #3b82f6 0%, #10b981 35%, #f59e0b 70%, #ef4444 100%);
        border-radius: 19px;
        position: relative;
        overflow: hidden;
        border: 2px solid #fff;
      }
      .multiplier-needle {
        position: absolute;
        top: 0; bottom: 0;
        width: 6px;
        background: #ffffff;
        box-shadow: 0 0 10px #ffffff, 0 0 20px #f59e0b;
        border-radius: 3px;
        transform: translateX(-50%);
        transition: left 0.04s linear;
      }
      .multiplier-labels {
        display: flex;
        justify-content: space-between;
        width: 100%;
        font-size: 11px;
        font-weight: 800;
        color: #cbd5e1;
        padding: 0 8px;
      }

      .btn-cta-gold {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #f59e0b, #d97706);
        border: none;
        border-radius: 14px;
        color: #000;
        font-size: 16px;
        font-weight: 900;
        letter-spacing: 1px;
        cursor: pointer;
        box-shadow: 0 4px 18px rgba(245, 158, 11, 0.4);
        transition: transform 0.15s ease;
      }
      .btn-cta-gold:hover { transform: translateY(-2px); }

      .btn-cta-emerald {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, #10b981, #059669);
        border: none;
        border-radius: 14px;
        color: #fff;
        font-size: 15px;
        font-weight: 900;
        letter-spacing: 1px;
        cursor: pointer;
        box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
        transition: transform 0.15s ease;
      }
      .btn-cta-emerald:hover { transform: translateY(-2px); }

      .btn-link-skip {
        background: transparent;
        border: none;
        color: #64748b;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        padding: 6px;
      }
      .btn-link-skip:hover { color: #cbd5e1; }
    `;
    document.head.appendChild(style);
  }

  private cacheElements(): void {
    this.levelBadge = this.container.querySelector('#hud-level-val') as HTMLElement;
    this.blocksBadge = this.container.querySelector('#hud-blocks-val') as HTMLElement;
    this.movesBadge = this.container.querySelector('#hud-moves-val') as HTMLElement;
    this.coinsBadge = this.container.querySelector('#hud-coins-val') as HTMLElement;
    this.soundBtn = this.container.querySelector('#hud-sound-btn') as HTMLButtonElement;

    this.hammerBtn = this.container.querySelector('#booster-hammer-btn') as HTMLButtonElement;
    this.movesBtn = this.container.querySelector('#booster-moves-btn') as HTMLButtonElement;
    this.vacuumBtn = this.container.querySelector('#booster-vacuum-btn') as HTMLButtonElement;

    this.modalContainer = this.container.querySelector('#hud-modal-container') as HTMLElement;
  }

  private bindEvents(): void {
    this.soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.callbacks.onSoundToggle();
    });

    const resetBtn = this.container.querySelector('#hud-reset-btn') as HTMLButtonElement;
    resetBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.callbacks.onRestartClick();
    });

    const hammerCancel = this.container.querySelector('#hud-hammer-cancel-btn') as HTMLButtonElement;
    hammerCancel.addEventListener('click', (e) => {
      e.stopPropagation();
      this.setHammerActive(false);
    });

    this.hammerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.callbacks.onUseHammer();
    });

    this.movesBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await this.callbacks.onAddMovesAd();
    });

    this.vacuumBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      await this.callbacks.onUseVacuumAd();
    });

    // Modal stop propagation
    this.modalContainer.addEventListener('pointerdown', (e) => e.stopPropagation());
    this.modalContainer.addEventListener('click', (e) => e.stopPropagation());
  }

  public updateHeader(level: number, remainingBlocks: number, moves: number, coins: number): void {
    this.levelBadge.textContent = level.toString();
    this.blocksBadge.textContent = remainingBlocks.toString();
    this.movesBadge.textContent = moves.toString();
    this.coinsBadge.textContent = coins.toString();

    // Check ad availability and update booster tags
    const adReady = this.callbacks.isAdReady();
    if (!adReady) {
      this.movesBtn.classList.add('disabled-ad');
      this.vacuumBtn.classList.add('disabled-ad');
    } else {
      this.movesBtn.classList.remove('disabled-ad');
      this.vacuumBtn.classList.remove('disabled-ad');
    }
  }

  public setSoundMuted(muted: boolean): void {
    this.soundBtn.textContent = muted ? '🔇' : '🔊';
  }

  public setHammerActive(active: boolean): void {
    this.isHammerActive = active;
    const banner = this.container.querySelector('#hud-hammer-banner') as HTMLElement;
    banner.style.display = active ? 'flex' : 'none';
  }

  public getIsHammerActive(): boolean {
    return this.isHammerActive;
  }

  public resetLatches(): void {
    this.isVictoryShowing = false;
    this.isGameOverShowing = false;
    this.isReviveShowing = false;
    this.modalContainer.style.display = 'none';
    this.modalContainer.innerHTML = '';
    if (this.needleAnimId !== null) {
      cancelAnimationFrame(this.needleAnimId);
      this.needleAnimId = null;
    }
  }

  /**
   * Hook 2: Near-Miss Revive Modal ("ÇOK YAKLAŞTIN! / SO CLOSE!")
   */
  public showNearMissRevive(
    remainingBlocks: number,
    onRevive: () => void,
    onGiveUp: () => void
  ): void {
    if (this.isReviveShowing || this.isGameOverShowing || this.isVictoryShowing) return;
    this.isReviveShowing = true;

    const adReady = this.callbacks.isAdReady();
    if (!adReady) {
      // If ad is unavailable, bypass revive directly to GameOver
      onGiveUp();
      return;
    }

    this.modalContainer.style.display = 'flex';
    this.modalContainer.innerHTML = `
      <div class="hud-card" data-hud-interactive="true">
        <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #f59e0b;">HAMLELERİN TÜKENDİ</span>
        <h2 class="hud-card-title" style="color: #ef4444;">ÇOK YAKLAŞTIN!</h2>
        <p class="hud-card-subtitle">Sadece ${remainingBlocks} blok kaldı! Reklam izleyerek +5 hamle ve anında ücretsiz Çekiç kazan!</p>
        
        <button id="revive-ad-btn" class="btn-cta-emerald" type="button" data-hud-interactive="true">
          🎬 İZLE & DEVAM ET (+5 HAMLE)
        </button>
        
        <button id="revive-skip-btn" class="btn-link-skip" type="button" data-hud-interactive="true">
          Pes Et (Bölüm Başarısız)
        </button>
      </div>
    `;

    const adBtn = this.modalContainer.querySelector('#revive-ad-btn') as HTMLButtonElement;
    const skipBtn = this.modalContainer.querySelector('#revive-skip-btn') as HTMLButtonElement;

    adBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      adBtn.disabled = true;
      await this.callbacks.onReviveAd();
      this.modalContainer.style.display = 'none';
      this.isReviveShowing = false;
      onRevive();
    });

    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.modalContainer.style.display = 'none';
      this.isReviveShowing = false;
      onGiveUp();
    });
  }

  /**
   * Hook 3: Victory Screen with Oscillating Multiplier Needle Bar (1.5x - 5x)
   */
  public showVictory(level: number, baseCoins: number): void {
    if (this.isVictoryShowing) return;
    this.isVictoryShowing = true;

    const adReady = this.callbacks.isAdReady();

    this.modalContainer.style.display = 'flex';
    this.modalContainer.innerHTML = `
      <div class="hud-card" data-hud-interactive="true">
        <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #10b981;">BÖLÜM TEMİZLENDİ!</span>
        <h2 class="hud-card-title" style="color: #38bdf8;">HARİKA KAÇIŞ!</h2>
        <p class="hud-card-subtitle">Bölüm ${level} tamamlandı. Temel Ödül: +${baseCoins} 🪙</p>

        ${
          adReady
            ? `
          <div class="multiplier-gauge-wrapper">
            <span style="font-size: 11px; font-weight: 800; color: #f59e0b;">ÇARPAN İBRESİNİ YAKALA!</span>
            <div class="multiplier-track">
              <div id="multiplier-needle" class="multiplier-needle" style="left: 50%;"></div>
            </div>
            <div class="multiplier-labels">
              <span>1.5x</span>
              <span>2.0x</span>
              <span>3.0x</span>
              <span>5.0x</span>
            </div>
          </div>

          <button id="victory-multiplier-btn" class="btn-cta-gold" type="button" data-hud-interactive="true">
            🎬 ÇARPANI KATLA (<span id="needle-multiplier-label">2.0x</span>)
          </button>
        `
            : ''
        }

        <button id="victory-continue-btn" class="${adReady ? 'btn-link-skip' : 'btn-cta-emerald'}" type="button" data-hud-interactive="true">
          ${adReady ? 'Normal Ödülü Al & Geç' : 'Bölüm Ödülünü Al & Devam Et (+50 🪙)'}
        </button>
      </div>
    `;

    const contBtn = this.modalContainer.querySelector('#victory-continue-btn') as HTMLButtonElement;
    contBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetLatches();
      this.callbacks.onClaimBaseVictory();
    });

    if (adReady) {
      const multBtn = this.modalContainer.querySelector('#victory-multiplier-btn') as HTMLButtonElement;
      const needle = this.modalContainer.querySelector('#multiplier-needle') as HTMLElement;
      const label = this.modalContainer.querySelector('#needle-multiplier-label') as HTMLElement;

      let startTime = performance.now();
      const animateNeedle = () => {
        const elapsed = (performance.now() - startTime) * 0.001;
        // Oscillating sin wave from 0% to 100%
        const normalized = (Math.sin(elapsed * 3.2) + 1) / 2;
        const leftPercent = 5 + normalized * 90;
        needle.style.left = `${leftPercent}%`;

        // Calculate dynamic multiplier from 1.5x to 5.0x
        this.currentMultiplier = Number((1.5 + normalized * 3.5).toFixed(1));
        label.textContent = `${this.currentMultiplier}x`;

        this.needleAnimId = requestAnimationFrame(animateNeedle);
      };
      this.needleAnimId = requestAnimationFrame(animateNeedle);

      multBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        if (this.needleAnimId !== null) {
          cancelAnimationFrame(this.needleAnimId);
          this.needleAnimId = null;
        }
        multBtn.disabled = true;
        const finalMult = this.currentMultiplier;
        await this.callbacks.onClaimMultiplierAd(finalMult);
        this.resetLatches();
        this.callbacks.onNextLevel();
      });
    }
  }

  /**
   * Game Over Screen
   */
  public showGameOver(onRetry: () => void): void {
    if (this.isGameOverShowing || this.isVictoryShowing) return;
    this.isGameOverShowing = true;

    this.modalContainer.style.display = 'flex';
    this.modalContainer.innerHTML = `
      <div class="hud-card" data-hud-interactive="true">
        <span style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #ef4444;">HAMLE KALMADI</span>
        <h2 class="hud-card-title">BÖLÜM BİTTİ</h2>
        <p class="hud-card-subtitle">Bloklar parçalayıcıya ulaşamadı. Yeniden deneyerek farklı bir sıra dene!</p>
        
        <button id="gameover-retry-btn" class="btn-cta-emerald" type="button" data-hud-interactive="true">
          🔄 TEKRAR DENE
        </button>
      </div>
    `;

    const retryBtn = this.modalContainer.querySelector('#gameover-retry-btn') as HTMLButtonElement;
    retryBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetLatches();
      onRetry();
    });
  }
}
