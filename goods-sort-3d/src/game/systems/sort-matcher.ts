import { Cabinet } from '../entities/cabinet';
import { GoodsItem } from '../entities/goods-item';
import { SoundController } from '../../core/audio';
import { ParticleEffects } from '../../render/effects';

export class SortMatcher {
  constructor(
    private readonly cabinet: Cabinet,
    private readonly audio: SoundController,
    private readonly particles: ParticleEffects
  ) {}

  public checkMatches(onClearedTrio?: (typeId: string) => void): boolean {
    let hadMatch = false;

    // 1. Check all compartments
    for (let t = 0; t < 3; t++) {
      for (let c = 0; c < 3; c++) {
        const frontItems = this.cabinet.getItemsInCompartment(t, c, 0);
        if (frontItems.length === 3) {
          const type0 = frontItems[0].typeId;
          if (frontItems[1].typeId === type0 && frontItems[2].typeId === type0) {
            // Trio Match Found!
            this.clearTrio(frontItems, t, c, false);
            hadMatch = true;
            if (onClearedTrio) onClearedTrio(type0);
          }
        }
      }
    }

    // 2. Check VIP Tray
    if (this.cabinet.isVipTrayActive) {
      const vipItems = this.cabinet.getAllItems().filter((i) => i.isVip);
      if (vipItems.length === 3) {
        const type0 = vipItems[0].typeId;
        if (vipItems[1].typeId === type0 && vipItems[2].typeId === type0) {
          this.clearTrio(vipItems, 0, 0, true);
          hadMatch = true;
          if (onClearedTrio) onClearedTrio(type0);
        }
      }
    }

    return hadMatch;
  }

  private clearTrio(items: GoodsItem[], tier: number, col: number, isVip: boolean): void {
    const centerPos = items[1].mesh.position.clone();

    this.audio.playTrioPop();
    this.particles.spawnPopBurst(centerPos);

    for (const item of items) {
      this.cabinet.removeItem(item);
    }

    if (!isVip) {
      // Uncover rear items in the cleared compartment!
      this.cabinet.uncoverRearItems(tier, col);
    }
  }

  public executeMagicWand(): boolean {
    // Prefer 3 matching front items (layer 0), fallback to all items in cabinet
    for (const onlyFront of [true, false]) {
      const items = onlyFront
        ? this.cabinet.getAllItems().filter((i) => i.layer === 0)
        : this.cabinet.getAllItems();
      const groups = new Map<string, GoodsItem[]>();

      for (const item of items) {
        if (!groups.has(item.typeId)) {
          groups.set(item.typeId, []);
        }
        groups.get(item.typeId)!.push(item);
      }

      for (const [typeId, trio] of groups) {
        if (trio.length >= 3) {
          const selectedTrio = trio.slice(0, 3);
          const centerPos = selectedTrio[0].mesh.position.clone();
          this.audio.playWand();
          this.particles.spawnPopBurst(centerPos, [0xf43f5e, 0x8b5cf6, 0x38bdf8]);

          for (const item of selectedTrio) {
            const t = item.tier;
            const c = item.col;
            this.cabinet.removeItem(item);
            this.cabinet.uncoverRearItems(t, c);
          }
          void typeId;
          return true;
        }
      }
    }

    return false;
  }

  public executeShuffle(): void {
    const frontItems = this.cabinet.getAllItems().filter((i) => i.layer === 0 && !i.isVip);
    if (frontItems.length < 2) return;

    this.audio.playShuffle();

    // Collect all positions
    const slots = frontItems.map((i) => ({
      tier: i.tier,
      col: i.col,
      slotIndex: i.slotIndex,
    }));

    // Shuffle slots
    for (let i = slots.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [slots[i], slots[j]] = [slots[j], slots[i]];
    }

    for (let idx = 0; idx < frontItems.length; idx++) {
      const item = frontItems[idx];
      const slot = slots[idx];
      item.tier = slot.tier;
      item.col = slot.col;
      item.slotIndex = slot.slotIndex;
      const targetPos = this.cabinet.getSlotPos(slot.tier, slot.col, slot.slotIndex, false);
      item.moveTo(targetPos);
    }
  }
}
