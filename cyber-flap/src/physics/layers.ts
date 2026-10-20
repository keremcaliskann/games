export const CollisionGroup = {
  DRONE: 1 << 0,
  OBSTACLE: 1 << 1,
  SCORE_SENSOR: 1 << 2,
  BOUNDARY: 1 << 3,
} as const;

export function makeInteractionGroups(membership: number, filter: number): number {
  return ((membership & 0xffff) << 16) | (filter & 0xffff);
}

export const ColliderFilter = {
  DRONE: makeInteractionGroups(
    CollisionGroup.DRONE,
    CollisionGroup.OBSTACLE | CollisionGroup.SCORE_SENSOR | CollisionGroup.BOUNDARY,
  ),
  OBSTACLE: makeInteractionGroups(CollisionGroup.OBSTACLE, CollisionGroup.DRONE),
  SCORE_SENSOR: makeInteractionGroups(CollisionGroup.SCORE_SENSOR, CollisionGroup.DRONE),
  BOUNDARY: makeInteractionGroups(CollisionGroup.BOUNDARY, CollisionGroup.DRONE),
} as const;

export const ColliderTag = {
  Drone: 1,
  Obstacle: 2,
  ScoreSensor: 3,
  Boundary: 4,
} as const;

export type ColliderTagType = (typeof ColliderTag)[keyof typeof ColliderTag];
