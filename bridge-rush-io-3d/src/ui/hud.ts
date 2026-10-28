import { SoundController } from '../core/audio';
import { BridgeRaceManager } from '../game/systems/bridge-race-manager';
import { UniversalAdProvider } from '../platform/ads';
import { BridgeRaceSaveData, PlatformBridge } from '../platform/sdk';
import { BUILDER_SKINS } from '../render/PrefabFactory';

const MULTIPLIER_SLOTS = [1.5, 2, 3, 5, 3, 2, 1.5];

export class HudController {
  private readonly topBar: HTMLElement;
  private readonly leaderboardEl: HTMLElement;
  private readonly calloutEl: HTMLElement;
  private readonly bottomBar: HTMLElement;
  private readonly modalOverlay: HTMLElement;
  private readonly garageOverlay: HTMLElement;

  private calloutTimer = 0;
  private needlePhase = 0;
  private activeMultiplier = 2;
  private modalAnimating = false;
  private actionLocked = false;

  constructor(
    root: HTMLElement,
    private readonly race: BridgeRaceManager,
    private readonly sdk: PlatformBridge,
    private readonly ads: UniversalAdProvider,
    private readonly audio: SoundController,
    private saveData: BridgeRaceSaveData,
    private readonly onStartNextRace: () => void
  ) {
    root.innerHTML = `
      <style>
        .br-top-bar {
          position: absolute;
          top: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          pointer-events: none;
        }
        .br-pill {
          background: rgba(15, 23, 42, 0.84);
          backdrop-filter: blur(8px);
          color: #f8fafc;
          padding: 7px 13px;
          border-radius: 999px;
          font-weight: 800;
          font-size: 13px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);
        }
        .br-btn-pill {
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.12s ease;
        }
        .br-btn-pill:active {
          transform: scale(0.94);
        }
        .br-leaderboard {
          position: absolute;
          top: 58px;
          right: 12px;
          background: rgba(15, 23, 42, 0.78);
          backdrop-filter: blur(6px);
          border-radius: 14px;
          padding: 8px 12px;
          color: #f8fafc;
          font-size: 11px;
          font-weight: 700;
          min-width: 148px;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }
        .br-lb-row {
          display: flex;
          justify-content: space-between;
          padding: 2px 0;
        }
        .br-callout {
          position: absolute;
          top: 108px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.9);
          padding: 8px 18px;
          border-radius: 999px;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.4px;
          opacity: 0;
          transition: opacity 0.2s ease;
          text-align: center;
          white-space: nowrap;
          border: 2px solid rgba(250, 204, 21, 0.5);
        }
        .br-bottom-bar {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          pointer-events: auto;
        }
        .br-booster-btn {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: #ffffff;
          border: 2px solid rgba(56, 189, 248, 0.55);
          border-radius: 14px;
          padding: 8px 12px;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          min-width: 96px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.24);
        }
        .br-booster-btn:active {
          transform: scale(0.95);
        }
        .br-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.78);
          backdrop-filter: blur(8px);
          display: none;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          z-index: 40;
          padding: 16px;
        }
        .br-modal-card {
          background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
          border: 2px solid rgba(250, 204, 21, 0.45);
          border-radius: 22px;
          padding: 22px;
          width: 100%;
          max-width: 370px;
          color: #f8fafc;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        .br-mult-bar {
          display: flex;
          justify-content: space-between;
          background: #090d16;
          border-radius: 10px;
          padding: 6px;
          margin: 12px 0;
          position: relative;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .br-mult-slot {
          flex: 1;
          padding: 6px 0;
          font-weight: 900;
          font-size: 12px;
          border-radius: 6px;
          color: #94a3b8;
        }
        .br-mult-slot.active {
          background: #facc15;
          color: #0f172a;
        }
        .br-cta-btn {
          width: 100%;
          padding: 12px;
          border-radius: 14px;
          border: none;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          margin-top: 8px;
        }
        .br-skin-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin: 10px 0;
          max-height: 170px;
          overflow-y: auto;
        }
        .br-skin-item {
          background: rgba(30, 41, 59, 0.9);
          border: 2px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 8px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
          color: #f8fafc;
        }
        .br-skin-item.selected {
          border-color: #4ade80;
          background: rgba(22, 101, 52, 0.45);
        }
      </style>

      <div class="br-top-bar">
        <div class="br-pill" id="br-status-pill">🏝️ RACE #1 · TIER 1/3 · 🧱 4</div>
        <div style="display:flex; gap:6px;">
          <button class="br-pill br-btn-pill" id="br-garage-btn" data-hud-interactive="true">🛠️ GARAGE</button>
          <div class="br-pill" id="br-coin-pill">🪙 120</div>
          <button class="br-pill br-btn-pill" id="br-mute-btn" data-hud-interactive="true">🔊</button>
        </div>
      </div>

      <div class="br-leaderboard" id="br-leaderboard"></div>
      <div class="br-callout" id="br-callout"></div>

      <div class="br-bottom-bar" id="br-bottom-bar" data-hud-interactive="true">
        <button class="br-booster-btn" id="br-boost-bricks" data-hud-interactive="true">
          <span>🧱 +25 BRICKS</span>
          <span style="color:#facc15;font-size:10px;">40 🪙 / 📺 FREE</span>
        </button>
        <button class="br-booster-btn" id="br-boost-magnet" data-hud-interactive="true">
          <span>🛹 MAGNET BOARD</span>
          <span style="color:#4ade80;font-size:10px;">45 🪙 / 📺 FREE</span>
        </button>
        <button class="br-booster-btn" id="br-boost-shield" data-hud-interactive="true">
          <span>🛡️ TITAN SHIELD</span>
          <span style="color:#38bdf8;font-size:10px;">50 🪙 / 📺 FREE</span>
        </button>
      </div>

      <div class="br-modal-overlay" id="br-modal-overlay" data-hud-interactive="true"></div>
      <div class="br-modal-overlay" id="br-garage-overlay" data-hud-interactive="true"></div>
    `;

    this.topBar = root.querySelector('#br-status-pill') as HTMLElement;
    this.leaderboardEl = root.querySelector('#br-leaderboard') as HTMLElement;
    this.calloutEl = root.querySelector('#br-callout') as HTMLElement;
    this.bottomBar = root.querySelector('#br-bottom-bar') as HTMLElement;
    this.modalOverlay = root.querySelector('#br-modal-overlay') as HTMLElement;
    this.garageOverlay = root.querySelector('#br-garage-overlay') as HTMLElement;

    const muteBtn = root.querySelector('#br-mute-btn') as HTMLButtonElement;
    muteBtn.addEventListener('click', () => {
      const enabled = this.audio.toggleUserMute();
      muteBtn.textContent = enabled ? '🔊' : '🔇';
    });

    const garageBtn = root.querySelector('#br-garage-btn') as HTMLButtonElement;
    garageBtn.addEventListener('click', () => this.openGarageModal());

    root
      .querySelector('#br-boost-bricks')
      ?.addEventListener('click', () => this.handleBoosterClick('bricks', 40));
    root
      .querySelector('#br-boost-magnet')
      ?.addEventListener('click', () => this.handleBoosterClick('magnet', 45));
    root
      .querySelector('#br-boost-shield')
      ?.addEventListener('click', () => this.handleBoosterClick('shield', 50));

    this.refreshHud();
  }

  private async handleBoosterClick(
    type: 'bricks' | 'magnet' | 'shield',
    cost: number
  ): Promise<void> {
    if (this.actionLocked || this.race.matchEnded) return;
    if (this.saveData.coins >= cost) {
      this.saveData.coins -= cost;
      void this.sdk.saveData({ coins: this.saveData.coins });
      this.race.activateBooster(type);
      this.refreshHud();
      return;
    }

    this.actionLocked = true;
    const rewarded = await this.ads.showRewarded(`booster_${type}`);
    this.actionLocked = false;
    if (rewarded) {
      this.race.activateBooster(type);
      this.refreshHud();
    }
  }

  public showCallout(text: string, color: string): void {
    this.calloutEl.textContent = text;
    this.calloutEl.style.color = color;
    this.calloutEl.style.opacity = '1';
    this.calloutTimer = 2.0;
  }

  public refreshHud(): void {
    const p = this.race.player;
    const tier = p ? p.currentTier : 1;
    const bricks = p ? p.brickCount : 0;
    const rank = this.race.getPlayerRank();
    this.topBar.textContent = `🏝️ RACE #${this.saveData.level} · TIER ${tier}/3 · 🧱 ${bricks} · #${rank}/12`;

    const coinEl = document.getElementById('br-coin-pill');
    if (coinEl) {
      coinEl.textContent = `🪙 ${this.saveData.coins}`;
    }

    // Top 4 Leaderboard by Z progress
    const sorted = [...this.race.runners].sort((a, b) => b.pos.z - a.pos.z);
    let lbHtml = `<div style="color:#facc15;margin-bottom:4px;font-weight:900;">🏆 LIVE RACE STANDINGS</div>`;
    for (let i = 0; i < Math.min(4, sorted.length); i++) {
      const r = sorted[i];
      const highlight = r.isPlayer ? 'color:#4ade80;font-weight:900;' : 'color:#e2e8f0;';
      lbHtml += `<div class="br-lb-row" style="${highlight}">
        <span>#${i + 1} ${r.name}</span>
        <span>🧱 ${r.brickCount}</span>
      </div>`;
    }
    this.leaderboardEl.innerHTML = lbHtml;
  }

  public showNearMissReviveModal(rivalName: string): void {
    if (this.race.reviveUsedThisMatch) {
      this.showDefeatSummaryModal(rivalName);
      return;
    }

    this.modalOverlay.style.display = 'flex';
    this.modalOverlay.innerHTML = `
      <div class="br-modal-card">
        <div style="font-size:12px;color:#f87171;font-weight:900;">⚠️ SO CLOSE! RIVAL AT THE PODIUM!</div>
        <h2 style="margin:6px 0 8px;font-size:22px;">${rivalName} TOOK #1!</h2>
        <p style="font-size:13px;color:#cbd5e1;margin:0 0 14px;">
          Rewind rivals back to Tier 3 and get <b>+30 Instant Bricks + Hoverboard</b> to win the Trophy!
        </p>
        <button class="br-cta-btn" id="br-revive-ad-btn" style="background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;">
          📺 WATCH AD: REWIND & +30 BRICKS
        </button>
        <button class="br-cta-btn" id="br-revive-skip-btn" style="background:#334155;color:#cbd5e1;">
          GIVE UP & RETRY RACE
        </button>
      </div>
    `;

    this.modalOverlay.querySelector('#br-revive-ad-btn')?.addEventListener('click', async () => {
      if (this.actionLocked) return;
      this.actionLocked = true;
      const rewarded = await this.ads.showRewarded('revive_bridge_race');
      this.actionLocked = false;
      if (rewarded) {
        this.modalOverlay.style.display = 'none';
        this.race.reviveAndRewindRivals();
      }
    });

    this.modalOverlay.querySelector('#br-revive-skip-btn')?.addEventListener('click', () => {
      this.modalOverlay.style.display = 'none';
      this.onStartNextRace();
    });
  }

  private showDefeatSummaryModal(rivalName: string): void {
    const consolation = 25;
    this.saveData.coins += consolation;
    this.sdk.saveData({ coins: this.saveData.coins });

    this.modalOverlay.style.display = 'flex';
    this.modalOverlay.innerHTML = `
      <div class="br-modal-card">
        <div style="font-size:12px;color:#f87171;font-weight:900;">RACE FINISHED</div>
        <h2 style="margin:6px 0 8px;font-size:22px;">${rivalName} WON!</h2>
        <p style="font-size:13px;color:#cbd5e1;margin:0 0 14px;">Consolation Reward: <b>+${consolation} 🪙</b></p>
        <button class="br-cta-btn" id="br-retry-btn" style="background:linear-gradient(135deg,#38bdf8,#2563eb);color:#fff;">
          🔄 PLAY AGAIN
        </button>
      </div>
    `;

    this.modalOverlay.querySelector('#br-retry-btn')?.addEventListener('click', () => {
      this.modalOverlay.style.display = 'none';
      this.onStartNextRace();
    });
  }

  public showVictoryModal(rank: number, baseCoins: number, stepsBuilt: number): void {
    this.modalAnimating = true;
    this.saveData.level += 1;
    this.saveData.wins += 1;
    this.sdk.sendScore(this.saveData.wins * 100 + stepsBuilt);

    this.modalOverlay.style.display = 'flex';
    this.modalOverlay.innerHTML = `
      <div class="br-modal-card">
        <div style="font-size:12px;color:#facc15;font-weight:900;">🏆 #${rank} ISLAND BRIDGE CHAMPION!</div>
        <h2 style="margin:6px 0 4px;font-size:24px;">VICTORY!</h2>
        <p style="font-size:12px;color:#cbd5e1;margin:0 0 10px;">
          Stairs Built: <b>${stepsBuilt}</b> · Base Prize: <b>+${baseCoins} 🪙</b>
        </p>

        <div class="br-mult-bar" id="br-mult-bar">
          ${MULTIPLIER_SLOTS.map((m, idx) => `<div class="br-mult-slot" data-idx="${idx}">${m}x</div>`).join('')}
        </div>

        <button class="br-cta-btn" id="br-claim-mult-btn" style="background:linear-gradient(135deg,#facc15,#eab308);color:#0f172a;">
          📺 CLAIM 3x (${baseCoins * 3} 🪙)
        </button>
        <button class="br-cta-btn" id="br-claim-normal-btn" style="background:#334155;color:#e2e8f0;">
          CLAIM +${baseCoins} 🪙 & NEXT ISLAND
        </button>
      </div>
    `;

    const multBtn = this.modalOverlay.querySelector('#br-claim-mult-btn') as HTMLButtonElement;
    multBtn?.addEventListener('click', async () => {
      if (this.actionLocked) return;
      this.actionLocked = true;
      this.modalAnimating = false;
      const mult = this.activeMultiplier;
      const rewarded = await this.ads.showRewarded('victory_multiplier');
      this.actionLocked = false;
      if (rewarded) {
        this.saveData.coins += Math.round(baseCoins * mult);
        void this.sdk.saveData({
          level: this.saveData.level,
          wins: this.saveData.wins,
          coins: this.saveData.coins,
        });
        this.modalOverlay.style.display = 'none';
        this.refreshHud();
        this.onStartNextRace();
      }
    });

    this.modalOverlay.querySelector('#br-claim-normal-btn')?.addEventListener('click', () => {
      if (this.actionLocked) return;
      this.modalAnimating = false;
      this.saveData.coins += baseCoins;
      this.sdk.saveData({
        level: this.saveData.level,
        wins: this.saveData.wins,
        coins: this.saveData.coins,
      });
      this.modalOverlay.style.display = 'none';
      this.refreshHud();
      this.onStartNextRace();
    });
  }

  public openGarageModal(): void {
    this.garageOverlay.style.display = 'flex';
    const speedCost = this.saveData.speedUpgradeLevel * 90;
    const magnetCost = this.saveData.magnetUpgradeLevel * 95;
    const buildCost = this.saveData.buildSpeedUpgradeLevel * 100;

    this.garageOverlay.innerHTML = `
      <div class="br-modal-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;font-size:18px;">🛠️ ARCHITECT GARAGE & LAB</h3>
          <span style="color:#facc15;font-weight:900;font-size:13px;">🪙 ${this.saveData.coins}</span>
        </div>

        <div class="br-skin-grid">
          ${BUILDER_SKINS.map((s) => {
            const owned = this.saveData.unlockedSkins.includes(s.id);
            const selected = this.saveData.selectedSkin === s.id;
            return `
              <div class="br-skin-item ${selected ? 'selected' : ''}" data-skin-id="${s.id}">
                <div style="width:18px;height:18px;border-radius:50%;background:#${s.teamColorHex.toString(16).padStart(6, '0')};margin:0 auto 4px;"></div>
                <div>${s.name}</div>
                <div style="color:${owned ? '#4ade80' : '#facc15'};font-size:10px;">
                  ${selected ? 'EQUIPPED' : owned ? 'SELECT' : `${s.price} 🪙`}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
          <button class="br-cta-btn" id="br-upg-speed" style="margin:0;padding:9px;background:#1e293b;color:#fff;border:1px solid #38bdf8;font-size:12px;">
            ⚡ SPRINT SPEED LV.${this.saveData.speedUpgradeLevel} (${speedCost} 🪙)
          </button>
          <button class="br-cta-btn" id="br-upg-magnet" style="margin:0;padding:9px;background:#1e293b;color:#fff;border:1px solid #4ade80;font-size:12px;">
            🧲 MAGNET REACH LV.${this.saveData.magnetUpgradeLevel} (${magnetCost} 🪙)
          </button>
          <button class="br-cta-btn" id="br-upg-build" style="margin:0;padding:9px;background:#1e293b;color:#fff;border:1px solid #facc15;font-size:12px;">
            🧱 BUILD SPEED LV.${this.saveData.buildSpeedUpgradeLevel} (${buildCost} 🪙)
          </button>
          <button class="br-cta-btn" id="br-garage-ad-coins" style="margin:0;padding:9px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:12px;">
            📺 WATCH AD FOR +350 COINS
          </button>
          <button class="br-cta-btn" id="br-garage-close" style="margin:0;padding:9px;background:#334155;color:#f8fafc;font-size:12px;">
            CLOSE GARAGE
          </button>
        </div>
      </div>
    `;

    this.garageOverlay.querySelectorAll('.br-skin-item').forEach((el) => {
      el.addEventListener('click', () => {
        const skinId = Number((el as HTMLElement).dataset.skinId);
        const spec = BUILDER_SKINS[skinId];
        if (!spec) return;
        if (this.saveData.unlockedSkins.includes(skinId)) {
          this.saveData.selectedSkin = skinId;
          this.sdk.saveData({ selectedSkin: skinId });
          this.race.player?.applySkin(skinId);
          this.openGarageModal();
        } else if (this.saveData.coins >= spec.price) {
          this.saveData.coins -= spec.price;
          this.saveData.unlockedSkins.push(skinId);
          this.saveData.selectedSkin = skinId;
          this.sdk.saveData({
            coins: this.saveData.coins,
            unlockedSkins: this.saveData.unlockedSkins,
            selectedSkin: skinId,
          });
          this.race.player?.applySkin(skinId);
          this.refreshHud();
          this.openGarageModal();
        }
      });
    });

    this.garageOverlay.querySelector('#br-upg-speed')?.addEventListener('click', () => {
      if (this.saveData.coins >= speedCost) {
        this.saveData.coins -= speedCost;
        this.saveData.speedUpgradeLevel++;
        this.sdk.saveData({
          coins: this.saveData.coins,
          speedUpgradeLevel: this.saveData.speedUpgradeLevel,
        });
        if (this.race.player) {
          this.race.player.speedUpgradeMult = 1.0 + (this.saveData.speedUpgradeLevel - 1) * 0.05;
        }
        this.refreshHud();
        this.openGarageModal();
      }
    });

    this.garageOverlay.querySelector('#br-upg-magnet')?.addEventListener('click', () => {
      if (this.saveData.coins >= magnetCost) {
        this.saveData.coins -= magnetCost;
        this.saveData.magnetUpgradeLevel++;
        this.sdk.saveData({
          coins: this.saveData.coins,
          magnetUpgradeLevel: this.saveData.magnetUpgradeLevel,
        });
        if (this.race.player) {
          this.race.player.magnetBonusRadius = (this.saveData.magnetUpgradeLevel - 1) * 0.45;
        }
        this.refreshHud();
        this.openGarageModal();
      }
    });

    this.garageOverlay.querySelector('#br-upg-build')?.addEventListener('click', () => {
      if (this.saveData.coins >= buildCost) {
        this.saveData.coins -= buildCost;
        this.saveData.buildSpeedUpgradeLevel++;
        this.sdk.saveData({
          coins: this.saveData.coins,
          buildSpeedUpgradeLevel: this.saveData.buildSpeedUpgradeLevel,
        });
        if (this.race.player) {
          this.race.player.buildSpeedMult = 1.0 + (this.saveData.buildSpeedUpgradeLevel - 1) * 0.08;
        }
        this.refreshHud();
        this.openGarageModal();
      }
    });

    this.garageOverlay
      .querySelector('#br-garage-ad-coins')
      ?.addEventListener('click', async () => {
        if (this.actionLocked) return;
        this.actionLocked = true;
        const rewarded = await this.ads.showRewarded('garage_bonus_coins');
        this.actionLocked = false;
        if (rewarded) {
          this.saveData.coins += 350;
          void this.sdk.saveData({ coins: this.saveData.coins });
          this.refreshHud();
          this.openGarageModal();
        }
      });

    this.garageOverlay.querySelector('#br-garage-close')?.addEventListener('click', () => {
      this.garageOverlay.style.display = 'none';
    });
  }

  public update(dt: number): void {
    if (this.calloutTimer > 0) {
      this.calloutTimer -= dt;
      if (this.calloutTimer <= 0) {
        this.calloutEl.style.opacity = '0';
      }
    }

    if (this.modalAnimating) {
      this.needlePhase += dt * 3.8;
      const idx = Math.floor(((Math.sin(this.needlePhase) + 1) * 0.5) * MULTIPLIER_SLOTS.length) %
        MULTIPLIER_SLOTS.length;
      this.activeMultiplier = MULTIPLIER_SLOTS[idx];

      const slots = this.modalOverlay.querySelectorAll('.br-mult-slot');
      for (let i = 0; i < slots.length; i++) {
        slots[i].classList.toggle('active', i === idx);
      }
    }
  }
}
