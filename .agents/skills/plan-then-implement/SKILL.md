---
name: plan-then-implement
description: Performs systematic analysis, assumption drafting, risk assessment, and implementation planning before writing code for complex, multi-file, or ambiguous tasks. Applies minimal diffs with surgical precision and verifies each step.
---

# Think First, Then Implement

Objective: Prevent scope creep, unnecessary abstractions, and incorrect architectural assumptions **before code is written**.

## Phase 0: Classify the Task

| Classification | Criteria | Action |
|---|---|---|
| **Small** | Single file, unambiguous request, zero architectural risk. | Skip formal plan; implement directly and verify. |
| **Medium** | 2–4 files, clear objective. | Outline a 3–6 line plan in chat; then implement. |
| **Large / Ambiguous** | New game system, architectural change, 4+ files, new dependencies, multiple valid interpretations. | Execute Phases 1–6 below. **Do not write code without explicit user approval.** |

When in doubt, choose the higher classification.

## Phase 1: Context-Efficient Discovery
- Search first (`grep` / file search), then read only the relevant lines.
- **Identify existing patterns:** How are similar systems written in the codebase? New code must strictly adhere to established conventions.
- Map out affected layers (`core` / `render` / `physics` / `input` / `game` / `ui` / `platform`).
- When library APIs are uncertain, verify signatures in `node_modules/**/*.d.ts`.

## Phase 2: Assumptions & Clarification
- Explicitly declare assumptions ("Assumption: ...").
- If ambiguities will materially alter the implementation, ask before coding: maximum 3 questions per message, each paired with your recommended default:
  > "Should projectiles be hitscan or simulated physics bodies? Recommended default: hitscan (computationally lightweight and mobile-safe)."
- If an ambiguity does not alter the core architecture, state your assumption and proceed.
- If multiple approaches exist, compare 2–3 options with tradeoffs and recommend one.

## Phase 3: Implementation Plan (Artifact)

Keep plans concise. Template:

```
## Objective
Single concise sentence.

## Verifiable Acceptance Criteria
- ...

## Non-Goals / Out of Scope
- ...

## Assumptions
- ...

## Affected Files
- src/... — summary of change (single line)

## Step-by-Step Implementation
1. ... → verification: (command or observable outcome)
2. ... → verification: ...

## Risks & Rollback Plan
- Risk: ... / Mitigation: ...
```
Present the plan and **wait for explicit user approval**. Do not write or modify code before approval is granted.

## Phase 4: Surgical Implementation
- Implement step-by-step; verify after each step before moving to the next.
- Touch only planned lines. If unforeseen requirements emerge, **pause and notify the user** rather than expanding scope silently.
- Adhere strictly to the existing code style. Clean up unused imports or variables introduced by your own edits.
- Apply targeted diffs; avoid wholesale file rewrites.

**Surgical Self-Check (after each step):**
- [ ] Does every modified line trace directly to the request?
- [ ] Were unneeded abstractions or configuration toggles avoided?
- [ ] If 200 lines were written, could this be achieved cleanly in 50?

## Phase 5: Verification
1. Run `npm run typecheck` and `npm run build`.
2. Execute automated tests (`npm test`); add tests for new core logic.
3. Verify visual and gameplay changes on the dev server.
4. If hot paths were modified, inspect frame times and `renderer.info.render.calls`.
5. Check applicable items from `references/checklist.md`.

Never report unexecuted verification steps as completed.

## Phase 6: Delivery Summary (Aircraft Maintenance Log Schema, ≤ 6 Lines)
Structure delivery summaries strictly adhering to the ASD-STE100 Aviation Maintenance Log schema:
- **DISCREPANCY:** Exact task or defect addressed.
- **ROOT CAUSE:** Originating file, line, or architectural gap (if bug fix).
- **CORRECTIVE ACTION:** Precise changes applied.
- **PARTS MODIFIED:** List of modified files with line deltas.
- **RETURN TO SERVICE:** Exact verification command and measured outcome.

## Bug Hunting Variant
1. **Reproduce:** Establish the minimal scenario or test demonstrating the issue.
2. **Hypothesize:** Formulate 1–3 potential root causes; validate each with minimal evidence.
3. **Minimal Fix:** Target the root cause directly; avoid masking symptoms.
4. **Regression Guard:** Retain the reproduction test to safeguard against regressions.

## When to Pause and Request Confirmation
- A new npm dependency is required.
- A public API or project file structure changes (e.g., file moves/deletions).
- Edits are required in native directories (`android/`, `ios/`).
- The task request conflicts with the established architecture.
- The implementation footprint expands to more than double the initial estimate.
