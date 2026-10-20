---
trigger: model_decision
description: "PWA standards, Web App Manifest, offline service worker, OpenGraph social meta tags, and mobile web app appearance."
---

# Progressive Web App (PWA) & Social Metadata Policy

## 1. HTML Header & Meta Tag Requirements
Every game's `index.html` must include standard mobile viewport, theme, and OpenGraph social metadata:

```html
<!-- Mobile & Viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="theme-color" content="#090a14" />

<!-- OpenGraph / Social Sharing -->
<meta property="og:type" content="website" />
<meta property="og:title" content="GAME TITLE // 3D HTML5" />
<meta property="og:description" content="High-performance 3D HTML5 game. Play instantly in your browser." />
<meta property="og:url" content="https://keremcaliskann.github.io/games/<game-name>/" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="GAME TITLE // 3D HTML5" />
```

## 2. Web App Manifest (`manifest.json`)
Every project must contain a minimal `manifest.json` in `public/` or root:

```json
{
  "name": "Game Title",
  "short_name": "Game",
  "start_url": "./",
  "display": "fullscreen",
  "orientation": "any",
  "background_color": "#090a14",
  "theme_color": "#00f0ff",
  "icons": [
    {
      "src": "./icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 3. Offline Service Worker (`sw.js`)
- When requested or finalizing for PWA distribution, provide a lightweight Service Worker caching `index.html`, bundle JS chunks, and `.wasm` binaries using a cache-first or stale-while-revalidate strategy.
- Register conditionally only in production builds (`import.meta.env.PROD`).
