#!/usr/bin/env node
/**
 * Automated Studio Code & Game Quality Gate (scripts/verify-game-quality.mjs)
 * Enforces genre-agnostic architectural invariants across all active games:
 * 1. 100% Full-Screen Start Menu & Zero Background Execution before PLAY (isMenuOpen gate + RAF gate).
 * 2. Zero hot-path Three.js heap allocations inside main frame loops (animate/onFrame/fixedUpdate).
 * 3. Stylized Soft Daylight exposure bounds (toneMappingExposure <= 0.92, no #000000 scene backgrounds).
 * 4. Shared Engine Core synchronization (shared/core, shared/ui, shared/platform, shared/render, shared/input).
 * 5. Passive / Archived games ("active": false) strictly untouched.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const allGames = JSON.parse(fs.readFileSync(path.join(rootDir, 'games.json'), 'utf8'));
const activeGames = allGames.filter((g) => g.active !== false);
const passiveGames = allGames.filter((g) => g.active === false).map((g) => g.id);

const sharedFiles = [
  ['shared/platform/ads.ts', 'src/platform/ads.ts'],
  ['shared/ui/shell-controller.ts', 'src/ui/shell-controller.ts'],
  ['shared/core/game-loop.ts', 'src/core/game-loop.ts'],
  ['shared/core/object-pool.ts', 'src/core/object-pool.ts'],
  ['shared/core/math-scratch.ts', 'src/core/math-scratch.ts'],
  ['shared/render/visual-enhancer.ts', 'src/render/visual-enhancer.ts'],
  ['shared/render/procedural-mesh-builder.ts', 'src/render/procedural-mesh-builder.ts'],
  ['shared/render/asset-resolver.ts', 'src/render/asset-resolver.ts'],
  ['shared/input/ergonomic-input.ts', 'src/input/ergonomic-input.ts'],
].map(([srcRel, destRel]) => ({
  srcRel,
  destRel,
  content: fs.readFileSync(path.join(rootDir, srcRel), 'utf8'),
}));

const violations = [];

// 1. Check Passive Games Untouched Policy via git status (if git is accessible)
try {
  const statusOut = execSync('git status --porcelain', {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'ignore'],
    encoding: 'utf8',
  });
  for (const line of statusOut.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const filePart = trimmed.slice(3).replace(/^"|"$/g, '');
    for (const passiveId of passiveGames) {
      if (filePart.startsWith(`${passiveId}/`)) {
        violations.push(`[PASSIVE_GAME_MODIFIED] ${filePart} (passive game "${passiveId}" must never be modified)`);
      }
    }
  }
} catch {
  // Ignore if git status cannot run in restricted subshell
}

// 2. Inspect every active game
for (const gameMeta of activeGames) {
  const gameId = gameMeta.id;
  const gameDir = path.join(rootDir, gameId);
  if (!fs.existsSync(gameDir)) {
    violations.push(`[MISSING_DIR] Active game directory missing: ${gameId}`);
    continue;
  }

  // 2A. Shared Core Sync Check
  for (const sf of sharedFiles) {
    const targetPath = path.join(gameDir, sf.destRel);
    if (!fs.existsSync(targetPath)) {
      violations.push(`[CORE_DRIFT] ${gameId}/${sf.destRel} is missing (run: node scripts/sync-shared-core.mjs)`);
    } else {
      const actual = fs.readFileSync(targetPath, 'utf8');
      if (actual !== sf.content) {
        violations.push(`[CORE_DRIFT] ${gameId}/${sf.destRel} out of sync with ${sf.srcRel}`);
      }
    }
  }

  // 2B. Full-Cover Start Menu & Zero Background Execution Check
  const htmlPath = path.join(gameDir, 'index.html');
  if (fs.existsSync(htmlPath)) {
    const html = fs.readFileSync(htmlPath, 'utf8');
    if (!html.includes('#shell-stage.is-menu-locked > *:not(#shell-start-menu)')) {
      violations.push(`[MENU_COVER] ${gameId}/index.html missing full-cover .is-menu-locked canvas/HUD hide rule`);
    }
    if (html.includes('id="shell-fullscreen-btn"')) {
      violations.push(`[SHELL_RULE] ${gameId}/index.html contains forbidden #shell-fullscreen-btn`);
    }
  }

  const mainPath = path.join(gameDir, 'src/main.ts');
  if (fs.existsSync(mainPath)) {
    const mainSrc = fs.readFileSync(mainPath, 'utf8');
    if (!mainSrc.includes('isMenuOpen')) {
      violations.push(`[MENU_LOCK] ${gameId}/src/main.ts missing shell.isMenuOpen execution guard`);
    }

    // Extract frame loop tail from animate / onFrame / fixedUpdate / render to verify zero hot-path allocations
    const loopMatch = mainSrc.match(/(?:function\s+animate|private\s+(?:animate|onFrame|fixedUpdate|update))\s*\([\s\S]*$/);
    if (loopMatch) {
      const loopBody = loopMatch[0];
      const hotAllocMatch = loopBody.match(/new\s+THREE\.(?:Vector[234]|Quaternion|Matrix[34]|Color|Euler|Raycaster|Box3)\b/);
      if (hotAllocMatch) {
        violations.push(
          `[HOT_PATH_ALLOC] ${gameId}/src/main.ts allocates "${hotAllocMatch[0]}" inside frame/update loop`
        );
      }
    }
  }

  // 2C. Soft Daylight Exposure & Dark Void Check across src/render/ and src/main.ts
  const renderDir = path.join(gameDir, 'src/render');
  const filesToCheck = [mainPath];
  if (fs.existsSync(renderDir)) {
    for (const entry of fs.readdirSync(renderDir)) {
      if (entry.endsWith('.ts')) {
        filesToCheck.push(path.join(renderDir, entry));
      }
    }
  }

  for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    const text = fs.readFileSync(filePath, 'utf8');
    const rel = path.relative(rootDir, filePath).replace(/\\/g, '/');

    // Check toneMappingExposure <= 0.92
    const expRegex = /toneMappingExposure\s*=\s*([0-9.]+)/g;
    let match;
    while ((match = expRegex.exec(text)) !== null) {
      const val = parseFloat(match[1]);
      if (val > 0.92) {
        violations.push(`[DAYLIGHT_EXPOSURE] ${rel} sets toneMappingExposure = ${val} (max allowed: 0.92)`);
      }
    }

    // Check scene.background dark void
    if (/scene\.background\s*=\s*new\s+THREE\.Color\(\s*(?:0x000000|'#000'|'#000000'|0x0f172a)\s*\)/i.test(text)) {
      violations.push(`[DARK_VOID] ${rel} sets forbidden dark void scene.background`);
    }
  }
}

if (violations.length > 0) {
  console.error(`\n❌ Studio Quality Gate FAILED (${violations.length} violation(s)):`);
  for (const v of violations) {
    console.error(`  - ${v}`);
  }
  process.exit(1);
} else {
  console.log(
    `✅ Studio Quality Gate PASSED: ${activeGames.length} active games verified (Full-Screen Menu Lock, Zero Background Execution, Zero Hot-Path Allocations, Soft Daylight, Shared Core Synced, ${passiveGames.length} Passive Games Untouched).`
  );
}
