import { EvolutionStage } from '../game/config/game-config';
import { LeaderboardEntry } from '../game/systems/leaderboard';

export class Hud {
  private readonly container: HTMLElement;
  private timerEl!: HTMLElement;
  private scoreEl!: HTMLElement;
  private rankBadgeEl!: HTMLElement;
  private leaderboardListEl!: HTMLElement;
  private evoStageLabelEl!: HTMLElement;
  private evoSizeValEl!: HTMLElement;
  private evoFillEl!: HTMLElement;
  private evoNextHintEl!: HTMLElement;
  private stageBannerEl!: HTMLElement;
  private floatingLayerEl!: HTMLElement;
  private boosterMagnetBtn!: HTMLButtonElement;
  private boosterTurboBtn!: HTMLButtonElement;
  private boosterSizeBtn!: HTMLButtonElement;
  private modalContainer!: HTMLElement;
  private bannerTimeoutId: number = 0;

  // Multiplier needle animation state
  private needleAnimId: number = 0;
  private needleMultiplier: number = 2;

  constructor(container: HTMLElement) {
    this.container = container;
    this.buildHudLayout();
  }

  private buildHudLayout(): void {
    this.container.innerHTML = `
      <style>
        .hud-wrapper {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .hud-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 100%;
          gap: 12px;
        }
        .hud-stat-pill {
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(6, 182, 212, 0.35);
          border-radius: 14px;
          padding: 8px 16px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        .hud-timer-val {
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 1px;
          color: #f8fafc;
        }
        .hud-rank-pill {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          font-weight: 900;
          font-size: 16px;
          padding: 6px 14px;
          border-radius: 20px;
          box-shadow: 0 4px 10px rgba(245, 158, 11, 0.4);
        }
        .hud-score-val {
          font-size: 20px;
          font-weight: 800;
          color: #38bdf8;
        }
        /* Top Right Mini Leaderboard */
        .hud-leaderboard {
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 14px;
          padding: 8px 12px;
          color: #fff;
          min-width: 170px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        .hud-lb-title {
          font-size: 10px;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .hud-lb-row {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 0;
          color: #cbd5e1;
        }
        .hud-lb-row.player {
          color: #38bdf8;
          font-weight: 900;
        }

        /* Bottom Boosters */
        .hud-bottom-bar {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .hud-booster-btn {
          pointer-events: auto;
          background: rgba(15, 23, 42, 0.92);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(6, 182, 212, 0.4);
          border-radius: 16px;
          padding: 10px 14px;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          min-width: 82px;
          transition: transform 0.1s ease, border-color 0.15s ease;
          box-shadow: 0 6px 16px rgba(0,0,0,0.3);
        }
        .hud-booster-btn:active {
          transform: scale(0.95);
        }
        .hud-booster-icon {
          font-size: 22px;
        }
        .hud-booster-name {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
        .hud-booster-badge {
          font-size: 9px;
          background: #f59e0b;
          color: #000;
          font-weight: 900;
          padding: 2px 6px;
          border-radius: 6px;
        }
        .hud-booster-btn:disabled {
          opacity: 0.45;
          pointer-events: none;
        }

        /* Modal Overlays */
        .hud-modal-overlay {
          position: absolute;
          inset: 0;
          background: rgba(11, 15, 25, 0.88);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          z-index: 50;
        }
        .hud-modal-card {
          background: rgba(30, 41, 59, 0.95);
          border: 2px solid #06b6d4;
          border-radius: 20px;
          padding: 28px 24px;
          max-width: 380px;
          width: 90%;
          text-align: center;
          color: #fff;
          box-shadow: 0 20px 45px rgba(0,0,0,0.6);
        }
        .hud-modal-title {
          font-size: 24px;
          font-weight: 900;
          margin: 0 0 6px 0;
          color: #f8fafc;
        }
        .hud-modal-subtitle {
          font-size: 13px;
          color: #94a3b8;
          margin: 0 0 20px 0;
        }
        .hud-btn-primary {
          background: linear-gradient(135deg, #06b6d4, #8b5cf6);
          color: #fff;
          border: none;
          padding: 14px 24px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 800;
          width: 100%;
          cursor: pointer;
          margin-bottom: 10px;
          box-shadow: 0 6px 20px rgba(6, 182, 212, 0.35);
        }
        .hud-btn-secondary {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.3);
          padding: 10px 18px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          width: 100%;
          cursor: pointer;
        }

        /* Victory Multiplier Needle Bar */
        .multiplier-bar-container {
          position: relative;
          width: 100%;
          height: 38px;
          background: #0f172a;
          border-radius: 19px;
          border: 1.5px solid rgba(245, 158, 11, 0.4);
          overflow: hidden;
          margin: 16px 0 20px 0;
          display: flex;
        }
        .mult-zone {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 13px;
        }
        .mult-zone.zone-2x { background: #3b82f6; color: #fff; }
        .mult-zone.zone-3x { background: #f59e0b; color: #000; }
        .mult-zone.zone-5x { background: #ec4899; color: #fff; flex: 0.7; }
        .multiplier-needle {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 6px;
          background: #ffffff;
          box-shadow: 0 0 10px #ffffff;
          border-radius: 3px;
          transition: left 0.05s linear;
        }
        /* Live Evolution & Size Progress Panel */
        .hud-evo-panel {
          align-self: center;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(8px);
          border: 1.5px solid rgba(56, 189, 248, 0.45);
          border-radius: 16px;
          padding: 7px 14px;
          min-width: 240px;
          max-width: 320px;
          color: #fff;
          box-shadow: 0 6px 18px rgba(0,0,0,0.3);
          margin-top: -6px;
        }
        .hud-evo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.6px;
          margin-bottom: 4px;
        }
        .hud-evo-stage {
          color: #38bdf8;
        }
        .hud-evo-size {
          color: #fbbf24;
          font-weight: 900;
        }
        .hud-evo-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.14);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 4px;
        }
        .hud-evo-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(90deg, #06b6d4, #10b981, #f59e0b);
          border-radius: 6px;
          transition: width 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hud-evo-next {
          font-size: 10px;
          font-weight: 700;
          color: #cbd5e1;
          text-align: center;
        }
        .hud-stage-banner {
          position: absolute;
          top: 128px;
          left: 50%;
          transform: translateX(-50%) scale(0.9);
          background: linear-gradient(135deg, #0ea5e9, #8b5cf6);
          border: 2px solid #ffffff;
          color: #ffffff;
          padding: 10px 22px;
          border-radius: 24px;
          font-weight: 900;
          font-size: 14px;
          letter-spacing: 0.8px;
          box-shadow: 0 10px 28px rgba(139, 92, 246, 0.55);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 40;
          text-align: center;
          white-space: nowrap;
        }
        .hud-stage-banner.active {
          opacity: 1;
          transform: translateX(-50%) scale(1.0);
        }
        .hud-eat-popup {
          position: absolute;
          left: 50%;
          top: 52%;
          transform: translate(-50%, -50%);
          color: #fde047;
          font-weight: 900;
          font-size: 15px;
          text-shadow: 0 2px 6px rgba(0,0,0,0.75);
          pointer-events: none;
          animation: hudFloatUp 0.75s ease-out forwards;
        }
        @keyframes hudFloatUp {
          0% { opacity: 1; transform: translate(-50%, 0) scale(0.85); }
          40% { opacity: 1; transform: translate(-50%, -22px) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -44px) scale(0.95); }
        }
      </style>

      <div class="hud-wrapper">
        <!-- Top Stats -->
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          <div class="hud-top-bar">
            <div class="hud-stat-pill">
              <span style="font-size: 18px;">⏱️</span>
              <span id="hud-timer" class="hud-timer-val">01:30</span>
            </div>

            <div style="display: flex; gap: 8px; align-items: center;">
              <div id="hud-rank" class="hud-rank-pill">#8</div>
              <div class="hud-stat-pill">
                <span style="font-size: 16px;">🏆</span>
                <span id="hud-score" class="hud-score-val">0</span>
              </div>
            </div>

            <div class="hud-leaderboard">
              <div class="hud-lb-title">LİDERLİK TABLOSU</div>
              <div id="hud-lb-list"></div>
            </div>
          </div>

          <!-- Evolution & Size Progress Bar -->
          <div class="hud-evo-panel">
            <div class="hud-evo-header">
              <span id="hud-evo-stage" class="hud-evo-stage">SEVİYE 1 • SOKAK YUTUCU</span>
              <span id="hud-evo-size" class="hud-evo-size">Ø 2.3m</span>
            </div>
            <div class="hud-evo-track">
              <div id="hud-evo-fill" class="hud-evo-fill"></div>
            </div>
            <div id="hud-evo-next" class="hud-evo-next">Hedef: Otomobiller & Ağaçlar</div>
          </div>
        </div>

        <div id="hud-stage-banner" class="hud-stage-banner"></div>
        <div id="hud-floating-layer" style="position:absolute;inset:0;pointer-events:none;overflow:hidden;"></div>

        <!-- Bottom Tactical Boosters (3 Mandatory Revenue Hooks) -->
        <div class="hud-bottom-bar">
          <button id="btn-booster-magnet" class="hud-booster-btn" type="button" data-hud-interactive="true">
            <span class="hud-booster-icon">🧲</span>
            <span class="hud-booster-name">MAGNET</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>

          <button id="btn-booster-turbo" class="hud-booster-btn" type="button" data-hud-interactive="true">
            <span class="hud-booster-icon">⚡</span>
            <span class="hud-booster-name">TURBO</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>

          <button id="btn-booster-size" class="hud-booster-btn" type="button" data-hud-interactive="true">
            <span class="hud-booster-icon">✨</span>
            <span class="hud-booster-name">+25% BOYUT</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>
        </div>
      </div>

      <div id="hud-modal-container"></div>
    `;

    this.timerEl = this.container.querySelector('#hud-timer')!;
    this.scoreEl = this.container.querySelector('#hud-score')!;
    this.rankBadgeEl = this.container.querySelector('#hud-rank')!;
    this.leaderboardListEl = this.container.querySelector('#hud-lb-list')!;
    this.evoStageLabelEl = this.container.querySelector('#hud-evo-stage')!;
    this.evoSizeValEl = this.container.querySelector('#hud-evo-size')!;
    this.evoFillEl = this.container.querySelector('#hud-evo-fill')!;
    this.evoNextHintEl = this.container.querySelector('#hud-evo-next')!;
    this.stageBannerEl = this.container.querySelector('#hud-stage-banner')!;
    this.floatingLayerEl = this.container.querySelector('#hud-floating-layer')!;
    this.boosterMagnetBtn = this.container.querySelector('#btn-booster-magnet')!;
    this.boosterTurboBtn = this.container.querySelector('#btn-booster-turbo')!;
    this.boosterSizeBtn = this.container.querySelector('#btn-booster-size')!;
    this.modalContainer = this.container.querySelector('#hud-modal-container')!;
  }

  public updateEvolutionProgress(
    radius: number,
    current: EvolutionStage,
    next: EvolutionStage | null,
    progress01: number
  ): void {
    this.evoStageLabelEl.textContent = `SEVİYE ${current.stage} • ${current.title}`;
    this.evoStageLabelEl.style.color = current.accentColor;
    this.evoSizeValEl.textContent = `Ø ${(radius * 2).toFixed(1)}m`;
    this.evoFillEl.style.width = `${Math.round(progress01 * 100)}%`;

    if (next) {
      this.evoNextHintEl.textContent = `Sonraki Seviye (%${Math.round(progress01 * 100)}): ${next.unlockLabel}`;
    } else {
      this.evoNextHintEl.textContent = `MAKSİMUM EVRİM: Tüm Şehri Yutabilirsin!`;
    }
  }

  public showStageUpBanner(stage: EvolutionStage): void {
    if (this.bannerTimeoutId) window.clearTimeout(this.bannerTimeoutId);
    this.stageBannerEl.innerHTML = `🚀 SEVİYE ${stage.stage}: ${stage.title}!<br/><span style="font-size:11px;font-weight:700;opacity:0.92;">Açıldı: ${stage.unlockLabel}</span>`;
    this.stageBannerEl.classList.add('active');
    this.bannerTimeoutId = window.setTimeout(() => {
      this.stageBannerEl.classList.remove('active');
    }, 2600);
  }

  public spawnEatPopup(points: number, tier: number): void {
    if (tier < 2 && Math.random() > 0.35) return; // Keep screen clean on tiny props
    const el = document.createElement('div');
    el.className = 'hud-eat-popup';
    const offsetX = (Math.random() - 0.5) * 70;
    el.style.marginLeft = `${offsetX}px`;
    el.textContent = tier >= 3 ? `+${points} 🔥 BÜYÜDÜN!` : `+${points}`;
    this.floatingLayerEl.appendChild(el);
    window.setTimeout(() => {
      el.remove();
    }, 750);
  }

  public updateTimer(secondsRemaining: number): void {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = Math.floor(secondsRemaining % 60);
    this.timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  public updateScore(score: number): void {
    this.scoreEl.textContent = String(Math.floor(score));
  }

  public showTornadoAlert(visible: boolean): void {
    let alertEl = document.getElementById('tornado-alert');
    if (!alertEl) {
      alertEl = document.createElement('div');
      alertEl.id = 'tornado-alert';
      alertEl.style.cssText = 'position:absolute;top:75px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#0284c7,#38bdf8);color:#ffffff;font-weight:800;font-size:13px;padding:6px 18px;border-radius:20px;box-shadow:0 4px 14px rgba(2,132,199,0.5);pointer-events:none;z-index:30;display:none;letter-spacing:1px;';
      alertEl.textContent = '🌪️ MEGA-TORNADO WARNING!';
      this.container.appendChild(alertEl);
    }
    alertEl.style.display = visible ? 'block' : 'none';
  }

  public updateLeaderboard(rankings: LeaderboardEntry[]): void {
    const top5 = rankings.slice(0, 5);
    const playerEntry = rankings.find((r) => r.isPlayer);

    if (playerEntry) {
      this.rankBadgeEl.textContent = `#${playerEntry.rank}`;
      if (playerEntry.rank === 1) {
        this.rankBadgeEl.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
      } else {
        this.rankBadgeEl.style.background = 'linear-gradient(135deg, #0ea5e9, #6366f1)';
      }
    }

    this.leaderboardListEl.innerHTML = top5
      .map(
        (entry) => `
        <div class="hud-lb-row ${entry.isPlayer ? 'player' : ''}">
          <span>#${entry.rank} ${entry.name}</span>
          <span>${Math.floor(entry.score)}</span>
        </div>
      `
      )
      .join('');
  }

  public setBoosterCallbacks(callbacks: {
    onMagnet: () => void;
    onTurbo: () => void;
    onSize: () => void;
  }): void {
    this.boosterMagnetBtn.onclick = () => callbacks.onMagnet();
    this.boosterTurboBtn.onclick = () => callbacks.onTurbo();
    this.boosterSizeBtn.onclick = () => callbacks.onSize();
  }

  // Hook 2: Near-Miss Revive Modal
  public showReviveModal(callbacks: { onRevive: () => void; onGiveUp: () => void }): void {
    this.modalContainer.innerHTML = `
      <div class="hud-modal-overlay">
        <div class="hud-modal-card">
          <div style="font-size: 38px; margin-bottom: 8px;">💥</div>
          <h2 class="hud-modal-title">ÇOK YAKLAŞTIN!</h2>
          <p class="hud-modal-subtitle">Liderliği kapmak üzereydin! Reklam izleyerek +25s ek süre ve 5s yenilmez dev kalkan ile savaşa dön!</p>
          <button id="btn-modal-revive" class="hud-btn-primary" type="button" data-hud-interactive="true">
            🎬 REKLAM İZLE & CANLAN (+25s)
          </button>
          <button id="btn-modal-giveup" class="hud-btn-secondary" type="button" data-hud-interactive="true">
            Maçı Bitir
          </button>
        </div>
      </div>
    `;

    this.container.querySelector('#btn-modal-revive')!.addEventListener('click', () => {
      this.closeModal();
      callbacks.onRevive();
    });

    this.container.querySelector('#btn-modal-giveup')!.addEventListener('click', () => {
      this.closeModal();
      callbacks.onGiveUp();
    });
  }

  // Hook 3: Victory / Match End Podium Screen with Oscillating Multiplier
  public showVictoryModal(
    rank: number,
    score: number,
    baseCoins: number,
    callbacks: { onClaimMultiplier: (mult: number) => void; onClaimBase: () => void }
  ): void {
    const isWin = rank === 1;

    this.modalContainer.innerHTML = `
      <div class="hud-modal-overlay">
        <div class="hud-modal-card">
          <div style="font-size: 42px; margin-bottom: 4px;">${isWin ? '👑' : '🏁'}</div>
          <h2 class="hud-modal-title">${isWin ? 'ARENA ŞAMPİYONU!' : 'MAÇ TAMAMLANDI'}</h2>
          <p class="hud-modal-subtitle">Sıralama: <strong>#${rank}</strong> • Skor: <strong>${score}</strong></p>

          <div style="font-size: 14px; color: #cbd5e1; margin-bottom: 6px;">
            Kazanılan Ödül: <strong style="color: #fbbf24; font-size: 18px;">+${baseCoins} Altın</strong>
          </div>

          <!-- Moving Multiplier Needle Bar -->
          <div class="multiplier-bar-container">
            <div class="mult-zone zone-2x">2x</div>
            <div class="mult-zone zone-3x">3x</div>
            <div class="mult-zone zone-5x">5x MEGA</div>
            <div class="mult-zone zone-3x">3x</div>
            <div class="mult-zone zone-2x">2x</div>
            <div id="mult-needle" class="multiplier-needle" style="left: 0%;"></div>
          </div>

          <button id="btn-claim-multiplier" class="hud-btn-primary" type="button" data-hud-interactive="true">
            🎬 ÇARPANI AL (<span id="mult-label">3x</span> ÖDÜL)
          </button>
          <button id="btn-claim-base" class="hud-btn-secondary" type="button" data-hud-interactive="true">
            Normal Ödülü Al (${baseCoins} Altın)
          </button>
        </div>
      </div>
    `;

    const needle = this.container.querySelector('#mult-needle') as HTMLElement;
    const label = this.container.querySelector('#mult-label') as HTMLElement;
    let pos = 0;
    let dir = 1;

    const animateNeedle = () => {
      pos += dir * 1.8;
      if (pos >= 96) { pos = 96; dir = -1; }
      else if (pos <= 2) { pos = 2; dir = 1; }

      if (needle) needle.style.left = `${pos}%`;

      // Determine active multiplier based on position
      if (pos >= 40 && pos <= 60) {
        this.needleMultiplier = 5;
      } else if ((pos >= 20 && pos < 40) || (pos > 60 && pos <= 80)) {
        this.needleMultiplier = 3;
      } else {
        this.needleMultiplier = 2;
      }

      if (label) label.textContent = `${this.needleMultiplier}x`;
      this.needleAnimId = requestAnimationFrame(animateNeedle);
    };

    this.needleAnimId = requestAnimationFrame(animateNeedle);

    this.container.querySelector('#btn-claim-multiplier')!.addEventListener('click', () => {
      cancelAnimationFrame(this.needleAnimId);
      this.closeModal();
      callbacks.onClaimMultiplier(this.needleMultiplier);
    });

    this.container.querySelector('#btn-claim-base')!.addEventListener('click', () => {
      cancelAnimationFrame(this.needleAnimId);
      this.closeModal();
      callbacks.onClaimBase();
    });
  }

  public closeModal(): void {
    if (this.needleAnimId) cancelAnimationFrame(this.needleAnimId);
    this.modalContainer.innerHTML = '';
  }
}
