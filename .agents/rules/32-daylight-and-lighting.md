---
trigger: glob
globs: "**/src/render/**/*.ts, **/src/ui/**/*.ts, **/index.html"
description: "Stylized Toony Soft Daylight Art Direction: warm sun key, soft sky fill, warm biscuit/cream board foundations, tactile candy blocks, zero overexposure/hospital white, and zero dark voids."
---

# 32-daylight-and-lighting.md — Stylized Toony Soft Daylight Art Direction

> **CORE PRINCIPLE:** Revenue-maximized HTML5 3D casual games (YouTube Playables, Poki, CrazyGames, Yandex) require **warm, inviting, soft-lit daylight environments with tactile toy-like charm (inspired by Nintendo / Supercell: Animal Crossing, Mario Wonder, Clash Mini)**.
> Visual extremes ruin retention:
> 1. **Dark Voids:** Pitch-black backgrounds and muddy shadows feel cheap, gloomy, and hostile.
> 2. **Hospital White:** Blown-out 100% white plaster, overexposed direct lights (>2.0), and glaring reflections cause eye fatigue and destroy depth perception.
> 
> **Standard:** Light, bright, and cheerful, but **gentle, warm, soft, and toony**.

---

## 1. The Three Sins of WebGL Lighting

| Sin | Symptom | Correction |
|---|---|---|
| **The Dark Void** | `#000000` / `#0f172a` background, dark ground bounce, black floor grids | Soft pastel daylight sky (`#cfe8f7`), warm ground bounce (`0xf5e6ca`), light board |
| **The Hospital Room** | Blown-out `#ffffff` surfaces, sun light > 2.0, exposure > 1.2 | Sun light `1.2–1.35`, exposure `1.0`, warm biscuit/cream foundations (`0xfcf8ee`) |
| **The Plastic Glare** | `roughness < 0.25`, blinding white specular spots on entities | Matte toy / vinyl finish: `roughness: 0.45–0.55`, `metalness: 0.04` |

---

## 2. Daylight Sky & Atmosphere Presets

### 2.1 Scene Background
Always set `scene.background` to a gentle, soft-tone pastel daylight sky:
```ts
// Approved Stylized Daylight Sky Presets:
this.scene.background = new THREE.Color(0xcfe8f7); // Soft Pastel Cerulean (Default)
// Or:
this.scene.background = new THREE.Color(0xdbeefd); // Soft Baby Blue
this.scene.background = new THREE.Color(0xf0fdf4); // Gentle Sage Mint
this.scene.background = new THREE.Color(0xfef9c3); // Golden Morning Warmth
```

### 2.2 Atmospheric Depth Fog
Always match fog color exactly to `scene.background` to blend horizon smoothly:
```ts
this.scene.fog = new THREE.FogExp2(0xcfe8f7, 0.012);
```

---

## 3. Balanced 3-Point Light Ratios & Tone Mapping

Casual 3D games achieve the soft toony look through **calibrated light ratios** with color temperature contrast (warm key sun vs. cool sky fill vs. warm ground bounce):

```ts
export class LightingSetup {
  public static setup(scene: THREE.Scene): {
    hemiLight: THREE.HemisphereLight;
    dirLight: THREE.DirectionalLight;
    rimLight: THREE.DirectionalLight;
  } {
    // 1. Hemisphere Light (Soft Sky Blue + Warm Biscuit Ground Bounce)
    // CRITICAL: Ground color is a warm biscuit/sand tone to gently lift shadow faces without blowout.
    const hemiLight = new THREE.HemisphereLight(
      0xdbeefd, // Soft cool sky daylight
      0xf5e6ca, // Warm sand / biscuit ground bounce
      0.9       // Balanced intensity (never > 1.1)
    );
    hemiLight.position.set(0, 30, 0);
    scene.add(hemiLight);

    // 2. Main Sun Directional Light (Warm Golden Sunlight with Soft PCF Shadows)
    const dirLight = new THREE.DirectionalLight(0xfff6e5, 1.25);
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
    dirLight.shadow.bias = -0.0003;
    dirLight.shadow.normalBias = 0.02;
    scene.add(dirLight);

    // 3. Subtle Sky Rim / Fill Light (Soft cool contour from opposite sun angle)
    const rimLight = new THREE.DirectionalLight(0xbae6fd, 0.5);
    rimLight.position.set(-18, 16, -18);
    scene.add(rimLight);

    return { hemiLight, dirLight, rimLight };
  }
}
```

### 3.1 Renderer Tone Mapping
```ts
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0; // Clean, natural exposure baseline (never blown-out)
```

---

## 4. Materials, Figure-Ground Hierarchy & Toony Aesthetics

To make gameplay clear and visually satisfying, use clear **Figure-Ground Separation**: the background board must feel warm, grounding, and quiet, allowing colorful interactive entities to pop like candy toys.

### 4.1 Board, Floor & Grid (Ground)
Never use stark `#ffffff` plaster. Use warm, calming, tactile toy-board materials:
- **Base Floating Slab:** Warm biscuit / cream (`0xfcf8ee` or `0xf7f2e7`).
- **Chamfered Outer Rim:** Warm sand / toasted oatmeal (`0xede3cd` or `0xe8dcbf`).
- **Tiles (Alternating Warm Checkerboard):**
  - **Tile A:** Warm buttermilk cream (`0xfdfbf7`).
  - **Tile B:** Soft morning linen / pale sand (`0xf3ede0`).
  - **Tile Grout / Spacers:** Warm soft biscuit (`0xddd3be`).

### 4.2 Interactive Entities (Figure)
Tactile candy/vinyl toy finish (like matte LEGO or Pop Vinyl figurines):
- **Surface Finish:** `roughness: 0.45–0.52`, `metalness: 0.04`. Soft diffused highlights instead of blinding glare.
- **Toony Color Palette:**
  - **Red:** Strawberry Candy (`0xf43f5e`, accent `0xfb7185`)
  - **Blue:** Vibrant Toy Cyan (`0x0ea5e9`, accent `0x7dd3fc`)
  - **Green:** Crisp Mint Apple (`0x10b981`, accent `0x6ee7b7`)
  - **Yellow:** Sunny Amber (`0xf59e0b`, accent `0xfde68a`)
  - **Purple:** Grape Soda (`0xa855f7`, accent `0xd8b4fe`)
  - **Orange:** Sweet Tangerine (`0xf97316`, accent `0xfba365`)

### 4.3 Environmental Machinery & Props (Toy Mechanics)
- **Chassis Body:** Soft warm cream / porcelain toy casing (`0xfaf5ea`), giving props physical weight.
- **Portals / Trim:** Color-matched accent bar matching the target gate/block color.
- **Rollers:** Soft toony steel (`0xdbe3ea`, `roughness: 0.28`, `metalness: 0.65`).
- **Intake / Guide Slits:** Soft slate graphite (`0x475569`, never pitch black).

---

## 5. Clean, Frosted Glass HUD Styling

HUD overlays should feel light, modern, and tactile:
- **Cards & Chips:** Frosted white glass cards (`background: rgba(255, 255, 255, 0.92); border: 1px solid rgba(226, 232, 240, 0.9); box-shadow: 0 4px 14px rgba(0,0,0,0.06);`).
- **Typography:** Dark slate (`#0f172a` / `#1e293b`) for effortless legibility under daylight.
- **Header Gradient:** Soft subtle fade (`linear-gradient(180deg, rgba(255,255,255,0.85) 0%, transparent 100%)`).

---

## 6. Pre-Flight Visual Audit Checklist

Before committing or releasing any game:
1. [ ] **No Dark Voids:** `scene.background` is $\ge \text{0xcfe8f7}$ soft pastel daylight.
2. [ ] **No Hospital Glare:** Sun light intensity $\le 1.4$, hemisphere intensity $\le 1.0$, tone mapping exposure $= 1.0$.
3. [ ] **Figure-Ground Separation:** Board and floor use warm biscuit/cream tones (`0xfcf8ee`), never stark `#ffffff`.
4. [ ] **Tactile Matte Finish:** Entity materials use `roughness: 0.45–0.55` (no blown-out specular highlights).
5. [ ] **Warm Ground Bounce:** Hemisphere light ground color is warm biscuit/sand (`0xf5e6ca`).
