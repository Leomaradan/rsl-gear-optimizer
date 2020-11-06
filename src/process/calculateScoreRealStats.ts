import { Stars, Champion, Stat, StatsFull, Artifact, Slots } from "models";

const statsWeight = (stats: Stat, quality: Stars) => {
  switch (stats) {
    case Stat.Speed:
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

    case Stat.HpPercent:
    case Stat.AttackPercent:
    case Stat.DefensePercent:
    case Stat.CriticalRate:
      return 0.5;
    case Stat.CriticalDamage:
      switch (quality) {
        case 4:
          return 0.61;
        case 5:
          return 0.65;
        case 6:
        default:
          return 0.665;
      }
    case Stat.Accuracy:
    case Stat.Resistance:
      switch (quality) {
        case 4:
        case 6:
          return 0.8;
        case 5:
          return 0.78;

        default:
          return 0.815;
      }
    case Stat.Attack:
    case Stat.Defense:
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
    case Stat.HP:
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
  artifact: Artifact,
  champion: Champion
): number => {
  const gauntletStatsStatsScore =
    artifact.Slot === Slots.Gauntlets &&
    champion.GauntletStats.includes(artifact.MainStats)
      ? Math.round(
          statsWeight(artifact.MainStats, artifact.Quality) *
            (artifact.MainStatsValue ?? 0)
        )
      : 0;

  const chestplateStatsStatsScore =
    artifact.Slot === Slots.Chestplate &&
    champion.ChestplateStats.includes(artifact.MainStats)
      ? Math.round(
          statsWeight(artifact.MainStats, artifact.Quality) *
            (artifact.MainStatsValue ?? 0)
        )
      : 0;

  const bootsStatsStatsScore =
    artifact.Slot === Slots.Boots &&
    champion.BootsStats.includes(artifact.MainStats)
      ? Math.round(
          statsWeight(artifact.MainStats, artifact.Quality) *
            (artifact.MainStatsValue ?? 0)
        )
      : 0;

  const artifactStats = artifact.SubStats as StatsFull[];

  let statsScore = 0;

  artifactStats.forEach((artifactStat) => {
    if (artifactStat && artifactStat.Stats !== Stat.None) {
      const modifier =
        (champion.StatsPriority[artifactStat.Stats] ?? 0) *
        statsWeight(artifactStat.Stats, artifact.Quality);
      statsScore += Math.round(
        modifier * (artifactStat.Value + artifactStat.Rune)
      );
    }
  });

  return (
    gauntletStatsStatsScore +
    chestplateStatsStatsScore +
    bootsStatsStatsScore +
    statsScore
  );
};

export default calculateScoreRealStats;
