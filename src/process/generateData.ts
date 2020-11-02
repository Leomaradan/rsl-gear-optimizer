import { Champion } from "models/Champion";
import Artifact from "models/Artifact";
import { ResultsRow } from "models/Results";
import { ResultsWorkerCommands } from "models/Worker";
import { GenerationMethod } from "models/Configuration";
import calculateBonus from "./calculateBonus";
import calculateScoreEasyMode from "./calculateScoreEasyMode";
import generateTable from "./generateTable";
import calculateScoreRealStats from "./calculateScoreRealStats";

const generateData = (
  artifacts: Artifact[],
  champion: Champion,
  forceComplete = false,
  generationMethod: GenerationMethod,
  postCommand?: (command: ResultsWorkerCommands) => void
): ResultsRow[] => {
  const table = generateTable(artifacts, postCommand);

  let maxScore = 0;

  const data: ResultsRow[] = table
    .map((artifact, index) => {
      const bonus = calculateBonus(artifact);

      let score = 0;
      if (generationMethod === GenerationMethod.Easy) {
        score = calculateScoreEasyMode(artifact, champion);
        if (bonus.complete) {
          score += 2;
        }
      } else if (generationMethod === GenerationMethod.RealValue) {
        score = calculateScoreRealStats(artifact, champion);
      }

      if (postCommand && index % 1000 === 0) {
        postCommand({
          command: "progress",
          current: index,
          task: "taskCalculateScore",
        });
      }

      if (score > maxScore) {
        maxScore = score;
      }

      return {
        ...champion,
        artifacts: artifact,
        score,
        maxScore: 0,
        id: index,
        bonus: bonus.sets,
        bonusComplete: bonus.complete,
      };
    })
    .sort((a, b) => b.score - a.score);

  data.forEach((_, index) => {
    data[index].maxScore = maxScore;
  });

  if (forceComplete) {
    return data.filter((i) => i.bonusComplete);
  }

  return data;
};

export default generateData;
