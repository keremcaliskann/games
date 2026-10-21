# SCREW JAM 3D // HYPER UNBOLT — Game Design Specification

> Status: Approved Architecture Specification (Phase 1: Studio Designer Squad)  
> Target Platforms: YouTube Playables (`ytgame`), Yandex Games, CrazyGames, Poki, GitHub Pages  
> Bundle Budget: < 5 MB | Performance Target: 60 FPS (Zero runtime GC allocations)  
> Art Direction: Stylized Toony Soft Daylight (Rule 32)

---

## 1. Executive Summary & 2-Second Hook

- **Genre:** 3D Spatial Jam / Pin-Unscrew ASMR Puzzle.
- **Premise:** A multi-layered sculpture made of translucent, colorful acrylic plates is locked together by color-coded metallic screws. Tapping an exposed screw unscrews it with an ASMR haptic spin and flies it into a matching 3-capacity toolbox. When all holding screws are removed, the plate drops with realistic physics gravity.
- **Instant 2-Second Hook:** The very first frame shows an exposed Golden Screw immediately above an open Gold Toolbox. A single tap instantly unscrews it with a tactile rattle, flies it into the box with a satisfying chime, and drops the outer plate within 2 seconds of loading.
- **Buffer Hole Mechanic:** If an unscrewed screw doesn't match any currently open active toolbox, it parks in the **5-slot Buffer Dock**. If the dock fills to 5/5 with no matching box, a **Near-Miss Revive Hook** is triggered.

---

## 2. Deterministic Solvable Level Math

- **Reverse-Assembly Generation:**
  1. Generate plates in hierarchical layers (Layer 0 = Core, Layer 1 = Mid, Layer 2 = Outer).
  2. Drill aligned holes between adjacent plates.
  3. Insert screws working from outside inwards.
  4. Toolboxes are spawned dynamically to match screw colors in reverse-dependency order.
  5. The generator runs a forward simulation verifying that with a 5-slot buffer dock, the level can always be cleared without deadlocking.

---

## 3. 3 Mandatory YouTube Playables Revenue Hooks (`65-monetization-ads.md`)

### Hook 1: In-Level Tactical Boosters
- **Extra Buffer Slot:** Adds a temporary 6th/7th slot to the dock (via `showRewarded('booster_extra_slot')` or 120 Coins).
- **Magnet Unbolt:** Instantly extracts up to 3 accessible screws that match the active toolbox (via `showRewarded('booster_magnet')`).
- **Plate Shatter:** Breaks one blocking plate and ejects its non-load-bearing screws (via `showRewarded('booster_shatter')`).

### Hook 2: Near-Miss Revive Modal
- **Trigger:** When all 5 dock holes are filled with non-matching screws and no moves can clear them.
- **Offer:** *"Buffer Full! Watch video to unlock an Extra Toolbox & Clear 2 Screws"* via `showRewarded('near_miss_revive')`.
- **Fallout:** If skipped, triggers Game Over with standard 90s-cooldown interstitial.

### Hook 3: Oscillating Victory Multiplier Needle Bar
- **Trigger:** When all plates are detached and all screws are cleared.
- **Mechanic:** A continuous sinusoidal needle sweeps across `[1.5x, 2x, 3x, 5x]`. Tapping the green claim button triggers `showRewarded('victory_multiplier')` granting `coins * multiplier`.

---

## 4. 3D Camera & Visual Ergonomics

- **Unobstructed Orbit:** Spherical orbit camera (`radius: 14–18`, `minPhi: 0.1`, `maxPhi: Math.PI - 0.1`) allowing seamless 360° inspection from any angle.
- **Zero Pedestal Occlusion:** The assembly floats freely in the soft pastel sky (`0xcfe8f7`). No decorative ground cylinders or opaque platforms block underside viewing.
- **Dual-Mode Framing:**
  - **9:16 Portrait:** Base camera distance scales smoothly to keep all plates within horizontal safety margins.
  - **16:9 Landscape:** Centers the assembly with side UI docks.

---

## 5. Compound Procedural 3D Prefabs & Hot-Swap (`ASSETS_NEEDED.md`)

- **Screw Mesh:** LatheGeometry threaded cylindrical shaft + beveled hexagonal head with embossed cross slot. Soft metallic vinyl finish (`roughness: 0.35, metalness: 0.65`).
- **Plate Mesh:** ExtrudeGeometry rounded rectangular / polygon shapes with drilled circular holes. Frosted translucent finish (`roughness: 0.25, transmission/opacity: 0.88`).
- **Toolbox:** Multi-part hinged container with 3 socket indentations and glowing indicator lights.
- **Hot-Swap:** Checks `public/models/screwdriver_tool.glb` and `public/models/screw_head.glb` if provided.
