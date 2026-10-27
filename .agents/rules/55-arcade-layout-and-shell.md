---
trigger: model_decision
description: "Arcade Shell 3-column layout, responsive canvas stage, left sidebar navigation, right ad rail, zero fullscreen mode, and public/icon.svg game icon pipeline."
---

# Arcade Shell 3-Column Layout & Game Icon Policy

## 1. Architectural Principle (Permanent 3-Column Arcade Shell — No Fullscreen Mode)
Every game in this workspace MUST render a permanent **3-Column Arcade Shell** layout with **Left Navigation Sidebar**, **Center 3D WebGL Stage**, and **Right Advertising Rail**:
- **STRICT PROHIBITION ON FULLSCREEN & SIDEBAR HIDING:**
  - Never include a Fullscreen button (`#shell-fullscreen-btn`, `requestFullscreen()`, `Tam Ekran`) or `#fullscreen-ad-banner` in any project.
  - Never add `embed-fullscreen-mode` or `yt-embed-mode` classes that hide `.shell-sidebar-left` or `.shell-sidebar-right`.
  - The Left Navigation Sidebar and Right Sponsor Ad Rail must remain permanently visible on desktop viewports across all games.

```
+-----------------------------------------------------------------------------------+
| ARCADE SHELL (#arcade-shell.arcade-shell)                                         |
| +---------------------+ +---------------------------------+ +-------------------+ |
| | LEFT SIDEBAR (260px) | | CENTER STAGE (flex: 1)          | | RIGHT RAIL (320px)| |
| | - Brand / Title      | | +-----------------------------+ | | - SPONSOR // AD   | |
| | - Portala Dön (../)  | | | WebGL Canvas (#app)         | | |   300x600 Slot    | |
| | - Yeniden Başlat     | | | HUD Overlay (#hud)          | | |   (#ad-banner-    | |
| | - Diğer Oyunlar List | | +-----------------------------+ | |    desktop)       | |
| +---------------------+ +---------------------------------+ +-------------------+ |
+-----------------------------------------------------------------------------------+
```

---

## 2. 3-Column Desktop Layout Specification

### 2.1 DOM Hierarchy
Every game's `index.html` body must follow this exact semantic structure:

```html
<div id="arcade-shell" class="arcade-shell">
  <!-- Left Navigation Rail -->
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
  </aside>

  <!-- Center Game Viewport Stage -->
  <main id="shell-stage" class="shell-stage">
    <div id="app" class="game-canvas-container"></div>
    <div id="hud" class="game-hud-overlay"></div>
  </main>

  <!-- Right Advertising Rail -->
  <aside class="shell-sidebar shell-sidebar-right">
    <div class="ad-rail-wrapper">
      <span class="ad-header-tag">SPONSOR // REKLAM</span>
      <div id="ad-banner-desktop" class="ad-banner-slot banner-300x600">
        <div class="ad-mock-creative">
          <div class="ad-mock-glow"></div>
          <p class="ad-mock-brand">ARCADE 3D</p>
          <p class="ad-mock-desc">Zero-install 60 FPS WebGL 3D Arcade</p>
          <div class="ad-mock-cta">ŞİMDİ OYNA</div>
        </div>
      </div>
    </div>
  </aside>
</div>
```

---

## 3. Dynamic Canvas Resizing via `ResizeObserver`
To prevent WebGL distortion or stretching when window dimensions change:
1. Observe `.game-canvas-container` (`#app`) with a `ResizeObserver`.
2. Do not rely solely on `window.addEventListener('resize')`.
3. In callback: update `renderer.setSize(entry.contentRect.width, entry.contentRect.height, false)` and recalculate `camera.aspect = width / height; camera.updateProjectionMatrix();`.

---

## 4. Left Sidebar Controls & Cross-Discovery Contract

### 4.1 Restart Action
The restart button `#shell-restart-btn` triggers a clean level/game restart without performing a destructive full-page browser reload:
```ts
document.getElementById('shell-restart-btn')?.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('arcade:restart'));
});
```

### 4.2 Dynamic "Diğer Oyunlar" Discovery List
The sidebar dynamically requests `../games.json` and renders all sibling games with their SVG icons (`../${g.id}/icon.svg`).

---

## 5. Mandatory `public/icon.svg` Game Icon Pipeline
Every game repository must include `public/icon.svg` (`viewBox="0 0 512 512"`) and `<link rel="icon" type="image/svg+xml" href="./icon.svg" />` in `index.html`.

---

## 6. Shared Core Synchronization (`shared/ui/` & `scripts/sync-shared-core.mjs`)
- `shared/ui/shell-controller.ts` and `shared/ui/arcade-shell.css` serve as the **Single Source of Truth** for all games.
- Always run `node scripts/sync-shared-core.mjs` to propagate the canonical 3-column `#arcade-shell` HTML, CSS, and `ShellController` across all games.
