---
name: shared-ui-ads-sync
description: >-
  Synchronizes and enforces the canonical Shared UI (3-Column Arcade Shell with
  Left Navigation Sidebar, Center 3D Stage, Right Ad Rail, and ResizeObserver — zero fullscreen mode)
  and Shared Monetization (UniversalAdProvider, 5 Portal Adapters, Disabled Ad State, Mock Ad Reel) across all games.
---

# Shared UI & Monetization Core Synchronizer (`shared-ui-ads-sync`)

Ensures that **every game in the workspace** shares the exact same 3-column UI shell and advertising architecture from a single source of truth (`shared/`).

## 1. Single Source of Truth Files
- `shared/platform/ads.ts` — Canonical `IAdProvider` & `UniversalAdProvider` supporting YouTube Playables (`ytgame.ads`), CrazyGames, Yandex Games, Poki, and the standardized 2-second interactive `YOUTUBE PLAYABLES REWARD REEL // SPONSOR` modal, plus automatic `body.ads-unavailable` disabled-state synchronization.
- `shared/ui/shell-controller.ts` — Canonical `ShellController` managing:
  - `ResizeObserver` canvas stage resizing and `../games.json` SVG icon discovery in the Left Navigation Sidebar (active games only).
  - Universal Minimalist Theme-Matched Start Menu Overlay (`#shell-start-menu`) over a live 3D background with `backdrop-filter: blur(12px)`.
  - Initial `MENU` State Lock (`shell.isMenuOpen = true` on boot so physics, timers, enemies, and controls wait until `OYNA` is clicked).
  - Difficulty Selection (`Kolay` / `Normal` / `Zor` -> `shell.getDifficultyMultiplier()`) and `ESC` / top-right `⏸` Pause menu toggle.
- `shared/ui/arcade-shell.css` — Canonical 3-column layout (Left Navigation Sidebar `.shell-sidebar-left` + Center Stage `.shell-stage` + Right Ad Rail `.shell-sidebar-right`), `backdrop-filter: blur(12px)` Start Menu overlay with `--menu-theme-color` / `--menu-accent-gradient` variables, `.is-menu-locked` HUD hiding, and offline/adblock disabled button rules.

## 2. Automated Synchronization & Verification Command
Run from workspace root after creating or modifying any game:
```powershell
node scripts/sync-shared-core.mjs
```
To verify without writing (CI / pre-flight check):
```powershell
node scripts/sync-shared-core.mjs --check
```
