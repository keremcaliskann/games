import type { SynthAudio } from '../core/audio';
import type { EventBus } from '../core/events';
import { GameStateId, type GameEvents, type GameStateIdType } from '../game/states/state-machine';
import type { InputManager } from '../input/input-manager';
import { Action } from '../input/input-state';

export class CyberHud {
  private readonly scoreEl: HTMLElement;
  private readonly bestEl: HTMLElement;
  private readonly pauseBtn: HTMLButtonElement;
  private readonly soundBtn: HTMLButtonElement;
  private readonly centerPanel: HTMLElement;
  private readonly titleEl: HTMLElement;
  private readonly subtitleEl: HTMLElement;
  private readonly promptEl: HTMLElement;
  private readonly adActionsEl: HTMLElement;
  private readonly debugEl: HTMLElement | null = null;
  private readonly unsubscribers: Array<() => void> = [];
  private debugAccumSec = 0;
  private lastDisplayedScore = 0;

  // Revenue Hooks
  public onReviveRequested?: () => void;
  public onMultiplierRequested?: (multiplier: number) => void;
  public onShieldBoosterRequested?: () => void;
  public onSlowMoBoosterRequested?: () => void;
  public isAdReady?: () => boolean;

  // Multiplier needle mini-game animation
  private needleRafId: number | null = null;
  private needleStartTs = 0;
  private currentMultiplier = 2.0;
  private isNeedleRunning = false;

  private readonly onPauseClick = (e: Event): void => {
    e.stopPropagation();
    this.input.triggerAction(Action.Pause);
  };

  constructor(
    private readonly root: HTMLElement,
    events: EventBus<GameEvents>,
    private readonly input: InputManager,
    private readonly audio?: SynthAudio,
  ) {
    this.injectStyles();

    const topBar = document.createElement('div');
    topBar.className = 'cf-topbar';

    const statsBox = document.createElement('div');
    statsBox.className = 'cf-stats';

    this.scoreEl = document.createElement('div');
    this.scoreEl.className = 'cf-score';
    this.scoreEl.textContent = '00';

    this.bestEl = document.createElement('div');
    this.bestEl.className = 'cf-best';
    this.bestEl.textContent = 'BEST // 00';

    statsBox.append(this.scoreEl, this.bestEl);

    const controlsBox = document.createElement('div');
    controlsBox.className = 'cf-controls';

    this.soundBtn = document.createElement('button');
    this.soundBtn.className = 'cf-sound-btn';
    this.soundBtn.type = 'button';
    this.soundBtn.dataset.hudInteractive = 'true';
    this.soundBtn.textContent = this.audio?.isAudioMuted() ? '🔇' : '🔊';
    this.soundBtn.setAttribute('aria-label', 'Toggle Audio');
    this.soundBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      if (this.audio) {
        const muted = this.audio.toggleMute();
        this.soundBtn.textContent = muted ? '🔇' : '🔊';
      }
    });

    this.pauseBtn = document.createElement('button');
    this.pauseBtn.className = 'cf-pause-btn';
    this.pauseBtn.type = 'button';
    this.pauseBtn.dataset.hudInteractive = 'true';
    this.pauseBtn.textContent = '||';
    this.pauseBtn.setAttribute('aria-label', 'Pause Game');
    this.pauseBtn.addEventListener('pointerdown', this.onPauseClick);

    controlsBox.append(this.soundBtn, this.pauseBtn);
    topBar.append(statsBox, controlsBox);

    this.centerPanel = document.createElement('div');
    this.centerPanel.className = 'cf-center-panel';

    this.titleEl = document.createElement('h1');
    this.titleEl.className = 'cf-title';

    this.subtitleEl = document.createElement('p');
    this.subtitleEl.className = 'cf-subtitle';

    this.promptEl = document.createElement('div');
    this.promptEl.className = 'cf-prompt';

    this.adActionsEl = document.createElement('div');
    this.adActionsEl.className = 'cf-ad-actions';
    this.adActionsEl.style.display = 'none';

    this.centerPanel.append(this.titleEl, this.subtitleEl, this.adActionsEl, this.promptEl);
    this.root.append(topBar, this.centerPanel);

    const showDebug =
      import.meta.env.DEV || new URLSearchParams(window.location.search).has('debug');
    if (showDebug) {
      this.debugEl = document.createElement('div');
      this.debugEl.className = 'cf-debug';
      this.root.appendChild(this.debugEl);
    }

    this.unsubscribers.push(
      events.on('scoreChange', ({ score, highScore }) => {
        this.updateScoreText(score, highScore);
      }),
      events.on('stateChange', ({ state, score, highScore }) => {
        this.updateScoreText(score, highScore);
        this.applyStateOverlay(state, score, highScore);
      }),
    );
  }

  updateDebug(dtSec: number, emaFrameMs: number, drawCalls: number, geometries: number): void {
    if (!this.debugEl) return;
    this.debugAccumSec += dtSec;
    if (this.debugAccumSec < 0.25) return;
    this.debugAccumSec = 0;
    const fps = Math.round(1000 / Math.max(1, emaFrameMs));
    this.debugEl.textContent = `FPS: ${fps} (${emaFrameMs.toFixed(1)}ms) | DC: ${drawCalls} | GEO: ${geometries}`;
  }

  private updateScoreText(score: number, highScore: number): void {
    const formatted = score < 10 ? `0${score}` : `${score}`;
    if (this.scoreEl.textContent !== formatted) {
      this.scoreEl.textContent = formatted;
      if (score > this.lastDisplayedScore && score > 0) {
        this.scoreEl.classList.remove('cf-score-bump');
        void this.scoreEl.offsetWidth; // Trigger reflow for animation restart
        this.scoreEl.classList.add('cf-score-bump');
      }
      this.lastDisplayedScore = score;
    }
    this.bestEl.textContent = `BEST // ${highScore < 10 ? `0${highScore}` : `${highScore}`}`;
  }

  setBoosterActive(type: 'shield' | 'slowmo'): void {
    if (type === 'shield') {
      const btn = this.adActionsEl.querySelector('#cf-boost-shield');
      if (btn) {
        btn.textContent = '🛡️ KALKAN AKTİF ✓';
        btn.classList.add('cf-booster-active');
      }
    } else {
      const btn = this.adActionsEl.querySelector('#cf-boost-slowmo');
      if (btn) {
        btn.textContent = '⏱️ SLOW-MO AKTİF ✓';
        btn.classList.add('cf-booster-active');
      }
    }
  }

  private stopNeedleAnimation(): void {
    if (this.needleRafId !== null) {
      cancelAnimationFrame(this.needleRafId);
      this.needleRafId = null;
    }
    this.isNeedleRunning = false;
  }

  private applyStateOverlay(state: GameStateIdType, score: number, highScore: number): void {
    this.stopNeedleAnimation();

    if (state === GameStateId.Playing) {
      this.centerPanel.style.display = 'none';
      this.pauseBtn.style.visibility = 'visible';
      this.pauseBtn.textContent = '||';
      return;
    }

    this.centerPanel.style.display = 'flex';
    this.adActionsEl.style.display = 'none';

    if (state === GameStateId.Menu) {
      this.pauseBtn.style.visibility = 'hidden';
      this.titleEl.textContent = 'CYBER // FLAP';
      this.subtitleEl.textContent = 'NEON SECTOR 2099 — NAVIGATE THE PLASMA CONDUITS';
      this.promptEl.textContent = '[ TAP / CLICK / SPACE TO BOOST ]';

      // Pre-Flight Boosters (Hook 1)
      const adReady = this.isAdReady ? this.isAdReady() : true;
      if (adReady) {
        this.adActionsEl.style.display = 'flex';
        this.adActionsEl.dataset.hudInteractive = 'true';
        this.adActionsEl.innerHTML = `
          <div class="cf-booster-bar">
            <button id="cf-boost-shield" type="button" class="cf-booster-btn" data-hud-interactive="true">
              🛡️ KALKAN // 🎬 FREE
            </button>
            <button id="cf-boost-slowmo" type="button" class="cf-booster-btn" data-hud-interactive="true">
              ⏱️ SLOW-MO // 🎬 FREE
            </button>
          </div>
        `;

        this.adActionsEl.querySelector('#cf-boost-shield')?.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          this.onShieldBoosterRequested?.();
        });

        this.adActionsEl.querySelector('#cf-boost-slowmo')?.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          this.onSlowMoBoosterRequested?.();
        });
      } else {
        this.adActionsEl.style.display = 'none';
      }
    } else if (state === GameStateId.Paused) {
      this.pauseBtn.style.visibility = 'visible';
      this.pauseBtn.textContent = '>';
      this.titleEl.textContent = 'SYSTEM // PAUSED';
      this.subtitleEl.textContent = `CURRENT LINK SCORE: ${score}`;
      this.promptEl.textContent = '[ TAP OR PRESS SPACE TO RESUME ]';
    } else if (state === GameStateId.GameOver) {
      this.pauseBtn.style.visibility = 'hidden';
      this.titleEl.textContent = 'SIGNAL // LOST';
      this.subtitleEl.textContent = `SCORE: ${score}   |   BEST: ${highScore}`;
      this.promptEl.textContent = '[ TAP / SPACE TO REBOOT DRONE ]';

      // YouTube Playables Revenue Hooks (Revive & Multiplier Needle)
      const adReady = this.isAdReady ? this.isAdReady() : true;
      if (adReady) {
        this.adActionsEl.style.display = 'flex';
        this.adActionsEl.dataset.hudInteractive = 'true';
        this.adActionsEl.innerHTML = `
          <button id="cf-ad-revive" type="button" class="cf-ad-btn cf-revive-btn" data-hud-interactive="true">
            🎬 CANLAN & DEVAM ET (+3sn KALKAN)
          </button>
          <div class="cf-mult-container" data-hud-interactive="true">
            <div class="cf-mult-track">
              <span class="cf-mult-zone">1.5x</span>
              <span class="cf-mult-zone">2.0x</span>
              <span class="cf-mult-zone">3.0x</span>
              <span class="cf-mult-zone">5.0x</span>
              <div class="cf-mult-needle" id="cf-needle"></div>
            </div>
            <button id="cf-ad-mult" type="button" class="cf-ad-btn cf-mult-btn" data-hud-interactive="true">
              🎬 ÇARPANI KATLA (<span id="cf-needle-label">2.0x</span>)
            </button>
          </div>
        `;

        const needleEl = this.adActionsEl.querySelector('#cf-needle') as HTMLElement | null;
        const labelEl = this.adActionsEl.querySelector('#cf-needle-label') as HTMLElement | null;
        this.isNeedleRunning = true;
        this.needleStartTs = performance.now();

        const animateNeedle = (now: number): void => {
          if (!this.isNeedleRunning) return;
          const elapsed = (now - this.needleStartTs) * 0.001;
          const norm = (Math.sin(elapsed * 3.5) + 1) * 0.5;
          this.currentMultiplier = Number((1.5 + norm * 3.5).toFixed(1));
          if (needleEl) {
            needleEl.style.left = `${(norm * 100).toFixed(1)}%`;
          }
          if (labelEl) {
            labelEl.textContent = `${this.currentMultiplier.toFixed(1)}x`;
          }
          this.needleRafId = requestAnimationFrame(animateNeedle);
        };
        this.needleRafId = requestAnimationFrame(animateNeedle);

        this.adActionsEl.querySelector('#cf-ad-revive')?.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          this.stopNeedleAnimation();
          this.onReviveRequested?.();
        });

        this.adActionsEl.querySelector('#cf-ad-mult')?.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          this.stopNeedleAnimation();
          const mult = this.currentMultiplier;
          this.onMultiplierRequested?.(mult);
        });
      } else {
        this.adActionsEl.style.display = 'none';
      }
    }
  }

  private injectStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .cf-topbar {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
      }
      .cf-controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .cf-stats {
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
        padding: 8px 18px;
        border-radius: 12px;
        backdrop-filter: blur(8px);
      }
      .cf-score {
        font-size: 34px;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.05;
        display: inline-block;
        transform-origin: center center;
      }
      @keyframes cf-score-pop {
        0% { transform: scale(1); }
        40% { transform: scale(1.32); color: #0284c7; }
        100% { transform: scale(1); }
      }
      .cf-score-bump {
        animation: cf-score-pop 0.32s ease-out;
      }
      .cf-best {
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        letter-spacing: 1.5px;
        margin-top: 4px;
      }
      .cf-pause-btn, .cf-sound-btn {
        pointer-events: auto;
        min-width: 44px;
        min-height: 44px;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(226, 232, 240, 0.9);
        color: #0f172a;
        font-family: inherit;
        font-size: 18px;
        font-weight: 800;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
        transition: transform 0.1s ease, background 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .cf-pause-btn:hover, .cf-sound-btn:hover {
        background: rgba(248, 250, 252, 0.98);
        transform: scale(1.05);
      }
      .cf-center-panel {
        align-self: center;
        margin: auto 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background: rgba(255, 255, 255, 0.92);
        border: 1px solid rgba(226, 232, 240, 0.9);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        padding: 28px 36px;
        border-radius: 16px;
        backdrop-filter: blur(12px);
        max-width: 90vw;
        color: #0f172a;
      }
      .cf-title {
        margin: 0;
        font-size: clamp(26px, 5vw, 40px);
        color: #0f172a;
        letter-spacing: 2px;
        font-weight: 900;
      }
      .cf-subtitle {
        margin: 10px 0 20px;
        font-size: clamp(12px, 2.5vw, 15px);
        color: #64748b;
        letter-spacing: 1.1px;
      }
      .cf-prompt {
        font-size: clamp(13px, 2.8vw, 15px);
        color: #0284c7;
        font-weight: 800;
        letter-spacing: 1.5px;
      }
      .cf-booster-bar {
        display: flex;
        gap: 10px;
        width: 100%;
        justify-content: center;
        margin-bottom: 14px;
        flex-wrap: wrap;
      }
      .cf-booster-btn {
        pointer-events: auto;
        padding: 10px 14px;
        border-radius: 9999px;
        font-family: inherit;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        border: 1px solid rgba(14, 165, 233, 0.4);
        background: rgba(240, 249, 255, 0.95);
        color: #0284c7;
        transition: transform 0.15s ease, background 0.15s ease;
      }
      .cf-booster-btn:hover {
        transform: scale(1.04);
        background: #e0f2fe;
      }
      .cf-booster-btn.cf-booster-active {
        background: #10b981 !important;
        color: #ffffff !important;
        border-color: #059669 !important;
      }
      .cf-ad-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 100%;
        margin-bottom: 16px;
      }
      .cf-ad-btn {
        pointer-events: auto;
        padding: 12px 18px;
        border-radius: 10px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        border: none;
        transition: transform 0.15s ease, filter 0.15s ease;
      }
      .cf-ad-btn:hover {
        transform: scale(1.02);
        filter: brightness(1.1);
      }
      .cf-revive-btn {
        background: linear-gradient(135deg, #10b981, #059669);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      .cf-mult-container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
      }
      .cf-mult-track {
        position: relative;
        height: 24px;
        border-radius: 12px;
        background: linear-gradient(90deg, #94a3b8 0%, #38bdf8 30%, #f59e0b 70%, #ef4444 100%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 10px;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);
      }
      .cf-mult-zone {
        font-size: 10px;
        font-weight: 800;
        color: #ffffff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.6);
        z-index: 1;
      }
      .cf-mult-needle {
        position: absolute;
        top: -4px;
        bottom: -4px;
        width: 6px;
        margin-left: -3px;
        background: #ffffff;
        border: 2px solid #0f172a;
        border-radius: 3px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        z-index: 2;
        left: 50%;
      }
      .cf-mult-btn {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #ffffff;
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      }
      .cf-debug {
        position: absolute;
        left: 12px;
        bottom: 12px;
        font-size: 11px;
        color: #0f172a;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid rgba(226, 232, 240, 0.9);
        padding: 3px 8px;
        border-radius: 6px;
        z-index: 15;
      }
    `;
    document.head.appendChild(style);
  }

  dispose(): void {
    this.stopNeedleAnimation();
    this.pauseBtn.removeEventListener('pointerdown', this.onPauseClick);
    for (let i = 0; i < this.unsubscribers.length; i++) {
      this.unsubscribers[i]();
    }
    this.unsubscribers.length = 0;
    this.root.textContent = '';
  }
}
