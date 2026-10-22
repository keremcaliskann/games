---
trigger: model_decision
description: "Defensive programming, HUD pointer isolation, state idempotency, procedural feasibility, and SDK lifecycle invariants."
---

# 25-defensive-gameplay-and-hardening.md — Defensive Game Architecture & Bug Safeguards

> This rule is active when authoring or modifying core gameplay, procedural generators, UI overlays, input systems, and platform lifecycles.
> It defines universal defensive programming safeguards to eliminate common bug vectors across all game genres (runners, puzzles, arcade, physics).

---

## 1. HUD & Pointer Isolation (Click Bleeding Prevention)

### 1.1 The Vulnerability
When a player taps an interactive UI element (e.g., revive button, multiplier button, pause modal, hint chip), the underlying pointer/touch event may propagate to the 3D canvas, triggering unintended in-game actions (e.g., flapping the drone, firing a weapon, restarting the game prematurely).

### 1.2 Mandatory Safeguards
1. **Interactive Data Attribute:** Every interactive button, modal container, toast, or banner in the HUD must declare `data-hud-interactive="true"`.
   ```html
   <button type="button" class="action-btn" data-hud-interactive="true">
     🎬 REWARDED ACTION
   </button>
   ```
2. **Input Filter Check:** All pointer and touch event handlers registered on `window`, `document`, or canvas overlays must check:
   ```ts
   if (e.target instanceof Element && e.target.closest('[data-hud-interactive="true"]')) {
     return; // Bypasses canvas game input completely
   }
   ```
3. **Event Stop Propagation:** Modal containers must explicitly call `e.stopPropagation()` on `pointerdown` and `click` events to prevent background event bubbling.

---

## 2. State Transition Idempotency (Race Condition Prevention)

### 2.1 The Vulnerability
In high-frequency game loops, multiple collision events, simultaneously flying entities, or repeated clicks can trigger terminal state transitions multiple times (e.g., double game over, duplicate victory modals, overlapping ad callbacks).

### 2.2 Mandatory Safeguards
1. **Single-Shot Latch Flags:** Protect all terminal state transitions with idempotent boolean latch flags:
   ```ts
   private isLevelCompleted = false;
   private isGameOver = false;

   public onVictoryCondition(): void {
     if (this.isLevelCompleted) return;
     this.isLevelCompleted = true;
     this.bus.emit('level_completed', null);
   }
   ```
2. **Clean Latch Reset:** Reset latches strictly within `reset()` or `loadLevel()` methods before spawning new entities.
3. **Ad Callback Debounce:** Ad presentation functions must reject concurrent calls while an ad modal is already in progress (`if (this.isAdShowing) return;`).

---

## 3. Procedural Content, Spawning & Feasibility Invariants (All Genres)

Regardless of genre (runners, platformers, puzzles, physics sandbox), procedural generation must obey strict feasibility bounds. **Blind unconstrained randomness is strictly forbidden.**

### 3.1 Physical Clearance & Reachability Envelope
- Obstacle clearances, gap widths, and platform distances must strictly exceed the player's physical collision bounds and locomotion capabilities (e.g., jump apex, rise speed, turn radius).
- *Rule:* `gapSize >= playerColliderDiameter * 1.6`. Never generate choke points smaller than the player's clearance envelope.

### 3.2 Zero Softlocks & Zero Unfair Spawns
- **No Direct Spawns on Player:** Entities, hazards, or colliders must never spawn directly inside the player's bounding volume or within their immediate path without a guaranteed human reaction threshold (`reactionWindowMs >= 250ms`).
- **Guaranteed Solvability (Puzzles & Progression):** Any puzzle, maze, or untangling game must construct levels using constructive algorithms (such as **Directed Acyclic Graph (DAG) reverse-peel decomposition**) that mathematically guarantee at least one valid, unblocked solution exists upon level generation. Cycles where entities mutually block each other ($A \to B$ and $B \to A$) are prohibited.

### 3.3 Hard Parameter Clamping
Procedural difficulty scaling (speed, spawn density, gravity, timer reductions) must be clamped to safe biological and computational ceilings:
```ts
const effectiveSpeed = Math.min(baseSpeed + level * 0.5, MAX_SAFE_SPEED);
const effectiveGap = Math.max(baseGap - level * 0.1, MIN_PLAYER_CLEARANCE);
```

### 3.4 Sanity Check / Validation Pass
Every procedurally generated chunk or level must pass an automated validation function before being committed to the active scene graph. If validation fails, the generator must either repair the chunk or fall back to a validated preset.

---

## 4. Platform & SDK Lifecycle Invariants

### 4.1 Cloud Data Pre-Flight (`loadData` before `saveData`)
YouTube Playables strictly rejects `ytgame.game.saveData()` calls if `ytgame.game.loadData()` was not previously awaited during game startup.
- **Mandatory Flow:**
  ```ts
  // main.ts bootstrap
  PlatformBridge.applyDualModeShell();
  const cloudData = await PlatformBridge.loadData(defaultData);
  const game = new GameApp(cloudData);
  ```

### 4.2 Signal Ordering
1. `PlatformBridge.signalFirstFrameReady()`: Emitted exactly once after the first successful WebGL frame render.
2. `PlatformBridge.signalGameReady()`: Emitted once physics engine (Rapier), assets, and initial UI are fully mounted and ready for player interaction.

### 4.3 Lifecycle State Synchronization
- `onPause`: Must immediately pause the GameLoop and suspend audio context.
- `onResume`: Restores GameLoop and audio context if unmuted.
- `onAudioEnabledChange(enabled)`: Syncs game sound state with platform parent container.

---

## 5. Composite 3D Entities & Raycast Accuracy

### 5.1 The Vulnerability
When a 3D entity consists of multiple meshes (e.g., a base block with directional arrows, a character with weapon attachments), raycasting against only the parent or only the base mesh causes clicks on protruding child parts to miss or misfire.

### 5.2 Mandatory Safeguards
1. **Back-Pointer Tagging:** Every child mesh of an interactive entity must store a reference to the root entity:
   ```ts
   childMesh.userData = { entity: this };
   ```
2. **Comprehensive Raycast Collection:** `getRaycastTargets()` must return all interactive child meshes or a dedicated bounding hit collider:
   ```ts
   public getRaycastTargets(): THREE.Object3D[] {
     const targets: THREE.Object3D[] = [];
     for (const entity of this.entities) {
       targets.push(entity.baseMesh);
       targets.push(...entity.clickableMeshes);
     }
     return targets;
   }
   ```

---

## 6. Economy & Reward Integrity

1. **Balance Floor:** Balance subtractions must never produce negative values:
   ```ts
   this.coins = Math.max(0, this.coins - cost);
   ```
2. **Exact Delta Rewards:** Multiplier ad rewards must calculate the exact delta bonus rather than running unconstrained reward loops:
   ```ts
   const finalBonus = Math.floor(baseReward * multiplier);
   const extraBonus = finalBonus - baseReward;
   if (extraBonus > 0) {
     this.economy.addCoins(extraBonus);
   }
   ```
3. **Double-Claim Prevention:** Once a reward has been granted for an event (e.g., level victory, revive), the reward button must immediately disable or hide to prevent spam clicking.

---

## 7. Resource Disposal & Memory Hygiene

1. **Scene Transition Teardown:** Whenever a level, state, or game session resets, all instantiated Three.js geometries, materials, textures, and Rapier rigid bodies must be explicitly disposed.
2. **Listener & Timer Cleanup:** Clear all `setInterval`, `setTimeout`, `requestAnimationFrame`, DOM listeners, and EventBus subscriptions when tearing down scenes or on `beforeunload`.
3. **Zero Hot-Path Allocations:** Zero `new`, closures, spreads, or array allocations in `update()`, `fixedUpdate()`, or `render()` loops.
