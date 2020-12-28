import getStatPriority from "./getStatPriority";

import type {
  IStars,
  IChampionConfiguration,
  IStat,
  IStatsFull,
  IArtifact,
} from "models";

const statsWeight = (stats: IStat, quality: IStars) => {
  switch (stats) {
    case "SPD":
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

    case "HP%":
    case "ATK%":
    case "DEF%":
    case "C.RATE":
      return 0.5;
    case "C.DMG":
      switch (quality) {
        case 4:
          return 0.61;
        case 5:
          return 0.65;
        case 6:
        default:
          return 0.665;
      }
    case "ACC":
    case "RESI":
      switch (quality) {
        case 4:
        case 6:
          return 0.8;
        case 5:
          return 0.78;

        default:
          return 0.815;
      }
    case "ATK":
    case "DEF":
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
    case "HP":
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
  artifact: IArtifact,
  championBase?: IChampionConfiguration
): number => {
  if (artifact.MainStats === "") {
    return 0;
  }

  const champion =
    championBase ??
    (({
      BootsStats: [],
      ChestplateStats: [],
      GauntletStats: [],
      AmuletsStats: [],
      BannersStats: [],
      RingsStats: [],
      StatsPriority: {
        "ATK%": 1,
        "C.DMG": 1,
        "C.RATE": 1,
        "DEF%": 1,
        "HP%": 1,
        ACC: 1,
        RESI: 1,
        SPD: 1,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any) as IChampionConfiguration);

  const gauntletStatsStatsScore =
    artifact.Slot === "Gauntlets" &&
    champion.GauntletStats.includes(artifact.MainStats)
      ? Math.round(
          (artifact.MainStatsValue ?? 0) /
            statsWeight(artifact.MainStats, artifact.Quality)
        )
      : 0;

  const chestplateStatsStatsScore =
    artifact.Slot === "Chestplate" &&
    champion.ChestplateStats.includes(artifact.MainStats)
      ? Math.round(
          (artifact.MainStatsValue ?? 0) /
            statsWeight(artifact.MainStats, artifact.Quality)
        )
      : 0;

  const bootsStatsStatsScore =
    artifact.Slot === "Boots" &&
    champion.BootsStats.includes(artifact.MainStats)
      ? Math.round(
          (artifact.MainStatsValue ?? 0) /
            statsWeight(artifact.MainStats, artifact.Quality)
        )
      : 0;

  const artifactStats = artifact.SubStats as IStatsFull[];

  let statsScore = 0;

  statsScore += Math.round(
    getStatPriority(champion.StatsPriority, artifact.MainStats) *
      ((artifact.MainStatsValue ?? 0) /
        statsWeight(artifact.MainStats, artifact.Quality))
  );

  artifactStats.forEach((artifactStat) => {
    if (artifactStat && artifactStat.Stats !== "") {
      statsScore += Math.round(
        getStatPriority(champion.StatsPriority, artifactStat.Stats) *
          ((artifactStat.Value + artifactStat.Rune) /
            statsWeight(artifactStat.Stats, artifact.Quality))
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
