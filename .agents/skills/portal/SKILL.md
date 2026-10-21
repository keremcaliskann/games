---
name: portal
description: >-
  Synchronizes the root Arcade Portal catalog, updating games.json, metadata,
  icons, and root index.html cards for all workspace games.
  Use when the user types /portal or asks to update the game portal.
---

# /portal — Central Arcade Portal Synchronizer

Maintains and updates the master game catalog at the workspace root (`c:\Users\kerem\Desktop\Games\index.html` and `games.json`).

## Execution Guide

1. Scan all active game directories in the workspace.
2. Verify each game has:
   - Working title and description.
   - Valid `public/icon.svg`.
   - Production `dist/` build.
   - Working relative link (`./<game-name>/dist/index.html` or `./<game-name>/`).
3. Update `games.json` with the latest metadata, tags, and thumbnails.
4. Regenerate or update the responsive 3-column card grid in root `index.html`.
5. Deliver a summary showing all catalogued games.
