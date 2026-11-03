---
name: design
description: >-
  Interactive step-by-step Game Idea Architect & Blueprint Generator. Takes a simple
  game idea from the user, conducts market research, guides the user through a multi-turn
  structured Q&A (using ask_question), and saves a complete build-ready specification
  (backlog/blueprints/<game-id>/DESIGN.md + SPEC.json + ideas-backlog.json Rank #1).
  Use when the user types /design, /fikir, or wants to plan/design a new game idea interactively.
metadata:
  icon: architecture
---

# /design (`/fikir`) — Interactive Game Blueprint & Spec Architect

Transforms a rough 1-sentence game idea into a **100% deterministic, build-ready 3D game blueprint** through structured market research and a step-by-step interactive Q&A interview (`ask_question`).

> **STRICT INTERACTIVE PROTOCOL (ZERO PREMATURE CODING):**
> Do **NOT** write game source code during `/design`. Guide the user turn-by-turn with `ask_question`, refine every mechanic together, and save the finalized blueprint files (`backlog/blueprints/<game-id>/DESIGN.md` and `SPEC.json`) so that when the user later says **"Bu oyunu geliştir"** or runs `/studio`, every single detail is already locked in.

---

## Interactive 4-Turn Workflow

### Turn 1: Idea Intake, Quick Market Research & Round 1 Questions (Core Loop, Controls & Camera)
1. **Quick Reference Scan (`search_web`):**
   - Search top-performing similar 3D games on YouTube Playables, CrazyGames, Poki, and Yandex Games to identify proven hooks, camera angles, and feel.
2. **Present a 3-Line Research Snapshot (in Turkish):**
   - State the proposed `<game-id>` slug, title, and 2–3 key inspirations.
3. **Ask Round 1 Questions via `ask_question` (Max 3 Questions):**
   Always put the best-fitting option first, prefixed with `(Önerilen)`:
   - **Q1 — Temel Oynanış & Kontrol Yapısı:** How does the player control and interact in the core loop? (e.g., Camera-relative joystick + auto-attack, Direct steering + drift/boost button, Drag-and-aim ballistic release).
   - **Q2 — Kamera Perspektifi:** Which 3D camera angle fits best? (e.g., Dynamic chase TPS camera, Elevated 45° isometric arena camera, 360° spherical orbit camera).
   - **Q3 — Oyun Modu & Rakip Yapısı:** What is the match structure? (e.g., 12–16 AI Bot Battle Royale, 3-Round Elimination Tournament, Stage-by-Stage Expedition / Time-Attack with AI rivals).

*Wait for the user's answers before proceeding to Turn 2.*

---

### Turn 2: Round 2 Questions (Maps/Biomes, Progression & 3D Visual Style)
Based on Turn 1 answers, call `ask_question` with 3 questions:
- **Q1 — Harita & Biyom Çeşitliliği (En Az 3 Harita/Etap):** Propose 3 tailored map/biome sets with distinct obstacles/hazards (e.g., Set A: Güneşli Kanyon + Buzul Köprü + Volkanik Krater, etc.).
- **Q2 — Gelişim Hissiyatı & Mağaza (Garage / Upgrade Sistemi):** How does the player grow stronger during a match and between matches? (e.g., In-match tier evolution + 3 persistent stat upgrades + 6 unlockable 3D skins/vehicles).
- **Q3 — 3D Görsel Stil & Atmosfer (Soft Daylight Uyumu):** Which visual theme and `ProceduralMeshBuilder` prefab focus should we use? (e.g., Toy-grade offroad/military matte vinyl, Vibrant arcade racing liveries, Stylized fantasy/voxel bastions).

*Wait for the user's answers before proceeding to Turn 3.*

---

### Turn 3: Round 3 Questions (Special Mechanics, Difficulty & Revenue Hooks)
Call `ask_question` with 2–3 final refinement questions:
- **Q1 — Özel Silah / Yetenek / Fizik Mekaniği:** Which signature mechanic makes the game stand out? (e.g., Homing rockets + shockwave mines, Hydraulic winch + cargo balance, Brick stealing + turbo dash).
- **Q2 — Zorluk Eğrisi (`Kolay / Normal / Zor`) & Hız Dengesi:** How should pacing and bot AI aggression scale across the Start Menu difficulty selector?
- **Q3 — Oyun İçi Kurtarıcı Güçlendiriciler (Boosters):** Which 2–3 bottom-bar boosters and Near-Miss Revive mechanic should be wired?

*Wait for the user's answers before proceeding to Turn 4.*

---

### Turn 4: Save Build-Ready Blueprint Files (`DESIGN.md` + `SPEC.json` + `ideas-backlog.json`)

Once the user answers Turn 3, synthesize all decisions into **three persistent files on disk**:

1. **`backlog/blueprints/<game-id>/DESIGN.md`:**
   Complete Game Design Document containing:
   - **1. Oyun Kimliği & Temel Döngü (Core Loop & 2-Second Hook)**
   - **2. Kontroller, Kamera Ergonomisi (9:16 & 16:9) & Başlangıç Menüsü (`Kolay / Normal / Zor`)**
   - **3. Haritalar / Biyomlar (3+ Farklı Harita & Dinamik Engeller)**
   - **4. Yapay Zeka Bot Davranışı (12–20 Bot, Takılma Önleyici Fizik & Kişilikler)**
   - **5. Gelişim Hissiyatı, Garaj (6+ Görünüm) & İstatistik Yükseltmeleri**
   - **6. 3D Prefab & Soft Daylight Görsel Tasarım (`ASSETS_NEEDED.md` Eşleşmesi)**
   - **7. 3 Zorunlu Ödüllü Reklam Kancası (Boosters, Near-Miss Revive, Victory Multiplier)**

2. **`backlog/blueprints/<game-id>/SPEC.json`:**
   Strict MetaGPT machine-readable contract (`12-multi-agent-orchestration.md`) containing:
   - `gameId`, `title`, `category`, `themeKey`
   - `palette` (`skyTop`, `sunKey`, `groundBase`, `accentPrimary`, `accentSecondary`)
   - `cameraSpec` (`fovPortrait`, `fovLandscape`, `followOffset`, `lookAhead`)
   - `prefabContract` (exact `PrefabFactory` methods, parameters, return types, child node names)
   - `gameplayContract` (`botCount`, `biomes`, `garageSkins`, `statUpgrades`, `difficultyMultipliers`, `rewardedAdHooks`)
   - `fileArchitecture` (list of exact files to be generated in `src/game/`, `src/render/`, `src/ui/`)

3. **Promote to Rank #1 in `backlog/ideas-backlog.json`:**
   - Insert or update `<game-id>` in `backlog/ideas-backlog.json` with:
     - `"status": "ready"`
     - `"rank": 1`
     - `"revenueScore": 99`
     - `"userDesigned": true`
     - `"blueprintPath": "backlog/blueprints/<game-id>/"`
   - Re-index remaining `ready` items (`2..N`).

4. **Confirm to User in Turkish:**
   - Provide clickable links to [`backlog/blueprints/<game-id>/DESIGN.md`](file:///c:/Users/kerem/Desktop/Games/backlog/blueprints/) and [`backlog/blueprints/<game-id>/SPEC.json`](file:///c:/Users/kerem/Desktop/Games/backlog/blueprints/).
   - Remind the user that whenever they say **"`<game-id>` oyununu geliştir"** or run **`/studio`**, the 4-Subagent Studio Squad will build this exact specification verbatim.
