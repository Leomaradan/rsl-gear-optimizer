import { Results, ResultsDraft } from "models/Results";
import { ResultsWorkerCommands } from "models/Worker";

const selectResult = (
  results: ResultsDraft[],
  postCommand?: (command: ResultsWorkerCommands) => void
): Results[] => {
  const takenArtifacts: string[] = [];
  const response: Results[] = results.map((r) => ({
    ...r,
    result: JSON.stringify(r.result),
    artifacts: null,
  }));

  results.forEach((result, index) => {
    if (response[index].selected === -1) {
      result.result.sort((a, b) => b.score - a.score);

      result.result.forEach((line) => {
        if (response[index].selected === -1) {
          let ok = true;
          if (postCommand && index % 1000 === 0) {
            postCommand({
              command: "progress",
              current: index,
              task: "taskSelectResults",
            });
          }

          line.artifacts.forEach((artifact) => {
            if (takenArtifacts.includes(artifact.Guid as string)) {
              ok = false;
            }
          });

          if (ok) {
            response[index].selected = line.id;
            response[index].artifacts = line;
            takenArtifacts.push(...line.artifacts.map((i) => i.Guid as string));
          }
        }
      });
    }
  });

  return response;
};

export default selectResult;
