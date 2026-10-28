---
trigger: glob
globs: "**/src/input/**/*.ts, **/src/ui/**/*.ts, **/src/render/camera*.ts"
description: "Universal input ergonomics: camera-relative 3D movement projection, floating virtual joysticks, direct point-and-aim, dual-mode puzzle controls, and magnetic raycast tap assist."
---

# 50-input-abstraction.md — Universal Input & Control Ergonomics Rules

## 1. Core Principle & Shared Toolkit (`src/input/ergonomic-input.ts`)
Every game receives `src/input/ergonomic-input.ts` (`ErgonomicInput`) via `node scripts/sync-shared-core.mjs`. Controls must feel effortless, instantaneous, and 100% aligned with the camera's visual perspective on both **Mobile (1-Finger Touch)** and **Desktop (Mouse + Keyboard `WASD` / `Arrow` / `Space`)**.

---

## 2. Six Non-Negotiable Control Invariants

### 2.1 Camera-Relative Axis Alignment (Zero Inverted Controls)
- **The `+Z` Camera Trap:** In Three.js right-handed coordinates (`+Y` up), when a camera is positioned at `Z < target.z` looking toward `+Z`, **Screen Right is World `-X`** and **Screen Left is World `+X`**. When a camera is at `Z > target.z` looking toward `-Z`, **Screen Right is World `+X`**.
- **Mandatory Rule:** Never map `dx > 0` or `KeyD / ArrowRight` blindly to `+X` without verifying camera orientation. Use `ErgonomicInput.screenToCameraWorldXZ(screenRight, screenUp, camera, out)` or explicit camera-basis projection so dragging Right or pressing `D / ArrowRight` **always** moves the entity toward the right side of the screen.

### 2.2 Floating Virtual Thumbstick & Dynamic Anchor (`.io` & Action Games)
- **Visual Feedback:** Display a floating virtual thumbstick (`ErgonomicInput.createFloatingJoystick` or equivalent `joyBase` + `joyKnob`) at the touch point on `pointerdown` and hide it on `pointerup` / `pointercancel` / `blur`.
- **Dynamic Following Anchor:** Clamp the thumbstick radius to `42–48px` and pull the anchor point along with the finger when exceeded (`startX += normX * (dist - maxRadius)`). Fixed anchors that force the player to drag 200px back across the screen to reverse direction are strictly forbidden.
- **Hold-to-Steer:** On `pointerdown`, immediately compute a steering vector toward the touch point relative to screen center so tapping and holding steers smoothly even before dragging.

### 2.3 Direct Point-and-Aim + Desktop Hover Tracking (Aiming, Ballistic & Drop Games)
- **Direct Target Mapping:** In cannon, archery, turret, and Suika drop games, touching or moving the cursor anywhere on the stage must aim directly at that screen/world coordinate (`pointerdown`, `pointermove` drag, and desktop `mouse` hover). Never require blind relative pull-back deltas from an arbitrary start point as the sole aiming method.
- **Keyboard Parity:** Always bind `WASD / Arrow` keys for aim adjustment and `Space / Enter` for firing/dropping.

### 2.4 Immediate `pointerdown` Response & Magnetic Raycast Assist (Tap & Unbolt Games)
- **Generous Tap Tolerance:** When distinguishing taps from 3D camera orbit drags (`screw-jam-3d`, `cyber-arrow-3d`), `dragThreshold` must be `>= 18px` (never `8px`, which causes slight mobile thumb roll to cancel taps). Where camera orbit is not used (`bus-escape-jam-3d`, `conveyor-marble-sort-3d`), trigger selection immediately on `pointerdown`.
- **Magnetic Tap Assist:** If a raycast against 3D meshes returns 0 hits, fall back to `ErgonomicInput.findMagneticRayTarget` (or ground-plane proximity `< 0.5m–2.2m`) so tapping slightly beside a screw, block, bus, or dispenser still triggers the nearest valid target.

### 2.5 Dual-Mode Puzzle Manipulation (Sorting & Block Slide Games)
- **Tap-to-Place + Drag-and-Drop:** Sorting games (`hexa-sort-3d`, `goods-sort-3d`) must support **both** dragging an item to a target slot AND tapping an item to select it followed by tapping the target slot to place it.
- **Continuous Multi-Step Sliding:** Block jam puzzles (`color-block-jam-3d`) must use a responsive `12px` swipe threshold and reset the drag anchor after each slide so players can guide a block through multiple turns in a single continuous finger stroke.

### 2.6 HUD Isolation & Focus Reset
- Every canvas/window pointer listener must ignore interactive UI elements via `ErgonomicInput.isHudElement(e.target)` (`[data-hud-interactive="true"], button, a, .modal-overlay, .shell-sidebar`).
- Always clear active pointer IDs, held keys, and virtual joysticks on `window.blur`, `visibilitychange`, `pointerup`, and `pointercancel`.
