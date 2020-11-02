import { Champion } from "models/Champion";
import { ListOfArtifacts } from "models/Artifact";
import { Stars } from "models/Quality";
import Stats, { StatsFull } from "models/Stats";

const statsWeight = (stats: Stats, quality: Stars) => {
  switch (stats) {
    case Stats.Speed:
      switch (quality) {
        case 4:
          return 0.437;
        case 5:
          return 0.4;
        case 6:
          return 0.375;
        default:
          return 0.5;
      }

    case Stats.HpPercent:
    case Stats.AttackPercent:
    case Stats.DefensePercent:
    case Stats.CriticalRate:
      return 0.5;
    case Stats.CriticalDamage:
      switch (quality) {
        case 4:
          return 0.61;
        case 5:
          return 0.65;
        case 6:
        default:
          return 0.665;
      }
    case Stats.Accuracy:
    case Stats.Resistance:
      switch (quality) {
        case 4:
        case 6:
          return 0.8;
        case 5:
          return 0.78;

        default:
          return 0.815;
      }
    case Stats.Attack:
    case Stats.Defense:
      switch (quality) {
        case 4:
          return 2.37;
        case 5:
          return 2.25;
        case 6:
          return 2.2;
        default:
          return 2.58;
      }
    case Stats.HP:
      switch (quality) {
        case 4:
          return 35.5;
        case 5:
          return 34.8;
        case 6:
          return 34;
        default:
          return 38.3;
      }
    default:
      return 0;
  }
};

const calculateScoreRealStats = (
  artifacts: ListOfArtifacts,
  champion: Champion
): number => {
  const gauntletStatsStatsScore = champion.gauntletStats.includes(
    artifacts[3].MainStats
  )
    ? Math.round(
        statsWeight(artifacts[3].MainStats, artifacts[3].Quality) *
          (artifacts[3].MainStatsValue ?? 0)
      )
    : 0;
  const chestplateStatsStatsScore = champion.chestplateStats.includes(
    artifacts[4].MainStats
  )
    ? Math.round(
        statsWeight(artifacts[4].MainStats, artifacts[4].Quality) *
          (artifacts[4].MainStatsValue ?? 0)
      )
    : 0;
  const bootsStatsStatsScore = champion.bootsStats.includes(
    artifacts[5].MainStats
  )
    ? Math.round(
        statsWeight(artifacts[5].MainStats, artifacts[5].Quality) *
          (artifacts[5].MainStatsValue ?? 0)
      )
    : 0;

  const statsScore = artifacts.reduce((acc, artifact) => {
    const artifactStats = artifact.SubStats as StatsFull[];

    let sum = acc;

    artifactStats.forEach((artifactStat) => {
      if (artifactStat && artifactStat.Stats !== Stats.None) {
        const modifier =
          (champion.statsPriority[artifactStat.Stats] ?? 0) *
          statsWeight(artifactStat.Stats, artifact.Quality);
        sum += Math.round(modifier * (artifactStat.Value + artifactStat.Rune));
      }
    });

    return sum;
  }, 0);

  return (
    gauntletStatsStatsScore +
    chestplateStatsStatsScore +
    bootsStatsStatsScore +
    statsScore
  );
};

export default calculateScoreRealStats;
