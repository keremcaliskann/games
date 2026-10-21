import * as THREE from 'three';
import { ColorDef, SCREW_COLORS } from '../config/game-config';

export interface LevelScrewData {
  id: string;
  color: ColorDef;
  position: THREE.Vector3;
  holdingPlateIds: string[];
}

export interface LevelPlateData {
  id: string;
  color: ColorDef;
  width: number;
  height: number;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  holes: { x: number; y: number }[];
}

export interface LevelData {
  levelNumber: number;
  plates: LevelPlateData[];
  screws: LevelScrewData[];
  toolboxQueue: ColorDef[];
}

export class LevelGenerator {
  public static generateLevel(level: number): LevelData {
    if (level === 1) {
      return this.getLevel1();
    }
    if (level === 2) {
      return this.getLevel2();
    }
    return this.getProceduralLevel(level);
  }

  /**
   * Level 1: Instant 2-second hook.
   * 2 plates pinned together. Top screw directly matches the active Gold box!
   */
  private static getLevel1(): LevelData {
    const gold = SCREW_COLORS.gold;
    const blue = SCREW_COLORS.blue;

    return {
      levelNumber: 1,
      plates: [
        {
          id: 'p1',
          color: gold,
          width: 3.2,
          height: 1.8,
          position: new THREE.Vector3(0, 0.4, 0.2),
          rotation: new THREE.Euler(0, 0, 0),
          holes: [
            { x: -0.9, y: 0 },
            { x: 0.9, y: 0 },
            { x: 0, y: 0.4 },
          ],
        },
        {
          id: 'p2',
          color: blue,
          width: 2.2,
          height: 3.0,
          position: new THREE.Vector3(0, -0.2, -0.2),
          rotation: new THREE.Euler(0, 0, Math.PI / 12),
          holes: [
            { x: 0, y: -0.9 },
            { x: 0, y: 0.9 },
            { x: 0, y: 0 },
          ],
        },
      ],
      screws: [
        {
          id: 's_gold_1',
          color: gold,
          position: new THREE.Vector3(-0.9, 0.4, 0.25),
          holdingPlateIds: ['p1'],
        },
        {
          id: 's_gold_2',
          color: gold,
          position: new THREE.Vector3(0.9, 0.4, 0.25),
          holdingPlateIds: ['p1'],
        },
        {
          id: 's_gold_3',
          color: gold,
          position: new THREE.Vector3(0, 0.8, 0.25),
          holdingPlateIds: ['p1'],
        },
        {
          id: 's_blue_1',
          color: blue,
          position: new THREE.Vector3(-0.2, -1.1, -0.15),
          holdingPlateIds: ['p2'],
        },
        {
          id: 's_blue_2',
          color: blue,
          position: new THREE.Vector3(0.2, 0.7, -0.15),
          holdingPlateIds: ['p2'],
        },
        {
          id: 's_blue_3',
          color: blue,
          position: new THREE.Vector3(0, -0.2, -0.15),
          holdingPlateIds: ['p2'],
        },
      ],
      toolboxQueue: [gold, blue],
    };
  }

  /**
   * Level 2: Introduces Buffer Dock and 3 distinct colors
   */
  private static getLevel2(): LevelData {
    const pink = SCREW_COLORS.pink;
    const green = SCREW_COLORS.green;
    const gold = SCREW_COLORS.gold;

    return {
      levelNumber: 2,
      plates: [
        {
          id: 'p1',
          color: pink,
          width: 3.5,
          height: 1.6,
          position: new THREE.Vector3(-0.4, 0.8, 0.3),
          rotation: new THREE.Euler(0, 0, -0.15),
          holes: [{ x: -1.0, y: 0 }, { x: 0, y: 0 }, { x: 1.0, y: 0 }],
        },
        {
          id: 'p2',
          color: green,
          width: 3.5,
          height: 1.6,
          position: new THREE.Vector3(0.4, -0.4, 0.0),
          rotation: new THREE.Euler(0, 0, 0.15),
          holes: [{ x: -1.0, y: 0 }, { x: 0, y: 0 }, { x: 1.0, y: 0 }],
        },
        {
          id: 'p3',
          color: gold,
          width: 2.4,
          height: 2.8,
          position: new THREE.Vector3(0, 0.2, -0.3),
          rotation: new THREE.Euler(0, 0, 0),
          holes: [{ x: -0.6, y: -0.8 }, { x: 0.6, y: -0.8 }, { x: 0, y: 0.8 }],
        },
      ],
      screws: [
        // Pink screws (p1)
        { id: 's_p1', color: pink, position: new THREE.Vector3(-1.4, 0.95, 0.35), holdingPlateIds: ['p1'] },
        { id: 's_p2', color: pink, position: new THREE.Vector3(-0.4, 0.8, 0.35), holdingPlateIds: ['p1'] },
        { id: 's_p3', color: pink, position: new THREE.Vector3(0.6, 0.65, 0.35), holdingPlateIds: ['p1'] },
        // Green screws (p2)
        { id: 's_g1', color: green, position: new THREE.Vector3(-0.6, -0.55, 0.05), holdingPlateIds: ['p2'] },
        { id: 's_g2', color: green, position: new THREE.Vector3(0.4, -0.4, 0.05), holdingPlateIds: ['p2'] },
        { id: 's_g3', color: green, position: new THREE.Vector3(1.4, -0.25, 0.05), holdingPlateIds: ['p2'] },
        // Gold screws (p3)
        { id: 's_y1', color: gold, position: new THREE.Vector3(-0.6, -0.6, -0.25), holdingPlateIds: ['p3'] },
        { id: 's_y2', color: gold, position: new THREE.Vector3(0.6, -0.6, -0.25), holdingPlateIds: ['p3'] },
        { id: 's_y3', color: gold, position: new THREE.Vector3(0, 1.0, -0.25), holdingPlateIds: ['p3'] },
      ],
      // Queue order: Pink box + Green box open first, Gold box opens next!
      toolboxQueue: [pink, green, gold],
    };
  }

  /**
   * Procedural Level Generator (Level 3+) with 100% mathematical solvability
   */
  private static getProceduralLevel(level: number): LevelData {
    const allColors = [
      SCREW_COLORS.gold,
      SCREW_COLORS.blue,
      SCREW_COLORS.pink,
      SCREW_COLORS.green,
      SCREW_COLORS.purple,
      SCREW_COLORS.orange,
    ];

    const numBoxes = Math.min(6, 3 + Math.floor(level / 2));
    const activeColors = allColors.slice(0, numBoxes);

    const plates: LevelPlateData[] = [];
    const screws: LevelScrewData[] = [];
    const toolboxQueue: ColorDef[] = [];

    // Create 3 to 6 overlapping plates
    for (let i = 0; i < numBoxes; i++) {
      const color = activeColors[i % activeColors.length];
      toolboxQueue.push(color);

      const plateId = `plate_${i}`;
      const angle = (i / numBoxes) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.4;
      const pos = new THREE.Vector3(
        Math.cos(angle) * radius,
        (Math.sin(angle) * radius) + (Math.random() - 0.5) * 0.4,
        (i - numBoxes / 2) * 0.35
      );

      const rot = new THREE.Euler(0, 0, angle * 0.5);
      const holes = [
        { x: -0.9, y: -0.3 },
        { x: 0.9, y: -0.3 },
        { x: 0, y: 0.5 },
      ];

      plates.push({
        id: plateId,
        color,
        width: 2.8 + Math.random() * 0.8,
        height: 1.8 + Math.random() * 0.6,
        position: pos,
        rotation: rot,
        holes,
      });

      // Exactly 3 matching screws for this plate
      for (let s = 0; s < 3; s++) {
        const localHole = holes[s];
        const worldPos = new THREE.Vector3(localHole.x, localHole.y, 0.05);
        worldPos.applyEuler(rot);
        worldPos.add(pos);

        screws.push({
          id: `screw_${i}_${s}`,
          color,
          position: worldPos,
          holdingPlateIds: [plateId],
        });
      }
    }

    return {
      levelNumber: level,
      plates,
      screws,
      toolboxQueue,
    };
  }
}
