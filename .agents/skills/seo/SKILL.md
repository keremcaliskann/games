---
name: seo
description: >-
  Audits and optimizes Technical SEO (Schema.org/VideoGame JSON-LD, sitemap.xml, canonical tags),
  Portal Store ASO (Yandex, CrazyGames, Poki, YouTube Playables titles, hooks, bilingual keywords),
  and AI Search Visibility / GEO (llms.txt, AI crawler robots.txt) across all active 3D games.
  Use when the user types /seo or asks for SEO, ASO, or AI search (GEO) optimization.
---

# /seo — Game Studio Technical SEO, Store ASO & AI Search (GEO) Optimizer

Synthesizes the game-relevant core of `marketingskills` (Store ASO & Conversion Copy), `claude-seo` (`Schema.org/VideoGame` JSON-LD & Technical SEO), and `geo-seo-claude` (`llms.txt` & AI Crawler Visibility) into a single zero-bloat workflow for our HTML5 3D Game Studio.

> **PASSIVE GAMES EXCLUSION:** Strictly ignore any game marked `"active": false` in `games.json`.

## Execution Workflow (4 Steps)

1. **Audit & Enrich Store ASO Metadata (`games.json`):**
   - Inspect all active games (`active !== false`) in `games.json`.
   - Ensure every active game has:
     - `title`: High-CTR format (`<GAME NAME> 3D // <HOOK>`).
     - `description`: Action-driven 120–160 char English summary for `<meta name="description">` and OpenGraph.
     - `shortHookTr`: Conversion-focused Turkish hook for portal cards and local store listings.
     - `keywords`: High-intent bilingual (`EN + TR`) keywords covering the game's mechanic, `.io` / 3D physics sub-genre, and free browser playability.

2. **Synchronize Technical SEO (`VideoGame` JSON-LD) & GEO Discovery Files:**
   - Run `node scripts/sync-shared-core.mjs` to automatically generate/update:
     - `<script id="seo-videogame-schema" type="application/ld+json">` (`Schema.org/VideoGame` + `SoftwareApplication`), `<link id="seo-canonical">`, and `<meta id="seo-keywords">` in every active game's `index.html`.
     - `<script id="seo-portal-schema" type="application/ld+json">` (`WebSite` + `ItemList`) in root `index.html`.
     - Root `sitemap.xml` (all active game URLs).
     - Root `robots.txt` (allowing `Googlebot`, `Yandex`, `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`).
     - Root `llms.txt` (structured AI Answer Engine catalog for ChatGPT, Claude, Perplexity, and Gemini).

3. **Verify 100-Point Game SEO / ASO / GEO Readiness Score:**
   - **Technical SEO (35 pts):** Valid `VideoGame` JSON-LD schema, canonical URLs, OpenGraph tags, and `sitemap.xml` across all active games.
   - **Portal Store ASO (35 pts):** Bilingual `keywords`, `shortHookTr`, `description`, and SVG icons present for every active game in `games.json`.
   - **AI Search Visibility / GEO (30 pts):** Root `llms.txt` up to date with all active games and `robots.txt` explicitly open to AI search bots.

4. **Output Concise Turkish Maintenance Report:**
   - Output a `<= 6-line` ASD-STE100 Turkish summary (`DISCREPANCY / ROOT CAUSE / CORRECTIVE ACTION / VERIFICATION`) with the composite **SEO + ASO + GEO Score (`0–100`)**.
