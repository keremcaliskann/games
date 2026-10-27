export interface HudCallbacks {
  onToggleSound(): void;
  onRestart(): void;
  onBoosterHelo(): void;
  onBoosterVip(): void;
  onBoosterShuffle(): void;
  onRevive(): void;
  onGiveUp(): void;
  onClaimMultiplied(mul: number): void;
  onNextLevel(): void;
}

export class Hud {
  private readonly levelEl: HTMLElement;
  private readonly coinsEl: HTMLElement;
  private readonly soundBtn: HTMLElement;
  private readonly restartBtn: HTMLElement;

  private readonly heloBtn: HTMLElement;
  private readonly vipBtn: HTMLElement;
  private readonly shuffleBtn: HTMLElement;

  private reviveTimerInterval: number | null = null;
  private victoryAnimFrame: number | null = null;
  private currentMultiplier = 2.0;

  constructor(
    private readonly container: HTMLElement,
    private readonly callbacks: HudCallbacks
  ) {
    this.levelEl = document.getElementById('level-num')!;
    this.coinsEl = document.getElementById('coin-count')!;
    this.soundBtn = document.getElementById('sound-btn')!;
    this.restartBtn = document.getElementById('restart-btn')!;

    this.heloBtn = document.getElementById('booster-helo')!;
    this.vipBtn = document.getElementById('booster-vip')!;
    this.shuffleBtn = document.getElementById('booster-shuffle')!;

    this.setupListeners();
  }

  private setupListeners(): void {
    this.soundBtn.addEventListener('click', () => this.callbacks.onToggleSound());
    this.restartBtn.addEventListener('click', () => this.callbacks.onRestart());

    this.heloBtn.addEventListener('click', () => this.callbacks.onBoosterHelo());
    this.vipBtn.addEventListener('click', () => this.callbacks.onBoosterVip());
    this.shuffleBtn.addEventListener('click', () => this.callbacks.onBoosterShuffle());
  }

  public updateLevel(level: number): void {
    this.levelEl.textContent = String(level);
  }

  public updateCoins(coins: number): void {
    this.coinsEl.textContent = String(coins);
  }

  public updateSound(muted: boolean): void {
    this.soundBtn.textContent = muted ? '🔇' : '🔊';
  }

  public closeModals(): void {
    this.clearReviveTimer();
    if (this.victoryAnimFrame !== null) {
      cancelAnimationFrame(this.victoryAnimFrame);
      this.victoryAnimFrame = null;
    }
    const overlays = this.container.querySelectorAll('.modal-overlay');
    overlays.forEach((el) => el.remove());
  }

  public showReviveModal(): void {
    this.closeModals();
    let timeLeft = 7;

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const card = document.createElement('div');
    card.className = 'modal-card';

    const title = document.createElement('h2');
    title.textContent = '🚨 PARKING JAM!';

    const subtitle = document.createElement('p');
    subtitle.textContent = 'All bays are full with no matching passengers waiting!';

    const countdown = document.createElement('div');
    countdown.className = 'countdown-badge';
    countdown.textContent = `⏳ ${timeLeft}s`;

    const reviveBtn = document.createElement('button');
    reviveBtn.className = 'primary-btn';
    reviveBtn.setAttribute('data-hud-interactive', 'true');
    reviveBtn.textContent = '📺 UNLOCK VIP BAY & REVIVE';
    reviveBtn.onclick = () => {
      this.clearReviveTimer();
      this.closeModals();
      this.callbacks.onRevive();
    };

    const giveUpBtn = document.createElement('button');
    giveUpBtn.className = 'secondary-btn';
    giveUpBtn.setAttribute('data-hud-interactive', 'true');
    giveUpBtn.textContent = 'Restart Level';
    giveUpBtn.onclick = () => {
      this.clearReviveTimer();
      this.closeModals();
      this.callbacks.onGiveUp();
    };

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(countdown);
    card.appendChild(reviveBtn);
    card.appendChild(giveUpBtn);
    overlay.appendChild(card);
    this.container.appendChild(overlay);

    this.reviveTimerInterval = window.setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        this.clearReviveTimer();
        this.closeModals();
        this.callbacks.onGiveUp();
      } else {
        countdown.textContent = `⏳ ${timeLeft}s`;
      }
    }, 1000);
  }

  private clearReviveTimer(): void {
    if (this.reviveTimerInterval !== null) {
      clearInterval(this.reviveTimerInterval);
      this.reviveTimerInterval = null;
    }
  }

  public showVictoryModal(coinsEarned: number): void {
    this.closeModals();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const card = document.createElement('div');
    card.className = 'modal-card';

    const title = document.createElement('h2');
    title.textContent = '🎉 LOT CLEARED!';

    const subtitle = document.createElement('p');
    subtitle.textContent = `You earned +${coinsEarned} Coins!`;

    // Multiplier needle gauge
    const gaugeWrap = document.createElement('div');
    gaugeWrap.className = 'multiplier-gauge-wrap';

    const needle = document.createElement('div');
    needle.className = 'multiplier-needle';

    const multiplierLabel = document.createElement('div');
    multiplierLabel.className = 'multiplier-label';
    multiplierLabel.textContent = '2.0x';

    gaugeWrap.appendChild(needle);
    gaugeWrap.appendChild(multiplierLabel);

    let angle = 0;
    const animateNeedle = () => {
      angle += 0.045;
      const progress = (Math.sin(angle) + 1) / 2; // 0 to 1
      needle.style.left = `${progress * 88 + 6}%`;

      if (progress < 0.25) this.currentMultiplier = 1.5;
      else if (progress < 0.6) this.currentMultiplier = 2.0;
      else if (progress < 0.85) this.currentMultiplier = 3.0;
      else this.currentMultiplier = 5.0;

      multiplierLabel.textContent = `${this.currentMultiplier.toFixed(1)}x`;
      this.victoryAnimFrame = requestAnimationFrame(animateNeedle);
    };
    this.victoryAnimFrame = requestAnimationFrame(animateNeedle);

    const claimBtn = document.createElement('button');
    claimBtn.className = 'primary-btn';
    claimBtn.setAttribute('data-hud-interactive', 'true');
    claimBtn.textContent = '📺 CLAIM MULTIPLIED (WATCH AD)';
    claimBtn.onclick = () => {
      this.closeModals();
      this.callbacks.onClaimMultiplied(this.currentMultiplier);
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'secondary-btn';
    nextBtn.setAttribute('data-hud-interactive', 'true');
    nextBtn.textContent = 'Continue (1x)';
    nextBtn.onclick = () => {
      this.closeModals();
      this.callbacks.onNextLevel();
    };

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(gaugeWrap);
    card.appendChild(claimBtn);
    card.appendChild(nextBtn);
    overlay.appendChild(card);
    this.container.appendChild(overlay);
  }
}
