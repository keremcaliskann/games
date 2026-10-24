export interface BotConfig {
  id: string;
  name: string;
  color: string;
  ringColor: string;
}

export const GAME_CONFIG = {
  arenaSize: 140, // 140m x 140m bounded city
  matchDurationSec: 90,
  baseHoleRadius: 1.15,
  maxHoleRadius: 7.5,
  baseSpeed: 14.5,
  turboSpeedMultiplier: 1.45,
  magnetRangeMultiplier: 2.8,

  // Boosters
  boosterMagnetDurationSec: 12,
  boosterTurboDurationSec: 15,
  boosterSizeSurgeBonus: 0.65,
  reviveOvertimeSec: 25,

  // Currency
  coinsPerFirstPlace: 100,
  coinsPerSecondPlace: 60,
  coinsPerThirdPlace: 40,
  coinsPerParticipation: 20,

  // 7 AI Rivals
  bots: [
    { id: 'bot-1', name: 'ApexNomad', color: '#ef4444', ringColor: '#fca5a5' },
    { id: 'bot-2', name: 'VortexQueen', color: '#a855f7', ringColor: '#d8b4fe' },
    { id: 'bot-3', name: 'CityChomp_99', color: '#f59e0b', ringColor: '#fde68a' },
    { id: 'bot-4', name: 'NeonByte', color: '#10b981', ringColor: '#6ee7b7' },
    { id: 'bot-5', name: 'TurboSink', color: '#3b82f6', ringColor: '#93c5fd' },
    { id: 'bot-6', name: 'PixelPulse', color: '#ec4899', ringColor: '#fbcfe8' },
    { id: 'bot-7', name: 'TitanCrush', color: '#6366f1', ringColor: '#c7d2fe' },
  ] as BotConfig[],

  // Available Skins
  skins: [
    { id: 'skin_default', name: 'Neon Abyss', color: '#06b6d4', ringColor: '#22d3ee', price: 0 },
    { id: 'skin_magma', name: 'Magma Core', color: '#ea580c', ringColor: '#fb923c', price: 150 },
    { id: 'skin_amethyst', name: 'Cyber Violet', color: '#9333ea', ringColor: '#c084fc', price: 250 },
    { id: 'skin_gold', name: 'Golden Singularity', color: '#d97706', ringColor: '#fbbf24', price: 400 },
  ],
};
