---
name: audit
description: >-
  Runs static analysis, TypeScript type checking, production bundle builds,
  and defensive gameplay/performance checks across all HTML5 3D games.
  Use when the user types /audit or asks for a full codebase quality inspection.
---

# /audit — Full Workspace Quality & Gameplay Audit (Read-Only Inspector & Queueing)

Conducts an automated health check, rule verification, performance inspection, and design critique across all active games dynamically registered in root `games.json`.

> **STRICT AUDIT POLICY (QUEUE ONLY):** The audit pass is strictly an inspector and producer. It **DOES NOT modify game code directly**. All identified bugs, performance optimizations, visual juice, and mechanical depth upgrades must **ONLY be logged into `backlog/studio-todo.json`** for the Studio Executor (`/studio`) to implement.

## Audit Steps

1. **Shared UI & Monetization Core Sync:**
   Run `node scripts/sync-shared-core.mjs` to verify synchronization of `shared/platform/ads.ts`, `shared/ui/shell-controller.ts`, and `shared/ui/arcade-shell.css`.

2. **Rule Compliance Verification:**
   Audit all games against latest rules in `AGENTS.md` and `.agents/rules/`:
   - **Art Direction:** Stylized Toony Soft Daylight (`32-daylight-and-lighting.md`) — pastel sky `0xcfe8f7`, warm key sunlight, biscuit boards, zero dark voids, zero blown-out white.
   - **Monetization Hooks:** 3 mandatory rewarded ad hooks (`65-monetization-ads.md`) and ad-disabled latching.
   - **Defensive Gameplay:** Pointerdown HUD isolation (`data-hud-interactive="true"`), single-shot transition latches, preflight `loadData`.

3. **Feature, Input Ergonomics & Gameplay Health Verification (`50-input-abstraction.md` / `universal-input-ergonomics`):**
   - Verify camera-relative axis alignment (zero inverted Left/Right on `+Z` cameras), floating virtual thumbsticks with dynamic anchors, direct point-and-aim + hover tracking, dual-mode puzzle manipulation (Tap-to-Place + Drag-and-Drop), and magnetic raycast tap assist (`>= 18px` tap tolerance).
   - Verify camera angles/bounds (9:16 portrait and 16:9 landscape), audio mute sync, and level solvability.

4. **Code & Performance Inspection (No Direct Edits):**
   - Inspect hot paths (`update`, `fixedUpdate`, `render`) for heap allocations (`new THREE.Vector3`, array spreads, closures) and performance bottlenecks.
   - Do NOT apply code changes in audit; record them as concrete file-level tickets in `backlog/studio-todo.json`.

5. **Static Analysis & Production Bundle Check:**
   - Run `npm run typecheck --silent` across all registered games.
   - Run `npm run build --silent` across all registered games: verify `dist/` bundle size is strictly `< 50 MB`, zero external network calls in `index.html`.

6. **Self-Feedback & Backlog Queueing (`backlog/studio-todo.json`):**
   - Extract design, visual, performance, and mechanical critique notes.
   - Queue all discovered items into `backlog/studio-todo.json` prioritized as `P0` (blockers), `P1` (mechanics/performance), `P2` (visual juice).
   - Commit and push `backlog/studio-todo.json` to `origin/main`.

7. **Output Report (Aircraft Maintenance Log + Simple Task List):**
   - Provide the concise ASD-STE100 summary (`DISCREPANCY / ROOT CAUSE / CORRECTIVE ACTION / RETURN TO SERVICE`).
   - Immediately append a **Simple Task List** showing all active `ready` tasks in `backlog/studio-todo.json` (Priority, Game, Task Title).
