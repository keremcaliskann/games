export interface MarbleColorDef {
  id: string;
  name: string;
  hex: number;
  css: string;
}

export const MARBLE_COLORS: Record<string, MarbleColorDef> = {
  red: { id: 'red', name: 'Ruby Red', hex: 0xef4444, css: '#ef4444' },
  blue: { id: 'blue', name: 'Sapphire Blue', hex: 0x3b82f6, css: '#3b82f6' },
  green: { id: 'green', name: 'Emerald Green', hex: 0x10b981, css: '#10b981' },
  yellow: { id: 'yellow', name: 'Sun Amber', hex: 0xf59e0b, css: '#f59e0b' },
  purple: { id: 'purple', name: 'Royal Purple', hex: 0xa855f7, css: '#a855f7' },
};

export const GAME_CONFIG = {
  conveyor: {
    trackRadiusX: 6.2,
    trackRadiusZ: 3.6,
    defaultSlotCount: 16,
    expandedSlotCount: 22,
    speed: 0.12, // full circuit loops per second
    slotSpacing: 0.8,
  },
  dispenser: {
    maxDisplayMarbles: 5,
    hopperRadius: 0.7,
    hopperHeight: 2.8,
  },
  crate: {
    maxCapacity: 5,
    defaultCapacity: 4,
    width: 1.8,
    length: 1.8,
    height: 1.2,
  },
  economy: {
    coinsPerCrate: 50,
    coinsPerMarble: 10,
    reviveBonusSlots: 4,
  },
};
