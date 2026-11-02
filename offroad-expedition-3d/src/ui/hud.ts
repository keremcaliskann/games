import { SoundController } from '../core/audio';
import { ExpeditionTrailManager } from '../game/systems/expedition-trail-manager';
import { InputManager } from '../input/input-manager';
import { UniversalAdProvider } from '../platform/ads';
import { ExpeditionSaveData, PlatformBridge } from '../platform/sdk';
import { CRAWLER_LIVERIES } from '../render/PrefabFactory';

const MULTIPLIER_STOPS = [1.5, 2, 3, 5, 3, 2, 1.5];

export class HudController {
  private readonly trailEl: HTMLElement;
  private readonly clockEl: HTMLElement;
  private readonly statusEl: HTMLElement;
  private readonly rankEl: HTMLElement;
  private readonly coinsEl: HTMLElement;
  private readonly cratesEl: HTMLElement;
  private readonly progressFillEl: HTMLElement;
  private readonly winchBtn: HTMLButtonElement;
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
    private readonly trail: ExpeditionTrailManager,
    private readonly input: InputManager,
    private readonly sdk: PlatformBridge,
    private readonly ads: UniversalAdProvider,
    private readonly audio: SoundController,
    private readonly saveData: ExpeditionSaveData,
    private readonly onRestartTrail: () => void
  ) {
    this.injectStyles();

    this.root.innerHTML = `
      <div class="oe-top-bar">
        <div class="oe-stat-group">
          <div class="oe-pill oe-pill-trail" id="oe-trail">EXPEDITION 1 // PINE MUD CANYON</div>
          <div class="oe-pill oe-pill-clock" id="oe-clock">⏱️ 54.0s</div>
          <div class="oe-pill oe-pill-rank" id="oe-rank">🛻 POS #1/3</div>
        </div>
        <div class="oe-stat-group">
          <div class="oe-pill oe-pill-crates" id="oe-crates">📦 0</div>
          <div class="oe-pill oe-pill-coins" id="oe-coins">🪙 120</div>
          <button class="oe-icon-btn" id="oe-garage-btn" data-hud-interactive="true">🔧 4X4 GARAGE</button>
          <button class="oe-icon-btn" id="oe-mute-btn" data-hud-interactive="true">🔊</button>
        </div>
      </div>

      <div class="oe-center-banner-wrap">
        <div class="oe-status-banner" id="oe-status">⛰️ ROCK TRAIL // 4WD LOW-RANGE</div>
        <div class="oe-progress-track">
          <div class="oe-progress-fill" id="oe-progress-fill"></div>
        </div>
      </div>

      <div class="oe-callout" id="oe-callout"></div>

      <button class="oe-winch-fab" id="oe-winch-fab" data-hud-interactive="true">
        🪝 WINCH CABLE (SPACE / E)
      </button>

      <div class="oe-booster-bar">
        <button class="oe-booster-btn" id="oe-boost-winch" data-hud-interactive="true">
          <span class="oe-ad-tag">🎬 AD</span>
          <span>🪝 SUPER WINCH (10s)</span>
        </button>
        <button class="oe-booster-btn" id="oe-boost-tires" data-hud-interactive="true">
          <span class="oe-ad-tag">🎬 AD</span>
          <span>🛞 MUD TIRES (15s)</span>
        </button>
        <button class="oe-booster-btn" id="oe-boost-difflock" data-hud-interactive="true">
          <span class="oe-ad-tag">🎬 AD</span>
          <span>⚙️ DIFF-LOCK (15s)</span>
        </button>
      </div>

      <div class="oe-modal-layer" id="oe-modal-layer"></div>
    `;

    this.trailEl = this.root.querySelector('#oe-trail') as HTMLElement;
    this.clockEl = this.root.querySelector('#oe-clock') as HTMLElement;
    this.statusEl = this.root.querySelector('#oe-status') as HTMLElement;
    this.rankEl = this.root.querySelector('#oe-rank') as HTMLElement;
    this.coinsEl = this.root.querySelector('#oe-coins') as HTMLElement;
    this.cratesEl = this.root.querySelector('#oe-crates') as HTMLElement;
    this.progressFillEl = this.root.querySelector('#oe-progress-fill') as HTMLElement;
    this.winchBtn = this.root.querySelector('#oe-winch-fab') as HTMLButtonElement;
    this.calloutEl = this.root.querySelector('#oe-callout') as HTMLElement;
    this.modalLayer = this.root.querySelector('#oe-modal-layer') as HTMLElement;
    this.muteBtn = this.root.querySelector('#oe-mute-btn') as HTMLButtonElement;

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

    const garageBtn = this.root.querySelector('#oe-garage-btn') as HTMLButtonElement;
    garageBtn.addEventListener('pointerdown', stopBleed);
    garageBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showGarageModal();
    });

    this.winchBtn.addEventListener('pointerdown', stopBleed);
    this.winchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.input.manualWinchToggle = !this.input.manualWinchToggle;
      if (this.input.manualWinchToggle) {
        this.audio.playWinchFire();
      }
      this.refreshHud();
    });

    const bindBooster = (
      selector: string,
      placement: string,
      type: 'winch' | 'tires' | 'difflock'
    ) => {
      const btn = this.root.querySelector(selector) as HTMLButtonElement;
      btn.addEventListener('pointerdown', stopBleed);
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const rewarded = await this.ads.showRewarded(placement);
        if (rewarded) {
          this.trail.activateBooster(type);
        }
      });
    };

    bindBooster('#oe-boost-winch', 'booster_winch', 'winch');
    bindBooster('#oe-boost-tires', 'booster_tires', 'tires');
    bindBooster('#oe-boost-difflock', 'booster_difflock', 'difflock');
  }

  public refreshHud(): void {
    const rank = this.trail.getPlayerRank();
    const pct = Math.round(this.trail.getProgressRatio() * 100);

    this.trailEl.textContent = `TRAIL ${this.trail.trailNumber} // ${this.trail.currentBiome.name}`;
    this.clockEl.textContent = `⏱️ ${this.trail.remainingSec.toFixed(1)}s`;
    this.rankEl.textContent = `🛻 POS #${rank}/3 (${pct}%)`;
    this.coinsEl.textContent = `🪙 ${this.saveData.coins}`;
    this.cratesEl.textContent = `📦 ${this.saveData.cratesDelivered}`;
    this.statusEl.textContent = this.trail.terrainStatusLabel;
    this.progressFillEl.style.width = `${pct}%`;

    this.winchBtn.classList.toggle(
      'active',
      this.input.manualWinchToggle || this.trail.isWinchPulling
    );
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
      const needle = this.modalLayer.querySelector('#oe-mult-needle') as HTMLElement | null;
      const claimBtn = this.modalLayer.querySelector('#oe-claim-mult-btn') as HTMLElement | null;
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
      <div class="oe-modal-card" data-hud-interactive="true">
        <div class="oe-modal-badge">⚠️ TRUCK STALLED AT ${progressPct}% OF TRAIL!</div>
        <h2 class="oe-modal-title">SO CLOSE TO BASE CAMP!</h2>
        <p class="oe-modal-sub">Watch a short Rewarded Ad to <b>Auto-Right Your 4x4</b> with <b>+18s Fuel Time, Super-Winch &amp; Diff-Lock</b>!</p>
        <button class="oe-cta-btn oe-cta-green" id="oe-revive-ad-btn" data-hud-interactive="true">
          🎬 AUTO-RIGHT + SUPER-WINCH
        </button>
        <button class="oe-cta-btn oe-cta-secondary" id="oe-revive-skip-btn" data-hud-interactive="true">
          Restart Expedition
        </button>
      </div>
    `;

    this.modalLayer.querySelector('#oe-revive-ad-btn')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      const ok = await this.ads.showRewarded('revive_crawler');
      if (ok) {
        this.closeModal();
        this.trail.reviveCrawlerWithWinch();
      }
    });

    this.modalLayer.querySelector('#oe-revive-skip-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeModal();
      this.onRestartTrail();
    });
  }

  public showVictoryModal(
    rank: number,
    cargoIntegrity: number,
    baseCoins: number
  ): void {
    this.isVictoryOpen = true;
    this.pendingVictoryBaseCoins = baseCoins;

    this.saveData.cratesDelivered += 1;
    this.saveData.trailNumber += 1;
    this.sdk.sendScore(this.saveData.cratesDelivered * 200);
    void this.sdk.saveData(this.saveData);

    this.modalLayer.classList.add('active');
    this.modalLayer.innerHTML = `
      <div class="oe-modal-card" data-hud-interactive="true">
        <div class="oe-modal-badge">📦 CARGO DELIVERED TO BASE CAMP!</div>
        <h2 class="oe-modal-title">RANK #${rank} // ${cargoIntegrity}% INTACT</h2>
        <p class="oe-modal-sub">Expedition Payout: <b>+${baseCoins} 🪙</b></p>

        <div class="oe-mult-bar">
          <div class="oe-mult-zones">
            <span>1.5x</span><span>2x</span><span class="oe-zone-gold">3x</span><span class="oe-zone-max">5x</span><span class="oe-zone-gold">3x</span><span>2x</span><span>1.5x</span>
          </div>
          <div class="oe-mult-needle" id="oe-mult-needle"></div>
        </div>

        <button class="oe-cta-btn oe-cta-green" id="oe-claim-mult-btn" data-hud-interactive="true">
          🎬 CLAIM 3x REWARD (+${baseCoins * 3} 🪙)
        </button>
        <button class="oe-cta-btn oe-cta-secondary" id="oe-claim-base-btn" data-hud-interactive="true">
          Next Trail (+${baseCoins} 🪙)
        </button>
      </div>
    `;

    this.modalLayer.querySelector('#oe-claim-mult-btn')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      const lockedMult = this.currentMultiplier;
      const ok = await this.ads.showRewarded('victory_multiplier');
      const earned = ok ? Math.round(baseCoins * lockedMult) : baseCoins;
      this.saveData.coins += earned;
      void this.sdk.saveData(this.saveData);
      this.closeModal();
      this.onRestartTrail();
    });

    this.modalLayer.querySelector('#oe-claim-base-btn')?.addEventListener('click', async (e) => {
      e.stopPropagation();
      this.saveData.coins += baseCoins;
      void this.sdk.saveData(this.saveData);
      await this.ads.showInterstitial('trail_complete');
      this.closeModal();
      this.onRestartTrail();
    });
  }

  public showGarageModal(): void {
    const axleCost = this.saveData.axleLiftLevel * 90;
    const winchCost = this.saveData.winchPowerLevel * 90;
    const tireCost = this.saveData.mudTireLevel * 90;

    const skinsHtml = CRAWLER_LIVERIES.map((skin) => {
      const unlocked = this.saveData.unlockedSkins.includes(skin.id);
      const selected = this.saveData.selectedSkin === skin.id;
      const hexStr = '#' + skin.baseHex.toString(16).padStart(6, '0');
      return `
        <button class="oe-skin-item ${selected ? 'selected' : ''}" data-skin-id="${skin.id}" data-hud-interactive="true">
          <span class="oe-skin-swatch" style="background:${hexStr}"></span>
          <span>${skin.name}</span>
          <span>${selected ? 'EQUIPPED' : unlocked ? 'SELECT' : `🪙 ${skin.price}`}</span>
        </button>
      `;
    }).join('');

    this.modalLayer.classList.add('active');
    this.modalLayer.innerHTML = `
      <div class="oe-modal-card" data-hud-interactive="true">
        <div class="oe-modal-badge">🔧 4X4 EXPEDITION GARAGE // 🪙 ${this.saveData.coins}</div>
        <h2 class="oe-modal-title">TRUCKS &amp; RIG UPGRADES</h2>
        <div class="oe-upgrade-grid">
          <button class="oe-upg-btn" id="oe-upg-axle" data-hud-interactive="true">
            🔩 AXLE LIFT LV.${this.saveData.axleLiftLevel}<br/><span>🪙 ${axleCost}</span>
          </button>
          <button class="oe-upg-btn" id="oe-upg-winch" data-hud-interactive="true">
            🪝 WINCH LV.${this.saveData.winchPowerLevel}<br/><span>🪙 ${winchCost}</span>
          </button>
          <button class="oe-upg-btn" id="oe-upg-tire" data-hud-interactive="true">
            🛞 MUD TIRES LV.${this.saveData.mudTireLevel}<br/><span>🪙 ${tireCost}</span>
          </button>
        </div>
        <div class="oe-skin-list">${skinsHtml}</div>
        <button class="oe-cta-btn oe-cta-secondary" id="oe-garage-close" data-hud-interactive="true">BACK TO TRAIL</button>
      </div>
    `;

    this.modalLayer.querySelector('#oe-garage-close')?.addEventListener('click', (e) => {
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

    bindUpgrade('#oe-upg-axle', axleCost, () => this.saveData.axleLiftLevel++);
    bindUpgrade('#oe-upg-winch', winchCost, () => this.saveData.winchPowerLevel++);
    bindUpgrade('#oe-upg-tire', tireCost, () => this.saveData.mudTireLevel++);

    this.modalLayer.querySelectorAll<HTMLButtonElement>('.oe-skin-item').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = Number(btn.getAttribute('data-skin-id'));
        const skin = CRAWLER_LIVERIES.find((s) => s.id === id);
        if (!skin) return;
        if (this.saveData.unlockedSkins.includes(id)) {
          this.saveData.selectedSkin = id;
        } else if (this.saveData.coins >= skin.price) {
          this.saveData.coins -= skin.price;
          this.saveData.unlockedSkins.push(id);
          this.saveData.selectedSkin = id;
        }
        void this.sdk.saveData(this.saveData);
        this.onRestartTrail();
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
    if (document.getElementById('oe-hud-styles')) return;
    const style = document.createElement('style');
    style.id = 'oe-hud-styles';
    style.textContent = `
      .oe-top-bar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px 62px 8px 14px;
      }
      .oe-stat-group {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        align-items: center;
      }
      .oe-pill {
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(8px);
        color: #f8fafc;
        border: 1.5px solid rgba(255, 255, 255, 0.25);
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 800;
      }
      .oe-pill-clock { color: #fde047; }
      .oe-icon-btn {
        pointer-events: auto;
        background: rgba(15, 23, 42, 0.85);
        color: #fff;
        border: 1.5px solid rgba(245, 158, 11, 0.6);
        border-radius: 999px;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
      }
      .oe-center-banner-wrap {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
      }
      .oe-status-banner {
        background: rgba(15, 23, 42, 0.86);
        border: 2px solid #f59e0b;
        color: #fef08a;
        padding: 6px 16px;
        border-radius: 12px;
        font-size: 13px;
        font-weight: 900;
      }
      .oe-progress-track {
        width: 220px;
        height: 8px;
        background: rgba(15, 23, 42, 0.55);
        border-radius: 999px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.35);
      }
      .oe-progress-fill {
        width: 0%;
        height: 100%;
        background: linear-gradient(90deg, #f59e0b, #22c55e);
      }
      .oe-winch-fab {
        position: absolute;
        right: 16px;
        bottom: 68px;
        pointer-events: auto;
        background: linear-gradient(135deg, #0284c7, #2563eb);
        color: #fff;
        border: 2px solid #7dd3fc;
        border-radius: 16px;
        padding: 11px 16px;
        font-size: 12px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 8px 20px rgba(2, 132, 199, 0.38);
      }
      .oe-winch-fab.active {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        border-color: #bbf7d0;
      }
      .oe-callout {
        position: absolute;
        top: 108px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.88);
        padding: 8px 18px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 900;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      .oe-callout.visible { opacity: 1; }
      .oe-booster-bar {
        position: absolute;
        bottom: 14px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        pointer-events: auto;
      }
      .oe-booster-btn {
        background: rgba(15, 23, 42, 0.92);
        border: 2px solid rgba(245, 158, 11, 0.7);
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
      .oe-ad-tag {
        background: #f59e0b;
        color: #0f172a;
        font-size: 9px;
        font-weight: 900;
        padding: 2px 5px;
        border-radius: 5px;
      }
      .oe-modal-layer {
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
      .oe-modal-layer.active { display: flex; }
      .oe-modal-card {
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
      }
      .oe-modal-badge { font-size: 11px; font-weight: 900; color: #d97706; }
      .oe-modal-title { font-size: 22px; font-weight: 900; }
      .oe-modal-sub { font-size: 13px; color: #475569; }
      .oe-mult-bar {
        position: relative;
        background: #0f172a;
        border-radius: 12px;
        padding: 10px 6px;
        overflow: hidden;
      }
      .oe-mult-zones {
        display: flex;
        justify-content: space-around;
        color: #fff;
        font-size: 12px;
        font-weight: 900;
      }
      .oe-zone-gold { color: #facc15; }
      .oe-zone-max { color: #4ade80; }
      .oe-mult-needle {
        position: absolute;
        top: 2px;
        bottom: 2px;
        width: 4px;
        background: #ef4444;
      }
      .oe-cta-btn {
        border: none;
        border-radius: 14px;
        padding: 13px 16px;
        font-size: 14px;
        font-weight: 900;
        cursor: pointer;
      }
      .oe-cta-green { background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; }
      .oe-cta-secondary { background: #e2e8f0; color: #334155; }
      .oe-upgrade-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; }
      .oe-upg-btn {
        background: #f1f5f9;
        border: 1.5px solid #cbd5e1;
        border-radius: 10px;
        padding: 8px 4px;
        font-size: 11px;
        font-weight: 800;
        cursor: pointer;
      }
      .oe-skin-list { display: flex; flex-direction: column; gap: 6px; max-height: 170px; overflow-y: auto; }
      .oe-skin-item {
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
      .oe-skin-item.selected { border-color: #d97706; background: #fef3c7; }
      .oe-skin-swatch { width: 18px; height: 18px; border-radius: 50%; }
    `;
    document.head.appendChild(style);
  }
}
