import getStatPriority from "./getStatPriority";

import type { IArtifact, IChampionConfiguration, IStat } from "../models";

const calculateScoreEasyMode = (
  artifact: IArtifact,
  champion: IChampionConfiguration
): number => {
  let rarityScore = 0;

  if (artifact.Rarity === "Rare") {
    rarityScore = 1;
  }

  if (artifact.Rarity === "Epic") {
    rarityScore = 2;
  }

  if (artifact.Rarity === "Legendary") {
    rarityScore = 3;
  }

  const qualityScore = Math.max(0, artifact.Quality - 2);

  const gauntletStatsStatsScore =
    artifact.Slot === "Gauntlets" &&
    champion.GauntletStats.includes(artifact.MainStats)
      ? 3
      : 0;
  const chestplateStatsStatsScore =
    artifact.Slot === "Chestplate" &&
    champion.ChestplateStats.includes(artifact.MainStats)
      ? 3
      : 0;
  const bootsStatsStatsScore =
    artifact.Slot === "Boots" &&
    champion.BootsStats.includes(artifact.MainStats)
      ? 3
      : 0;

  const mainStatScore = getStatPriority(
    champion.StatsPriority,
    artifact.MainStats
  );

  let statsScore = 0;

  const artifactStats = artifact.SubStats.map((s) => s?.Stats) as IStat[];

  artifactStats.forEach((artifactStat) => {
    if (artifactStat !== "") {
      statsScore += getStatPriority(champion.StatsPriority, artifactStat); // champion.StatsPriority[artifactStat] ?? 0;
    }
  });

  return (
    rarityScore +
    qualityScore +
    gauntletStatsStatsScore +
    chestplateStatsStatsScore +
    bootsStatsStatsScore +
    mainStatScore +
    statsScore
  );
};

export default calculateScoreEasyMode;
