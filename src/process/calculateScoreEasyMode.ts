import { ListOfArtifacts, Champion, Rarity, Stat } from "models";

const calculateScoreEasyMode = (
  artifacts: ListOfArtifacts,
  champion: Champion
): number => {
  const rarityScore = artifacts.reduce((acc, item) => {
    if (item.Rarity === Rarity.Rare) {
      return acc + 1;
    }

    if (item.Rarity === Rarity.Epic) {
      return acc + 2;
    }

    if (item.Rarity === Rarity.Legendary) {
      return acc + 3;
    }

    return acc;
  }, 0);

  const qualityScore = artifacts.reduce(
    (acc, item) => acc + Math.max(0, item.Quality - 2),
    0
  );

  const gauntletStatsStatsScore = champion.gauntletStats.includes(
    artifacts[3].MainStats
  )
    ? 1
    : 0;
  const chestplateStatsStatsScore = champion.chestplateStats.includes(
    artifacts[4].MainStats
  )
    ? 1
    : 0;
  const bootsStatsStatsScore = champion.bootsStats.includes(
    artifacts[5].MainStats
  )
    ? 1
    : 0;

  const statsScore = artifacts.reduce((acc, artifact) => {
    const artifactStats = artifact.SubStats.map((s) => s?.Stats) as Stat[];

    let sum = acc;

    artifactStats.forEach((artifactStat) => {
      if (artifactStat !== Stat.None) {
        sum += champion.statsPriority[artifactStat] ?? 0;
      }
    });

    return sum;
  }, 0);

  return (
    rarityScore +
    qualityScore +
    gauntletStatsStatsScore +
    chestplateStatsStatsScore +
    bootsStatsStatsScore +
    statsScore
  );
};

export default calculateScoreEasyMode;
