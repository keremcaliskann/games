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

export interface ThemeColors {
  name: string;
  blockColor: number;
  arrowEmissive: number;
  highlightEmissive: number;
  blockedEmissive: number;
}

export const CYBER_THEMES: Record<string, ThemeColors> = {
  neonCyan: {
    name: 'Neon Cyan',
    blockColor: 0x141b2d,
    arrowEmissive: 0x00f0ff,
    highlightEmissive: 0x39ff14,
    blockedEmissive: 0xff0055,
  },
  synthwave: {
    name: 'Synthwave Sunset',
    blockColor: 0x24112e,
    arrowEmissive: 0xff0077,
    highlightEmissive: 0xffe600,
    blockedEmissive: 0xff2200,
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
