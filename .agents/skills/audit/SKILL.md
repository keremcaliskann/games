---
name: audit
description: >-
  Runs static analysis, TypeScript type checking, production bundle builds,
  and defensive gameplay/performance checks across all HTML5 3D games.
  Use when the user types /audit or asks for a full codebase quality inspection.
---

# /audit — Full Workspace Quality & Gameplay Audit

Conducts an automated health check, rule verification, code optimization, and design critique across all active games dynamically registered in root `games.json`.

## Audit Steps

1. **Shared UI & Monetization Core Sync:**
   Run `node scripts/sync-shared-core.mjs` from the workspace root to verify and synchronize `shared/platform/ads.ts`, `shared/ui/shell-controller.ts`, and `shared/ui/arcade-shell.css` across all games.

2. **Rule Compliance Verification:**
   Audit games against latest rules in `AGENTS.md` and `.agents/rules/`:
   - **Art Direction:** Stylized Toony Soft Daylight (`32-daylight-and-lighting.md`) — pastel sky `0xcfe8f7`, warm key sunlight, biscuit boards, zero dark voids, zero blown-out white.
   - **Monetization Hooks:** 3 mandatory rewarded ad hooks (`65-monetization-ads.md`) and ad-disabled latching.
   - **Defensive Gameplay:** Pointerdown HUD isolation (`data-hud-interactive="true"`), single-shot transition latches, preflight `loadData`.

3. **Feature & Gameplay Health Verification:**
   - Verify core controls, camera angles/bounds (9:16 portrait and 16:9 landscape), audio mute sync, and level solvability.

4. **Code Inspection & Direct Optimizations:**
   - Inspect hot paths (`update`, `fixedUpdate`, `render`) for heap allocations (`new THREE.Vector3`, array spreads, closures).
   - Apply direct surgical optimizations and bugfixes when detected.

5. **Static Analysis & Production Bundle Check:**
   - Run `npm run typecheck --silent` across all registered games.
   - Run `npm run build --silent` across all registered games: verify `dist/` bundle size is strictly `< 5 MB`, zero external network calls in `index.html`.

6. **Self-Feedback & Backlog Extraction:**
   - Extract design and mechanical critique notes, queueing new `P0 / P1 / P2` tasks into `backlog/studio-todo.json` when deeper upgrades are identified.

7. **Output Report (Aircraft Maintenance Log Schema, ≤ 6 Lines):**
   - **DISCREPANCY:** Identified type errors, build failures, or rule non-compliances.
   - **ROOT CAUSE:** File, module, or assets violating budgets or standards.
   - **CORRECTIVE ACTION:** Direct mechanical/visual fixes applied and tasks logged to `backlog/studio-todo.json`.
   - **RETURN TO SERVICE:** All games verified healthy (`npm run typecheck --silent && npm run build --silent`).
