import { EventBus } from '../core/events';

export interface HudCallbacks {
  onHintClick: () => void;
  onResetClick: () => void;
  onSoundToggle: () => boolean;
  onNextLevel: () => void;
  onWatchAd: () => void;
  onWatchMultiplierAd: (multiplier: number) => void;
  onFreeHintAd: () => void;
}

/**
 * Mobile-responsive DOM-based HUD overlay.
 * Uses safe area insets, tactile touch buttons, and YouTube Playables revenue hooks.
 */
export class Hud {
  private readonly bus = EventBus.get();
  private levelEl!: HTMLElement;
  private remainingEl!: HTMLElement;
  private coinsEl!: HTMLElement;
  private soundBtn!: HTMLElement;
  private hintBtn!: HTMLElement;

  constructor(private readonly container: HTMLElement, private readonly callbacks: HudCallbacks) {
    this.buildHud();
    this.bindEvents();
  }

  private buildHud(): void {
    this.container.innerHTML = `
      <div class="hud-header">
        <div class="hud-chip level" id="hud-level">LVL 1</div>
        <div class="hud-chip remaining" id="hud-remaining">BLOKLAR: 0</div>
        <div class="hud-chip coins" id="hud-coins" style="cursor: pointer;" title="Ücretsiz Coin Kazan">
          🪙 <span id="coin-count">0</span>
          <span style="color: #0284c7; font-weight: 800; margin-left: 4px;">[+🎬]</span>
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
    this.hintBtn = this.container.querySelector('#btn-hint')!;

    this.hintBtn.addEventListener('click', () => {
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
    if (coins < 20) {
      this.hintBtn.innerHTML = `💡 İPUCU <span style="font-size:10px; background:#f59e0b; color:#000; padding:2px 4px; border-radius:4px; margin-left:4px;">🎬 FREE</span>`;
    } else {
      this.hintBtn.innerHTML = `💡 İPUCU (20🪙)`;
    }
  }

  public setRemaining(remaining: number): void {
    this.remainingEl.textContent = `KALAN: ${remaining}`;
  }

  public setCoins(coins: number): void {
    this.coinsEl.textContent = `${coins}`;
  }

  public setSoundMuted(isMuted: boolean): void {
    this.soundBtn.textContent = isMuted ? '🔇 SES' : '🔊 SES';
  }

  /**
   * Hook 3: Victory Screen with Animated 1.5x - 5x Multiplier Needle
   */
  public showVictory(level: number, baseCoins: number): void {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';

    let currentMultiplier = 3;
    const multipliers = [1.5, 2, 3, 5, 3, 2, 1.5];
    let multIdx = 2;

    modal.innerHTML = `
      <div class="modal-card" style="max-width: 400px; text-align: center;">
        <span style="font-size: 11px; letter-spacing: 2px; color: #38bdf8; font-weight: 800;">TEBRİKLER!</span>
        <h2 class="modal-title" style="margin: 6px 0 12px; font-size: 24px;">TEMİZLENDİ! ✨</h2>
        <p class="modal-desc" style="margin-bottom: 16px;">Seviye ${level} başarıyla çözüldü.</p>

        <!-- Multiplier Gauge -->
        <div style="background: rgba(2, 132, 199, 0.12); border: 1px solid #0284c7; border-radius: 12px; padding: 12px; margin-bottom: 16px;">
          <div style="font-size: 11px; font-weight: 800; color: #94a3b8; margin-bottom: 6px;">ÖDÜL ÇARPANI</div>
          <div id="multiplier-display" style="font-size: 26px; font-weight: 900; color: #f59e0b; transition: all 0.15s;">3x ÇARPAN!</div>
          <div style="font-size: 13px; color: #10b981; font-weight: 700; margin-top: 4px;">
            Toplam: <span id="mult-coins-preview">+${baseCoins * 3}</span> Neon Coin 🪙
          </div>
        </div>

        <button class="hud-btn primary" id="btn-multiply" style="width: 100%; justify-content: center; padding: 14px; margin-bottom: 8px; font-size: 15px; font-weight: 800; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000;">
          🎬 ÇARPANI AL (+${baseCoins * 3} 🪙)
        </button>

        <button class="hud-btn" id="btn-claim-base" style="width: 100%; justify-content: center; padding: 10px; font-size: 13px; color: #94a3b8; background: transparent; border: none;">
          Sadece +${baseCoins} Coin Al & Geç ➔
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    const multDisp = modal.querySelector('#multiplier-display') as HTMLElement;
    const multCoins = modal.querySelector('#mult-coins-preview') as HTMLElement;
    const btnMultiply = modal.querySelector('#btn-multiply') as HTMLButtonElement;

    // Needle oscillation animation
    const interval = setInterval(() => {
      multIdx = (multIdx + 1) % multipliers.length;
      currentMultiplier = multipliers[multIdx];
      multDisp.textContent = `${currentMultiplier}x ÇARPAN!`;
      multCoins.textContent = `+${Math.floor(baseCoins * currentMultiplier)}`;
      btnMultiply.textContent = `🎬 ${currentMultiplier}x ÇARPANI AL (+${Math.floor(baseCoins * currentMultiplier)} 🪙)`;
    }, 450);

    btnMultiply.addEventListener('click', () => {
      clearInterval(interval);
      modal.remove();
      this.callbacks.onWatchMultiplierAd(currentMultiplier);
    });

    modal.querySelector('#btn-claim-base')!.addEventListener('click', () => {
      clearInterval(interval);
      modal.remove();
      this.callbacks.onNextLevel();
    });
  }

  /**
   * Hook 2: Near-Miss Revive Modal (Triggered on failure / out of moves)
   */
  public showNearMissRevive(remainingBlocks: number, onRevive: () => void, onQuit: () => void): void {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card" style="text-align: center;">
        <span style="font-size: 11px; letter-spacing: 2px; color: #ec4899; font-weight: 800;">ÇOK YAKLAŞTIN!</span>
        <h2 class="modal-title" style="margin: 6px 0 10px; color: #f43f5e;">SON ${remainingBlocks} BLOK KALDI! ⚠️</h2>
        <p class="modal-desc">Kısa bir video izleyerek oyunu kaybetmeden devam edin ve 1 blok otomatik çözülsün!</p>
        
        <button class="hud-btn primary" id="btn-revive" style="width: 100%; justify-content: center; padding: 14px; margin-bottom: 8px; font-weight: 800; background: #10b981;">
          🎬 İZLE & DEVAM ET (+OTO ÇÖZÜM)
        </button>
        <button class="hud-btn" id="btn-quit" style="width: 100%; justify-content: center; padding: 10px; background: transparent; border: none; color: #94a3b8;">
          Pes Et ve Yeniden Başlat
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('#btn-revive')!.addEventListener('click', () => {
      modal.remove();
      onRevive();
    });

    modal.querySelector('#btn-quit')!.addEventListener('click', () => {
      modal.remove();
      onQuit();
    });
  }

  /**
   * Hook 1: Rewarded Ad Coin Refill Prompt
   */
  public showRewardedAdPrompt(): void {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-card">
        <h2 class="modal-title">ÖDÜLLÜ REKLAM 🎁</h2>
        <p class="modal-desc">Kısa bir video izleyerek anında 50 Neon Coin kazanın!</p>
        <div class="modal-reward">+50 NEON COIN 🪙</div>
        <div style="display: flex; gap: 10px;">
          <button class="hud-btn" id="btn-cancel" style="flex: 1; justify-content: center;">KAPAT</button>
          <button class="hud-btn primary" id="btn-watch" style="flex: 1.5; justify-content: center;">
            🎬 İZLE (+50)
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
