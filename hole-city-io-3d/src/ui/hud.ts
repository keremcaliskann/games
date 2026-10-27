import { LeaderboardEntry } from '../game/systems/leaderboard';

export class Hud {
  private readonly container: HTMLElement;
  private timerEl!: HTMLElement;
  private scoreEl!: HTMLElement;
  private rankBadgeEl!: HTMLElement;
  private leaderboardListEl!: HTMLElement;
  private boosterMagnetBtn!: HTMLButtonElement;
  private boosterTurboBtn!: HTMLButtonElement;
  private boosterSizeBtn!: HTMLButtonElement;
  private modalContainer!: HTMLElement;

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
      </style>

      <div class="hud-wrapper">
        <!-- Top Stats -->
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
    this.boosterMagnetBtn = this.container.querySelector('#btn-booster-magnet')!;
    this.boosterTurboBtn = this.container.querySelector('#btn-booster-turbo')!;
    this.boosterSizeBtn = this.container.querySelector('#btn-booster-size')!;
    this.modalContainer = this.container.querySelector('#hud-modal-container')!;
  }

  public updateTimer(secondsRemaining: number): void {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = Math.floor(secondsRemaining % 60);
    this.timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  public updateScore(score: number): void {
    this.scoreEl.textContent = String(Math.floor(score));
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
