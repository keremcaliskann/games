export const GAME_CONFIG = {
  // Playfield vertical bounds in meters
  ceilingY: 7.2,
  floorY: -7.2,

  // Player cyber-drone kinematics
  droneStartX: -2.2,
  droneStartY: 0.5,
  droneRadiusM: 0.48,
  gravityMps2: -28.0,
  flapVelocityMps: 9.8,
  maxFallSpeedMps: -15.0,
  maxClimbPitchRad: 0.52,
  maxDivePitchRad: -1.05,
  pitchLerpRate: 12.0,

  // Obstacle laser gates & scrolling
  baseScrollSpeedMps: 6.8,
  maxScrollSpeedMps: 11.2,
  speedIncreasePerScoreMps: 0.12,
  spawnX: 18.0,
  despawnX: -14.0,
  spawnIntervalSec: 1.55,
  minSpawnIntervalSec: 1.05,
  baseGapHeightM: 4.1,
  minGapHeightM: 2.95,
  gapShrinkPerScoreM: 0.03,
  gateWidthM: 1.35,
  gateDepthM: 1.35,
  pillarHeightM: 16.0,
  oscillationUnlockScore: 5,
  oscillationSpeedRadPerSec: 2.2,
  oscillationMaxAmpM: 1.35,
  obstaclePoolSize: 8,
} as const;
