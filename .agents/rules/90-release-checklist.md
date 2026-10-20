---
trigger: manual
description: "Pre-release checklist. Loaded exclusively when @90-release-checklist is mentioned."
---

# Pre-Release Checklist

Run through this verification checklist before preparing a production build or release. Provide concrete evidence (command output or test observation) for every item.

## 1. Build & Static Analysis
- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run build` succeeds; bundle chunks are properly split (`three` and `rapier` separated).
- [ ] Unit/integration tests pass (`npm test`, if configured).
- [ ] Production bundle contains no `console.log` statements or active debug overlays.

## 2. Gameplay Smoke Test (Dev / Preview Server)
- [ ] Full navigation loop: Main Menu → Gameplay → Pause → Resume → Game Over → Main Menu.
- [ ] Keyboard and mouse controls: movement, camera look, jumping, actions.
- [ ] Touch emulation: virtual joystick, camera pan, action buttons.
- [ ] Tab switching: audio suspends and game clock resumes cleanly when switching browser tabs.
- [ ] Window resizing: projection matrix and aspect ratio adapt without distortion.

## 3. Performance & Memory Audits
- [ ] Frame time remains within the 16.6 ms budget in typical and complex gameplay scenes.
- [ ] Draw calls and polygon counts comply with the performance budget (`20-performance-budget`).
- [ ] Memory Leak Test: `renderer.info.memory` counters return to baseline after 5 consecutive level transitions.
- [ ] Zero visible GC stutter during 2 minutes of continuous gameplay.

## 4. Mobile & Capacitor Verification
- [ ] `npm run build && npx cap sync` executes cleanly without native build warnings.
- [ ] Tested on a physical device: launch screen, orientation locking, safe area insets, and hardware back button.
- [ ] App pauses gracefully when backgrounded and recovers WebGL context cleanly upon foregrounding.
- [ ] Player save data and settings persist reliably across application restarts.
- [ ] App icon, splash screen, display name, and bundle ID are configured correctly.

## 5. Repository & Release Cleanliness
- [ ] `git status` is clean; no untracked `.env`, credentials, or temporary build files.
- [ ] Only intended, verified changes are committed.
- [ ] Version number in `package.json` is updated and tagged appropriately.

## 6. GitHub Pages Deployment
- [ ] Relative base path (`base: './'`) confirmed in `vite.config.ts`.
- [ ] `.github/workflows/deploy.yml` exists and is configured for automated build and publish.
- [ ] Live target URL verified: `https://keremcaliskann.github.io/games/<game-name>/`.
