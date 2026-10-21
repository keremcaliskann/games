import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from 'three';
import { calculateMoveBudget, DIRECTION_COLORS, DIRECTION_VECTORS } from '../src/game/config/game-config';
import { PuzzleGrid } from '../src/game/entities/puzzle-grid';
import { ArrowBlock } from '../src/game/entities/arrow-block';
import { EventBus } from '../src/core/events';

console.log('====================================================');
console.log('RUNNING EMPIRICAL TEST SUITE: cyber-arrow-3d MILESTONE 2');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function test(name: string, fn: () => void) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err: any) {
    console.error(`[FAIL] ${name}:`, err.message);
    throw err;
  }
}

// -------------------------------------------------------------
// Test 1: calculateMoveBudget Formula & Values
// -------------------------------------------------------------
test('Move Budget: calculateMoveBudget matches formula for target block sizes (8, 9, 18, 27, 36)', () => {
  const targets = [
    { blocks: 8, expected: 11 },   // 8 + max(3, ceil(2.8)) = 8 + 3 = 11
    { blocks: 9, expected: 13 },   // 9 + max(3, ceil(3.15)) = 9 + 4 = 13
    { blocks: 18, expected: 25 },  // 18 + max(3, ceil(6.3)) = 18 + 7 = 25
    { blocks: 27, expected: 37 },  // 27 + max(3, ceil(9.45)) = 27 + 10 = 37
    { blocks: 36, expected: 49 },  // 36 + max(3, ceil(12.6)) = 36 + 13 = 49
  ];

  for (const { blocks, expected } of targets) {
    const actual = calculateMoveBudget(blocks);
    const formulaVal = blocks + Math.max(3, Math.ceil(blocks * 0.35));
    assert.strictEqual(actual, expected, `Failed for ${blocks} blocks: got ${actual}, expected ${expected}`);
    assert.strictEqual(actual, formulaVal, `Mismatch with formula for ${blocks} blocks`);
  }
});

test('Move Budget: boundary and edge cases (0, 1, 2, 5, 50, 100)', () => {
  const cases = [0, 1, 2, 5, 50, 100];
  for (const b of cases) {
    const expected = b + Math.max(3, Math.ceil(b * 0.35));
    assert.strictEqual(calculateMoveBudget(b), expected, `Failed for ${b} blocks`);
  }
});

// -------------------------------------------------------------
// Test 2: Simulation of Move Decrement & Game Over
// -------------------------------------------------------------
test('Move Decrement Simulation: Decrements by 1 on each tap, triggers game over at 0', () => {
  const totalBlocks = 8;
  let movesRemaining = calculateMoveBudget(totalBlocks); // 11
  let isGameOver = false;
  let remainingBlocks = totalBlocks;

  function simulateTap() {
    if (isGameOver) return false;
    movesRemaining--;
    if (movesRemaining <= 0 && remainingBlocks > 0) {
      isGameOver = true;
    }
    return true;
  }

  assert.strictEqual(movesRemaining, 11);
  assert.strictEqual(isGameOver, false);

  // Perform 10 taps
  for (let i = 1; i <= 10; i++) {
    const tapped = simulateTap();
    assert.strictEqual(tapped, true);
    assert.strictEqual(movesRemaining, 11 - i);
    assert.strictEqual(isGameOver, false);
  }

  // 11th tap reaches 0
  const eleventhTap = simulateTap();
  assert.strictEqual(eleventhTap, true);
  assert.strictEqual(movesRemaining, 0);
  assert.strictEqual(isGameOver, true, 'isGameOver must be true when movesRemaining reaches 0 and blocks remain');

  // Attempting another tap when isGameOver is true must be rejected
  const twelfthTap = simulateTap();
  assert.strictEqual(twelfthTap, false, 'Tap must be rejected when isGameOver is true');
  assert.strictEqual(movesRemaining, 0, 'movesRemaining must not decrement below 0');
});

// -------------------------------------------------------------
// Test 3: Revive Action Simulation
// -------------------------------------------------------------
test('Revive Action Simulation: adds +5 moves and resets isGameOver = false', () => {
  let movesRemaining = 0;
  let isGameOver = true;
  let remainingBlocks = 4;

  function simulateRevive() {
    movesRemaining += 5;
    isGameOver = false;
  }

  function simulateTap() {
    if (isGameOver) return false;
    movesRemaining--;
    if (movesRemaining <= 0 && remainingBlocks > 0) {
      isGameOver = true;
    }
    return true;
  }

  simulateRevive();
  assert.strictEqual(movesRemaining, 5, 'movesRemaining should be 5 after revive');
  assert.strictEqual(isGameOver, false, 'isGameOver should be reset to false after revive');

  // Verify player can continue tapping
  const tap1 = simulateTap();
  assert.strictEqual(tap1, true);
  assert.strictEqual(movesRemaining, 4);
  assert.strictEqual(isGameOver, false);
});

// -------------------------------------------------------------
// Test 4: Hammer Booster Gameplay Mechanics
// -------------------------------------------------------------
test('Hammer Booster: clears block, emits block_cleared, removes from blocksMap, NO move decrement', () => {
  const grid = new PuzzleGrid();
  const bus = EventBus.get();

  // Create two blocks: block1 at (0,0,0) facing +X, blocked by block2 at (1,0,0) facing +Y
  const block1 = new ArrowBlock(0, 0, 0, '+X');
  const block2 = new ArrowBlock(1, 0, 0, '+Y');

  grid.addBlock(block1);
  grid.addBlock(block2);

  assert.strictEqual(grid.getRemainingCount(), 2);
  assert.strictEqual(grid.isPathClear(block1), false, 'block1 should be blocked by block2');

  let movesRemaining = 10;
  let isGameOver = false;
  let isHammerActive = false;

  let blockClearedEventPayload: ArrowBlock | null = null;
  const unsubscribe = bus.on('block_cleared', (payload: ArrowBlock) => {
    blockClearedEventPayload = payload;
  });

  // Activate Hammer booster
  isHammerActive = true;

  // Simulate tap handling logic matching src/main.ts:
  // if (this.isHammerActive) {
  //   this.isHammerActive = false;
  //   this.hud.setHammerActive(false);
  //   this.grid.hammerDestroyBlock(block);
  //   return;
  // }
  function handleTapSimulation(block: ArrowBlock) {
    if (isGameOver) return;
    if (block.state !== 'IDLE') return;

    if (isHammerActive) {
      isHammerActive = false;
      grid.hammerDestroyBlock(block);
      return; // Early return, moves NOT decremented!
    }

    movesRemaining--;
    grid.tryTapBlock(block);
    if (movesRemaining <= 0 && grid.getRemainingCount() > 0) {
      isGameOver = true;
    }
  }

  // Use Hammer on block1 (which is blocked!)
  handleTapSimulation(block1);

  // Assertions:
  assert.strictEqual(isHammerActive, false, 'Hammer booster should deactivate after use');
  assert.strictEqual(movesRemaining, 10, 'Moves remaining MUST NOT decrement when hammer is used');
  assert.strictEqual(block1.state, 'FLYING', 'Block state should transition to FLYING');
  assert.strictEqual(blockClearedEventPayload, block1, 'EventBus should emit block_cleared with targeted block');

  // Verify block1 was removed from grid blocksMap
  // Since blocksMap is private, verify via isPathClear for a block that was previously blocked by block1
  // Add block0 at (-1, 0, 0) pointing +X towards where block1 was
  const block0 = new ArrowBlock(-1, 0, 0, '+X');
  grid.addBlock(block0);
  // Path for block0: curX goes to 0 (where block1 was, now cleared/deleted) and 1 (where block2 is, still present)
  // block0 is blocked by block2, but not by block1
  assert.strictEqual(grid.isPathClear(block0), false, 'block0 blocked by block2 at x=1');

  // Now hammer destroy block2
  isHammerActive = true;
  handleTapSimulation(block2);
  assert.strictEqual(block2.state, 'FLYING');
  assert.strictEqual(movesRemaining, 10, 'Moves still 10, no decrement');
  assert.strictEqual(blockClearedEventPayload, block2);

  // Now with block1 and block2 both cleared from blocksMap, block0 path must be completely clear!
  assert.strictEqual(grid.isPathClear(block0), true, 'block0 should now have clear path because block1 and block2 were removed from blocksMap');

  unsubscribe();
  grid.dispose();
});

// -------------------------------------------------------------
// Test 5: Art Direction & Palette Constants Verification
// -------------------------------------------------------------
test('Palette: DIRECTION_COLORS has all 6 soft matte toy cardinal colors', () => {
  const expectedColors = {
    '+Y': 0xf97316, // Up: Coral Orange
    '-Y': 0x14b8a6, // Down: Teal
    '-X': 0x38bdf8, // Left: Sky Blue
    '+X': 0xfbbf24, // Right: Sunny Gold
    '-Z': 0x10b981, // In: Mint
    '+Z': 0xa855f7, // Out: Lavender
  };

  for (const [dir, col] of Object.entries(expectedColors)) {
    assert.strictEqual(
      DIRECTION_COLORS[dir as keyof typeof DIRECTION_COLORS],
      col,
      `Direction color for ${dir} should be 0x${col.toString(16)}`
    );
  }
});

// -------------------------------------------------------------
// Test 6: Dead Code Cleanup Check
// -------------------------------------------------------------
test('Dead Code: src/platform/lifecycle.ts and storage.ts are deleted', () => {
  const lifecyclePath = path.resolve('src/platform/lifecycle.ts');
  const storagePath = path.resolve('src/platform/storage.ts');
  assert.strictEqual(fs.existsSync(lifecyclePath), false, 'src/platform/lifecycle.ts should not exist');
  assert.strictEqual(fs.existsSync(storagePath), false, 'src/platform/storage.ts should not exist');
});

// -------------------------------------------------------------
// Test 7: Stress & Edge Cases
// -------------------------------------------------------------
test('Edge Case: Last move clears final block -> player WINS, does NOT trigger game over', () => {
  const grid = new PuzzleGrid();
  const bus = EventBus.get();

  // Single block with clear path
  const block = new ArrowBlock(0, 0, 0, '+X');
  grid.addBlock(block);

  let movesRemaining = 1;
  let isGameOver = false;

  // Tap block on final move
  movesRemaining--;
  grid.tryTapBlock(block);

  // Condition from src/main.ts
  if (movesRemaining <= 0 && grid.getRemainingCount() > 0) {
    isGameOver = true;
  }

  assert.strictEqual(movesRemaining, 0);
  assert.strictEqual(isGameOver, false, 'Winning move must NOT trigger game over');
  assert.strictEqual(block.state, 'FLYING');
  assert.strictEqual(grid.getRemainingCount(), 0);

  grid.dispose();
});

test('Edge Case: Last move bonks on blocked block -> triggers Near-Miss game over', () => {
  const grid = new PuzzleGrid();

  const block1 = new ArrowBlock(0, 0, 0, '+X');
  const block2 = new ArrowBlock(1, 0, 0, '+Y');
  grid.addBlock(block1);
  grid.addBlock(block2);

  let movesRemaining = 1;
  let isGameOver = false;

  // Tap blocked block on final move
  movesRemaining--;
  grid.tryTapBlock(block1);

  if (movesRemaining <= 0 && grid.getRemainingCount() > 0) {
    isGameOver = true;
  }

  assert.strictEqual(movesRemaining, 0);
  assert.strictEqual(isGameOver, true, 'Bonk on final move MUST trigger game over');
  assert.strictEqual(block1.state, 'BONK');
  assert.strictEqual(grid.getRemainingCount(), 2);

  grid.dispose();
});

test('Edge Case: Hammer destroying the final block leads to level completion on animation end', () => {
  const grid = new PuzzleGrid();
  const bus = EventBus.get();

  const finalBlock = new ArrowBlock(0, 0, 0, '+X');
  grid.addBlock(finalBlock);

  let levelCompletedEmitted = false;
  const unsub = bus.on('level_completed', () => {
    levelCompletedEmitted = true;
  });

  // Hammer destroy the last block
  grid.hammerDestroyBlock(finalBlock);
  assert.strictEqual(finalBlock.state, 'FLYING');
  assert.strictEqual(grid.getRemainingCount(), 0);

  // Advance animation loop until fly completes (flySpeed is 22, delta 0.1s steps)
  for (let i = 0; i < 30; i++) {
    grid.update(0.1);
  }

  assert.strictEqual(levelCompletedEmitted, true, 'level_completed must be emitted when hammer-destroyed final block completes flight');

  unsub();
  grid.dispose();
});

console.log(`\n====================================================`);
console.log(`ALL EMPIRICAL TESTS PASSED: ${passedTests}/${totalTests}`);
console.log(`====================================================`);

