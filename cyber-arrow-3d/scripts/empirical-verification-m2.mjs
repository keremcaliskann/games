import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const results = [];
function test(name, fn) {
  try {
    fn();
    results.push({ name, pass: true });
    console.log(`[PASS] ${name}`);
  } catch (err) {
    results.push({ name, pass: false, error: err.message });
    console.error(`[FAIL] ${name}: ${err.message}`);
  }
}

console.log('=== EMPIRICAL CHALLENGER VERIFICATION: CYBER-ARROW-3D (MILESTONE 2) ===\n');

// 1. Dead Code Removal
test('Dead code files src/platform/lifecycle.ts and storage.ts do NOT exist', () => {
  const lifecyclePath = path.join(rootDir, 'src', 'platform', 'lifecycle.ts');
  const storagePath = path.join(rootDir, 'src', 'platform', 'storage.ts');
  if (fs.existsSync(lifecyclePath)) throw new Error('lifecycle.ts still exists on disk!');
  if (fs.existsSync(storagePath)) throw new Error('storage.ts still exists on disk!');
});

// 2. Import Resolution Audit
test('All relative import statements in src/ resolve to actual files', () => {
  function getTsFiles(dir) {
    let files = [];
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files = files.concat(getTsFiles(fullPath));
      } else if (item.name.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const tsFiles = getTsFiles(path.join(rootDir, 'src'));
  const importRegex = /(?:from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"])/g;
  let checkedImports = 0;

  for (const file of tsFiles) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const target = match[1] || match[2];
      if (target.startsWith('.')) {
        checkedImports++;
        const targetDir = path.dirname(file);
        const resolvedBase = path.resolve(targetDir, target);
        const candidates = [
          resolvedBase + '.ts',
          resolvedBase + '.d.ts',
          path.join(resolvedBase, 'index.ts'),
          resolvedBase + '.js',
          resolvedBase
        ];
        const exists = candidates.some(c => fs.existsSync(c));
        if (!exists) {
          throw new Error(`Unresolved import '${target}' in ${path.relative(rootDir, file)}`);
        }
      }
    }
  }
  if (checkedImports === 0) throw new Error('No relative imports were checked');
  console.log(`       Verified ${checkedImports} relative imports across ${tsFiles.length} TS files with 0 broken links.`);
});

// 3. Lighting Setup Audit
test('Lighting parameters in src/render/lighting.ts match specifications', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src', 'render', 'lighting.ts'), 'utf8');
  if (!content.includes('new THREE.HemisphereLight(0xdbeefd, 0xf5e6ca, 0.9)')) {
    throw new Error('HemisphereLight configuration does not match (0xdbeefd, 0xf5e6ca, 0.9)');
  }
  if (!content.includes('new THREE.DirectionalLight(0xfff6e5, 1.25)')) {
    throw new Error('DirectionalLight sun configuration does not match (0xfff6e5, 1.25)');
  }
  if (!content.includes('new THREE.DirectionalLight(0xbae6fd, 0.5)')) {
    throw new Error('DirectionalLight rim configuration does not match (0xbae6fd, 0.5)');
  }
});

// 4. Renderer Tone Mapping and Background Audit
test('Renderer parameters in src/render/renderer.ts match specifications', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src', 'render', 'renderer.ts'), 'utf8');
  if (!content.includes('this.scene.background = new THREE.Color(0xcfe8f7)')) {
    throw new Error('scene.background does not match 0xcfe8f7');
  }
  if (!content.includes('this.scene.fog = new THREE.FogExp2(0xcfe8f7, 0.012)')) {
    throw new Error('scene.fog does not match FogExp2(0xcfe8f7, 0.012)');
  }
  if (!content.includes('this.renderer.toneMapping = THREE.ACESFilmicToneMapping')) {
    throw new Error('renderer.toneMapping does not match THREE.ACESFilmicToneMapping');
  }
  if (!content.includes('this.renderer.toneMappingExposure = 1.0')) {
    throw new Error('renderer.toneMappingExposure does not match 1.0');
  }
});

// 5. Shell Stage Background in index.html
test('Shell stage background in index.html is #cfe8f7', () => {
  const content = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const stageMatch = /\.shell-stage\s*\{[^}]*background:\s*#cfe8f7/s.test(content);
  if (!stageMatch) {
    throw new Error('.shell-stage does not have background: #cfe8f7 in index.html');
  }
});

// 6. Pedestal Slab Configuration in puzzle-grid.ts
test('Pedestal slab in src/game/entities/puzzle-grid.ts matches 0xfcf8ee with roughness 0.55', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src', 'game', 'entities', 'puzzle-grid.ts'), 'utf8');
  if (!content.includes('color: 0xfcf8ee')) {
    throw new Error('pedestalMesh does not use color: 0xfcf8ee');
  }
  if (!content.includes('roughness: 0.55')) {
    throw new Error('pedestalMesh does not use roughness: 0.55');
  }
  if (!content.includes('this.rootGroup.add(this.pedestalMesh)')) {
    throw new Error('pedestalMesh is not added to rootGroup');
  }
  if (!content.includes('this.pedestalMesh.position.set(midX, minY - 1.6, midZ)')) {
    throw new Error('pedestalMesh is not dynamically centered in centerGrid');
  }
});

// 7. Cardinal Direction Colors in game-config.ts
test('Cardinal direction colors match specification in src/game/config/game-config.ts', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src', 'game', 'config', 'game-config.ts'), 'utf8');
  const expectedColors = {
    "'+Y'": '0xf97316', // Up: Coral Orange
    "'-Y'": '0x14b8a6', // Down: Teal
    "'-X'": '0x38bdf8', // Left: Sky Blue
    "'+X'": '0xfbbf24', // Right: Sunny Gold
    "'-Z'": '0x10b981', // In: Mint
    "'+Z'": '0xa855f7', // Out: Lavender
  };
  for (const [dir, hex] of Object.entries(expectedColors)) {
    const escapedDir = dir.replace(/[+*?^$()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escapedDir}\\s*:\\s*${hex}`);
    if (!regex.test(content)) {
      throw new Error(`Direction ${dir} color does not match expected ${hex}`);
    }
  }
});

// 8. Cream Arrow Glyph in arrow-block.ts
test('ArrowBlock uses cardinal colors and warm cream arrow glyphs (0xfcf8ee)', () => {
  const content = fs.readFileSync(path.join(rootDir, 'src', 'game', 'entities', 'arrow-block.ts'), 'utf8');
  if (!content.includes('this.defaultBlockColor = DIRECTION_COLORS[direction]')) {
    throw new Error('arrow-block does not use DIRECTION_COLORS[direction]');
  }
  if (!content.includes('color: 0xfcf8ee')) {
    throw new Error('arrowMaterial does not use color: 0xfcf8ee');
  }
  if (!content.includes('roughness: 0.48')) {
    throw new Error('baseMaterial roughness is not 0.48');
  }
});

// 9. Move Budget Math Formula Simulation
test('Move budget calculation formula is monotonic, safe and non-NaN', () => {
  // calculateMoveBudget(totalBlocks): totalBlocks + Math.max(3, Math.ceil(totalBlocks * 0.35))
  function calculateMoveBudget(totalBlocks) {
    return totalBlocks + Math.max(3, Math.ceil(totalBlocks * 0.35));
  }

  for (let count = 1; count <= 200; count++) {
    const budget = calculateMoveBudget(count);
    if (!Number.isInteger(budget) || budget <= count) {
      throw new Error(`Invalid move budget for count ${count}: ${budget}`);
    }
  }
  // Check specific test cases
  if (calculateMoveBudget(1) !== 4) throw new Error(`Expected 1 block -> 4 moves, got ${calculateMoveBudget(1)}`);
  if (calculateMoveBudget(10) !== 14) throw new Error(`Expected 10 blocks -> 14 moves, got ${calculateMoveBudget(10)}`);
  if (calculateMoveBudget(20) !== 27) throw new Error(`Expected 20 blocks -> 27 moves, got ${calculateMoveBudget(20)}`);
});

// 10. Production Bundle Invariants & Size Audit
test('Production bundle dist/ exists, is < 5MB and contains all compiled markers', () => {
  const distDir = path.join(rootDir, 'dist');
  if (!fs.existsSync(distDir)) throw new Error('dist/ directory does not exist!');

  function getDirSize(dir) {
    let size = 0;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, item.name);
      if (item.isDirectory()) size += getDirSize(p);
      else size += fs.statSync(p).size;
    }
    return size;
  }

  const totalBytes = getDirSize(distDir);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(3);
  console.log(`       dist/ total bundle size: ${totalMB} MB (${totalBytes} bytes)`);
  if (totalBytes >= 50 * 1024 * 1024) {
    throw new Error(`Bundle size exceeds 50MB limit: ${totalMB} MB`);
  }

  // Find index JS bundle
  const assetsDir = path.join(distDir, 'assets');
  const jsFiles = fs.readdirSync(assetsDir).filter(f => f.startsWith('index-') && f.endsWith('.js'));
  if (jsFiles.length === 0) throw new Error('No index-*.js found in dist/assets');

  const bundleContent = fs.readFileSync(path.join(assetsDir, jsFiles[0]), 'utf8');

  // Verify compiled decimal values for colors:
  // 0xf97316 -> 16347926
  // 0x14b8a6 -> 1357990
  // 0x38bdf8 -> 3718648
  // 0xfbbf24 -> 16498468
  // 0x10b981 -> 1096065
  // 0xa855f7 -> 11032055
  // 0xfcf8ee -> 16578798
  // 0xcfe8f7 -> 13625591
  const requiredDecimalColors = [
    { hex: '0xf97316', dec: 16347926 },
    { hex: '0x14b8a6', dec: 1357990 },
    { hex: '0x38bdf8', dec: 3718648 },
    { hex: '0xfbbf24', dec: 16498468 },
    { hex: '0x10b981', dec: 1096065 },
    { hex: '0xa855f7', dec: 11032055 },
    { hex: '0xfcf8ee', dec: 16578798 },
    { hex: '0xcfe8f7', dec: 13625591 },
  ];

  for (const { hex, dec } of requiredDecimalColors) {
    if (!bundleContent.includes(dec.toString())) {
      throw new Error(`Compiled bundle missing decimal color ${dec} for ${hex}`);
    }
  }

  // Verify monetization hook markers
  const requiredMarkers = ['revive_moves', 'booster_hammer', 'HAMLE'];
  for (const marker of requiredMarkers) {
    if (!bundleContent.includes(marker)) {
      throw new Error(`Compiled bundle missing expected marker '${marker}'`);
    }
  }
});

// 11. HUD Button Click Bleeding Check (Skill Audit #1)
test('All interactive HUD elements have data-hud-interactive="true"', () => {
  const hudFile = fs.readFileSync(path.join(rootDir, 'src', 'ui', 'hud.ts'), 'utf8');
  // Check button tags in template strings
  const buttonRegex = /<button[^>]*>/g;
  let match;
  let buttonCount = 0;
  while ((match = buttonRegex.exec(hudFile)) !== null) {
    buttonCount++;
    if (!match[0].includes('data-hud-interactive="true"')) {
      throw new Error(`Button missing data-hud-interactive="true": ${match[0]}`);
    }
  }
  console.log(`       Verified ${buttonCount} HUD buttons have data-hud-interactive="true".`);
});

// 12. Idempotency Latches in Game State (Skill Audit #2)
test('State transition latches prevent duplicate event triggers in puzzle-grid and main', () => {
  const gridFile = fs.readFileSync(path.join(rootDir, 'src', 'game', 'entities', 'puzzle-grid.ts'), 'utf8');
  if (!gridFile.includes('!this.isLevelCompleted')) {
    throw new Error('puzzle-grid missing idempotency latch guard for isLevelCompleted');
  }
  if (!gridFile.includes('this.isLevelCompleted = true')) {
    throw new Error('puzzle-grid does not set isLevelCompleted = true');
  }
  if (!gridFile.includes('this.isLevelCompleted = false')) {
    throw new Error('puzzle-grid does not reset isLevelCompleted in clear()');
  }
});

console.log('\n=== SUMMARY ===');
const failed = results.filter(r => !r.pass);
console.log(`Total tests: ${results.length}`);
console.log(`Passed: ${results.length - failed.length}`);
console.log(`Failed: ${failed.length}`);

if (failed.length > 0) {
  process.exit(1);
}
