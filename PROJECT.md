# Project: HTML5 3D Arcade Games Workspace Audit & Integration

## Architecture
- Workspace Layout: Multi-repo architecture where each game project is an independent self-contained repository (`cyber-flap/`, `cyber-arrow-3d/`).
- Portal Hub: Workspace root (`c:\Users\kerem\Desktop\Games`) houses the Central Arcade Portal (`index.html` and `games.json`), serving as the catalog for all games deployed under `https://keremcaliskann.github.io/games/`.
- Deployment Strategy: Each game builds to its own `dist/` directory via Vite with relative base path (`base: './'`). GitHub Actions deploys the build artifact to GitHub Pages.
- Compliance Standard: Adherence to `AGENTS.md`, `rules/68-pwa-and-meta.md`, `rules/80-dependencies-and-git.md`, and `skills/games-portal-catalog/SKILL.md`.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | cyber-flap GitHub Pages Workflow | Create `.github/workflows/deploy.yml` with Node 20 + standard GitHub Pages actions on push to master/main | M1 | ORIGINAL_REQUEST §R1 |
| 2 | cyber-flap PWA & OpenGraph Meta | Update `index.html` with mobile capability meta, OpenGraph tags, and add `public/manifest.json` | M1 | ORIGINAL_REQUEST §R1, 68-pwa-and-meta.md |
| 3 | cyber-flap Build & Typecheck Verification | Confirm `npm run typecheck` (0 diagnostics) and `npm run build` (valid dist bundles with three & rapier chunk splitting) | M1 | ORIGINAL_REQUEST §R2 |
| 4 | cyber-flap Git Cleanliness & Commit | Commit all added/updated configuration and workflow files with English Conventional Commit | M1 | ORIGINAL_REQUEST §R4 |
| 5 | cyber-arrow-3d Chunk Splitting | Update `vite.config.ts` to include `rapier: ['@dimforge/rapier3d-compat']` in `rollupOptions.output.manualChunks` | M2 | ORIGINAL_REQUEST §R2 |
| 6 | cyber-arrow-3d PWA & OpenGraph Meta | Update `index.html` with mobile capability meta, OpenGraph tags, and add `public/manifest.json` | M2 | ORIGINAL_REQUEST §R1, 68-pwa-and-meta.md |
| 7 | cyber-arrow-3d Gitignore & Lockfile | Update `.gitignore` for `.env*` and mobile paths, and generate clean `package-lock.json` | M2 | 80-dependencies-and-git.md |
| 8 | cyber-arrow-3d Build & Typecheck Verification | Confirm `npm run typecheck` (0 diagnostics) and `npm run build` (valid dist bundles with three & rapier chunk splitting) | M2 | ORIGINAL_REQUEST §R2 |
| 9 | cyber-arrow-3d Git Cleanliness & Commit | Commit all added/updated configuration and workflow files with English Conventional Commit | M2 | ORIGINAL_REQUEST §R4 |
| 10 | Central Arcade Portal games.json Alignment | Verify `games.json` schema, metadata, and relative paths (`./<game-name>/`) for production hosting | M3 | ORIGINAL_REQUEST §R3, games-portal-catalog/SKILL.md |
| 11 | Central Arcade Portal index.html Pre-rendering & Meta | Pre-render cards in `#games-grid`, add OpenGraph/mobile meta tags, and style featured game card | M3 | ORIGINAL_REQUEST §R3, games-portal-catalog/SKILL.md |
| 12 | Final Integration & E2E Acceptance Verification | Verify all acceptance criteria across both games and portal; ensure clean git status | M4 | ORIGINAL_REQUEST §Acceptance Criteria |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | cyber-flap Compliance & Pipeline | Add deploy.yml, update index.html & manifest.json, verify build/typecheck, commit | none | DONE (commit ace9fad, deploy.yml, manifest.json, PWA meta, clean build) |
| M2 | cyber-arrow-3d Compliance & Pipeline | Update vite.config.ts, index.html, manifest.json, .gitignore, generate lockfile, verify build/typecheck, commit | none | DONE (commit d103526, chunk splitting three/rapier, manifest.json, PWA meta, clean build) |
| M3 | Central Arcade Portal Synchronization | Synchronize games.json and index.html with pre-rendered cards and metadata | M1, M2 | DONE (games.json synchronized, pre-rendered cards in index.html, Rule 68 meta, featured badge/glow) |
| M4 | Final Integration & Cleanliness Review | Comprehensive review of all acceptance criteria and repository statuses | M3 | DONE (All acceptance criteria verified 100%, clean working trees, verified commits) |

## Interface Contracts
### Central Arcade Portal ↔ Game Projects
- Entry point relative URL: `./<game-name>/` (production GitHub Pages) and `./<game-name>/dist/` (local preview fallback).
- `base: './'` in `vite.config.ts` ensures all JS/CSS/asset references load relative to `index.html` without absolute path `/` resolution errors.
- Visual Assets: Standard game card icons/emojis and metadata matching `games.json` registry schema.

## Code Layout
- `cyber-flap/`:
  - `vite.config.ts`: Vite build configuration (`base: './'`, vendor chunks `three`, `rapier`).
  - `index.html`: Web entrypoint with PWA & OpenGraph metadata.
  - `public/manifest.json`: Web App Manifest.
  - `.github/workflows/deploy.yml`: GitHub Pages CI/CD workflow.
- `cyber-arrow-3d/`:
  - `vite.config.ts`: Vite build configuration (`base: './'`, vendor chunks `three`, `rapier`).
  - `index.html`: Web entrypoint with PWA & OpenGraph metadata.
  - `public/manifest.json`: Web App Manifest.
  - `.gitignore`: Security and platform build ignores.
  - `.github/workflows/deploy.yml`: GitHub Pages CI/CD workflow.
- Central Arcade Portal:
  - `c:\Users\kerem\Desktop\Games\games.json`: Canonical registry of games.
  - `c:\Users\kerem\Desktop\Games\index.html`: Arcade portal homepage with pre-rendered cards and dynamic hydration.
