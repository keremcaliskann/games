/**
 * Universal Multi-Portal Ad Provider (Single Source of Truth across all Arcade 3D games).
 * Routes monetization calls to YouTube Playables (ytgame.ads), Yandex Games (ysdk.adv),
 * CrazyGames (CrazyGames.SDK.ad), Poki (PokiSDK), or the standardized interactive Mock Ad overlay.
 */

export type RewardedPlacement = string;

export interface IAdProvider {
  initialize(): Promise<void>;
  showInterstitial(placement?: string): Promise<boolean>;
  showRewarded(placement?: string): Promise<boolean>;
  isRewardedReady(): boolean;
  onAvailabilityChange(callback: (isReady: boolean) => void): void;
}

export class UniversalAdProvider implements IAdProvider {
  private static instance: UniversalAdProvider | null = null;
  private lastInterstitialTime = 0;
  private readonly minInterstitialIntervalMs = 90_000; // 90s minimum cooldown
  private availabilityListeners: ((isReady: boolean) => void)[] = [];
  private isShowingAd = false;
  private initialized = false;

  public static get(): UniversalAdProvider {
    if (!this.instance) {
      this.instance = new UniversalAdProvider();
    }
    return this.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    this.lastInterstitialTime = Date.now();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.notifyAvailability(this.isRewardedReady()));
      window.addEventListener('offline', () => this.notifyAvailability(false));
      this.syncDomAdState(this.isRewardedReady());
    }
  }

  public onAvailabilityChange(callback: (isReady: boolean) => void): void {
    this.availabilityListeners.push(callback);
  }

  private notifyAvailability(isReady: boolean): void {
    this.syncDomAdState(isReady);
    for (let i = 0; i < this.availabilityListeners.length; i++) {
      try {
        this.availabilityListeners[i](isReady);
      } catch {
        // Ignore listener error
      }
    }
  }

  public syncDomAdState(isReady: boolean = this.isRewardedReady()): void {
    if (typeof document === 'undefined' || !document.body) return;
    document.body.classList.toggle('ads-unavailable', !isReady);
    const badges = document.querySelectorAll('.booster-ad-badge, .hud-booster-badge');
    for (let i = 0; i < badges.length; i++) {
      const el = badges[i] as HTMLElement;
      el.textContent = isReady ? '🎬 FREE' : '🎬 REKLAM YOK';
    }
  }

  public isRewardedReady(): boolean {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false;
    }
    const w = window as any;
    if (w.ytgame?.IN_PLAYABLES_ENV) {
      return Boolean(w.ytgame?.ads?.requestRewardedAd);
    }
    return true;
  }

  public async showInterstitial(placement = 'level_transition'): Promise<boolean> {
    if (this.isShowingAd || !this.isRewardedReady()) return false;
    const now = Date.now();
    if (now - this.lastInterstitialTime < this.minInterstitialIntervalMs) {
      return false;
    }
    this.lastInterstitialTime = now;
    this.isShowingAd = true;

    try {
      const w = window as any;

      // 1. YouTube Playables Native Interstitial
      if (w.ytgame?.IN_PLAYABLES_ENV && w.ytgame?.ads?.requestInterstitialAd) {
        try {
          await w.ytgame.ads.requestInterstitialAd();
          return true;
        } catch {
          return false;
        }
      }

      // 2. CrazyGames Midgame Ad
      if (w.CrazyGames?.SDK?.ad?.requestAd) {
        return await new Promise<boolean>((resolve) => {
          w.CrazyGames.SDK.ad.requestAd('midgame', {
            adFinished: () => resolve(true),
            adError: () => resolve(false),
          });
        });
      }

      // 3. Yandex Games Fullscreen Adv
      if (w.ysdk?.adv?.showFullscreenAdv) {
        return await new Promise<boolean>((resolve) => {
          w.ysdk.adv.showFullscreenAdv({
            callbacks: {
              onClose: () => resolve(true),
              onError: () => resolve(false),
            },
          });
        });
      }

      // 4. Poki Commercial Break
      if (w.PokiSDK?.commercialBreak) {
        return await new Promise<boolean>((resolve) => {
          w.PokiSDK.commercialBreak()
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
      }

      // 5. GitHub Pages Mock Simulation
      return await this.showMockAdModal(`SPONSOR BREAK [${placement.toUpperCase()}]`, 2);
    } finally {
      this.isShowingAd = false;
    }
  }

  public async showRewarded(placement: RewardedPlacement = 'rewarded_booster'): Promise<boolean> {
    if (this.isShowingAd || !this.isRewardedReady()) return false;
    this.isShowingAd = true;

    try {
      const w = window as any;

      // 1. YouTube Playables Native Rewarded Ad
      if (w.ytgame?.IN_PLAYABLES_ENV && w.ytgame?.ads?.requestRewardedAd) {
        try {
          await w.ytgame.ads.requestRewardedAd();
          this.lastInterstitialTime = Date.now();
          return true;
        } catch {
          return false;
        }
      }

      // 2. CrazyGames Rewarded Ad
      if (w.CrazyGames?.SDK?.ad?.requestAd) {
        return await new Promise<boolean>((resolve) => {
          w.CrazyGames.SDK.ad.requestAd('rewarded', {
            adFinished: () => {
              this.lastInterstitialTime = Date.now();
              resolve(true);
            },
            adError: () => resolve(false),
          });
        });
      }

      // 3. Yandex Games Rewarded Video
      if (w.ysdk?.adv?.showRewardedVideo) {
        return await new Promise<boolean>((resolve) => {
          let rewarded = false;
          w.ysdk.adv.showRewardedVideo({
            callbacks: {
              onRewarded: () => {
                rewarded = true;
                this.lastInterstitialTime = Date.now();
              },
              onClose: () => resolve(rewarded),
              onError: () => resolve(false),
            },
          });
        });
      }

      // 4. Poki Rewarded Break
      if (w.PokiSDK?.rewardedBreak) {
        return await new Promise<boolean>((resolve) => {
          w.PokiSDK.rewardedBreak()
            .then((success: boolean) => {
              if (success) this.lastInterstitialTime = Date.now();
              resolve(Boolean(success));
            })
            .catch(() => resolve(false));
        });
      }

      // 5. GitHub Pages & Local Dev Standardized Mock Ad Reel
      return await this.showMockAdModal(`ÖDÜLLÜ REKLAM // ${placement.toUpperCase()}`, 2);
    } finally {
      this.isShowingAd = false;
    }
  }

  private showMockAdModal(title: string, durationSec: number): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'mock-ad-modal modal-overlay';
      modal.setAttribute('data-hud-interactive', 'true');
      modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(3, 7, 18, 0.95);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        z-index: 100000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #fff; backdrop-filter: blur(8px); pointer-events: auto;
      `;

      // Prevent clicks on the modal from bleeding into the 3D canvas
      const stopBleed = (e: Event) => e.stopPropagation();
      modal.addEventListener('pointerdown', stopBleed);
      modal.addEventListener('mousedown', stopBleed);
      modal.addEventListener('touchstart', stopBleed);

      let remaining = durationSec;
      modal.innerHTML = `
        <div class="modal-card" data-hud-interactive="true" style="background: #0f172a; border: 2px solid #0284c7; border-radius: 16px; padding: 28px; width: 90%; max-width: 380px; text-align: center; box-shadow: 0 0 40px rgba(2, 132, 199, 0.4);">
          <span style="font-size: 11px; letter-spacing: 2px; color: #38bdf8; font-weight: 800; display: block; margin-bottom: 8px;">YOUTUBE PLAYABLES REWARD REEL // SPONSOR</span>
          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 700; color: #f8fafc;">${title}</h3>
          <div style="height: 120px; background: rgba(2, 132, 199, 0.1); border: 1px dashed #0284c7; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span id="mock-ad-countdown" style="font-size: 32px; font-weight: 800; color: #38bdf8;">${remaining}s</span>
          </div>
          <button id="mock-ad-claim-btn" class="hud-btn" data-hud-interactive="true" disabled style="width: 100%; height: auto; padding: 12px; border-radius: 10px; border: none; background: #334155; color: #94a3b8; font-weight: 800; font-size: 14px; cursor: not-allowed; transition: all 0.2s;">
            LÜTFEN BEKLEYİN...
          </button>
        </div>
      `;

      document.body.appendChild(modal);

      const countEl = modal.querySelector('#mock-ad-countdown') as HTMLElement;
      const btn = modal.querySelector('#mock-ad-claim-btn') as HTMLButtonElement;

      const interval = setInterval(() => {
        remaining--;
        if (remaining > 0) {
          countEl.textContent = `${remaining}s`;
        } else {
          clearInterval(interval);
          countEl.textContent = 'TAMAMLANDI! ✓';
          countEl.style.color = '#10b981';
          countEl.style.fontSize = '22px';
          btn.disabled = false;
          btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          btn.style.color = '#ffffff';
          btn.style.cursor = 'pointer';
          btn.textContent = 'ÖDÜLÜ AL & DEVAM ET';
        }
      }, 1000);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (remaining > 0) return;
        clearInterval(interval);
        modal.remove();
        this.lastInterstitialTime = Date.now();
        resolve(true);
      });
    });
  }
}
