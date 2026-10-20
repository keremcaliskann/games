---
trigger: model_decision
description: "YouTube Playables native monetization, universal portal ad adapter (Yandex, CrazyGames, Poki), and 3 mandatory high-conversion rewarded ad revenue hooks."
---

# Monetization & Revenue Optimization Policy

## 1. Architectural Boundary
All advertising and monetization logic must reside behind a unified interface in `src/platform/ads.ts`. Game systems and UI components must never invoke platform SDKs directly.

```
game/systems/economy.ts ──> platform/ads.ts (UniversalAdProvider)
                              ├── 1. YouTube Playables (ytgame.ads)
                              ├── 2. Yandex Games (ysdk.adv)
                              ├── 3. CrazyGames (CrazyGames.SDK.ad)
                              ├── 4. Poki (PokiSDK)
                              └── 5. MockAdProvider (GitHub Pages / Local Dev)
```

---

## 2. Standard `IAdProvider` Interface

```ts
export interface IAdProvider {
  initialize(): Promise<void>;
  showInterstitial(placement?: string): Promise<boolean>;
  showRewarded(placement?: string): Promise<boolean>;
  showBanner(): Promise<void>;
  hideBanner(): Promise<void>;
  isRewardedReady(): boolean;
}
```

### Universal Runtime Resolution (`src/platform/ads.ts`)
1. **YouTube Playables (`window.ytgame?.IN_PLAYABLES_ENV`):**
   - `showInterstitial()` calls `await ytgame.ads.requestInterstitialAd()`.
   - `showRewarded()` calls `await ytgame.ads.requestRewardedAd()`.
   - Strictly zero third-party ad scripts or external IAP gateways (prohibited by YouTube Playables policy).
2. **Yandex Games (`window.YaGames`):**
   - Maps to `ysdk.adv.showFullscreenAdv()` and `ysdk.adv.showRewardedVideo()`.
3. **CrazyGames (`window.CrazyGames?.SDK`):**
   - Maps to `CrazyGames.SDK.ad.requestAd('midgame')` and `CrazyGames.SDK.ad.requestAd('rewarded')`.
4. **Poki (`window.PokiSDK`):**
   - Maps to `PokiSDK.commercialBreak()` and `PokiSDK.rewardedBreak()`.
5. **`MockAdProvider` (GitHub Pages Portal / Local Dev Fallback):**
   - Renders a sleek in-game simulated ad overlay (2-second countdown with `Claim Reward` / `Close` controls) so all revenue hooks are 100% testable on GitHub Pages.

---

## 3. Mandatory In-Game Revenue Hooks (Revenue-First Design)

To maximize eCPM, session retention, and ad conversion on YouTube Playables and web portals, **every game must implement all 3 core Rewarded Ad (`showRewarded`) loops**:

### Hook 1: In-Level Rescue Boosters (Sıkışma Çözücü Güçlendiriciler)
- Provide 2–3 tactile bottom-bar power-ups tailored to the core mechanic (e.g., **Hammer/Destroy**, **Hint/Auto-Solve**, **Extra Dock Slot**, **Shuffle**, **Undo**).
- Players can purchase boosters with soft currency (Coins) **OR** tap a prominent `🎬 FREE / AD` badge when out of coins to trigger `showRewarded('booster_<type>')` and immediately apply the power-up.

### Hook 2: "Near-Miss" Revive / Continue (Kıl Payı Devam Etme)
- When a player runs out of moves, dock slots, or time, display a high-contrast **"So Close!" / "Son 1 Hamle!"** modal before transitioning to full defeat.
- Offer a primary pulsing CTA button (`🎬 Watch Ad for +3 Moves / Clear Dock`) calling `showRewarded('revive')`, paired with a secondary delayed/subtle `No Thanks, Retry` button.

### Hook 3: Victory 2x/3x/5x Moving Multiplier Bar (Bölüm Sonu Çarpan İbresi)
- On the Level Complete screen, display an oscillating multiplier needle (`1.5x | 2x | 3x | 5x | 3x | 2x | 1.5x`).
- Primary CTA button dynamically shows `🎬 Claim +[Base * Multiplier] Coins` via `showRewarded('victory_multiplier')`, alongside a standard `Claim +[Base] Coins` button.

---

## 4. Interstitial Ad Cadence & UX Invariants
1. **Natural Breakpoints Only:** Trigger `showInterstitial()` exclusively at level transitions or after clicking standard `Claim` / `Retry` buttons — never mid-action.
2. **Cooldown Enforcement:** Enforce a strict minimum **90–120 second cooldown** between interstitial ads (and skip an interstitial immediately following a voluntary Rewarded Ad) to preserve session retention and watch-time.
3. **Audio & Clock Sync:** Automatically mute `SoundController` and pause `GameClock` before requesting any ad, and restore previous states inside the `finally` block.
4. **Graceful Failure:** If an ad request fails, times out, or is skipped, resolve cleanly (`false`) without locking UI controls.
