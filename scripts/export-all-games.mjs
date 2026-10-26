#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..');

const platformArg = process.argv[2] || 'all'; // all | yandex | crazygames | youtube | poki
const gameArg = process.argv[3] || 'all'; // all | color-block-jam-3d | cyber-arrow-3d | cyber-flap

const games = ['physics-drop-merge-3d', 'goods-sort-3d', 'ragdoll-cannon-blitz-3d', 'voxel-craft-smash-3d', 'hole-city-io-3d', 'hexa-sort-3d', 'screw-jam-3d', 'color-block-jam-3d', 'cyber-arrow-3d', 'cyber-flap'].filter((g) => {
  if (gameArg !== 'all' && g !== gameArg) return false;
  return fs.existsSync(path.join(workspaceRoot, g, 'scripts', 'export-platforms.mjs'));
});

console.log(`\n======================================================`);
console.log(`🎮 Workspace Multi-Game ZIP Exporter`);
console.log(`🎯 Platform: \x1b[33m${platformArg}\x1b[0m | Target: \x1b[36m${gameArg}\x1b[0m`);
console.log(`======================================================\n`);

const results = [];

for (const game of games) {
  const gameDir = path.join(workspaceRoot, game);
  console.log(`\n▶ Processing: \x1b[32m${game}\x1b[0m`);
  try {
    execSync(`node scripts/export-platforms.mjs ${platformArg}`, {
      cwd: gameDir,
      stdio: 'inherit',
    });
    const releaseDir = path.join(gameDir, 'release');
    if (fs.existsSync(releaseDir)) {
      const zips = fs.readdirSync(releaseDir).filter((f) => f.endsWith('.zip'));
      for (const z of zips) {
        const fullPath = path.join(releaseDir, z);
        const stats = fs.statSync(fullPath);
        const sizeMb = (stats.size / 1024 / 1024).toFixed(2);
        results.push({ game, file: z, size: `${sizeMb} MB`, path: fullPath });
      }
    }
  } catch (err) {
    console.error(`❌ Export failed for ${game}:`, err.message);
  }
}

console.log(`\n======================================================`);
console.log(`✅ All Export Packages Ready!`);
console.log(`======================================================`);
for (const r of results) {
  console.log(`📦 [${r.game}] ${r.file} (${r.size})`);
}
console.log(`\n`);
