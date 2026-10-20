---
trigger: model_decision
description: "Capacitor, Android/iOS WebView, mobile compatibility, safe areas, app lifecycle, orientation, storage, and mobile performance."
---

# Mobile & Capacitor Rules

## Web Build Preparation
- In `vite.config.ts`, set `base: './'` (Capacitor serves files using relative paths; root `/` fails in native WebView).
- In `index.html`: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">`.
- Use `100dvh` or `position: fixed; inset: 0` for fullscreen canvas layouts; avoid standard `100vh` which overflows due to mobile browser URL bars.
- Accommodate notches and display cutouts with safe area insets: `padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)`.

## Platform Abstraction Layer
- All Capacitor and native platform differences must live exclusively within `src/platform/` (`lifecycle.ts`, `haptics.ts`, `storage.ts`, `orientation.ts`, `safe-area.ts`).
- Game logic must never import `@capacitor/*` directly; always import from `src/platform/`.
- Every platform helper must provide a functional web fallback or silent no-op so that `npm run dev` and web browser testing never break.
- Check platform capabilities using `Capacitor.isNativePlatform()`.

## Application Lifecycle
- Pause / Resume: Unify browser `document.visibilitychange` and native `App.addListener('appStateChange')` behind a single `onPauseChange(callback)` helper.
- On Pause: Stop game clock, halt physics simulation, suspend `AudioContext`, and pause the render loop.
- Android Back Button: Bind `App.addListener('backButton')` to game menu/pause navigation.
- Handle WebGL context recovery (`30-three-render`).

## Audio Lifecycle
- Initialize or resume `AudioContext` only following an explicit user gesture (required by iOS Safari and WebViews).

## Persistent Storage
- Use `@capacitor/preferences` inside `platform/storage.ts` for game saves and settings. Do not rely on `localStorage` on mobile devices, as mobile operating systems can clear it under memory pressure.
- Always include a schema version in save data (e.g., `{ version: 1, ... }`) to support forward migrations.

## Screen Orientation & System UI
- Lock screen orientation where appropriate using `@capacitor/screen-orientation`.
- Hide or make the system status bar translucent via `@capacitor/status-bar`.

## Native Project Folders
- Treat `android/` and `ios/` as generated build artifacts. Do not manually edit native files unless strictly required.
- After web build changes, synchronize native assets using `npm run build && npx cap sync`.
