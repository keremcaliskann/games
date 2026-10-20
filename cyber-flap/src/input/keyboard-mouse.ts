import { Action, type InputSource, type InputState } from './input-state';

const KEY_BINDINGS: Readonly<Record<string, number>> = {
  Space: Action.Flap | Action.Confirm,
  ArrowUp: Action.Flap,
  KeyW: Action.Flap,
  Enter: Action.Confirm,
  Escape: Action.Pause,
  KeyP: Action.Pause,
};

export class KeyboardPointerSource implements InputSource {
  private heldBits = 0;
  private pressedBits = 0;
  private releasedBits = 0;

  private readonly onKeyDown = (e: KeyboardEvent): void => {
    const mask = KEY_BINDINGS[e.code];
    if (!mask) return;
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault();
    }
    if (!e.repeat) {
      this.pressedBits |= mask & ~this.heldBits;
    }
    this.heldBits |= mask;
  };

  private readonly onKeyUp = (e: KeyboardEvent): void => {
    const mask = KEY_BINDINGS[e.code];
    if (!mask) return;
    this.releasedBits |= mask & this.heldBits;
    this.heldBits &= ~mask;
  };

  private readonly onPointerDown = (e: PointerEvent): void => {
    // Ignore clicks on interactive HUD buttons so pause button doesn't also trigger flap
    const target = e.target as HTMLElement | null;
    if (target && target.closest('[data-hud-interactive="true"]')) {
      return;
    }
    const mask = Action.Flap | Action.Confirm;
    this.pressedBits |= mask & ~this.heldBits;
    this.heldBits |= mask;
  };

  private readonly onPointerUp = (): void => {
    const mask = Action.Flap | Action.Confirm;
    this.releasedBits |= mask & this.heldBits;
    this.heldBits &= ~mask;
  };

  private readonly onContextMenu = (e: Event): void => {
    e.preventDefault();
  };

  constructor(private readonly targetElement: HTMLElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    this.targetElement.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointerup', this.onPointerUp);
    window.addEventListener('pointercancel', this.onPointerUp);
    this.targetElement.addEventListener('contextmenu', this.onContextMenu);
  }

  poll(out: InputState): void {
    out.held |= this.heldBits;
    out.pressed |= this.pressedBits;
    out.released |= this.releasedBits;
    this.pressedBits = 0;
    this.releasedBits = 0;
  }

  reset(): void {
    this.heldBits = 0;
    this.pressedBits = 0;
    this.releasedBits = 0;
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.targetElement.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointerup', this.onPointerUp);
    window.removeEventListener('pointercancel', this.onPointerUp);
    this.targetElement.removeEventListener('contextmenu', this.onContextMenu);
  }
}
