import { EventBus } from '../core/events';

export interface HudCallbacks {
  onHintClick: () => void;
  onResetClick: () => void;
  onSoundToggle: () => boolean;
  onNextLevel: () => void;
  onWatchAd: () => void;
}

/**
 * Mobile-responsive DOM-based HUD overlay.
 * Uses safe area insets and tactile touch buttons.
 */
export class Hud {
  private readonly bus = EventBus.get();
  private levelEl!: HTMLElement;
  private remainingEl!: HTMLElement;
  private coinsEl!: HTMLElement;
  private soundBtn!: HTMLElement;

  constructor(private readonly container: HTMLElement, private readonly callbacks: HudCallbacks) {
    this.buildHud();
    this.bindEvents();
  }

  private buildHud(): void {
    this.container.innerHTML = `
      <div class="hud-header">
        <div class="hud-chip level" id="hud-level">LVL 1</div>
        <div class="hud-chip remaining" id="hud-remaining">BLOKLAR: 0</div>
        <div class="hud-chip coins" id="hud-coins" style="cursor: pointer;">
          🪙 <span id="coin-count">0</span>
          <span style="color: #00f0ff; margin-left: 4px;">[+]</span>
        </div>
      </div>

      <div class="hud-footer">
        <button class="hud-btn" id="btn-sound">🔊 SES</button>
        <button class="hud-btn" id="btn-reset">🔄 YENİDEN</button>
        <button class="hud-btn primary" id="btn-hint">💡 İPUCU (20🪙)</button>
      </div>
    `;

    this.levelEl = this.container.querySelector('#hud-level')!;
    this.remainingEl = this.container.querySelector('#hud-remaining')!;
    this.coinsEl = this.container.querySelector('#coin-count')!;
    this.soundBtn = this.container.querySelector('#btn-sound')!;

    this.container.querySelector('#btn-hint')!.addEventListener('click', () => {
      this.callbacks.onHintClick();
    });

    this.container.querySelector('#btn-reset')!.addEventListener('click', () => {
      this.callbacks.onResetClick();
    });

    this.container.querySelector('#hud-coins')!.addEventListener('click', () => {
      this.showRewardedAdPrompt();
    });

    this.soundBtn.addEventListener('click', () => {
      const isMuted = this.callbacks.onSoundToggle();
      this.soundBtn.textContent = isMuted ? '🔇 SES' : '🔊 SES';
    });
  }

  private bindEvents(): void {
    this.bus.on('coins_updated', (coins: number) => {
      this.setCoins(coins);
    });

    this.bus.on('block_cleared', () => {
      // Small bounce on remaining chip
      this.remainingEl.style.transform = 'scale(1.15)';
      setTimeout(() => {
        this.remainingEl.style.transform = 'scale(1)';
      }, 100);
    });
  }

  public updateHeader(level: number, remaining: number, coins: number): void {
    this.levelEl.textContent = `LVL ${level}`;
    this.remainingEl.textContent = `KALAN: ${remaining}`;
    this.coinsEl.textContent = `${coins}`;
  }

  public setRemaining(remaining: number): void {
    this.remainingEl.textContent = `KALAN: ${remaining}`;
  }

  public setCoins(coins: number): void {
    this.coinsEl.textContent = `${coins}`;
  }

  public showVictory(level: number, coinsEarned: number, showAdNotice: boolean): void {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">TEMİZLENDİ! ✨</h2>
        <p class="modal-desc">Seviye ${level} başarıyla tamamlandı. Tüm yön okları boşluğa fırlatıldı.</p>
        <div class="modal-reward">+${coinsEarned} NEON COIN 🪙</div>
        ${showAdNotice ? '<div style="font-size: 11px; color: #ffaa00; margin-bottom: 12px;">📺 [GEÇİŞ REKLAMI SERGİLENDİ]</div>' : ''}
        <button class="hud-btn primary" id="btn-next" style="width: 100%; justify-content: center; padding: 14px;">
          SONRAKİ SEVİYE ➔
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-next')!.addEventListener('click', () => {
      modal.remove();
      this.callbacks.onNextLevel();
    });
  }

  public showRewardedAdPrompt(): void {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">ÖDÜLLÜ REKLAM 🎁</h2>
        <p class="modal-desc">Kısa bir tanıtım videosu izleyerek anında 50 Neon Coin kazanın!</p>
        <div class="modal-reward">+50 NEON COIN 🪙</div>
        <div style="display: flex; gap: 10px;">
          <button class="hud-btn" id="btn-cancel" style="flex: 1; justify-content: center;">KAPAT</button>
          <button class="hud-btn primary" id="btn-watch" style="flex: 1.5; justify-content: center;">
            İZLE (+50)
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-cancel')!.addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('#btn-watch')!.addEventListener('click', () => {
      modal.remove();
      this.callbacks.onWatchAd();
    });
  }
}
