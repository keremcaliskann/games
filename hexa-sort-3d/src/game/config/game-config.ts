export interface HexColorDef {
  id: string;
  name: string;
  hex: number;
  css: string;
  darkHex: number;
}

export const HEX_COLORS: HexColorDef[] = [
  { id: 'coral', name: 'Coral', hex: 0xf97316, css: '#f97316', darkHex: 0xc2410c },
  { id: 'teal', name: 'Teal', hex: 0x06b6d4, css: '#06b6d4', darkHex: 0x0e7490 },
  { id: 'amber', name: 'Amber', hex: 0xf59e0b, css: '#f59e0b', darkHex: 0xb45309 },
  { id: 'purple', name: 'Purple', hex: 0xa855f7, css: '#a855f7', darkHex: 0x7e22ce },
  { id: 'mint', name: 'Mint', hex: 0x10b981, css: '#10b981', darkHex: 0x047857 },
  { id: 'rose', name: 'Rose', hex: 0xf43f5e, css: '#f43f5e', darkHex: 0xbe123c },
];

/** Local Y of the center of the tile at `index` inside a stack (tile pivots are centered). */
export function tileLocalY(index: number): number {
  return (index + 0.5) * GAME_CONFIG.hex.height;
}

export const GAME_CONFIG = {
  hex: {
    radius: 0.95,
    height: 0.14,
    spacing: 1.04, // slight spacing multiplier to avoid cell edge overlap
    clearMatchCount: 10, // 10 tiles of identical color trigger pop clear
  },
  board: {
    baseY: 0,
    stackBaseY: 0.12, // top surface of a cell plateau; stacks rest here
    boardRadius: 2,
    foundationColor: 0xfcf8ee,
    cellBorderColor: 0xe2d9c8,
    hoverColor: 0xfef08a,
    activeColor: 0x67e8f9,
  },
  tray: {
    slotCount: 3,
    yPos: 0.2,
    zOffset: 4.8,
  },
  boosterCost: {
    hammer: 100,
    swap: 60,
    move: 80,
  },
  daylight: {
    skyColor: 0xcfe8f7,
    sunColor: 0xfff6e5,
    sunIntensity: 1.25,
    ambientColor: 0xffffff,
    groundBounceColor: 0xe2e8f0,
    hemiIntensity: 0.85,
  },
};
