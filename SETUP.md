# Antigravity HTML5 Game Development Rules & Skill Set

Designed for high-performance 3D HTML5 game projects powered by Vite + Three.js + Rapier.js (Wasm) + Capacitor.

## Directory Structure

```
Games/                                        # Workspace root (shared rules & skills)
├── AGENTS.md                                 # Core guidelines (always active)
├── SETUP.md                                  # Setup instructions & documentation
├── index.html                                # Central arcade portal (https://keremcaliskann.github.io/games/)
├── games.json                                # Game registry and metadata
├── .agents/
│   ├── rules/                                # Rule files
│   │   ├── 10-code-quality.md                # glob: **/src/**/*.ts
│   │   ├── 20-performance-budget.md          # model_decision
│   │   ├── 30-three-render.md                # glob: **/src/render/**
│   │   ├── 35-procedural-audio.md            # glob: **/src/core/audio*.ts
│   │   ├── 40-rapier-physics.md              # glob: **/src/physics/**
│   │   ├── 50-input-abstraction.md           # glob: **/src/input/**, **/src/ui/**
│   │   ├── 60-mobile-capacitor.md           # model_decision
│   │   ├── 65-monetization-ads.md            # model_decision
│   │   ├── 68-pwa-and-meta.md                # model_decision
│   │   ├── 70-token-context.md               # model_decision
│   │   ├── 80-dependencies-and-git.md        # model_decision
│   │   └── 90-release-checklist.md           # manual: @90-release-checklist
│   └── skills/
│       ├── html5-game-development/           # Core skill + references/
│       ├── game-performance-audit/
│       ├── capacitor-mobile-port/
│       ├── plan-then-implement/
│       └── games-portal-catalog/
│
├── project-alpha/                            # Game Project 1 (Independent Git Repo)
│   ├── .git/
│   ├── package.json
│   └── src/
└── project-beta/                             # Game Project 2 (Independent Git Repo)
    ├── .git/
    ├── package.json
    └── src/
```

## Setup & Workflow

1. Keep `AGENTS.md` and the `.agents/` folder in the root directory.
2. In Antigravity / Gemini Code Assist, verify:
   - **Customizations → Rules**: Verify that the 12 rules appear.
   - **Customizations → Skills**: Verify that the 5 skills appear.
3. To trigger a skill manually, use slash commands (e.g., `/html5-game-development`). Skills are also auto-invoked based on their descriptions.
4. Each game project lives in its own subdirectory and has its own Git repository. Once features in a project reach a stable state, commit and push them to their remote repository.

## Rule Trigger Modes

| Mode | Behavior | In This Set |
|---|---|---|
| `always_on` | Full content is loaded into every session | `AGENTS.md` |
| `glob` | Loaded when editing matching files | `10`, `30`, `40`, `50` |
| `model_decision` | Loaded dynamically when query context matches description | `20`, `60`, `70`, `80` |
| `manual` | Loaded only when explicitly invoked via `@` | `90` |

### Important Notes:
- The `trigger` field must be formatted in **snake_case** (`always_on`, `model_decision`, `glob`, `manual`).
- Individual rule files should stay below 24 KB.
- Globs use `**/src/**` patterns to ensure they apply cleanly across all subprojects.
