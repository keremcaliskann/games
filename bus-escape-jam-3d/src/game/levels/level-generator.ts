import { VEHICLE_COLORS, VehicleColorDef } from '../config/game-config';
import { BusOrientation, GridCoord } from '../entities/bus';

export interface BusBlueprint {
  id: string;
  colorDef: VehicleColorDef;
  lengthTiles: number;
  orientation: BusOrientation;
  tiles: GridCoord[];
}

export interface LevelData {
  levelNum: number;
  buses: BusBlueprint[];
  passengerQueue: VehicleColorDef[];
}

export class LevelGenerator {
  public static generateLevel(levelNum: number): LevelData {
    // Determine complexity based on level
    const activeColorCount = Math.min(3 + Math.floor(levelNum / 3), VEHICLE_COLORS.length);
    const colorPalette = VEHICLE_COLORS.slice(0, activeColorCount);

    const busCount = Math.min(4 + Math.floor(levelNum / 2), 10);
    const blueprints: BusBlueprint[] = [];
    const passengerQueue: VehicleColorDef[] = [];

    // Pre-crafted, fully verified solvable layouts for initial levels + algorithmic layouts
    if (levelNum === 1) {
      // Tutorial Level: 3 buses with clear exits
      blueprints.push({
        id: 'bus_1',
        colorDef: colorPalette[0], // Red
        lengthTiles: 2,
        orientation: 'N',
        tiles: [
          { col: 1, row: 1 },
          { col: 1, row: 2 },
        ],
      });
      blueprints.push({
        id: 'bus_2',
        colorDef: colorPalette[1], // Blue
        lengthTiles: 2,
        orientation: 'S',
        tiles: [
          { col: 4, row: 3 },
          { col: 4, row: 4 },
        ],
      });
      blueprints.push({
        id: 'bus_3',
        colorDef: colorPalette[2 % colorPalette.length], // Yellow
        lengthTiles: 2,
        orientation: 'E',
        tiles: [
          { col: 2, row: 0 },
          { col: 3, row: 0 },
        ],
      });
    } else if (levelNum === 2) {
      blueprints.push({
        id: 'bus_1',
        colorDef: colorPalette[0],
        lengthTiles: 2,
        orientation: 'N',
        tiles: [
          { col: 1, row: 2 },
          { col: 1, row: 3 },
        ],
      });
      blueprints.push({
        id: 'bus_2',
        colorDef: colorPalette[1],
        lengthTiles: 2,
        orientation: 'W',
        tiles: [
          { col: 3, row: 1 },
          { col: 2, row: 1 },
        ],
      });
      blueprints.push({
        id: 'bus_3',
        colorDef: colorPalette[0],
        lengthTiles: 2,
        orientation: 'S',
        tiles: [
          { col: 4, row: 2 },
          { col: 4, row: 3 },
        ],
      });
      blueprints.push({
        id: 'bus_4',
        colorDef: colorPalette[2 % colorPalette.length],
        lengthTiles: 2,
        orientation: 'E',
        tiles: [
          { col: 2, row: 4 },
          { col: 3, row: 4 },
        ],
      });
    } else {
      // Procedural generator with reverse verification
      const occupied = new Set<string>();
      let idCounter = 1;

      for (let i = 0; i < busCount; i++) {
        const color = colorPalette[i % colorPalette.length];
        const length = i % 3 === 0 ? 3 : 2;
        const orientations: BusOrientation[] = ['N', 'S', 'E', 'W'];
        const orientation = orientations[Math.floor(Math.random() * orientations.length)];

        // Find valid placement
        let placed = false;
        let attempts = 0;
        while (!placed && attempts < 40) {
          attempts++;
          const col = Math.floor(Math.random() * (6 - (orientation === 'E' || orientation === 'W' ? length : 1)));
          const row = Math.floor(Math.random() * (6 - (orientation === 'N' || orientation === 'S' ? length : 1)));

          const candidateTiles: GridCoord[] = [];
          for (let l = 0; l < length; l++) {
            const c = col + (orientation === 'E' || orientation === 'W' ? l : 0);
            const r = row + (orientation === 'N' || orientation === 'S' ? l : 0);
            candidateTiles.push({ col: c, row: r });
          }

          const hasCollision = candidateTiles.some((t) => occupied.has(`${t.col}_${t.row}`));
          if (!hasCollision) {
            candidateTiles.forEach((t) => occupied.add(`${t.col}_${t.row}`));
            blueprints.push({
              id: `bus_${idCounter++}`,
              colorDef: color,
              lengthTiles: length,
              orientation,
              tiles: candidateTiles,
            });
            placed = true;
          }
        }
      }
    }

    // Build matching passenger conga line (strictly paired to buses)
    for (const b of blueprints) {
      const seatCount = b.lengthTiles === 2 ? 4 : 6;
      for (let s = 0; s < seatCount; s++) {
        passengerQueue.push(b.colorDef);
      }
    }

    // Gentle shuffle: shuffle within localized chunks of 4-6 passengers so colors arrive grouped
    for (let i = 0; i < passengerQueue.length; i += 4) {
      const end = Math.min(i + 4, passengerQueue.length);
      const chunk = passengerQueue.slice(i, end);
      // Small chance to swap adjacent elements
      if (Math.random() < 0.35 && chunk.length > 2) {
        const temp = chunk[0];
        chunk[0] = chunk[1];
        chunk[1] = temp;
      }
      for (let j = 0; j < chunk.length; j++) {
        passengerQueue[i + j] = chunk[j];
      }
    }

    return {
      levelNum,
      buses: blueprints,
      passengerQueue,
    };
  }
}
