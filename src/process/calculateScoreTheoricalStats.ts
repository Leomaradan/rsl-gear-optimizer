import type { IArtifact, IChampionConfiguration } from "../models";

import calculateScoreRealStats from "./calculateScoreRealStats";
import generateTheoricalArtifact from "./generateTheoricalArtifact";

const calculateScoreTheoricalStats = (
  baseArtifact: IArtifact,
  championBase?: IChampionConfiguration
): number => {
  const theoricalArtifact = generateTheoricalArtifact(baseArtifact);

  return calculateScoreRealStats(theoricalArtifact, championBase);
};

export default calculateScoreTheoricalStats;
