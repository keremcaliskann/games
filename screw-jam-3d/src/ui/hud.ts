export interface HudCallbacks {
  onRestartClick: () => void;
  onSoundToggle: () => void;
  onExtraSlotAd: () => void;
  onMagnetAd: () => void;
  onShatterAd: () => void;
  onReviveAd: () => void;
  onClaimMultiplierAd: (multiplier: number) => void;
  onClaimBaseVictory: () => void;
  onNextLevel: () => void;
  isAdReady: () => boolean;
}

export class Hud {
  private levelEl: HTMLElement;
  private coinsEl: HTMLElement;
  private soundBtn: HTMLButtonElement;
  private extraSlotBtn: HTMLButtonElement;
  private magnetBtn: HTMLButtonElement;
  private shatterBtn: HTMLButtonElement;

  private modalContainer: HTMLElement;
  private needleAnimId: number | null = null;
  private isMuted = false;

  constructor(private readonly container: HTMLElement, private readonly callbacks: HudCallbacks) {
    this.container.innerHTML = `
      <!-- Top HUD Header -->
      <div class="hud-top" style="
        position: absolute; top: 12px; left: 12px; right: 12px;
        display: flex; justify-content: space-between; align-items: center;
        pointer-events: none; z-index: 50; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="display: flex; gap: 8px; align-items: center; pointer-events: auto;">
          <div id="hud-level-chip" style="
            background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 20px;
            padding: 6px 14px; font-weight: 800; font-size: 13px; color: #0f172a;
            box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          ">SEVİYE 1</div>

          <button id="hud-sound-btn" data-hud-interactive="true" style="
            background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 50%;
            width: 34px; height: 34px; font-size: 15px; cursor: pointer; display: flex;
            align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          ">🔊</button>

          <button id="hud-restart-btn" data-hud-interactive="true" style="
            background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 50%;
            width: 34px; height: 34px; font-size: 15px; cursor: pointer; display: flex;
            align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          ">🔄</button>
        </div>

        <div id="hud-coins-chip" style="
          background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.6); border-radius: 20px;
          padding: 6px 14px; font-weight: 800; font-size: 13px; color: #d97706;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06); pointer-events: auto;
        ">🪙 150</div>
      </div>

      <!-- Bottom Boosters Bar -->
      <div class="hud-bottom" style="
        position: absolute; bottom: 14px; left: 0; right: 0;
        display: flex; justify-content: center; gap: 10px;
        pointer-events: none; z-index: 50; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <button id="btn-booster-slot" data-hud-interactive="true" style="
          background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(10px);
          border: 1.5px solid #38bdf8; border-radius: 14px; padding: 8px 12px;
          font-weight: 800; font-size: 11px; color: #0284c7; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          box-shadow: 0 6px 16px rgba(56, 189, 248, 0.2); pointer-events: auto;
        ">
          <span style="font-size: 16px;">➕</span>
          <span>EK YUVA</span>
          <span style="font-size: 9px; color: #f59e0b; font-weight: 800;">🎬 REKLAM</span>
        </button>

        <button id="btn-booster-magnet" data-hud-interactive="true" style="
          background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(10px);
          border: 1.5px solid #f472b6; border-radius: 14px; padding: 8px 12px;
          font-weight: 800; font-size: 11px; color: #db2777; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          box-shadow: 0 6px 16px rgba(244, 114, 182, 0.2); pointer-events: auto;
        ">
          <span style="font-size: 16px;">🧲</span>
          <span>MIKNATIS</span>
          <span style="font-size: 9px; color: #f59e0b; font-weight: 800;">🎬 REKLAM</span>
        </button>

        <button id="btn-booster-shatter" data-hud-interactive="true" style="
          background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(10px);
          border: 1.5px solid #facc15; border-radius: 14px; padding: 8px 12px;
          font-weight: 800; font-size: 11px; color: #ca8a04; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          box-shadow: 0 6px 16px rgba(250, 204, 21, 0.2); pointer-events: auto;
        ">
          <span style="font-size: 16px;">🔨</span>
          <span>PLAKA KIR</span>
          <span style="font-size: 9px; color: #f59e0b; font-weight: 800;">🎬 REKLAM</span>
        </button>
      </div>

      <!-- Fullscreen Modal Container -->
      <div id="hud-modal-container" style="
        position: absolute; inset: 0; display: none; align-items: center; justify-content: center;
        background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(6px);
        z-index: 100; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      "></div>
    `;

    this.levelEl = this.container.querySelector('#hud-level-chip')!;
    this.coinsEl = this.container.querySelector('#hud-coins-chip')!;
    this.soundBtn = this.container.querySelector('#hud-sound-btn')!;
    this.extraSlotBtn = this.container.querySelector('#btn-booster-slot')!;
    this.magnetBtn = this.container.querySelector('#btn-booster-magnet')!;
    this.shatterBtn = this.container.querySelector('#btn-booster-shatter')!;
    this.modalContainer = this.container.querySelector('#hud-modal-container')!;

    this.wireListeners();
  }

  private wireListeners(): void {
    this.container.querySelector('#hud-restart-btn')?.addEventListener('click', () => {
      this.callbacks.onRestartClick();
    });

    this.soundBtn.addEventListener('click', () => {
      this.callbacks.onSoundToggle();
      this.isMuted = !this.isMuted;
      this.soundBtn.textContent = this.isMuted ? '🔇' : '🔊';
    });

    this.extraSlotBtn.addEventListener('click', () => {
      this.callbacks.onExtraSlotAd();
    });

    this.magnetBtn.addEventListener('click', () => {
      this.callbacks.onMagnetAd();
    });

    this.shatterBtn.addEventListener('click', () => {
      this.callbacks.onShatterAd();
    });
  }

  public updateHeader(level: number, coins: number): void {
    this.levelEl.textContent = `SEVİYE ${level}`;
    this.coinsEl.textContent = `🪙 ${coins}`;
  }

  public setSoundMuted(muted: boolean): void {
    this.isMuted = muted;
    this.soundBtn.textContent = muted ? '🔇' : '🔊';
  }

  /**
   * Hook 2: Near-Miss Revive Modal (Buffer Dock Full)
   */
  public showNearMissRevive(onRevive: () => void, onQuit: () => void): void {
    this.modalContainer.style.display = 'flex';
    this.modalContainer.innerHTML = `
      <div data-hud-interactive="true" style="
        background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(14px);
        border: 2px solid #f472b6; border-radius: 24px; padding: 28px 24px;
        width: 88%; max-width: 360px; text-align: center;
        box-shadow: 0 16px 40px rgba(244, 114, 182, 0.25);
      ">
        <div style="font-size: 38px; margin-bottom: 8px;">⚠️</div>
        <h2 style="margin: 0 0 6px; font-size: 20px; font-weight: 800; color: #0f172a;">YUVALAR DOLDU!</h2>
        <p style="margin: 0 0 20px; font-size: 13px; color: #64748b; line-height: 1.4;">
          Neredeyse çözüyordun! Boş yuva kalmadı. Hemen +1 Ek Yuva aç ve kutunu rahatlat!
        </p>

        <button id="btn-modal-revive" data-hud-interactive="true" style="
          width: 100%; padding: 14px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #10b981, #059669); color: #ffffff;
          font-weight: 800; font-size: 15px; cursor: pointer; margin-bottom: 10px;
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.35);
        ">
          🎬 YUVAYI AÇ & DEVAM ET
        </button>

        <button id="btn-modal-quit" data-hud-interactive="true" style="
          width: 100%; padding: 10px; border-radius: 14px; border: none;
          background: transparent; color: #94a3b8; font-weight: 700; font-size: 13px; cursor: pointer;
        ">
          Vazgeç & Yeniden Başla
        </button>
      </div>
    `;

    this.modalContainer.querySelector('#btn-modal-revive')?.addEventListener('click', () => {
      this.closeModal();
      onRevive();
    });

    this.modalContainer.querySelector('#btn-modal-quit')?.addEventListener('click', () => {
      this.closeModal();
      onQuit();
    });
  }

  /**
   * Hook 3: Oscillating Multiplier Needle Victory Bar
   */
  public showVictory(level: number, baseCoins: number): void {
    this.modalContainer.style.display = 'flex';
    let currentMultiplier = 2.0;

    this.modalContainer.innerHTML = `
      <div data-hud-interactive="true" style="
        background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(14px);
        border: 2px solid #38bdf8; border-radius: 24px; padding: 28px 24px;
        width: 88%; max-width: 360px; text-align: center;
        box-shadow: 0 16px 40px rgba(56, 189, 248, 0.25);
      ">
        <div style="font-size: 42px; margin-bottom: 4px;">🎉</div>
        <h2 style="margin: 0 0 4px; font-size: 22px; font-weight: 800; color: #0f172a;">TEBRİKLER!</h2>
        <div style="font-size: 13px; font-weight: 700; color: #0284c7; margin-bottom: 16px;">
          SEVİYE ${level} TAMAMLANDI!
        </div>

        <!-- Multiplier Track & Needle -->
        <div style="margin-bottom: 16px;">
          <div style="
            position: relative; height: 32px; background: linear-gradient(to right, #38bdf8, #facc15, #10b981, #f472b6, #10b981);
            border-radius: 16px; overflow: hidden; box-shadow: inset 0 2px 6px rgba(0,0,0,0.15);
          ">
            <div id="multiplier-needle" style="
              position: absolute; top: 0; bottom: 0; width: 6px; background: #ffffff;
              box-shadow: 0 0 10px rgba(0,0,0,0.4); border-radius: 3px; transform: translateX(-50%);
              left: 50%;
            "></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: 800; color: #64748b; margin-top: 4px;">
            <span>1.5x</span>
            <span>2.0x</span>
            <span>3.0x</span>
            <span>5.0x</span>
            <span>2.0x</span>
          </div>
        </div>

        <button id="btn-claim-multiplier" data-hud-interactive="true" style="
          width: 100%; padding: 14px; border-radius: 14px; border: none;
          background: linear-gradient(135deg, #f59e0b, #d97706); color: #ffffff;
          font-weight: 800; font-size: 15px; cursor: pointer; margin-bottom: 10px;
          box-shadow: 0 6px 18px rgba(245, 158, 11, 0.35);
        ">
          🎬 3x ÖDÜLÜ AL (+${baseCoins * 3} 🪙)
        </button>

        <button id="btn-claim-base" data-hud-interactive="true" style="
          width: 100%; padding: 8px; border-radius: 14px; border: none;
          background: transparent; color: #94a3b8; font-weight: 700; font-size: 13px; cursor: pointer;
        ">
          Normal Kazan (+${baseCoins} 🪙)
        </button>
      </div>
    `;

    const needle = this.modalContainer.querySelector('#multiplier-needle') as HTMLElement;
    const btnMultiply = this.modalContainer.querySelector('#btn-claim-multiplier') as HTMLButtonElement;

    let startTime = performance.now();
    const updateNeedle = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      // Oscillate needle position between 5% and 95%
      const norm = (Math.sin(elapsed * 4.0) + 1) / 2;
      const leftPct = 5 + norm * 90;
      needle.style.left = `${leftPct}%`;

      // Multiplier peak in center (5x) vs edges (1.5x)
      if (norm > 0.45 && norm < 0.55) {
        currentMultiplier = 5.0;
      } else if (norm > 0.25 && norm < 0.75) {
        currentMultiplier = 3.0;
      } else {
        currentMultiplier = 1.5;
      }

      btnMultiply.textContent = `🎬 ${currentMultiplier.toFixed(1)}x ÇARPANI AL (+${Math.floor(baseCoins * currentMultiplier)} 🪙)`;
      this.needleAnimId = requestAnimationFrame(updateNeedle);
    };
    this.needleAnimId = requestAnimationFrame(updateNeedle);

    btnMultiply.addEventListener('click', () => {
      if (this.needleAnimId) cancelAnimationFrame(this.needleAnimId);
      this.closeModal();
      this.callbacks.onClaimMultiplierAd(currentMultiplier);
    });

    this.modalContainer.querySelector('#btn-claim-base')?.addEventListener('click', () => {
      if (this.needleAnimId) cancelAnimationFrame(this.needleAnimId);
      this.closeModal();
      this.callbacks.onClaimBaseVictory();
    });
  }

  public closeModal(): void {
    if (this.needleAnimId) {
      cancelAnimationFrame(this.needleAnimId);
      this.needleAnimId = null;
    }
    this.modalContainer.style.display = 'none';
    this.modalContainer.innerHTML = '';
  }
}
