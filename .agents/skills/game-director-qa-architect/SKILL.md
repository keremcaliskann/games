---
name: game-director-qa-architect
description: Inspects all active games in parallel batches as a Senior Game Director & Lead QA Architect using lightweight flash subagents, identifies bugs, mechanical upgrades, and visual polish tasks, prioritizes them in backlog/studio-todo.json, and outputs a concise Turkish post-run report.
metadata:
  icon: verified
---

# Game Director QA & To-Do Architect (`game-director-qa-architect`)

This skill operates **Producer B** of the autonomous multi-agent studio pipeline (`12-multi-agent-orchestration.md` & `15-game-studio-pipeline.md`). Rather than reading 12+ games sequentially in one context window, the Lead QA Architect dispatches **parallel `research` subagents (`Model: "flash"`)** across 3–4 game batches, aggregates their findings, and queues prioritized `P0 / P1 / P2` tickets into **`backlog/studio-todo.json`**.

> **STRICT PRODUCER ROLE (QUEUE ONLY — ZERO DIRECT CODE EDITS):** The QA Architect's sole purpose is to inspect, audit, critique, and add prioritized `P0 / P1 / P2` tasks to `backlog/studio-todo.json`. It **DOES NOT write or modify game code directly**. All coding and implementation work is reserved strictly for the Consumer (`/studio`).

---

## 1. 5 Core Audit Responsibilities (Evaluated per Batch Subagent)

1. **Rule Compliance Verification:**
   - `10-code-quality.md`: Strict TypeScript, zero orphans.
   - `20-performance-budget.md`: 60 FPS, `< 50 MB` bundle, zero hot-path heap allocations.
   - `25-defensive-gameplay-and-hardening.md`: `data-hud-interactive="true"`, state transition idempotency latches, `!shell.isMenuOpen` Start Menu lock.
   - `32-daylight-and-lighting.md`: Stylized Toony Soft Daylight (`0xcfe8f7` sky, warm sunlight `0xfff6e5`, biscuit ground `0xfcf8ee`, `toneMappingExposure <= 0.90`, `environmentIntensity <= 0.30`).
   - `55-arcade-layout-and-shell.md`: 3-column `#arcade-shell` + Minimalist Theme-Matched Start Menu Overlay (`#shell-start-menu`).
   - `65-monetization-ads.md`: Shared `UniversalAdProvider` + all 3 Rewarded Ad revenue hooks.
2. **Feature & Gameplay Health Verification (`P0` / `P1`):**
   - Spawn invulnerability, AI bot unstuck steering, stage transition triggers, camera-relative input projection, and audio mute sync.
3. **Code & Performance Inspection (`P1`):**
   - Inspect hot paths (`update`, `fixedUpdate`, `render`) for `new THREE.Vector3()`, `.map()`, `.filter()`, or closures.
4. **Visual & 3D Prefab Critique (`P2`):**
   - Identify primitive box/cylinder meshes in `PrefabFactory.ts` that should be upgraded to `ProceduralMeshBuilder` compound assemblies or `AssetResolver` hybrid `.glb` models.
5. **Retention & Progression Depth (`P1`):**
   - Multi-biome/map variety, Garage/Upgrade loop feel, and difficulty pacing (`Kolay / Normal / Zor`).

---

## 2. Execution Workflow (5 Steps)

### Step 1: Load Active Games & Current To-Do Queue
1. Read `games.json` at the workspace root and filter only active games (`active !== false`).
2. Read `backlog/studio-todo.json` to inspect existing `ready`, `in_progress`, and `completed` tasks (never queue duplicate tasks).

### Step 2: Run Shared Core Sync & Build Health
1. Run `node scripts/sync-shared-core.mjs` to ensure universal UI/Ads/Render/Input synchronization.

### Step 3: Dispatch Parallel Batch Inspector Subagents (`invoke_subagent`)
1. Partition active games into batches of 3–4 games.
2. Launch parallel `research` subagents (`Model: "flash"`) — one per batch.
3. Instruct each subagent to inspect its assigned games across the 5 pillars and return concrete, file-level ticket objects (`id`, `gameId`, `priority`, `score`, `type`, `title`, `description`, `targetFiles`).

### Step 4: Aggregate, Re-Rank & Push `backlog/studio-todo.json`
1. Merge non-duplicate tickets from all batch subagents into `backlog/studio-todo.json`.
2. Sort all `status === "ready"` items strictly by `priority` (`P0` -> `P1` -> `P2`) and descending `score`.
3. Commit and push `backlog/studio-todo.json` to `origin/main`.

### Step 5: Mandatory Concise Post-Run Report & Simple Task List (in Turkish)
1. **ASD-STE100 Maintenance Log Summary (`<= 6 lines`, max 20 words per sentence):**
   - `DISCREPANCY / ROOT CAUSE / CORRECTIVE ACTION / RETURN TO SERVICE`
2. **Basit Aktif Görev Listesi Tablosu:**
   - `backlog/studio-todo.json` içindeki tüm aktif (`status: ready`) görevleri tablo halinde sun (Öncelik, Oyun, Görev Başlığı, Skor).
