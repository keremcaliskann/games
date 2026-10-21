export interface ColorDef {
  id: string;
  name: string;
  hex: number;
  css: string;
  accentHex: number;
}

export const BLOCK_COLORS: Record<string, ColorDef> = {
  red: {
    id: 'red',
    name: 'Crimson Red',
    hex: 0xef4444,
    css: '#ef4444',
    accentHex: 0xfca5a5,
  },
  blue: {
    id: 'blue',
    name: 'Cobalt Blue',
    hex: 0x3b82f6,
    css: '#3b82f6',
    accentHex: 0x93c5fd,
  },
  green: {
    id: 'green',
    name: 'Emerald Green',
    hex: 0x22c55e,
    css: '#22c55e',
    accentHex: 0x86efac,
  },
  yellow: {
    id: 'yellow',
    name: 'Amber Yellow',
    hex: 0xeab308,
    css: '#eab308',
    accentHex: 0xfde047,
  },
  purple: {
    id: 'purple',
    name: 'Royal Purple',
    hex: 0xa855f7,
    css: '#a855f7',
    accentHex: 0xd8b4fe,
  },
  orange: {
    id: 'orange',
    name: 'Vivid Orange',
    hex: 0xf97316,
    css: '#f97316',
    accentHex: 0xfdba74,
  },
};

export const COLOR_KEYS = Object.keys(BLOCK_COLORS);

export const GAME_CONFIG = {
  cellSize: 1.4,
  boardMargin: 0.1,
  coinsPerLevel: 50,
  hammerCost: 100,
  extraMovesCost: 75,
  reviveMoves: 5,
  defaultParMoves: 16,
  nearMissThreshold: 2,
};
