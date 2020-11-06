/* eslint-disable @typescript-eslint/no-explicit-any */
import calculateBonus from "./calculateBonus";
import generateTable from "./generateTable";

import reorder from "./reorder";
import { Orderable, ScoredArtifact, Sets, Slots } from "models";

describe("Process >> Calculate Bonus", () => {
  test("Six same set, basic sets", () => {
    const result = calculateBonus([
      { Set: Sets.Offense },
      { Set: Sets.Offense },
      { Set: Sets.Offense },
      { Set: Sets.Offense },
      { Set: Sets.Offense },
      { Set: Sets.Offense },
    ] as any);

    expect(result).toStrictEqual({
      sets: [Sets.Offense, Sets.Offense, Sets.Offense],
      complete: true,
    });
  });

  test("Six same set, advanced sets", () => {
    const result = calculateBonus([
      { Set: Sets.Lifesteal },
      { Set: Sets.Lifesteal },
      { Set: Sets.Lifesteal },
      { Set: Sets.Lifesteal },
      { Set: Sets.Lifesteal },
      { Set: Sets.Lifesteal },
    ] as any);

    expect(result).toStrictEqual({
      sets: [Sets.Lifesteal],
      complete: false,
    });
  });

  test("Six differents set", () => {
    const result = calculateBonus([
      { Set: Sets.Offense },
      { Set: Sets.Accuracy },
      { Set: Sets.Defense },
      { Set: Sets.Speed },
      { Set: Sets.DivineCriticalRate },
      { Set: Sets.DivineOffense },
    ] as any);

    expect(result).toStrictEqual({
      sets: [],
      complete: false,
    });
  });

  test("4p + 2p", () => {
    const result = calculateBonus([
      { Set: Sets.Speed },
      { Set: Sets.Lifesteal },
      { Set: Sets.Lifesteal },
      { Set: Sets.Speed },
      { Set: Sets.Lifesteal },
      { Set: Sets.Lifesteal },
    ] as any);

    expect(result).toStrictEqual({
      sets: [Sets.Speed, Sets.Lifesteal],
      complete: true,
    });
  });

  test("2p + 2p + 1 + 1", () => {
    const result = calculateBonus([
      { Set: Sets.Speed },
      { Set: Sets.Offense },
      { Set: Sets.Offense },
      { Set: Sets.Speed },
      { Set: Sets.Defense },
      { Set: Sets.CriticalRate },
    ] as any);

    expect(result).toStrictEqual({
      sets: [Sets.Speed, Sets.Offense],
      complete: false,
    });
  });

  test("2p + 2p + 2p", () => {
    const result = calculateBonus([
      { Set: Sets.Speed },
      { Set: Sets.Offense },
      { Set: Sets.Offense },
      { Set: Sets.Speed },
      { Set: Sets.CriticalRate },
      { Set: Sets.CriticalRate },
    ] as any);

    expect(result).toStrictEqual({
      sets: [Sets.Speed, Sets.Offense, Sets.CriticalRate],
      complete: true,
    });
  });

  test("3p + 2p + 1", () => {
    const result = calculateBonus([
      { Set: Sets.Speed },
      { Set: Sets.Offense },
      { Set: Sets.Offense },
      { Set: Sets.Speed },
      { Set: Sets.CriticalRate },
      { Set: Sets.Speed },
    ] as any);

    expect(result).toStrictEqual({
      sets: [Sets.Speed, Sets.Offense],
      complete: false,
    });
  });
});

describe("Process >> Generate Table", () => {
  const ARTIFACTS: ScoredArtifact[] = [
    { Slot: Slots.Weapon, Guid: "W1", score: 1 } as ScoredArtifact,
    { Slot: Slots.Weapon, Guid: "W2", score: 1 } as ScoredArtifact,
    { Slot: Slots.Weapon, Guid: "W3", score: 1 } as ScoredArtifact,

    { Slot: Slots.Helmet, Guid: "H1", score: 1 } as ScoredArtifact,
    { Slot: Slots.Helmet, Guid: "H2", score: 1 } as ScoredArtifact,
    { Slot: Slots.Helmet, Guid: "H3", score: 1 } as ScoredArtifact,

    { Slot: Slots.Shield, Guid: "S1", score: 1 } as ScoredArtifact,
    { Slot: Slots.Shield, Guid: "S1", score: 1 } as ScoredArtifact,
    { Slot: Slots.Shield, Guid: "S3", score: 1 } as ScoredArtifact,

    { Slot: Slots.Gauntlets, Guid: "G1", score: 1 } as ScoredArtifact,
    { Slot: Slots.Gauntlets, Guid: "G2", score: 1 } as ScoredArtifact,
    { Slot: Slots.Gauntlets, Guid: "G3", score: 1 } as ScoredArtifact,

    { Slot: Slots.Chestplate, Guid: "C1", score: 1 } as ScoredArtifact,
    { Slot: Slots.Chestplate, Guid: "C2", score: 1 } as ScoredArtifact,
    { Slot: Slots.Chestplate, Guid: "C3", score: 1 } as ScoredArtifact,

    { Slot: Slots.Boots, Guid: "B1", score: 1 } as ScoredArtifact,
    { Slot: Slots.Boots, Guid: "B2", score: 1 } as ScoredArtifact,
    { Slot: Slots.Boots, Guid: "B3", score: 1 } as ScoredArtifact,
  ];

  test("Generate all combination without accessories", () => {
    const iterator = generateTable(ARTIFACTS);

    const result = Array.from(iterator);

    expect(result.length).toBe(729); // 6 artifact, 3 possibility each : 3^6
    expect(result[0].artifacts.filter((f) => f.Rarity !== -1)).toStrictEqual([
      { Slot: Slots.Weapon, Guid: "W1", score: 1 },
      { Slot: Slots.Helmet, Guid: "H1", score: 1 },
      { Slot: Slots.Shield, Guid: "S1", score: 1 },
      { Slot: Slots.Gauntlets, Guid: "G1", score: 1 },
      { Slot: Slots.Chestplate, Guid: "C1", score: 1 },
      { Slot: Slots.Boots, Guid: "B1", score: 1 },
    ]);

    expect(
      result[result.length - 1].artifacts.filter((f) => f.Rarity !== -1)
    ).toStrictEqual([
      { Slot: Slots.Weapon, Guid: "W3", score: 1 },
      { Slot: Slots.Helmet, Guid: "H3", score: 1 },
      { Slot: Slots.Shield, Guid: "S3", score: 1 },
      { Slot: Slots.Gauntlets, Guid: "G3", score: 1 },
      { Slot: Slots.Chestplate, Guid: "C3", score: 1 },
      { Slot: Slots.Boots, Guid: "B3", score: 1 },
    ]);
  });
});

describe("Process >> Reorder", () => {
  interface JestOrderable extends Orderable {
    key: string;
  }

  const TEST_ARRAY: JestOrderable[] = [
    { key: "A", order: 0 },
    { key: "B", order: 1 },
    { key: "C", order: 2 },
    { key: "D", order: 3 },
    { key: "E", order: 4 },
    { key: "F", order: 5 },
    { key: "G", order: 6 },
    { key: "H", order: 7 },
    { key: "I", order: 8 },
    { key: "J", order: 9 },
  ];

  const TEST_ARRAY_WITH_MISSING: JestOrderable[] = [
    { key: "A", order: 0 },
    { key: "C", order: 2 },
    { key: "E", order: 4 },
    { key: "G", order: 6 },
    { key: "I", order: 8 },
    { key: "J", order: 9 },
  ];

  const TEST_ARRAY_NEGATIVE: JestOrderable[] = [
    { key: "A", order: -1 },
    { key: "B", order: -2 },
    { key: "C", order: 2 },
    { key: "D", order: 3 },
    { key: "E", order: 4 },
    { key: "F", order: 5 },
    { key: "G", order: 6 },
    { key: "H", order: 7 },
    { key: "I", order: 8 },
    { key: "J", order: 9 },
  ];

  const newElement: JestOrderable = { key: "K", order: 99 };
  const existingElement: JestOrderable = { key: "I", order: 8 };

  test("Item at position 0", () => {
    expect(reorder(TEST_ARRAY, newElement, 0)).toStrictEqual([
      { key: "K", order: 0 },
      { key: "A", order: 1 },
      { key: "B", order: 2 },
      { key: "C", order: 3 },
      { key: "D", order: 4 },
      { key: "E", order: 5 },
      { key: "F", order: 6 },
      { key: "G", order: 7 },
      { key: "H", order: 8 },
      { key: "I", order: 9 },
      { key: "J", order: 10 },
    ]);

    expect(reorder(TEST_ARRAY, existingElement, 0)).toStrictEqual([
      { key: "I", order: 0 },
      { key: "A", order: 1 },
      { key: "B", order: 2 },
      { key: "C", order: 3 },
      { key: "D", order: 4 },
      { key: "E", order: 5 },
      { key: "F", order: 6 },
      { key: "G", order: 7 },
      { key: "H", order: 8 },
      { key: "J", order: 9 },
    ]);
  });

  test("Item at position 10", () => {
    expect(reorder(TEST_ARRAY, newElement, 10)).toStrictEqual([
      { key: "A", order: 0 },
      { key: "B", order: 1 },
      { key: "C", order: 2 },
      { key: "D", order: 3 },
      { key: "E", order: 4 },
      { key: "F", order: 5 },
      { key: "G", order: 6 },
      { key: "H", order: 7 },
      { key: "I", order: 8 },
      { key: "J", order: 9 },
      { key: "K", order: 10 },
    ]);

    expect(reorder(TEST_ARRAY, newElement, 99)).toStrictEqual([
      { key: "A", order: 0 },
      { key: "B", order: 1 },
      { key: "C", order: 2 },
      { key: "D", order: 3 },
      { key: "E", order: 4 },
      { key: "F", order: 5 },
      { key: "G", order: 6 },
      { key: "H", order: 7 },
      { key: "I", order: 8 },
      { key: "J", order: 9 },
      { key: "K", order: 10 },
    ]);

    expect(reorder(TEST_ARRAY, existingElement, 10)).toStrictEqual([
      { key: "A", order: 0 },
      { key: "B", order: 1 },
      { key: "C", order: 2 },
      { key: "D", order: 3 },
      { key: "E", order: 4 },
      { key: "F", order: 5 },
      { key: "G", order: 6 },
      { key: "H", order: 7 },
      { key: "J", order: 8 },
      { key: "I", order: 9 },
    ]);
  });

  test("Item at position 5", () => {
    expect(reorder(TEST_ARRAY, newElement, 5)).toStrictEqual([
      { key: "A", order: 0 },
      { key: "B", order: 1 },
      { key: "C", order: 2 },
      { key: "D", order: 3 },
      { key: "E", order: 4 },
      { key: "K", order: 5 },
      { key: "F", order: 6 },
      { key: "G", order: 7 },
      { key: "H", order: 8 },
      { key: "I", order: 9 },
      { key: "J", order: 10 },
    ]);

    expect(reorder(TEST_ARRAY, existingElement, 5)).toStrictEqual([
      { key: "A", order: 0 },
      { key: "B", order: 1 },
      { key: "C", order: 2 },
      { key: "D", order: 3 },
      { key: "E", order: 4 },
      { key: "I", order: 5 },
      { key: "F", order: 6 },
      { key: "G", order: 7 },
      { key: "H", order: 8 },
      { key: "J", order: 9 },
    ]);
  });

  test("Item at position 5 with missing items", () => {
    expect(reorder(TEST_ARRAY_WITH_MISSING, newElement, 5)).toStrictEqual([
      { key: "A", order: 0 },
      { key: "C", order: 1 },
      { key: "E", order: 2 },
      { key: "K", order: 3 },
      { key: "G", order: 4 },
      { key: "I", order: 5 },
      { key: "J", order: 6 },
    ]);

    expect(reorder(TEST_ARRAY_WITH_MISSING, existingElement, 5)).toStrictEqual([
      { key: "A", order: 0 },
      { key: "C", order: 1 },
      { key: "E", order: 2 },
      { key: "I", order: 3 },
      { key: "G", order: 4 },
      { key: "J", order: 5 },
    ]);
  });

  test("Item at position 5 with negative order", () => {
    expect(reorder(TEST_ARRAY_NEGATIVE, newElement, 5)).toStrictEqual([
      { key: "C", order: 0 },
      { key: "D", order: 1 },
      { key: "E", order: 2 },
      { key: "K", order: 3 },
      { key: "F", order: 4 },
      { key: "G", order: 5 },
      { key: "H", order: 6 },
      { key: "I", order: 7 },
      { key: "J", order: 8 },
      { key: "B", order: 9 },
      { key: "A", order: 10 },
    ]);

    expect(reorder(TEST_ARRAY_NEGATIVE, existingElement, 5)).toStrictEqual([
      { key: "C", order: 0 },
      { key: "D", order: 1 },
      { key: "E", order: 2 },
      { key: "I", order: 3 },
      { key: "F", order: 4 },
      { key: "G", order: 5 },
      { key: "H", order: 6 },
      { key: "J", order: 7 },
      { key: "B", order: 8 },
      { key: "A", order: 9 },
    ]);
  });

  test("Item at position 5 with empty array", () => {
    expect(reorder([], newElement, 5)).toStrictEqual([{ key: "K", order: 0 }]);
  });
});
