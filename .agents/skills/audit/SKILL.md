---
name: audit
description: >-
  Runs static analysis, TypeScript type checking, production bundle builds,
  and defensive gameplay/performance checks across all HTML5 3D games.
  Use when the user types /audit or asks for a full codebase quality inspection.
---

# /audit — Full Workspace Quality & Gameplay Audit

Conducts an automated health check across all active games registered in root `games.json` (`hexa-sort-3d`, `screw-jam-3d`, `color-block-jam-3d`, `cyber-arrow-3d`, `cyber-flap`).

## Audit Steps

1. **Static Analysis & Types:**
   Read `games.json` at the workspace root and run `npm run typecheck` across every game directory:
   - `npm --prefix hexa-sort-3d run typecheck`
   - `npm --prefix screw-jam-3d run typecheck`
   - `npm --prefix color-block-jam-3d run typecheck`
   - `npm --prefix cyber-arrow-3d run typecheck`
   - `npm --prefix cyber-flap run typecheck`

2. **Production Bundle & Budget Check:**
   Run `npm run build` across all games:
   - Verify `dist/` bundle size is strictly `< 5 MB`.
   - Verify zero external network calls in `index.html`.

3. **Rule Compliance Checks:**
   - **Art Direction:** Stylized Toony Soft Daylight (`32-daylight-and-lighting.md`) — no pitch black voids or overexposed hospital whites.
   - **Monetization Hooks:** 3 mandatory rewarded ad hooks (`65-monetization-ads.md`).
   - **Performance:** Zero heap allocations in hot paths (`20-performance-budget.md`).

4. **Output Report:**
   Present a concise Turkish table with results per game:
   `Typecheck (OK/Fail) | Build (OK/Fail) | Bundle Size | Art/Rules | Verdict`
