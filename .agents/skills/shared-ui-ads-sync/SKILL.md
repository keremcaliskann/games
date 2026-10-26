---
name: shared-ui-ads-sync
description: >-
  Synchronizes and enforces the canonical Shared UI (3-Column Dual-Mode Arcade Shell,
  ResizeObserver, Fullscreen Banner, Cross-Discovery Sidebar) and Shared Monetization
  (UniversalAdProvider, 5 Portal Adapters, Disabled Ad State, Mock Ad Reel) across all games.
---

# Shared UI & Monetization Core Synchronizer (`shared-ui-ads-sync`)

Ensures that **every game in the workspace** shares the exact same UI shell and advertising architecture from a single source of truth (`shared/`).

## 1. Single Source of Truth Files
- `shared/platform/ads.ts` — Canonical `IAdProvider` & `UniversalAdProvider` supporting YouTube Playables (`ytgame.ads`), CrazyGames, Yandex Games, Poki, and the standardized 2-second interactive `YOUTUBE PLAYABLES REWARD REEL // SPONSOR` modal, plus automatic `body.ads-unavailable` disabled-state synchronization.
- `shared/ui/shell-controller.ts` — Canonical `ShellController` & `applyDualModeShell()` managing embedded full-viewport detection, `ResizeObserver` canvas stage resizing, `#shell-restart-btn` (`arcade:restart` with debounce), `#shell-fullscreen-btn`, and `../games.json` SVG icon discovery.
- `shared/ui/arcade-shell.css` — Canonical 3-column desktop layout, mobile/tablet responsive collapse, fullscreen sticky sponsor banner, and offline/adblock disabled button rules.

## 2. Automated Synchronization & Verification Command
Run from workspace root after creating or modifying any game:
```powershell
node scripts/sync-shared-core.mjs
```
To verify without writing (CI / pre-flight check):
```powershell
node scripts/sync-shared-core.mjs --check
```
