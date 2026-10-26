export interface HudCallbacks {
  onToggleSound(): void;
  onRestart(): void;
  onBoosterCluster(): void;
  onBoosterAmmo(): void;
  onBoosterLaser(): void;
  onRevive(): void;
  onGiveUp(): void;
  onClaimMultiplied(multiplier: number): void;
  onNextLevel(): void;
}

export class Hud {
  private readonly levelNumEl: HTMLElement;
  private readonly ammoDotsEl: HTMLElement;
  private readonly targetsLeftEl: HTMLElement;
  private readonly soundBtn: HTMLElement;
  private readonly restartBtn: HTMLElement;
  private readonly aimHintEl: HTMLElement;

  private readonly clusterBtn: HTMLElement;
  private readonly ammoBtn: HTMLElement;
  private readonly laserBtn: HTMLElement;

  private reviveTimerInterval: number | null = null;
  private victoryAnimFrame: number | null = null;
  private currentMultiplier = 2.0;

  constructor(
    private readonly container: HTMLElement,
    private readonly callbacks: HudCallbacks
  ) {
    this.levelNumEl = document.getElementById('level-num')!;
    this.ammoDotsEl = document.getElementById('ammo-dots')!;
    this.targetsLeftEl = document.getElementById('targets-left')!;
    this.soundBtn = document.getElementById('sound-btn')!;
    this.restartBtn = document.getElementById('restart-btn')!;
    this.aimHintEl = document.getElementById('aim-hint')!;

    this.clusterBtn = document.getElementById('booster-cluster')!;
    this.ammoBtn = document.getElementById('booster-ammo')!;
    this.laserBtn = document.getElementById('booster-laser')!;

    this.setupListeners();
  }

  private setupListeners(): void {
    this.soundBtn.addEventListener('click', () => this.callbacks.onToggleSound());
    this.restartBtn.addEventListener('click', () => this.callbacks.onRestart());

    this.clusterBtn.addEventListener('click', () => this.callbacks.onBoosterCluster());
    this.ammoBtn.addEventListener('click', () => this.callbacks.onBoosterAmmo());
    this.laserBtn.addEventListener('click', () => this.callbacks.onBoosterLaser());
  }

  public updateLevel(level: number): void {
    this.levelNumEl.textContent = String(level);
  }

  public updateTargets(count: number): void {
    this.targetsLeftEl.textContent = String(count);
  }

  public updateAmmo(current: number, max: number): void {
    this.ammoDotsEl.innerHTML = '';
    for (let i = 0; i < max; i++) {
      const dot = document.createElement('div');
      dot.className = 'ammo-dot' + (i >= current ? ' spent' : '');
      this.ammoDotsEl.appendChild(dot);
    }
  }

  public hideAimHint(): void {
    this.aimHintEl.classList.add('hidden');
  }

  public updateSound(muted: boolean): void {
    this.soundBtn.textContent = muted ? '🔇' : '🔊';
  }

  public setBoosterActive(type: 'cluster' | 'ammo' | 'laser' | null): void {
    this.clusterBtn.classList.toggle('active', type === 'cluster');
    this.laserBtn.classList.toggle('active', type === 'laser');
  }

  // --- REWARDED AD HOOK 2: Near-Miss Revive Modal ---
  public showReviveModal(): void {
    this.closeModals();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'revive-modal';

    const card = document.createElement('div');
    card.className = 'modal-card';

    const title = document.createElement('div');
    title.className = 'modal-title';
    title.textContent = '💣 OUT OF AMMO!';

    const subtitle = document.createElement('div');
    subtitle.className = 'modal-subtitle';
    subtitle.textContent = 'So close! Watch a quick ad for +2 Explosive Shots to demolish the remaining targets!';

    const countdown = document.createElement('div');
    countdown.style.fontSize = '28px';
    countdown.style.fontWeight = '900';
    countdown.style.color = '#ef4444';
    let timeLeft = 5;
    countdown.textContent = `⏳ ${timeLeft}s`;

    const reviveBtn = document.createElement('button');
    reviveBtn.className = 'primary-btn';
    reviveBtn.textContent = '📺 REVIVE (+2 SHOTS)';
    reviveBtn.onclick = () => {
      this.clearReviveTimer();
      this.closeModals();
      this.callbacks.onRevive();
    };

    const giveUpBtn = document.createElement('button');
    giveUpBtn.className = 'secondary-btn';
    giveUpBtn.textContent = 'Give Up & Restart';
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

  // --- REWARDED AD HOOK 3: Victory Multiplier Oscillating Needle Bar ---
  public showVictoryModal(earnedCoins: number): void {
    this.closeModals();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'victory-modal';

    const card = document.createElement('div');
    card.className = 'modal-card';

    const title = document.createElement('div');
    title.className = 'modal-title';
    title.textContent = '🏆 LEVEL CLEARED!';

    const subtitle = document.createElement('div');
    subtitle.className = 'modal-subtitle';
    subtitle.textContent = `Fortress demolished! Base reward: +${earnedCoins} Coins`;

    // Needle Bar
    const needleContainer = document.createElement('div');
    needleContainer.className = 'needle-container';

    const z1 = document.createElement('div');
    z1.className = 'needle-zone zone-1';
    z1.textContent = '1.5x';

    const z2 = document.createElement('div');
    z2.className = 'needle-zone zone-2';
    z2.textContent = '2x';

    const z3 = document.createElement('div');
    z3.className = 'needle-zone zone-3';
    z3.textContent = '3x';

    const z5 = document.createElement('div');
    z5.className = 'needle-zone zone-5';
    z5.textContent = '5x';

    const pointer = document.createElement('div');
    pointer.className = 'needle-pointer';

    needleContainer.appendChild(z1);
    needleContainer.appendChild(z2);
    needleContainer.appendChild(z3);
    needleContainer.appendChild(z5);
    needleContainer.appendChild(pointer);

    // Sine-wave oscillating animation
    let startTime = performance.now();
    const animateNeedle = () => {
      const t = (performance.now() - startTime) / 1000;
      // Oscillates 0% to 100%
      const norm = (Math.sin(t * 3.5) + 1) / 2;
      pointer.style.left = `${(norm * 100).toFixed(1)}%`;

      if (norm < 0.25) this.currentMultiplier = 1.5;
      else if (norm < 0.5) this.currentMultiplier = 2.0;
      else if (norm < 0.75) this.currentMultiplier = 3.0;
      else this.currentMultiplier = 5.0;

      claimBtn.textContent = `📺 CLAIM ${this.currentMultiplier}x (+${Math.round(earnedCoins * this.currentMultiplier)} COINS)`;
      this.victoryAnimFrame = requestAnimationFrame(animateNeedle);
    };
    this.victoryAnimFrame = requestAnimationFrame(animateNeedle);

    const claimBtn = document.createElement('button');
    claimBtn.className = 'primary-btn';
    claimBtn.textContent = `📺 CLAIM MULTIPLIED (AD)`;
    claimBtn.onclick = () => {
      if (this.victoryAnimFrame) cancelAnimationFrame(this.victoryAnimFrame);
      this.closeModals();
      this.callbacks.onClaimMultiplied(this.currentMultiplier);
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'secondary-btn';
    nextBtn.textContent = 'No Thanks, Next Level ➔';
    nextBtn.onclick = () => {
      if (this.victoryAnimFrame) cancelAnimationFrame(this.victoryAnimFrame);
      this.closeModals();
      this.callbacks.onNextLevel();
    };

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(needleContainer);
    card.appendChild(claimBtn);
    card.appendChild(nextBtn);
    overlay.appendChild(card);
    this.container.appendChild(overlay);
  }

  public showDefeatModal(): void {
    this.closeModals();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'defeat-modal';

    const card = document.createElement('div');
    card.className = 'modal-card';

    const title = document.createElement('div');
    title.className = 'modal-title';
    title.textContent = '💥 LEVEL FAILED';

    const subtitle = document.createElement('div');
    subtitle.className = 'modal-subtitle';
    subtitle.textContent = 'You ran out of ammo before toppling all targets!';

    const retryBtn = document.createElement('button');
    retryBtn.className = 'primary-btn';
    retryBtn.textContent = '🔄 TRY AGAIN';
    retryBtn.onclick = () => {
      this.closeModals();
      this.callbacks.onRestart();
    };

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(retryBtn);
    overlay.appendChild(card);
    this.container.appendChild(overlay);
  }

  public closeModals(): void {
    this.clearReviveTimer();
    if (this.victoryAnimFrame) {
      cancelAnimationFrame(this.victoryAnimFrame);
      this.victoryAnimFrame = null;
    }
    const modals = this.container.querySelectorAll('.modal-overlay');
    modals.forEach((m) => m.parentElement?.removeChild(m));
  }
}
