export const GAME_CONFIG = {
  cannon: {
    yawRange: 0.8, // Radians left/right
    pitchMin: 0.05,
    pitchMax: 0.85,
    recoilDistance: 0.6,
    recoilSpeed: 12.0,
    shotPower: 34.0,
  },
  projectiles: {
    standard: {
      mass: 8.0,
      radius: 0.45,
      color: 0x334155,
      impactImpulse: 25.0,
    },
    cluster: {
      mass: 6.0,
      radius: 0.4,
      color: 0xf97316,
      subMunitions: 5,
    },
    megaLaser: {
      mass: 28.0,
      radius: 0.8,
      color: 0x6366f1,
      impactImpulse: 90.0,
    },
  },
  explosions: {
    tntRadius: 6.5,
    tntImpulse: 55.0,
    clusterRadius: 4.5,
    clusterImpulse: 35.0,
  },
  seaKillY: -1.0,
  winDelaySeconds: 1.8,
};
