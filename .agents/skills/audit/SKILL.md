---
name: audit
description: >-
  Runs static analysis, TypeScript type checking, production bundle builds,
  and defensive gameplay/performance checks across all HTML5 3D games.
  Use when the user types /audit or asks for a full codebase quality inspection.
---

# /audit — Full Workspace Quality & Gameplay Audit

Conducts an automated health check across all active games dynamically registered in root `games.json`.

## Audit Steps

1. **Static Analysis & Types:**
   Read `games.json` at the workspace root and run `npm run typecheck --silent` across every registered game directory.

2. **Production Bundle & Budget Check:**
   Run `npm run build --silent` across all registered games:
   - Verify `dist/` bundle size is strictly `< 5 MB`.
   - Verify zero external network calls in `index.html`.

3. **Rule Compliance Checks:**
   - **Art Direction:** Stylized Toony Soft Daylight (`32-daylight-and-lighting.md`) — no pitch black voids or overexposed hospital whites.
   - **Monetization Hooks:** 3 mandatory rewarded ad hooks (`65-monetization-ads.md`).
   - **Performance:** Zero heap allocations in hot paths (`20-performance-budget.md`).

4. **Output Report (Aircraft Maintenance Log Schema, ≤ 6 Lines):**
   - **DISCREPANCY:** Identified type errors, build failures, or rule non-compliances.
   - **ROOT CAUSE:** File, module, or assets violating budgets or standards.
   - **CORRECTIVE ACTION:** Direct mechanical fixes applied or logged to `backlog/studio-todo.json`.
   - **RETURN TO SERVICE:** All games verified healthy (`npm run typecheck --silent && npm run build --silent`).
