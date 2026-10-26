export type RewardedPlacement =
  | 'booster_wand'
  | 'booster_slot'
  | 'booster_shuffle'
  | 'revive'
  | 'victory_multiplier';

export class UniversalAdProvider {
  private static instance: UniversalAdProvider;
  private isShowingAd = false;

  public static get(): UniversalAdProvider {
    if (!this.instance) {
      this.instance = new UniversalAdProvider();
    }
    return this.instance;
  }

  public async initialize(): Promise<void> {
    // Portal ad initialization
  }

  public async showRewarded(placement: RewardedPlacement): Promise<boolean> {
    if (this.isShowingAd) return false;
    this.isShowingAd = true;

    try {
      const w = window as unknown as {
        ytgame?: {
          ads?: {
            showRewardedAd?: () => Promise<boolean>;
          };
        };
      };

      if (w.ytgame?.ads?.showRewardedAd) {
        return await w.ytgame.ads.showRewardedAd();
      }

      // Universal simulated ad modal fallback for testing / standalone
      return await this.simulateRewardedAd(placement);
    } finally {
      this.isShowingAd = false;
    }
  }

  private simulateRewardedAd(placement: RewardedPlacement): Promise<boolean> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.style.zIndex = '99999';

      const card = document.createElement('div');
      card.className = 'modal-card';
      card.style.background = '#0f172a';
      card.style.color = '#ffffff';

      const title = document.createElement('div');
      title.className = 'modal-title';
      title.style.color = '#f59e0b';
      title.textContent = '📺 REWARDED AD';

      const subtitle = document.createElement('div');
      subtitle.className = 'modal-subtitle';
      subtitle.style.color = '#94a3b8';
      subtitle.textContent = `Simulating Sponsor Ad for: [${placement.toUpperCase()}]`;

      const timerBar = document.createElement('div');
      timerBar.style.width = '100%';
      timerBar.style.height = '6px';
      timerBar.style.background = '#334155';
      timerBar.style.borderRadius = '3px';
      timerBar.style.overflow = 'hidden';

      const progress = document.createElement('div');
      progress.style.width = '0%';
      progress.style.height = '100%';
      progress.style.background = 'linear-gradient(90deg, #d97706, #f59e0b)';
      progress.style.transition = 'width 1.2s linear';
      timerBar.appendChild(progress);

      card.appendChild(title);
      card.appendChild(subtitle);
      card.appendChild(timerBar);
      overlay.appendChild(card);
      document.body.appendChild(overlay);

      requestAnimationFrame(() => {
        progress.style.width = '100%';
      });

      setTimeout(() => {
        if (overlay.parentElement) {
          overlay.parentElement.removeChild(overlay);
        }
        resolve(true);
      }, 1200);
    });
  }
}
