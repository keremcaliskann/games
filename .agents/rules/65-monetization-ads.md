---
trigger: model_decision
description: "Game monetization, ad providers, rewarded ads, interstitials, banners, and platform ad abstraction."
---

# Monetization & Ad Integration Policy

## 1. Architectural Boundary
All advertising logic must be abstracted behind an interface in `src/platform/ads.ts`. Game logic and UI must never call platform-specific SDKs (AdMob, Poki, CrazyGames) directly.

```
game/systems/economy.ts ──> platform/ads.ts ──> [ MockAdProvider | CapacitorAdMob | Poki / CrazyGames ]
```

## 2. Standard `IAdProvider` Interface

```ts
export interface IAdProvider {
  initialize(): Promise<void>;
  showInterstitial(): Promise<boolean>;
  showRewarded(): Promise<boolean>;
  showBanner(): Promise<void>;
  hideBanner(): Promise<void>;
  isRewardedReady(): boolean;
}
```

## 3. Provider Implementations
- **`MockAdProvider` (Default in Dev / Local):**
  - Renders a clean in-game cyberpunk/minimal modal simulating ad playback (countdown 2s, Watch / Skip / Close).
  - Ensures game testing, UI state transitions, and reward callbacks function identically with zero network dependencies.
- **`CapacitorAdMobProvider` (Mobile Android / iOS):**
  - Uses `@capacitor-community/admob` inside `src/platform/`.
  - Safely verifies native availability before calling platform bridge.
- **`WebAdProvider` (Poki / CrazyGames / GameDistribution):**
  - Connects to HTML5 portal SDKs when hosted on web game aggregator sites.

## 4. Monetization Invariants
1. **Never block the game loop:** Ad calls are asynchronous promises; never freeze or pause simulation tick logic awaiting network ad responses.
2. **Audio mute sync:** Suspend `SoundController` audio during ad display and restore original mute state on ad dismissal.
3. **Graceful degradation:** If an ad fails to load, is closed early, or an ad-blocker is detected, handle gracefully without crashing or soft-locking the UI.
4. **Ad cadence & UX respect:**
   - Interstitials: Only on level transitions or natural game-over pauses; never during active gameplay.
   - Minimum interval: At least 90–120 seconds between natural interstitial triggers.
   - Rewarded ads: Always opt-in by player action (hints, double coins, continues).
