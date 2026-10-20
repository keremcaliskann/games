---
trigger: glob
pattern: "**/src/core/audio*.ts"
description: "Procedural sound effects, Web Audio API synthesis, zero-asset audio architecture, and ambient audio."
---

# Procedural Audio & SFX Policy

## 1. Zero-Asset Audio Philosophy
To eliminate network latency, asset hosting 404s, copyright risks, and bundle bloat, HTML5 game projects must prioritize procedural sound synthesis via the standard browser `AudioContext`.

## 2. Audio Context Management
- Instantiate lazily or resume on first user gesture (`pointerdown`, `keydown`, `touchstart`):
  ```ts
  if (this.ctx && this.ctx.state === 'suspended') {
    this.ctx.resume().catch(() => {});
  }
  ```
- Store volume and mute preferences in `src/platform/storage.ts`.
- Mute automatically when the tab is hidden or backgrounded (`document.visibilityState !== 'visible'`).

## 3. Standard Sound Generator Recipes

| Sound Type | Waveform | Pitch / Envelope Curve | Duration |
|---|---|---|---|
| **Tap / Click** | `sine` | 440 Hz → 660 Hz rapid linear ramp | 0.05s |
| **Bonk / Blocked** | `sawtooth` | 140 Hz → 70 Hz steep drop | 0.12s |
| **Whoosh / Fly** | `sine` | 280 Hz → 880 Hz exponential rise | 0.20s |
| **Laser / Zap** | `sawtooth` | 980 Hz → 120 Hz exponential drop | 0.15s |
| **Coin / Pickup** | `triangle` | Dual tone chime (880 Hz + 1320 Hz) | 0.18s |
| **Level Victory** | `triangle` | Major arpeggio notes (C-E-G-C) staggered by 80ms | 0.40s |
| **Explosion / Hit** | `noise` / `sawtooth` | Low rumble 90 Hz → 30 Hz with rapid gain decay | 0.30s |

## 4. Performance & Memory Invariants
1. **Always disconnect:** Connect `oscillator` → `gainNode` → `ctx.destination`. Call `.stop(t)` and clean up to prevent memory leaks.
2. **Exponential gain decay:** Use `exponentialRampToValueAtTime(0.001, end)` instead of `0` to prevent audible speaker clipping or digital pops.
3. **No allocations in render loop:** Audio calls must only be triggered via events (`EventBus`), never polled inside `update()` or `render()`.
