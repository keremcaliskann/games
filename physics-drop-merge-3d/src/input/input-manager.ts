import { GAME_CONFIG } from '../game/config/game-config';

export interface InputCallbacks {
  onAim(targetX: number): void;
  onDrop(x: number): void;
  onDragInertia?(deltaX: number): void;
}

export class InputManager {
  private isPointerDown = false;
  private currentX = 0;
  private lastClientX = 0;

  constructor(
    private readonly container: HTMLElement,
    private readonly callbacks: InputCallbacks
  ) {
    this.setupListeners();
  }

  private isHudTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return Boolean(
      target.closest(
        '.hud-btn, .booster-btn, .modal-card, .modal-overlay, .shell-sidebar, [data-hud-interactive]'
      )
    );
  }

  private setupListeners(): void {
    this.container.addEventListener('pointerdown', (e) => {
      if (this.isHudTarget(e.target)) return;

      this.isPointerDown = true;
      this.lastClientX = e.clientX;
      this.updateAimX(e.clientX);
    });

    window.addEventListener('pointermove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const insideStage =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (this.isPointerDown) {
        const dx = e.clientX - this.lastClientX;
        this.lastClientX = e.clientX;
        if (this.callbacks.onDragInertia && Math.abs(dx) > 1) {
          this.callbacks.onDragInertia(dx);
        }
        this.updateAimX(e.clientX);
      } else if (e.pointerType === 'mouse' && insideStage && !this.isHudTarget(e.target)) {
        // Smooth desktop mouse hover tracking so player sees exact drop line before clicking
        this.updateAimX(e.clientX);
      }
    });

    const release = () => {
      if (!this.isPointerDown) return;
      this.isPointerDown = false;
      this.callbacks.onDrop(this.currentX);
    };

    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);

    window.addEventListener('keydown', (e: KeyboardEvent) => {
      const max = GAME_CONFIG.dropper.maxHorizontalSpread;
      const step = max * 0.12;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.currentX = Math.max(-max, this.currentX - step);
        this.callbacks.onAim(this.currentX);
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.currentX = Math.min(max, this.currentX + step);
        this.callbacks.onAim(this.currentX);
      } else if (e.code === 'Space' || e.code === 'Enter' || e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        this.callbacks.onDrop(this.currentX);
      }
    });
  }

  private updateAimX(clientX: number): void {
    const rect = this.container.getBoundingClientRect();
    if (rect.width <= 0) return;
    const normX = Math.max(-1, Math.min(1, ((clientX - rect.left) / rect.width) * 2 - 1));
    const max = GAME_CONFIG.dropper.maxHorizontalSpread;
    this.currentX = normX * max;
    this.callbacks.onAim(this.currentX);
  }
}
