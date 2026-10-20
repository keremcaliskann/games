---
name: game-preflight-audit
description: Automated pre-flight QA audit and defensive hardening inspector. Verifies HUD click bleeding isolation, state transition idempotency, procedural feasibility/solvability, platform lifecycle invariants, raycasting accuracy, and bundle size before releasing or pushing HTML5 3D games.
---

# Game Preflight Audit (`game-preflight-audit`)

> Systematic pre-flight verification protocol to catch bugs, softlocks, UI click bleed, and lifecycle violations **before** committing, building, or releasing HTML5 3D games for YouTube Playables, Yandex Games, CrazyGames, and GitHub Pages.

---

## 1. When to Use This Skill

Run this audit whenever:
- Finishing a new game, level, or major feature.
- Preparing for a Git commit, push, or release to GitHub Pages.
- Debugging unexpected input behavior (e.g., buttons restarting the game, taps missing 3D objects).
- Investigating player reports of impossible/deadlocked levels or duplicate victory/defeat screens.

---

## 2. The 7-Point Defensive Audit Checklist

| Item | Focus Area | Mandatory Requirement | Automated Inspection Command |
|---|---|---|---|
| **#1** | **HUD Pointer Isolation** | All interactive HUD buttons/modals have `data-hud-interactive="true"`. | Scan HTML/TS for buttons missing the attribute. |
| **#2** | **State Idempotency** | Single-shot latches (`isLevelCompleted`, `isGameOver`) prevent duplicate events. | Search for `level_completed` and `game_over` emits without latch guards. |
| **#3** | **Procedural Feasibility** | Gaps $\ge 1.6\times$ player size; puzzles use DAG reverse-peel (zero deadlocks). | Review generator logic for reachability and DAG constraints. |
| **#4** | **SDK Invariants** | `PlatformBridge.loadData()` is awaited at startup **before** any `saveData()`. | Check `main.ts` bootstrap order for `loadData`. |
| **#5** | **Raycast Integrity** | Composite 3D meshes have `userData.block = this` / `userData.entity = this`. | Verify `getRaycastTargets()` includes child meshes. |
| **#6** | **Reward Math** | Ad multipliers calculate exact bonus delta; no infinite loops or negative balances. | Check economy methods for `Math.max(0, ...)` and delta addition. |
| **#7** | **Bundle & Memory** | `dist/` $< 5\text{ MB}$, zero hot-path allocations, proper resource `dispose()`. | Run `npm run build` and scan `update()` loops for `new`. |

---

## 3. Step-by-Step Audit Execution Protocol

### Step 1: Scan for HUD Click Bleeding (#1)
Run a static scan across all UI files in the game project to identify buttons without the interactive tag:
```powershell
Get-ChildItem -Path <game-dir>/src/ui -Recurse -Filter *.ts | Select-String -Pattern "<button" | Where-Object { $_.Line -notmatch 'data-hud-interactive="true"' }
```
**Fix:** Add `data-hud-interactive="true"` to every interactive `<button>`, `<a>`, or clickable overlay container.

### Step 2: Verify State Transition Latches (#2)
Inspect `puzzle-grid.ts`, `fsm/`, or main game state coordinators for event emits:
- Verify that `level_completed` is wrapped in `if (!this.isLevelCompleted) { this.isLevelCompleted = true; ... }`.
- Verify that `game_over` is wrapped in `if (!this.isGameOver) { this.isGameOver = true; ... }`.
- Verify that these latches are reset to `false` in `clear()`, `reset()`, or `loadLevel()`.

### Step 3: Audit Procedural & Level Generation Feasibility (#3)
- **Runners / Flappy Games:**
  - Verify obstacle gap calculation:
    `const clearance = gapY - playerRadius * 2;`
    `if (clearance < MIN_SAFE_CLEARANCE) gapY = MIN_SAFE_CLEARANCE + playerRadius * 2;`
- **Puzzle / Arrow / Untangle Games:**
  - Verify that level generation uses reverse-peel (peeling from outside in) or topological DAG sorting.
  - Verify that integer coordinate grids are used uniformly (no fractional or non-aligned offsets that break raycast lookups).

### Step 4: Verify Platform Lifecycle & Cloud Data Sequence (#4)
Open `<game-dir>/src/main.ts` and inspect the bootstrap function:
```ts
// Mandatory sequence:
PlatformBridge.applyDualModeShell();

// MUST await loadData before any saveData can succeed on YouTube Playables
const cloudData = await PlatformBridge.loadData(defaultData);

new GameApp(cloudData);
```
Verify that `signalFirstFrameReady()` is called on frame 1, and `signalGameReady()` is called after assets are mounted.

### Step 5: Check 3D Raycasting & Entity Tapping (#5)
If the game features 3D object interaction (tapping, dragging, selecting):
- Check if entities have child decorations or sub-meshes (e.g., arrows, wings, armor).
- Ensure all child meshes set `child.userData.entity = this` (or `child.userData.block = this`).
- Ensure `getRaycastTargets()` pushes both the base mesh and all child meshes:
  ```ts
  targets.push(entity.baseMesh);
  targets.push(...entity.childMeshes);
  ```

### Step 6: Verify Economy & Ad Reward Math (#6)
Inspect `EconomySystem` or score handlers:
- Spends must be clamped: `this.coins = Math.max(0, this.coins - cost)`.
- Rewarded ad multiplier must add the difference:
  ```ts
  const base = GAME_CONFIG.coinsPerLevel;
  const total = rewarded ? Math.floor(base * multiplier) : base;
  const bonus = total - base;
  if (bonus > 0) this.economy.addCoins(bonus);
  ```

### Step 7: Build, Typecheck, and Hot-Path Inspection (#7)
1. Run static typecheck:
   ```powershell
   cd <game-dir>; npm run typecheck
   ```
   *Requirement:* Must exit with code 0 (zero errors).
2. Run production build:
   ```powershell
   cd <game-dir>; npm run build
   ```
   *Requirement:* `dist/` bundle total size must be strictly $< 5\text{ MB}$.
3. Verify zero heap allocations in hot paths:
   Scan `update()`, `fixedUpdate()`, and `render()` for:
   - `new THREE.Vector3(`
   - `new THREE.Quaternion(`
   - `.filter(`, `.map(`, `.forEach(`
   - Object spreads `{ ...obj }`

---

## 4. Remediation Checklist

Before declaring a game verified:
- [ ] No un-isolated HUD buttons that bleed clicks into gameplay.
- [ ] Terminal events guarded by single-shot latches.
- [ ] Procedural levels/spawns guaranteed feasible (no deadlocks, no impassable gaps).
- [ ] `PlatformBridge.loadData()` awaited at bootstrap.
- [ ] All clickable child meshes tagged with `userData` and in raycast targets.
- [ ] Economy transactions clamped and reward deltas calculated cleanly.
- [ ] `npm run typecheck` passes with zero diagnostics.
- [ ] `npm run build` succeeds and produces `< 5 MB` bundle.
- [ ] Dual-Mode shell and `public/icon.svg` intact.
