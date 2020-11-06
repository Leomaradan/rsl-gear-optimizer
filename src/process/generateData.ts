import calculateBonus from "./calculateBonus";
import calculateScoreEasyMode from "./calculateScoreEasyMode";
import generateTable, { getEmtyItem } from "./generateTable";
import calculateScoreRealStats from "./calculateScoreRealStats";
import {
  Artifact,
  Champion,
  GenerationMethod,
  ResultsWorkerCommands,
  ResultsRow,
  ListOfArtifacts,
  Slots,
  ScoredArtifact,
} from "models";

const generateData = (
  artifacts: Artifact[],
  champion: Champion,
  generationMethod: GenerationMethod,
  postCommand: (command: ResultsWorkerCommands) => void,
  nbChampion: number,
  maxChampions: number,
  forceComplete = false
): ResultsRow[] => {
  try {
    const scoredArtifacts: ScoredArtifact[] = [];
    const hasBanner = champion.Accessories === Slots.Banner;
    const hasAmulet = hasBanner || champion.Accessories === Slots.Amulet;
    const hasRing = hasAmulet || champion.Accessories === Slots.Ring;

    artifacts.forEach((artifact) => {
      let score = 0;
      if (generationMethod === GenerationMethod.Easy) {
        score = calculateScoreEasyMode(artifact, champion);
      } else if (generationMethod === GenerationMethod.RealValue) {
        score = calculateScoreRealStats(artifact, champion);
      }

      scoredArtifacts.push({ ...artifact, score });
    });

    const rings = hasRing
      ? scoredArtifacts.filter(
          (i) => i.Slot === Slots.Ring && i.Clan === champion.Clan
        )
      : [];
    const amulets = hasAmulet
      ? scoredArtifacts.filter(
          (i) => i.Slot === Slots.Amulet && i.Clan === champion.Clan
        )
      : [];
    const banners = hasBanner
      ? scoredArtifacts.filter(
          (i) => i.Slot === Slots.Banner && i.Clan === champion.Clan
        )
      : [];

    if (rings.length === 0) {
      rings.push(getEmtyItem(Slots.Ring));
    }

    if (amulets.length === 0) {
      amulets.push(getEmtyItem(Slots.Amulet));
    }

    if (banners.length === 0) {
      banners.push(getEmtyItem(Slots.Banner));
    }

    rings.sort((a, b) => b.score - a.score);
    amulets.sort((a, b) => b.score - a.score);
    banners.sort((a, b) => b.score - a.score);

    const iterator = generateTable(scoredArtifacts);

    let maxScore = 0;
    let index = 0;

    const result: ResultsRow[] = [];

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
        if (generationMethod === GenerationMethod.Easy && bonus.complete) {
          score += 2;
        }

        if (postCommand && index % 1500 === 0) {
          postCommand({
            command: "progress",
            current: index + nbChampion * max,
            max: max * maxChampions,
            champion: champion.Champion,
            task: "taskGenerateTable",
          });
        }

        if (score > maxScore) {
          maxScore = score;
        }

        result.push({
          artifacts: [
            ...artifactList,
            rings[0],
            amulets[0],
            banners[0],
          ] as ListOfArtifacts,
          score,
          maxScore: 0,
          id: index,
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
