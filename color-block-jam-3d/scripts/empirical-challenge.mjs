import ts from '../node_modules/typescript/lib/typescript.js';
import fs from 'fs';
import path from 'path';
import * as THREE from 'three';

console.log('===============================================================');
console.log('EMPIRICAL CHALLENGER: color-block-jam-3d Verification Suite');
console.log('===============================================================\n');

// Module Loader
const modules = {};
function customRequire(id, fromDir) {
  if (id === 'three') return THREE;
  const resolved = path.resolve(fromDir, id.endsWith('.ts') ? id : id + '.ts');
  if (modules[resolved]) return modules[resolved].exports;
  const code = fs.readFileSync(resolved, 'utf-8');
  const transpiled = ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
  });
  const mod = { exports: {} };
  modules[resolved] = mod;
  const fn = new Function('require', 'exports', 'module', transpiled.outputText);
  fn((req) => customRequire(req, path.dirname(resolved)), mod.exports, mod);
  return mod.exports;
}

const { LevelGenerator } = customRequire('./src/game/systems/solver-generator.ts', process.cwd());
const { Board } = customRequire('./src/game/entities/board.ts', process.cwd());
const { Block } = customRequire('./src/game/entities/block.ts', process.cwd());
const { ShredderGate } = customRequire('./src/game/entities/shredder-gate.ts', process.cwd());
const { BLOCK_COLORS } = customRequire('./src/game/config/game-config.ts', process.cwd());

let testPassed = 0;
let testFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  ❌ FAIL: ${message}`);
    testFailed++;
    return false;
  } else {
    testPassed++;
    return true;
  }
}

// ---------------------------------------------------------------------
// TEST SUITE 1: LevelGenerator Bounds & Solvability (Levels 1 to 30)
// ---------------------------------------------------------------------
console.log('--- TEST SUITE 1: LevelGenerator Validation (Levels 1 to 30) ---');

const generatedLevels = [];

for (let lvl = 1; lvl <= 30; lvl++) {
  const data = LevelGenerator.generateLevel(lvl);
  generatedLevels.push(data);

  // 1. Check dimensions
  if (lvl <= 2) {
    assert(data.cols === 5 && data.rows === 5, `Level ${lvl} must be 5x5, got ${data.cols}x${data.rows}`);
  } else if (lvl <= 6) {
    assert(data.cols === 6 && data.rows === 6, `Level ${lvl} must be 6x6, got ${data.cols}x${data.rows}`);
  } else {
    assert(data.cols === 7 && data.rows === 7, `Level ${lvl} must be 7x7, got ${data.cols}x${data.rows}`);
  }

  // 2. Check blocks inside boundaries
  const occupiedSet = new Set();
  for (const b of data.blocks) {
    for (const sc of b.shapeCells) {
      const cx = b.gridX + sc.x;
      const cy = b.gridY + sc.y;
      assert(cx >= 0 && cx < data.cols, `Level ${lvl} block ${b.id} cell X out of bounds: ${cx} (cols=${data.cols})`);
      assert(cy >= 0 && cy < data.rows, `Level ${lvl} block ${b.id} cell Y out of bounds: ${cy} (rows=${data.rows})`);
      const key = `${cx},${cy}`;
      assert(!occupiedSet.has(key), `Level ${lvl} overlapping blocks at cell (${cx}, ${cy})`);
      occupiedSet.add(key);
    }
  }

  // 3. Check gates inside boundaries
  for (const g of data.gates) {
    const maxBound = (g.side === 'top' || g.side === 'bottom') ? data.cols : data.rows;
    assert(g.cellIndex >= 0, `Level ${lvl} gate cellIndex < 0: ${g.cellIndex}`);
    assert(g.cellIndex + g.spanCells <= maxBound, `Level ${lvl} gate out of range: cellIndex ${g.cellIndex} + span ${g.spanCells} > ${maxBound}`);
  }

  // 4. Check solver-generator validator
  const solvable = LevelGenerator.validateLevelSolvability(data);
  assert(solvable === true, `Level ${lvl} failed LevelGenerator.validateLevelSolvability`);
}

console.log(`  ✅ All 30 levels have valid dimensions, strictly in-bound coordinates, zero cell collisions, and validateLevelSolvability === true.\n`);

// ---------------------------------------------------------------------
// TEST SUITE 2: Independent Oracle BFS Solver & Circular Deadlock Check
// ---------------------------------------------------------------------
console.log('--- TEST SUITE 2: Independent Oracle BFS Solver (Levels 1 to 30) ---');

function solveWithIndependentOracle(data, maxStates = 400) {
  const { cols, rows, gates, blocks } = data;

  const isCellOccupied = (x, y, stateBlocks, excludeId) => {
    for (const b of stateBlocks) {
      if (b.id === excludeId) continue;
      for (const sc of b.shapeCells) {
        if (b.gridX + sc.x === x && b.gridY + sc.y === y) return true;
      }
    }
    return false;
  };

  const trySlide = (b, dirX, dirY, stateBlocks) => {
    let curX = b.gridX;
    let curY = b.gridY;
    const maxSteps = Math.max(cols, rows) + 1;
    let steps = 0;

    for (let s = 0; s < maxSteps; s++) {
      const nextX = curX + dirX;
      const nextY = curY + dirY;

      let allInside = true;
      let exitSide = null;

      for (const sc of b.shapeCells) {
        const cx = nextX + sc.x;
        const cy = nextY + sc.y;
        if (cx < 0) { allInside = false; exitSide = 'left'; }
        else if (cx >= cols) { allInside = false; exitSide = 'right'; }
        else if (cy < 0) { allInside = false; exitSide = 'top'; }
        else if (cy >= rows) { allInside = false; exitSide = 'bottom'; }
      }

      if (allInside) {
        let collision = false;
        for (const sc of b.shapeCells) {
          if (isCellOccupied(nextX + sc.x, nextY + sc.y, stateBlocks, b.id)) {
            collision = true;
            break;
          }
        }
        if (collision) break;
        curX = nextX;
        curY = nextY;
        steps++;
      } else {
        if (exitSide) {
          let minCoord = Infinity;
          let maxCoord = -Infinity;
          for (const sc of b.shapeCells) {
            const coord = (exitSide === 'top' || exitSide === 'bottom') ? (nextX + sc.x) : (nextY + sc.y);
            minCoord = Math.min(minCoord, coord);
            maxCoord = Math.max(maxCoord, coord);
          }
          const matchedGate = gates.find(
            (g) => g.side === exitSide && g.color.id === b.color.id &&
                   minCoord >= g.cellIndex && maxCoord <= g.cellIndex + g.spanCells - 1
          );
          if (matchedGate) {
            return { type: 'shredded' };
          }
        }
        break;
      }
    }

    if (steps > 0 && (curX !== b.gridX || curY !== b.gridY)) {
      return { type: 'moved', newX: curX, newY: curY };
    }
    return { type: 'blocked' };
  };

  const hashState = (st) => st.map((b) => `${b.id}:${b.gridX},${b.gridY}`).sort().join('|');

  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  const initialSimBlocks = blocks.map((b) => ({
    id: b.id,
    color: b.color,
    shapeCells: b.shapeCells,
    gridX: b.gridX,
    gridY: b.gridY,
  }));

  const queue = [{ state: initialSimBlocks, depth: 0 }];
  const visited = new Set();
  visited.add(hashState(initialSimBlocks));
  let statesExplored = 0;

  while (queue.length > 0 && statesExplored < maxStates) {
    statesExplored++;
    const { state, depth } = queue.shift();

    if (state.length === 0) {
      return { solved: true, moves: depth, statesExplored };
    }

    // First check immediate shreds
    let shreddedAny = false;
    for (let i = 0; i < state.length; i++) {
      const b = state[i];
      for (const d of directions) {
        const res = trySlide(b, d.x, d.y, state);
        if (res.type === 'shredded') {
          const nextState = state.filter((_, idx) => idx !== i);
          const key = hashState(nextState);
          if (!visited.has(key)) {
            visited.add(key);
            queue.unshift({ state: nextState, depth: depth + 1 });
            shreddedAny = true;
            break;
          }
        }
      }
      if (shreddedAny) break;
    }

    if (shreddedAny) continue;

    // Explore board moves
    for (const b of state) {
      for (const d of directions) {
        const res = trySlide(b, d.x, d.y, state);
        if (res.type === 'moved') {
          const nextState = state.map((item) =>
            item.id === b.id ? { ...item, gridX: res.newX, gridY: res.newY } : item
          );
          const key = hashState(nextState);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push({ state: nextState, depth: depth + 1 });
          }
        }
      }
    }
  }

  return { solved: false, statesExplored };
}

for (let lvl = 1; lvl <= 30; lvl++) {
  const data = generatedLevels[lvl - 1];
  const oracleResult = solveWithIndependentOracle(data);
  assert(oracleResult.solved === true, `Level ${lvl} could NOT be solved by Independent Oracle (deadlocked or state budget exceeded)`);
  console.log(`  Level ${lvl.toString().padStart(2, ' ')} (${data.cols}x${data.rows}, ${data.blocks.length} blocks, ${data.gates.length} gates) -> Solved in ${oracleResult.moves} moves (${oracleResult.statesExplored} states evaluated)`);
}

console.log(`  ✅ Independent Oracle successfully verified all 30 levels are 100% solvable with ZERO circular deadlocks.\n`);

// ---------------------------------------------------------------------
// TEST SUITE 3: Fallback Presets Solvability
// ---------------------------------------------------------------------
console.log('--- TEST SUITE 3: Fallback Presets Solvability ---');

// Access fallback preset via reflect or LevelGenerator
const fallback6x6 = LevelGenerator.getFallbackPreset(5);
assert(fallback6x6.cols === 6 && fallback6x6.rows === 6, 'Fallback 6x6 dimensions mismatch');
assert(LevelGenerator.validateLevelSolvability(fallback6x6) === true, 'Fallback 6x6 must be solvable by validateLevelSolvability');
const oracleFb6 = solveWithIndependentOracle(fallback6x6);
assert(oracleFb6.solved === true, 'Fallback 6x6 must be solvable by Independent Oracle');
console.log(`  Fallback 6x6: Solved in ${oracleFb6.moves} moves`);

const fallback7x7 = LevelGenerator.getFallbackPreset(8);
assert(fallback7x7.cols === 7 && fallback7x7.rows === 7, 'Fallback 7x7 dimensions mismatch');
assert(LevelGenerator.validateLevelSolvability(fallback7x7) === true, 'Fallback 7x7 must be solvable by validateLevelSolvability');
const oracleFb7 = solveWithIndependentOracle(fallback7x7);
assert(oracleFb7.solved === true, 'Fallback 7x7 must be solvable by Independent Oracle');
console.log(`  Fallback 7x7: Solved in ${oracleFb7.moves} moves`);

console.log(`  ✅ Both 6x6 and 7x7 fallback presets are verified 100% solvable.\n`);

// ---------------------------------------------------------------------
// TEST SUITE 4: Dynamic Board Resizing & Boundary Indices
// ---------------------------------------------------------------------
console.log('--- TEST SUITE 4: Dynamic Board Resizing & Boundary Indices ---');

const testBoard = new Board(6, 6);
assert(testBoard.cols === 6 && testBoard.rows === 6, 'Board initial cols/rows should be 6, 6');

// Dynamic resize to 5x5
testBoard.setDimensions(5, 5);
assert(testBoard.cols === 5 && testBoard.rows === 5, 'Board dynamic resize to 5x5 failed');

// Dynamic resize to 7x7
testBoard.setDimensions(7, 7);
assert(testBoard.cols === 7 && testBoard.rows === 7, 'Board dynamic resize to 7x7 failed');

// Resize back to 5x5 and test boundary clamp
testBoard.clear();
testBoard.setDimensions(5, 5);

// Add gate at top (negative Z), cellIndex=2, spanCells=1
const redGateTop = new ShredderGate('g_top_2', 'top', BLOCK_COLORS.red, 2, 1, 5, 5);
testBoard.addGate(redGateTop);

// Add 1x1 block at (2, 2)
const redBlock = new Block('b1', BLOCK_COLORS.red, [{ x: 0, y: 0 }], 2, 2, 5, 5);
testBoard.addBlock(redBlock);

// Slide up (y: -1) directly into matching gate
const shredRes = testBoard.trySlideBlock(redBlock, 0, -1);
assert(shredRes.type === 'shredded', `Expected block to be shredded by matching top gate, got: ${shredRes.type}`);
// Step animation in two frames to complete sliding_to_gate then shredding
testBoard.update(0.3);
testBoard.update(0.4);
assert(testBoard.getRemainingCount() === 0, `Expected 0 remaining blocks after shred, got ${testBoard.getRemainingCount()}`);

// Add another block on 5x5 at (2, 2) and slide right where there is NO gate
const blueBlock = new Block('b2', BLOCK_COLORS.blue, [{ x: 0, y: 0 }], 2, 2, 5, 5);
testBoard.addBlock(blueBlock);
const moveRightRes = testBoard.trySlideBlock(blueBlock, 1, 0);
assert(moveRightRes.type === 'moved', `Expected block to move to right boundary, got: ${moveRightRes.type}`);
assert(blueBlock.gridX === 4, `Expected block to stop at boundary index 4 on 5x5 board, got ${blueBlock.gridX}`);
testBoard.update(0.25); // Finish slide animation

// Slide down on 5x5 where there is NO gate
const moveDownRes = testBoard.trySlideBlock(blueBlock, 0, 1);
assert(moveDownRes.type === 'moved', `Expected block to move to bottom boundary, got: ${moveDownRes.type}`);
assert(blueBlock.gridY === 4, `Expected block to stop at boundary index 4 on 5x5 board, got ${blueBlock.gridY}`);
testBoard.update(0.25); // Finish slide animation

// Slide left on 5x5
const moveLeftRes = testBoard.trySlideBlock(blueBlock, -1, 0);
assert(moveLeftRes.type === 'moved', `Expected block to move to left boundary, got: ${moveLeftRes.type}`);
assert(blueBlock.gridX === 0, `Expected block to stop at boundary index 0 on 5x5 board, got ${blueBlock.gridX}`);
testBoard.update(0.25);

// Now test 7x7 board boundaries (indices 0 to 6)
testBoard.clear();
testBoard.setDimensions(7, 7);
const block7 = new Block('b7', BLOCK_COLORS.yellow, [{ x: 0, y: 0 }], 3, 3, 7, 7);
testBoard.addBlock(block7);

// Slide right to column 6
const move7Right = testBoard.trySlideBlock(block7, 1, 0);
assert(move7Right.type === 'moved', `Expected 7x7 block to move right`);
assert(block7.gridX === 6, `Expected block to reach boundary index 6 on 7x7 board, got ${block7.gridX}`);
testBoard.update(0.25);

// Slide down to row 6
const move7Down = testBoard.trySlideBlock(block7, 0, 1);
assert(move7Down.type === 'moved', `Expected 7x7 block to move down`);
assert(block7.gridY === 6, `Expected block to reach boundary index 6 on 7x7 board, got ${block7.gridY}`);
testBoard.update(0.25);

console.log(`  ✅ Dynamic board dimensions and boundary clamping verified on 5x5 (0..4) and 7x7 (0..6).\n`);

// ---------------------------------------------------------------------
// TEST SUITE 5: Tactile Grab Lift Feedback
// ---------------------------------------------------------------------
console.log('--- TEST SUITE 5: Tactile Grab Lift Feedback ---');

const liftBlock = new Block('b_lift', BLOCK_COLORS.green, [{ x: 0, y: 0 }], 0, 0, 6, 6);
assert(liftBlock.state === 'idle', 'Block initial state must be idle');

// Trigger grab
liftBlock.setGrabbed(true);
for (let f = 0; f < 30; f++) {
  liftBlock.update(0.016);
}
assert(Math.abs(liftBlock.group.position.y - 0.12) < 0.01, `Expected grabbed block elevation ~0.12, got ${liftBlock.group.position.y}`);
assert(Math.abs(liftBlock.group.scale.x - 1.04) < 0.01, `Expected grabbed block scale ~1.04, got ${liftBlock.group.scale.x}`);

// Release grab
liftBlock.setGrabbed(false);
for (let f = 0; f < 30; f++) {
  liftBlock.update(0.016);
}
assert(Math.abs(liftBlock.group.position.y - 0.0) < 0.005, `Expected released block elevation ~0.0, got ${liftBlock.group.position.y}`);
assert(Math.abs(liftBlock.group.scale.x - 1.0) < 0.005, `Expected released block scale ~1.0, got ${liftBlock.group.scale.x}`);

// Ensure grab is ignored if block is sliding
liftBlock.startSlideTo(2, 2, 6, 6);
assert(liftBlock.state === 'sliding', 'Block must be sliding');
liftBlock.setGrabbed(true);
liftBlock.update(0.016);
// While sliding, elevation must not jump to grabbed
assert(Math.abs(liftBlock.group.position.y) < 1e-4, `Sliding block should not be elevated by grab, y=${liftBlock.group.position.y}`);

console.log(`  ✅ Tactile grab elevation (y=0.12, scale=1.04) and release verified smoothly.\n`);

console.log('===============================================================');
console.log(`TEST RESULTS: ${testPassed} assertions passed, ${testFailed} failed.`);
console.log('===============================================================');
if (testFailed > 0) {
  console.log(`\n❌ VERDICT: FAIL - Found ${testFailed} failures in empirical challenge suite.`);
  process.exit(1);
} else {
  console.log('\n✅ VERDICT: PASS - All empirical assertions passed.');
}
