#!/usr/bin/env node
/**
 * One-Command Standard 3D Game Scaffolder (scripts/scaffold-game.mjs)
 * Usage: node scripts/scaffold-game.mjs <game-id> "<Game Title>" [themeHex]
 *
 * Scaffolds a 100% compliant, genre-agnostic HTML5 3D game directory pre-wired with:
 * - Vite (`base: './'`) + strict TypeScript + Three.js + Rapier3D configuration
 * - Canonical 3-Column Arcade Shell & Full-Cover Start Menu (`#arcade-shell`, `#shell-stage.is-menu-locked`)
 * - Shared Engine Core (`src/core/game-loop.ts`, `src/core/object-pool.ts`, `src/core/math-scratch.ts`)
 * - Shared Render & Input Core (`visual-enhancer.ts`, `procedural-mesh-builder.ts`, `asset-resolver.ts`, `ergonomic-input.ts`)
 * - Universal Platform Bridge (`src/platform/sdk.ts`, `src/platform/ads.ts`)
 * - Soft Daylight Lighting setup (`src/render/lighting.ts`)
 * - PWA Manifest & Vector Game Icon (`public/manifest.json`, `public/icon.svg`)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const [, , rawId, rawTitle, rawTheme] = process.argv;

if (!rawId) {
  console.error('Usage: node scripts/scaffold-game.mjs <game-id> "<Game Title>" [themeHex]');
  process.exit(1);
}

const gameId = rawId.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
const gameTitle = (rawTitle || gameId.toUpperCase().replace(/-/g, ' ')).trim();
const themeColor = (rawTheme || '#2563eb').trim();
const gameDir = path.join(rootDir, gameId);

if (fs.existsSync(gameDir)) {
  console.error(`❌ Directory already exists: ${gameDir}`);
  process.exit(1);
}

const dirs = [
  'public/assets/models',
  'src/core',
  'src/render',
  'src/physics',
  'src/input',
  'src/platform',
  'src/game/config',
  'src/game/entities',
  'src/game/systems',
  'src/ui',
];

for (const d of dirs) {
  fs.mkdirSync(path.join(gameDir, d), { recursive: true });
}

// 1. Copy all shared core modules
const sharedCopies = [
  ['shared/platform/ads.ts', 'src/platform/ads.ts'],
  ['shared/ui/shell-controller.ts', 'src/ui/shell-controller.ts'],
  ['shared/core/game-loop.ts', 'src/core/game-loop.ts'],
  ['shared/core/object-pool.ts', 'src/core/object-pool.ts'],
  ['shared/core/math-scratch.ts', 'src/core/math-scratch.ts'],
  ['shared/render/visual-enhancer.ts', 'src/render/visual-enhancer.ts'],
  ['shared/render/procedural-mesh-builder.ts', 'src/render/procedural-mesh-builder.ts'],
  ['shared/render/asset-resolver.ts', 'src/render/asset-resolver.ts'],
  ['shared/input/ergonomic-input.ts', 'src/input/ergonomic-input.ts'],
];

for (const [srcRel, destRel] of sharedCopies) {
  fs.copyFileSync(path.join(rootDir, srcRel), path.join(gameDir, destRel));
}

// 2. package.json, tsconfig.json, vite.config.ts, .gitignore
fs.writeFileSync(
  path.join(gameDir, 'package.json'),
  JSON.stringify(
    {
      name: gameId,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        typecheck: 'tsc --noEmit',
        preview: 'vite preview',
      },
      dependencies: {
        '@dimforge/rapier3d-compat': '^0.12.0',
        three: '^0.169.0',
      },
      devDependencies: {
        '@types/three': '^0.169.0',
        typescript: '^5.6.3',
        vite: '^5.4.10',
      },
    },
    null,
    2
  ) + '\n',
  'utf8'
);

fs.writeFileSync(
  path.join(gameDir, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        module: 'ESNext',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        isolatedModules: true,
        moduleDetection: 'force',
        noEmit: true,
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
    },
    null,
    2
  ) + '\n',
  'utf8'
);

fs.writeFileSync(
  path.join(gameDir, 'vite.config.ts'),
  `import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 4096,
    sourcemap: false,
  },
});
`,
  'utf8'
);

fs.writeFileSync(
  path.join(gameDir, '.gitignore'),
  `node_modules\ndist\n.DS_Store\n*.local\n`,
  'utf8'
);

// 3. public/manifest.json & public/icon.svg
fs.writeFileSync(
  path.join(gameDir, 'public/manifest.json'),
  JSON.stringify(
    {
      name: gameTitle,
      short_name: gameTitle.slice(0, 18),
      start_url: './',
      display: 'standalone',
      background_color: '#cfe8f7',
      theme_color: themeColor,
      icons: [
        {
          src: './icon.svg',
          sizes: 'any',
          type: 'image/svg+xml',
          purpose: 'any maskable',
        },
      ],
    },
    null,
    2
  ) + '\n',
  'utf8'
);

fs.writeFileSync(
  path.join(gameDir, 'public/icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${themeColor}" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)" />
  <circle cx="256" cy="256" r="144" fill="#ffffff" fill-opacity="0.16" />
  <polygon points="212,172 348,256 212,340" fill="#ffffff" />
</svg>
`,
  'utf8'
);

// 4. src/platform/sdk.ts & src/render/lighting.ts
fs.writeFileSync(
  path.join(gameDir, 'src/platform/sdk.ts'),
  `export class PlatformBridge {
  public static applyDualModeShell(): void {
    document.documentElement.classList.remove('yt-embed-mode');
    document.body?.classList.remove('embed-fullscreen-mode');
  }

  public firstFrameReady(): void {
    try {
      (window as any).ytgame?.game?.firstFrameReady?.();
    } catch {
      // No-op outside YouTube Playables
    }
  }

  public gameReady(): void {
    try {
      (window as any).ytgame?.game?.gameReady?.();
      (window as any).PokiSDK?.gameLoadingFinished?.();
    } catch {
      // No-op
    }
  }

  public bindLifecycle(
    onPause: () => void,
    onResume: () => void,
    onAudioChange: (enabled: boolean) => void
  ): void {
    try {
      const yt = (window as any).ytgame;
      yt?.system?.onPause?.(onPause);
      yt?.system?.onResume?.(onResume);
      yt?.system?.onAudioEnabledChange?.(onAudioChange);
    } catch {
      // No-op
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) onPause();
      else onResume();
    });
  }
}
`,
  'utf8'
);

fs.writeFileSync(
  path.join(gameDir, 'src/render/lighting.ts'),
  `import * as THREE from 'three';
import { VisualEnhancer } from './visual-enhancer';

export function setupDaylightLighting(scene: THREE.Scene, renderer?: THREE.WebGLRenderer): THREE.DirectionalLight {
  VisualEnhancer.enhanceScene(scene, renderer);

  scene.background = new THREE.Color(0xcfe8f7);
  scene.fog = new THREE.FogExp2(0xcfe8f7, 0.0045);

  const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xfde68a, 0.85);
  hemiLight.position.set(0, 50, 0);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
  sunLight.position.set(32, 64, -28);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(2048, 2048);
  sunLight.shadow.bias = -0.0005;
  sunLight.shadow.normalBias = 0.02;
  scene.add(sunLight);

  return sunLight;
}
`,
  'utf8'
);

// 5. Canonical index.html with shared CSS
const sharedCss = fs.readFileSync(path.join(rootDir, 'shared/ui/arcade-shell.css'), 'utf8');
fs.writeFileSync(
  path.join(gameDir, 'index.html'),
  `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>${gameTitle} // 3D WebGL Arcade</title>
    <link rel="icon" type="image/svg+xml" href="./icon.svg" />
    <link rel="manifest" href="./manifest.json" />
    <script src="https://www.youtube.com/game_api/v1"></script>
    <style id="shared-arcade-shell-css">
${sharedCss}
    </style>
  </head>
  <body>
    <div id="arcade-shell" class="arcade-shell">
      <main id="shell-stage" class="shell-stage is-menu-locked">
        <div id="game-container" class="game-canvas-container">
          <canvas id="game-canvas"></canvas>
        </div>
        <div id="hud-root" class="game-hud-overlay"></div>
      </main>
    </div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
  'utf8'
);

console.log(`✅ Scaffolded "${gameId}" (${gameTitle}) with full Shared Core & 3-Column Shell at ${gameDir}`);
