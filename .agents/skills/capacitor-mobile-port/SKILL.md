---
name: capacitor-mobile-port
description: Ports Vite + Three.js web games to Android and iOS applications using Capacitor. Covers capacitor.config.ts, platform syncing, app lifecycle (pause/resume), screen orientation, safe areas, hardware back button, preferences storage, and physical device verification.
---

# Mobile Porting with Capacitor

Capacitor wraps the web build (Vite's `dist/` output) inside a native WebView shell. The core game logic remains unchanged; all platform-specific behavior is encapsulated inside `src/platform/`.

> Note: Tool commands and plugin APIs evolve across major versions. Always verify syntax via `npx cap --help` and official plugin documentation. This skill requires a plan and approval before adding dependencies or creating native directories.

## Decision Tree

| Situation | Action |
|---|---|
| Web build is not yet functional | Stabilize the web build first; do not begin mobile porting prematurely. |
| Missing `base: './'` | Add `base: './'` to `vite.config.ts` (`references/vite-setup.md`). |
| Initial Capacitor setup | Follow Steps 1 through 4 below. |
| Capacitor installed, web code updated | Run `npm run build && npx cap sync`. |
| iOS target requested | Requires macOS with Xcode. If unavailable, notify the user and proceed with Android. |
| Edits needed in `android/` or `ios/` | Request approval; native directories should generally remain untouched generated code. |

## Step 0: Prerequisites
- `npm run build` succeeds and runs cleanly with `npm run preview`.
- In `vite.config.ts`: `base: './'`; in `index.html`: `viewport-fit=cover`.
- Android Studio + Android SDK for Android builds; macOS + Xcode for iOS builds.

## Step 1: Installation & Initialization

```bash
npm i @capacitor/core @capacitor/app @capacitor/preferences @capacitor/haptics \
      @capacitor/screen-orientation @capacitor/status-bar
npm i -D @capacitor/cli
npx cap init "Game Title" com.studio.gamename --web-dir=dist
npm i @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios        # macOS only
```
Install only the specific plugins your game requires (YAGNI principle).

## Step 2: `capacitor.config.ts`

```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.studio.gamename',
  appName: 'Game Title',
  webDir: 'dist',
};

export default config;
```

## Step 3: Build & Sync

```bash
npm run build && npx cap sync
npx cap open android     # Opens project in Android Studio
npx cap open ios         # Opens project in Xcode (macOS only)
```
Add to `package.json`: `"cap:sync": "npm run build && cap sync"`.

## Step 4: Platform Abstraction Layer (`src/platform/`)

Game code must never import `@capacitor/*` directly; all native calls are routed through the helpers below, each providing web-safe fallbacks:

**`lifecycle.ts`** — Unified pause and resume:
```ts
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export function onPauseChange(cb: (paused: boolean) => void): () => void {
  const onVisibility = (): void => cb(document.hidden);
  document.addEventListener('visibilitychange', onVisibility);

  let handle: Promise<{ remove: () => Promise<void> }> | undefined;
  if (Capacitor.isNativePlatform()) {
    handle = App.addListener('appStateChange', ({ isActive }) => cb(!isActive));
  }

  return () => {
    document.removeEventListener('visibilitychange', onVisibility);
    void handle?.then((h) => h.remove());
  };
}

export function onBackButton(cb: () => void): () => void {
  if (!Capacitor.isNativePlatform()) return () => {};
  const handle = App.addListener('backButton', cb);
  return () => { void handle.then((h) => h.remove()); };
}
```

**`storage.ts`** — Preferences storage (survives OS cache sweeps):
```ts
import { Preferences } from '@capacitor/preferences';

export async function saveJson(key: string, value: unknown): Promise<void> {
  await Preferences.set({ key, value: JSON.stringify(value) });
}

export async function loadJson<T>(key: string): Promise<T | null> {
  const { value } = await Preferences.get({ key });
  if (value === null) return null;
  try { return JSON.parse(value) as T; } catch { return null; }
}
```
Always attach a version property to saved payloads (e.g., `{ version: 1, ... }`).

**`orientation.ts` & `haptics.ts`**:
```ts
import { Capacitor } from '@capacitor/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export async function lockLandscape(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try { await ScreenOrientation.lock({ orientation: 'landscape' }); } catch { /* Ignore if unsupported */ }
}

export async function lightTap(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try { await Haptics.impact({ style: ImpactStyle.Light }); } catch { /* Non-critical */ }
}
```

## Step 5: Handling Pause and Backgrounding
- When `onPauseChange(true)` triggers: call `GameLoop.stop()`, pause audio (`AudioContext.suspend()`), and freeze game timers.
- When `onPauseChange(false)` triggers: call `GameLoop.start()` and resume audio.
- WebGL Context Loss: Handle `webglcontextlost` and `webglcontextrestored` to rebuild graphics buffers if Android flushes GPU context while backgrounded.

## Step 6: Asset Generation (Icons & Splash Screens)

```bash
npm i -D @capacitor/assets
# Prepare resources/icon.png (1024×1024) and resources/splash.png (2732×2732)
npx capacitor-assets generate
```

## Step 7: Real Device Profiling & Verification
- Android: Connect device with USB Debugging enabled → launch from Android Studio → inspect via Chrome at `chrome://inspect`.
- iOS: Connect iPhone → launch from Xcode → inspect via Safari Web Inspector.
- Initial Mobile Quality Profile: `maxPixelRatio ≤ 1.5`, disable antialiasing, simple shadows, zero post-processing.
- Play continuously for 5 minutes to verify stability under device thermal throttling.

## Verification Checklist
- [ ] `npm run build && npx cap sync` completes without errors.
- [ ] Safe area insets properly applied on devices with notches or camera cutouts.
- [ ] Game suspends cleanly when backgrounded and recovers without visual glitches.
- [ ] Android hardware back button opens the pause menu rather than force-quitting the app.
- [ ] Player save data and settings persist reliably across application restarts.
- [ ] Zero direct imports of `@capacitor/*` in game logic.
