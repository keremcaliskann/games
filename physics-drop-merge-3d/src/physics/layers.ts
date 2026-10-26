export enum CollisionCategory {
  CONTAINER = 0x0001,
  SPHERE = 0x0002,
  BOMB = 0x0004,
  SENSOR = 0x0008,
}

export const INTERACTION_GROUPS = {
  CONTAINER: (CollisionCategory.CONTAINER << 16) | 0xffff,
  SPHERE: (CollisionCategory.SPHERE << 16) | 0xffff,
  BOMB: (CollisionCategory.BOMB << 16) | 0xffff,
};
