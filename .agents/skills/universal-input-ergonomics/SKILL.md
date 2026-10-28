---
name: universal-input-ergonomics
description: >-
  Enforces camera-relative 3D movement projection, visual floating joysticks with dynamic anchors,
  direct point-and-aim cursor/touch tracking, dual-mode puzzle manipulation (Tap-to-Place + Drag-and-Drop),
  and magnetic raycast tap assist across all HTML5 3D games.
---

# Universal Input & Control Ergonomics (`universal-input-ergonomics`)

This skill prevents control bugs (inverted camera axes, unresponsive fixed-anchor joysticks, relative-only aiming, tiny mobile raycast hitboxes, and single-mode puzzle drags) across all existing and future studio games.

## 1. Shared Core Module (`shared/input/ergonomic-input.ts`)

Every game receives `src/input/ergonomic-input.ts` automatically via `node scripts/sync-shared-core.mjs`. It provides:
- `ErgonomicInput.isHudElement(target)`: Universal HUD / modal / sidebar click-bleeding isolation.
- `ErgonomicInput.screenToCameraWorldXZ(screenRight, screenUp, camera, out)`: Projects 2D screen input (`+right`, `+up`) onto the camera's actual horizontal basis vectors on the XZ plane so Left/Right and Up/Down **never invert** regardless of camera angle (`-Z`, `+Z`, or isometric orbit).
- `ErgonomicInput.createFloatingJoystick(container, knobColor)`: Renders a tactile floating thumbstick with dynamic anchor follow (`maxRadius = 46px`).
- `ErgonomicInput.findMagneticRayTarget(ray, candidates, getWorldPos, isEligible, maxRadius)`: Magnetic tap assist when a mobile tap slightly misses small 3D meshes.

---

## 2. Six Mandatory Control Laws by Genre

### Law A — Camera-Relative Movement Projection (Zero Axis Inversion)
- **Trap:** When a chase camera sits at `Z < player.z` looking toward `+Z`, Three.js right-handed coordinates place **Screen Right at `-X`** and **Screen Left at `+X`**. Naive `steerX = +dx` causes the character to move **left** when dragging **right**!
- **Rule:** Always map `Screen Right (+dx / KeyD / ArrowRight)` along the camera's horizontal Right vector (`ErgonomicInput.screenToCameraWorldXZ` or explicit camera-basis sign) and verify that dragging right moves the character toward the right edge of the screen.

### Law B — Floating Virtual Thumbstick + Dynamic Anchor (All `.io` & Action Games)
- **Rule:**
  1. Show a visible floating joystick ring + knob on `pointerdown`.
  2. Immediately steer toward the tap offset relative to screen center on `pointerdown` so holding in place steers smoothly.
  3. Pull the joystick anchor along with the finger when `dist > 46px` (`startX += normX * (dist - 46)`) so reversing direction is instantaneous (zero dead-travel lag).
  4. Support both `WASD` and `Arrow` keys, plus `Space` / double-tap / right-click for jump/dash actions.

### Law C — Direct Point-and-Aim + Desktop Hover Tracking (All Aiming, Cannon, Archery & Drop Games)
- **Rule:**
  1. Never require blind relative dragging from an arbitrary starting point to aim a cannon, bow, turret, or dropper.
  2. On `pointerdown`, `pointermove` (drag), and desktop `mouse` hover inside the stage, map normalized screen coordinates directly to target yaw/pitch or world ground-plane aim position so the trajectory arc points **directly where the player touches or hovers**.
  3. Always provide keyboard aiming (`WASD` / `Arrow` keys) and firing (`Space` / `Enter`).

### Law D — Immediate `pointerdown` Selection + Magnetic Tap Assist (All Tap, Unbolt & Dispenser Games)
- **Rule:**
  1. Trigger discrete selection actions on `pointerdown` (or with a generous `>= 18px` tap tolerance when paired with 3D camera orbit). Never use a strict `<= 8px` threshold that cancels taps on mobile touchscreens.
  2. When raycasting against 3D objects (screws, arrow blocks, angled buses, marble dispensers), always include a **Magnetic Proximity Fallback** (`0.5m–2.2m`) so tapping slightly beside an object still selects the nearest valid target.

### Law E — Dual-Mode Puzzle Manipulation (All Sorting & Grid Puzzles)
- **Rule:**
  1. Every sorting/grid puzzle (`hexa-sort-3d`, `goods-sort-3d`, `color-block-jam-3d`) must support **BOTH**:
     - **Direct Drag-and-Drop** (with a slight forward/upward visual offset so the finger never obscures the target slot), AND
     - **Tap-to-Select -> Tap-to-Place** (tapping a piece selects/elevates it; tapping a destination slot moves it there).
  2. Sliding block puzzles (`color-block-jam-3d`) must reset the swipe anchor after each grid step (`dist >= 12px`) so players can slide a block across multiple turns in a single continuous stroke without lifting their finger.

### Law F — Window Blur & HUD Isolation Invariants
- **Rule:**
  1. Filter every `pointerdown` through `ErgonomicInput.isHudElement(e.target)`.
  2. Reset all held keys, active pointer IDs, and virtual joystick visuals on `window.blur`, `visibilitychange`, `pointerup`, and `pointercancel`.
