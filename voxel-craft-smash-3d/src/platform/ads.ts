/**
 * Universal Multi-Portal Ad Provider for VOXEL SMASH 3D.
 * Routes monetization calls to YouTube Playables (ytgame.ads), Yandex Games (ysdk.adv),
 * CrazyGames (CrazyGames.SDK.ad), Poki (PokiSDK), or an interactive Mock Ad overlay.
 */

export interface IAdProvider {
  initialize(): Promise<void>;
  showInterstitial(placement?: string): Promise<boolean>;
  showRewarded(placement?: string): Promise<boolean>;
  isRewardedReady(): boolean;
  onAvailabilityChange?(callback: (isReady: boolean) => void): void;
}

export class UniversalAdProvider implements IAdProvider {
  private static instance: UniversalAdProvider | null = null;
  private lastInterstitialTime = 0;
  private readonly minInterstitialIntervalMs = 90_000;
  private availabilityListeners: ((isReady: boolean) => void)[] = [];

  public static get(): UniversalAdProvider {
    if (!this.instance) {
      this.instance = new UniversalAdProvider();
    }
    return this.instance;
  }

  public async initialize(): Promise<void> {
    this.lastInterstitialTime = Date.now();
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.notifyAvailability(true));
      window.addEventListener('offline', () => this.notifyAvailability(false));
    }
  }

  public onAvailabilityChange(callback: (isReady: boolean) => void): void {
    this.availabilityListeners.push(callback);
  }

  private notifyAvailability(isReady: boolean): void {
    for (const cb of this.availabilityListeners) {
      try {
        cb(isReady);
      } catch {}
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

  public async showInterstitial(placement = 'wave_transition'): Promise<boolean> {
    const now = Date.now();
    if (now - this.lastInterstitialTime < this.minInterstitialIntervalMs) {
      return false;
    }
    this.lastInterstitialTime = now;

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
    return this.showMockAdModal(`SPONSOR GEÇİŞ REKLAMI [${placement.toUpperCase()}]`, 2);
  }

  public async showRewarded(placement = 'rewarded_booster'): Promise<boolean> {
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
    return this.showMockAdModal(`ÖDÜLLÜ REKLAM [${placement.toUpperCase()}]`, 2);
  }

  private showMockAdModal(title: string, durationSec: number): Promise<boolean> {
    return new Promise((resolve) => {
      const modal = document.createElement('div');
      modal.style.position = 'fixed';
      modal.style.inset = '0';
      modal.style.background = 'rgba(11, 15, 25, 0.94)';
      modal.style.zIndex = '99999';
      modal.style.display = 'flex';
      modal.style.flexDirection = 'column';
      modal.style.alignItems = 'center';
      modal.style.justifyContent = 'center';
      modal.style.color = '#fff';
      modal.style.fontFamily = 'system-ui, sans-serif';
      modal.style.backdropFilter = 'blur(10px)';

      let countdown = durationSec;
      modal.innerHTML = `
        <div style="background: rgba(30, 41, 59, 0.9); border: 2px solid #0284c7; border-radius: 18px; padding: 32px; max-width: 380px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <div style="font-size: 13px; font-weight: 800; color: #38bdf8; letter-spacing: 2px; margin-bottom: 8px;">SIMULATED AD</div>
          <h2 style="font-size: 20px; font-weight: 900; margin: 0 0 16px 0; color: #f8fafc;">${title}</h2>
          <div style="font-size: 32px; font-weight: 900; color: #f59e0b; margin: 16px 0;" id="mock-ad-countdown">${countdown}s</div>
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">YouTube Playables & Portallarda gerçek reklam çağrılır. Test modunda otomatik tamamlanıyor.</p>
        </div>
      `;

      document.body.appendChild(modal);

      const interval = setInterval(() => {
        countdown--;
        const el = document.getElementById('mock-ad-countdown');
        if (el) el.textContent = `${countdown}s`;

        if (countdown <= 0) {
          clearInterval(interval);
          if (modal.parentElement) {
            modal.parentElement.removeChild(modal);
          }
          this.lastInterstitialTime = Date.now();
          resolve(true);
        }
      }, 1000);
    });
  }
}
