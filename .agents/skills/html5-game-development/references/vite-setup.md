# Vite Project Setup

Table of Contents: configuration · tsconfig · scripts · index.html · entry point · asset organization

## `vite.config.ts`

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  // Capacitor serves files with relative paths; root '/' breaks in native WebViews
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // Split large vendor libraries into independent chunks
        manualChunks: {
          three: ['three'],
          rapier: ['@dimforge/rapier3d-compat'],
        },
      },
    },
  },
  // Allows testing on mobile devices over local Wi-Fi
  server: { host: true },
});
```

## `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

## `package.json` Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview --host"
  }
}
```
When Capacitor is integrated, add: `"cap:sync": "npm run build && cap sync"`.

## `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
    <title>3D Game</title>
    <style>
      html, body { margin: 0; height: 100%; overflow: hidden; background: #000; overscroll-behavior: none; }
      #app {
        position: fixed; inset: 0;
        touch-action: none;
        user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
      }
      #app canvas { display: block; width: 100%; height: 100%; }
      #hud {
        position: fixed; inset: 0; pointer-events: none;
        padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <div id="hud"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

## `src/main.ts` Entry Point

```ts
import { boot } from './core/boot';

const container = document.getElementById('app');
if (!container) throw new Error('#app container not found');

boot(container).catch((err) => {
  container.textContent = 'Failed to initialize game. Please check the console.';
  console.error(err);
});
```

Boot sequence: `await RAPIER.init()` → create renderer → initialize asset manager → setup input manager → instantiate game state → start game loop.

## Asset Directory Layout
```
public/
  basis/        # KTX2 basis transcoders (copied from three/examples/jsm/libs/basis)
  models/       # Compressed .glb files
  audio/        # Sound effects and music
  textures/     # Compressed textures
```
Resolve asset URLs via `import.meta.env.BASE_URL + 'models/example.glb'`.

## Automated GitHub Pages Deployment (`.github/workflows/deploy.yml`)

Target URL: `https://keremcaliskann.github.io/games/<game-name>/`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master, main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```
