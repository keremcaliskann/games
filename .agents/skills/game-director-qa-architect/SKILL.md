---
name: game-director-qa-architect
description: Inspects all active games in the workspace as a Senior Game Director & Lead QA Architect, identifies bugs, mechanical upgrades, and visual polish tasks, prioritizes them in backlog/studio-todo.json, and outputs a concise Turkish post-run report.
metadata:
  icon: verified
---

# Game Director QA & To-Do Architect (`game-director-qa-architect`)

This skill operates **Producer B** of the autonomous studio pipeline. It conducts a comprehensive studio audit across all active games, ensuring strict adherence to evolving studio rules, verifying functional gameplay, directly implementing performance and visual optimizations, and generating prioritized mechanical and design feedback tickets in **`backlog/studio-todo.json`**.

---

## 1. 5 Core Audit Responsibilities

Every audit cycle enforces 5 mandatory inspection and improvement pillars:

1. **Rule Compliance Verification (Evolving Rules Check):**
   - Continuously verify every active game against current studio standards in `AGENTS.md` and `.agents/rules/`:
     - `10-code-quality.md`: Pure TypeScript, defensive imports, zero orphans.
     - `20-performance-budget.md`: 60 FPS, `< 5 MB` bundle, zero hot-path heap allocations.
     - `25-defensive-gameplay-and-hardening.md`: `data-hud-interactive="true"`, state idempotency latches, cloud loadData preflight.
     - `32-daylight-and-lighting.md`: Stylized Toony Soft Daylight (`0xcfe8f7` sky, warm sunlight `0xfff6e5`, biscuit boards `0xfcf8ee`, zero `#000` dark voids, zero blown-out white).
     - `55-arcade-layout-and-shell.md`: Standard 3-column `#arcade-shell` on desktop, auto-collapse in embedded portals (`?embed=1`).
     - `65-monetization-ads.md`: Shared `UniversalAdProvider`, all 3 Rewarded Ad revenue hooks, ad-latch disabled state.

2. **Feature & Gameplay Health Verification:**
   - Verify that all active game features, controls, physics simulations, audio synthesis, camera rigs, and platform bridges are fully functional.
   - Verify that interactive raycasting, particle bursts, and UI booster modals trigger without deadlocks or errors.

3. **Direct Code Optimization & Refinements:**
   - Inspect hot paths (`update`, `fixedUpdate`, `render`, collision callbacks).
   - Directly eliminate unnecessary `new THREE.Vector3()`, array allocations, or closures in per-frame loops.
   - Refactor repetitive logic and streamline entity/pool management.

4. **Visual & Aesthetic Polish:**
   - Inspect and enhance scene lighting, material roughness/metalness, color contrast, and shadows.
   - Enhance tactile feedback: screen shake/trauma, impact particle bursts, squash-and-stretch, and floating streak badges.

5. **Self-Feedback & Backlog Generation (Design & Mechanics):**
   - Perform critical gameplay analysis: evaluate retention loops, pacing, difficulty curves, and bot AI behavior.
   - Log actionable, file-level improvement tickets into `backlog/studio-todo.json` prioritized as:
     - `P0` (Critical Blocker / Softlock)
     - `P1` (High-Impact Gameplay Mechanic / Retention Upgrade)
     - `P2` (Visual Juice / ASMR Polish)

---

## 2. Execution Workflow (5 Steps)

### Step 1: Load Active Games, Rules & Current To-Do Queue
1. Read `games.json` at the workspace root to list all active released games.
2. Read `AGENTS.md` and check for recent rule changes in `.agents/rules/`.
3. Read `backlog/studio-todo.json` to inspect existing `ready`, `in_progress`, and `completed` tasks (never add duplicate tasks).

### Step 2: Run Shared Core Sync & Build Health
1. Run `node scripts/sync-shared-core.mjs` to ensure universal UI/Ads synchronization.
2. Run `npm run typecheck --silent` across all active game directories to detect any compilation or type regressions.

### Step 3: Deep Studio Game Director Audit & Direct Optimizations (Per Game)
Inspect each game across the 5 pillars. For immediate, low-risk code/visual optimizations or rule alignments, implement surgical edits directly.

### Step 4: Update & Re-Rank `backlog/studio-todo.json`
1. For multi-file or structural mechanical upgrades, add concrete tasks to `backlog/studio-todo.json` with exact `targetFiles` and actionable specifications.
2. Sort all `status === "ready"` items strictly by `priority` (`P0` first, then `P1`, then `P2`) and descending `priorityScore`.
3. Verify modified games with `npm run typecheck` and `npm run build`.
4. Commit and push the updated files to `origin/main`.

### Step 5: Mandatory Concise Post-Run Report (ASD-STE100 Schema, ≤ 6 Lines in Turkish)
Conclude with a **very short Turkish summary (`<= 6 lines`, max 20 words per sentence)**:
- **DISCREPANCY:** Denetlenen oyunlar, kural uyumu ve tespit edilen optimizasyon alanları.
- **ROOT CAUSE:** Eksik kural uyumlulukları, performans darboğazları veya mekanik eksikler.
- **CORRECTIVE ACTION:** Uygulanan doğrudan optimizasyonlar ve `studio-todo.json` listesine eklenen yeni görevler.
- **RETURN TO SERVICE:** `typecheck`, `build` ve `sync-shared-core` doğrulama durumu.
