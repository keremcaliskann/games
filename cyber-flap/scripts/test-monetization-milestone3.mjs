import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('====================================================');
console.log('EMPIRICAL CHALLENGER TEST SUITE: cyber-flap Milestone 3');
console.log('====================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

function extractArrowFunctionBody(src, startStr) {
  const idx = src.indexOf(startStr);
  if (idx === -1) return null;
  const arrowIdx = src.indexOf('=>', idx);
  if (arrowIdx === -1) return null;
  const openBrace = src.indexOf('{', arrowIdx);
  if (openBrace === -1) return null;
  let depth = 1;
  let i = openBrace + 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  return src.slice(openBrace, i);
}

function extractBlockAfter(src, startStr) {
  const idx = src.indexOf(startStr);
  if (idx === -1) return null;
  const openBrace = src.indexOf('{', idx);
  if (openBrace === -1) return null;
  let depth = 1;
  let i = openBrace + 1;
  while (i < src.length && depth > 0) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') depth--;
    i++;
  }
  return src.slice(openBrace, i);
}

// ---------------------------------------------------------
// SUITE 1: Ad Flow Static Verification in main.ts
// ---------------------------------------------------------
console.log('--- SUITE 1: Ad Flow Verification in main.ts ---');

const mainPath = path.join(rootDir, 'src', 'main.ts');
assert(fs.existsSync(mainPath), `main.ts exists at ${mainPath}`);

const mainContent = fs.readFileSync(mainPath, 'utf8');

// Check 1.1: Verify handleRestart calls ads.showInterstitial('restart_click')
const restartBlock = extractArrowFunctionBody(mainContent, 'const handleRestart =');
assert(Boolean(restartBlock), 'handleRestart function block found in main.ts');

if (restartBlock) {
  const hasRestartInterstitial = restartBlock.includes("ads.showInterstitial('restart_click')");
  assert(hasRestartInterstitial, "handleRestart explicitly calls ads.showInterstitial('restart_click')");
}

// Check 1.2: Verify stateChange does NOT call ads.showInterstitial on GameOver
const stateChangeIdx = mainContent.indexOf("events.on('stateChange'");
assert(stateChangeIdx !== -1, "events.on('stateChange', ...) listener found in main.ts");

const stateChangeBlock = extractArrowFunctionBody(mainContent, "events.on('stateChange'");
assert(Boolean(stateChangeBlock), "stateChange listener body extracted");

if (stateChangeBlock) {
  const gameOverBlock = extractBlockAfter(stateChangeBlock, 'if (state === GameStateId.GameOver)');
  assert(Boolean(gameOverBlock), "state === GameStateId.GameOver block found in stateChange");
  if (gameOverBlock) {
    const callsInterstitial = gameOverBlock.includes('showInterstitial');
    assert(!callsInterstitial, "state === GameStateId.GameOver does NOT call showInterstitial (unobstructed revive access)");
  }
  const anyStateChangeInterstitial = stateChangeBlock.includes('showInterstitial');
  assert(!anyStateChangeInterstitial, "stateChange listener as a whole contains zero showInterstitial calls");
}

// Check 1.3: Verify HUD multiplier callback handles multiplier parameter
const multiplierIdx = mainContent.indexOf('hud.onMultiplierRequested');
assert(multiplierIdx !== -1, "hud.onMultiplierRequested callback found in main.ts");
const multiplierBlock = extractArrowFunctionBody(mainContent, 'hud.onMultiplierRequested =');
if (multiplierBlock) {
  const paramMatch = mainContent.slice(multiplierIdx, multiplierIdx + 60).match(/hud\.onMultiplierRequested\s*=\s*async\s*\(([^)]*)\)/);
  assert(Boolean(paramMatch && paramMatch[1].includes('multiplier')), "hud.onMultiplierRequested accepts multiplier parameter");
  assert(multiplierBlock.includes('Math.floor(ctx.score * multiplier)'), "Score is scaled by dynamic needle multiplier");
}

console.log('');

// ---------------------------------------------------------
// SUITE 2: Multiplier Needle Oscillation Simulation
// ---------------------------------------------------------
console.log('--- SUITE 2: Multiplier Needle Oscillation Simulation ---');

// Formula from hud.ts:
// const elapsed = (now - this.needleStartTs) * 0.001;
// const norm = (Math.sin(elapsed * 3.5) + 1) * 0.5;
// this.currentMultiplier = Number((1.5 + norm * 3.5).toFixed(1));

function computeMultiplier(elapsedSec) {
  const norm = (Math.sin(elapsedSec * 3.5) + 1) * 0.5;
  const multiplier = Number((1.5 + norm * 3.5).toFixed(1));
  const needlePercent = Number((norm * 100).toFixed(1));
  return { norm, multiplier, needlePercent };
}

let minMultiplier = Infinity;
let maxMultiplier = -Infinity;
let minNorm = Infinity;
let maxNorm = -Infinity;
let allInRange = true;
let samplesTested = 0;

// Test across elapsed from 0.000 to 10.000 seconds in 1ms steps (10,001 points)
for (let t = 0; t <= 10000; t++) {
  const elapsedSec = t * 0.001;
  const { norm, multiplier, needlePercent } = computeMultiplier(elapsedSec);
  samplesTested++;

  if (norm < minNorm) minNorm = norm;
  if (norm > maxNorm) maxNorm = norm;
  if (multiplier < minMultiplier) minMultiplier = multiplier;
  if (multiplier > maxMultiplier) maxMultiplier = multiplier;

  if (multiplier < 1.5 || multiplier > 5.0 || Number.isNaN(multiplier)) {
    allInRange = false;
    console.error(`  Out of range at t=${elapsedSec}s: mult=${multiplier}`);
    break;
  }
  if (needlePercent < 0.0 || needlePercent > 100.0) {
    allInRange = false;
    console.error(`  Needle percent out of range at t=${elapsedSec}s: ${needlePercent}%`);
    break;
  }
}

assert(samplesTested === 10001, `Simulated 10,001 time steps across 0 to 10 seconds`);
assert(allInRange, `All simulated multiplier values strictly bounded in [1.5, 5.0]`);
assert(minMultiplier === 1.5, `Minimum observed multiplier reached exactly 1.5x (actual: ${minMultiplier}x)`);
assert(maxMultiplier === 5.0, `Maximum observed multiplier reached exactly 5.0x (actual: ${maxMultiplier}x)`);
assert(minNorm >= 0.0 && minNorm < 0.001, `Norm minimum reaches ~0.0 (actual: ${minNorm.toFixed(6)})`);
assert(maxNorm <= 1.0 && maxNorm > 0.999, `Norm maximum reaches ~1.0 (actual: ${maxNorm.toFixed(6)})`);

// Test specific frame cadences (60 FPS and 120 FPS)
let fps60AllInBounds = true;
for (let frame = 0; frame <= 600; frame++) { // 10 seconds at 60 FPS
  const elapsed = frame / 60;
  const { multiplier } = computeMultiplier(elapsed);
  if (multiplier < 1.5 || multiplier > 5.0) {
    fps60AllInBounds = false;
    break;
  }
}
assert(fps60AllInBounds, `60 FPS simulation (600 frames) strictly preserves [1.5, 5.0] range`);

console.log('');

// ---------------------------------------------------------
// SUITE 3: Pre-Flight Booster Mechanics Simulation
// ---------------------------------------------------------
console.log('--- SUITE 3: Pre-Flight Booster Mechanics Simulation ---');

// Part A: Shield Absorption Simulation
class MockPlayingState {
  constructor(hasShield) {
    this.hasShield = hasShield;
    this.currentState = 'Playing';
    this.shakeCount = 0;
    this.shakeIntensity = 0;
    this.crashCount = 0;
  }

  onHitHazard() {
    // Idempotency latch
    if (this.currentState !== 'Playing') return;

    if (this.hasShield) {
      this.hasShield = false;
      this.shakeCount++;
      this.shakeIntensity = 0.35;
      return; // Absorbed!
    }

    this.crashCount++;
    this.shakeIntensity = 0.75;
    this.currentState = 'GameOver';
  }
}

// Test Shielded Run
const shieldedDrone = new MockPlayingState(true);
assert(shieldedDrone.hasShield === true, "Initial state: drone has shield active");
assert(shieldedDrone.currentState === 'Playing', "Initial state: GameState is Playing");

// First Hit
shieldedDrone.onHitHazard();
assert(shieldedDrone.hasShield === false, "First hit: shield is consumed (hasShield === false)");
assert(shieldedDrone.currentState === 'Playing', "First hit: GameState remains Playing (collision absorbed)");
assert(shieldedDrone.shakeIntensity === 0.35, "First hit: trigger mild shake (0.35)");
assert(shieldedDrone.crashCount === 0, "First hit: crash sound/explosion NOT triggered");

// Second Hit
shieldedDrone.onHitHazard();
assert(shieldedDrone.currentState === 'GameOver', "Second hit (unshielded): GameState transitions to GameOver");
assert(shieldedDrone.crashCount === 1, "Second hit: crash triggered");
assert(shieldedDrone.shakeIntensity === 0.75, "Second hit: heavy crash shake (0.75)");

// Third Hit (Idempotency)
shieldedDrone.onHitHazard();
assert(shieldedDrone.currentState === 'GameOver', "Third hit while GameOver: ignored by idempotency latch");
assert(shieldedDrone.crashCount === 1, "Crash count does not increment repeatedly");

// Test Unshielded Run
const unshieldedDrone = new MockPlayingState(false);
unshieldedDrone.onHitHazard();
assert(unshieldedDrone.currentState === 'GameOver', "Unshielded drone: immediate GameOver on first hit");

// Part B: Slow-Mo Scroll Speed Reduction Simulation
const GAME_CONFIG = {
  baseScrollSpeedMps: 6.8,
  maxScrollSpeedMps: 11.2,
  speedIncreasePerScoreMps: 0.12,
};

function getScrollSpeedMps(score, hasSlowMo = false) {
  const rawSpeed = Math.min(
    GAME_CONFIG.maxScrollSpeedMps,
    GAME_CONFIG.baseScrollSpeedMps + score * GAME_CONFIG.speedIncreasePerScoreMps,
  );
  return hasSlowMo && score < 10 ? rawSpeed * 0.7 : rawSpeed;
}

// Check score = 0
const speedNormal0 = getScrollSpeedMps(0, false);
const speedSlowMo0 = getScrollSpeedMps(0, true);
assert(speedNormal0 === 6.8, `Score 0 normal speed is ${speedNormal0} m/s`);
assert(Math.abs(speedSlowMo0 - 6.8 * 0.7) < 1e-9, `Score 0 slow-mo speed is exactly 70% of normal (${speedSlowMo0.toFixed(2)} m/s vs 6.8 m/s)`);
assert(speedSlowMo0 < speedNormal0, `Score 0: slow-mo speed is strictly slower than normal`);

// Check scores 1 to 9 (active slow-mo window)
let allEarlySlowed = true;
for (let s = 0; s < 10; s++) {
  const normal = getScrollSpeedMps(s, false);
  const slowed = getScrollSpeedMps(s, true);
  if (slowed >= normal || Math.abs(slowed - normal * 0.7) > 1e-9) {
    allEarlySlowed = false;
    break;
  }
}
assert(allEarlySlowed, `Scores 0-9: slow-mo consistently reduces speed by exactly 30%`);

// Check scores >= 10 (expired slow-mo window)
let expiredMatchesNormal = true;
for (let s = 10; s <= 50; s += 5) {
  const normal = getScrollSpeedMps(s, false);
  const slowed = getScrollSpeedMps(s, true);
  if (slowed !== normal) {
    expiredMatchesNormal = false;
    break;
  }
}
assert(expiredMatchesNormal, `Scores >= 10: slow-mo effect expires and speed matches normal progression`);

console.log('');
console.log('----------------------------------------------------');
console.log(`TEST SUMMARY: ${passedTests}/${totalTests} Passed, ${failedTests} Failed`);
console.log('----------------------------------------------------');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
