---
name: universal-input-ergonomics
description: >-
  Enforces genre-agnostic camera-relative 3D movement projection, vehicle/action keyboard & pedal trackers,
  360-degree camera orbit disambiguation, visual floating joysticks with dynamic anchors, zero-allocation
  ground-plane aiming, dual-mode spatial manipulation, and magnetic raycast tap assist across all HTML5 3D games.
---

# Universal Input & Control Ergonomics (`universal-input-ergonomics`)

This skill defines the **genre-agnostic** input architecture across all studio games, eliminating inverted camera axes, unresponsive fixed-anchor joysticks, key-repeat toggle bugs, missed mobile raycasts, and HUD click-bleeding.

## 1. Shared Core Module (`shared/input/ergonomic-input.ts`)

Every active game receives `src/input/ergonomic-input.ts` automatically via `node scripts/sync-shared-core.mjs`. It exports:
- `ErgonomicInput.isHudElement(target)`: Universal HUD / modal / form / sidebar click-bleeding isolation.
- `ErgonomicInput.screenToCameraWorldXZ(screenRight, screenUp, camera, out)`: Projects 2D screen input (`+right`, `+up`) onto the camera's actual horizontal basis vectors on the XZ plane so Left/Right and Up/Down **never invert** regardless of camera angle (`-Z`, `+Z`, or 360° orbit).
- `ErgonomicInput.screenToGroundPlane(clientX, clientY, container, camera, planeY, outWorldPos)`: Zero-allocation screen-to-world horizontal plane intersection for aiming, cursor tracking, and spatial dragging.
- `ErgonomicInput.createFloatingJoystick(container, knobColor)` & `ErgonomicInput.updateDynamicJoystick(localX, localY, state, maxRadiusPx)`: Renders a tactile floating thumbstick and updates dynamic anchor follow (`maxRadius = 46px`) with zero dead-travel lag.
- `ErgonomicInput.findMagneticRayTarget(ray, candidates, getWorldPos, isEligible, maxRadius)`: Magnetic tap assist when a mobile tap slightly misses small 3D meshes.
- `KeyboardTracker`: Focus-safe `WASD` + `Arrow` axis reader (`readAxes(out)`) and edge-triggered single-shot toggle consumer (`consumePress(code)`), with automatic state reset on `window.blur` and `visibilitychange`.

---

## 2. Six Universal Control Laws (Genre-Agnostic)

### Law A — Camera-Relative Movement Projection (Zero Axis Inversion)
- **Trap:** When a chase or orbit camera looks toward `+Z`, Three.js right-handed coordinates place **Screen Right at `-X`** and **Screen Left at `+X`**.
- **Rule:** Always project 2D directional input through `ErgonomicInput.screenToCameraWorldXZ` (or explicit camera-basis vectors) so pressing Right or dragging Right moves the character/vehicle toward the right side of the viewport.

### Law B — Vehicle, Sim & Action Controls (Proportional Axes + Edge-Triggered Toggles)
- **Rule:**
  1. Read continuous movement/throttle/steering axes via `KeyboardTracker.readAxes(out)` paired with mobile touch pedals or dynamic joystick.
  2. Use `KeyboardTracker.consumePress(code)` for discrete toggles (e.g., Camera Mode `KeyC`, 4x4 Diff-Lock `KeyE`, Recover `KeyR`, Headlights `KeyL`, Horn `KeyH`) so holding a key never rapid-cycles the toggle.

### Law C — Floating Virtual Thumbstick + Dynamic Anchor
- **Rule:**
  1. Show a visible floating joystick ring + knob on `pointerdown` (`createFloatingJoystick`).
  2. Call `ErgonomicInput.updateDynamicJoystick(localX, localY, state, 46)` on `pointermove` so the anchor follows the finger whenever `dist > 46px`, making direction reversals instantaneous.

### Law D — 360° Camera Orbit, Turntable & Magnetic Raycast Selection
- **Rule:**
  1. When combining 360° camera/showroom orbit with 3D object tapping, use a `>= 18px` drag threshold before entering orbit mode; treat `< 18px` pointer releases as discrete taps.
  2. When raycasting against 3D objects, fall back to `ErgonomicInput.findMagneticRayTarget` (`0.5m–2.0m`) if the exact mesh intersection misses.

### Law E — Direct Ground-Plane Aiming & Dual-Mode Spatial Manipulation
- **Rule:**
  1. Map pointer coordinates directly to the world ground plane via `ErgonomicInput.screenToGroundPlane` (never require blind relative pull-back deltas as the sole aiming method).
  2. Spatial placement and sorting games must support **both** Direct Drag-and-Drop AND Tap-to-Select -> Tap-to-Place.

### Law F — Menu Lock, Window Blur & HUD Isolation Invariants
- **Rule:**
  1. Filter every `pointerdown` and `keydown` through `ErgonomicInput.isHudElement(e.target)` and halt gameplay input while `shell.isMenuOpen === true`.
  2. Reset all held keys, active pointer IDs, and virtual joystick visuals on `window.blur`, `visibilitychange`, `pointerup`, and `pointercancel`.
