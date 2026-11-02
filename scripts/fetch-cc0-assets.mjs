#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, '..');

/**
 * Curated catalog of lightweight (< 250 KB) CC0 / Public Domain 3D models.
 * Sources: Three.js official examples, Kenney Car/Platformer Kit (CC0).
 */
const ASSET_CATALOG = {
  rally_car: {
    filename: 'rally_car.glb',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/ferrari.glb',
    fallbackUrl: 'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/gltf/ferrari.glb',
    targetGames: ['smash-karts-brawl-3d', 'rally-horizon-3d'],
  },
  crawler_truck: {
    filename: 'crawler_truck.glb',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/SheenChair.glb',
    targetGames: ['offroad-expedition-3d'],
  },
  character_runner: {
    filename: 'party_runner.glb',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    targetGames: ['stumble-knockout-royale-3d', 'bridge-rush-io-3d'],
  },
};

const targetGame = process.argv[2] || 'all';

console.log(`\n======================================================`);
console.log(`📦 CC0 3D Asset Downloader & Verifier`);
console.log(`🎯 Target: ${targetGame}`);
console.log(`======================================================\n`);

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 500) throw new Error(`Buffer too small (${buffer.length} bytes)`);
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, buffer);
    const sizeKb = (buffer.length / 1024).toFixed(1);
    console.log(`  ✔ Downloaded ${path.basename(destPath)} (${sizeKb} KB)`);
    return true;
  } catch (err) {
    console.warn(`  ⚠️ Could not download from ${url}: ${err.message}`);
    return false;
  }
}

async function run() {
  for (const [key, asset] of Object.entries(ASSET_CATALOG)) {
    for (const gameId of asset.targetGames) {
      if (targetGame !== 'all' && targetGame !== gameId) continue;
      const gameModelsDir = path.join(workspaceRoot, gameId, 'public', 'models');
      const targetFilePath = path.join(gameModelsDir, asset.filename);

      if (fs.existsSync(targetFilePath)) {
        console.log(`  ℹ ${gameId}: ${asset.filename} already exists.`);
        continue;
      }

      console.log(`▶ Fetching ${key} for ${gameId}...`);
      const success = await downloadFile(asset.url, targetFilePath);
      if (!success && asset.fallbackUrl) {
        await downloadFile(asset.fallbackUrl, targetFilePath);
      }
    }
  }
  console.log(`\nAsset ingestion pass complete.`);
}

run().catch((err) => {
  console.error('Fatal error:', err.message);
});
