# AGENTS.md — HTML5 3D Game Projects

> This file is **always active** across all game projects in this workspace; it is intentionally concise.
> Detailed rules and skills are loaded on demand from `.agents/rules/` and `.agents/skills/`.

## 1. Project & Workspace Architecture

- **Scope:** This workspace hosts multiple independent HTML5 3D game projects. Each game lives in its own dedicated subdirectory with its own Git repository.
- **Goal:** High-performance (target 60 FPS) HTML5 3D games free of Unity bloat, easily portable to Android/iOS via Capacitor.
- **Approved Stack:** Vite · Three.js (WebGL) · Rapier.js (`@dimforge/rapier3d-compat`, Wasm) · Capacitor · TypeScript (strict).
- **Platform Boundary:** Game logic is platform-agnostic. Platform differences reside exclusively within `src/platform/`.
- **Layering Order:** `core` ← `render` / `physics` / `input` / `platform` ← `game` ← `ui`. Sublayers must never import upper layers.

## 2. Language & Communication

- **User Communication:** Turkish (chat, proposals, planning summaries, and status updates).
- **Code & Documentation:** English (all code, identifiers, types, comments, docstrings, commit messages, and `.md` documentation files).
- **Comment Principle:** Comments explain **"why"**, not "what".

## 3. Four Core Principles

### 3.1 Think First, Then Implement
- Classify the task:
  - **Small** (single file, clear request) → implement directly.
  - **Medium** (2–4 files) → outline a 3–6 line plan in chat, then implement.
  - **Large / Ambiguous** (new system, architectural shift, 4+ files, new dependency) → prepare an Implementation Plan artifact, **do not write code without user approval**. Follow the `plan-then-implement` skill.
- Explicitly state assumptions ("Assumption: ...").
- Clarify ambiguous requirements before writing code: max 3 questions per message, each with a recommended default.
- If a simpler solution exists, propose it. If library APIs are uncertain, verify in `node_modules/<package>/**/*.d.ts`.

### 3.2 Simplicity (YAGNI)
- Write the **minimum** code necessary to solve the problem.
- No unsolicited features, "future-proofing", or extra config toggles.
- No single-use interfaces, factories, or abstract base classes. Extract shared functions only on the third repetition.
- No new dependencies without explicit approval; solve with the approved stack first.

### 3.3 Surgical Precision
- Edit only lines directly relevant to the user request. Every modified line must trace back to the user's intent.
- Do not touch neighboring code (no unsolicited refactoring, formatting, or renaming).
- Adhere to the existing code style. Clean up orphans introduced by your own edits.

### 3.4 Goal-Oriented Verification
- Turn requests into verifiable targets (reproduce bugs with a test scenario; measure performance before and after).
- Never report an unexecuted verification as completed.

## 4. Autonomy Matrix & Git Policy

| Scenario | Action |
|---|---|
| Bug fix, single module, no refactoring | Implement without asking |
| New game system / architectural change | Plan → user approval |
| New npm dependency | Request approval |
| File deletion/movement, public API change | Request approval |
| Native directories (`android/`, `ios/`) | Do not edit manually; use `npx cap sync` |
| Destructive commands (`rm -rf`, `git reset --hard`, `git push --force`) | Strictly forbidden without explicit command |
| Keystores, `.env`, secret keys | Never read or commit |
| **Git Repositories & Push** | **Each game project has its own Git repo.** When tasks reach a verified, stable state (build/tests pass), commit (Conventional Commits in English) and push to the project's remote repo. |
| **GitHub Pages Deployment** | **Automated upon task completion.** Every project must deploy to `https://keremcaliskann.github.io/games/<game-name>/`. Requires `base: './'` in `vite.config.ts` and automated deployment setup. |

## 5. Token & Context Discipline

- Search first (`grep` / file search), then read only the relevant line range. Do not reread unchanged files.
- Truncate terminal outputs (`| tail -n 40`, `--silent`). Never dump `dist/`, `node_modules/`, `*.glb`, `*.wasm`, or lockfiles into context.
- Keep delivery summaries concise (≤ 8 lines).

## 6. Performance Reflex

- No allocations in hot paths (`update`, `fixedUpdate`, `render` loops): no `new`, closures, `map/filter/forEach`, spreads, or dynamic string concatenations.
- Target budget: 16.6 ms per frame; mobile draw calls ≲ 100. Always measure before optimizing.

## 7. Definition of Done

A task is complete only when:
1. `npm run typecheck` and `npm run build` pass without errors.
2. Unit tests pass (if applicable).
3. Visual/gameplay changes are verified on the dev/preview server.
4. No memory allocations, `console.log`, or debug remnants in hot paths.
5. Code committed with a clean English Conventional Commit and pushed to the project repository upon reaching a stable milestone.
6. Automated GitHub Pages deployment prepared and verified for target URL `https://keremcaliskann.github.io/games/<game-name>/` with relative base path (`base: './'`).
7. Arcade Shell compliant: 3-column desktop layout with left navigation (portal return `../`, restart, fullscreen, dynamic other games), center stage with ResizeObserver canvas adapting, right rail ad banner (300x250/300x600), persistent sticky ad in fullscreen mode, and verified `public/icon.svg`.

## 8. Rules & Skills Directory

| File | Mode | Trigger Condition |
|---|---|---|
| `rules/10-code-quality.md` | glob | Triggered when editing `**/src/**/*.ts` |
| `rules/20-performance-budget.md` | model_decision | Performance, FPS, memory, hot paths |
| `rules/30-three-render.md` | glob | Triggered when editing `**/src/render/**` |
| `rules/35-procedural-audio.md` | glob | Triggered when editing `**/src/core/audio*.ts` |
| `rules/40-rapier-physics.md` | glob | Triggered when editing `**/src/physics/**` |
| `rules/50-input-abstraction.md` | glob | Triggered when editing `**/src/input/**`, `**/src/ui/**` |
| `rules/55-arcade-layout-and-shell.md` | model_decision | Arcade shell, 3-column desktop layout, responsive canvas, sidebar, ad rails, game icon pipeline |
| `rules/60-mobile-capacitor.md` | model_decision | Mobile, Capacitor, WebView, safe area |
| `rules/65-monetization-ads.md` | model_decision | AdMob, Poki/CrazyGames, IAdProvider abstraction |
| `rules/68-pwa-and-meta.md` | model_decision | PWA manifest, offline worker, OpenGraph meta |
| `rules/70-token-context.md` | model_decision | Large file reads, token economy |
| `rules/80-dependencies-and-git.md` | model_decision | Package additions, Git repos, commit & push |
| `rules/90-release-checklist.md` | manual | Triggered exclusively via `@90-release-checklist` |
| `skills/html5-game-development` | skill | Core 3D game development workflow |
| `skills/game-performance-audit` | skill | FPS drops, jank, memory audits |
| `skills/capacitor-mobile-port` | skill | Packaging web build to Android/iOS |
| `skills/plan-then-implement` | skill | Complex, multi-file, or ambiguous tasks |
| `skills/games-portal-catalog` | skill | Central arcade portal index management |
