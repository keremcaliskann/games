# ARCHER DUEL 3D // RAGDOLL SHOWDOWN (`ragdoll-archers-duel-3d`) — Game Design Document

## 1. Core Loop & 2-Second Hook
- **Genre:** Casual 3D Physics Ballistic Archery Duel (`casual-fps-physics`).
- **2-Second Hook:** Within 2 seconds of `ytgame.game.gameReady()`, the player's stylized stickman archer stands perched on a sunlit floating cream-stone bastion facing 1–3 rival archers across the sky canyon. Touching and dragging anywhere on the stage pulls the composite bowstring, projecting a live glowing dotted trajectory arc and tension meter; releasing fires a high-velocity physics arrow.
- **Hit Zones & Ragdoll Knockback:**
  - **Headshot (3x Crit / 100 DMG):** Instant helmet pop, golden "HEADSHOT! 3x" floating callout, slow-mo camera punch, and hilarious ragdoll launch off the bastion into the sunlit clouds/sea below.
  - **Torso Hit (50 DMG):** Articulates upper body backward with pinned arrow shaft and knockback impulse.
  - **Limb Hit (30 DMG):** Staggers enemy aim cooldown and spins limb joints.
  - **Flying Apple Target:** Red & Golden apples bob on balloon/propeller mounts between bastions. Shooting an apple restores +40 HP and awards +25 bonus coins.

## 2. 100% Solvable Ballistic Math & AI Fairness
- **Deterministic Trajectory Equation:**
  $$\mathbf{P}(t) = \mathbf{P}_0 + \mathbf{V}_0 t + \frac{1}{2} \mathbf{G} t^2$$
  where $\mathbf{G} = (w_x, -18.5, 0)$ includes subtle level wind $w_x \in [-2.5, 2.5]$. The first 45% of the flight path is rendered via 14 pooled trajectory preview spheres during bow draw so the player always has deterministic visual feedback.
- **Calibrated Enemy AI:**
  - Enemy archers use inverse ballistic solver $\theta = \text{atan2}(\Delta y + \frac{1}{2} g T^2, \Delta x)$ with a calibrated angular jitter $\pm \sigma_{\text{level}}$ (starting at $\pm 9^\circ$ on Level 1, tightening gradually) and a visible reload charge ring (2.8s–3.6s), guaranteeing that attentive players can always land first-strike headshots.

## 3. Three Mandatory Rewarded Ad Revenue Hooks (`65-monetization-ads`)
1. **In-Level Rescue Boosters (Bottom Action Bar):**
   - **Triple Split Arrow (`booster_triple`):** Fires a 3-arrow fan spread (`-8°`, `0°`, `+8°`) on the next shot (Cost: 80 Coins or Watch Ad).
   - **Piercing Laser Arrow (`booster_pierce`):** Fires a zero-gravity hyper-velocity golden laser bolt that penetrates shields and guarantees a 1-hit KO (Cost: 100 Coins or Watch Ad).
   - **Guardian Shield (`booster_shield`):** Surrounds the player archer in a translucent golden energy dome that absorbs the next 2 enemy arrow hits (Cost: 90 Coins or Watch Ad).
2. **Near-Miss Revive Modal (`revive`):**
   - When the player's health reaches 0 during a duel, displays the Near-Miss Modal: *"Defeated in Duel! Watch Ad to Revive with Full Health + Free Piercing Shot!"*
3. **Victory Multiplier Needle Bar (`victory_multiplier`):**
   - Upon clearing all enemy archers in a wave, an oscillating `1.5x -> 2x -> 3x -> 5x` multiplier needle allows claiming multiplied Coin payouts via a single Rewarded Ad tap.

## 4. Camera Ergonomics & Stylized Toony Soft Daylight Art Direction
- **Camera Framing:** Elevated 3/4 side-isometric duel camera (`y = 6.5..9.5`, `z = 18..28`, dynamically zoomed via aspect ratio) keeping the player bastion on the left (`x = -6.5`), flying apples in the center, and tiered enemy bastions on the right (`x = +4.5 .. +9.5`) 100% visible in both **9:16 portrait** and **16:9 landscape** with zero bottom HUD occlusion.
- **Palette:**
  - Sky Background: Soft Pastel Daylight (`0xcfe8f7`)
  - Key Sunlight: Warm Golden Sun (`0xfff6e5`, intensity `1.25`)
  - Bastion Architecture: Warm Biscuit/Cream Stone (`0xfcf8ee`) with Terracotta trim (`0xf97316`)
  - Player Archer: Royal Azure Vinyl (`0x2563eb`) with Golden Bow (`0xf59e0b`)
  - Enemy Archers: Coral Crimson (`0xef4444`), Royal Purple (`0x9333ea`), Amber Boss (`0xd97706`)
