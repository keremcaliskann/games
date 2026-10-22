---
trigger: model_decision
description: "npm package additions/updates, version management, bundle sizes, Git repositories, atomic commits, and push policy."
---

# Dependencies & Git Policy

## Approved Stack (No Approval Required)
The following packages are pre-approved across all game projects:
- Core 3D & Physics: `three`, `@types/three`, `@dimforge/rapier3d-compat`.
- Build Tooling: `vite`, `typescript`.
- Mobile / Capacitor: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/ios`, `@capacitor/app`, `@capacitor/preferences`, `@capacitor/haptics`, `@capacitor/screen-orientation`, `@capacitor/status-bar`, `@capacitor/assets` (dev).

All other npm dependencies **require explicit user approval**.

## Proposing New Dependencies
Before recommending any new package:
1. Can this be implemented using the existing approved stack (Three.js, Rapier, browser APIs)?
2. Can this be written in under ~30 lines of clean code? If so, write it directly.
3. Verify gzip bundle size, maintenance health, and license.
4. Ensure compatibility with mobile WebViews (no Node.js-only modules).
5. If testing libraries are requested, prefer Vitest for native Vite integration.

## Dependency Management & Updates
- Lock versions: Always commit `package-lock.json`.
- Destructive commands like `npm audit fix --force` or unrestricted `npm update` are strictly prohibited.
- When updating Three.js, Rapier, or Capacitor, formulate an upgrade plan first due to potential breaking changes.

## GitHub Pages Deployment
- **Target URL Pattern:** `https://keremcaliskann.github.io/games/<game-name>/`
- **Relative Base Path:** Every project must set `base: './'` in `vite.config.ts` so all chunk/asset URLs resolve cleanly under nested GitHub Pages paths without 404 errors.
- **Automated Deployment:**
  - Upon task/milestone completion, verify `npm run typecheck` and `npm run build`.
  - Every project must include `.github/workflows/deploy.yml` configured to build and deploy `dist/` to GitHub Pages automatically.
  - When development and verification pass, deploy the build so that the live game becomes immediately playable at `https://keremcaliskann.github.io/games/<game-name>/`.

## Git Monorepo & Push Workflow
- **Unified Monorepo Architecture:** All game projects reside as independent subdirectories (`<game-name>/` with their own `package.json` and `vite.config.ts`) inside the single root Git monorepo (`https://github.com/keremcaliskann/games.git`), deployed together via the root `.github/workflows/deploy.yml` pipeline.
- **Atomic Commits:** Make clean, logical, atomic commits using English Conventional Commits:
  - Format: `feat(<game>): <description>`, `fix(<game>): <description>`, `perf: <description>`, `refactor: <description>`, `chore: <description>`.
- **Push Policy:**
  - Once a feature or bugfix reaches a verified, stable milestone (passes `npm run typecheck`, `npm run build`, and testing), commit the changes and push to `origin/main` in the root repository.
  - Never push broken or unverified code.
- **Safety & Destructive Commands:**
  - Never run `git push --force`, `git reset --hard`, or interactive rebases without explicit user command.
- **Security & Secrets:**
  - Ensure `.gitignore` covers: `node_modules/`, `dist/`, `android/build/`, `android/app/build/`, `ios/App/Pods/`, `.env*`, `*.keystore`, `*.jks`.
  - Never inspect, log, or commit API keys, credentials, `.env` contents, or Android/iOS release keystores.
