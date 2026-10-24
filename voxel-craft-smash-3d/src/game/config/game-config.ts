export interface VoxelBlockConfig {
  type: 'wood' | 'stone' | 'ore' | 'tnt';
  maxHp: number;
  color: string;
  goldReward: number;
  isTnt?: boolean;
}

export const GAME_CONFIG = {
  arenaWidth: 32,
  arenaDepth: 56,
  turretBaseHp: 100,
  baseFireIntervalSec: 0.22, // ~4.5 shots per second
  projectileSpeed: 48,
  projectileRadius: 0.28,

  // Boosters
  boosterDoubleCannonSec: 20,
  boosterMagnetSec: 15,
  tntBarrageCount: 5,
  tntExplosionRadius: 3.8,

  // Voxel Block Specifications
  blockTypes: {
    wood: { type: 'wood', maxHp: 1, color: '#92400e', goldReward: 5 },
    stone: { type: 'stone', maxHp: 2, color: '#64748b', goldReward: 10 },
    ore: { type: 'ore', maxHp: 3, color: '#f59e0b', goldReward: 30 },
    tnt: { type: 'tnt', maxHp: 1, color: '#ef4444', goldReward: 15, isTnt: true },
  } as Record<string, VoxelBlockConfig>,

  // Waves
  totalWaves: 5,
  coinsPerWaveBase: 60,
};
