---
name: inspect
description: >-
  Deeply inspects a single specified game (/inspect <game-name> or /inpect <game-name>),
  finds bugs, broken logic, gameplay flaws, and visual polish opportunities,
  presents a categorized "Yapılması Gerekenler" checklist in Turkish, and waits
  for user approval before adding approved items to backlog/studio-todo.json.
---

# /inspect <oyun-adı> — Single-Game Deep Inspector & Approval-Gated Todo Generator

Performs a surgical, file-by-file technical and design inspection of a single target game (`<oyun-adı>/`) when the user types `/inspect <oyun-adı>` or `/inpect <oyun-adı>`.

> **STRICT APPROVAL GATE:**
> 1. **Phase 1 (Inspect & Propose):** Read-only inspection. Do **NOT** modify the game's source code and do **NOT** write to `backlog/studio-todo.json` yet. Present the numbered **"Yapılması Gerekenler Listesi"** in Turkish and wait for user approval.
> 2. **Phase 2 (Queue on Approval):** Only after the user approves (all items or specific item numbers), append the approved tasks into `backlog/studio-todo.json` with status `"ready"` and commit/push.

---

## Phase 1: Deep Single-Game Inspection Steps

1. **Resolve Target Game Directory:**
   - Match `<oyun-adı>` against active/inactive game directories in workspace root and `games.json` (fuzzy match supported, e.g., `hole-city` → `hole-city-io-3d`).
   - Run `Push-Location <game-dir>; npm run typecheck; Pop-Location` to capture any TypeScript or build diagnostics.

2. **Inspect Core Modules (`src/game/`, `src/render/`, `src/input/`, `src/ui/`, `src/main.ts`):**
   - **A. Hatalar & Buglar (`P0` / `bugfix`):**
     - Spawn/death race conditions (e.g., instant death on spawn, missing spawn invulnerability, stuck stage transitions).
     - AI / Bot deadlocks (infinite chase loops, wall-corner getting stuck, unguarded null references).
     - Camera-relative input inversion (`+Z` vs `-Z` camera look direction vs X/Z movement axes).
     - State transition latches (double-triggered game-over/victory modals, timer leaks, uncleaned intervals).
     - HUD pointer bleed (`data-hud-interactive="true"` missing on interactive buttons).
   - **B. Oynanış, Fizik & Gelişim Hissiyatı (`P1` / `mechanical-depth` & `performance`):**
     - Movement speed, acceleration damping, and steering weight balance.
     - Sense of progression (tier/level-up thresholds, HUD progress bars, reward scaling, map variety).
     - Hot-path allocations inside `update()` / `onFrame()` (`new THREE.Vector3`, `.map()`, `.filter()`, closures).
   - **C. Görsel İyileştirme Önerileri (`P2` / `visual-polish`):**
     - Stylized Soft Daylight compliance (`32-daylight-and-lighting.md`): check for washed-out white overexposure (`environmentIntensity > 0.35`, `toneMappingExposure > 0.92`) or dark voids.
     - Arena / ground / road color contrast and landmark variety.
     - 3D Prefab quality: identify primitive box/cylinder placeholders in `PrefabFactory.ts` that should be upgraded to `ProceduralMeshBuilder` compound meshes or `AssetResolver` hybrid `.glb` models.
     - Visual juice: impact particles, shockwave rings, camera zoom/shake feedback, floating score popups, and Universal Start Menu (`#shell-start-menu`) integration.

3. **Output Format (Turkish "Yapılması Gerekenler Listesi"):**
   Present a concise, scannable report in Turkish structured strictly as follows:

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
2. Convert each approved item into a standard task object in `tasks`:
   - `id`: `"todo-<game-slug>-<short-slug>"`
   - `gameId`: `"<game-dir>"`
   - `priority`: `"P0"` | `"P1"` | `"P2"`
   - `score`: `90–98` (`P0`), `82–89` (`P1`), `75–81` (`P2`)
   - `type`: `"bugfix"` | `"mechanical-depth"` | `"visual-polish"`
   - `status`: `"ready"`
   - `title`: English technical summary of the task
   - `description`: Detailed file-level implementation instructions
   - `targetFiles`: Array of relative file paths (`["src/..."]`)
   - `verification`: `"npm run typecheck && npm run build"`
3. Sort `tasks` by `P0 > P1 > P2` (and descending `score`), save `backlog/studio-todo.json`, and confirm the added items in Turkish.
