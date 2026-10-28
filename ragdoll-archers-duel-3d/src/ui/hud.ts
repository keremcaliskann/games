import { UniversalAdProvider } from '../platform/ads';

export interface HudActions {
  onRestart: () => void;
  onToggleSound: () => boolean;
  onActivateBooster: (type: 'triple' | 'pierce' | 'shield') => void;
  onReviveAccepted: () => void;
  onReviveDeclined: () => void;
  onNextWave: (totalCoinsAwarded: number) => void;
}

const MULTIPLIERS = [1.5, 2, 3, 5];

export class HudController {
  private readonly hudEl: HTMLElement;
  private readonly levelNumEl: HTMLElement;
  private readonly coinCountEl: HTMLElement;
  private readonly hpBarEl: HTMLElement;
  private readonly hpTextEl: HTMLElement;
  private readonly windLabelEl: HTMLElement;
  private readonly enemiesLabelEl: HTMLElement;
  private readonly shieldBadgeEl: HTMLElement;
  private readonly soundBtn: HTMLElement;
  private readonly restartBtn: HTMLElement;
  private readonly boosterTripleBtn: HTMLElement;
  private readonly boosterPierceBtn: HTMLElement;
  private readonly boosterShieldBtn: HTMLElement;

  private activeModal: HTMLElement | null = null;
  private needleRaf = 0;
  private needleProgress = 0;
  private needleDir = 1;

  constructor(
    private readonly ads: UniversalAdProvider,
    private readonly actions: HudActions
  ) {
    this.hudEl = document.getElementById('hud')!;
    this.levelNumEl = document.getElementById('level-num')!;
    this.coinCountEl = document.getElementById('coin-count')!;
    this.hpBarEl = document.getElementById('player-hp-bar')!;
    this.hpTextEl = document.getElementById('player-hp-text')!;
    this.windLabelEl = document.getElementById('wind-label')!;
    this.enemiesLabelEl = document.getElementById('enemies-label')!;
    this.shieldBadgeEl = document.getElementById('shield-badge')!;
    this.soundBtn = document.getElementById('sound-btn')!;
    this.restartBtn = document.getElementById('restart-btn')!;
    this.boosterTripleBtn = document.getElementById('booster-triple')!;
    this.boosterPierceBtn = document.getElementById('booster-pierce')!;
    this.boosterShieldBtn = document.getElementById('booster-shield')!;

    this.bindButtons();
  }

  private bindButtons(): void {
    this.soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const enabled = this.actions.onToggleSound();
      this.soundBtn.textContent = enabled ? '🔊' : '🔇';
    });

    this.restartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
      this.actions.onRestart();
    });

    this.boosterTripleBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('booster_triple');
      if (ok) this.actions.onActivateBooster('triple');
    });

    this.boosterPierceBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('booster_pierce');
      if (ok) this.actions.onActivateBooster('pierce');
    });

    this.boosterShieldBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('booster_shield');
      if (ok) this.actions.onActivateBooster('shield');
    });
  }

  public syncStats(opts: {
    wave: number;
    coins: number;
    hp: number;
    maxHp: number;
    windX: number;
    aliveEnemies: number;
    shieldCharges: number;
    tripleArmed: boolean;
    laserArmed: boolean;
  }): void {
    this.levelNumEl.textContent = String(opts.wave);
    this.coinCountEl.textContent = String(opts.coins);
    const pct = Math.max(0, Math.min(100, Math.round((opts.hp / opts.maxHp) * 100)));
    this.hpBarEl.style.width = `${pct}%`;
    this.hpTextEl.textContent = String(opts.hp);

    const windArrow = opts.windX > 0.1 ? '➡️' : opts.windX < -0.1 ? '⬅️' : '⏺️';
    this.windLabelEl.textContent = `🌬️ WIND: ${windArrow} ${Math.abs(opts.windX).toFixed(1)}m/s`;
    this.enemiesLabelEl.textContent = `🎯 RIVALS: ${opts.aliveEnemies}`;

    if (opts.shieldCharges > 0) {
      this.shieldBadgeEl.style.display = 'inline';
      this.shieldBadgeEl.textContent = `🛡️ SHIELD x${opts.shieldCharges}`;
    } else {
      this.shieldBadgeEl.style.display = 'none';
    }

    this.boosterTripleBtn.classList.toggle('active-booster', opts.tripleArmed);
    this.boosterPierceBtn.classList.toggle('active-booster', opts.laserArmed);
  }

  public showFloatingCallout(text: string, colorHex = '#facc15'): void {
    const badge = document.createElement('div');
    badge.textContent = text;
    badge.style.cssText = `
      position: absolute;
      left: 50%;
      top: 24%;
      transform: translate(-50%, 0) scale(0.9);
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.85);
      color: ${colorHex};
      font-weight: 900;
      font-size: 15px;
      letter-spacing: 0.04em;
      pointer-events: none;
      box-shadow: 0 6px 16px rgba(15, 23, 42, 0.25);
      transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease;
      z-index: 40;
    `;
    this.hudEl.appendChild(badge);
    requestAnimationFrame(() => {
      badge.style.transform = 'translate(-50%, -28px) scale(1.06)';
      badge.style.opacity = '0';
    });
    window.setTimeout(() => {
      badge.remove();
    }, 580);
  }

  public showNearMissReviveModal(aliveEnemies: number): void {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('data-hud-interactive', 'true');
    overlay.innerHTML = `
      <div class="modal-card">
        <div class="countdown-badge">🏹 SO CLOSE! (${aliveEnemies} RIVAL LEFT)</div>
        <h2 style="font-size: 22px; font-weight: 900; color: #0f172a">DEFEATED IN DUEL!</h2>
        <p style="font-size: 14px; color: #475569">
          Revive with <strong>100% Full Health</strong>, <strong>Guardian Shield</strong> &amp; <strong>1 Free Laser Arrow</strong>!
        </p>
        <button id="modal-revive-btn" class="primary-btn btn-revive" data-ad-hook="revive">
          🎬 WATCH AD TO REVIVE &amp; SMASH
        </button>
        <button id="modal-giveup-btn" class="secondary-btn">
          Retry Wave
        </button>
      </div>
    `;
    this.hudEl.appendChild(overlay);
    this.activeModal = overlay;

    const reviveBtn = overlay.querySelector('#modal-revive-btn') as HTMLElement;
    const giveupBtn = overlay.querySelector('#modal-giveup-btn') as HTMLElement;

    reviveBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const rewarded = await this.ads.showRewarded('revive');
      if (rewarded) {
        this.closeModal();
        this.actions.onReviveAccepted();
      }
    });

    giveupBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
      this.actions.onReviveDeclined();
    });
  }

  public showVictoryModal(wave: number, baseCoins: number, headshots: number): void {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('data-hud-interactive', 'true');
    overlay.innerHTML = `
      <div class="modal-card">
        <div style="font-size: 14px; font-weight: 800; color: #16a34a">🏆 WAVE ${wave} CLEARED!</div>
        <h2 style="font-size: 24px; font-weight: 900; color: #0f172a">DUEL VICTORY!</h2>
        <p style="font-size: 14px; color: #475569">
          Headshots: <strong>${headshots}</strong> &bull; Base Payout: <strong>+${baseCoins} 🪙</strong>
        </p>
        <div class="multiplier-gauge-wrap">
          <div id="victory-needle" class="multiplier-needle" style="left: 50%"></div>
        </div>
        <div id="victory-mult-label" class="multiplier-label">2x (+${baseCoins * 2} 🪙)</div>
        <button id="modal-claim-mult-btn" class="primary-btn btn-multiplier" data-ad-hook="multiplier">
          🎬 CLAIM MULTIPLIED COINS
        </button>
        <button id="modal-claim-base-btn" class="secondary-btn">
          Claim +${baseCoins} Coins &amp; Next Wave
        </button>
      </div>
    `;
    this.hudEl.appendChild(overlay);
    this.activeModal = overlay;

    const needleEl = overlay.querySelector('#victory-needle') as HTMLElement;
    const multLabelEl = overlay.querySelector('#victory-mult-label') as HTMLElement;
    const claimMultBtn = overlay.querySelector('#modal-claim-mult-btn') as HTMLElement;
    const claimBaseBtn = overlay.querySelector('#modal-claim-base-btn') as HTMLElement;

    this.needleProgress = 0.2;
    this.needleDir = 1;
    let currentMult = 2;

    const stepNeedle = (): void => {
      if (!this.activeModal) return;
      this.needleProgress += this.needleDir * 0.018;
      if (this.needleProgress >= 1) {
        this.needleProgress = 1;
        this.needleDir = -1;
      } else if (this.needleProgress <= 0) {
        this.needleProgress = 0;
        this.needleDir = 1;
      }
      needleEl.style.left = `${(this.needleProgress * 100).toFixed(1)}%`;
      const idx = Math.min(
        MULTIPLIERS.length - 1,
        Math.floor(this.needleProgress * MULTIPLIERS.length)
      );
      currentMult = MULTIPLIERS[idx];
      const boosted = Math.round(baseCoins * currentMult);
      multLabelEl.textContent = `${currentMult}x (+${boosted} 🪙)`;
      this.needleRaf = requestAnimationFrame(stepNeedle);
    };
    this.needleRaf = requestAnimationFrame(stepNeedle);

    claimMultBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      cancelAnimationFrame(this.needleRaf);
      const lockedMult = currentMult;
      const rewarded = await this.ads.showRewarded('victory_multiplier');
      const finalCoins = rewarded ? Math.round(baseCoins * lockedMult) : baseCoins;
      this.closeModal();
      this.actions.onNextWave(finalCoins);
    });

    claimBaseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
      awaitInterstitialThenNext(this.ads, () => {
        this.actions.onNextWave(baseCoins);
      });
    });
  }

  public closeModal(): void {
    if (this.needleRaf) {
      cancelAnimationFrame(this.needleRaf);
      this.needleRaf = 0;
    }
    if (this.activeModal) {
      this.activeModal.remove();
      this.activeModal = null;
    }
  }
}

async function awaitInterstitialThenNext(
  ads: UniversalAdProvider,
  cb: () => void
): Promise<void> {
  try {
    await ads.showInterstitial('wave_complete');
  } catch {
    // Ignore
  }
  cb();
}
