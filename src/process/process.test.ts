/* eslint-disable @typescript-eslint/no-explicit-any */
import type { IArtifact, IOrderable, IScoredArtifact } from "../models";

import calculateBonus from "./calculateBonus";
import calculateScoreRealStats from "./calculateScoreRealStats";
import calculateScoreTheoricalStats from "./calculateScoreTheoricalStats";
import generateTable from "./generateTable";
import generateTheoricalArtifact from "./generateTheoricalArtifact";
import reorder from "./reorder";

describe("Process >> Calculate Bonus", () => {
  test("Six same set, basic sets", () => {
    const result = calculateBonus([
      { Set: "Offense" },
      { Set: "Offense" },
      { Set: "Offense" },
      { Set: "Offense" },
      { Set: "Offense" },
      { Set: "Offense" },
    ] as any);

    expect(result).toStrictEqual({
      complete: true,
      sets: ["Offense", "Offense", "Offense"],
    });
  });

  test("Six same set, advanced sets", () => {
    const result = calculateBonus([
      { Set: "Lifesteal" },
      { Set: "Lifesteal" },
      { Set: "Lifesteal" },
      { Set: "Lifesteal" },
      { Set: "Lifesteal" },
      { Set: "Lifesteal" },
    ] as any);

    expect(result).toStrictEqual({
      complete: false,
      sets: ["Lifesteal"],
    });
  });

  test("Six differents set", () => {
    const result = calculateBonus([
      { Set: "Offense" },
      { Set: "Accuracy" },
      { Set: "Defense" },
      { Set: "Speed" },
      { Set: "DivineCriticalRate" },
      { Set: "DivineOffense" },
    ] as any);

    expect(result).toStrictEqual({
      complete: false,
      sets: [],
    });
  });

  test("4p + 2p", () => {
    const result = calculateBonus([
      { Set: "Speed" },
      { Set: "Lifesteal" },
      { Set: "Lifesteal" },
      { Set: "Speed" },
      { Set: "Lifesteal" },
      { Set: "Lifesteal" },
    ] as any);

    expect(result).toStrictEqual({
      complete: true,
      sets: ["Speed", "Lifesteal"],
    });
  });

  test("2p + 2p + 1 + 1", () => {
    const result = calculateBonus([
      { Set: "Speed" },
      { Set: "Offense" },
      { Set: "Offense" },
      { Set: "Speed" },
      { Set: "Defense" },
      { Set: "CriticalRate" },
    ] as any);

    expect(result).toStrictEqual({
      complete: false,
      sets: ["Speed", "Offense"],
    });
  });

  test("2p + 2p + 2p", () => {
    const result = calculateBonus([
      { Set: "Speed" },
      { Set: "Offense" },
      { Set: "Offense" },
      { Set: "Speed" },
      { Set: "CriticalRate" },
      { Set: "CriticalRate" },
    ] as any);

    expect(result).toStrictEqual({
      complete: true,
      sets: ["Speed", "Offense", "CriticalRate"],
    });
  });

  test("3p + 2p + 1", () => {
    const result = calculateBonus([
      { Set: "Speed" },
      { Set: "Offense" },
      { Set: "Offense" },
      { Set: "Speed" },
      { Set: "CriticalRate" },
      { Set: "Speed" },
    ] as any);

    expect(result).toStrictEqual({
      complete: false,
      sets: ["Speed", "Offense"],
    });
  });
});

describe("Process >> Calculate Stats", () => {
  const SixStarHPArtifact = {
    Level: 16,
    Quality: 6,
    MainStats: "HP",
    MainStatsValue: 4080,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarAttackArtifact = {
    Level: 16,
    Quality: 6,
    MainStats: "ATK",
    MainStatsValue: 265,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarDefPercentArtifact = {
    Level: 16,
    Quality: 6,
    MainStats: "DEF%",
    MainStatsValue: 60,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarCDmgArtifact = {
    Level: 16,
    Quality: 6,
    MainStats: "C.DMG",
    MainStatsValue: 80,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarResistArtifact = {
    Level: 16,
    Quality: 6,
    MainStats: "RESI",
    MainStatsValue: 96,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarSpeedArtifact = {
    Level: 16,
    Quality: 6,
    MainStats: "SPD",
    MainStatsValue: 45,
    SubStats: [] as any,
  } as IArtifact;

  const FiveStarHPArtifact = {
    Level: 16,
    Quality: 5,
    MainStats: "HP",
    MainStatsValue: 3480,
    SubStats: [] as any,
  } as IArtifact;

  const FiveStarHPArtifactWithSubStat = {
    Level: 16,
    Quality: 5,
    MainStats: "HP",
    MainStatsValue: 3480,
    SubStats: [{ Stats: "SPD", Value: 40, Roll: 0, Rune: 0 }] as any,
  } as IArtifact;

  const SixStarHPArtifactLvl1 = {
    Level: 1,
    Quality: 6,
    MainStats: "HP",
    MainStatsValue: 1,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarAttackArtifactLvl1 = {
    Level: 1,
    Quality: 6,
    MainStats: "ATK",
    MainStatsValue: 1,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarDefPercentArtifactLvl1 = {
    Level: 1,
    Quality: 6,
    MainStats: "DEF%",
    MainStatsValue: 1,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarCDmgArtifactLvl1 = {
    Level: 1,
    Quality: 6,
    MainStats: "C.DMG",
    MainStatsValue: 1,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarResistArtifactLvl1 = {
    Level: 1,
    Quality: 6,
    MainStats: "RESI",
    MainStatsValue: 1,
    SubStats: [] as any,
  } as IArtifact;

  const SixStarSpeedArtifactLvl1 = {
    Level: 1,
    Quality: 6,
    MainStats: "SPD",
    MainStatsValue: 1,
    SubStats: [] as any,
  } as IArtifact;

  const FiveStarHPArtifactLvl1 = {
    Level: 1,
    Quality: 5,
    MainStats: "HP",
    MainStatsValue: 1,
    SubStats: [] as any,
  } as IArtifact;

  const FiveStarHPArtifactWithSubStatLvl1 = {
    Level: 1,
    Quality: 5,
    MainStats: "HP",
    MainStatsValue: 1,
    SubStats: [
      { Stats: "SPD", Value: 40, Roll: 1, Rune: 0 },
      { Stats: "SPD", Value: 60, Roll: 2, Rune: 0 },
    ] as any,
  } as IArtifact;

  test("Real Stats Power calculation", () => {
    const hp = calculateScoreRealStats(SixStarHPArtifact);
    const atk = calculateScoreRealStats(SixStarAttackArtifact);
    const defp = calculateScoreRealStats(SixStarDefPercentArtifact);
    const cmdg = calculateScoreRealStats(SixStarCDmgArtifact);
    const resist = calculateScoreRealStats(SixStarResistArtifact);
    const spd = calculateScoreRealStats(SixStarSpeedArtifact);

    const hpFive = calculateScoreRealStats(FiveStarHPArtifact);
    const hpFiveSubstat = calculateScoreRealStats(
      FiveStarHPArtifactWithSubStat
    );

    expect(hp).toBe(0.2 * 120);
    expect(atk).toBe(0.2 * 120);
    expect(defp).toBe(120);
    expect(cmdg).toBe(120);
    expect(resist).toBe(120);
    expect(spd).toBe(120);

    expect(hpFive).toBe(0.2 * 100);
    expect(hpFiveSubstat).toBe(100 * 0.2 + 100);
  });

  test("Theorical Stats Power calculation", () => {
    const hp = calculateScoreTheoricalStats(SixStarHPArtifactLvl1);
    const atk = calculateScoreTheoricalStats(SixStarAttackArtifactLvl1);
    const defp = calculateScoreTheoricalStats(SixStarDefPercentArtifactLvl1);
    const cmdg = calculateScoreTheoricalStats(SixStarCDmgArtifactLvl1);
    const resist = calculateScoreTheoricalStats(SixStarResistArtifactLvl1);
    const spd = calculateScoreTheoricalStats(SixStarSpeedArtifactLvl1);

    const hpFive = calculateScoreTheoricalStats(FiveStarHPArtifactLvl1);
    const hpFiveSubstat = calculateScoreTheoricalStats(
      FiveStarHPArtifactWithSubStatLvl1
    );

    const hpFiveSubstatVerification = calculateScoreRealStats({
      Level: 16,
      Quality: 5,
      MainStats: "HP",
      MainStatsValue: 3480,
      SubStats: [
        { Stats: "SPD", Value: 0, Roll: 0, Rune: 0 },
        { Stats: "SPD", Value: 113.4, Roll: 0, Rune: 0 }, // 113.4 is the average of 40+60, 40+80 and 60+60
      ] as any,
    } as IArtifact);

    expect(hp).toBe(0.2 * 120);
    expect(atk).toBe(0.2 * 120);
    expect(defp).toBe(120);
    expect(cmdg).toBe(120);
    expect(resist).toBe(120);
    expect(spd).toBe(120);

    expect(hpFive).toBe(0.2 * 100);
    expect(hpFiveSubstat).toBe(hpFiveSubstatVerification);
  });
});

describe("Process >> Generate Theorical Artifact", () => {
  const FiveStarHPArtifactWithSubStatLvl1 = {
    Level: 1,
    Quality: 5,
    MainStats: "HP",
    MainStatsValue: 1,
    SubStats: [
      { Stats: "SPD", Value: 40, Roll: 1, Rune: 0 },
      { Stats: "SPD", Value: 60, Roll: 2, Rune: 0 },
    ] as any,
  } as IArtifact;

  test("Generate", () => {
    const hpFiveSubstat = generateTheoricalArtifact(
      FiveStarHPArtifactWithSubStatLvl1
    );

    const hpFiveSubstatVerification = {
      Level: 1,
      Quality: 5,
      MainStats: "HP",
      MainStatsValue: 3480,
      SubStats: [
        { Stats: "SPD", Value: 140 / 3, Roll: 4 / 3, Rune: 0 },
        { Stats: "SPD", Value: 200 / 3, Roll: 7 / 3, Rune: 0 },
      ] as any,
    } as IArtifact;

    expect(hpFiveSubstat).toMatchObject(hpFiveSubstatVerification);
  });
});

describe("Process >> Generate Table", () => {
  const ARTIFACTS: IScoredArtifact[] = [
    { Slot: "Weapon", Guid: "W1", score: 1 } as IScoredArtifact,
    { Slot: "Weapon", Guid: "W2", score: 1 } as IScoredArtifact,
    { Slot: "Weapon", Guid: "W3", score: 1 } as IScoredArtifact,

    { Slot: "Helmet", Guid: "H1", score: 1 } as IScoredArtifact,
    { Slot: "Helmet", Guid: "H2", score: 1 } as IScoredArtifact,
    { Slot: "Helmet", Guid: "H3", score: 1 } as IScoredArtifact,

    { Slot: "Shield", Guid: "S1", score: 1 } as IScoredArtifact,
    { Slot: "Shield", Guid: "S1", score: 1 } as IScoredArtifact,
    { Slot: "Shield", Guid: "S3", score: 1 } as IScoredArtifact,

    { Slot: "Gauntlets", Guid: "G1", score: 1 } as IScoredArtifact,
    { Slot: "Gauntlets", Guid: "G2", score: 1 } as IScoredArtifact,
    { Slot: "Gauntlets", Guid: "G3", score: 1 } as IScoredArtifact,

    { Slot: "Chestplate", Guid: "C1", score: 1 } as IScoredArtifact,
    { Slot: "Chestplate", Guid: "C2", score: 1 } as IScoredArtifact,
    { Slot: "Chestplate", Guid: "C3", score: 1 } as IScoredArtifact,

    { Slot: "Boots", Guid: "B1", score: 1 } as IScoredArtifact,
    { Slot: "Boots", Guid: "B2", score: 1 } as IScoredArtifact,
    { Slot: "Boots", Guid: "B3", score: 1 } as IScoredArtifact,
  ];

  test("Generate all combination without accessories", () => {
    const iterator = generateTable(ARTIFACTS);

    const result = Array.from(iterator);

    expect(result.length).toBe(729); // 6 artifact, 3 possibility each : 3^6
    expect(result[0].artifacts.filter((f) => f.Rarity !== "")).toStrictEqual([
      { Guid: "W1", Slot: "Weapon", score: 1 },
      { Guid: "H1", Slot: "Helmet", score: 1 },
      { Guid: "S1", Slot: "Shield", score: 1 },
      { Guid: "G1", Slot: "Gauntlets", score: 1 },
      { Guid: "C1", Slot: "Chestplate", score: 1 },
      { Guid: "B1", Slot: "Boots", score: 1 },
    ]);

    expect(
      result[result.length - 1].artifacts.filter((f) => f.Rarity !== "")
    ).toStrictEqual([
      { Guid: "W3", Slot: "Weapon", score: 1 },
      { Guid: "H3", Slot: "Helmet", score: 1 },
      { Guid: "S3", Slot: "Shield", score: 1 },
      { Guid: "G3", Slot: "Gauntlets", score: 1 },
      { Guid: "C3", Slot: "Chestplate", score: 1 },
      { Guid: "B3", Slot: "Boots", score: 1 },
    ]);
  });
});

describe("Process >> Reorder", () => {
  interface IJestOrderable extends IOrderable {
    key: string;
  }

  const TEST_ARRAY: IJestOrderable[] = [
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

  const TEST_ARRAY_WITH_MISSING: IJestOrderable[] = [
    { key: "A", order: 0 },
    { key: "C", order: 2 },
    { key: "E", order: 4 },
    { key: "G", order: 6 },
    { key: "I", order: 8 },
    { key: "J", order: 9 },
  ];

  const TEST_ARRAY_NEGATIVE: IJestOrderable[] = [
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

  const newElement: IJestOrderable = { key: "K", order: 99 };
  const existingElement: IJestOrderable = { key: "I", order: 8 };

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
