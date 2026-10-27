---
name: zip
description: >-
  Packages and generates distribution-ready ZIP archives for target gaming portals
  (Yandex Games, CrazyGames, YouTube Playables, Poki). Use when the user types /zip
  or asks to export/zip games for publishing.
---

# /zip — Multi-Platform Game Exporter & Archiver

Automatically builds, adapts SDK script headers, and packages games into clean, standalone ZIP files ready for instant developer portal upload (< 50 MB budget).

## How to Execute

### 1. Identify Target
- If the user specifies a game (e.g. `color-block-jam-3d`) or platform (e.g. `yandex`, `crazygames`, `youtube`, `poki`), extract them.
- If unspecified, default to all games and all platforms (`all`).

### 2. Run Export Command
Execute the workspace-level exporter from the workspace root:
```powershell
node scripts/export-all-games.mjs [platform] [game]
```
Examples:
- All games, all platforms: `node scripts/export-all-games.mjs all all`
- Only Yandex for all games: `node scripts/export-all-games.mjs yandex all`
- Single game for all platforms: `node scripts/export-all-games.mjs all color-block-jam-3d`
- Single game for specific platform: `node scripts/export-all-games.mjs crazygames cyber-arrow-3d`

### 3. Verification & Report
1. Check that the command exited with 0.
2. Verify all ZIP file sizes are strictly under 50 MB.
3. Present a concise Turkish summary table to the user with:
   - Game Name
   - Platform
   - File Path (e.g., `<game>/release/<game>-<platform>.zip`)
   - File Size
   - Status (e.g. "Hazır / Yüklenebilir")
