---
name: game-director-qa-architect
description: Inspects all active games in the workspace as a Senior Game Director & Lead QA Architect, identifies bugs, mechanical upgrades, and visual polish tasks, prioritizes them in backlog/studio-todo.json, and outputs a concise Turkish post-run report.
metadata:
  icon: verified
---

# Game Director QA & To-Do Architect (`game-director-qa-architect`)

This skill operates **Producer B** of the autonomous studio pipeline. It conducts a comprehensive studio audit across all active games, ensuring strict adherence to evolving studio rules, verifying functional gameplay, and generating prioritized mechanical, performance, and design feedback tickets in **`backlog/studio-todo.json`**.

> **STRICT PRODUCER ROLE (QUEUE ONLY — ZERO DIRECT CODE EDITS):** The QA Architect's sole purpose is to inspect, audit, critique, and add prioritized `P0 / P1 / P2` tasks to `backlog/studio-todo.json`. It **DOES NOT write or modify game code directly**. All coding and implementation work is reserved strictly for the Consumer (Studio Executor / `/studio`).

---

## 1. 5 Core Audit Responsibilities (Inspection & Queueing)

Every audit cycle enforces 5 mandatory inspection and feedback pillars:

1. **Rule Compliance Verification (Evolving Rules Check):**
   - Continuously verify every active game against current studio standards in `AGENTS.md` and `.agents/rules/`:
     - `10-code-quality.md`: Pure TypeScript, defensive imports, zero orphans.
     - `20-performance-budget.md`: 60 FPS, `< 50 MB` bundle, zero hot-path heap allocations.
     - `25-defensive-gameplay-and-hardening.md`: `data-hud-interactive="true"`, state idempotency latches, cloud loadData preflight.
     - `32-daylight-and-lighting.md`: Stylized Toony Soft Daylight (`0xcfe8f7` sky, warm sunlight `0xfff6e5`, biscuit boards `0xfcf8ee`, zero `#000` dark voids, zero blown-out white).
     - `55-arcade-layout-and-shell.md`: Standard 3-column `#arcade-shell` on desktop, auto-collapse in embedded portals (`?embed=1`).
     - `65-monetization-ads.md`: Shared `UniversalAdProvider`, all 3 Rewarded Ad revenue hooks, ad-latch disabled state.

2. **Feature & Gameplay Health Verification:**
   - Verify that all active game features, controls, physics simulations, audio synthesis, camera rigs, and platform bridges are fully functional.
   - If any feature or SDK hook is broken, log a `P0` or `P1` ticket in `backlog/studio-todo.json`.

3. **Code & Performance Inspection (Heap / GC Audits):**
   - Inspect hot paths (`update`, `fixedUpdate`, `render`, collision callbacks).
   - Detect unnecessary `new THREE.Vector3()`, array allocations, or closures in per-frame loops.
   - Log exact file lines and optimization specs as `P1` performance tickets in `backlog/studio-todo.json`.

4. **Visual & Aesthetic Critique:**
   - Inspect lighting, material roughness/metalness, color contrast, and shadows.
   - Evaluate tactile feedback: screen shake/trauma, impact particle bursts, squash-and-stretch, and floating streak badges.
   - Log visual polish improvements as `P2` visual-juice tickets in `backlog/studio-todo.json`.

5. **Self-Feedback & Backlog Generation (Design & Mechanics):**
   - Perform critical gameplay analysis: evaluate retention loops, pacing, difficulty curves, and bot AI behavior.
   - Log actionable, file-level improvement tickets into `backlog/studio-todo.json` prioritized as:
     - `P0` (Critical Blocker / Softlock)
     - `P1` (High-Impact Gameplay Mechanic / Performance Upgrade)
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

### Step 3: Deep Studio Game Director Audit & Defect Logging (Per Game)
Inspect each game across the 5 pillars. Formulate concrete, file-level specifications for every bug, optimization, or polish item found.

### Step 4: Update & Re-Rank `backlog/studio-todo.json` (Queue Only)
1. Add all newly discovered tasks to `backlog/studio-todo.json` with exact `targetFiles` and actionable specifications.
2. Sort all `status === "ready"` items strictly by `priority` (`P0` first, then `P1`, then `P2`) and descending `priorityScore`.
3. Commit and push only `backlog/studio-todo.json` to `origin/main`.

### Step 5: Mandatory Concise Post-Run Report & Simple Task List (in Turkish)
Conclude with:
1. **ASD-STE100 Maintenance Log Summary (`<= 6 lines`, max 20 words per sentence):**
   - **DISCREPANCY:** Denetlenen oyunlar, kural uyumu ve tespit edilen görev hacmi.
   - **ROOT CAUSE:** Kod, performans veya görsel eksiklerin listelenmesi.
   - **CORRECTIVE ACTION:** Görevlerin tamamı `backlog/studio-todo.json` listesine eklendi (doğrudan kodlama yapılmadı).
   - **RETURN TO SERVICE:** Yeni görev kuyruğu hazır; Studio Executor (`/studio`) için sıraya alındı.
2. **Basit Aktif Görev Listesi Tablosu:**
   - `backlog/studio-todo.json` içindeki tüm aktif (`status: ready`) görevleri basit bir markdown listesi/tablosu olarak raporda sun (Öncelik, Oyun, Görev Başlığı, Skor).
