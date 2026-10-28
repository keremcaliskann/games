import { UniversalAdProvider } from '../platform/ads';
import { CloudSaveData } from '../platform/sdk';
import { RUNNER_SKINS } from '../render/PrefabFactory';
import { RunnerEntity } from '../game/entities/runner';

export interface HudActions {
  onRestart: () => void;
  onToggleSound: () => boolean;
  onJumpOrDive: () => void;
  onActivateBooster: (type: 'jetpack' | 'giant' | 'speed') => void;
  onReviveQualifyAccepted: () => void;
  onReviveDeclined: () => void;
  onNextRoundOrTournament: (totalCoinsAwarded: number, advanceRound: boolean) => void;
  onSelectOrBuySkin: (skinId: number) => void;
  onBuyStatUpgrade: (stat: 'speed' | 'jump' | 'stability') => void;
}

const MULTIPLIERS = [1.5, 2, 3, 5];

export class HudController {
  private readonly hudEl: HTMLElement;
  private readonly roundTitleEl: HTMLElement;
  private readonly crownCountEl: HTMLElement;
  private readonly coinCountEl: HTMLElement;
  private readonly qualifyLabelEl: HTMLElement;
  private readonly rankLabelEl: HTMLElement;
  private readonly leaderboardEl: HTMLElement;
  private readonly garageBtn: HTMLElement;
  private readonly soundBtn: HTMLElement;
  private readonly restartBtn: HTMLElement;
  private readonly jumpDiveBtn: HTMLElement;
  private readonly boosterJetpackBtn: HTMLElement;
  private readonly boosterGiantBtn: HTMLElement;
  private readonly boosterSpeedBtn: HTMLElement;

  private activeModal: HTMLElement | null = null;
  private needleRaf = 0;
  private needleProgress = 0;
  private needleDir = 1;
  private readonly sortScratch: RunnerEntity[] = [];

  constructor(
    private readonly ads: UniversalAdProvider,
    private readonly actions: HudActions
  ) {
    this.hudEl = document.getElementById('hud')!;
    this.roundTitleEl = document.getElementById('round-title')!;
    this.crownCountEl = document.getElementById('crown-count')!;
    this.coinCountEl = document.getElementById('coin-count')!;
    this.qualifyLabelEl = document.getElementById('qualify-label')!;
    this.rankLabelEl = document.getElementById('rank-label')!;
    this.leaderboardEl = document.getElementById('leaderboard-panel')!;
    this.garageBtn = document.getElementById('garage-btn')!;
    this.soundBtn = document.getElementById('sound-btn')!;
    this.restartBtn = document.getElementById('restart-btn')!;
    this.jumpDiveBtn = document.getElementById('jump-dive-btn')!;
    this.boosterJetpackBtn = document.getElementById('booster-jetpack')!;
    this.boosterGiantBtn = document.getElementById('booster-giant')!;
    this.boosterSpeedBtn = document.getElementById('booster-speed')!;

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

    this.jumpDiveBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.actions.onJumpOrDive();
    });

    this.boosterJetpackBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('booster_jetpack');
      if (ok) this.actions.onActivateBooster('jetpack');
    });

    this.boosterGiantBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('booster_giant');
      if (ok) this.actions.onActivateBooster('giant');
    });

    this.boosterSpeedBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('booster_speed');
      if (ok) this.actions.onActivateBooster('speed');
    });
  }

  public bindGarageOpen(getSaveState: () => CloudSaveData): void {
    this.garageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showGarageModal(getSaveState);
    });
  }

  public syncStats(opts: {
    roundNum: number;
    crowns: number;
    coins: number;
    qualifiedCount: number;
    qualifySlots: number;
    playerRank: number;
    totalRunners: number;
    runners: RunnerEntity[];
    jetpackActive: boolean;
    giantActive: boolean;
    speedActive: boolean;
  }): void {
    const names = ['ROUND 1/3 • QUALIFY', 'ROUND 2/3 • SEMIFINAL', 'ROUND 3/3 • CROWN FINAL'];
    this.roundTitleEl.textContent = names[opts.roundNum - 1] || names[0];
    this.crownCountEl.textContent = String(opts.crowns);
    this.coinCountEl.textContent = String(opts.coins);
    this.qualifyLabelEl.textContent = `🏁 QUALIFIED: ${opts.qualifiedCount} / ${opts.qualifySlots}`;
    this.rankLabelEl.textContent = `🏃 POS: #${opts.playerRank}/${opts.totalRunners}`;

    this.boosterJetpackBtn.classList.toggle('active-booster', opts.jetpackActive);
    this.boosterGiantBtn.classList.toggle('active-booster', opts.giantActive);
    this.boosterSpeedBtn.classList.toggle('active-booster', opts.speedActive);

    this.sortScratch.length = 0;
    for (let i = 0; i < opts.runners.length; i++) {
      this.sortScratch.push(opts.runners[i]);
    }
    this.sortScratch.sort((a, b) => {
      if (a.qualified && b.qualified) return a.finishOrder - b.finishOrder;
      if (a.qualified) return -1;
      if (b.qualified) return 1;
      return b.pos.z - a.pos.z;
    });

    let html = '';
    const count = Math.min(4, this.sortScratch.length);
    for (let i = 0; i < count; i++) {
      const r = this.sortScratch[i];
      const pct = Math.min(100, Math.max(0, Math.round((r.pos.z / 90) * 100)));
      html += `<div class="lb-row ${r.isPlayer ? 'is-player' : ''}">
        <span>#${i + 1} ${r.name}</span>
        <span>${r.qualified ? '🏁' : `${pct}%`}</span>
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
      top: 24%;
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

  public showGarageModal(getSaveState: () => CloudSaveData): void {
    this.closeModal();
    const save = getSaveState();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('data-hud-interactive', 'true');

    const skinCardsHtml = RUNNER_SKINS.map((s) => {
      const unlocked = save.unlockedSkins.includes(s.id);
      const selected = save.selectedSkinId === s.id;
      return `
        <div class="skin-card ${selected ? 'selected' : ''}" data-skin-id="${s.id}">
          <div style="font-size: 20px">${s.emoji}</div>
          <div>${s.name}</div>
          <div style="color: ${unlocked ? '#16a34a' : '#d97706'}">
            ${selected ? 'EQUIPPED' : unlocked ? 'SELECT' : `${s.cost} 🪙`}
          </div>
        </div>
      `;
    }).join('');

    const speedCost = save.speedLevel * 100;
    const jumpCost = save.jumpLevel * 100;
    const stabCost = save.stabilityLevel * 100;

    overlay.innerHTML = `
      <div class="modal-card">
        <div style="font-size: 13px; font-weight: 900; color: #6366f1">👕 RUNNER GARAGE &amp; STAT LAB</div>
        <h2 style="font-size: 20px; font-weight: 900; color: #0f172a">SKINS &amp; UPGRADES (🪙 ${save.coins})</h2>
        <div class="skin-grid">${skinCardsHtml}</div>
        <div class="upgrade-row">
          <span>⚡ Sprint Speed (Lv.${save.speedLevel})</span>
          <button class="upgrade-buy-btn" data-stat="speed">UPGRADE (${speedCost} 🪙)</button>
        </div>
        <div class="upgrade-row">
          <span>🦘 Jump &amp; Dive (Lv.${save.jumpLevel})</span>
          <button class="upgrade-buy-btn" data-stat="jump">UPGRADE (${jumpCost} 🪙)</button>
        </div>
        <div class="upgrade-row">
          <span>🛡️ Knockback Resist (Lv.${save.stabilityLevel})</span>
          <button class="upgrade-buy-btn" data-stat="stability">UPGRADE (${stabCost} 🪙)</button>
        </div>
        <button id="garage-close-btn" class="primary-btn">BACK TO RACE</button>
      </div>
    `;
    this.hudEl.appendChild(overlay);
    this.activeModal = overlay;

    overlay.querySelectorAll('.skin-card').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number((el as HTMLElement).getAttribute('data-skin-id'));
        this.actions.onSelectOrBuySkin(id);
        this.showGarageModal(getSaveState);
      });
    });

    overlay.querySelectorAll('.upgrade-buy-btn').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const stat = (el as HTMLElement).getAttribute('data-stat') as 'speed' | 'jump' | 'stability';
        this.actions.onBuyStatUpgrade(stat);
        this.showGarageModal(getSaveState);
      });
    });

    overlay.querySelector('#garage-close-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
    });
  }

  public showNearMissReviveModal(roundNum: number, rank: number, qualifySlots: number): void {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('data-hud-interactive', 'true');
    overlay.innerHTML = `
      <div class="modal-card">
        <div style="font-size: 13px; font-weight: 900; color: #db2777">🏁 FINISHED #${rank} (TOP ${qualifySlots} QUALIFY)!</div>
        <h2 style="font-size: 22px; font-weight: 900; color: #0f172a">ELIMINATED IN ROUND ${roundNum}!</h2>
        <p style="font-size: 14px; color: #475569">
          Watch a quick ad to <strong>Claim Wildcard Qualification</strong> into Round ${Math.min(3, roundNum + 1)} with <strong>Hyper Dash Boots</strong>!
        </p>
        <button id="modal-revive-btn" class="primary-btn btn-revive" data-ad-hook="revive">
          🎬 WATCH AD TO QUALIFY &amp; ADVANCE
        </button>
        <button id="modal-giveup-btn" class="secondary-btn">
          Restart Tournament (Round 1)
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
        this.actions.onReviveQualifyAccepted();
      }
    });

    giveupBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
      this.actions.onReviveDeclined();
    });
  }

  public showVictoryModal(
    roundNum: number,
    rank: number,
    baseCoins: number,
    isFinalCrown: boolean
  ): void {
    this.closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.setAttribute('data-hud-interactive', 'true');
    overlay.innerHTML = `
      <div class="modal-card">
        <div style="font-size: 14px; font-weight: 800; color: #16a34a">
          ${isFinalCrown ? '👑 TOURNAMENT CHAMPION (#1)!' : `🏁 ROUND ${roundNum} QUALIFIED (#${rank})!`}
        </div>
        <h2 style="font-size: 24px; font-weight: 900; color: #0f172a">
          ${isFinalCrown ? 'GOLDEN CROWN WON!' : 'ADVANCING TO NEXT ROUND!'}
        </h2>
        <p style="font-size: 14px; color: #475569">
          Reward: <strong>+${baseCoins} 🪙</strong> ${isFinalCrown ? '+ <strong>1 👑 Crown</strong>' : ''}
        </p>
        <div class="multiplier-gauge-wrap">
          <div id="victory-needle" class="multiplier-needle" style="left: 50%"></div>
        </div>
        <div id="victory-mult-label" class="multiplier-label">2x (+${baseCoins * 2} 🪙)</div>
        <button id="modal-claim-mult-btn" class="primary-btn btn-multiplier" data-ad-hook="multiplier">
          🎬 CLAIM MULTIPLIED COINS
        </button>
        <button id="modal-claim-base-btn" class="secondary-btn">
          Claim +${baseCoins} Coins &amp; ${isFinalCrown ? 'New Tournament' : `Start Round ${roundNum + 1}`}
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
      this.actions.onNextRoundOrTournament(finalCoins, !isFinalCrown);
    });

    claimBaseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
      awaitInterstitialThenNext(this.ads, () => {
        this.actions.onNextRoundOrTournament(baseCoins, !isFinalCrown);
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
    await ads.showInterstitial('round_complete');
  } catch {
    // Ignore
  }
  cb();
}
