import calculateBonus from "./calculateBonus";
import calculateScoreEasyMode from "./calculateScoreEasyMode";
import generateTable, { getEmtyItem } from "./generateTable";
import calculateScoreRealStats from "./calculateScoreRealStats";
import calculateScoreTheoricalStats from "./calculateScoreTheoricalStats";

import type {
  IArtifact,
  IChampionConfiguration,
  IGenerationMethod,
  IResultsWorkerCommands,
  IResultsRow,
  IScoredArtifact,
  IChampion,
} from "models";

interface IGenerateDataProps {
  artifacts: IArtifact[];
  championConfiguration: IChampionConfiguration;
  champion: IChampion;
  generationMethod: IGenerationMethod;
  nbChampion: number;
  maxChampions: number;
  forceComplete: boolean;
}

const generateData = (
  {
    artifacts,
    championConfiguration,
    champion,
    forceComplete,
    generationMethod,
    maxChampions,
    nbChampion,
  }: IGenerateDataProps,
  postCommand: (command: IResultsWorkerCommands) => void
): IResultsRow[] => {
  try {
    const scoredArtifacts: IScoredArtifact[] = [];
    const hasBanner = championConfiguration.Accessories === "Banner";
    const hasAmulet =
      hasBanner || championConfiguration.Accessories === "Amulet";
    const hasRing = hasAmulet || championConfiguration.Accessories === "Ring";

    artifacts.forEach((artifact) => {
      let score = 0;
      if (generationMethod === "Easy") {
        score = calculateScoreEasyMode(artifact, championConfiguration);
      } else if (generationMethod === "RealValue") {
        score = calculateScoreRealStats(artifact, championConfiguration);
      } else if (generationMethod === "TheoricalValue") {
        score = calculateScoreTheoricalStats(artifact, championConfiguration);
      }

      scoredArtifacts.push({ ...artifact, score });
    });

    const rings = hasRing
      ? scoredArtifacts.filter(
          (i) => i.Slot === "Ring" && i.Clan === champion.Clan
        )
      : [];
    const amulets = hasAmulet
      ? scoredArtifacts.filter(
          (i) => i.Slot === "Amulet" && i.Clan === champion.Clan
        )
      : [];
    const banners = hasBanner
      ? scoredArtifacts.filter(
          (i) => i.Slot === "Banner" && i.Clan === champion.Clan
        )
      : [];

    if (rings.length === 0) {
      rings.push(getEmtyItem("Ring"));
    }

    if (amulets.length === 0) {
      amulets.push(getEmtyItem("Amulet"));
    }

    if (banners.length === 0) {
      banners.push(getEmtyItem("Banner"));
    }

    rings.sort((a, b) => b.score - a.score);
    amulets.sort((a, b) => b.score - a.score);
    banners.sort((a, b) => b.score - a.score);

    const iterator = generateTable(scoredArtifacts);

    let maxScore = 0;
    let index = 0;

    const result: IResultsRow[] = [];

    let artifactYield = iterator.next();

    while (!artifactYield.done) {
      const { artifacts: artifactList, max } = artifactYield.value;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bonus = calculateBonus(artifactList as any);

      if (!forceComplete || bonus.complete) {
        let score = artifactList.reduce(
          (acc, artifact) => acc + artifact.score,
          0
        );
        if (generationMethod === "Easy" && bonus.complete) {
          score += 2;
        }

        if (postCommand && index % 1500 === 0) {
          postCommand({
            command: "progress",
            current: index + nbChampion * max,
            max: max * maxChampions,
            champion: championConfiguration.SourceChampion,
            task: "generateTable",
          });
        }

        if (score > maxScore) {
          maxScore = score;
        }

        result.push({
          artifacts: [...artifactList, rings[0], amulets[0], banners[0]],
          score,
          maxScore: 0,
          bonus: bonus.sets,
          bonusComplete: bonus.complete,
        });
      }
      index += 1;

      artifactYield = iterator.next();
    }

    result.forEach((_, i) => {
      result[i].maxScore = maxScore;
    });

    return result;
  } catch (e) {
    postCommand({
      command: "message",
      message: e,
    });
    return [];
  }
};

export default generateData;
