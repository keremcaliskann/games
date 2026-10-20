# Input System Reference

Table of Contents: data model · InputManager · keyboard & mouse · virtual touch joystick · gameplay consumption

## Data Model (`input/input-state.ts`)

```ts
export const Action = {
  Jump:     1 << 0,
  Fire:     1 << 1,
  Reload:   1 << 2,
  Interact: 1 << 3,
  Sprint:   1 << 4,
  Pause:    1 << 5,
} as const;

export interface InputState {
  moveX: number;   // -1..1 (right +)
  moveY: number;   // -1..1 (forward +)
  lookDX: number;  // Delta pixels accumulated this frame
  lookDY: number;
  held: number;    // Bitmask of active held actions
  pressed: number; // Bitmask of actions triggered this frame (rising edge)
  released: number;
}

export function createInputState(): InputState {
  return { moveX: 0, moveY: 0, lookDX: 0, lookDY: 0, held: 0, pressed: 0, released: 0 };
}

export interface InputSource {
  poll(out: InputState): void;
  dispose(): void;
}
```

## `InputManager` (`input/input-manager.ts`)

```ts
import { createInputState, type InputSource, type InputState } from './input-state';

export class InputManager {
  readonly state: InputState = createInputState();
  private prevHeld = 0;
  private latchedPressed = 0;

  constructor(private readonly sources: readonly InputSource[]) {}

  poll(): void {
    const s = this.state;
    s.moveX = 0; s.moveY = 0; s.lookDX = 0; s.lookDY = 0; s.held = 0;

    for (const src of this.sources) src.poll(s);

    s.moveX = Math.max(-1, Math.min(1, s.moveX));
    s.moveY = Math.max(-1, Math.min(1, s.moveY));

    s.pressed = s.held & ~this.prevHeld;
    s.released = ~s.held & this.prevHeld;
    this.prevHeld = s.held;

    // Latch pressed state so fixedUpdate ticks don't miss short key presses
    this.latchedPressed |= s.pressed;
  }

  consumePressed(): number {
    const p = this.latchedPressed;
    this.latchedPressed = 0;
    return p;
  }

  dispose(): void {
    for (const src of this.sources) src.dispose();
  }
}
```

## Keyboard and Mouse (`input/keyboard-mouse.ts`)

```ts
import { Action, type InputSource, type InputState } from './input-state';

const BINDINGS: Record<number, readonly string[]> = {
  [Action.Jump]:     ['Space'],
  [Action.Fire]:     [],            // Handled via mouse buttons
  [Action.Reload]:   ['KeyR'],
  [Action.Interact]: ['KeyE'],
  [Action.Sprint]:   ['ShiftLeft'],
  [Action.Pause]:    ['Escape'],
};

export class KeyboardMouseSource implements InputSource {
  private readonly keys = new Set<string>();
  private lookX = 0;
  private lookY = 0;
  private mouseDown = false;

  constructor(private readonly target: HTMLElement) {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('blur', this.reset);
    target.addEventListener('mousemove', this.onMouseMove);
    target.addEventListener('mousedown', this.onMouseDown);
    target.addEventListener('mouseup', this.onMouseUp);
  }

  private onKeyDown = (e: KeyboardEvent): void => { this.keys.add(e.code); };
  private onKeyUp = (e: KeyboardEvent): void => { this.keys.delete(e.code); };
  private onMouseDown = (e: MouseEvent): void => { if (e.button === 0) this.mouseDown = true; };
  private onMouseUp = (e: MouseEvent): void => { if (e.button === 0) this.mouseDown = false; };
  private onMouseMove = (e: MouseEvent): void => {
    if (document.pointerLockElement === this.target) {
      this.lookX += e.movementX;
      this.lookY += e.movementY;
    }
  };

  private reset = (): void => {
    this.keys.clear();
    this.mouseDown = false;
    this.lookX = 0;
    this.lookY = 0;
  };

  poll(out: InputState): void {
    let mx = 0;
    let my = 0;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) my += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) my -= 1;
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) mx += 1;
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) mx -= 1;

    out.moveX += mx;
    out.moveY += my;
    out.lookDX += this.lookX;
    out.lookDY += this.lookY;
    this.lookX = 0;
    this.lookY = 0;

    for (const [actionBit, codes] of Object.entries(BINDINGS)) {
      const bit = Number(actionBit);
      for (const code of codes) {
        if (this.keys.has(code)) out.held |= bit;
      }
    }
    if (this.mouseDown) out.held |= Action.Fire;
  }

  dispose(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('blur', this.reset);
    this.target.removeEventListener('mousemove', this.onMouseMove);
    this.target.removeEventListener('mousedown', this.onMouseDown);
    this.target.removeEventListener('mouseup', this.onMouseUp);
  }
}
```
Apply look delta (`lookDX`, `lookDY`) inside `update(dt)` per render frame, while consuming movement axes and action latching inside `fixedUpdate(FIXED_DT)`.
