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
  private readonly debugEl: HTMLElement | null = null;
  private readonly unsubscribers: Array<() => void> = [];
  private debugAccumSec = 0;

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

    this.centerPanel.append(this.titleEl, this.subtitleEl, this.promptEl);
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
    this.scoreEl.textContent = score < 10 ? `0${score}` : `${score}`;
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
        background: rgba(8, 4, 24, 0.72);
        border: 1px solid #00f3ff;
        box-shadow: 0 0 12px rgba(0, 243, 255, 0.35);
        padding: 8px 16px;
        border-radius: 4px;
      }
      .cf-score {
        font-size: 32px;
        font-weight: 700;
        color: #00f3ff;
        text-shadow: 0 0 10px #00f3ff;
        line-height: 1.05;
      }
      .cf-best {
        font-size: 12px;
        color: #ff007f;
        letter-spacing: 1.5px;
        margin-top: 4px;
      }
      .cf-pause-btn {
        pointer-events: auto;
        min-width: 48px;
        min-height: 48px;
        background: rgba(8, 4, 24, 0.8);
        border: 1px solid #ff007f;
        color: #00f3ff;
        font-family: inherit;
        font-size: 18px;
        font-weight: 700;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(255, 0, 127, 0.4);
      }
      .cf-center-panel {
        align-self: center;
        margin: auto 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background: rgba(7, 3, 22, 0.84);
        border: 1px solid #00f3ff;
        box-shadow: 0 0 24px rgba(0, 243, 255, 0.3), inset 0 0 16px rgba(255, 0, 127, 0.2);
        padding: 28px 36px;
        border-radius: 6px;
        max-width: 90vw;
      }
      .cf-title {
        margin: 0;
        font-size: clamp(26px, 5vw, 44px);
        color: #00f3ff;
        text-shadow: 0 0 14px #00f3ff, 2px 2px 0 #ff007f;
        letter-spacing: 3px;
      }
      .cf-subtitle {
        margin: 12px 0 22px;
        font-size: clamp(12px, 2.5vw, 15px);
        color: #e2d9ff;
        letter-spacing: 1.2px;
      }
      .cf-prompt {
        font-size: clamp(13px, 2.8vw, 16px);
        color: #ff007f;
        text-shadow: 0 0 8px #ff007f;
        font-weight: 700;
        letter-spacing: 2px;
      }
      .cf-debug {
        position: absolute;
        left: 12px;
        bottom: 12px;
        font-size: 11px;
        color: #00ff9d;
        background: rgba(0, 0, 0, 0.65);
        padding: 3px 8px;
        border-radius: 3px;
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
