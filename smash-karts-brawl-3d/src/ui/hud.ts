import { SoundController } from '../core/audio';
import { BrawlArenaManager } from '../game/systems/brawl-arena-manager';
import { UniversalAdProvider } from '../platform/ads';
import { PlatformBridge, SmashKartsSaveData } from '../platform/sdk';
import { KART_SKINS } from '../render/PrefabFactory';

const MULTIPLIER_SLOTS = [1.5, 2, 3, 5, 3, 2, 1.5];

export class HudController {
  private readonly topBar: HTMLElement;
  private readonly leaderboardEl: HTMLElement;
  private readonly calloutEl: HTMLElement;
  private readonly modalOverlay: HTMLElement;
  private readonly garageOverlay: HTMLElement;

  private calloutTimer = 0;
  private needlePhase = 0;
  private activeMultiplier = 2;
  private modalAnimating = false;
  private actionLocked = false;

  constructor(
    root: HTMLElement,
    private readonly arena: BrawlArenaManager,
    private readonly sdk: PlatformBridge,
    private readonly ads: UniversalAdProvider,
    private readonly audio: SoundController,
    private saveData: SmashKartsSaveData,
    private readonly onStartNextMatch: () => void
  ) {
    root.innerHTML = `
      <style>
        .sk-top-bar {
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
        .sk-pill {
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
        .sk-btn-pill {
          pointer-events: auto;
          cursor: pointer;
          transition: transform 0.12s ease;
        }
        .sk-btn-pill:active {
          transform: scale(0.94);
        }
        .sk-leaderboard {
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
          min-width: 154px;
          border: 1px solid rgba(255, 255, 255, 0.14);
        }
        .sk-lb-row {
          display: flex;
          justify-content: space-between;
          padding: 2px 0;
        }
        .sk-callout {
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
        .sk-bottom-bar {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          pointer-events: auto;
        }
        .sk-booster-btn {
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
          min-width: 98px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.24);
        }
        .sk-booster-btn:active {
          transform: scale(0.95);
        }
        .sk-modal-overlay {
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
        .sk-modal-card {
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
        .sk-mult-bar {
          display: flex;
          justify-content: space-between;
          background: #090d16;
          border-radius: 10px;
          padding: 6px;
          margin: 12px 0;
          position: relative;
          border: 1px solid rgba(255,255,255,0.12);
        }
        .sk-mult-slot {
          flex: 1;
          padding: 6px 0;
          font-weight: 900;
          font-size: 12px;
          border-radius: 6px;
          color: #94a3b8;
        }
        .sk-mult-slot.active {
          background: #facc15;
          color: #0f172a;
        }
        .sk-cta-btn {
          width: 100%;
          padding: 12px;
          border-radius: 14px;
          border: none;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          margin-top: 8px;
        }
        .sk-skin-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
          margin: 10px 0;
          max-height: 170px;
          overflow-y: auto;
        }
        .sk-skin-item {
          background: rgba(30, 41, 59, 0.9);
          border: 2px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 8px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
          color: #f8fafc;
        }
        .sk-skin-item.selected {
          border-color: #4ade80;
          background: rgba(22, 101, 52, 0.45);
        }
      </style>

      <div class="sk-top-bar">
        <div class="sk-pill" id="sk-status-pill">🏎️ ARENA #1 · ❤️ 100/100 · 🚀 3 · ALIVE 12/12</div>
        <div style="display:flex; gap:6px;">
          <button class="sk-pill sk-btn-pill" id="sk-garage-btn" data-hud-interactive="true">🛠️ GARAGE</button>
          <div class="sk-pill" id="sk-coin-pill">🪙 150</div>
          <button class="sk-pill sk-btn-pill" id="sk-mute-btn" data-hud-interactive="true">🔊</button>
        </div>
      </div>

      <div class="sk-leaderboard" id="sk-leaderboard"></div>
      <div class="sk-callout" id="sk-callout"></div>

      <div class="sk-bottom-bar" id="sk-bottom-bar" data-hud-interactive="true">
        <button class="sk-booster-btn" id="sk-boost-mecha" data-hud-interactive="true">
          <span>🤖 MECHA TANK</span>
          <span style="color:#facc15;font-size:10px;">45 🪙 / 📺 FREE</span>
        </button>
        <button class="sk-booster-btn" id="sk-boost-barrage" data-hud-interactive="true">
          <span>🚀 5X ROCKETS</span>
          <span style="color:#f87171;font-size:10px;">40 🪙 / 📺 FREE</span>
        </button>
        <button class="sk-booster-btn" id="sk-boost-repair" data-hud-interactive="true">
          <span>🛡️ FULL REPAIR</span>
          <span style="color:#38bdf8;font-size:10px;">35 🪙 / 📺 FREE</span>
        </button>
      </div>

      <div class="sk-modal-overlay" id="sk-modal-overlay" data-hud-interactive="true"></div>
      <div class="sk-modal-overlay" id="sk-garage-overlay" data-hud-interactive="true"></div>
    `;

    this.topBar = root.querySelector('#sk-status-pill') as HTMLElement;
    this.leaderboardEl = root.querySelector('#sk-leaderboard') as HTMLElement;
    this.calloutEl = root.querySelector('#sk-callout') as HTMLElement;
    this.modalOverlay = root.querySelector('#sk-modal-overlay') as HTMLElement;
    this.garageOverlay = root.querySelector('#sk-garage-overlay') as HTMLElement;

    const muteBtn = root.querySelector('#sk-mute-btn') as HTMLButtonElement;
    muteBtn.addEventListener('click', () => {
      const enabled = this.audio.toggleUserMute();
      muteBtn.textContent = enabled ? '🔊' : '🔇';
    });

    const garageBtn = root.querySelector('#sk-garage-btn') as HTMLButtonElement;
    garageBtn.addEventListener('click', () => this.openGarageModal());

    root
      .querySelector('#sk-boost-mecha')
      ?.addEventListener('click', () => this.handleBoosterClick('mecha', 45));
    root
      .querySelector('#sk-boost-barrage')
      ?.addEventListener('click', () => this.handleBoosterClick('barrage', 40));
    root
      .querySelector('#sk-boost-repair')
      ?.addEventListener('click', () => this.handleBoosterClick('repair', 35));

    this.refreshHud();
  }

  private async handleBoosterClick(
    type: 'mecha' | 'barrage' | 'repair',
    cost: number
  ): Promise<void> {
    if (this.actionLocked || this.arena.matchEnded) return;
    if (this.saveData.coins >= cost) {
      this.saveData.coins -= cost;
      void this.sdk.saveData({ coins: this.saveData.coins });
      this.arena.activateBooster(type);
      this.refreshHud();
      return;
    }

    this.actionLocked = true;
    const rewarded = await this.ads.showRewarded(`booster_${type}`);
    this.actionLocked = false;
    if (rewarded) {
      this.arena.activateBooster(type);
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
    const p = this.arena.player;
    const hp = p ? p.hp : 0;
    const maxHp = p ? p.maxHp : 100;
    const wIcon =
      p?.activeWeapon === 'gatling' ? '🔥' : p?.activeWeapon === 'mines' ? '💣' : '🚀';
    const ammo = p ? p.weaponAmmo : 0;
    this.topBar.textContent = `🏎️ ARENA #${this.saveData.level} · ❤️ ${hp}/${maxHp} · ${wIcon} ${ammo} · ALIVE ${this.arena.aliveCount}/12`;

    const coinEl = document.getElementById('sk-coin-pill');
    if (coinEl) {
      coinEl.textContent = `🪙 ${this.saveData.coins}`;
    }

    const aliveKarts = this.arena.karts
      .filter((k) => !k.eliminated)
      .sort((a, b) => b.kills * 10 + b.powerCubes - (a.kills * 10 + a.powerCubes));

    let lbHtml = `<div style="color:#facc15;margin-bottom:4px;font-weight:900;">🏆 KART BRAWL LEADERS</div>`;
    for (let i = 0; i < Math.min(4, aliveKarts.length); i++) {
      const k = aliveKarts[i];
      const highlight = k.isPlayer ? 'color:#4ade80;font-weight:900;' : 'color:#e2e8f0;';
      lbHtml += `<div class="sk-lb-row" style="${highlight}">
        <span>#${i + 1} ${k.name}</span>
        <span>💥${k.kills} 💎${k.powerCubes}</span>
      </div>`;
    }
    this.leaderboardEl.innerHTML = lbHtml;
  }

  public showNearMissReviveModal(rank: number, killerName: string): void {
    if (this.arena.reviveUsedThisMatch) {
      this.showDefeatSummaryModal(rank, killerName);
      return;
    }

    this.modalOverlay.style.display = 'flex';
    this.modalOverlay.innerHTML = `
      <div class="sk-modal-card">
        <div style="font-size:12px;color:#f87171;font-weight:900;">⚠️ WRECKED AT #${rank}!</div>
        <h2 style="margin:6px 0 8px;font-size:22px;">KO BY ${killerName}!</h2>
        <p style="font-size:13px;color:#cbd5e1;margin:0 0 14px;">
          Airdrop back into the center of the stadium with <b>100% HP, Shield & Golden Mecha Cannon!</b>
        </p>
        <button class="sk-cta-btn" id="sk-revive-ad-btn" style="background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;">
          📺 WATCH AD: AIRDROP MECHA REVIVE
        </button>
        <button class="sk-cta-btn" id="sk-revive-skip-btn" style="background:#334155;color:#cbd5e1;">
          SKIP & START NEW BRAWL
        </button>
      </div>
    `;

    this.modalOverlay.querySelector('#sk-revive-ad-btn')?.addEventListener('click', async () => {
      if (this.actionLocked) return;
      this.actionLocked = true;
      const rewarded = await this.ads.showRewarded('revive_smash_karts');
      this.actionLocked = false;
      if (rewarded) {
        this.modalOverlay.style.display = 'none';
        this.arena.reviveAndAirdropPlayer();
      }
    });

    this.modalOverlay.querySelector('#sk-revive-skip-btn')?.addEventListener('click', () => {
      this.modalOverlay.style.display = 'none';
      this.onStartNextMatch();
    });
  }

  private showDefeatSummaryModal(rank: number, killerName: string): void {
    const consolation = 30;
    this.saveData.coins += consolation;
    void this.sdk.saveData({ coins: this.saveData.coins });

    this.modalOverlay.style.display = 'flex';
    this.modalOverlay.innerHTML = `
      <div class="sk-modal-card">
        <div style="font-size:12px;color:#f87171;font-weight:900;">FINISHED #${rank} / 12</div>
        <h2 style="margin:6px 0 8px;font-size:22px;">WRECKED BY ${killerName}</h2>
        <p style="font-size:13px;color:#cbd5e1;margin:0 0 14px;">Match Reward: <b>+${consolation} 🪙</b></p>
        <button class="sk-cta-btn" id="sk-retry-btn" style="background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;">
          🔄 PLAY NEXT BRAWL
        </button>
      </div>
    `;

    this.modalOverlay.querySelector('#sk-retry-btn')?.addEventListener('click', () => {
      this.modalOverlay.style.display = 'none';
      this.onStartNextMatch();
    });
  }

  public showVictoryModal(rank: number, baseCoins: number, kills: number): void {
    this.modalAnimating = true;
    this.saveData.level += 1;
    this.saveData.wins += 1;
    this.sdk.sendScore(this.saveData.wins * 100 + kills * 25);

    this.modalOverlay.style.display = 'flex';
    this.modalOverlay.innerHTML = `
      <div class="sk-modal-card">
        <div style="font-size:12px;color:#facc15;font-weight:900;">🏆 #${rank} BATTLE ROYALE CHAMPION!</div>
        <h2 style="margin:6px 0 4px;font-size:24px;">ARENA VICTORY!</h2>
        <p style="font-size:12px;color:#cbd5e1;margin:0 0 10px;">
          Rivals Wrecked: <b>${kills}</b> · Base Prize: <b>+${baseCoins} 🪙</b>
        </p>

        <div class="sk-mult-bar" id="sk-mult-bar">
          ${MULTIPLIER_SLOTS.map((m, idx) => `<div class="sk-mult-slot" data-idx="${idx}">${m}x</div>`).join('')}
        </div>

        <button class="sk-cta-btn" id="sk-claim-mult-btn" style="background:linear-gradient(135deg,#facc15,#eab308);color:#0f172a;">
          📺 CLAIM 3x (${baseCoins * 3} 🪙)
        </button>
        <button class="sk-cta-btn" id="sk-claim-normal-btn" style="background:#334155;color:#e2e8f0;">
          CLAIM +${baseCoins} 🪙 & NEXT ARENA
        </button>
      </div>
    `;

    const multBtn = this.modalOverlay.querySelector('#sk-claim-mult-btn') as HTMLButtonElement;
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
        this.onStartNextMatch();
      }
    });

    this.modalOverlay.querySelector('#sk-claim-normal-btn')?.addEventListener('click', () => {
      if (this.actionLocked) return;
      this.modalAnimating = false;
      this.saveData.coins += baseCoins;
      void this.sdk.saveData({
        level: this.saveData.level,
        wins: this.saveData.wins,
        coins: this.saveData.coins,
      });
      this.modalOverlay.style.display = 'none';
      this.refreshHud();
      this.onStartNextMatch();
    });
  }

  public openGarageModal(): void {
    this.garageOverlay.style.display = 'flex';
    const armorCost = this.saveData.armorUpgradeLevel * 95;
    const turboCost = this.saveData.turboUpgradeLevel * 95;
    const weaponCost = this.saveData.weaponUpgradeLevel * 105;

    this.garageOverlay.innerHTML = `
      <div class="sk-modal-card">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <h3 style="margin:0;font-size:18px;">🛠️ KART ARMORY & GARAGE</h3>
          <span style="color:#facc15;font-weight:900;font-size:13px;">🪙 ${this.saveData.coins}</span>
        </div>

        <div class="sk-skin-grid">
          ${KART_SKINS.map((s) => {
            const owned = this.saveData.unlockedSkins.includes(s.id);
            const selected = this.saveData.selectedSkin === s.id;
            return `
              <div class="sk-skin-item ${selected ? 'selected' : ''}" data-skin-id="${s.id}">
                <div style="width:18px;height:18px;border-radius:50%;background:#${s.chassisHex.toString(16).padStart(6, '0')};margin:0 auto 4px;"></div>
                <div>${s.name}</div>
                <div style="color:${owned ? '#4ade80' : '#facc15'};font-size:10px;">
                  ${selected ? 'EQUIPPED' : owned ? 'SELECT' : `${s.cost} 🪙`}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px;">
          <button class="sk-cta-btn" id="sk-upg-armor" style="margin:0;padding:9px;background:#1e293b;color:#fff;border:1px solid #38bdf8;font-size:12px;">
            🛡️ CHASSIS ARMOR LV.${this.saveData.armorUpgradeLevel} (${armorCost} 🪙)
          </button>
          <button class="sk-cta-btn" id="sk-upg-turbo" style="margin:0;padding:9px;background:#1e293b;color:#fff;border:1px solid #4ade80;font-size:12px;">
            ⚡ TURBO ENGINE LV.${this.saveData.turboUpgradeLevel} (${turboCost} 🪙)
          </button>
          <button class="sk-cta-btn" id="sk-upg-weapon" style="margin:0;padding:9px;background:#1e293b;color:#fff;border:1px solid #facc15;font-size:12px;">
            🚀 WEAPON DAMAGE LV.${this.saveData.weaponUpgradeLevel} (${weaponCost} 🪙)
          </button>
          <button class="sk-cta-btn" id="sk-garage-ad-coins" style="margin:0;padding:9px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-size:12px;">
            📺 WATCH AD FOR +350 COINS
          </button>
          <button class="sk-cta-btn" id="sk-garage-close" style="margin:0;padding:9px;background:#334155;color:#f8fafc;font-size:12px;">
            CLOSE GARAGE
          </button>
        </div>
      </div>
    `;

    this.garageOverlay.querySelectorAll('.sk-skin-item').forEach((el) => {
      el.addEventListener('click', () => {
        const skinId = Number((el as HTMLElement).dataset.skinId);
        const spec = KART_SKINS[skinId];
        if (!spec) return;
        if (this.saveData.unlockedSkins.includes(skinId)) {
          this.saveData.selectedSkin = skinId;
          void this.sdk.saveData({ selectedSkin: skinId });
          this.arena.player?.applySkin(skinId);
          this.openGarageModal();
        } else if (this.saveData.coins >= spec.cost) {
          this.saveData.coins -= spec.cost;
          this.saveData.unlockedSkins.push(skinId);
          this.saveData.selectedSkin = skinId;
          void this.sdk.saveData({
            coins: this.saveData.coins,
            unlockedSkins: this.saveData.unlockedSkins,
            selectedSkin: skinId,
          });
          this.arena.player?.applySkin(skinId);
          this.refreshHud();
          this.openGarageModal();
        }
      });
    });

    this.garageOverlay.querySelector('#sk-upg-armor')?.addEventListener('click', () => {
      if (this.saveData.coins >= armorCost) {
        this.saveData.coins -= armorCost;
        this.saveData.armorUpgradeLevel++;
        void this.sdk.saveData({
          coins: this.saveData.coins,
          armorUpgradeLevel: this.saveData.armorUpgradeLevel,
        });
        if (this.arena.player) {
          this.arena.player.armorUpgradeMult = 1.0 + (this.saveData.armorUpgradeLevel - 1) * 0.12;
          this.arena.player.maxHp = Math.round(100 * this.arena.player.armorUpgradeMult);
          this.arena.player.hp = this.arena.player.maxHp;
        }
        this.refreshHud();
        this.openGarageModal();
      }
    });

    this.garageOverlay.querySelector('#sk-upg-turbo')?.addEventListener('click', () => {
      if (this.saveData.coins >= turboCost) {
        this.saveData.coins -= turboCost;
        this.saveData.turboUpgradeLevel++;
        void this.sdk.saveData({
          coins: this.saveData.coins,
          turboUpgradeLevel: this.saveData.turboUpgradeLevel,
        });
        if (this.arena.player) {
          this.arena.player.turboUpgradeMult = 1.0 + (this.saveData.turboUpgradeLevel - 1) * 0.07;
        }
        this.refreshHud();
        this.openGarageModal();
      }
    });

    this.garageOverlay.querySelector('#sk-upg-weapon')?.addEventListener('click', () => {
      if (this.saveData.coins >= weaponCost) {
        this.saveData.coins -= weaponCost;
        this.saveData.weaponUpgradeLevel++;
        void this.sdk.saveData({
          coins: this.saveData.coins,
          weaponUpgradeLevel: this.saveData.weaponUpgradeLevel,
        });
        if (this.arena.player) {
          this.arena.player.weaponUpgradeMult = 1.0 + (this.saveData.weaponUpgradeLevel - 1) * 0.12;
        }
        this.refreshHud();
        this.openGarageModal();
      }
    });

    this.garageOverlay
      .querySelector('#sk-garage-ad-coins')
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

    this.garageOverlay.querySelector('#sk-garage-close')?.addEventListener('click', () => {
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
      const idx =
        Math.floor(((Math.sin(this.needlePhase) + 1) * 0.5) * MULTIPLIER_SLOTS.length) %
        MULTIPLIER_SLOTS.length;
      this.activeMultiplier = MULTIPLIER_SLOTS[idx];

      const slots = this.modalOverlay.querySelectorAll('.sk-mult-slot');
      for (let i = 0; i < slots.length; i++) {
        slots[i].classList.toggle('active', i === idx);
      }
    }
  }
}
