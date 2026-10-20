---
trigger: glob
globs: "**/src/input/**/*.ts, **/src/ui/**/*.ts"
description: "Input abstraction via InputState, action bitmasks, multi-source polling, and touch controls."
---

# Input Abstraction Rules

## Core Principle
Game logic must **never interact directly** with keyboards, mice, touchscreens, or gamepads. Instead, gameplay systems read a normalized `InputState` updated each frame. Adding support for a new controller requires writing a new `InputSource` without altering any gameplay logic.

## Data Model & Action Maps
- `InputState`: contains `moveX`, `moveY` (−1.0 to 1.0), accumulated delta look values `lookDX`, `lookDY`, and action bitmasks `held`, `pressed`, `released`.
- Define actions as bitflags inside an `Action` constant object (e.g., `Jump`, `Fire`, `Reload`, `Interact`, `Sprint`, `Pause`). Specific key codes must not appear in game systems.
- Every source implements the `InputSource.poll(out: InputState)` interface. `InputManager` merges contributions from all active sources (summing axes and clamping to −1.0..1.0).
- Keybindings should be stored as remappable configuration data.

## Event Handling & Latching
- DOM event handlers only record raw input states (is key down, pointer coordinates); they must never trigger gameplay actions directly.
- Polling: Axes are sampled every frame. Transient `pressed` and `released` edges are cleared at the end of the frame.
- Latching for Fixed Timesteps: Since physics/game logic runs in a fixed accumulator (which may execute 0, 1, or multiple sub-steps per frame), latch `pressed` action bits until at least one fixed tick consumes them.
- Focus Loss: On window `blur` or `visibilitychange`, immediately reset all active keys, touches, and held bits to prevent sticky input.

## Keyboard & Mouse
- Use `event.code` (physical key location) instead of `event.key` to remain independent of regional keyboard layouts.
- Camera Look: Utilize `canvas.requestPointerLock()` and accumulate `movementX` / `movementY`. Emit a `Pause` action if pointer lock is lost unexpectedly.
- Apply user sensitivity and invert-Y settings from persistent configuration.

## Touch & Mobile Gestures
- Use Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`) exclusively; identify multiple touches using `pointerId` and call `setPointerCapture`.
- Required CSS: `touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;` and suppress `contextmenu`.
- Touch Layout: Left half = floating virtual joystick (movement), right half = camera pan area and action buttons.
- Minimum interactive button size: 48×48 CSS pixels. Keep all controls within safe area insets (`env(safe-area-inset-*)`).
- Virtual Joystick: Apply a normalized deadzone (~0.1) and clamp outputs between −1.0 and 1.0.

## Gamepad Support
- Poll `navigator.getGamepads()` once per frame. Apply a radial deadzone (~0.15) to analog sticks.
- Map buttons to standard gamepad layouts via configuration tables.
