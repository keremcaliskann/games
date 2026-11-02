import { SoundController } from '../core/audio';
import { RallyStageManager } from '../game/systems/rally-stage-manager';
import { UniversalAdProvider } from '../platform/ads';
import { PlatformBridge, RallySaveData } from '../platform/sdk';
import { RALLY_LIVERIES } from '../render/PrefabFactory';

const MULTIPLIER_STOPS = [1.5, 2, 3, 5, 3, 2, 1.5];

export class HudController {
  private readonly stageEl: HTMLElement;
  private readonly clockEl: HTMLElement;
  private readonly speedEl: HTMLElement;
  private readonly rankEl: HTMLElement;
  private readonly coinsEl: HTMLElement;
  private readonly medalsEl: HTMLElement;
  private readonly paceNoteEl: HTMLElement;
  private readonly progressFillEl: HTMLElement;
  private readonly calloutEl: HTMLElement;
  private readonly modalLayer: HTMLElement;
  private readonly muteBtn: HTMLButtonElement;

  private calloutTimer = 0;
  private multiplierPhase = 0;
  private currentMultiplier = 3;
  private isVictoryOpen = false;
  private pendingVictoryBaseCoins = 0;

  constructor(
    private readonly root: HTMLElement,
    private readonly stage: RallyStageManager,
    private readonly sdk: PlatformBridge,
    private readonly ads: UniversalAdProvider,
    private readonly audio: SoundController,
    private readonly saveData: RallySaveData,
    private readonly onRestartStage: () => void
  ) {
    this.injectStyles();

    this.root.innerHTML = `
      <div class="rh-top-bar">
        <div class="rh-stat-group">
          <div class="rh-pill rh-pill-stage" id="rh-stage">STAGE 1 // ALPINE TARMAC</div>
          <div class="rh-pill rh-pill-clock" id="rh-clock">⏱️ 56.0s</div>
          <div class="rh-pill rh-pill-rank" id="rh-rank">🏁 POS #1/4</div>
        </div>
        <div class="rh-stat-group">
          <div class="rh-pill rh-pill-speed" id="rh-speed">⚡ 0 KM/H</div>
          <div class="rh-pill rh-pill-medals" id="rh-medals">🏅 0</div>
          <div class="rh-pill rh-pill-coins" id="rh-coins">🪙 120</div>
          <button class="rh-icon-btn" id="rh-garage-btn" data-hud-interactive="true" title="Rally Garage">🔧 GARAGE</button>
          <button class="rh-icon-btn" id="rh-mute-btn" data-hud-interactive="true" title="Toggle Sound">🔊</button>
        </div>
      </div>

      <div class="rh-pacenote-wrap">
        <div class="rh-pacenote-banner" id="rh-pacenote">CREST FLAT OUT ↑</div>
        <div class="rh-progress-track">
          <div class="rh-progress-fill" id="rh-progress-fill"></div>
        </div>
      </div>

      <div class="rh-callout" id="rh-callout"></div>

      <div class="rh-booster-bar">
        <button class="rh-booster-btn" id="rh-boost-nitro" data-hud-interactive="true">
          <span class="rh-ad-tag">🎬 AD</span>
          <span class="rh-boost-icon">🔥</span>
          <span class="rh-boost-label">TWIN-TURBO (8s)</span>
        </button>
        <button class="rh-booster-btn" id="rh-boost-grip" data-hud-interactive="true">
          <span class="rh-ad-tag">🎬 AD</span>
          <span class="rh-boost-icon">🛞</span>
          <span class="rh-boost-label">GRAVEL GRIP (12s)</span>
        </button>
        <button class="rh-booster-btn" id="rh-boost-codriver" data-hud-interactive="true">
          <span class="rh-ad-tag">🎬 AD</span>
          <span class="rh-boost-icon">🧭</span>
          <span class="rh-boost-label">RACING LINE +8s</span>
        </button>
      </div>

      <div class="rh-modal-layer" id="rh-modal-layer"></div>
    `;

    this.stageEl = this.root.querySelector('#rh-stage') as HTMLElement;
    this.clockEl = this.root.querySelector('#rh-clock') as HTMLElement;
    this.speedEl = this.root.querySelector('#rh-speed') as HTMLElement;
    this.rankEl = this.root.querySelector('#rh-rank') as HTMLElement;
    this.coinsEl = this.root.querySelector('#rh-coins') as HTMLElement;
    this.medalsEl = this.root.querySelector('#rh-medals') as HTMLElement;
    this.paceNoteEl = this.root.querySelector('#rh-pacenote') as HTMLElement;
    this.progressFillEl = this.root.querySelector('#rh-progress-fill') as HTMLElement;
    this.calloutEl = this.root.querySelector('#rh-callout') as HTMLElement;
    this.modalLayer = this.root.querySelector('#rh-modal-layer') as HTMLElement;
    this.muteBtn = this.root.querySelector('#rh-mute-btn') as HTMLButtonElement;

    this.bindEvents();
    this.refreshHud();
  }

  private bindEvents(): void {
    const stopBleed = (e: Event) => e.stopPropagation();

    this.muteBtn.addEventListener('pointerdown', stopBleed);
    this.muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const muted = this.audio.toggleUserMute();
      this.muteBtn.textContent = muted ? '🔇' : '🔊';
    });

    const garageBtn = this.root.querySelector('#rh-garage-btn') as HTMLButtonElement;
    garageBtn.addEventListener('pointerdown', stopBleed);
    garageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showGarageModal();
    });

    const bindBooster = (selector: string, placement: string, type: 'nitro' | 'grip' | 'codriver') => {
      const btn = this.root.querySelector(selector) as HTMLButtonElement;
      btn.addEventListener('pointerdown', stopBleed);
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const rewarded = await this.ads.showRewarded(placement);
        if (rewarded) {
          this.stage.activateBooster(type);
        }
      });
    };

    bindBooster('#rh-boost-nitro', 'booster_nitro', 'nitro');
    bindBooster('#rh-boost-grip', 'booster_grip', 'grip');
    bindBooster('#rh-boost-codriver', 'booster_codriver', 'codriver');
  }

  public refreshHud(): void {
    const p = this.stage.player;
    const kmh = p ? Math.round(p.speed * 4.8) : 0;
    const rank = this.stage.getPlayerRank();
    const pct = Math.round(this.stage.getProgressRatio() * 100);

    this.stageEl.textContent = `STAGE ${this.stage.stageNumber} // ${this.stage.currentBiome.name}`;
    this.clockEl.textContent = `⏱️ ${this.stage.remainingSec.toFixed(1)}s`;
    this.speedEl.textContent = `⚡ ${kmh} KM/H`;
    this.rankEl.textContent = `🏁 POS #${rank}/4 (${pct}%)`;
    this.coinsEl.textContent = `🪙 ${this.saveData.coins}`;
    this.medalsEl.textContent = `🏅 ${this.saveData.medals}`;
    this.paceNoteEl.textContent = this.stage.currentCornerCallout;
    this.progressFillEl.style.width = `${pct}%`;
  }

  public showCallout(text: string, color = '#facc15'): void {
    this.calloutEl.textContent = text;
    this.calloutEl.style.color = color;
    this.calloutEl.classList.add('visible');
    this.calloutTimer = 2.2;
  }

  public update(dt: number): void {
    if (this.calloutTimer > 0) {
      this.calloutTimer -= dt;
      if (this.calloutTimer <= 0) {
        this.calloutEl.classList.remove('visible');
      }
    }

    if (this.isVictoryOpen) {
      this.multiplierPhase += dt * 2.8;
      const idx = Math.floor(
        ((Math.sin(this.multiplierPhase) + 1) * 0.5) * (MULTIPLIER_STOPS.length - 0.01)
      );
      this.currentMultiplier = MULTIPLIER_STOPS[idx];
      const needle = this.modalLayer.querySelector('#rh-mult-needle') as HTMLElement | null;
      const claimBtn = this.modalLayer.querySelector('#rh-claim-mult-btn') as HTMLElement | null;
      if (needle) {
        const pct = ((Math.sin(this.multiplierPhase) + 1) * 0.5) * 86 + 7;
        needle.style.left = `${pct}%`;
      }
      if (claimBtn) {
        const boosted = Math.round(this.pendingVictoryBaseCoins * this.currentMultiplier);
        claimBtn.textContent = `🎬 CLAIM ${this.currentMultiplier}x REWARD (+${boosted} 🪙)`;
      }
    }
  }

  public showNearMissReviveModal(progressPct: number): void {
    this.modalLayer.classList.add('active');
    this.modalLayer.innerHTML = `
      <div class="rh-modal-card" data-hud-interactive="true">
        <div class="rh-modal-badge">⏱️ STAGE CLOCK EXPIRED AT ${progressPct}%!</div>
        <h2 class="rh-modal-title">SO CLOSE TO THE FINISH!</h2>
        <p class="rh-modal-sub">Watch a short Rewarded Ad to add <b>+16s Stage Clock</b> and engage <b>Twin-Turbo Surge + Gravel Grip Tires</b>!</p>
        <button class="rh-cta-btn rh-cta-green" id="rh-revive-ad-btn" data-hud-interactive="true">
          🎬 +16s CLOCK & TWIN-TURBO SURGE
        </button>
        <button class="rh-cta-btn rh-cta-secondary" id="rh-revive-skip-btn" data-hud-interactive="true">
          Restart Stage
        </button>
      </div>
    `;

    const reviveBtn = this.modalLayer.querySelector('#rh-revive-ad-btn') as HTMLButtonElement;
    const skipBtn = this.modalLayer.querySelector('#rh-revive-skip-btn') as HTMLButtonElement;

    reviveBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('revive_stage');
      if (ok) {
        this.closeModal();
        this.stage.reviveStageWithTurbo();
      }
    });

    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
      this.onRestartStage();
    });
  }

  public showVictoryModal(
    rank: number,
    stageTimeSec: number,
    goldTargetSec: number,
    baseCoins: number
  ): void {
    this.isVictoryOpen = true;
    this.pendingVictoryBaseCoins = baseCoins;

    const wonGold = stageTimeSec <= goldTargetSec || rank === 1;
    if (wonGold) {
      this.saveData.medals += 1;
    }
    this.saveData.stageNumber += 1;
    this.sdk.sendScore(this.saveData.medals * 200 + this.saveData.stageNumber * 100);
    void this.sdk.saveData(this.saveData);

    this.modalLayer.classList.add('active');
    this.modalLayer.innerHTML = `
      <div class="rh-modal-card" data-hud-interactive="true">
        <div class="rh-modal-badge">${wonGold ? '🏅 GOLD MEDAL STAGE CLEAR!' : '🏁 STAGE COMPLETED!'}</div>
        <h2 class="rh-modal-title">RANK #${rank} // ${stageTimeSec.toFixed(1)}s</h2>
        <p class="rh-modal-sub">Target: ${goldTargetSec.toFixed(1)}s • Base Prize: <b>+${baseCoins} 🪙</b></p>

        <div class="rh-mult-bar">
          <div class="rh-mult-zones">
            <span>1.5x</span><span>2x</span><span class="rh-zone-gold">3x</span><span class="rh-zone-max">5x</span><span class="rh-zone-gold">3x</span><span>2x</span><span>1.5x</span>
          </div>
          <div class="rh-mult-needle" id="rh-mult-needle"></div>
        </div>

        <button class="rh-cta-btn rh-cta-green" id="rh-claim-mult-btn" data-hud-interactive="true">
          🎬 CLAIM 3x REWARD (+${baseCoins * 3} 🪙)
        </button>
        <button class="rh-cta-btn rh-cta-secondary" id="rh-claim-base-btn" data-hud-interactive="true">
          Continue (+${baseCoins} 🪙)
        </button>
      </div>
    `;

    const multBtn = this.modalLayer.querySelector('#rh-claim-mult-btn') as HTMLButtonElement;
    const baseBtn = this.modalLayer.querySelector('#rh-claim-base-btn') as HTMLButtonElement;

    multBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const lockedMult = this.currentMultiplier;
      const ok = await this.ads.showRewarded('victory_multiplier');
      const earned = ok ? Math.round(baseCoins * lockedMult) : baseCoins;
      this.saveData.coins += earned;
      void this.sdk.saveData(this.saveData);
      this.closeModal();
      this.onRestartStage();
    });

    baseBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      this.saveData.coins += baseCoins;
      void this.sdk.saveData(this.saveData);
      await this.ads.showInterstitial('stage_complete');
      this.closeModal();
      this.onRestartStage();
    });
  }

  public showGarageModal(): void {
    const turboCost = this.saveData.turboUpgradeLevel * 90;
    const gripCost = this.saveData.gripUpgradeLevel * 90;
    const suspCost = this.saveData.suspensionUpgradeLevel * 90;

    const skinsHtml = RALLY_LIVERIES.map((skin) => {
      const unlocked = this.saveData.unlockedSkins.includes(skin.id);
      const selected = this.saveData.selectedSkin === skin.id;
      const hexStr = '#' + skin.baseHex.toString(16).padStart(6, '0');
      return `
        <button class="rh-skin-item ${selected ? 'selected' : ''}" data-skin-id="${skin.id}" data-hud-interactive="true">
          <span class="rh-skin-swatch" style="background:${hexStr}"></span>
          <span class="rh-skin-name">${skin.name}</span>
          <span class="rh-skin-status">${selected ? 'EQUIPPED' : unlocked ? 'SELECT' : `🪙 ${skin.price}`}</span>
        </button>
      `;
    }).join('');

    this.modalLayer.classList.add('active');
    this.modalLayer.innerHTML = `
      <div class="rh-modal-card" data-hud-interactive="true">
        <div class="rh-modal-badge">🔧 WRC RALLY TUNING GARAGE // 🪙 ${this.saveData.coins}</div>
        <h2 class="rh-modal-title">LIVERIES & TUNING</h2>
        <div class="rh-upgrade-grid">
          <button class="rh-upg-btn" id="rh-upg-turbo" data-hud-interactive="true">
            🔥 TURBO LV.${this.saveData.turboUpgradeLevel}<br/><span>🪙 ${turboCost}</span>
          </button>
          <button class="rh-upg-btn" id="rh-upg-grip" data-hud-interactive="true">
            🛞 TIRES LV.${this.saveData.gripUpgradeLevel}<br/><span>🪙 ${gripCost}</span>
          </button>
          <button class="rh-upg-btn" id="rh-upg-susp" data-hud-interactive="true">
            🔩 SUSPENSION LV.${this.saveData.suspensionUpgradeLevel}<br/><span>🪙 ${suspCost}</span>
          </button>
        </div>
        <div class="rh-skin-list">${skinsHtml}</div>
        <button class="rh-cta-btn rh-cta-secondary" id="rh-garage-close" data-hud-interactive="true">BACK TO STAGE</button>
      </div>
    `;

    this.modalLayer.querySelector('#rh-garage-close')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
    });

    const bindUpgrade = (id: string, cost: number, applyFn: () => void) => {
      this.modalLayer.querySelector(id)?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.saveData.coins >= cost) {
          this.saveData.coins -= cost;
          applyFn();
          void this.sdk.saveData(this.saveData);
          this.refreshHud();
          this.showGarageModal();
        }
      });
    };

    bindUpgrade('#rh-upg-turbo', turboCost, () => {
      this.saveData.turboUpgradeLevel++;
    });
    bindUpgrade('#rh-upg-grip', gripCost, () => {
      this.saveData.gripUpgradeLevel++;
    });
    bindUpgrade('#rh-upg-susp', suspCost, () => {
      this.saveData.suspensionUpgradeLevel++;
    });

    this.modalLayer.querySelectorAll<HTMLButtonElement>('.rh-skin-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(btn.getAttribute('data-skin-id'));
        const skin = RALLY_LIVERIES.find((s) => s.id === id);
        if (!skin) return;
        if (this.saveData.unlockedSkins.includes(id)) {
          this.saveData.selectedSkin = id;
        } else if (this.saveData.coins >= skin.price) {
          this.saveData.coins -= skin.price;
          this.saveData.unlockedSkins.push(id);
          this.saveData.selectedSkin = id;
        }
        void this.sdk.saveData(this.saveData);
        this.onRestartStage();
        this.showGarageModal();
      });
    });
  }

  private closeModal(): void {
    this.isVictoryOpen = false;
    this.modalLayer.classList.remove('active');
    this.modalLayer.innerHTML = '';
    this.refreshHud();
  }

  private injectStyles(): void {
    if (document.getElementById('rh-hud-styles')) return;
    const style = document.createElement('style');
    style.id = 'rh-hud-styles';
    style.textContent = `
      .rh-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px 62px 8px 14px;
      }
      .rh-stat-group {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .rh-pill {
        background: rgba(15, 23, 42, 0.78);
        backdrop-filter: blur(8px);
        color: #f8fafc;
        border: 1.5px solid rgba(255, 255, 255, 0.25);
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.4px;
      }
      .rh-pill-clock { color: #fde047; }
      .rh-pill-speed { color: #38bdf8; }
      .rh-icon-btn {
        pointer-events: auto;
        background: rgba(15, 23, 42, 0.85);
        color: #fff;
        border: 1.5px solid rgba(56, 189, 248, 0.55);
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }
      .rh-pacenote-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
      }
      .rh-pacenote-banner {
        background: linear-gradient(135deg, rgba(15, 23, 42, 0.86), rgba(30, 41, 59, 0.86));
        border: 2px solid #facc15;
        color: #fef08a;
        padding: 6px 18px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 900;
        letter-spacing: 1px;
      }
      .rh-progress-track {
        width: 220px;
        height: 8px;
        background: rgba(15, 23, 42, 0.55);
        border-radius: 999px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.35);
      }
      .rh-progress-fill {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #38bdf8, #22c55e);
        transition: width 0.12s linear;
      }
      .rh-callout {
        position: absolute;
        top: 108px;
        left: 50%;
        transform: translateX(-50%) scale(0.9);
        background: rgba(15, 23, 42, 0.88);
        padding: 8px 18px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 900;
        opacity: 0;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      .rh-callout.visible {
        opacity: 1;
        transform: translateX(-50%) scale(1);
      }
      .rh-booster-bar {
        position: absolute;
        bottom: 14px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        pointer-events: auto;
      }
      .rh-booster-btn {
        position: relative;
        background: linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.95));
        border: 2px solid rgba(56, 189, 248, 0.65);
        color: #fff;
        border-radius: 14px;
        padding: 8px 12px;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;
        font-size: 11px;
        font-weight: 800;
      }
      .rh-ad-tag {
        background: #f59e0b;
        color: #0f172a;
        font-size: 9px;
        font-weight: 900;
        padding: 2px 5px;
        border-radius: 5px;
      }
      .rh-modal-layer {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.62);
        backdrop-filter: blur(8px);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 16px;
        pointer-events: auto;
        z-index: 60;
      }
      .rh-modal-layer.active { display: flex; }
      .rh-modal-card {
        background: #ffffff;
        color: #0f172a;
        border-radius: 24px;
        padding: 22px;
        max-width: 380px;
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 12px;
        box-shadow: 0 24px 48px rgba(15, 23, 42, 0.38);
      }
      .rh-modal-badge {
        font-size: 11px;
        font-weight: 900;
        color: #0284c7;
        text-transform: uppercase;
      }
      .rh-modal-title { font-size: 22px; font-weight: 900; }
      .rh-modal-sub { font-size: 13px; color: #475569; }
      .rh-mult-bar {
        position: relative;
        background: #0f172a;
        border-radius: 12px;
        padding: 10px 6px;
        overflow: hidden;
      }
      .rh-mult-zones {
        display: flex;
        justify-content: space-around;
        color: #fff;
        font-size: 12px;
        font-weight: 900;
      }
      .rh-zone-gold { color: #facc15; }
      .rh-zone-max { color: #4ade80; }
      .rh-mult-needle {
        position: absolute;
        top: 2px;
        bottom: 2px;
        width: 4px;
        background: #ef4444;
        border-radius: 2px;
      }
      .rh-cta-btn {
        border: none;
        border-radius: 14px;
        padding: 13px 16px;
        font-size: 14px;
        font-weight: 900;
        cursor: pointer;
      }
      .rh-cta-green {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: #fff;
      }
      .rh-cta-secondary {
        background: #e2e8f0;
        color: #334155;
      }
      .rh-upgrade-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px;
      }
      .rh-upg-btn {
        background: #f1f5f9;
        border: 1.5px solid #cbd5e1;
        border-radius: 10px;
        padding: 8px 4px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
      }
      .rh-skin-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        max-height: 170px;
        overflow-y: auto;
      }
      .rh-skin-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 10px;
        border-radius: 10px;
        border: 1.5px solid #e2e8f0;
        background: #f8fafc;
        cursor: pointer;
        font-size: 12px;
        font-weight: 800;
      }
      .rh-skin-item.selected { border-color: #0284c7; background: #e0f2fe; }
      .rh-skin-swatch { width: 18px; height: 18px; border-radius: 50%; }
    `;
    document.head.appendChild(style);
  }
}
