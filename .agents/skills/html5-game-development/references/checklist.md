# Task Completion Checklist

Work through applicable items before declaring any task complete. Never mark an item as done without verifying it.

## 1. Scope (Surgical Verification)
- [ ] Every line in the git diff traces directly to the user's explicit request.
- [ ] No unsolicited formatting, renaming, or refactoring touched neighboring lines.
- [ ] Any orphan imports, variables, or functions introduced by this change were removed.
- [ ] No unrequested features, speculative configuration toggles, or unnecessary dependencies were added.

## 2. Compilation & Types
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` produces a clean bundle.
- [ ] Unit tests (if configured) pass; new tests were added for pure business logic.

## 3. Architecture & Modularity
- [ ] Layering hierarchy preserved (`core` ← `render/physics/input/platform` ← `game` ← `ui`).
- [ ] Platform APIs (`Capacitor`, `@capacitor/*`) do not leak outside `src/platform/`.
- [ ] New constants are housed inside `game/config/`; no hardcoded magic numbers.
- [ ] Game logic remains decoupled from specific hardware inputs (reads `InputState`).

## 4. Performance & Memory
- [ ] No allocations inside `update`, `fixedUpdate`, or `render` loops (`new`, closures, `map/filter`, spreads).
- [ ] Recurring entities (bullets, particles, floating numbers) are acquired from pools (`Pool<T>`).
- [ ] Every GPU (Three.js) or Wasm (Rapier) resource implements and calls `dispose()`. Event listeners are unregistered.
- [ ] Frame times and draw calls checked if hot paths were altered.

## 5. Physics Integration
- [ ] Simulation operates on a fixed timestep (`world.timestep = 1/60`); no variable delta times passed to `world.step()`.
- [ ] New colliders are explicitly assigned collision groups in `physics/layers.ts`.
- [ ] Physics world modifications are deferred outside collision event callbacks.

## 6. Rendering & Assets
- [ ] Vibrant color palette and bright, sunlit/well-lit environment used by default (unless dark theme is explicitly specified).
- [ ] Color maps use `THREE.SRGBColorSpace`; data maps remain linear.
- [ ] Shared materials and geometries are reused rather than cloned unnecessarily.
- [ ] Mobile safe areas and viewport resizing behave cleanly without stretching.
- [ ] Debug helpers are guarded behind `import.meta.env.DEV` or `?debug=1`.

## 7. Delivery Summary (≤ 8 Lines)
- [ ] Summarized what changed, why, how it was verified, and any deferred work.
- [ ] Conventional Commit prepared in English.

## 8. GitHub Pages Deployment
- [ ] Relative base path (`base: './'`) confirmed in `vite.config.ts`.
- [ ] `.github/workflows/deploy.yml` included for automated GitHub Pages publication.
- [ ] Verified live target deployment link: `https://keremcaliskann.github.io/games/<game-name>/`.
