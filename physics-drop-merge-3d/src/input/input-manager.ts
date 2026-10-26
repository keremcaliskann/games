import { GAME_CONFIG } from '../game/config/game-config';

export interface InputCallbacks {
  onAim(targetX: number): void;
  onDrop(x: number): void;
}

export class InputManager {
  private isPointerDown = false;
  private currentX = 0;

  constructor(
    private readonly container: HTMLElement,
    private readonly callbacks: InputCallbacks
  ) {
    this.setupListeners();
  }

  private setupListeners(): void {
    this.container.addEventListener('pointerdown', (e) => {
      // Isolate clicks on HUD interactive buttons
      const target = e.target as HTMLElement;
      if (
        target.closest('.hud-btn') ||
        target.closest('.booster-btn') ||
        target.closest('.modal-card') ||
        target.closest('.modal-overlay') ||
        target.closest('.shell-sidebar') ||
        target.closest('[data-hud-interactive]')
      ) {
        return;
      }

      this.isPointerDown = true;
      this.updateAimX(e.clientX);
    });

    window.addEventListener('pointermove', (e) => {
      if (!this.isPointerDown) return;
      this.updateAimX(e.clientX);
    });

    const release = () => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;
      this.callbacks.onDrop(this.currentX);
    };

    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
  }

  private updateAimX(clientX: number): void {
    const rect = this.container.getBoundingClientRect();
    const normX = ((clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const max = GAME_CONFIG.dropper.maxHorizontalSpread;
    this.currentX = normX * max;
    this.callbacks.onAim(this.currentX);
  }
}
