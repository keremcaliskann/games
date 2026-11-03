---
trigger: model_decision
description: "Multi-agent studio orchestration (MetaGPT SOP SPEC.json contracts, BMAD domain sharding, ChatDev adversarial QA gate, CrewAI role/model tiering, and parallel subagent execution)."
---

# Multi-Agent Studio Orchestration Policy (`12-multi-agent-orchestration`)

## 1. Core Architectural Patterns (Adapted from Top GitHub Multi-Agent Systems)

All multi-step studio workflows (`/studio`, `/feedback`, `/audit`, `/inspect`, and the single scheduled Studio Executor automation) operate as a **Hierarchical Orchestrator + Specialized Ephemeral Subagents** system combining four proven open-source patterns:

1. **MetaGPT Pattern (`Code = SOP(Team)` — Typed Artifact Handoffs):**
   - Subagents never pass unstructured conversational walls to one another.
   - All inter-agent communication occurs via **structured files on disk** created in `backlog/game-plans/<game-id>/` (during `/design` / `/fikir`) and copied into `<game-name>/`:
     - `STATUS.json` (Lifecycle state: `"draft"` | `"ready"` | `"in_progress"` | `"completed"`)
     - `DESIGN.md` (Unabridged human-readable design, maps, AI behavior, and math brief)
     - `SPEC.json` (Strict machine-readable interface contract between 3D Artist and Gameplay Engineer)
     - `CRITIQUE.md` (4-Filter Adversarial QA verification report)
2. **BMAD-Method Pattern (Domain Sharding & File Ownership Isolation):**
   - Work is sharded by architectural boundary so each subagent loads only 25–30% of rules/files and never overwrites another subagent's files.
   - **Strict File-Lock Rule:** Two write-enabled subagents must **NEVER** edit the same file concurrently.
3. **ChatDev Pattern (Dual-Agent Phase Gates & Adversarial De-Hallucination):**
   - A Builder subagent is **never allowed to sign off on its own build**.
   - An independent `studio-qa-critic` subagent runs `node scripts/sync-shared-core.mjs`, `npm run typecheck`, and `npm run build`, audits hot paths and rule compliance, and enforces a binary Pass/Fix gate.
4. **CrewAI Pattern (Role Specialization & Argon High/Medium Model Hierarchy):**
   - **Zero Flash Policy:** Never spawn subagents with `Model: "flash"` or `"flash_lite"`.
   - **Manager & Critical Tier (Argon High — `Model: "pro"`):** Reserved for the **Lead Orchestrator**, **Systems & Math Architect (`studio-architect`)**, **Adversarial QA Critic (`studio-qa-critic`)**, and critical `P0` root-cause debugging.
   - **Specialist Worker Tier (Argon Medium — `Model: "inherit"`):** Used for domain builders (`studio-3d-artist`, `studio-gameplay-engineer`), parallel batch QA auditors (`/audit`, `game-director-qa-architect`), dual-lens game inspectors (`/inspect`), and market trend scouts (`/trend`).

---

## 2. The 4 Specialist Subagents for `/studio` (`define_subagent`)

When building a new game or executing major upgrades in `/studio`, the Lead Orchestrator defines and invokes four specialized subagents:

| Subagent Name | Model Tier | Role & Responsibility | Write Access | Owned Files / Deliverables |
|---|---|---|---|---|
| **`studio-architect`** | **Argon High** (`Model: "pro"`) | Systems & Math Architect: Translates backlog blueprint into deterministic level/AI math and exact TypeScript module contracts. | `EnableWriteTools: true` | `<game>/DESIGN.md`, `<game>/SPEC.json`, `<game>/package.json`, `<game>/tsconfig.json`, `<game>/vite.config.ts`, `<game>/.gitignore`, `<game>/public/manifest.json` |
| **`studio-3d-artist`** | **Argon Medium** (`Model: "inherit"`) | 3D Technical Artist: Implements Stylized Soft Daylight lighting, camera rig, particle effects, and hybrid/compound procedural 3D prefabs matching `SPEC.json`. | `EnableWriteTools: true` | `<game>/src/render/lighting.ts`, `<game>/src/render/camera-rig.ts`, `<game>/src/render/effects.ts`, `<game>/src/render/PrefabFactory.ts`, `<game>/public/icon.svg`, `<game>/ASSETS_NEEDED.md` |
| **`studio-gameplay-engineer`** | **Argon Medium** (`Model: "inherit"`) | Gameplay, Physics & UI Engineer: Implements 12–20 named AI bots, multi-stage progression, Garage/Upgrade shop, Web Audio, HUD, and 3 Rewarded Ad hooks matching `SPEC.json`. | `EnableWriteTools: true` | `<game>/index.html`, `<game>/src/platform/sdk.ts`, `<game>/src/core/audio.ts`, `<game>/src/input/input-manager.ts`, `<game>/src/game/**`, `<game>/src/ui/hud.ts`, `<game>/src/main.ts` |
| **`studio-qa-critic`** | **Argon High** (`Model: "pro"`) | Adversarial QA Critic: Runs `sync-shared-core.mjs`, `npm install`, `typecheck`, `build`, and 4-Filter Game Director inspection; patches any compiler/rule defects. | `EnableWriteTools: true` | `<game>/CRITIQUE.md` + surgical defect fixes if `typecheck` or 4-Filter audit fails |

> **Parallel Execution Rule:** Once `studio-architect` completes `<game>/SPEC.json` and project config scaffolding, `studio-3d-artist` and `studio-gameplay-engineer` have **100% disjoint file ownership** and may be invoked **in parallel**!

---

## 3. Mandatory `<game-name>/SPEC.json` Contract Schema

`studio-architect` must write `<game-name>/SPEC.json` before `studio-3d-artist` and `studio-gameplay-engineer` start:

```json
{
  "gameId": "example-io-3d",
  "title": "EXAMPLE IO 3D // ARENA ROYALE",
  "category": "io-brawl-battle-royale",
  "themeKey": "example-io-3d",
  "palette": {
    "skyTop": "0xcfe8f7",
    "sunKey": "0xfff6e5",
    "groundBase": "0xfcf8ee",
    "accentPrimary": "#f97316",
    "accentSecondary": "#0ea5e9"
  },
  "cameraSpec": {
    "fovPortrait": 58,
    "fovLandscape": 48,
    "followOffset": [0, 14, 18],
    "lookAhead": [0, 0.8, -4]
  },
  "prefabContract": {
    "className": "PrefabFactory",
    "methods": [
      {
        "name": "createFighterUnit",
        "params": "colorHex: number, skinIndex: number, tier: number",
        "returns": "THREE.Group",
        "notes": "Pivot at min.y = 0, faces -Z, includes named child 'turret' or 'weaponMount'"
      },
      {
        "name": "createArenaStage",
        "params": "biomeIndex: number",
        "returns": "THREE.Group",
        "notes": "3 distinct biomes (0: Sunlit Meadow, 1: Canyon Tropics, 2: Alpine Citadel)"
      }
    ]
  },
  "gameplayContract": {
    "botCount": 14,
    "biomesCount": 3,
    "garageSkinsCount": 6,
    "statUpgrades": ["speed", "power", "magnet"],
    "rewardedAdHooks": [
      "booster_mega_shield",
      "booster_turbo_magnet",
      "revive",
      "victory_multiplier"
    ]
  }
}
```

---

## 4. Parallel Subagent Dispatch Rules for `/feedback`, `/audit`, and `/inspect` (Argon Medium + Argon High Lead)

1. **`/feedback <game-name>` (User Feedback Planning & Adaptation):**
   - Spawn an **Argon Medium** `research` subagent (`Model: "inherit"`) to locate the exact root causes and target files for the user's feedback points, clarify any design options via `ask_question`, and apply surgical fixes or dispatch `studio-3d-artist` / `studio-gameplay-engineer` subagents.
2. **`/audit` & `game-director-qa-architect` (Batch Parallel QA):**
   - Partition active games (`active !== false` in `games.json`) into batches of 3–4 games.
   - Launch parallel `research` subagents on **Argon Medium** (`Model: "inherit"`) — one per batch — to inspect rule compliance, hot-path allocations, gameplay bugs, and visual quality.
   - The **Argon High** Lead Orchestrator aggregates their findings, deduplicates and ranks `P0 > P1 > P2` tickets, and writes `backlog/studio-todo.json`.
3. **`/inspect <game-name>` (Dual-Lens Deep Inspection):**
   - Spawn 2 parallel `research` subagents on **Argon Medium** (`Model: "inherit"`):
     - **Subagent A (`Mechanics & AI Inspector`):** Audits `src/game/`, `src/input/`, `src/main.ts` for P0 bugs (spawn death, AI stuck loops, state latches) and P1 gameplay/progression depth.
     - **Subagent B (`Visual & 3D Art Inspector`):** Audits `src/render/`, `src/ui/`, `index.html` for Soft Daylight compliance, color contrast, `ProceduralMeshBuilder` prefab quality, and HUD ergonomics.
   - The Lead Orchestrator synthesizes both reports into the Turkish **"Yapılması Gerekenler Listesi"** and awaits user approval.
