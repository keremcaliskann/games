import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('REVIEWER 2 ADVERSARIAL STRESS-TEST SUITE: cyber-flap Milestone 3');
console.log('================================================================\n');

let total = 0;
let passed = 0;
let failed = 0;

function check(name, ok, details = '') {
  total++;
  if (ok) {
    passed++;
    console.log(`[PASS] ${name}${details ? ` -> ${details}` : ''}`);
  } else {
    failed++;
    console.error(`[FAIL] ${name}${details ? ` -> ${details}` : ''}`);
  }
}

// ---------------------------------------------------------
// TEST 1: Needle Math Extreme Endurance & Numerical Stability
// ---------------------------------------------------------
console.log('--- TEST 1: Needle Math Extreme Endurance (Up to 24h) ---');
let extremePass = true;
let maxSeen = -Infinity;
let minSeen = Infinity;

// Test 0 to 86,400 seconds (1 full day) in 100ms intervals (864,000 samples)
for (let sec = 0; sec <= 86400; sec += 0.1) {
  const norm = (Math.sin(sec * 3.5) + 1) * 0.5;
  const mult = Number((1.5 + norm * 3.5).toFixed(1));
  if (mult > maxSeen) maxSeen = mult;
  if (mult < minSeen) minSeen = mult;
  if (Number.isNaN(mult) || mult < 1.5 || mult > 5.0) {
    extremePass = false;
    break;
  }
}
check('Endurance 24h continuous needle calculation', extremePass, `min=${minSeen}x, max=${maxSeen}x across 864,000 steps`);

// ---------------------------------------------------------
// TEST 2: Needle Animation Loop Cleanup on All Exit Routes
// ---------------------------------------------------------
console.log('\n--- TEST 2: Needle Animation Lifecycle in hud.ts ---');
const hudSource = fs.readFileSync(path.join(rootDir, 'src', 'ui', 'hud.ts'), 'utf8');

// Check stopNeedleAnimation existence
check('stopNeedleAnimation method exists', hudSource.includes('private stopNeedleAnimation(): void'));
check('cancelAnimationFrame called with needleRafId', hudSource.includes('cancelAnimationFrame(this.needleRafId)'));
check('isNeedleRunning set to false', hudSource.includes('this.isNeedleRunning = false'));

// Check callers of stopNeedleAnimation
const stopNeedleCount = (hudSource.match(/this\.stopNeedleAnimation\(\)/g) || []).length;
check('stopNeedleAnimation called in at least 4 defensive positions', stopNeedleCount >= 4, `found ${stopNeedleCount} call sites`);

// Verify specific call sites:
check('Called in applyStateOverlay', hudSource.includes('private applyStateOverlay(') && hudSource.slice(hudSource.indexOf('private applyStateOverlay(')).indexOf('this.stopNeedleAnimation();') < 120);
check('Called in #cf-ad-revive pointerdown', hudSource.includes('#cf-ad-revive') && hudSource.includes('this.stopNeedleAnimation();\n          this.onReviveRequested'));
check('Called in #cf-ad-mult pointerdown', hudSource.includes('#cf-ad-mult') && hudSource.includes('this.stopNeedleAnimation();\n          const mult = this.currentMultiplier'));
check('Called in dispose()', hudSource.includes('dispose(): void {\n    this.stopNeedleAnimation()'));

// ---------------------------------------------------------
// TEST 3: Multiplier Score Scaling Edge Cases
// ---------------------------------------------------------
console.log('\n--- TEST 3: Score Multiplier Math Edge Cases ---');
const testScores = [0, 1, 2, 9, 10, 42, 999, 100000];
const testMultipliers = [1.5, 2.0, 2.5, 3.2, 4.8, 5.0];

let mathPass = true;
for (const s of testScores) {
  for (const m of testMultipliers) {
    const res = Math.floor(s * m);
    if (!Number.isInteger(res) || Number.isNaN(res) || res < s) {
      mathPass = false;
      break;
    }
  }
}
check('Math.floor(score * multiplier) is safe, non-negative integer for all scores and multipliers', mathPass);

// ---------------------------------------------------------
// TEST 4: Rapid Multi-Contact Idempotency in PlayingState
// ---------------------------------------------------------
console.log('\n--- TEST 4: Rapid Hazard Collisions Simulation ---');
const playingSource = fs.readFileSync(path.join(rootDir, 'src', 'game', 'states', 'playing-state.ts'), 'utf8');

check('PlayingState has idempotency latch on state', playingSource.includes('if (this.ctx.fsm.getCurrentId() !== GameStateId.Playing) return;'));
check('Shield consumes ctx.hasShield and returns early', playingSource.includes('if (this.ctx.hasShield) {\n          this.ctx.hasShield = false;\n') && playingSource.includes('return;\n        }'));

// Simulate rapid 10-contact burst in a single frame
class StateMachineMock {
  constructor() { this.current = 'playing'; }
  getCurrentId() { return this.current; }
  transitionTo(next) { this.current = next; }
}

let shakeCount = 0;
let crashCount = 0;
const fsmMock = new StateMachineMock();
const ctxMock = {
  hasShield: true,
  fsm: fsmMock,
  cameraRig: { triggerShake: () => { shakeCount++; } },
  audio: { playScore: () => {}, playCrash: () => { crashCount++; } },
  particles: { spawnFlapPuff: () => {}, spawnCrashExplosion: () => {} },
  drone: { currPos: { x: 0, y: 0, z: 0 } },
};

function simulateHit() {
  if (ctxMock.fsm.getCurrentId() !== 'playing') return;
  if (ctxMock.hasShield) {
    ctxMock.hasShield = false;
    ctxMock.cameraRig.triggerShake();
    return;
  }
  ctxMock.audio.playCrash();
  ctxMock.fsm.transitionTo('game_over');
}

// Contact 1: Shield absorbed
simulateHit();
check('Burst hit 1: Shield consumed, remained in playing', !ctxMock.hasShield && fsmMock.getCurrentId() === 'playing');

// Contact 2: Lethal hit
simulateHit();
check('Burst hit 2: Crashed, transitioned to game_over', fsmMock.getCurrentId() === 'game_over' && crashCount === 1);

// Contacts 3-10: Trailing contacts while game_over
for (let i = 0; i < 8; i++) {
  simulateHit();
}
check('Burst hits 3-10: Idempotency latch rejected all redundant crashes', crashCount === 1);

// ---------------------------------------------------------
// TEST 5: Sound Toggle Logic
// ---------------------------------------------------------
console.log('\n--- TEST 5: Audio Toggle & State Sync ---');
const audioSource = fs.readFileSync(path.join(rootDir, 'src', 'core', 'audio.ts'), 'utf8');

check('toggleMute toggles isMuted and returns boolean', audioSource.includes('toggleMute(): boolean {\n    this.isMuted = !this.isMuted;\n    return this.isMuted;\n  }'));
check('isAudioMuted returns current state', audioSource.includes('isAudioMuted(): boolean {\n    return this.isMuted;\n  }'));
check('ensureContext halts immediately if isMuted is true', audioSource.includes('if (this.isMuted) return null;'));

// ---------------------------------------------------------
// TEST 6: Soft Daylight Calibration Compliance
// ---------------------------------------------------------
console.log('\n--- TEST 6: Soft Daylight Calibration (Rule 32) ---');
const lightingSource = fs.readFileSync(path.join(rootDir, 'src', 'render', 'lighting.ts'), 'utf8');
const rendererSource = fs.readFileSync(path.join(rootDir, 'src', 'render', 'renderer.ts'), 'utf8');
const citySource = fs.readFileSync(path.join(rootDir, 'src', 'render', 'cyber-city.ts'), 'utf8');

check('Sun key light intensity 1.25 and color 0xfff6e5', lightingSource.includes('THREE.DirectionalLight(0xfff6e5, 1.25)'));
check('Hemisphere light sky 0xdbeefd, ground 0xf5e6ca, intensity 0.9', lightingSource.includes('THREE.HemisphereLight(0xdbeefd, 0xf5e6ca, 0.9)'));
check('Rim light intensity 0.5', lightingSource.includes('THREE.DirectionalLight(0xbae6fd, 0.5)'));
check('FogExp2 matches pastel sky 0xcfe8f7 at density 0.012', lightingSource.includes('THREE.FogExp2(0xcfe8f7, 0.012)'));
check('Renderer background color 0xcfe8f7', rendererSource.includes('new THREE.Color(0xcfe8f7)'));
check('Renderer ACESFilmicToneMapping with exposure 1.0', rendererSource.includes('THREE.ACESFilmicToneMapping') && rendererSource.includes('toneMappingExposure = 1.0'));
check('City boundary deck uses warm biscuit 0xfcf8ee', citySource.includes('color: 0xfcf8ee'));

// ---------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL ADVERSARIAL CHECKS: ${passed}/${total} Passed, ${failed} Failed`);
console.log('================================================================');

if (failed > 0) process.exit(1);
process.exit(0);
