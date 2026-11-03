---
trigger: model_decision
description: "PWA standards, Web App Manifest, Technical SEO (Schema.org/VideoGame JSON-LD, sitemap.xml), Portal Store ASO (keywords & conversion hooks), and Generative Engine Optimization (GEO llms.txt & AI crawler policy)."
---

# PWA, Technical SEO, Store ASO & AI Search (GEO) Policy (`68-pwa-and-meta`)

## 1. HTML Header, Canonical & Social Metadata Requirements
Every active game's `index.html` and the root Portal `index.html` must include mobile viewport, canonical link, bilingual ASO keywords, OpenGraph, and **`Schema.org/VideoGame` JSON-LD** structured data (automatically synchronized via `node scripts/sync-shared-core.mjs`):

```html
<!-- Mobile & Viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="theme-color" content="#f1f5f9" />

<!-- Technical SEO & ASO Keywords -->
<link id="seo-canonical" rel="canonical" href="https://keremcaliskann.github.io/games/<game-id>/" />
<meta id="seo-keywords" name="keywords" content="<en + tr high-intent keywords>" />

<!-- OpenGraph / Social Sharing -->
<meta property="og:type" content="website" />
<meta property="og:title" content="GAME TITLE // 3D HTML5" />
<meta property="og:description" content="High-performance 60 FPS 3D HTML5 game. Play instantly in your browser." />
<meta property="og:url" content="https://keremcaliskann.github.io/games/<game-id>/" />
<meta name="twitter:card" content="summary_large_image" />

<!-- Schema.org VideoGame + SoftwareApplication Rich Snippet JSON-LD -->
<script id="seo-videogame-schema" type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["VideoGame", "SoftwareApplication"],
  "name": "GAME TITLE",
  "applicationCategory": "GameApplication",
  "operatingSystem": "Web Browser, Android, iOS, Windows, macOS",
  "gamePlatform": ["Web Browser", "HTML5 WebGL", "YouTube Playables", "Mobile Web"],
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
}
</script>
```

## 2. Portal Store ASO Metadata (`games.json`)
Every active game entry in root `games.json` must maintain:
- `title`: High-contrast uppercase brand + sub-genre hook (`<BRAND> 3D // <SUB-GENRE>`).
- `description`: Action-first English store description (`120–160 chars`) highlighting core loop, bot count, and progression.
- `shortHookTr`: Conversion-optimized Turkish one-liner (`80–120 chars`) for portal hover cards and Yandex/local store listings.
- `keywords`: Comma-separated bilingual (`EN + TR`) search keywords targeting Google Search, YouTube Playables, CrazyGames, Poki, and Yandex Games.

## 3. Technical SEO & Generative Engine Optimization (GEO) Root Files
`node scripts/sync-shared-core.mjs` automatically generates and keeps three root discovery files in sync with active games (`active !== false` in `games.json`):
1. **`sitemap.xml`:** Lists the root portal (`priority: 1.0`) and every active game URL (`priority: 0.9`, `lastmod`).
2. **`robots.txt`:** Explicitly allows traditional search engines (`Googlebot`, `Yandex`, `Bingbot`) and AI Answer Engine crawlers (`GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`).
3. **`llms.txt`:** Follows the `llms.txt` standard to provide ChatGPT, Claude, Perplexity, and Gemini with a structured markdown catalog of all active 3D WebGL games, their direct play URLs, mechanics, and bilingual summaries.

## 4. Web App Manifest (`public/manifest.json`)
Every project must contain a valid `public/manifest.json` with `display: "fullscreen"` and relative `start_url: "./"`.
