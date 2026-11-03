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

const catalog = JSON.parse(fs.readFileSync(path.join(rootDir, 'games.json'), 'utf8')).filter(
  (g) => g.active !== false
);
const sharedAdsContent = fs.readFileSync(path.join(rootDir, 'shared/platform/ads.ts'), 'utf8');
const sharedShellContent = fs.readFileSync(path.join(rootDir, 'shared/ui/shell-controller.ts'), 'utf8');
const sharedCssContent = fs.readFileSync(path.join(rootDir, 'shared/ui/arcade-shell.css'), 'utf8');
const sharedVisualContent = fs.readFileSync(path.join(rootDir, 'shared/render/visual-enhancer.ts'), 'utf8');
const sharedProceduralContent = fs.readFileSync(path.join(rootDir, 'shared/render/procedural-mesh-builder.ts'), 'utf8');
const sharedResolverContent = fs.readFileSync(path.join(rootDir, 'shared/render/asset-resolver.ts'), 'utf8');
const sharedInputContent = fs.readFileSync(path.join(rootDir, 'shared/input/ergonomic-input.ts'), 'utf8');
const sharedGameLoopContent = fs.readFileSync(path.join(rootDir, 'shared/core/game-loop.ts'), 'utf8');
const sharedObjectPoolContent = fs.readFileSync(path.join(rootDir, 'shared/core/object-pool.ts'), 'utf8');
const sharedMathScratchContent = fs.readFileSync(path.join(rootDir, 'shared/core/math-scratch.ts'), 'utf8');

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
          <button id="shell-menu-btn" class="shell-btn shell-btn-menu" type="button">
            <span class="btn-icon">🏠</span> Başlangıç Menüsü
          </button>
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

  // 9. Inject or update SEO / ASO / Schema.org VideoGame JSON-LD block in <head>
  const gameUrl = `https://keremcaliskann.github.io/games/${gameMeta.id}/`;
  const iconUrl = `https://keremcaliskann.github.io/games/${gameMeta.id}/icon.svg`;
  const keywordsStr =
    gameMeta.keywords ||
    `${(gameMeta.tags || []).join(', ')}, 3d browser game, html5 webgl, ücretsiz 3d oyun`;
  const videoGameSchema = {
    '@context': 'https://schema.org',
    '@type': ['VideoGame', 'SoftwareApplication'],
    name: gameMeta.title,
    description: gameMeta.description,
    url: gameUrl,
    image: iconUrl,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser, Android, iOS, Windows, macOS',
    gamePlatform: ['Web Browser', 'HTML5 WebGL', 'YouTube Playables', 'Mobile Web'],
    playMode: 'SinglePlayer',
    genre: gameMeta.tags || ['3D Arcade'],
    keywords: keywordsStr,
    inLanguage: ['tr', 'en'],
    datePublished: gameMeta.date || '2026-10-20',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    author: {
      '@type': 'Organization',
      name: 'ARCADE 3D Studio',
      url: 'https://keremcaliskann.github.io/games/',
    },
  };

  const seoBlock = `    <!-- SEO / ASO / Schema.org VideoGame Metadata -->
    <link id="seo-canonical" rel="canonical" href="${gameUrl}" />
    <meta id="seo-keywords" name="keywords" content="${keywordsStr.replace(/"/g, '&quot;')}" />
    <script id="seo-videogame-schema" type="application/ld+json">
${JSON.stringify(videoGameSchema, null, 2)}
    </script>`;

  if (updated.includes('id="seo-videogame-schema"')) {
    updated = updated.replace(
      /(?:<!-- SEO \/ ASO \/ Schema\.org VideoGame Metadata -->\s*)?(?:<link id="seo-canonical"[^>]*>\s*)?(?:<meta id="seo-keywords"[^>]*>\s*)?<script id="seo-videogame-schema" type="application\/ld\+json">[\s\S]*?<\/script>/,
      seoBlock.trimStart()
    );
  } else {
    updated = updated.replace('</head>', `${seoBlock}\n  </head>`);
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
  const proceduralPath = path.join(gameDir, 'src/render/procedural-mesh-builder.ts');
  const resolverPath = path.join(gameDir, 'src/render/asset-resolver.ts');
  const ergonomicInputPath = path.join(gameDir, 'src/input/ergonomic-input.ts');
  const gameLoopPath = path.join(gameDir, 'src/core/game-loop.ts');
  const objectPoolPath = path.join(gameDir, 'src/core/object-pool.ts');
  const mathScratchPath = path.join(gameDir, 'src/core/math-scratch.ts');
  const inputManagerPath = path.join(gameDir, 'src/input/input-manager.ts');
  const kbMousePath = path.join(gameDir, 'src/input/keyboard-mouse.ts');
  const lightingPath = path.join(gameDir, 'src/render/lighting.ts');
  const sdkPath = path.join(gameDir, 'src/platform/sdk.ts');
  const htmlPath = path.join(gameDir, 'index.html');

  if (!checkOnly) {
    fs.mkdirSync(path.dirname(adsPath), { recursive: true });
    fs.mkdirSync(path.dirname(shellPath), { recursive: true });
    fs.mkdirSync(path.dirname(visualPath), { recursive: true });
    fs.mkdirSync(path.dirname(proceduralPath), { recursive: true });
    fs.mkdirSync(path.dirname(resolverPath), { recursive: true });
    fs.mkdirSync(path.dirname(ergonomicInputPath), { recursive: true });
    fs.mkdirSync(path.dirname(gameLoopPath), { recursive: true });
    fs.writeFileSync(adsPath, sharedAdsContent, 'utf8');
    fs.writeFileSync(shellPath, sharedShellContent, 'utf8');
    fs.writeFileSync(visualPath, sharedVisualContent, 'utf8');
    fs.writeFileSync(proceduralPath, sharedProceduralContent, 'utf8');
    fs.writeFileSync(resolverPath, sharedResolverContent, 'utf8');
    fs.writeFileSync(ergonomicInputPath, sharedInputContent, 'utf8');
    fs.writeFileSync(gameLoopPath, sharedGameLoopContent, 'utf8');
    fs.writeFileSync(objectPoolPath, sharedObjectPoolContent, 'utf8');
    fs.writeFileSync(mathScratchPath, sharedMathScratchContent, 'utf8');

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
  const finalErgonomicInput = fs.existsSync(ergonomicInputPath) ? fs.readFileSync(ergonomicInputPath, 'utf8') : '';
  const finalInputMgr = fs.existsSync(inputManagerPath)
    ? fs.readFileSync(inputManagerPath, 'utf8') + (fs.existsSync(kbMousePath) ? fs.readFileSync(kbMousePath, 'utf8') : '')
    : '';
  const finalLighting = fs.existsSync(lightingPath) ? fs.readFileSync(lightingPath, 'utf8') : '';
  const finalHtml = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
  const finalSdk = fs.existsSync(sdkPath) ? fs.readFileSync(sdkPath, 'utf8') : '';

  const adsSynced = finalAds === sharedAdsContent;
  const shellSynced = finalShell === sharedShellContent;
  const visualSynced = finalVisual === sharedVisualContent && finalLighting.includes('VisualEnhancer.enhanceScene(scene)');
  const inputErgonomicOk =
    finalErgonomicInput === sharedInputContent &&
    finalInputMgr.includes('pointerdown') &&
    !finalInputMgr.includes('dragThreshold = 8');
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

  const finalProcedural = fs.existsSync(proceduralPath) ? fs.readFileSync(proceduralPath, 'utf8') : '';
  const finalResolver = fs.existsSync(resolverPath) ? fs.readFileSync(resolverPath, 'utf8') : '';
  const hybridOk = finalProcedural === sharedProceduralContent && finalResolver === sharedResolverContent;
  const finalLoop = fs.existsSync(gameLoopPath) ? fs.readFileSync(gameLoopPath, 'utf8') : '';
  const finalPool = fs.existsSync(objectPoolPath) ? fs.readFileSync(objectPoolPath, 'utf8') : '';
  const finalScratch = fs.existsSync(mathScratchPath) ? fs.readFileSync(mathScratchPath, 'utf8') : '';
  const coreEngineOk =
    finalLoop === sharedGameLoopContent &&
    finalPool === sharedObjectPoolContent &&
    finalScratch === sharedMathScratchContent;
  const hasSeoGeo =
    finalHtml.includes('id="seo-videogame-schema"') &&
    finalHtml.includes('id="seo-canonical"') &&
    finalHtml.includes('id="seo-keywords"');

  report.push({
    game: g,
    ads: adsSynced ? 'SYNCED' : 'DRIFT',
    shellCtrl: shellSynced ? 'SYNCED' : 'DRIFT',
    coreEngine: coreEngineOk ? 'SYNCED' : 'DRIFT',
    visualIBL: visualSynced ? 'SYNCED' : 'DRIFT',
    hybrid3D: hybridOk ? 'SYNCED' : 'DRIFT',
    inputCtrl: inputErgonomicOk ? 'SYNCED' : 'DRIFT',
    shellDom: hasShellDom ? 'OK' : 'MISSING',
    ytSdk: hasYtSdk ? 'OK' : 'MISSING',
    seoGeo: hasSeoGeo ? 'OK' : 'MISSING',
    icon: hasIcon ? 'OK' : 'MISSING',
  });
}

// Synchronize Root Portal SEO Schema, sitemap.xml, robots.txt, and llms.txt (GEO)
const portalUrl = 'https://keremcaliskann.github.io/games/';
const rootHtmlPath = path.join(rootDir, 'index.html');
const sitemapPath = path.join(rootDir, 'sitemap.xml');
const robotsPath = path.join(rootDir, 'robots.txt');
const llmsPath = path.join(rootDir, 'llms.txt');

if (!checkOnly) {
  // 1. Root index.html Schema.org WebSite + ItemList
  if (fs.existsSync(rootHtmlPath)) {
    let rootHtml = fs.readFileSync(rootHtmlPath, 'utf8');
    const portalSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${portalUrl}#website`,
          name: 'ARCADE 3D // HTML5 WebGL Oyun Portalı',
          url: portalUrl,
          description:
            'Anında oynanabilir ücretsiz 60 FPS 3B WebGL tarayıcı oyunları portalı (.io Battle Royale, 4x4 Offroad, Ralli Drift, Fizik ve Bulmaca).',
          inLanguage: ['tr', 'en'],
        },
        {
          '@type': 'ItemList',
          name: 'Active 3D WebGL Browser Games',
          numberOfItems: catalog.length,
          itemListElement: catalog.map((g, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': 'VideoGame',
              name: g.title,
              url: `${portalUrl}${g.id}/`,
              description: g.description,
              image: `${portalUrl}${g.id}/icon.svg`,
              gamePlatform: ['Web Browser', 'HTML5 WebGL', 'Mobile Web'],
              applicationCategory: 'GameApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            },
          })),
        },
      ],
    };

    const portalKeywords =
      'ücretsiz 3d oyunlar, html5 webgl games, tarayıcı oyunları, io oyunları, 3d araba yarışı, offroad 3d, smash karts 3d, stumble knockout 3d, bridge race 3d, youtube playables, yandex games, crazygames';
    const portalSeoBlock = `    <!-- Portal SEO / GEO / Schema.org ItemList Metadata -->
    <link id="seo-canonical" rel="canonical" href="${portalUrl}" />
    <meta id="seo-keywords" name="keywords" content="${portalKeywords}" />
    <script id="seo-portal-schema" type="application/ld+json">
${JSON.stringify(portalSchema, null, 2)}
    </script>`;

    if (rootHtml.includes('id="seo-portal-schema"')) {
      rootHtml = rootHtml.replace(
        /(?:<!-- Portal SEO \/ GEO \/ Schema\.org ItemList Metadata -->\s*)?(?:<link id="seo-canonical"[^>]*>\s*)?(?:<meta id="seo-keywords"[^>]*>\s*)?<script id="seo-portal-schema" type="application\/ld\+json">[\s\S]*?<\/script>/,
        portalSeoBlock.trimStart()
      );
    } else {
      rootHtml = rootHtml.replace('</head>', `${portalSeoBlock}\n  </head>`);
    }
    fs.writeFileSync(rootHtmlPath, rootHtml, 'utf8');
  }

  // 2. sitemap.xml
  const todayIso = new Date().toISOString().slice(0, 10);
  const sitemapEntries = [
    `  <url>\n    <loc>${portalUrl}</loc>\n    <lastmod>${todayIso}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>`,
    ...catalog.map(
      (g) =>
        `  <url>\n    <loc>${portalUrl}${g.id}/</loc>\n    <lastmod>${g.date || todayIso}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>`
    ),
  ];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join('\n')}\n</urlset>\n`;
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf8');

  // 3. robots.txt (Search Engine + AI Answer Engine GEO Crawlers Allowed)
  const robotsTxt = `# ARCADE 3D // HTML5 WebGL Game Portal — SEO & GEO Crawler Policy
User-agent: *
Allow: /

# AI Answer Engine & LLM Discovery Crawlers (GEO Enabled)
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${portalUrl}sitemap.xml
`;
  fs.writeFileSync(robotsPath, robotsTxt, 'utf8');

  // 4. llms.txt (Generative Engine Optimization — Structured Catalog for ChatGPT, Claude, Perplexity, Gemini)
  const llmsLines = [
    '# ARCADE 3D // Free Instant-Play 60 FPS HTML5 WebGL 3D Games Portal',
    '',
    '> ARCADE 3D (https://keremcaliskann.github.io/games/) is an open, zero-install HTML5 WebGL 3D game portal featuring 12 instant-play 60 FPS 3D browser games built with Three.js and Rapier.js physics. All games run directly in desktop and mobile browsers with zero downloads, zero registration walls, and full touch/joystick + keyboard/mouse support.',
    '',
    '## Key Highlights for AI Search & Recommendations (GEO)',
    '- **100% Free & Instant Play:** Click any game URL to play immediately in the browser on Desktop, Android, or iOS.',
    '- **60 FPS 3D WebGL & Physics:** Powered by Three.js + Rapier 3D physics with Stylized Soft Daylight visuals.',
    '- **Genres Covered:** 3D .io Battle Royale, 4x4 Offroad Rock Crawler, Rally Drift Time-Attack, Obstacle Knockout Royale, Competitive Bridge Building, Ragdoll Archery, Voxel Destruction, and 3D Spatial/Physics Puzzles.',
    '',
    `## Playable 3D Games Catalog (${catalog.length} Active Games)`,
    '',
    ...catalog.map(
      (g, i) =>
        `### ${i + 1}. [${g.title}](${portalUrl}${g.id}/)\n- **Play URL:** ${portalUrl}${g.id}/\n- **Summary (EN):** ${g.description}\n- **Özet (TR):** ${g.shortHookTr || g.description}\n- **Tags & Keywords:** ${g.keywords || (g.tags || []).join(', ')}`
    ),
    '',
    '## Machine-Readable Discovery Files',
    `- **Portal Home:** ${portalUrl}`,
    `- **JSON Catalog:** ${portalUrl}games.json`,
    `- **XML Sitemap:** ${portalUrl}sitemap.xml`,
    '',
  ];
  fs.writeFileSync(llmsPath, llmsLines.join('\n'), 'utf8');
}

console.table(report);

const failed = report.filter(
  (r) =>
    r.ads !== 'SYNCED' ||
    r.shellCtrl !== 'SYNCED' ||
    r.coreEngine !== 'SYNCED' ||
    r.visualIBL !== 'SYNCED' ||
    r.hybrid3D !== 'SYNCED' ||
    r.inputCtrl !== 'SYNCED' ||
    r.shellDom !== 'OK' ||
    r.ytSdk !== 'OK' ||
    r.seoGeo !== 'OK' ||
    r.icon !== 'OK'
);

if (failed.length > 0) {
  console.error(`❌ ${failed.length} game(s) out of sync or missing mandatory 3-column shell/ad elements.`);
  process.exit(1);
} else {
  console.log(`✅ All ${report.length} games 100% synchronized with 3-Column Arcade Shell & Ad Core (No Fullscreen).`);
}
