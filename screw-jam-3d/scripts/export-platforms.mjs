#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const releaseDir = path.join(projectRoot, 'release');

const targetArg = process.argv[2]?.toLowerCase() || 'all';

// Read package.json
const pkgPath = path.join(projectRoot, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const gameName = pkg.name || 'screw-jam-3d';

console.log(`\n📦 Multi-Platform Exporter for: \x1b[36m${gameName}\x1b[0m`);

// 1. Ensure build exists
if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.log('⚙️  No existing dist found. Running production build...');
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
}

// 2. Ensure clean release dir
if (!fs.existsSync(releaseDir)) {
  fs.mkdirSync(releaseDir, { recursive: true });
}

const originalHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

const PLATFORMS = {
  youtube: {
    name: 'YouTube Playables',
    suffix: 'youtube',
    adaptHtml: (html) => {
      let res = html;
      if (!res.includes('https://www.youtube.com/game_api/v1')) {
        res = res.replace('<head>', '<head>\n    <script src="https://www.youtube.com/game_api/v1"></script>');
      }
      return res;
    },
  },
  yandex: {
    name: 'Yandex Games',
    suffix: 'yandex',
    adaptHtml: (html) => {
      let res = html.replace(/<script\s+src="https:\/\/www\.youtube\.com\/game_api\/v1"><\/script>\s*/i, '');
      res = res.replace('<head>', '<head>\n    <!-- Yandex Games SDK v2 -->\n    <script src="https://yandex.ru/games/sdk/v2"></script>');
      return res;
    },
  },
  crazygames: {
    name: 'CrazyGames',
    suffix: 'crazygames',
    adaptHtml: (html) => {
      let res = html.replace(/<script\s+src="https:\/\/www\.youtube\.com\/game_api\/v1"><\/script>\s*/i, '');
      res = res.replace('<head>', '<head>\n    <!-- CrazyGames SDK v3 -->\n    <script src="https://sdk.crazygames.com/crazygames-sdk-v3.js"></script>');
      return res;
    },
  },
  poki: {
    name: 'Poki',
    suffix: 'poki',
    adaptHtml: (html) => {
      let res = html.replace(/<script\s+src="https:\/\/www\.youtube\.com\/game_api\/v1"><\/script>\s*/i, '');
      res = res.replace('<head>', '<head>\n    <!-- Poki SDK v2 -->\n    <script src="https://game-cdn.poki.com/scripts/v2/poki-sdk.js"></script>');
      return res;
    },
  },
};

const platformsToBuild = targetArg === 'all'
  ? Object.keys(PLATFORMS)
  : Object.keys(PLATFORMS).filter((p) => p === targetArg);

if (platformsToBuild.length === 0) {
  console.error(`❌ Unknown target platform: "${targetArg}". Choose from: all, youtube, yandex, crazygames, poki.`);
  process.exit(1);
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const results = [];

for (const pKey of platformsToBuild) {
  const plat = PLATFORMS[pKey];
  const zipName = `${gameName}-${plat.suffix}.zip`;
  const zipPath = path.join(releaseDir, zipName);
  const stagingDir = path.join(releaseDir, `.tmp_${plat.suffix}`);

  if (fs.existsSync(stagingDir)) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }
  if (fs.existsSync(zipPath)) {
    fs.rmSync(zipPath, { force: true });
  }

  // 1. Copy dist into staging
  copyDirRecursive(distDir, stagingDir);

  // 2. Adapt index.html
  const adaptedHtml = plat.adaptHtml(originalHtml);
  fs.writeFileSync(path.join(stagingDir, 'index.html'), adaptedHtml, 'utf-8');

  // 3. Create zip with index.html directly at root
  try {
    execSync(`tar -a -c -f "${zipPath}" -C "${stagingDir}" .`, { stdio: 'pipe' });
  } catch {
    execSync(`powershell -Command "Compress-Archive -Path '${stagingDir}\\*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'pipe' });
  }

  // 4. Cleanup staging
  fs.rmSync(stagingDir, { recursive: true, force: true });

  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const sizeKB = (stats.size / 1024).toFixed(1);

  results.push({
    Platform: plat.name,
    File: zipName,
    Size: stats.size < 1024 * 1024 ? `${sizeKB} KB` : `${sizeMB} MB`,
    Status: stats.size < 5 * 1024 * 1024 ? '✅ < 5MB OK' : '⚠️ > 5MB',
  });
}

console.log('\n📊 Export Summary:');
console.table(results);
console.log(`✨ Packages saved to: \x1b[32m${releaseDir}\x1b[0m\n`);
