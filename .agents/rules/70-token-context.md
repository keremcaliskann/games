---
trigger: model_decision
description: "Large file reads, long tasks, terminal output management, multi-file refactoring, context window, and token efficiency."
---

# Token & Context Efficiency

## Reading Strategy
- Sequence: **Search → Narrow Down → Read**. Use `grep` or file search first, then inspect only the relevant line range.
- Avoid reading entire files unless performing a complete rewrite.
- Never re-read unchanged files within the same session.
- To inspect project structure, read `package.json`, `tsconfig.json`, and the first 2 levels of the `src/` tree rather than opening every file.

## Excluded Files (Do Not Read in Context)
Never load into context: `node_modules/`, `dist/`, `android/`, `ios/`, `*.glb`, large `*.gltf`, `*.ktx2`, `*.wasm`, images, `package-lock.json`, or `.map` files. Summarize their existence or metadata using shell commands (`ls -la`, `wc -c`) if needed.

## Terminal & Log Output
- Truncate command outputs: append `| tail -n 40`, `| head -n 40`, or use `--silent`.
- When builds and tests pass, report only success. On failure, extract only relevant compiler error messages.
- Launch long-running services (e.g., dev servers, watch tasks) in the background without polling continuously.

## Code Editing
- Apply surgical, localized edits; do not rewrite entire files for minor adjustments.
- Do not duplicate newly written code or large diffs in chat responses; state what was modified and why.

## Task Planning
- Keep Implementation Plan artifacts focused: clear objective, verifiable criteria, file list, and numbered steps.
- On multi-stage tasks, provide 3–5 line progress checkpoints between major milestones.

## ASD-STE100 & Aircraft Maintenance Log Protocol
To maximize context efficiency and eliminate AI conversational fluff:
- **Maximum 20 words per sentence.** Write concise, direct statements.
- **Imperative voice only:** Use action verbs directly ("Run X", "Edit Y", never "I have updated...").
- **Zero conversational padding:** Eliminate introductory pleasantries, speculative commentary, and unsolicited advice.
- **Aircraft Maintenance Log Delivery Schema:** Structure delivery summaries and bug reports strictly as follows:
  - **DISCREPANCY:** Exact issue, defect, or requested task.
  - **ROOT CAUSE:** Originating file, line, or logic gap (if bug fix).
  - **CORRECTIVE ACTION:** Precise changes applied.
  - **PARTS MODIFIED:** List of changed files with line delta.
  - **RETURN TO SERVICE:** Exact verification command and measured outcome.

## Subagent Model Tiering & Context Isolation
- **Default to Lightweight Models:** When spawning subagents (`invoke_subagent`), set `Model: "flash"` or `"flash_lite"` for research, auditing, or code scanning tasks. Reserve flagship models (`inherit` / `"pro"`) exclusively for complex architectural decisions.
- **Context Isolation:** Subagents run in isolated scratchpads. They must return concise structured summaries (≤ 25 lines) via `send_message`, preventing raw multi-turn traces from polluting parent context.
- **Ephemeral Lifecycle:** Terminate (`kill`) finished subagents immediately to release system resources.

## Prompt Caching & Rule Hygiene
- Keep global instruction files (`AGENTS.md`) under 150 lines.
- Preserve prompt cache prefixes: keep static rules and tool schemas unchanged during an active task.
- Use `/compact` when a multi-step task completes to compress dialogue history and recover context budget.

## Delivery Summary (≤ 6 Lines)
Follow the Aircraft Maintenance Log schema above. Never reprint large diffs or re-explain unchanged systems.
