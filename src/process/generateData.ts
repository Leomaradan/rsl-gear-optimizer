import calculateBonus from "./calculateBonus";
import calculateScoreEasyMode from "./calculateScoreEasyMode";
import generateTable from "./generateTable";
import calculateScoreRealStats from "./calculateScoreRealStats";
import {
  Artifact,
  Champion,
  GenerationMethod,
  ResultsWorkerCommands,
  ResultsRow,
} from "models";

const generateData = (
  artifacts: Artifact[],
  champion: Champion,
  generationMethod: GenerationMethod,
  postCommand: (command: ResultsWorkerCommands) => void,
  forceComplete = false
): ResultsRow[] => {
  const table = generateTable(artifacts, champion, postCommand);

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
