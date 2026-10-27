export interface VehicleColorDef {
  id: string;
  name: string;
  hex: number;
  secondaryHex: number;
  emoji: string;
}

export const VEHICLE_COLORS: VehicleColorDef[] = [
  { id: 'red', name: 'Ruby', hex: 0xef4444, secondaryHex: 0xb91c1c, emoji: '🔴' },
  { id: 'blue', name: 'Sapphire', hex: 0x3b82f6, secondaryHex: 0x1d4ed8, emoji: '🔵' },
  { id: 'yellow', name: 'Amber', hex: 0xf59e0b, secondaryHex: 0xd97706, emoji: '🟡' },
  { id: 'green', name: 'Emerald', hex: 0x10b981, secondaryHex: 0x047857, emoji: '🟢' },
  { id: 'purple', name: 'Amethyst', hex: 0xa855f7, secondaryHex: 0x7e22ce, emoji: '🟣' },
  { id: 'orange', name: 'Coral', hex: 0xf97316, secondaryHex: 0xc2410c, emoji: '🟠' },
];

export const GAME_CONFIG = {
  grid: {
    cols: 6,
    rows: 6,
    tileSize: 1.6,
  },
  bays: {
    defaultCount: 3,
    maxVipCount: 4,
    spacing: 2.8,
  },
  economy: {
    coinsPerBus: 25,
    coinsPerLevel: 100,
    vipBayCost: 80,
    shuffleCost: 50,
  },
  visuals: {
    skyColor: 0xcfe8f7,
    groundColor: 0xfcf8ee,
    lotBorderColor: 0xe2e8f0,
  },
};
