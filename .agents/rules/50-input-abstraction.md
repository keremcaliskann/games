---
trigger: glob
globs: "**/src/input/**/*.ts, **/src/ui/**/*.ts, **/src/render/camera*.ts"
description: "Genre-agnostic universal input ergonomics: camera-relative 3D movement projection, vehicle steering/pedal & toggle controls, 360-degree camera orbit, floating virtual joysticks, direct ground-plane aiming, dual-mode spatial controls, and HUD isolation."
---

# 50-input-abstraction.md — Universal Input & Control Ergonomics Rules (Genre-Agnostic)

## 1. Core Principle & Shared Toolkit (`src/input/ergonomic-input.ts`)
Every active game receives `src/input/ergonomic-input.ts` (`ErgonomicInput` & `KeyboardTracker`) via `node scripts/sync-shared-core.mjs`. Controls must be **100% genre-agnostic**, instantaneous, and aligned with the camera's visual perspective across **Mobile (Multi-Touch)** and **Desktop (Keyboard + Mouse)**.

---

## 2. Six Universal Control Invariants (All Genres)

### 2.1 Camera-Relative Axis Alignment (Zero Inverted Controls)
- **The `+Z` Camera Trap:** In Three.js right-handed coordinates (`+Y` up), when a camera is positioned at `Z < target.z` looking toward `+Z`, **Screen Right is World `-X`** and **Screen Left is World `+X`**. When a camera is at `Z > target.z` looking toward `-Z`, **Screen Right is World `+X`**.
- **Mandatory Rule:** Never map `dx > 0` or `KeyD / ArrowRight` blindly to `+X` without accounting for camera orientation. Use `ErgonomicInput.screenToCameraWorldXZ(screenRight, screenUp, camera, out)` so dragging Right or pressing `D / ArrowRight` **always** moves the entity toward the right side of the screen.

### 2.2 Vehicle, Sim & Action Controls (Steering, Pedals & Single-Shot Toggles)
- **Desktop + Mobile Parity:** Support `WASD` and `Arrow` keys simultaneously via `KeyboardTracker.readAxes(out)`, paired with responsive mobile touch controls (floating left thumbstick or steering buttons + right-side Gas/Brake/Action pedals).
- **Single-Shot Toggle Actions:** Discrete mechanical toggles (e.g., Camera Mode `KeyC`, 4x4 Diff-Lock `KeyE`, Vehicle Recover `KeyR`, Headlights `KeyL`, Horn `KeyH`, Handbrake `Space`) must use edge-triggered consumption (`KeyboardTracker.consumePress(code)`) so holding a key for 2 frames never rapid-toggles the state.

### 2.3 Floating Virtual Thumbstick & Dynamic Anchor (3D Movement & Steering)
- **Visual Feedback:** Display a floating virtual thumbstick (`ErgonomicInput.createFloatingJoystick`) at the touch point on `pointerdown` and hide it on `pointerup` / `pointercancel` / `blur`.
- **Dynamic Following Anchor:** Use `ErgonomicInput.updateDynamicJoystick(localX, localY, state, 46)` so the thumbstick radius is clamped to `42–48px` and the anchor follows the finger when exceeded. Fixed anchors that force the player to drag 200px back across the screen to reverse direction are strictly forbidden.

### 2.4 360° Camera Orbit, Turntable & Tap Disambiguation
- **Orbit vs. Tap Threshold:** Whenever a stage or 3D showroom supports 360° camera/model orbit dragging alongside discrete 3D object tapping, use a generous `dragThreshold >= 18px` (never `<= 8px`, which causes slight mobile thumb roll to cancel taps) and clamp vertical orbit pitch cleanly to avoid gimbal flip.
- **Magnetic Tap Assist:** If a direct raycast against 3D meshes returns 0 hits, fall back to `ErgonomicInput.findMagneticRayTarget` (within `0.5m–2.0m`) so tapping slightly beside an interactive 3D target still selects the nearest valid entity.

### 2.5 Direct Ground-Plane Aiming & Dual-Mode Spatial Manipulation
- **Direct World Mapping:** For aiming, trajectory, or cursor-tracking mechanics, project pointer coordinates directly onto the target horizontal world plane via `ErgonomicInput.screenToGroundPlane(clientX, clientY, container, camera, planeY, outVec3)` with zero heap allocations.
- **Dual-Mode Manipulation:** Spatial placement, sorting, or grid games must support **both** direct Drag-and-Drop AND Tap-to-Select followed by Tap-to-Place. Continuous grid-sliding mechanics must reset the swipe anchor after each step (`>= 12px`) for single-stroke multi-turn movement.

### 2.6 HUD Isolation, Menu Lock & Focus Reset
- Every canvas/window pointer and keyboard listener must ignore interactive UI elements via `ErgonomicInput.isHudElement(e.target)` and ignore gameplay input while `shell.isMenuOpen === true`.
- Always clear active pointer IDs, held keys (`KeyboardTracker.clear()`), and virtual joysticks on `window.blur`, `visibilitychange`, `pointerup`, and `pointercancel`.
