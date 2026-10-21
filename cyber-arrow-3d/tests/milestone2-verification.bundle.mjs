// tests/milestone2-verification.test.ts
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

// src/game/config/game-config.ts
import * as THREE from "three";
var DIRECTION_VECTORS = {
  "+X": new THREE.Vector3(1, 0, 0),
  "-X": new THREE.Vector3(-1, 0, 0),
  "+Y": new THREE.Vector3(0, 1, 0),
  "-Y": new THREE.Vector3(0, -1, 0),
  "+Z": new THREE.Vector3(0, 0, 1),
  "-Z": new THREE.Vector3(0, 0, -1)
};
var DIRECTION_COLORS = {
  "+Y": 16347926,
  // Up: Coral Orange
  "-Y": 1357990,
  // Down: Teal
  "-X": 3718648,
  // Left: Sky Blue
  "+X": 16498468,
  // Right: Sunny Gold
  "-Z": 1096065,
  // In: Mint
  "+Z": 11032055
  // Out: Lavender
};
function calculateMoveBudget(totalBlocks) {
  return totalBlocks + Math.max(3, Math.ceil(totalBlocks * 0.35));
}
var GAME_CONFIG = {
  blockSize: 1,
  blockSpacing: 1.15,
  flySpeed: 22,
  bonkDistance: 0.22,
  coinsPerLevel: 25,
  hintCost: 20,
  interstitialIntervalLevels: 3
};

// src/game/entities/puzzle-grid.ts
import * as THREE2 from "three";

// src/core/events.ts
var EventBus = class _EventBus {
  static instance;
  listeners = /* @__PURE__ */ new Map();
  static get() {
    if (!_EventBus.instance) {
      _EventBus.instance = new _EventBus();
    }
    return _EventBus.instance;
  }
  on(event, callback) {
    let list = this.listeners.get(event);
    if (!list) {
      list = [];
      this.listeners.set(event, list);
    }
    list.push(callback);
    return () => this.off(event, callback);
  }
  off(event, callback) {
    const list = this.listeners.get(event);
    if (!list) return;
    const index = list.indexOf(callback);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }
  emit(event, payload) {
    const list = this.listeners.get(event);
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      list[i](payload);
    }
  }
};

// src/game/entities/puzzle-grid.ts
var PuzzleGrid = class _PuzzleGrid {
  rootGroup = new THREE2.Group();
  blocksMap = /* @__PURE__ */ new Map();
  blocksList = [];
  bus = EventBus.get();
  pedestalMesh;
  activeHintBlock = null;
  isLevelCompleted = false;
  constructor() {
    const floorGeo = new THREE2.CylinderGeometry(7.5, 8.2, 0.5, 32);
    const floorMat = new THREE2.MeshStandardMaterial({
      color: 16578798,
      // Warm biscuit pedestal
      roughness: 0.55,
      metalness: 0.02
    });
    this.pedestalMesh = new THREE2.Mesh(floorGeo, floorMat);
    this.pedestalMesh.position.set(0, -3.5, 0);
    this.pedestalMesh.receiveShadow = true;
    this.rootGroup.add(this.pedestalMesh);
  }
  static key(gx, gy, gz) {
    return `${gx},${gy},${gz}`;
  }
  clear() {
    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      this.rootGroup.remove(b.group);
      b.dispose();
    }
    this.blocksMap.clear();
    this.blocksList.length = 0;
    this.activeHintBlock = null;
    this.isLevelCompleted = false;
  }
  addBlock(block) {
    const k = _PuzzleGrid.key(block.gx, block.gy, block.gz);
    this.blocksMap.set(k, block);
    this.blocksList.push(block);
    this.rootGroup.add(block.group);
  }
  centerGrid() {
    if (this.blocksList.length === 0) return;
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      if (b.group.position.x < minX) minX = b.group.position.x;
      if (b.group.position.x > maxX) maxX = b.group.position.x;
      if (b.group.position.y < minY) minY = b.group.position.y;
      if (b.group.position.y > maxY) maxY = b.group.position.y;
      if (b.group.position.z < minZ) minZ = b.group.position.z;
      if (b.group.position.z > maxZ) maxZ = b.group.position.z;
    }
    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;
    const midZ = (minZ + maxZ) / 2;
    this.rootGroup.position.set(-midX, -midY, -midZ);
    this.pedestalMesh.position.set(midX, minY - 1.6, midZ);
  }
  /**
   * Evaluates whether an arrow block has an unobstructed path to escape.
   */
  isPathClear(block) {
    const dir = block.direction;
    const vec = DIRECTION_VECTORS[dir];
    const dx = Math.round(vec.x);
    const dy = Math.round(vec.y);
    const dz = Math.round(vec.z);
    let curX = block.gx + dx;
    let curY = block.gy + dy;
    let curZ = block.gz + dz;
    const maxSteps = 15;
    let steps = 0;
    while (steps < maxSteps) {
      const k = _PuzzleGrid.key(curX, curY, curZ);
      const neighbor = this.blocksMap.get(k);
      if (neighbor && (neighbor.state === "IDLE" || neighbor.state === "BONK")) {
        return false;
      }
      curX += dx;
      curY += dy;
      curZ += dz;
      steps++;
    }
    return true;
  }
  tryTapBlock(block) {
    if (block.state !== "IDLE") return false;
    if (this.activeHintBlock === block) {
      block.setHint(false);
      this.activeHintBlock = null;
    }
    if (this.isPathClear(block)) {
      block.triggerFly();
      const k = _PuzzleGrid.key(block.gx, block.gy, block.gz);
      this.blocksMap.delete(k);
      this.bus.emit("block_cleared", block);
      return true;
    } else {
      block.triggerBonk();
      this.bus.emit("block_blocked", block);
      return false;
    }
  }
  /**
   * Immediately destroys a single targeted block regardless of path obstruction.
   * Consumed by Hook 1 Hammer booster.
   */
  hammerDestroyBlock(block) {
    if (block.state !== "IDLE") return;
    if (this.activeHintBlock === block) {
      block.setHint(false);
      this.activeHintBlock = null;
    }
    const k = _PuzzleGrid.key(block.gx, block.gy, block.gz);
    this.blocksMap.delete(k);
    block.triggerFly();
    this.bus.emit("block_cleared", block);
  }
  getRaycastTargets() {
    const targets = [];
    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      if (b.state === "IDLE") {
        targets.push(b.baseMesh);
        for (let j = 0; j < b.arrowMeshes.length; j++) {
          targets.push(b.arrowMeshes[j]);
        }
      }
    }
    return targets;
  }
  showHint() {
    if (this.activeHintBlock) {
      this.activeHintBlock.setHint(false);
      this.activeHintBlock = null;
    }
    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      if (b.state === "IDLE" && this.isPathClear(b)) {
        b.setHint(true);
        this.activeHintBlock = b;
        return true;
      }
    }
    return false;
  }
  getRemainingCount() {
    let count = 0;
    for (let i = 0; i < this.blocksList.length; i++) {
      if (this.blocksList[i].state === "IDLE" || this.blocksList[i].state === "BONK") {
        count++;
      }
    }
    return count;
  }
  /**
   * Updates all active block animations without allocating any closures or objects.
   */
  update(delta) {
    for (let i = 0; i < this.blocksList.length; i++) {
      const b = this.blocksList[i];
      if (b.state === "BONK" || b.state === "FLYING") {
        const isFlyFinished = b.update(delta);
        if (isFlyFinished) {
          if (!this.isLevelCompleted && this.getRemainingCount() === 0) {
            this.isLevelCompleted = true;
            this.bus.emit("level_completed", null);
          }
        }
      }
    }
  }
  dispose() {
    this.clear();
    this.pedestalMesh.geometry.dispose();
    this.pedestalMesh.material.dispose();
  }
};

// src/game/entities/arrow-block.ts
import * as THREE3 from "three";
var boxGeo = new THREE3.BoxGeometry(GAME_CONFIG.blockSize, GAME_CONFIG.blockSize, GAME_CONFIG.blockSize);
var arrowHeadGeo = new THREE3.ConeGeometry(0.2, 0.32, 12);
var arrowShaftGeo = new THREE3.CylinderGeometry(0.08, 0.08, 0.26, 8);
function getLateralNormals(dir) {
  switch (dir) {
    case "+X":
    case "-X":
      return [
        new THREE3.Vector3(0, 1, 0),
        new THREE3.Vector3(0, -1, 0),
        new THREE3.Vector3(0, 0, 1),
        new THREE3.Vector3(0, 0, -1)
      ];
    case "+Y":
    case "-Y":
      return [
        new THREE3.Vector3(1, 0, 0),
        new THREE3.Vector3(-1, 0, 0),
        new THREE3.Vector3(0, 0, 1),
        new THREE3.Vector3(0, 0, -1)
      ];
    case "+Z":
    case "-Z":
      return [
        new THREE3.Vector3(1, 0, 0),
        new THREE3.Vector3(-1, 0, 0),
        new THREE3.Vector3(0, 1, 0),
        new THREE3.Vector3(0, -1, 0)
      ];
  }
}
var ArrowBlock = class {
  group;
  baseMesh;
  arrowMeshes = [];
  baseMaterial;
  arrowMaterial;
  defaultBlockColor;
  state = "IDLE";
  // Grid index coordinates
  gx;
  gy;
  gz;
  // Direction it must travel
  direction;
  dirVector;
  // Animation state values
  originPos;
  animTimer = 0;
  isHintHighlighted = false;
  constructor(gx, gy, gz, direction) {
    this.gx = gx;
    this.gy = gy;
    this.gz = gz;
    this.direction = direction;
    this.dirVector = DIRECTION_VECTORS[direction].clone();
    this.group = new THREE3.Group();
    this.group.userData = { block: this };
    this.defaultBlockColor = DIRECTION_COLORS[direction];
    this.baseMaterial = new THREE3.MeshStandardMaterial({
      color: this.defaultBlockColor,
      roughness: 0.48,
      metalness: 0.04
    });
    this.arrowMaterial = new THREE3.MeshStandardMaterial({
      color: 16578798,
      emissive: 16775399,
      emissiveIntensity: 0.25,
      roughness: 0.35,
      metalness: 0.02
    });
    this.baseMesh = new THREE3.Mesh(boxGeo, this.baseMaterial);
    this.baseMesh.castShadow = true;
    this.baseMesh.receiveShadow = true;
    this.baseMesh.userData = { block: this };
    this.group.add(this.baseMesh);
    this.buildArrows();
    const sp = GAME_CONFIG.blockSpacing;
    this.originPos = new THREE3.Vector3(gx * sp, gy * sp, gz * sp);
    this.group.position.copy(this.originPos);
  }
  buildArrows() {
    const forwardGroup = new THREE3.Group();
    const fShaft = new THREE3.Mesh(arrowShaftGeo, this.arrowMaterial);
    const fHead = new THREE3.Mesh(arrowHeadGeo, this.arrowMaterial);
    fShaft.position.y = -0.1;
    fHead.position.y = 0.18;
    fShaft.castShadow = true;
    fHead.castShadow = true;
    fShaft.userData = { block: this };
    fHead.userData = { block: this };
    forwardGroup.add(fShaft);
    forwardGroup.add(fHead);
    const up = new THREE3.Vector3(0, 1, 0);
    const quat = new THREE3.Quaternion().setFromUnitVectors(up, this.dirVector);
    forwardGroup.quaternion.copy(quat);
    forwardGroup.position.copy(this.dirVector).multiplyScalar(0.42);
    forwardGroup.scale.set(1.25, 1.25, 1.25);
    this.arrowMeshes.push(fShaft, fHead);
    this.group.add(forwardGroup);
    const lateralNormals = getLateralNormals(this.direction);
    for (let i = 0; i < lateralNormals.length; i++) {
      const normal = lateralNormals[i];
      const side = new THREE3.Vector3().crossVectors(normal, this.dirVector).normalize();
      const faceGroup = new THREE3.Group();
      const lShaft = new THREE3.Mesh(arrowShaftGeo, this.arrowMaterial);
      const lHead = new THREE3.Mesh(arrowHeadGeo, this.arrowMaterial);
      lShaft.position.y = -0.1;
      lHead.position.y = 0.18;
      lShaft.castShadow = true;
      lHead.castShadow = true;
      lShaft.userData = { block: this };
      lHead.userData = { block: this };
      faceGroup.add(lShaft);
      faceGroup.add(lHead);
      const basis = new THREE3.Matrix4().makeBasis(side, this.dirVector, normal);
      basis.setPosition(normal.x * 0.51, normal.y * 0.51, normal.z * 0.51);
      faceGroup.applyMatrix4(basis);
      faceGroup.scale.set(1.1, 1.1, 0.38);
      this.arrowMeshes.push(lShaft, lHead);
      this.group.add(faceGroup);
    }
  }
  triggerBonk() {
    if (this.state !== "IDLE") return;
    this.state = "BONK";
    this.animTimer = 0;
    this.arrowMaterial.color.setHex(15680580);
    this.arrowMaterial.emissive.setHex(15680580);
    this.arrowMaterial.emissiveIntensity = 1.8;
    this.baseMaterial.color.setHex(16698058);
  }
  triggerFly() {
    this.state = "FLYING";
    this.animTimer = 0;
    const flyColor = 1096065;
    this.arrowMaterial.color.setHex(flyColor);
    this.arrowMaterial.emissive.setHex(flyColor);
    this.arrowMaterial.emissiveIntensity = 2;
    this.baseMaterial.color.setHex(13761253);
  }
  setHint(highlight) {
    this.isHintHighlighted = highlight;
    if (highlight) {
      this.arrowMaterial.color.setHex(16096779);
      this.arrowMaterial.emissive.setHex(16096779);
      this.arrowMaterial.emissiveIntensity = 1.8;
      this.baseMaterial.color.setHex(16708551);
    } else {
      this.arrowMaterial.color.setHex(16578798);
      this.arrowMaterial.emissive.setHex(16775399);
      this.arrowMaterial.emissiveIntensity = 0.25;
      this.baseMaterial.color.setHex(this.defaultBlockColor);
    }
  }
  /**
   * Advances block animation without any heap allocations.
   * Returns true when escape flight finishes and block is cleared.
   */
  update(delta) {
    if (this.state === "BONK") {
      this.animTimer += delta;
      const bonkDuration = 0.22;
      if (this.animTimer >= bonkDuration) {
        this.group.position.copy(this.originPos);
        this.state = "IDLE";
        this.baseMaterial.color.setHex(this.defaultBlockColor);
        this.setHint(this.isHintHighlighted);
      } else {
        const progress = this.animTimer / bonkDuration;
        const offset = Math.sin(progress * Math.PI) * GAME_CONFIG.bonkDistance;
        this.group.position.copy(this.originPos).addScaledVector(this.dirVector, offset);
      }
      return false;
    } else if (this.state === "FLYING") {
      this.animTimer += delta;
      const speed = GAME_CONFIG.flySpeed * (1 + this.animTimer * 2.5);
      this.group.position.addScaledVector(this.dirVector, speed * delta);
      this.group.scale.multiplyScalar(Math.max(0.01, 1 - delta * 3));
      if (this.animTimer > 0.45) {
        this.state = "CLEARED";
        this.group.visible = false;
        return true;
      }
      return false;
    }
    return false;
  }
  dispose() {
    this.baseMaterial.dispose();
    this.arrowMaterial.dispose();
  }
};

// tests/milestone2-verification.test.ts
console.log("====================================================");
console.log("RUNNING EMPIRICAL TEST SUITE: cyber-arrow-3d MILESTONE 2");
console.log("====================================================\n");
var passedTests = 0;
var totalTests = 0;
function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    throw err;
  }
}
test("Move Budget: calculateMoveBudget matches formula for target block sizes (8, 9, 18, 27, 36)", () => {
  const targets = [
    { blocks: 8, expected: 11 },
    // 8 + max(3, ceil(2.8)) = 8 + 3 = 11
    { blocks: 9, expected: 13 },
    // 9 + max(3, ceil(3.15)) = 9 + 4 = 13
    { blocks: 18, expected: 25 },
    // 18 + max(3, ceil(6.3)) = 18 + 7 = 25
    { blocks: 27, expected: 37 },
    // 27 + max(3, ceil(9.45)) = 27 + 10 = 37
    { blocks: 36, expected: 49 }
    // 36 + max(3, ceil(12.6)) = 36 + 13 = 49
  ];
  for (const { blocks, expected } of targets) {
    const actual = calculateMoveBudget(blocks);
    const formulaVal = blocks + Math.max(3, Math.ceil(blocks * 0.35));
    assert.strictEqual(actual, expected, `Failed for ${blocks} blocks: got ${actual}, expected ${expected}`);
    assert.strictEqual(actual, formulaVal, `Mismatch with formula for ${blocks} blocks`);
  }
});
test("Move Budget: boundary and edge cases (0, 1, 2, 5, 50, 100)", () => {
  const cases = [0, 1, 2, 5, 50, 100];
  for (const b of cases) {
    const expected = b + Math.max(3, Math.ceil(b * 0.35));
    assert.strictEqual(calculateMoveBudget(b), expected, `Failed for ${b} blocks`);
  }
});
test("Move Decrement Simulation: Decrements by 1 on each tap, triggers game over at 0", () => {
  const totalBlocks = 8;
  let movesRemaining = calculateMoveBudget(totalBlocks);
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
  for (let i = 1; i <= 10; i++) {
    const tapped = simulateTap();
    assert.strictEqual(tapped, true);
    assert.strictEqual(movesRemaining, 11 - i);
    assert.strictEqual(isGameOver, false);
  }
  const eleventhTap = simulateTap();
  assert.strictEqual(eleventhTap, true);
  assert.strictEqual(movesRemaining, 0);
  assert.strictEqual(isGameOver, true, "isGameOver must be true when movesRemaining reaches 0 and blocks remain");
  const twelfthTap = simulateTap();
  assert.strictEqual(twelfthTap, false, "Tap must be rejected when isGameOver is true");
  assert.strictEqual(movesRemaining, 0, "movesRemaining must not decrement below 0");
});
test("Revive Action Simulation: adds +5 moves and resets isGameOver = false", () => {
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
  assert.strictEqual(movesRemaining, 5, "movesRemaining should be 5 after revive");
  assert.strictEqual(isGameOver, false, "isGameOver should be reset to false after revive");
  const tap1 = simulateTap();
  assert.strictEqual(tap1, true);
  assert.strictEqual(movesRemaining, 4);
  assert.strictEqual(isGameOver, false);
});
test("Hammer Booster: clears block, emits block_cleared, removes from blocksMap, NO move decrement", () => {
  const grid = new PuzzleGrid();
  const bus = EventBus.get();
  const block1 = new ArrowBlock(0, 0, 0, "+X");
  const block2 = new ArrowBlock(1, 0, 0, "+Y");
  grid.addBlock(block1);
  grid.addBlock(block2);
  assert.strictEqual(grid.getRemainingCount(), 2);
  assert.strictEqual(grid.isPathClear(block1), false, "block1 should be blocked by block2");
  let movesRemaining = 10;
  let isGameOver = false;
  let isHammerActive = false;
  let blockClearedEventPayload = null;
  const unsubscribe = bus.on("block_cleared", (payload) => {
    blockClearedEventPayload = payload;
  });
  isHammerActive = true;
  function handleTapSimulation(block) {
    if (isGameOver) return;
    if (block.state !== "IDLE") return;
    if (isHammerActive) {
      isHammerActive = false;
      grid.hammerDestroyBlock(block);
      return;
    }
    movesRemaining--;
    grid.tryTapBlock(block);
    if (movesRemaining <= 0 && grid.getRemainingCount() > 0) {
      isGameOver = true;
    }
  }
  handleTapSimulation(block1);
  assert.strictEqual(isHammerActive, false, "Hammer booster should deactivate after use");
  assert.strictEqual(movesRemaining, 10, "Moves remaining MUST NOT decrement when hammer is used");
  assert.strictEqual(block1.state, "FLYING", "Block state should transition to FLYING");
  assert.strictEqual(blockClearedEventPayload, block1, "EventBus should emit block_cleared with targeted block");
  const block0 = new ArrowBlock(-1, 0, 0, "+X");
  grid.addBlock(block0);
  assert.strictEqual(grid.isPathClear(block0), false, "block0 blocked by block2 at x=1");
  isHammerActive = true;
  handleTapSimulation(block2);
  assert.strictEqual(block2.state, "FLYING");
  assert.strictEqual(movesRemaining, 10, "Moves still 10, no decrement");
  assert.strictEqual(blockClearedEventPayload, block2);
  assert.strictEqual(grid.isPathClear(block0), true, "block0 should now have clear path because block1 and block2 were removed from blocksMap");
  unsubscribe();
  grid.dispose();
});
test("Palette: DIRECTION_COLORS has all 6 soft matte toy cardinal colors", () => {
  const expectedColors = {
    "+Y": 16347926,
    // Up: Coral Orange
    "-Y": 1357990,
    // Down: Teal
    "-X": 3718648,
    // Left: Sky Blue
    "+X": 16498468,
    // Right: Sunny Gold
    "-Z": 1096065,
    // In: Mint
    "+Z": 11032055
    // Out: Lavender
  };
  for (const [dir, col] of Object.entries(expectedColors)) {
    assert.strictEqual(
      DIRECTION_COLORS[dir],
      col,
      `Direction color for ${dir} should be 0x${col.toString(16)}`
    );
  }
});
test("Dead Code: src/platform/lifecycle.ts and storage.ts are deleted", () => {
  const lifecyclePath = path.resolve("src/platform/lifecycle.ts");
  const storagePath = path.resolve("src/platform/storage.ts");
  assert.strictEqual(fs.existsSync(lifecyclePath), false, "src/platform/lifecycle.ts should not exist");
  assert.strictEqual(fs.existsSync(storagePath), false, "src/platform/storage.ts should not exist");
});
test("Edge Case: Last move clears final block -> player WINS, does NOT trigger game over", () => {
  const grid = new PuzzleGrid();
  const bus = EventBus.get();
  const block = new ArrowBlock(0, 0, 0, "+X");
  grid.addBlock(block);
  let movesRemaining = 1;
  let isGameOver = false;
  movesRemaining--;
  grid.tryTapBlock(block);
  if (movesRemaining <= 0 && grid.getRemainingCount() > 0) {
    isGameOver = true;
  }
  assert.strictEqual(movesRemaining, 0);
  assert.strictEqual(isGameOver, false, "Winning move must NOT trigger game over");
  assert.strictEqual(block.state, "FLYING");
  assert.strictEqual(grid.getRemainingCount(), 0);
  grid.dispose();
});
test("Edge Case: Last move bonks on blocked block -> triggers Near-Miss game over", () => {
  const grid = new PuzzleGrid();
  const block1 = new ArrowBlock(0, 0, 0, "+X");
  const block2 = new ArrowBlock(1, 0, 0, "+Y");
  grid.addBlock(block1);
  grid.addBlock(block2);
  let movesRemaining = 1;
  let isGameOver = false;
  movesRemaining--;
  grid.tryTapBlock(block1);
  if (movesRemaining <= 0 && grid.getRemainingCount() > 0) {
    isGameOver = true;
  }
  assert.strictEqual(movesRemaining, 0);
  assert.strictEqual(isGameOver, true, "Bonk on final move MUST trigger game over");
  assert.strictEqual(block1.state, "BONK");
  assert.strictEqual(grid.getRemainingCount(), 2);
  grid.dispose();
});
test("Edge Case: Hammer destroying the final block leads to level completion on animation end", () => {
  const grid = new PuzzleGrid();
  const bus = EventBus.get();
  const finalBlock = new ArrowBlock(0, 0, 0, "+X");
  grid.addBlock(finalBlock);
  let levelCompletedEmitted = false;
  const unsub = bus.on("level_completed", () => {
    levelCompletedEmitted = true;
  });
  grid.hammerDestroyBlock(finalBlock);
  assert.strictEqual(finalBlock.state, "FLYING");
  assert.strictEqual(grid.getRemainingCount(), 0);
  for (let i = 0; i < 30; i++) {
    grid.update(0.1);
  }
  assert.strictEqual(levelCompletedEmitted, true, "level_completed must be emitted when hammer-destroyed final block completes flight");
  unsub();
  grid.dispose();
});
console.log(`
====================================================`);
console.log(`ALL EMPIRICAL TESTS PASSED: ${passedTests}/${totalTests}`);
console.log(`====================================================`);
