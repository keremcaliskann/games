---
trigger: glob
globs: "**/src/render/**/*.ts, **/src/ui/**/*.ts, **/index.html"
description: "Mandatory daylight lighting, sunlit environment, vibrant toy-like palettes, and prohibition of dark voids/dark mode."
---

# 32-daylight-and-lighting.md — Daylight Lighting & Sunlit Visual Theme

> **CORE PRINCIPLE:** Revenue-maximized HTML5 3D games on YouTube Playables, Poki, CrazyGames, and Yandex require **immediate visual cheerfulness, high clarity under outdoor sunlight, and irresistible toy-like tactile vibrancy**.
> Dark voids, gloomy navy rooms, black grids, and muddy shadows degrade retention and CTR.
> **Defaulting to dark mode or pitch-black backgrounds is STRICTLY FORBIDDEN across all projects.**

---

## 1. Zero-Tolerance for Dark Voids

Unless a project's `DESIGN.md` explicitly specifies a horror, underground cave, or neon noir setting with user approval, all games **MUST** be designed in a **sunlit daylight environment**.

### Prohibited Patterns
- ❌ Setting `scene.background` to `#000000`, `#0f172a`, `#0b1120`, `#111827`, `#050814`, or any dark navy/black tone.
- ❌ Dark ground bounce in `HemisphereLight` (e.g., `0x1e293b`, `0x0f172a`). This turns all shadowed 3D faces into black mud.
- ❌ Pitch black floor grids, dark metal chassis, or black boundary pillars.
- ❌ Dark mode HUD overlays that obscure the bright 3D world with heavy black tinting.

---

## 2. Daylight Sky & Environment Standards

### 2.1 Scene Background
Always set `scene.background` to a bright, cheerful, high-key sky or studio pastel tone:
```ts
// Approved Daylight Presets:
this.scene.background = new THREE.Color(0xbae6fd); // Vibrant Sky Blue (Default)
// Or:
this.scene.background = new THREE.Color(0xe0f2fe); // Soft Summer Sky
this.scene.background = new THREE.Color(0xf0fdf4); // Clean Mint Daylight
this.scene.background = new THREE.Color(0xf8fafc); // Clean High-Key Studio Porcelain
```

### 2.2 Scene Fog
If fog is enabled for depth, its color must match `scene.background` exactly:
```ts
this.scene.fog = new THREE.FogExp2(0xbae6fd, 0.012);
```

---

## 3. Daylight 3-Point Illumination

Proper 3D daylight requires three distinct light sources: direct sunlight, sky-and-ground bounce, and a soft rim fill.

```ts
export class LightingSetup {
  public static setup(scene: THREE.Scene): {
    hemiLight: THREE.HemisphereLight;
    dirLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
  } {
    // 1. Hemisphere Light (Crisp Sky Blue + Warm Daylight Bounce)
    // CRITICAL: Ground color MUST be bright (warm sand, sunlit concrete, or pastel cream).
    const hemiLight = new THREE.HemisphereLight(
      0xffffff, // Sky color (pure crisp daylight)
      0xfef08a, // Ground bounce (warm sunlight reflection)
      1.5       // High intensity ensures zero muddy/black unlit faces
    );
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    // 2. Main Sun Directional Light (Warm high-contrast sunlight with soft PCF shadows)
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.4);
    dirLight.position.set(16, 28, 18);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 80;
    const d = 16;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);

    // 3. Sky Rim / Fill Light (Soft sky-tinted fill from opposite angle)
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.1);
    rimLight.position.set(-18, 16, -18);
    scene.add(rimLight);

    return { hemiLight, dirLight, rimLight };
  }
}
```

### 3.1 Renderer Tone Mapping
```ts
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25; // Bright, punchy daylight exposure
```

---

## 4. Materials, Grids & Environment Palettes

### 4.1 Boards, Floors & Grids
- **Base Platform:** Frosted porcelain, warm ivory, or clean light birch wood (`0xf8fafc`, `0xf1f5f9`, `0xfef3c7`).
- **Tiles:** Light alternating checkerboard pattern:
  - Tile A: `#ffffff` (Cloud White)
  - Tile B: `#f0f9ff` (Soft Ice Sky) or `#f8fafc` (Slate 50)
  - Tile Borders/Grout: Soft grey `#e2e8f0` (never black lines).

### 4.2 Environmental Props & Obstacles
- Shredders, gates, boundary frames, and pillars must be painted in clean matte white (`0xf8fafc`), light silver (`0xe2e8f0`), or cheerful accent tones. Never raw black metal.

### 4.3 Interactive Entities
Use high-saturation, tactile candy/toy colors:
- **Red:** Crimson Berry (`#ef4444`, accent `#f87171`)
- **Blue:** Azure Pop (`#0284c7`, accent `#38bdf8`)
- **Yellow:** Sunshine Amber (`#f59e0b`, accent `#fbbf24`)
- **Green:** Emerald Mint (`#10b981`, accent `#34d399`)
- **Purple:** Royal Grape (`#8b5cf6`, accent `#a78bfa`)
- Glossiness: `roughness: 0.18`, `metalness: 0.05` for a tactile plastic feel that catches crisp specular sun glints.

---

## 5. Light & Modern HUD Styling

HUD overlays must feel light, premium, and clean, matching the bright 3D stage:
- **Chips & Badges:** Frosted white glass cards:
  ```css
  background: rgba(255, 255, 255, 0.92);
  color: #0f172a;
  border: 1px solid rgba(226, 232, 240, 0.9);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);
  ```
- **Text:** Dark slate `#0f172a` or `#1e293b` for ultra-crisp legibility under bright sunlight.
- **Top / Bottom Bars:** Transparent or soft white gradient (`linear-gradient(180deg, rgba(255,255,255,0.85) 0%, transparent 100%)`).

---

## 6. Pre-Flight Audit Rule

Before committing any game:
1. Verify `scene.background` is $\ge \text{0xbae6fd}$ or light pastel (never dark).
2. Verify `HemisphereLight` ground color is $\ge \text{0xd0d0d0}$ (warm daylight bounce).
3. Verify board/grid meshes do not use dark grey/black materials.
