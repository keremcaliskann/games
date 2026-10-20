/**
 * Universal Multi-Portal Ad Provider.
 * Directs rewarded and interstitial calls to YouTube Playables (ytgame.ads),
 * Yandex Games (ysdk.adv), CrazyGames (CrazyGames.SDK.ad), Poki (PokiSDK),
 * or falls back to an in-engine interactive Mock Ad overlay for GitHub Pages/testing.
 */

export interface IAdProvider {
  initialize(): Promise<void>;
  showInterstitial(placement?: string): Promise<boolean>;
  showRewarded(placement?: string): Promise<boolean>;
  isRewardedReady(): boolean;
}

export class UniversalAdProvider implements IAdProvider {
  private static instance: UniversalAdProvider | null = null;
  private lastInterstitialTime = 0;
  private readonly minInterstitialIntervalMs = 90_000; // 90s minimum cooldown

  public static get(): UniversalAdProvider {
    if (!this.instance) {
      this.instance = new UniversalAdProvider();
    }
    return this.instance;
  }

  public async initialize(): Promise<void> {
    this.lastInterstitialTime = Date.now();
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
    const now = Date.now();
    if (now - this.lastInterstitialTime < this.minInterstitialIntervalMs) {
      return false;
    }
    this.lastInterstitialTime = now;

    const w = window as any;

    // 1. YouTube Playables Native Interstitial (only when running inside YouTube)
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
      return new Promise((resolve) => {
        w.CrazyGames.SDK.ad.requestAd('midgame', {
          adFinished: () => resolve(true),
          adError: () => resolve(false),
        });
      });
    }

    // 3. Yandex Games Fullscreen Adv
    if (w.ysdk?.adv?.showFullscreenAdv) {
      return new Promise((resolve) => {
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
      return new Promise((resolve) => {
        w.PokiSDK.commercialBreak().then(() => resolve(true)).catch(() => resolve(false));
      });
    }

    // 5. GitHub Pages Mock Simulation
    return this.showMockAdModal(`SPONSOR BREAK [${placement}]`, 2);
  }

  public async showRewarded(placement = 'rewarded_booster'): Promise<boolean> {
    const w = window as any;

    // 1. YouTube Playables Native Rewarded Ad (only when running inside YouTube)
    if (w.ytgame?.IN_PLAYABLES_ENV && w.ytgame?.ads?.requestRewardedAd) {
      try {
        await w.ytgame.ads.requestRewardedAd();
        this.lastInterstitialTime = Date.now(); // Reset cooldown after rewarded ad
        return true;
      } catch {
        return false;
      }
    }

    // 2. CrazyGames Rewarded Ad
    if (w.CrazyGames?.SDK?.ad?.requestAd) {
      return new Promise((resolve) => {
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
      return new Promise((resolve) => {
        w.ysdk.adv.showRewardedVideo({
          callbacks: {
            onRewarded: () => {
              this.lastInterstitialTime = Date.now();
              resolve(true);
            },
            onError: () => resolve(false),
            onClose: () => {},
          },
        });
      });
    }

    // 4. Poki Rewarded Break
    if (w.PokiSDK?.rewardedBreak) {
      return new Promise((resolve) => {
        w.PokiSDK.rewardedBreak().then((success: boolean) => {
          if (success) this.lastInterstitialTime = Date.now();
          resolve(Boolean(success));
        }).catch(() => resolve(false));
      });
    }

    // 5. GitHub Pages Mock Simulation
    return this.showMockAdModal(`REWARDED AD // ${placement.toUpperCase()}`, 2);
  }

  private showMockAdModal(title: string, durationSec: number): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.className = 'mock-ad-modal';
      modal.style.cssText = `
        position: fixed; inset: 0; background: rgba(3, 7, 18, 0.95);
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        z-index: 10000; font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #fff;
        backdrop-filter: blur(8px);
      `;

      let remaining = durationSec;
      modal.innerHTML = `
        <div style="background: #0f172a; border: 2px solid #0284c7; border-radius: 16px; padding: 28px; width: 90%; max-width: 380px; text-align: center; box-shadow: 0 0 40px rgba(2, 132, 199, 0.4);">
          <span style="font-size: 11px; letter-spacing: 2px; color: #38bdf8; font-weight: 800; display: block; margin-bottom: 8px;">YOUTUBE PLAYABLES REWARD REEL</span>
          <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 700;">${title}</h3>
          <div style="height: 120px; background: #0284c715; border: 1px dashed #0284c7; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span id="mock-ad-countdown" style="font-size: 32px; font-weight: 800; color: #38bdf8;">${remaining}s</span>
          </div>
          <button id="mock-ad-claim-btn" disabled style="width: 100%; padding: 12px; border-radius: 10px; border: none; background: #334155; color: #94a3b8; font-weight: 800; font-size: 14px; cursor: not-allowed; transition: all 0.2s;">
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
          countEl.textContent = 'TAMAMLANDI!';
          countEl.style.color = '#10b981';
          btn.disabled = false;
          btn.style.background = '#0284c7';
          btn.style.color = '#fff';
          btn.style.cursor = 'pointer';
          btn.textContent = 'ÖDÜLÜ AL & DEVAM ET';
        }
      }, 1000);

      btn.addEventListener('click', () => {
        clearInterval(interval);
        modal.remove();
        resolve(true);
      });
    });
  }
}
