---
name: game-studio-pipeline
description: Executes the Consumer stage of the autonomous studio — pulls the #1 ranked game from backlog/ideas-backlog.json and runs the 3-Phase Studio Squad (Designer -> Implementer -> Game Director Critic) with full YouTube Playables SDK and multi-portal support.
metadata:
  icon: groups
---

# Autonomous Game Studio Pipeline (`game-studio-pipeline`)

This skill orchestrates the **Consumer (Studio Executor)** automation of the decoupled game studio. On every run, it inspects **both** queues — `backlog/studio-todo.json` (existing game improvements & bugfixes) and `backlog/ideas-backlog.json` (new game blueprints) — executes the highest-priority work, deploys live to GitHub Pages, and outputs a concise Turkish post-run report.

---

## 1. Dual-Queue Intake & Dispatcher (`studio-todo.json` + `ideas-backlog.json`)

1. Read **both** `backlog/studio-todo.json` and `backlog/ideas-backlog.json`.
2. **Dispatch Priority Rules:**
   - **Rule A — Urgent `P0` Bug Override:** If `backlog/studio-todo.json` contains any item with `status === "ready"` and `priority === "P0"`, immediately execute all `P0` bugfix tasks first.
   - **Rule B — Mode Selection (New Game vs. Existing Game Upgrade):**
     - **If invoked in `TODO_MODE` (e.g., the 04:00 nightly slot) OR if `ideas-backlog.json` has no `status === "ready"` items:**
       - Pull the top **2 to 3 highest-scored `status === "ready"` tasks** from `backlog/studio-todo.json`.
       - Implement the exact mechanical/visual upgrades or bugfixes in the specified `targetFiles`, verify `npm run typecheck` and `npm run build` for each modified game, mark those tasks `"completed"` in `backlog/studio-todo.json`, commit, and push to `origin/main`.
     - **If invoked in `NEW_GAME_MODE` (e.g., the 23:00 nightly slot or `/studio` command) and `ideas-backlog.json` has a `status === "ready"` item:**
       - Select the item with `status === "ready"` that has the **highest `revenueScore` (Rank #1)** in `backlog/ideas-backlog.json`.
       - Update its status to `"in_progress"` and execute Phases 1, 2, and 3 below to build and publish the new game from scratch.
       - Plus, if time/budget permits after building or if no new game is ready, complete the #1 task from `backlog/studio-todo.json`.

---

## 2. Phase 1 (New Game Mode): Studio Designer (`<game-name>/DESIGN.md`)

Translate the selected backlog blueprint into `<game-name>/DESIGN.md`:
1. **Core Loop & 2-Second Hook:** Immediate single-finger interaction within 2 seconds of `ytgame.game.gameReady()`.
2. **100% Solvable Level Math:** Deterministic reverse-generation or verified algorithm ensuring zero impossible levels.
3. **3 Mandatory Revenue Hooks (`65-monetization-ads`):**
   - **Hook 1 (In-Level Rescue Boosters):** 2–3 bottom-bar power-ups purchasable via Coins or `showRewarded('booster_<type>')`.
   - **Hook 2 (Near-Miss Revive Modal):** "So Close!" prompt on failure offering `+Moves / Clear Buffer` via `showRewarded('revive')`.
   - **Hook 3 (Victory 2x/3x/5x Moving Multiplier Bar):** Oscillating multiplier needle on the Victory screen calling `showRewarded('victory_multiplier')`.
4. **360° Camera & Compound Prefab Spec:** Unobstructed camera angles (zero ground/pedestal occlusion), 9:16 portrait + 16:9 landscape framing, and multi-part `THREE.Group` procedural prefabs + `ASSETS_NEEDED.md`.

---

## 3. Phase 2: Studio Implementer

Build the complete project inside `c:/Users/kerem/Desktop/Games/<game-name>`:

1. **YouTube Playables SDK & Universal Portal Bridge (`src/platform/`):**
   - Include `<script src="https://www.youtube.com/game_api/v1"></script>` first in `index.html`.
   - Implement `src/platform/sdk.ts` (`firstFrameReady()`, `gameReady()`, `onPause`/`onResume`, `isAudioEnabled`/`onAudioEnabledChange`, `loadData` awaited before `saveData`, `sendScore`) with automatic fallback for Yandex (`YaGames`), CrazyGames (`CrazyGames.SDK`), Poki (`PokiSDK`), and `localStorage`.
   - Implement `src/platform/ads.ts` (`UniversalAdProvider`) routing rewarded/interstitial calls to the active portal or `MockAdProvider`.
2. **Compound Procedural 3D Prefabs & Hot-Swap (`src/render/PrefabFactory.ts`):**
   - Build rich multi-part 3D prefabs (`ExtrudeGeometry`, `LatheGeometry`, hierarchical `THREE.Group`, procedural canvas textures).
   - Add hot-swap support checking `public/models/` and generate `<game-name>/ASSETS_NEEDED.md` documenting optional `.glb` upgrades for the user.
3. **3D Camera & Daylight Visuals (`src/render/`):**
   - Bright sunlit background, `HemisphereLight` + `DirectionalLight`, vibrant high-contrast materials.
   - Zero bottom/side camera occlusion; responsive FOV/zoom for both **9:16 portrait** and **16:9 landscape**.
4. **Procedural ASMR Web Audio (`src/core/audio.ts`):**
   - Zero external audio files; pitch-ramped combo clicks, pops, whooshes, and victory arpeggios synced with `ytgame.system.onAudioEnabledChange`.
5. **Dual-Mode Arcade Shell & Icon (`index.html`, `public/icon.svg`):**
   - Auto-collapses sidebars (`body.embed-fullscreen-mode`) inside YouTube Playables / Yandex / CrazyGames / `?embed=1` for 100% full-viewport play; renders 3-column Arcade Shell on GitHub Pages.
   - Create custom `public/icon.svg` (512×512) and `public/manifest.json`.

---

## 4. Phase 3: Game Director & QA Critic (`<game-name>/CRITIQUE.md`)

Audit the completed build across **4 Mandatory Filters**:

```markdown
### Filter A: Camera & 9:16 / 16:9 Ergonomics
- [ ] Are bottom and side viewing angles 100% unobstructed (zero ground/pedestal blocking)?
- [ ] Does the game play effortlessly with one hand in both 9:16 portrait and 16:9 landscape?

### Filter B: Art Direction, Compound Prefabs & ASMR Juice
- [ ] Is the environment bright, sunlit, and vibrant? (STRICT: scene.background >= 0xbae6fd or pastel daylight, warm Hemisphere ground bounce >= 0xd0d0d0, zero dark voids, zero black floor grids).
- [ ] Are entities multi-part Compound Procedural Prefabs (no raw placeholder boxes) with ASSETS_NEEDED.md documented?
- [ ] Are particle bursts, squash-and-stretch, and Web Audio ASMR feedback satisfying?

### Filter C: YouTube Playables SDK & Revenue Hooks
- [ ] Is `<script src="https://www.youtube.com/game_api/v1"></script>` first in `index.html`?
- [ ] Are `firstFrameReady()`, `gameReady()`, `onPause`/`onResume`, `onAudioEnabledChange`, and `loadData`/`saveData` wired?
- [ ] Do all 3 Rewarded Ad hooks (In-Level Boosters, Near-Miss Revive, Victory Multiplier Bar) work end-to-end?
- [ ] Does Dual-Mode Shell hide sidebars in embedded portal mode (`?embed=1` / `ytgame`) and show Arcade Shell on GitHub Pages?
- [ ] Zero external network fetches (CSP clean) and `dist/` bundle `< 5 MB`?

### Filter D: Technical & Release Integrity
- [ ] Zero allocations in hot paths (`update`, `fixedUpdate`, `render`).
- [ ] `npm run typecheck` and `npm run build` exit with code 0.
```

Apply any polish fixes immediately, mark the game `"completed"` in `backlog/ideas-backlog.json`, synchronize root `games.json`, `index.html`, and `.github/workflows/deploy.yml` via `games-portal-catalog`, commit with English Conventional Commits, and push to `origin/main`.

---

## 5. Mandatory Concise Post-Run Report (≤ 6 Lines in Turkish)

Every execution (whether `NEW_GAME_MODE` or `TODO_MODE`) must finish with a **very short Turkish report (`<= 6 lines`)** in chat:
- **Mode Executed:** Yeni Oyun İnşası (`ideas-backlog.json`) veya Mevcut Oyun Geliştirme (`studio-todo.json`).
- **Completed Items:** Tamamlanan oyun veya `studio-todo.json` görevlerinin adları ve yapılan değişiklikler.
- **Verification & Live Status:** `typecheck` + `build` sonucu, commit kodu ve canlı yayın linki.
