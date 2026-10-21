export interface ColorDef {
  id: string;
  name: string;
  hex: number;
  css: string;
  emissiveHex: number;
}

export const SCREW_COLORS: Record<string, ColorDef> = {
  gold: {
    id: 'gold',
    name: 'Altın Sarı',
    hex: 0xfacc15,
    css: '#facc15',
    emissiveHex: 0xca8a04,
  },
  blue: {
    id: 'blue',
    name: 'Gök Mavi',
    hex: 0x38bdf8,
    css: '#38bdf8',
    emissiveHex: 0x0284c7,
  },
  pink: {
    id: 'pink',
    name: 'Mercan Pembe',
    hex: 0xf472b6,
    css: '#f472b6',
    emissiveHex: 0xdb2777,
  },
  green: {
    id: 'green',
    name: 'Nane Yeşil',
    hex: 0x34d399,
    css: '#34d399',
    emissiveHex: 0x059669,
  },
  purple: {
    id: 'purple',
    name: 'Lila Mor',
    hex: 0xa78bfa,
    css: '#a78bfa',
    emissiveHex: 0x7c3aed,
  },
  orange: {
    id: 'orange',
    name: 'Turuncu',
    hex: 0xfb923c,
    css: '#fb923c',
    emissiveHex: 0xea580c,
  },
};

export const GAME_CONFIG = {
  initialCoins: 150,
  coinsPerLevel: 50,

  // Screw & Plate Geometry
  screwHeadRadius: 0.28,
  screwShaftLength: 0.65,
  plateThickness: 0.18,

  // Buffer Dock
  defaultBufferSlots: 5,
  maxBufferSlots: 7,

  // Toolbox
  toolboxCapacity: 3,
  activeToolboxCount: 2,

  // Booster Economy
  extraSlotCoinCost: 100,
  magnetCoinCost: 150,
  shatterCoinCost: 120,

  // Camera
  baseCameraDistance: 16,
  minPolarAngle: 0.12,
  maxPolarAngle: Math.PI - 0.12,
};
