export interface BlockSpec {
  pos: [number, number, number];
  size: [number, number, number]; // [halfX, halfY, halfZ]
  material: 'wood' | 'stone' | 'ice';
  mass?: number;
}

export interface TntSpec {
  pos: [number, number, number];
}

export interface TargetSpec {
  pos: [number, number, number];
}

export interface LevelDefinition {
  id: number;
  name: string;
  parAmmo: number;
  blocks: BlockSpec[];
  tnt: TntSpec[];
  targets: TargetSpec[];
}

export const LEVELS: LevelDefinition[] = [
  // Level 1: Beginner Watchtower
  {
    id: 1,
    name: 'Island Outpost',
    parAmmo: 3,
    blocks: [
      { pos: [-1.8, 2.8, -4], size: [0.4, 1.2, 0.4], material: 'wood' },
      { pos: [1.8, 2.8, -4], size: [0.4, 1.2, 0.4], material: 'wood' },
      { pos: [0, 4.2, -4], size: [2.6, 0.3, 0.8], material: 'wood' },
      { pos: [-1.2, 5.6, -4], size: [0.4, 1.0, 0.4], material: 'wood' },
      { pos: [1.2, 5.6, -4], size: [0.4, 1.0, 0.4], material: 'wood' },
      { pos: [0, 6.8, -4], size: [1.8, 0.3, 0.8], material: 'wood' },
    ],
    tnt: [{ pos: [0, 2.5, -4] }],
    targets: [{ pos: [0, 7.2, -4] }],
  },

  // Level 2: Twin Towers
  {
    id: 2,
    name: 'Twin Bastions',
    parAmmo: 3,
    blocks: [
      // Left Tower
      { pos: [-3.0, 2.8, -4], size: [0.45, 1.2, 0.45], material: 'stone' },
      { pos: [-1.5, 2.8, -4], size: [0.45, 1.2, 0.45], material: 'wood' },
      { pos: [-2.25, 4.3, -4], size: [1.4, 0.3, 0.8], material: 'wood' },

      // Right Tower
      { pos: [1.5, 2.8, -4], size: [0.45, 1.2, 0.45], material: 'wood' },
      { pos: [3.0, 2.8, -4], size: [0.45, 1.2, 0.45], material: 'stone' },
      { pos: [2.25, 4.3, -4], size: [1.4, 0.3, 0.8], material: 'wood' },

      // Connecting Bridge
      { pos: [0, 4.3, -4], size: [1.2, 0.25, 0.6], material: 'wood' },
    ],
    tnt: [{ pos: [0, 2.5, -4] }],
    targets: [
      { pos: [-2.25, 4.8, -4] },
      { pos: [2.25, 4.8, -4] },
    ],
  },

  // Level 3: Powder Keg Citadel
  {
    id: 3,
    name: 'Powder Keg Citadel',
    parAmmo: 4,
    blocks: [
      // Base layer
      { pos: [-2.5, 2.6, -4], size: [0.5, 1.0, 0.5], material: 'wood' },
      { pos: [2.5, 2.6, -4], size: [0.5, 1.0, 0.5], material: 'wood' },
      { pos: [0, 3.8, -4], size: [3.2, 0.3, 0.9], material: 'stone' },

      // Middle layer
      { pos: [-1.4, 5.0, -4], size: [0.4, 1.0, 0.4], material: 'wood' },
      { pos: [1.4, 5.0, -4], size: [0.4, 1.0, 0.4], material: 'wood' },
      { pos: [0, 6.2, -4], size: [2.0, 0.3, 0.8], material: 'wood' },

      // Top spire
      { pos: [0, 7.4, -4], size: [0.4, 1.0, 0.4], material: 'wood' },
    ],
    tnt: [
      { pos: [-1.2, 2.5, -4] },
      { pos: [1.2, 2.5, -4] },
    ],
    targets: [
      { pos: [-2.5, 4.2, -4] },
      { pos: [2.5, 4.2, -4] },
      { pos: [0, 8.4, -4] },
    ],
  },

  // Level 4: Fortified Ramparts
  {
    id: 4,
    name: 'Fortified Ramparts',
    parAmmo: 4,
    blocks: [
      // Heavy stone foundation
      { pos: [-3.2, 2.8, -3], size: [0.6, 1.2, 0.6], material: 'stone' },
      { pos: [3.2, 2.8, -3], size: [0.6, 1.2, 0.6], material: 'stone' },
      { pos: [-1.2, 2.8, -5], size: [0.5, 1.2, 0.5], material: 'stone' },
      { pos: [1.2, 2.8, -5], size: [0.5, 1.2, 0.5], material: 'stone' },

      // Massive beam
      { pos: [0, 4.3, -4], size: [4.0, 0.35, 1.6], material: 'wood' },

      // Upper tier
      { pos: [-2.0, 5.7, -4], size: [0.4, 1.1, 0.4], material: 'wood' },
      { pos: [2.0, 5.7, -4], size: [0.4, 1.1, 0.4], material: 'wood' },
      { pos: [0, 7.0, -4], size: [2.6, 0.3, 0.8], material: 'wood' },
    ],
    tnt: [
      { pos: [0, 2.5, -4] },
      { pos: [0, 4.8, -4] },
    ],
    targets: [
      { pos: [-2.6, 4.8, -4] },
      { pos: [2.6, 4.8, -4] },
      { pos: [0, 7.5, -4] },
    ],
  },

  // Level 5: High Keep
  {
    id: 5,
    name: 'The Grand Keep',
    parAmmo: 5,
    blocks: [
      // Base pillars
      { pos: [-3.5, 2.8, -4], size: [0.5, 1.2, 0.5], material: 'wood' },
      { pos: [-1.2, 2.8, -4], size: [0.5, 1.2, 0.5], material: 'wood' },
      { pos: [1.2, 2.8, -4], size: [0.5, 1.2, 0.5], material: 'wood' },
      { pos: [3.5, 2.8, -4], size: [0.5, 1.2, 0.5], material: 'wood' },
      { pos: [0, 4.3, -4], size: [4.5, 0.35, 1.2], material: 'stone' },

      // Second tier
      { pos: [-2.2, 5.8, -4], size: [0.45, 1.2, 0.45], material: 'wood' },
      { pos: [2.2, 5.8, -4], size: [0.45, 1.2, 0.45], material: 'wood' },
      { pos: [0, 7.3, -4], size: [3.0, 0.3, 1.0], material: 'wood' },

      // Third tier spire
      { pos: [0, 8.8, -4], size: [0.4, 1.2, 0.4], material: 'wood' },
      { pos: [0, 10.3, -4], size: [1.2, 0.25, 0.8], material: 'wood' },
    ],
    tnt: [
      { pos: [-2.4, 2.5, -4] },
      { pos: [2.4, 2.5, -4] },
      { pos: [0, 7.8, -4] },
    ],
    targets: [
      { pos: [-3.0, 4.8, -4] },
      { pos: [3.0, 4.8, -4] },
      { pos: [-1.2, 7.8, -4] },
      { pos: [0, 10.8, -4] },
    ],
  },
];
