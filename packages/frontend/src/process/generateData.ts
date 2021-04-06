import calculateBonus from "./calculateBonus";
import calculateScoreEasyMode from "./calculateScoreEasyMode";
import calculateScoreRealStats from "./calculateScoreRealStats";
import calculateScoreTheoricalStats from "./calculateScoreTheoricalStats";
import generateTable, { getEmtyItem } from "./generateTable";
import calculateChampionStats from "./calculateChampionStats";

import type {
  IArtifact,
  IChampion,
  IChampionConfiguration,
  IGameProgression,
  IGenerationMethod,
  IResultsRow,
  IResultsWorkerCommands,
  IScoredArtifact,
} from "../models";

interface IGenerateDataProps {
  artifacts: IArtifact[];
  champion: IChampion;
  championConfiguration: IChampionConfiguration;
  forceComplete: boolean;
  generationMethod: IGenerationMethod;
  maxChampions: number;
  nbChampion: number;
  gameProgression: IGameProgression;
}

const generateData = (
  {
    artifacts,
    champion,
    championConfiguration,
    forceComplete,
    generationMethod,
    maxChampions,
    nbChampion,
    gameProgression,
  }: IGenerateDataProps,
  postCommand: (command: IResultsWorkerCommands) => void
): IResultsRow[] => {
  try {
    const scoredArtifacts: IScoredArtifact[] = [];
    const hasBanner = championConfiguration.Accessories === "Banner";
    const hasAmulet =
      hasBanner || championConfiguration.Accessories === "Amulet";
    const hasRing = hasAmulet || championConfiguration.Accessories === "Ring";

    const maxAcc = championConfiguration.StatsPriority.ACC_Max;
    const maxAtk = championConfiguration.StatsPriority["ATK%_Max"];
    const maxDmg = championConfiguration.StatsPriority["C.DMG_Max"];
    const maxCrate = championConfiguration.StatsPriority["C.RATE_Max"];
    const maxDef = championConfiguration.StatsPriority["DEF%_Max"];
    const maxHp = championConfiguration.StatsPriority["HP%_Max"];
    const maxResi = championConfiguration.StatsPriority.RESI_Max;
    const maxSpd = championConfiguration.StatsPriority.SPD_Max;

    const hasMaxStat =
      maxAcc ||
      maxAtk ||
      maxDmg ||
      maxCrate ||
      maxDef ||
      maxHp ||
      maxResi ||
      maxSpd;

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

        // If there is max stat cap, we need to calculate the real state of the champion
        if (hasMaxStat) {
          const calulatedStats = calculateChampionStats(
            champion,
            artifactList,
            gameProgression
          );

          if (maxAcc && calulatedStats.ACC.total > maxAcc) {
            score = 0;
          }

          if (maxAtk && calulatedStats.ATK.total > maxAtk) {
            score = 0;
          }

          if (maxDmg && calulatedStats["C.DMG"].total > maxDmg) {
            score = 0;
          }

          if (maxCrate && calulatedStats["C.RATE"].total > maxCrate) {
            score = 0;
          }

          if (maxDef && calulatedStats.DEF.total > maxDef) {
            score = 0;
          }

          if (maxHp && calulatedStats.HP.total > maxHp) {
            score = 0;
          }

          if (maxResi && calulatedStats.RESI.total > maxResi) {
            score = 0;
          }

          if (maxSpd && calulatedStats.SPD.total > maxSpd) {
            score = 0;
          }
        }

        if (postCommand && index % 1500 === 0) {
          postCommand({
            champion: championConfiguration.SourceChampion,
            command: "progress",
            current: index + nbChampion * max,
            max: max * maxChampions,
            task: "generateTable",
          });
        }

        if (score > maxScore) {
          maxScore = score;
        }

        result.push({
          artifacts: [...artifactList, rings[0], amulets[0], banners[0]],
          bonus: bonus.sets,
          bonusComplete: bonus.complete,
          maxScore: 0,
          score,
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
