---
trigger: model_decision
description: "Arcade Shell 3-column layout, responsive canvas stage, left sidebar navigation, right ad rail, fullscreen sticky banner, and public/icon.svg game icon pipeline."
---

# Arcade Shell Layout & Game Icon Policy

## 1. Architectural Principle
HTML5 3D games in this workspace must not open in raw, unconstrained full-window mode on desktop browsers. Each game operates within a standardized **Arcade Shell** that provides brand consistency, portal return navigation, game control shortcuts, cross-game discovery, dedicated advertising zones, and a mandatory vector icon pipeline.

```
+-----------------------------------------------------------------------------------+
| ARCADE SHELL                                                                      |
| +---------------------+ +---------------------------------+ +-------------------+ |
| | LEFT SIDEBAR (~260px) | | CENTER STAGE (flex: 1)         | | RIGHT RAIL (300px)| |
| | - Brand / Title     | | +-----------------------------+ | | - SPONSOR / AD    | |
| | - Return to Portal  | | | WebGL Canvas (#app)         | | |   300x250 or      | |
| | - Restart Game      | | | HUD Overlay (#hud)          | | |   300x600 Slot    | |
| | - Fullscreen Toggle | | +-----------------------------+ | |                   | |
| | - Other Games List  | | [Fullscreen Sticky Ad Banner] | |                     | |
| +---------------------+ +---------------------------------+ +-------------------+ |
+-----------------------------------------------------------------------------------+
```

---

## 2. 3-Column Desktop Layout Specification

### 2.1 DOM Hierarchy
Every game's `index.html` body must follow this semantic structure:

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
      <button id="shell-fullscreen-btn" class="shell-btn shell-btn-fullscreen" type="button">
        <span class="btn-icon">⛶</span> Tam Ekran
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
    <!-- Sticky banner displayed during Fullscreen mode -->
    <div id="fullscreen-ad-banner" class="fullscreen-ad-banner" aria-label="Sponsor Banner">
      <div class="fullscreen-ad-content">
        <span class="ad-tag">SPONSOR</span>
        <span class="ad-placeholder-text">HTML5 3D ARCADE // 60 FPS WEBGL EXPERIENCE</span>
      </div>
    </div>
  </main>

  <!-- Right Advertising Rail -->
  <aside class="shell-sidebar shell-sidebar-right">
    <div class="ad-rail-wrapper">
      <span class="ad-header-tag">SPONSOR // REKLAM</span>
      <div id="ad-banner-desktop" class="ad-banner-slot banner-300x600">
        <!-- Managed by IAdProvider or mock creative -->
        <div class="ad-mock-creative">
          <div class="ad-mock-glow"></div>
          <p class="ad-mock-brand">ARCADE 3D</p>
          <p class="ad-mock-desc">Zero-install instant gaming</p>
          <div class="ad-mock-cta">PLAY NOW</div>
        </div>
      </div>
    </div>
  </aside>
</div>
```

### 2.2 Shell CSS Layout Grid
```css
.arcade-shell {
  display: flex;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: #070810;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.shell-sidebar-left {
  width: 260px;
  min-width: 260px;
  background: rgba(13, 16, 28, 0.95);
  border-right: 1px solid rgba(0, 240, 255, 0.15);
  display: flex;
  flex-direction: column;
  padding: 18px 14px;
  gap: 16px;
  z-index: 20;
}

.shell-stage {
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: #000;
  display: flex;
  flex-direction: column;
}

.game-canvas-container {
  position: absolute;
  inset: 0;
  touch-action: none;
}

.game-canvas-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.game-hud-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.fullscreen-ad-banner {
  display: none; /* hidden by default in normal windowed mode; revealed only in :fullscreen mode */
}

.shell-sidebar-right {
  width: 320px;
  min-width: 320px;
  background: rgba(13, 16, 28, 0.95);
  border-left: 1px solid rgba(0, 240, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 10px;
  z-index: 20;
}

/* Responsive Collapse for Tablets & Mobile */
@media (max-width: 1024px) {
  .shell-sidebar-right {
    display: none;
  }
}

@media (max-width: 768px) {
  .arcade-shell {
    flex-direction: column;
  }
  .shell-sidebar-left {
    width: 100%;
    min-width: 100%;
    height: auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-right: none;
    border-bottom: 1px solid rgba(0, 240, 255, 0.15);
  }
  .shell-other-games {
    display: none;
  }
}
```

---

## 3. Dynamic Canvas Resizing via `ResizeObserver`
To prevent WebGL distortion or stretching when sidebars toggle or window dimensions change:
1. Observe `.game-canvas-container` (`#app`) with a `ResizeObserver`.
2. Do not rely solely on `window.addEventListener('resize')`.
3. In callback: update `renderer.setSize(entry.contentRect.width, entry.contentRect.height, false)` and recalculate `camera.aspect = width / height; camera.updateProjectionMatrix();`.

---

## 4. Fullscreen Mode & Sticky Ad Invariant
When the player triggers Fullscreen:
1. Target the `#arcade-shell` or `#shell-stage` element via `requestFullscreen()`.
2. In fullscreen state (`:fullscreen`), the `#fullscreen-ad-banner` must become visible and remain pinned on screen:
   ```css
   :fullscreen .fullscreen-ad-banner,
   .arcade-shell:fullscreen .fullscreen-ad-banner {
     display: flex !important;
     position: absolute;
     bottom: 0;
     left: 0;
     right: 0;
     height: 54px;
     background: rgba(7, 8, 16, 0.92);
     border-top: 1px solid rgba(0, 240, 255, 0.4);
     z-index: 999;
     align-items: center;
     justify-content: center;
     backdrop-filter: blur(8px);
   }
   :fullscreen .game-canvas-container {
     bottom: 54px; /* reserve viewport clearance for the sticky ad */
   }
   ```
3. Fullscreen button dynamically switches between `⛶ Tam Ekran` and `⛷ Tam Ekrandan Çık` by listening to `document.addEventListener('fullscreenchange', ...)`.

---

## 5. Left Sidebar Controls & Cross-Discovery Contract

### 5.1 Restart Action
The restart button `#shell-restart-btn` must trigger a clean level/game restart without performing a destructive full-page browser reload:
```ts
document.getElementById('shell-restart-btn')?.addEventListener('click', () => {
  window.dispatchEvent(new CustomEvent('arcade:restart'));
});
```
Each game registers an `arcade:restart` listener to transition to its Playing state or reset entities.

### 5.2 Dynamic "Diğer Oyunlar" Discovery List
The sidebar dynamically requests `../games.json`:
```ts
async function loadOtherGames(currentGameId: string): Promise<void> {
  const container = document.getElementById('shell-other-games-list');
  if (!container) return;
  try {
    const res = await fetch('../games.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const catalog = await res.json();
    const otherGames = catalog.filter((g: { id: string }) => g.id !== currentGameId);
    container.innerHTML = otherGames.map((g: any) => `
      <a href="../${g.id}/" class="other-game-item">
        <img src="../${g.id}/icon.svg" class="other-game-icon" alt="" />
        <div class="other-game-meta">
          <span class="other-game-title">${g.title}</span>
          <span class="other-game-tag">${g.tags?.[0] || '3D HTML5'}</span>
        </div>
      </a>
    `).join('');
  } catch {
    // Graceful silent fallback for local dev isolation
  }
}
```

---

## 6. Mandatory `public/icon.svg` Game Icon Pipeline

Every game repository must include `public/icon.svg`:
1. **Asset Specification**:
   - Location: `<game-name>/public/icon.svg` (copied to `dist/icon.svg` upon Vite build).
   - Format: Clean scalable vector graphics (`SVG`), UTF-8 encoded, `viewBox="0 0 512 512"`, self-contained.
   - Design Theme: High-contrast cyberpunk neon motif reflecting gameplay:
     - `cyber-flap`: Cyber drone motif with glowing cyan/magenta aerodynamic wing thrusters and optic visor.
     - `cyber-arrow-3d`: Neon arrow motif with isometric 3D arrows, directional geometric flow, and cyan/amber glow.
2. **Registration in `games.json`**:
   ```json
   {
     "id": "cyber-flap",
     "title": "CYBER FLAP // 2099",
     "icon": "./cyber-flap/icon.svg"
   }
   ```
3. **HTML Metadata Links**:
   Each game's `index.html` must include:
   ```html
   <link rel="icon" type="image/svg+xml" href="./icon.svg" />
   ```
4. **Portal Rendering**:
   The portal `index.html` renders game icons cleanly:
   ```js
   const iconMarkup = g.icon?.endsWith('.svg')
     ? `<img src="${g.icon}" class="game-icon-svg" alt="${g.title}" />`
     : `<span class="game-icon-emoji">${g.icon || '🎮'}</span>`;
   ```
