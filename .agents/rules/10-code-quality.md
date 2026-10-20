---
trigger: glob
globs: "**/src/**/*.ts, **/src/**/*.js, **/vite.config.*, **/capacitor.config.*"
description: "TypeScript/JS clean code, naming conventions, module boundaries, English comments, and hot-path rules."
---

# Code Quality

## Language & Type Safety
- TypeScript in `strict` mode. Never use `any`; use `unknown` with type narrowing for external data.
- Prefer `@ts-expect-error` with an explanatory comment over `@ts-ignore`. Avoid both whenever possible.
- Specify explicit return types for public/exported functions; rely on inference for local variables.
- Use `as const` objects with union types instead of TypeScript `enum` (bundle and `isolatedModules` friendly).

## Module Boundaries & Architecture
- Layering direction: `core` ← `render` / `physics` / `input` / `platform` ← `game` ← `ui`. Sublayers never import upper layers.
- `render` and `physics` must never import each other; the bridge is established in `game/entities`.
- No circular dependencies. Export module boundaries cleanly via `index.ts`.
- Avoid global mutable state. Pass dependencies via constructor injection (no heavy DI frameworks).

## Sizing & Readability
- Keep functions under ~40 lines and files under ~300 lines as a guideline.
- Single responsibility principle. Use early returns to keep nested `if` indentation ≤ 3.
- If a function takes more than 3 parameters, combine them into an `options` object.
- No magic numbers: define named constants in `src/game/config/`. Suffix units in variable names: `speedMps`, `timeoutMs`, `angleRad`.

## Naming Conventions
| Category | Format | Examples |
|---|---|---|
| Class / Type / Interface | `PascalCase` | `PlayerController`, `InputState` |
| Function / Variable | `camelCase` | `calculateDamage`, `elapsedTime` |
| Constant | `UPPER_SNAKE_CASE` | `MAX_PARTICLES`, `GRAVITY` |
| File / Directory | `kebab-case.ts` | `game-loop.ts`, `physics-world.ts` |
| Boolean | `is*`, `has*`, `can*` | `isGrounded`, `hasAmmo`, `canJump` |

## Hot Path Rules (update / fixedUpdate / render)
Code running every frame must **strictly avoid**:
- Dynamic allocations: `new` (`Vector3`, `Quaternion`, arrays, objects).
- Closures and inline callbacks: `map`, `filter`, `forEach`, `reduce`.
- Object spreads (`...`) and dynamic string concatenation.
- `Object.keys()`, `Object.entries()`, and heavy `try/catch` inside loops.
**Instead, use**: module-level scratch instances (`const _v = new THREE.Vector3()`), plain `for` loops, and object pools (`Pool<T>`).

## Error Handling
- Never use empty `catch {}` blocks. Handle the error or let it propagate.
- Confine `try/catch` to boundaries: asset loading, platform plugins, and storage persistence.
- Use DEV-only assertions for game invariants; fail gracefully with safe defaults in production.

## Resource Lifecycle
- Any class managing GPU (Three.js geometries, materials, textures) or Wasm (Rapier colliders, bodies) resources must expose a `dispose()` method.
- Any class that registers event listeners must clean them up in `dispose()`.

## Comments & Logging
- All code comments and documentation must be in **English**.
- Comments must explain **"why"** a decision was made, not repeat what the code obviously does.
- Never commit `console.log`. Use `src/core/logger.ts` guarded by `import.meta.env.DEV`.
- Do not leave commented-out code in the repository.

## Testing
- Write unit tests for pure game logic (damage equations, cooldowns, RNG tables, state machines).
- Numerical smoke tests are sufficient for physics and rendering integration.
