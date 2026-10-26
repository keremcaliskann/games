import { TIER_DEFINITIONS } from '../render/PrefabFactory';

export interface HudCallbacks {
  onToggleSound(): void;
  onRestart(): void;
  onBoosterShake(): void;
  onBoosterBomb(): void;
  onBoosterEvolve(): void;
  onRevive(): void;
  onGiveUp(): void;
  onClaimMultiplied(multiplier: number): void;
  onPlayAgain(): void;
}

export class Hud {
  private readonly scoreTextEl: HTMLElement;
  private readonly bestScoreEl: HTMLElement;
  private readonly nextBallEl: HTMLElement;
  private readonly soundBtn: HTMLElement;
  private readonly restartBtn: HTMLElement;
  private readonly aimHintEl: HTMLElement;
  private readonly dangerBannerEl: HTMLElement;

  private readonly shakeBtn: HTMLElement;
  private readonly bombBtn: HTMLElement;
  private readonly evolveBtn: HTMLElement;

  private reviveTimerInterval: number | null = null;
  private victoryAnimFrame: number | null = null;
  private currentMultiplier = 2.0;

  constructor(
    private readonly container: HTMLElement,
    private readonly callbacks: HudCallbacks
  ) {
    this.scoreTextEl = document.getElementById('score-text')!;
    this.bestScoreEl = document.getElementById('best-score')!;
    this.nextBallEl = document.getElementById('next-ball-preview')!;
    this.soundBtn = document.getElementById('sound-btn')!;
    this.restartBtn = document.getElementById('restart-btn')!;
    this.aimHintEl = document.getElementById('aim-hint')!;
    this.dangerBannerEl = document.getElementById('danger-banner')!;

    this.shakeBtn = document.getElementById('booster-shake')!;
    this.bombBtn = document.getElementById('booster-bomb')!;
    this.evolveBtn = document.getElementById('booster-evolve')!;

    this.setupListeners();
  }

  private setupListeners(): void {
    this.soundBtn.addEventListener('click', () => this.callbacks.onToggleSound());
    this.restartBtn.addEventListener('click', () => this.callbacks.onRestart());

    this.shakeBtn.addEventListener('click', () => this.callbacks.onBoosterShake());
    this.bombBtn.addEventListener('click', () => this.callbacks.onBoosterBomb());
    this.evolveBtn.addEventListener('click', () => this.callbacks.onBoosterEvolve());
  }

  public updateScore(score: number, best: number): void {
    this.scoreTextEl.textContent = String(score);
    this.bestScoreEl.textContent = String(best);
  }

  public updateNextBall(tier: number, isBomb: boolean = false): void {
    if (isBomb) {
      this.nextBallEl.style.backgroundColor = '#1e293b';
      this.nextBallEl.textContent = '💣';
      this.nextBallEl.style.fontSize = '14px';
      this.nextBallEl.style.textAlign = 'center';
      this.nextBallEl.style.lineHeight = '22px';
    } else {
      const def = TIER_DEFINITIONS[tier - 1] || TIER_DEFINITIONS[0];
      const colorStr = '#' + def.color.toString(16).padStart(6, '0');
      this.nextBallEl.style.backgroundColor = colorStr;
      this.nextBallEl.textContent = def.emoji;
      this.nextBallEl.style.fontSize = '14px';
      this.nextBallEl.style.textAlign = 'center';
      this.nextBallEl.style.lineHeight = '22px';
    }
  }

  public hideAimHint(): void {
    this.aimHintEl.classList.add('hidden');
  }

  public setDangerAlert(isDanger: boolean): void {
    this.dangerBannerEl.style.display = isDanger ? 'block' : 'none';
  }

  public updateSound(muted: boolean): void {
    this.soundBtn.textContent = muted ? '🔇' : '🔊';
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
    title.textContent = '⚠️ JAR OVERFLOW!';

    const subtitle = document.createElement('div');
    subtitle.className = 'modal-subtitle';
    subtitle.textContent = 'Fruit breached the top danger line! Watch a quick ad to vaporize the top 3 clutter spheres and save your score!';

    const countdown = document.createElement('div');
    countdown.style.fontSize = '28px';
    countdown.style.fontWeight = '900';
    countdown.style.color = '#ef4444';
    let timeLeft = 5;
    countdown.textContent = `⏳ ${timeLeft}s`;

    const reviveBtn = document.createElement('button');
    reviveBtn.className = 'primary-btn';
    reviveBtn.textContent = '📺 REVIVE (VAPORIZE TOP 3)';
    reviveBtn.onclick = () => {
      this.clearReviveTimer();
      this.closeModals();
      this.callbacks.onRevive();
    };

    const giveUpBtn = document.createElement('button');
    giveUpBtn.className = 'secondary-btn';
    giveUpBtn.textContent = 'Give Up & Finalize Score';
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
  public showGameOverModal(finalScore: number, earnedCoins: number): void {
    this.closeModals();

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'game-over-modal';

    const card = document.createElement('div');
    card.className = 'modal-card';

    const title = document.createElement('div');
    title.className = 'modal-title';
    title.textContent = '🍉 RUN FINISHED!';

    const subtitle = document.createElement('div');
    subtitle.className = 'modal-subtitle';
    subtitle.textContent = `Final Score: ${finalScore} pts | Base Reward: +${earnedCoins} Coins`;

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

    const playAgainBtn = document.createElement('button');
    playAgainBtn.className = 'secondary-btn';
    playAgainBtn.textContent = 'Play Again ➔';
    playAgainBtn.onclick = () => {
      if (this.victoryAnimFrame) cancelAnimationFrame(this.victoryAnimFrame);
      this.closeModals();
      this.callbacks.onPlayAgain();
    };

    card.appendChild(title);
    card.appendChild(subtitle);
    card.appendChild(needleContainer);
    card.appendChild(claimBtn);
    card.appendChild(playAgainBtn);
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
