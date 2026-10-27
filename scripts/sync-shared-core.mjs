#!/usr/bin/env node
/**
 * Workspace Shared UI (3-Column Arcade Shell) & Monetization (UniversalAdProvider) Synchronizer.
 * Guarantees 100% identical 3-Column Arcade Shell DOM/CSS (Left Navigation + Center Stage + Right Ad Rail,
 * zero fullscreen toggle/collapse), ShellController, and UniversalAdProvider across every game in games.json.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const checkOnly = process.argv.includes('--check');

const catalog = JSON.parse(fs.readFileSync(path.join(rootDir, 'games.json'), 'utf8'));
const sharedAdsContent = fs.readFileSync(path.join(rootDir, 'shared/platform/ads.ts'), 'utf8');
const sharedShellContent = fs.readFileSync(path.join(rootDir, 'shared/ui/shell-controller.ts'), 'utf8');
const sharedCssContent = fs.readFileSync(path.join(rootDir, 'shared/ui/arcade-shell.css'), 'utf8');
const sharedVisualContent = fs.readFileSync(path.join(rootDir, 'shared/render/visual-enhancer.ts'), 'utf8');

function buildLeftSidebarHtml() {
  return `      <!-- Left Navigation Rail -->
      <aside class="shell-sidebar shell-sidebar-left">
        <div class="shell-brand">
          <a href="../" class="shell-brand-link">
            <span class="shell-brand-badge">ARCADE</span>
            <span class="shell-brand-title">3D GAMES</span>
          </a>
        </div>

        <nav class="shell-nav">
          <a href="../" class="shell-btn shell-btn-portal" title="Return to Central Arcade Portal">
            <span class="btn-icon">←</span> Portala Dön
          </a>
          <button id="shell-restart-btn" class="shell-btn shell-btn-restart" type="button">
            <span class="btn-icon">🔄</span> Yeniden Başlat
          </button>
        </nav>

        <section class="shell-other-games">
          <h3 class="shell-section-title">Diğer Oyunlar</h3>
          <div id="shell-other-games-list" class="other-games-list">
            <!-- Hydrated dynamically from ../games.json -->
          </div>
        </section>
      </aside>`;
}

function buildRightRailHtml(gameTitle, gameSubtitle) {
  const shortBrand = gameTitle.split('//')[0].trim();
  return `      <!-- Right Advertising Rail -->
      <aside class="shell-sidebar shell-sidebar-right">
        <div class="ad-rail-wrapper">
          <span class="ad-header-tag">SPONSOR // REKLAM</span>
          <div id="ad-banner-desktop" class="ad-banner-slot banner-300x600">
            <div class="ad-mock-creative">
              <div class="ad-mock-glow"></div>
              <p class="ad-mock-brand">${shortBrand}</p>
              <p class="ad-mock-desc">${gameSubtitle || 'Zero-install 60 FPS WebGL 3D Arcade'}</p>
              <div class="ad-mock-cta">ŞİMDİ OYNA</div>
            </div>
          </div>
        </div>
      </aside>`;
}

function syncGameHtml(gameMeta, html) {
  let updated = html;

  // 1. Ensure #arcade-shell also has class="arcade-shell"
  updated = updated.replace(/<div id="arcade-shell">/g, '<div id="arcade-shell" class="arcade-shell">');

  // 2. Replace Left Sidebar with canonical Left Navigation Rail (no fullscreen button)
  updated = updated.replace(
    /<!-- Left Navigation Rail -->\s*<aside class="shell-sidebar shell-sidebar-left">[\s\S]*?<\/aside>/,
    buildLeftSidebarHtml()
  );

  // 3. Remove any #shell-fullscreen-btn button or #fullscreen-ad-banner div
  updated = updated.replace(
    /\s*<button id="shell-fullscreen-btn"[\s\S]*?<\/button>/g,
    ''
  );
  updated = updated.replace(
    /\s*(?:<!--[^>]*-->\s*)?<div id="fullscreen-ad-banner"[\s\S]*?<\/div>\s*<\/div>/g,
    ''
  );

  // 4. Replace Right Sidebar with canonical Right Advertising Rail
  updated = updated.replace(
    /<!-- Right (?:Advertising|Ad) Rail -->\s*<aside class="shell-sidebar shell-sidebar-right">[\s\S]*?<\/aside>/,
    buildRightRailHtml(gameMeta.title, gameMeta.subtitle)
  );

  // 5. Remove any inline embed-fullscreen-mode / yt-embed-mode CSS rules outside #shared-arcade-shell-css
  updated = updated.replace(
    /body\.embed-fullscreen-mode\s+\.shell-sidebar-left[\s\S]*?height:\s*100dvh\s*!important;\s*\}/g,
    ''
  );

  // 6. Ensure .shell-stage never flashes pitch-black #000 before first frame
  updated = updated.replace(
    /(\.shell-stage\s*\{[^}]*?)background:\s*#000(?:000)?;/g,
    '$1background: #cfe8f7;'
  );

  // 7. Standardize booster ad badge label to "🎬 FREE"
  updated = updated.replace(
    /<span class="booster-ad-badge">AD<\/span>/g,
    '<span class="booster-ad-badge">🎬 FREE</span>'
  );

  // 8. Inject or update <style id="shared-arcade-shell-css"> block in <head>
  const styleBlock = `    <style id="shared-arcade-shell-css">\n${sharedCssContent}\n    </style>`;
  if (updated.includes('id="shared-arcade-shell-css"')) {
    updated = updated.replace(
      /<style id="shared-arcade-shell-css">[\s\S]*?<\/style>/,
      styleBlock
    );
  } else {
    updated = updated.replace('</head>', `${styleBlock}\n  </head>`);
  }

  return updated;
}

function syncGameSdk(sdkText) {
  // Neutralize applyDualModeShell() in src/platform/sdk.ts so it never hides sidebars
  return sdkText.replace(
    /public static applyDualModeShell\(\):\s*void\s*\{[\s\S]*?\n  \}/,
    `public static applyDualModeShell(): void {\n    document.documentElement.classList.remove('yt-embed-mode');\n    document.body?.classList.remove('embed-fullscreen-mode');\n  }`
  );
}

function syncGameLighting(lightingText) {
  let updated = lightingText;
  if (!updated.includes("from './visual-enhancer'")) {
    updated = updated.replace(
      /import \* as THREE from 'three';/,
      `import * as THREE from 'three';\nimport { VisualEnhancer } from './visual-enhancer';`
    );
  }
  if (!updated.includes('VisualEnhancer.enhanceScene(scene)')) {
    updated = updated.replace(
      /(constructor\(scene:\s*THREE\.Scene\)\s*\{|setup\(scene:\s*THREE\.Scene\):\s*(?:void|\{[\s\S]*?\})\s*\{|setupCyberLighting\(scene:\s*THREE\.Scene\):\s*THREE\.DirectionalLight\s*\{)/,
      `$1\n    VisualEnhancer.enhanceScene(scene);`
    );
  }
  return updated;
}

const report = [];

for (const gameMeta of catalog) {
  const g = gameMeta.id;
  const gameDir = path.join(rootDir, g);
  if (!fs.existsSync(gameDir)) continue;

  const adsPath = path.join(gameDir, 'src/platform/ads.ts');
  const shellPath = path.join(gameDir, 'src/ui/shell-controller.ts');
  const visualPath = path.join(gameDir, 'src/render/visual-enhancer.ts');
  const lightingPath = path.join(gameDir, 'src/render/lighting.ts');
  const sdkPath = path.join(gameDir, 'src/platform/sdk.ts');
  const htmlPath = path.join(gameDir, 'index.html');

  if (!checkOnly) {
    fs.mkdirSync(path.dirname(adsPath), { recursive: true });
    fs.mkdirSync(path.dirname(shellPath), { recursive: true });
    fs.mkdirSync(path.dirname(visualPath), { recursive: true });
    fs.writeFileSync(adsPath, sharedAdsContent, 'utf8');
    fs.writeFileSync(shellPath, sharedShellContent, 'utf8');
    fs.writeFileSync(visualPath, sharedVisualContent, 'utf8');

    if (fs.existsSync(lightingPath)) {
      const currentLighting = fs.readFileSync(lightingPath, 'utf8');
      const nextLighting = syncGameLighting(currentLighting);
      if (nextLighting !== currentLighting) {
        fs.writeFileSync(lightingPath, nextLighting, 'utf8');
      }
    }

    if (fs.existsSync(sdkPath)) {
      const currentSdk = fs.readFileSync(sdkPath, 'utf8');
      const nextSdk = syncGameSdk(currentSdk);
      if (nextSdk !== currentSdk) {
        fs.writeFileSync(sdkPath, nextSdk, 'utf8');
      }
    }

    if (fs.existsSync(htmlPath)) {
      const currentHtml = fs.readFileSync(htmlPath, 'utf8');
      const nextHtml = syncGameHtml(gameMeta, currentHtml);
      if (nextHtml !== currentHtml) {
        fs.writeFileSync(htmlPath, nextHtml, 'utf8');
      }
    }
  }

  // Verify compliance after sync
  const finalAds = fs.existsSync(adsPath) ? fs.readFileSync(adsPath, 'utf8') : '';
  const finalShell = fs.existsSync(shellPath) ? fs.readFileSync(shellPath, 'utf8') : '';
  const finalVisual = fs.existsSync(visualPath) ? fs.readFileSync(visualPath, 'utf8') : '';
  const finalLighting = fs.existsSync(lightingPath) ? fs.readFileSync(lightingPath, 'utf8') : '';
  const finalHtml = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
  const finalSdk = fs.existsSync(sdkPath) ? fs.readFileSync(sdkPath, 'utf8') : '';

  const adsSynced = finalAds === sharedAdsContent;
  const shellSynced = finalShell === sharedShellContent;
  const visualSynced = finalVisual === sharedVisualContent && finalLighting.includes('VisualEnhancer.enhanceScene(scene)');
  const hasShellDom =
    finalHtml.includes('id="arcade-shell"') &&
    finalHtml.includes('class="shell-sidebar shell-sidebar-left"') &&
    finalHtml.includes('id="shell-restart-btn"') &&
    finalHtml.includes('id="shell-other-games-list"') &&
    finalHtml.includes('class="shell-sidebar shell-sidebar-right"') &&
    finalHtml.includes('id="ad-banner-desktop"') &&
    !finalHtml.includes('id="shell-fullscreen-btn"') &&
    !finalHtml.includes('id="fullscreen-ad-banner"') &&
    !finalSdk.includes("classList.add('embed-fullscreen-mode')");
  const hasYtSdk = finalHtml.includes('https://www.youtube.com/game_api/v1');
  const hasIcon = fs.existsSync(path.join(gameDir, 'public/icon.svg'));

  report.push({
    game: g,
    ads: adsSynced ? 'SYNCED' : 'DRIFT',
    shellCtrl: shellSynced ? 'SYNCED' : 'DRIFT',
    visualIBL: visualSynced ? 'SYNCED' : 'DRIFT',
    shellDom: hasShellDom ? 'OK' : 'MISSING',
    ytSdk: hasYtSdk ? 'OK' : 'MISSING',
    icon: hasIcon ? 'OK' : 'MISSING',
  });
}

console.table(report);

const failed = report.filter(
  (r) => r.ads !== 'SYNCED' || r.shellCtrl !== 'SYNCED' || r.visualIBL !== 'SYNCED' || r.shellDom !== 'OK' || r.ytSdk !== 'OK' || r.icon !== 'OK'
);

if (failed.length > 0) {
  console.error(`❌ ${failed.length} game(s) out of sync or missing mandatory 3-column shell/ad elements.`);
  process.exit(1);
} else {
  console.log(`✅ All ${report.length} games 100% synchronized with 3-Column Arcade Shell & Ad Core (No Fullscreen).`);
}
