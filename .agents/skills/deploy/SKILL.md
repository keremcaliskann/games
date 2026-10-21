---
name: deploy
description: >-
  Verifies all game builds, checks GitHub Actions workflows, commits with English
  Conventional Commits, and pushes live to GitHub Pages.
  Use when the user types /deploy or asks to publish/push all games.
---

# /deploy — Live GitHub Pages & Remote Repository Deployment

Builds, checks, commits, and pushes all updates to `origin/main` to trigger automated GitHub Actions deployment.

## Execution Guide

1. Run `npm run build` on any modified games to ensure fresh `dist/` bundles.
2. Verify git status and ensure no untracked files or secrets are present.
3. Commit with English Conventional Commits (`feat(...)`, `fix(...)`, `chore(...)`).
4. Push to `origin/main` on `https://github.com/keremcaliskann/games.git`.
5. Confirm live URLs under `https://keremcaliskann.github.io/games/<game-name>/` and the portal root `https://keremcaliskann.github.io/games/`.
