export interface HudCallbacks {
  onToggleSound(): void;
  onRestart(): void;
  onBoosterBelt(): void;
  onBoosterMagnet(): void;
  onBoosterUndo(): void;
  onRevive(): void;
  onGiveUp(): void;
  onClaimMultiplied(multiplier: number): void;
  onNextLevel(): void;
}

export class Hud {
  private readonly levelNumEl: HTMLElement;
  private readonly beltCountEl: HTMLElement;
  private readonly coinCountEl: HTMLElement;
  private readonly scoreCountEl: HTMLElement;
  private readonly soundBtn: HTMLElement;
  private readonly restartBtn: HTMLElement;
  private readonly tapHintEl: HTMLElement;

  private readonly beltBtn: HTMLElement;
  private readonly magnetBtn: HTMLElement;
  private readonly undoBtn: HTMLElement;

  private reviveTimerInterval: number | null = null;
  private victoryAnimFrame: number | null = null;
  private currentMultiplier = 2.0;

  constructor(
    private readonly container: HTMLElement,
    private readonly callbacks: HudCallbacks
  ) {
    this.levelNumEl = document.getElementById('level-num')!;
    this.beltCountEl = document.getElementById('belt-count')!;
    this.coinCountEl = document.getElementById('coin-count')!;
    this.scoreCountEl = document.getElementById('score-count')!;
    this.soundBtn = document.getElementById('sound-btn')!;
    this.restartBtn = document.getElementById('restart-btn')!;
    this.tapHintEl = document.getElementById('tap-hint')!;

    this.beltBtn = document.getElementById('booster-belt')!;
    this.magnetBtn = document.getElementById('booster-magnet')!;
    this.undoBtn = document.getElementById('booster-undo')!;

    this.setupListeners();
  }

  private setupListeners(): void {
    this.soundBtn.addEventListener('click', () => this.callbacks.onToggleSound());
    this.restartBtn.addEventListener('click', () => this.callbacks.onRestart());

    this.beltBtn.addEventListener('click', () => this.callbacks.onBoosterBelt());
    this.magnetBtn.addEventListener('click', () => this.callbacks.onBoosterMagnet());
    this.undoBtn.addEventListener('click', () => this.callbacks.onBoosterUndo());
  }

  public updateLevel(level: number): void {
    this.levelNumEl.textContent = String(level);
  }

  public setSurgeVisible(visible: boolean): void {
    let surgeBadge = document.getElementById('surge-badge');
    if (!surgeBadge) {
      surgeBadge = document.createElement('div');
      surgeBadge.id = 'surge-badge';
      surgeBadge.style.cssText = 'position:absolute;top:70px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#f59e0b,#eab308);color:#ffffff;font-weight:800;font-size:13px;padding:6px 16px;border-radius:20px;box-shadow:0 4px 12px rgba(245,158,11,0.4);pointer-events:none;z-index:30;display:none;letter-spacing:1px;';
      surgeBadge.textContent = '⚡ SPEED SURGE 1.6x & GATE OPEN!';
      this.container.appendChild(surgeBadge);
    }
    surgeBadge.style.display = visible ? 'block' : 'none';
  }

  public updateCoins(coins: number): void {
    this.coinCountEl.textContent = String(coins);
  }

  public updateScore(score: number): void {
    this.scoreCountEl.textContent = String(score);
  }

  public updateBeltCapacity(occupied: number, max: number): void {
    this.beltCountEl.textContent = `${occupied}/${max}`;
    if (occupied >= max - 2) {
      this.beltCountEl.style.color = '#ef4444';
      this.beltCountEl.style.textShadow = '0 0 8px rgba(239, 68, 68, 0.6)';
    } else {
      this.beltCountEl.style.color = '#38bdf8';
      this.beltCountEl.style.textShadow = 'none';
    }
  }

  public hideTapHint(): void {
    this.tapHintEl.classList.add('hidden');
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
    overlay.setAttribute('data-hud-interactive', 'true');

    // Prevent pointer event bleed
    const stopBleed = (e: Event) => e.stopPropagation();
    overlay.addEventListener('pointerdown', stopBleed);
    overlay.addEventListener('mousedown', stopBleed);
    overlay.addEventListener('touchstart', stopBleed);

    const card = document.createElement('div');
    card.className = 'modal-card';

    const title = document.createElement('div');
    title.className = 'modal-title';
    title.textContent = '⚠️ BANT SIKIŞTI! // CONVEYOR JAMMED';

    const subtitle = document.createElement('div');
    subtitle.className = 'modal-subtitle';
    subtitle.textContent = 'Fabrika bant kapasitesi doldu! Reklam izleyerek bandı temizleyin ve +4 Ek Yuva kazanın!';

    const countdown = document.createElement('div');
    countdown.style.fontSize = '28px';
    countdown.style.fontWeight = '900';
    countdown.style.color = '#ef4444';
    let timeLeft = 5;
    countdown.textContent = `⏳ ${timeLeft}s`;

    const reviveBtn = document.createElement('button');
    reviveBtn.className = 'primary-btn btn-revive';
    reviveBtn.setAttribute('data-ad-hook', 'revive');
    reviveBtn.textContent = '🎬 REKLAM İZLE: KİLİDİ AÇ (+4 YUVA)';
    reviveBtn.onclick = () => {
      this.clearReviveTimer();
      this.closeModals();
      this.callbacks.onRevive();
    };

    const giveUpBtn = document.createElement('button');
    giveUpBtn.className = 'secondary-btn';
    giveUpBtn.textContent = 'Yeniden Başlat';
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
    overlay.setAttribute('data-hud-interactive', 'true');

    const stopBleed = (e: Event) => e.stopPropagation();
    overlay.addEventListener('pointerdown', stopBleed);
    overlay.addEventListener('mousedown', stopBleed);
    overlay.addEventListener('touchstart', stopBleed);

    const card = document.createElement('div');
    card.className = 'modal-card';

    const title = document.createElement('div');
    title.className = 'modal-title';
    title.textContent = '🎉 SİPARİŞLER TAMAMLANDI!';

    const subtitle = document.createElement('div');
    subtitle.className = 'modal-subtitle';
    subtitle.textContent = `Tüm koliler başarıyla sevk edildi! Temel Kazanç: +${earnedCoins} Altın`;

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

    let phase = 0;
    const animateNeedle = () => {
      phase += 0.045;
      const progress = (Math.sin(phase) + 1) / 2; // 0 to 1
      pointer.style.left = `${(progress * 100).toFixed(1)}%`;

      if (progress < 0.25) {
        this.currentMultiplier = 1.5;
      } else if (progress < 0.5) {
        this.currentMultiplier = 2.0;
      } else if (progress < 0.75) {
        this.currentMultiplier = 3.0;
      } else {
        this.currentMultiplier = 5.0;
      }

      this.victoryAnimFrame = requestAnimationFrame(animateNeedle);
    };
    this.victoryAnimFrame = requestAnimationFrame(animateNeedle);

    const claimBtn = document.createElement('button');
    claimBtn.className = 'primary-btn btn-multiplier';
    claimBtn.setAttribute('data-ad-hook', 'multiplier');
    claimBtn.textContent = '🎬 REKLAM İZLE: ÇARPANLI ÖDÜLÜ AL!';
    claimBtn.onclick = () => {
      this.stopVictoryAnim();
      this.closeModals();
      this.callbacks.onClaimMultiplied(this.currentMultiplier);
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'secondary-btn';
    nextBtn.textContent = 'Doğrudan Devam Et (1x)';
    nextBtn.onclick = () => {
      this.stopVictoryAnim();
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

  private stopVictoryAnim(): void {
    if (this.victoryAnimFrame !== null) {
      cancelAnimationFrame(this.victoryAnimFrame);
      this.victoryAnimFrame = null;
    }
  }

  public closeModals(): void {
    this.clearReviveTimer();
    this.stopVictoryAnim();
    const modals = this.container.querySelectorAll('.modal-overlay');
    for (let i = 0; i < modals.length; i++) {
      modals[i].remove();
    }
  }
}
