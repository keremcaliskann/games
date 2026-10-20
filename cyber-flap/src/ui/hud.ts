import type { EventBus } from '../core/events';
import { GameStateId, type GameEvents, type GameStateIdType } from '../game/states/state-machine';
import type { InputManager } from '../input/input-manager';
import { Action } from '../input/input-state';

export class CyberHud {
  private readonly scoreEl: HTMLElement;
  private readonly bestEl: HTMLElement;
  private readonly pauseBtn: HTMLButtonElement;
  private readonly centerPanel: HTMLElement;
  private readonly titleEl: HTMLElement;
  private readonly subtitleEl: HTMLElement;
  private readonly promptEl: HTMLElement;
  private readonly adActionsEl: HTMLElement;
  private readonly debugEl: HTMLElement | null = null;
  private readonly unsubscribers: Array<() => void> = [];
  private debugAccumSec = 0;
  private lastDisplayedScore = 0;
  public onReviveRequested?: () => void;
  public onMultiplierRequested?: () => void;

  private readonly onPauseClick = (e: Event): void => {
    e.stopPropagation();
    this.input.triggerAction(Action.Pause);
  };

  constructor(
    private readonly root: HTMLElement,
    events: EventBus<GameEvents>,
    private readonly input: InputManager,
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

    this.pauseBtn = document.createElement('button');
    this.pauseBtn.className = 'cf-pause-btn';
    this.pauseBtn.type = 'button';
    this.pauseBtn.dataset.hudInteractive = 'true';
    this.pauseBtn.textContent = '||';
    this.pauseBtn.setAttribute('aria-label', 'Pause Game');
    this.pauseBtn.addEventListener('pointerdown', this.onPauseClick);

    topBar.append(statsBox, this.pauseBtn);

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

  private applyStateOverlay(state: GameStateIdType, score: number, highScore: number): void {
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

      // YouTube Playables Revenue Hooks (Revive & Multiplier)
      this.adActionsEl.style.display = 'flex';
      this.adActionsEl.innerHTML = `
        <button id="cf-ad-revive" type="button" class="cf-ad-btn cf-revive-btn">
          🎬 CANLAN & DEVAM ET (+3sn KALKAN)
        </button>
        <button id="cf-ad-mult" type="button" class="cf-ad-btn cf-mult-btn">
          🎬 3x SKOR BONUSU AL (${score * 3} PT)
        </button>
      `;

      this.adActionsEl.querySelector('#cf-ad-revive')?.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this.onReviveRequested?.();
      });

      this.adActionsEl.querySelector('#cf-ad-mult')?.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this.onMultiplierRequested?.();
      });
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
      .cf-stats {
        background: rgba(15, 23, 42, 0.88);
        border: 2px solid #38bdf8;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), 0 0 14px rgba(56, 189, 248, 0.35);
        padding: 8px 18px;
        border-radius: 8px;
        backdrop-filter: blur(8px);
      }
      .cf-score {
        font-size: 34px;
        font-weight: 800;
        color: #38bdf8;
        text-shadow: 0 0 14px rgba(56, 189, 248, 0.6);
        line-height: 1.05;
        display: inline-block;
        transform-origin: center center;
      }
      @keyframes cf-score-pop {
        0% { transform: scale(1); }
        40% { transform: scale(1.32); color: #facc15; text-shadow: 0 0 18px #facc15; }
        100% { transform: scale(1); }
      }
      .cf-score-bump {
        animation: cf-score-pop 0.32s ease-out;
      }
      .cf-best {
        font-size: 12px;
        font-weight: 700;
        color: #facc15;
        letter-spacing: 1.5px;
        margin-top: 4px;
        text-shadow: 0 0 8px rgba(250, 204, 21, 0.5);
      }
      .cf-pause-btn {
        pointer-events: auto;
        min-width: 48px;
        min-height: 48px;
        background: rgba(15, 23, 42, 0.88);
        border: 2px solid #38bdf8;
        color: #38bdf8;
        font-family: inherit;
        font-size: 18px;
        font-weight: 800;
        border-radius: 8px;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25), 0 0 10px rgba(56, 189, 248, 0.3);
        transition: transform 0.1s ease, background 0.15s ease;
      }
      .cf-pause-btn:hover {
        background: rgba(30, 41, 59, 0.95);
        transform: scale(1.05);
      }
      .cf-center-panel {
        align-self: center;
        margin: auto 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background: rgba(15, 23, 42, 0.92);
        border: 2px solid #38bdf8;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), inset 0 0 24px rgba(56, 189, 248, 0.18);
        padding: 28px 36px;
        border-radius: 12px;
        backdrop-filter: blur(12px);
        max-width: 90vw;
      }
      .cf-title {
        margin: 0;
        font-size: clamp(26px, 5vw, 44px);
        color: #38bdf8;
        text-shadow: 0 0 18px rgba(56, 189, 248, 0.6), 2px 2px 0 #0284c7;
        letter-spacing: 3px;
        font-weight: 900;
      }
      .cf-subtitle {
        margin: 12px 0 22px;
        font-size: clamp(12px, 2.5vw, 15px);
        color: #e2e8f0;
        letter-spacing: 1.2px;
      }
      .cf-ad-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        margin-bottom: 16px;
      }
      .cf-ad-btn {
        pointer-events: auto;
        padding: 12px 16px;
        border-radius: 8px;
        font-family: inherit;
        font-size: 13px;
        font-weight: 800;
        cursor: pointer;
        border: none;
        transition: transform 0.15s ease, filter 0.15s ease;
      }
      .cf-ad-btn:hover {
        transform: scale(1.02);
        filter: brightness(1.15);
      }
      .cf-revive-btn {
        background: linear-gradient(135deg, #10b981, #059669);
        color: #fff;
        box-shadow: 0 0 16px rgba(16, 185, 129, 0.4);
      }
      .cf-mult-btn {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: #000;
        box-shadow: 0 0 16px rgba(245, 158, 11, 0.4);
      }
      .cf-prompt {
        font-size: clamp(13px, 2.8vw, 16px);
        color: #f43f5e;
        text-shadow: 0 0 10px rgba(244, 63, 94, 0.6);
        font-weight: 800;
        letter-spacing: 2px;
      }
      .cf-debug {
        position: absolute;
        left: 12px;
        bottom: 12px;
        font-size: 11px;
        color: #00ff9d;
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(56, 189, 248, 0.3);
        padding: 3px 8px;
        border-radius: 4px;
        z-index: 15;
      }
    `;
    document.head.appendChild(style);
  }

  dispose(): void {
    this.pauseBtn.removeEventListener('pointerdown', this.onPauseClick);
    for (let i = 0; i < this.unsubscribers.length; i++) {
      this.unsubscribers[i]();
    }
    this.unsubscribers.length = 0;
    this.root.textContent = '';
  }
}
