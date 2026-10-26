---
trigger: model_decision
description: "YouTube Playables native monetization, universal portal ad adapter (Yandex, CrazyGames, Poki), UI design standards, and disabled-state ad availability policy."
---

# Monetization & Ad Standards Policy

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
  isRewardedReady(): boolean;
  onAvailabilityChange?(callback: (isReady: boolean) => void): void;
}
```

### Universal Runtime Detection
1. **YouTube Playables (`window.ytgame?.IN_PLAYABLES_ENV`):**
   - Must strictly verify `window.ytgame.IN_PLAYABLES_ENV === true` before invoking native SDK methods.
   - `showInterstitial()` calls `await ytgame.ads.requestInterstitialAd()`.
   - `showRewarded()` calls `await ytgame.ads.requestRewardedAd()`.
2. **Web Portals (`YaGames`, `CrazyGames.SDK`, `PokiSDK`):**
   - Automatically maps rewarded and interstitial calls to the active portal SDK without requiring manual code changes.
3. **GitHub Pages & Local Preview (`MockAdProvider`):**
   - When running on GitHub Pages or locally (`!IN_PLAYABLES_ENV` and no external portal SDK), renders an interactive 2-second simulation reel so all reward callbacks can be tested.

---

## 3. Ad Availability & Disabled State Invariant (Mandatory)

> [!IMPORTANT]
> **Disable or Hide Ad Buttons When Ads Are Unavailable:**
> If the player is offline (`!navigator.onLine`), an ad blocker is active, or the platform ad inventory returns empty (`isRewardedReady() === false`), all ad-dependent buttons and badges **must be automatically disabled (grayed out) or hidden**.

### Implementation Rules:
1. **`isRewardedReady(): boolean` Check:**
   - Always query `ads.isRewardedReady()` when rendering ad buttons and before displaying rewarded modals.
2. **Visual Disabled State:**
   - **Hide:** Where an alternative action exists (e.g., on the Level Complete screen, keep only the standard "Claim / Next" button and hide the 3x Multiplier button).
   - **Disable:** If an in-level booster button remains visible with `count === 0` and no ad available, apply `opacity: 0.35; pointer-events: none; cursor: not-allowed;` and display a `🎬 NO AD` / `🎬 REKLAM YOK` label.
3. **Never Mislead the Player:** Never leave an ad button clickable if clicking it will fail silently or do nothing.

---

## 4. UI & Design Standards (3 Mandatory Revenue Hooks)

Every game must implement all 3 rewarded revenue hooks adhering to these visual and functional standards:

### Hook 1: In-Level Rescue Booster
* **Design:** Bottom bar or header booster buttons with a clear `[🎬 FREE]` or `[🎬 REKLAM]` badge when stock is `0`.
* **Action:** Clicking triggers a rewarded ad immediately; upon completion, the booster (Hammer, Hint, Shield, Extra Slot, Swap, Move) is granted or activated immediately.

### Hook 2: Near-Miss Revive Modal
* **Design:** High-contrast alert card (`SO CLOSE!` / `ÇOK YAKLAŞTIN!`) shown when the player runs out of moves, fills the buffer dock, or crashes near a milestone.
* **Button Style:** Glowing emerald green gradient (`linear-gradient(135deg, #10b981, #059669)`), labeled `🎬 WATCH & CONTINUE (+SHIELD / +MOVES / +SLOTS)`.
* **Ad Unavailable:** If `isRewardedReady() === false`, bypass or hide the revive button and offer standard retry.

### Hook 3: Victory Multiplier Needle Bar
* **Design:** Oscillating needle bar (`1.5x -> 2x -> 3x -> 5x -> 3x -> 2x -> 1.5x`) shown on the Level Complete / Victory modal.
* **Button Style:** Golden/amber gradient (`linear-gradient(135deg, #f59e0b, #d97706)`), dynamically updating the reward amount as the needle moves.
* **Ad Unavailable:** If `isRewardedReady() === false`, hide the multiplier claim button and present only the base coin reward.

---

## 5. Mock Ad Overlay Design Standard (`MockAdProvider`)

When running on GitHub Pages or local dev preview, the simulated ad overlay must follow a consistent layout:
* **Backdrop:** `rgba(3, 7, 18, 0.95)` frosted dark glass (`backdrop-filter: blur(8px)`).
* **Header:** Small cyan tracking badge: `YOUTUBE PLAYABLES REWARD REEL // SPONSOR`.
* **Countdown:** Centered 2-second timer (`2s` -> `1s` -> `TAMAMLANDI! ✓`).
* **Button:** Disabled during countdown (`LÜTFEN BEKLEYİN...`), turning emerald green when finished (`ÖDÜLÜ AL & DEVAM ET`).

---

## 6. Shared Core Synchronization (`shared/platform/ads.ts` & `scripts/sync-shared-core.mjs`)

- `shared/platform/ads.ts` is the **Single Source of Truth** for `IAdProvider` and `UniversalAdProvider` across all games.
- Never write divergent `ads.ts` implementations per game; always execute `node scripts/sync-shared-core.mjs` to synchronize the canonical ad provider and `body.ads-unavailable` disabled-state rules across all games.
