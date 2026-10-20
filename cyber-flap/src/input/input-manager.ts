import { createInputState, type InputSource, type InputState } from './input-state';

export class InputManager {
  readonly state: InputState = createInputState();
  private readonly sources: InputSource[] = [];
  // Latches edge presses across frames until at least one fixedUpdate consumes them
  private latchedPressed = 0;
  private latchedReleased = 0;
  private readonly onWindowBlur = (): void => {
    this.reset();
  };

  constructor(sources: InputSource[]) {
    for (let i = 0; i < sources.length; i++) {
      this.sources.push(sources[i]);
    }
    window.addEventListener('blur', this.onWindowBlur);
  }

  poll(): void {
    this.state.moveX = 0;
    this.state.moveY = 0;
    this.state.lookDX = 0;
    this.state.lookDY = 0;
    this.state.held = 0;
    this.state.pressed = 0;
    this.state.released = 0;

    for (let i = 0; i < this.sources.length; i++) {
      this.sources[i].poll(this.state);
    }

    this.latchedPressed |= this.state.pressed;
    this.latchedReleased |= this.state.released;
    this.state.pressed = this.latchedPressed;
    this.state.released = this.latchedReleased;
  }

  consumeFixedEdges(): void {
    this.latchedPressed = 0;
    this.latchedReleased = 0;
    this.state.pressed = 0;
    this.state.released = 0;
  }

  triggerAction(actionMask: number): void {
    this.latchedPressed |= actionMask;
    this.state.pressed |= actionMask;
  }

  reset(): void {
    this.latchedPressed = 0;
    this.latchedReleased = 0;
    this.state.held = 0;
    this.state.pressed = 0;
    this.state.released = 0;
    for (let i = 0; i < this.sources.length; i++) {
      this.sources[i].reset();
    }
  }

  dispose(): void {
    window.removeEventListener('blur', this.onWindowBlur);
    for (let i = 0; i < this.sources.length; i++) {
      this.sources[i].dispose();
    }
  }
}
