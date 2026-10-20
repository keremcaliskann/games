import { Action, type InputSource, type InputState } from './input-state';

export class GamepadSource implements InputSource {
  private prevHeld = 0;

  poll(out: InputState): void {
    if (!navigator.getGamepads) return;
    const pads = navigator.getGamepads();
    let currHeld = 0;

    for (let i = 0; i < pads.length; i++) {
      const pad = pads[i];
      if (!pad || !pad.connected) continue;

      // Button 0 (South / A / Cross) or Button 12 (D-Pad Up) triggers Flap + Confirm
      if (pad.buttons[0]?.pressed || pad.buttons[12]?.pressed) {
        currHeld |= Action.Flap | Action.Confirm;
      }
      // Button 9 (Start / Options) triggers Pause
      if (pad.buttons[9]?.pressed) {
        currHeld |= Action.Pause;
      }
    }

    const pressed = currHeld & ~this.prevHeld;
    const released = ~currHeld & this.prevHeld;
    this.prevHeld = currHeld;

    out.held |= currHeld;
    out.pressed |= pressed;
    out.released |= released;
  }

  reset(): void {
    this.prevHeld = 0;
  }

  dispose(): void {
    this.prevHeld = 0;
  }
}
