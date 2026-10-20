export const Action = {
  None: 0,
  Flap: 1 << 0,
  Pause: 1 << 1,
  Confirm: 1 << 2,
} as const;

export type ActionFlag = (typeof Action)[keyof typeof Action];

export interface InputState {
  moveX: number;
  moveY: number;
  lookDX: number;
  lookDY: number;
  held: number;
  pressed: number;
  released: number;
}

export interface InputSource {
  poll(out: InputState): void;
  reset(): void;
  dispose(): void;
}

export function createInputState(): InputState {
  return {
    moveX: 0,
    moveY: 0,
    lookDX: 0,
    lookDY: 0,
    held: 0,
    pressed: 0,
    released: 0,
  };
}
