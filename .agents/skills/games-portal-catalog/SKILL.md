---
name: games-portal-catalog
description: Manages, generates, and synchronizes the central HTML5 3D Arcade game portal at the workspace root, indexing all game projects for deployment to https://keremcaliskann.github.io/games/.
metadata:
  icon: grid_view
---

# Games Portal Catalog

Operational skill for maintaining the central arcade portal index (`index.html` at the workspace root), deployed to `https://keremcaliskann.github.io/games/`.

## 1. Catalog Architecture
- The root of `Games/` acts as the GitHub Pages hub.
- When visited at `https://keremcaliskann.github.io/games/`, players see a responsive cyber/arcade dashboard listing all generated 3D HTML5 games.
- Each game card links directly to its relative path: `./<game-name>/` (e.g. `./cyber-flap/`, `./cyber-arrow-3d/`).

## 2. Game Registry Schema (`games.json`)
Store game metadata in `games.json` at workspace root:

```json
[
  {
    "id": "cyber-arrow-3d",
    "title": "Cyber Arrow 3D",
    "description": "Tactile neon spatial untangling puzzle with ASMR audio and progressive 3D geometry.",
    "path": "./cyber-arrow-3d/",
    "tags": ["3D Puzzle", "Three.js", "ASMR", "Neon"],
    "date": "2026-10-20",
    "featured": true
  }
]
```

## 3. Automated Catalog Synchronization
Whenever a new game project is created or verified:
1. Append or update the game entry in `games.json`.
2. Re-render the portal cards in `index.html`.
3. Verify that all relative links (`./<game-name>/`) resolve cleanly.
4. Stage and commit changes to the workspace repository.
