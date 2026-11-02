export interface BotConfig {
  id: string;
  name: string;
  color: string;
  ringColor: string;
}

export interface EvolutionStage {
  stage: number;
  title: string;
  minRadius: number;
  unlockLabel: string;
  accentColor: string;
  accentHex: number;
}

export const GAME_CONFIG = {
  arenaSize: 140, // 140m x 140m bounded city
  matchDurationSec: 90,
  baseHoleRadius: 1.15,
  maxHoleRadius: 7.8,
  baseSpeed: 8.2,
  botSpeedMultiplier: 0.88,
  turboSpeedMultiplier: 1.38,
  magnetRangeMultiplier: 2.8,

  // Evolution Stages for strong progression feedback
  evolutionStages: [
    {
      stage: 1,
      title: 'SOKAK YUTUCU',
      minRadius: 1.15,
      unlockLabel: 'Koniler & Hidrantlar',
      accentColor: '#06b6d4',
      accentHex: 0x06b6d4,
    },
    {
      stage: 2,
      title: 'ARAÇ AVCISI',
      minRadius: 1.65,
      unlockLabel: 'Otomobiller & Ağaçlar',
      accentColor: '#10b981',
      accentHex: 0x10b981,
    },
    {
      stage: 3,
      title: 'BULVAR DEVİ',
      minRadius: 2.45,
      unlockLabel: 'Şehir Otobüsleri',
      accentColor: '#f59e0b',
      accentHex: 0xf59e0b,
    },
    {
      stage: 4,
      title: 'BLOK YIKICI',
      minRadius: 3.6,
      unlockLabel: 'Binalar & Mağazalar',
      accentColor: '#ec4899',
      accentHex: 0xec4899,
    },
    {
      stage: 5,
      title: 'MEGA TEKİLLİK',
      minRadius: 4.9,
      unlockLabel: 'Dev Gökdelenler!',
      accentColor: '#8b5cf6',
      accentHex: 0x8b5cf6,
    },
  ] as EvolutionStage[],

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
