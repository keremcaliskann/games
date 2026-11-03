---
name: inspect
description: >-
  Deeply inspects a single specified game (/inspect <game-name> or /inpect <game-name>)
  using 2 parallel specialist flash subagents (Mechanics/AI Inspector + Visual/3D Art Inspector),
  presents a categorized "Yapılması Gerekenler" checklist in Turkish, and waits for user
  approval before adding approved items to backlog/studio-todo.json.
---

# /inspect <oyun-adı> — Dual-Agent Single-Game Deep Inspector & Approval-Gated Todo Generator

Performs a surgical, dual-agent technical and design inspection of a single target game (`<oyun-adı>/`) when the user types `/inspect <oyun-adı>` or `/inpect <oyun-adı>`.

> **STRICT APPROVAL GATE:**
> 1. **Phase 1 (Dual-Subagent Inspect & Propose):** Read-only inspection. Do **NOT** modify the game's source code and do **NOT** write to `backlog/studio-todo.json` yet. Present the numbered **"Yapılması Gerekenler Listesi"** in Turkish and wait for user approval.
> 2. **Phase 2 (Queue on Approval):** Only after the user approves (all items or specific item numbers), append the approved tasks into `backlog/studio-todo.json` with status `"ready"` and commit/push.

---

## Phase 1: Dual-Subagent Deep Inspection Steps

1. **Resolve Target Game Directory & Typecheck:**
   - Match `<oyun-adı>` against active game directories in workspace root and `games.json` (fuzzy match supported, e.g., `hole-city` → `hole-city-io-3d`).
   - Run `npm --prefix <game-dir> run typecheck` to capture any TypeScript diagnostics.

2. **Dispatch 2 Parallel `research` Subagents (`Model: "flash"`):**
   Invoke two focused read-only subagents concurrently via `invoke_subagent`:
   - **Subagent 1 — `Mechanics, AI & Performance Inspector` (`src/game/**`, `src/input/**`, `src/core/**`, `src/main.ts`):**
     - **Hatalar & Buglar (`P0`):** Spawn-death race conditions, missing spawn invulnerability, stuck stage transitions, AI bot corner/target deadlocks, camera-relative input inversion, missing `!shell.isMenuOpen` lock, state transition double-triggers, or uncleaned explosion meshes/timers.
     - **Oynanış & Gelişim Hissiyatı (`P1`):** Speed/acceleration balance, tier/level-up progression feel, multi-map/biome variety, difficulty scaling (`Kolay / Normal / Zor`), and hot-path heap allocations (`new THREE.Vector3`, `.map()`, `.filter()` inside `update`).
   - **Subagent 2 — `Visual, Soft Daylight & 3D Prefab Inspector` (`src/render/**`, `src/ui/**`, `index.html`):**
     - **Görsel İyileştirme Önerileri (`P2`):** Stylized Soft Daylight compliance (`32-daylight-and-lighting.md` — check for washed-out white `environmentIntensity > 0.35` / `toneMappingExposure > 0.92` or dark voids), ground/landmark color contrast, primitive box placeholders in `PrefabFactory.ts` that should be upgraded to `ProceduralMeshBuilder` compound meshes, particle/shockwave juice, and HUD pointer isolation (`data-hud-interactive="true"`).

3. **Synthesize & Output Format (Turkish "Yapılması Gerekenler Listesi"):**
   Combine findings from both subagents into a concise, scannable report in Turkish with clickable file/line links:

   ```markdown
   ### 🔍 `<oyun-adı>` İnceleme Raporu & Yapılması Gerekenler Listesi

   #### 1. Hatalar & Buglar (P0)
   - **[#1] <Kısa Başlık>:** <Sorunun kök nedeni ve çözüm önerisi> ([`dosya.ts`](file:///...#L10-L25))
   - **[#2] ...**

   #### 2. Oynanış & Mekanik Geliştirmeler (P1)
   - **[#3] <Kısa Başlık>:** <Mekanik/denge/gelişim önerisi> ([`dosya.ts`](file:///...#L30-L50))
   - **[#4] ...**

   #### 3. Görsel İyileştirme Önerileri (P2)
   - **[#5] <Kısa Başlık>:** <Görsel/3D model/ışıklandırma önerisi> ([`dosya.ts`](file:///...#L60-L80))
   - **[#6] ...**

   ---
   **Onay Bekleniyor:** Bu maddeleri `backlog/studio-todo.json` yapılacaklar listesine ekleyeyim mi? (Tümünü onaylayabilir veya `#1, #3, #5` gibi madde numarası seçebilirsiniz.)
   ```

---

## Phase 2: On User Approval

When the user replies with approval (e.g., *"Onaylıyorum"*, *"Hepsini ekle"*, or *"1, 2 ve 5'i ekle"*):
1. Read `backlog/studio-todo.json`.
2. Convert each approved item into a standard task object (`id`, `gameId`, `priority`, `score`, `type`, `status: "ready"`, `title`, `description`, `targetFiles`, `verification`).
3. Sort `tasks` by `P0 > P1 > P2` (and descending `score`), save `backlog/studio-todo.json`, and confirm the added items in Turkish.
