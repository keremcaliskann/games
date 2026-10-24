export class Hud {
  private readonly container: HTMLElement;
  private hpFillEl!: HTMLElement;
  private hpTextEl!: HTMLElement;
  private waveEl!: HTMLElement;
  private goldEl!: HTMLElement;
  private blocksEl!: HTMLElement;
  private modalContainer!: HTMLElement;

  private needleAnimId: number = 0;
  private currentMultiplier: number = 2;

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
        .hud-pill {
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 14px;
          padding: 8px 16px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.3);
        }
        .hud-hp-bar {
          width: 120px;
          height: 12px;
          background: #334155;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .hud-hp-fill {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #10b981);
          transition: width 0.2s ease;
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
          border: 1.5px solid rgba(56, 189, 248, 0.4);
          border-radius: 16px;
          padding: 10px 14px;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          min-width: 86px;
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

        /* Modals */
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
          border: 2px solid #0284c7;
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
          background: linear-gradient(135deg, #0284c7, #38bdf8);
          color: #fff;
          border: none;
          padding: 14px 24px;
          border-radius: 30px;
          font-size: 15px;
          font-weight: 800;
          width: 100%;
          cursor: pointer;
          margin-bottom: 10px;
          box-shadow: 0 6px 20px rgba(2, 132, 199, 0.35);
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

        /* Multiplier Needle */
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
        .mult-zone.zone-2x { background: #0284c7; color: #fff; }
        .mult-zone.zone-3x { background: #f59e0b; color: #000; }
        .mult-zone.zone-5x { background: #ef4444; color: #fff; flex: 0.7; }
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
          <div class="hud-pill">
            <span style="font-size: 14px; font-weight: 800;">ÜS CANI</span>
            <div class="hud-hp-bar">
              <div id="hud-hp-fill" class="hud-hp-fill"></div>
            </div>
            <span id="hud-hp-text" style="font-size: 12px; font-weight: 800;">100/100</span>
          </div>

          <div class="hud-pill">
            <span style="color: #38bdf8; font-weight: 900; font-size: 15px;" id="hud-wave">DALGA 1</span>
          </div>

          <div class="hud-pill">
            <span style="font-size: 16px;">💰</span>
            <span id="hud-gold" style="font-size: 17px; font-weight: 900; color: #f59e0b;">0</span>
          </div>

          <div class="hud-pill">
            <span style="font-size: 15px;">🧱</span>
            <span id="hud-blocks" style="font-size: 15px; font-weight: 800;">0 Blok</span>
          </div>
        </div>

        <!-- Bottom Boosters -->
        <div class="hud-bottom-bar">
          <button id="btn-booster-tnt" class="hud-booster-btn" type="button">
            <span class="hud-booster-icon">💣</span>
            <span class="hud-booster-name">TNT YAĞMURU</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>

          <button id="btn-booster-cannon" class="hud-booster-btn" type="button">
            <span class="hud-booster-icon">⚡</span>
            <span class="hud-booster-name">ÇİFTE NAMLU</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>

          <button id="btn-booster-magnet" class="hud-booster-btn" type="button">
            <span class="hud-booster-icon">🧲</span>
            <span class="hud-booster-name">ORE VAKUMU</span>
            <span class="hud-booster-badge">REKLAM</span>
          </button>
        </div>
      </div>

      <div id="hud-modal-container"></div>
    `;

    this.hpFillEl = this.container.querySelector('#hud-hp-fill')!;
    this.hpTextEl = this.container.querySelector('#hud-hp-text')!;
    this.waveEl = this.container.querySelector('#hud-wave')!;
    this.goldEl = this.container.querySelector('#hud-gold')!;
    this.blocksEl = this.container.querySelector('#hud-blocks')!;
    this.modalContainer = this.container.querySelector('#hud-modal-container')!;
  }

  public updateStats(hp: number, maxHp: number, wave: number, gold: number, blocksLeft: number): void {
    const pct = Math.max(0, Math.min(100, (hp / maxHp) * 100));
    this.hpFillEl.style.width = `${pct}%`;
    if (pct < 30) this.hpFillEl.style.background = '#ef4444';
    else if (pct < 60) this.hpFillEl.style.background = '#f59e0b';
    else this.hpFillEl.style.background = 'linear-gradient(90deg, #22c55e, #10b981)';

    this.hpTextEl.textContent = `${Math.floor(hp)}/${maxHp}`;
    this.waveEl.textContent = `DALGA ${wave}`;
    this.goldEl.textContent = String(gold);
    this.blocksEl.textContent = `${blocksLeft} Blok`;
  }

  public setBoosterCallbacks(callbacks: {
    onTnt: () => void;
    onDoubleCannon: () => void;
    onMagnet: () => void;
  }): void {
    this.container.querySelector('#btn-booster-tnt')!.addEventListener('click', () => callbacks.onTnt());
    this.container.querySelector('#btn-booster-cannon')!.addEventListener('click', () => callbacks.onDoubleCannon());
    this.container.querySelector('#btn-booster-magnet')!.addEventListener('click', () => callbacks.onMagnet());
  }

  // Hook 2: Near-Miss Revive Modal
  public showReviveModal(callbacks: { onRevive: () => void; onGiveUp: () => void }): void {
    this.modalContainer.innerHTML = `
      <div class="hud-modal-overlay">
        <div class="hud-modal-card">
          <div style="font-size: 38px; margin-bottom: 8px;">💥</div>
          <h2 class="hud-modal-title">ÜS KUŞATILDI!</h2>
          <p class="hud-modal-subtitle">Düşmanlar savunma hattını aştı! Reklam izleyerek nükleer TNT patlat, düşmanları geri püskürt ve canını doldur!</p>
          <button id="btn-modal-revive" class="hud-btn-primary" type="button">
            🎬 REKLAM İZLE & SAVUNMAYI KURTAR
          </button>
          <button id="btn-modal-giveup" class="hud-btn-secondary" type="button">
            Baştan Başla
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

  // Hook 3: Victory Multiplier Modal
  public showVictoryModal(
    wave: number,
    baseCoins: number,
    callbacks: { onClaimMultiplier: (mult: number) => void; onClaimBase: () => void }
  ): void {
    this.modalContainer.innerHTML = `
      <div class="hud-modal-overlay">
        <div class="hud-modal-card">
          <div style="font-size: 42px; margin-bottom: 4px;">🏆</div>
          <h2 class="hud-modal-title">DALGA ${wave} TAMAMLANDI!</h2>
          <p class="hud-modal-subtitle">Voksel kalesi başarıyla yıkıldı ve ganimet toplandı!</p>

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

          <button id="btn-claim-multiplier" class="hud-btn-primary" type="button">
            🎬 ÇARPANI AL (<span id="mult-label">3x</span> ÖDÜL)
          </button>
          <button id="btn-claim-base" class="hud-btn-secondary" type="button">
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

      if (pos >= 40 && pos <= 60) {
        this.currentMultiplier = 5;
      } else if ((pos >= 20 && pos < 40) || (pos > 60 && pos <= 80)) {
        this.currentMultiplier = 3;
      } else {
        this.currentMultiplier = 2;
      }

      if (label) label.textContent = `${this.currentMultiplier}x`;
      this.needleAnimId = requestAnimationFrame(animateNeedle);
    };

    this.needleAnimId = requestAnimationFrame(animateNeedle);

    this.container.querySelector('#btn-claim-multiplier')!.addEventListener('click', () => {
      cancelAnimationFrame(this.needleAnimId);
      this.closeModal();
      callbacks.onClaimMultiplier(this.currentMultiplier);
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
