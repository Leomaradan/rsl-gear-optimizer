import calculateScoreRealStats from "./calculateScoreRealStats";
import generateTheoricalArtifact from "./generateTheoricalArtifact";

import type { IArtifact, IChampionConfiguration } from "../models";

const calculateScoreTheoricalStats = (
  baseArtifact: IArtifact,
  championBase?: IChampionConfiguration
): number => {
  const theoricalArtifact = generateTheoricalArtifact(baseArtifact);

  return calculateScoreRealStats(theoricalArtifact, championBase);
};

export default calculateScoreTheoricalStats;
