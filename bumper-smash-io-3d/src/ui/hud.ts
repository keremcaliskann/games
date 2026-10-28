import { UniversalAdProvider } from '../platform/ads';
import { KartEntity } from '../game/entities/kart';

export interface HudActions {
  onRestart: () => void;
  onToggleSound: () => boolean;
  onActivateBooster: (type: 'nitro' | 'vortex' | 'spikes') => void;
  onReviveAccepted: () => void;
  onReviveDeclined: () => void;
  onNextArena: (totalCoinsAwarded: number) => void;
}

const MULTIPLIERS = [1.5, 2, 3, 5];

export class HudController {
  private readonly hudEl: HTMLElement;
  private readonly arenaNumEl: HTMLElement;
  private readonly timerLabelEl: HTMLElement;
  private readonly coinCountEl: HTMLElement;
  private readonly survivorsLabelEl: HTMLElement;
  private readonly koLabelEl: HTMLElement;
  private readonly leaderboardEl: HTMLElement;
  private readonly soundBtn: HTMLElement;
  private readonly restartBtn: HTMLElement;
  private readonly boosterNitroBtn: HTMLElement;
  private readonly boosterVortexBtn: HTMLElement;
  private readonly boosterSpikesBtn: HTMLElement;

  private activeModal: HTMLElement | null = null;
  private needleRaf = 0;
  private needleProgress = 0;
  private needleDir = 1;
  private readonly sortScratch: KartEntity[] = [];

  constructor(
    private readonly ads: UniversalAdProvider,
    private readonly actions: HudActions
  ) {
    this.hudEl = document.getElementById('hud')!;
    this.arenaNumEl = document.getElementById('arena-num')!;
    this.timerLabelEl = document.getElementById('timer-label')!;
    this.coinCountEl = document.getElementById('coin-count')!;
    this.survivorsLabelEl = document.getElementById('survivors-label')!;
    this.koLabelEl = document.getElementById('ko-label')!;
    this.leaderboardEl = document.getElementById('leaderboard-panel')!;
    this.soundBtn = document.getElementById('sound-btn')!;
    this.restartBtn = document.getElementById('restart-btn')!;
    this.boosterNitroBtn = document.getElementById('booster-nitro')!;
    this.boosterVortexBtn = document.getElementById('booster-vortex')!;
    this.boosterSpikesBtn = document.getElementById('booster-spikes')!;

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

    this.boosterNitroBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('booster_nitro');
      if (ok) this.actions.onActivateBooster('nitro');
    });

    this.boosterVortexBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('booster_vortex');
      if (ok) this.actions.onActivateBooster('vortex');
    });

    this.boosterSpikesBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('booster_spikes');
      if (ok) this.actions.onActivateBooster('spikes');
    });
  }

  public syncStats(opts: {
    arenaNum: number;
    timeRemaining: number;
    coins: number;
    aliveCount: number;
    totalCount: number;
    knockouts: number;
    karts: KartEntity[];
    nitroActive: boolean;
    vortexActive: boolean;
    spikesActive: boolean;
  }): void {
    this.arenaNumEl.textContent = String(opts.arenaNum);
    this.timerLabelEl.textContent = `${Math.ceil(opts.timeRemaining)}s`;
    this.coinCountEl.textContent = String(opts.coins);
    this.survivorsLabelEl.textContent = `🏎️ ALIVE: ${opts.aliveCount}/${opts.totalCount}`;
    this.koLabelEl.textContent = `💥 KOs: ${opts.knockouts}`;

    this.boosterNitroBtn.classList.toggle('active-booster', opts.nitroActive);
    this.boosterVortexBtn.classList.toggle('active-booster', opts.vortexActive);
    this.boosterSpikesBtn.classList.toggle('active-booster', opts.spikesActive);

    // Top 4 live leaderboard
    this.sortScratch.length = 0;
    for (let i = 0; i < opts.karts.length; i++) {
      if (opts.karts[i].isAlive) {
        this.sortScratch.push(opts.karts[i]);
      }
    }
    this.sortScratch.sort((a, b) => b.score - a.score);

    let html = '';
    const count = Math.min(4, this.sortScratch.length);
    for (let i = 0; i < count; i++) {
      const k = this.sortScratch[i];
      html += `<div class="lb-row ${k.isPlayer ? 'is-player' : ''}">
        <span>#${i + 1} ${k.name}</span>
        <span>${k.score}</span>
      </div>`;
    }
    this.leaderboardEl.innerHTML = html;
  }

  public showFloatingCallout(text: string, colorHex = '#facc15'): void {
    const badge = document.createElement('div');
    badge.textContent = text;
    badge.style.cssText = `
      position: absolute;
      left: 50%;
      top: 25%;
      transform: translate(-50%, 0) scale(0.9);
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.85);
      color: ${colorHex};
      font-weight: 900;
      font-size: 14px;
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

  public showNearMissReviveModal(rank: number, aliveRivals: number): void {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('data-hud-interactive', 'true');
    overlay.innerHTML = `
      <div class="modal-card">
        <div style="font-size: 13px; font-weight: 900; color: #ea580c">🏎️ KNOCKED OUT AT #${rank} (${aliveRivals} LEFT)!</div>
        <h2 style="font-size: 22px; font-weight: 900; color: #0f172a">SO CLOSE TO #1!</h2>
        <p style="font-size: 14px; color: #475569">
          Rocket-jump back onto the arena center with <strong>Repulsion Shockwave</strong> &amp; <strong>Spike Armor</strong>!
        </p>
        <button id="modal-revive-btn" class="primary-btn btn-revive" data-ad-hook="revive">
          🎬 WATCH AD TO ROCKET-REVIVE
        </button>
        <button id="modal-giveup-btn" class="secondary-btn">
          Retry Arena
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

  public showVictoryModal(arenaNum: number, baseCoins: number, knockouts: number): void {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('data-hud-interactive', 'true');
    overlay.innerHTML = `
      <div class="modal-card">
        <div style="font-size: 14px; font-weight: 800; color: #16a34a">🏆 ARENA ${arenaNum} CHAMPION (#1)!</div>
        <h2 style="font-size: 24px; font-weight: 900; color: #0f172a">KNOCKOUT VICTORY!</h2>
        <p style="font-size: 14px; color: #475569">
          Total KOs: <strong>${knockouts}</strong> &bull; Base Payout: <strong>+${baseCoins} 🪙</strong>
        </p>
        <div class="multiplier-gauge-wrap">
          <div id="victory-needle" class="multiplier-needle" style="left: 50%"></div>
        </div>
        <div id="victory-mult-label" class="multiplier-label">2x (+${baseCoins * 2} 🪙)</div>
        <button id="modal-claim-mult-btn" class="primary-btn btn-multiplier" data-ad-hook="multiplier">
          🎬 CLAIM MULTIPLIED COINS
        </button>
        <button id="modal-claim-base-btn" class="secondary-btn">
          Claim +${baseCoins} Coins &amp; Next Arena
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
      this.actions.onNextArena(finalCoins);
    });

    claimBaseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
      awaitInterstitialThenNext(this.ads, () => {
        this.actions.onNextArena(baseCoins);
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
    await ads.showInterstitial('arena_complete');
  } catch {
    // Ignore
  }
  cb();
}
