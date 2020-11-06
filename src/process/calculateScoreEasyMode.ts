import {
  Champion,
  Rarity,
  Stat,
  Artifact,
  Slots,
  ExistingSlotsAccessories,
} from "models";

const calculateScoreEasyMode = (
  artifact: Artifact,
  champion: Champion
): number => {
  let rarityScore = 0;

  if (artifact.Rarity === Rarity.Rare) {
    rarityScore = 1;
  }

  if (artifact.Rarity === Rarity.Epic) {
    rarityScore = 2;
  }

  if (artifact.Rarity === Rarity.Legendary) {
    rarityScore = 3;
  }

  const qualityScore = Math.max(0, artifact.Quality - 2);

  const gauntletStatsStatsScore =
    artifact.Slot === Slots.Gauntlets &&
    champion.GauntletStats.includes(artifact.MainStats)
      ? 1
      : 0;
  const chestplateStatsStatsScore =
    artifact.Slot === Slots.Chestplate &&
    champion.ChestplateStats.includes(artifact.MainStats)
      ? 1
      : 0;
  const bootsStatsStatsScore =
    artifact.Slot === Slots.Boots &&
    champion.BootsStats.includes(artifact.MainStats)
      ? 1
      : 0;

  let accessoryScore = 0;
  if (
    ExistingSlotsAccessories.includes(artifact.Slot) &&
    artifact.MainStats !== Stat.None
  ) {
    accessoryScore = champion.StatsPriority[artifact.MainStats] ?? 0;
  }

  let statsScore = 0;

  const artifactStats = artifact.SubStats.map((s) => s?.Stats) as Stat[];

  artifactStats.forEach((artifactStat) => {
    if (artifactStat !== Stat.None) {
      statsScore += champion.StatsPriority[artifactStat] ?? 0;
    }
  });

  return (
    rarityScore +
    qualityScore +
    gauntletStatsStatsScore +
    chestplateStatsStatsScore +
    bootsStatsStatsScore +
    accessoryScore +
    statsScore
  );
};

export default calculateScoreEasyMode;
