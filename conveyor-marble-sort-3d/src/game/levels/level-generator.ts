export interface CrateSpec {
  id: string;
  colorId: string;
  capacity: number;
}

export interface DispenserSpec {
  id: string;
  colorId: string;
  count: number;
}

export interface LevelData {
  levelNumber: number;
  dispensers: DispenserSpec[];
  crates: CrateSpec[];
  totalMarbles: number;
}

const COLOR_TIERS: string[][] = [
  ['red', 'blue'],
  ['red', 'blue', 'green'],
  ['red', 'blue', 'green', 'yellow'],
  ['red', 'blue', 'green', 'yellow', 'purple'],
];

export class LevelGenerator {
  public static generateLevel(levelNumber: number): LevelData {
    const tierIndex = Math.min(Math.floor((levelNumber - 1) / 2), COLOR_TIERS.length - 1);
    const availableColors = COLOR_TIERS[tierIndex];

    const crateCount = Math.min(2 + Math.floor(levelNumber / 2), 6);
    const defaultCapacity = 4;

    const crates: CrateSpec[] = [];
    const colorCounts: Record<string, number> = {};

    for (let i = 0; i < availableColors.length; i++) {
      colorCounts[availableColors[i]] = 0;
    }

    // Generate crates
    for (let i = 0; i < crateCount; i++) {
      const colorId = availableColors[i % availableColors.length];
      const capacity = defaultCapacity;
      crates.push({
        id: `crate_${levelNumber}_${i}`,
        colorId,
        capacity,
      });
      colorCounts[colorId] = (colorCounts[colorId] || 0) + capacity;
    }

    // Generate dispenser specs matching total color demand exactly
    const dispensers: DispenserSpec[] = [];
    for (let i = 0; i < availableColors.length; i++) {
      const colorId = availableColors[i];
      const count = colorCounts[colorId];
      if (count > 0) {
        dispensers.push({
          id: `disp_${colorId}`,
          colorId,
          count,
        });
      }
    }

    const totalMarbles = Object.values(colorCounts).reduce((a, b) => a + b, 0);

    return {
      levelNumber,
      dispensers,
      crates,
      totalMarbles,
    };
  }
}
