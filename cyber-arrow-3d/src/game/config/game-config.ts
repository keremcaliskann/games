import * as THREE from 'three';

export type CardinalDirection = '+X' | '-X' | '+Y' | '-Y' | '+Z' | '-Z';

export const DIRECTION_VECTORS: Record<CardinalDirection, THREE.Vector3> = {
  '+X': new THREE.Vector3(1, 0, 0),
  '-X': new THREE.Vector3(-1, 0, 0),
  '+Y': new THREE.Vector3(0, 1, 0),
  '-Y': new THREE.Vector3(0, -1, 0),
  '+Z': new THREE.Vector3(0, 0, 1),
  '-Z': new THREE.Vector3(0, 0, -1),
};

export const ALL_DIRECTIONS: CardinalDirection[] = ['+X', '-X', '+Y', '-Y', '+Z', '-Z'];

export const DIRECTION_COLORS: Record<CardinalDirection, number> = {
  '+Y': 0xf97316, // Up: Coral Orange
  '-Y': 0x14b8a6, // Down: Teal
  '-X': 0x38bdf8, // Left: Sky Blue
  '+X': 0xfbbf24, // Right: Sunny Gold
  '-Z': 0x10b981, // In: Mint
  '+Z': 0xa855f7, // Out: Lavender
};

export function calculateMoveBudget(totalBlocks: number): number {
  return totalBlocks + Math.max(3, Math.ceil(totalBlocks * 0.35));
}

export interface ThemeColors {
  name: string;
  blockColor: number;
  arrowEmissive: number;
  highlightEmissive: number;
  blockedEmissive: number;
}

export const CYBER_THEMES: Record<string, ThemeColors> = {
  daylightPop: {
    name: 'Daylight Pop',
    blockColor: 0xf8fafc,
    arrowEmissive: 0x0284c7,
    highlightEmissive: 0xf59e0b,
    blockedEmissive: 0xef4444,
  },
  neonCyan: {
    name: 'Daylight Pop',
    blockColor: 0xf8fafc,
    arrowEmissive: 0x0284c7,
    highlightEmissive: 0xf59e0b,
    blockedEmissive: 0xef4444,
  },
  synthwave: {
    name: 'Candy Pastel',
    blockColor: 0xe0f2fe,
    arrowEmissive: 0xec4899,
    highlightEmissive: 0x10b981,
    blockedEmissive: 0xef4444,
  },
};

export const GAME_CONFIG = {
  blockSize: 1.0,
  blockSpacing: 1.15,
  flySpeed: 22,
  bonkDistance: 0.22,
  coinsPerLevel: 25,
  hintCost: 20,
  interstitialIntervalLevels: 3,
};
