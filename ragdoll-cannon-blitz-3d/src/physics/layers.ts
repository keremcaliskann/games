export enum CollisionCategory {
  STATIC_GROUND = 0x0001,
  STRUCTURE = 0x0002,
  TARGET = 0x0004,
  PROJECTILE = 0x0008,
  EXPLOSION_SENSOR = 0x0010,
  SEA_SENSOR = 0x0020,
}

export const INTERACTION_GROUPS = {
  GROUND: (CollisionCategory.STATIC_GROUND << 16) | 0xffff,
  STRUCTURE: (CollisionCategory.STRUCTURE << 16) | 0xffff,
  TARGET: (CollisionCategory.TARGET << 16) | 0xffff,
  PROJECTILE: (CollisionCategory.PROJECTILE << 16) | 0xffff,
};
