/* eslint-disable no-param-reassign */
import type { IArtifact, IStatsFull } from "../models";

const RollCombinations = [
  [0, 0, 1, 3],
  [0, 0, 2, 2],
  [0, 0, 3, 1],
  [0, 1, 0, 3],
  [0, 1, 1, 2],
  [0, 1, 2, 1],
  [0, 1, 3, 0],
  [0, 2, 0, 2],
  [0, 2, 1, 1],
  [0, 2, 2, 0],
  [0, 3, 0, 1],
  [0, 3, 1, 0],
  [1, 0, 0, 3],
  [1, 0, 1, 2],
  [1, 0, 2, 1],
  [1, 0, 3, 0],
  [1, 1, 0, 2],
  [1, 1, 1, 1],
  [1, 1, 2, 0],
  [1, 2, 0, 1],
  [1, 2, 1, 0],
  [1, 3, 0, 0],
  [2, 0, 0, 2],
  [2, 0, 1, 1],
  [2, 0, 2, 0],
  [2, 1, 0, 1],
  [2, 1, 1, 0],
  [2, 2, 0, 0],
  [3, 0, 0, 1],
  [3, 0, 1, 0],
  [3, 1, 0, 0],
];

const RollCombinationsCommon = [
  [0, 0, 0, 3],
  [0, 0, 1, 2],
  [0, 0, 2, 1],
  [0, 0, 3, 0],
  [0, 1, 0, 2],
  [0, 1, 1, 1],
  [0, 1, 2, 0],
  [0, 2, 0, 1],
  [0, 2, 1, 0],
  [0, 3, 0, 0],
  [1, 0, 0, 2],
  [1, 0, 1, 1],
  [1, 0, 2, 0],
  [1, 1, 0, 1],
  [1, 1, 1, 0],
  [1, 2, 0, 0],
  [2, 0, 0, 1],
  [2, 0, 1, 0],
  [2, 1, 0, 0],
  [3, 0, 0, 0],
];

const MaxStatsHP = [1340, 1820, 2300, 2840, 3480, 4080];
const MaxStatsAtkDef = [90, 120, 155, 190, 225, 265];
const MaxStatsPercent = [21, 25, 30, 40, 50, 60];
const MaxStatsCDamage = [30, 35, 40, 49, 65, 80];
const MaxStatsResistAcc = [26, 38, 49, 64, 78, 96];
const MaxStatsSpeed = [21, 25, 30, 35, 40, 45];

const generateTheoricalArtifact = (baseArtifact: IArtifact): IArtifact => {
  // Calculate the main stat value
  const newArtifact = baseArtifact;

  switch (newArtifact.MainStats) {
    case "ACC":
    case "RESI":
      newArtifact.MainStatsValue = MaxStatsResistAcc[newArtifact.Quality - 1];
      break;
    case "ATK":
    case "DEF":
      newArtifact.MainStatsValue = MaxStatsAtkDef[newArtifact.Quality - 1];
      break;
    case "ATK%":
    case "C.RATE":
    case "DEF%":
    case "HP%":
      newArtifact.MainStatsValue = MaxStatsPercent[newArtifact.Quality - 1];
      break;
    case "C.DMG":
      newArtifact.MainStatsValue = MaxStatsCDamage[newArtifact.Quality - 1];
      break;
    case "HP":
      newArtifact.MainStatsValue = MaxStatsHP[newArtifact.Quality - 1];
      break;
    case "SPD":
      newArtifact.MainStatsValue = MaxStatsSpeed[newArtifact.Quality - 1];
      break;
    default:
      break;
  }

  // Remove existing rolls
  const newStats: IStatsFull[] = (newArtifact.SubStats.filter(
    (s) => s
  ) as IStatsFull[]).map((stat) => {
    if (stat.Roll) {
      return {
        Roll: 0,
        Rune: stat.Rune,
        Stats: stat.Stats,
        Value: Math.round(stat.Value / (stat.Roll + 1)),
      } as IStatsFull;
    }
    return stat;
  });

  // simulate all the roll slots (16 for uncommon and better, 12 for common)
  let RollCombination =
    newArtifact.Rarity === "Common" ? RollCombinationsCommon : RollCombinations;

  const artifacts = new Set<string>();

  // filter rolls combination to keep only these "compatible" with current rolls
  RollCombination = RollCombination.filter((rolls) => {
    if (baseArtifact.SubStats[0] && baseArtifact.SubStats[0].Roll > rolls[0]) {
      return false;
    }

    if (baseArtifact.SubStats[1] && baseArtifact.SubStats[1].Roll > rolls[1]) {
      return false;
    }

    if (baseArtifact.SubStats[2] && baseArtifact.SubStats[2].Roll > rolls[2]) {
      return false;
    }

    if (
      baseArtifact.SubStats[3] &&
      baseArtifact.SubStats[3].Roll !== rolls[3]
    ) {
      return false;
    }

    return true;
  });

  RollCombination.forEach((rolls) => {
    const newRolls: IStatsFull[] = newStats.map((stat, index) => {
      if (rolls[index] !== 0) {
        return {
          Roll: rolls[index],
          Rune: stat.Rune,
          Stats: stat.Stats,
          Value: stat.Value * (rolls[index] + 1),
        } as IStatsFull;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return {} as any;
    });
    artifacts.add(JSON.stringify({ ...baseArtifact, SubStats: newRolls }));
  });

  baseArtifact.SubStats.forEach((baseStat, index) => {
    if (baseStat !== undefined) {
      const newStat: IStatsFull = { ...baseStat, Roll: 0, Value: 0 };
      let counter = 0;
      const sumStat = Array.from(artifacts).reduce((stat, artifactJson) => {
        const artifact: IArtifact = JSON.parse(artifactJson);
        if (!artifact.SubStats[index]) {
          return stat;
        }
        counter += 1;

        stat.Value += artifact.SubStats[index]?.Value ?? 0;
        stat.Roll += artifact.SubStats[index]?.Roll ?? 0;
        return stat;
      }, newStat);

      sumStat.Roll = newStat.Roll / counter;
      sumStat.Value = newStat.Value / counter;

      newArtifact.SubStats[index] = sumStat;
    }
  });

  return newArtifact;
};

export default generateTheoricalArtifact;
