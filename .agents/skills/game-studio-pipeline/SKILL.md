---
name: game-studio-pipeline
description: Executes the token-optimized 3-Phase Studio Squad workflow (Designer -> Implementer -> Game Director & QA Critic) for building, polishing, and releasing 3D HTML5 games.
metadata:
  icon: groups
---

# Autonomous Game Studio Pipeline

This skill guides the orchestration of a token-optimized, 3-phase multi-agent game studio pipeline for creating production-ready 3D HTML5 games with zero bloat and maximum visual/gameplay fidelity.

---

## 1. Pipeline Overview & Token Economy

Instead of launching a dozen independent subagents, the studio operates in **3 sequential squads**:

```
+-----------------------------------------------------------------------------------------+
| SQUAD 1: STUDIO DESIGNER                                                                |
| Produces DESIGN.md: Core loop, solvable level math, economy, and camera ergonomics.     |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼
+-----------------------------------------------------------------------------------------+
| SQUAD 2: STUDIO IMPLEMENTER                                                             |
| Builds the complete game: Engine, gameplay, 3D camera rig, daylight lighting, audio,   |
| 3-column Arcade Shell, and public/icon.svg.                                             |
+-----------------------------------------------------------------------------------------+
                                           │
                                           ▼
+-----------------------------------------------------------------------------------------+
| SQUAD 3: GAME DIRECTOR & QA CRITIC                                                      |
| Conducts 3-point critique (Camera/Visibility, Art/Juice, Tech/Build), directs polish   |
| patches, and authorizes push to GitHub Pages.                                           |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Phase 1: Studio Designer

### Execution
Invoke subagent or execute with the persona of a veteran Lead Game Designer.
Deliverable: `DESIGN.md` in the game project directory.

### Mandatory Deliverables Checklist
1. **Core Loop Formula:** Input action -> immediate state transformation -> rewarding visual/audio payoff.
2. **Level Progression & Math:** Deterministic, guaranteed-solvable algorithm with zero deadlock states.
3. **Ergonomic Boundaries:** Explicitly define the maximum camera orbit pitch and forbidden occlusion zones (e.g., forbidding solid ground planes under floating 3D puzzles).
4. **Economy Spec:** Coin rewards per level (+25), hint costs, rewarded ad triggers (+50), and interstitial intervals (every 3+ levels).

---

## 3. Phase 2: Studio Implementer

### Execution
Invoke subagent or execute with the persona of a Senior Full-Stack Game Engineer & Technical Artist.

### Technical Responsibilities
1. **Scaffold & Build Setup:**
   - Independent project folder under `c:/Users/kerem/Desktop/Games/<game-name>`.
   - `vite.config.ts` with `base: './'`, manual chunks for `three` and `rapier`.
   - `tsconfig.json` with strict mode.
2. **Layering Architecture:**
   - `core` <- `render` / `physics` / `input` / `platform` <- `game` <- `ui`.
3. **3D Camera & Line-of-Sight:**
   - `CameraRig` supporting smooth spherical damping and dynamic target radius.
   - **Crucial Rule:** No visual ground/pedestal props blocking bottom camera angles.
4. **Daylight & Vibrant Visuals:**
   - Bright sky background (`scene.background = new THREE.Color(0xbae6fd)` or similar).
   - `HemisphereLight` (white sky + warm ground bounce) + `DirectionalLight` sun.
   - High-saturation, distinct entity colors.
5. **Procedural Web Audio:**
   - Synthesize all SFX via `AudioContext` in `src/core/audio.ts`. Zero external audio files.
6. **Arcade Shell & PWA:**
   - 3-column layout (left sidebar, center ResizeObserver canvas, right ad rail).
   - Fullscreen mode with persistent sticky ad banner.
   - Vector `public/icon.svg` (512x512) and `public/manifest.json`.

---

## 4. Phase 3: Game Director & QA Critic

### Execution
Invoke subagent or execute with the persona of an uncompromising Game Director and QA Auditor.
Deliverable: `CRITIQUE.md` containing evaluation notes and required polish patches.

### The 3-Filter Audit Rubric

```markdown
### 1. Camera & Ergonomics
- [ ] Are bottom and side viewing angles 100% unobstructed?
- [ ] Does the camera center on the puzzle/action bounds dynamically?
- [ ] Is input responsive with zero drag/tap confusion?

### 2. Art Direction & "Juice"
- [ ] Is the environment bright, sunlit, and cheerful (unless dark is explicitly requested)?
- [ ] Do interactive elements pop against the background with strong contrast?
- [ ] Are particle bursts, bounce animations, and screen shake tactile and satisfying?

### 3. Technical & Release Integrity
- [ ] Zero allocations in hot paths (`update`, `fixedUpdate`, `render`).
- [ ] `npm run typecheck` exits with code 0.
- [ ] `npm run build` exits with code 0.
- [ ] Catalog entry in `games.json` and root `index.html` verified.
- [ ] Automated push to `origin/main` on `https://github.com/keremcaliskann/games`.
```

### The Polish Loop
If any item fails, the implementer immediately patches the code. The Game Director re-evaluates. Once all checkboxes pass, commit with Conventional Commits and push to `origin/main`.
