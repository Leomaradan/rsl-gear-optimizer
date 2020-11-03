import { Results, ResultsDraft, ResultsWorkerCommands } from "models";

const selectResults = (
  results: ResultsDraft[],
  postCommand: (command: ResultsWorkerCommands) => void
): Results[] => {
  const takenArtifacts: string[] = [];
  const response: Results[] = results.map((r) => ({
    ...r,
    result: JSON.stringify(r.result),
    artifacts: null,
  }));

  results.some((result, index) => {
    result.result.sort((a, b) => b.score - a.score);

    result.result.some((line) => {
      let ok = true;

      if (index % 1000 === 0) {
        postCommand({
          command: "progress",
          current: index,
          task: "taskSelectResults",
        });
      }
      line.artifacts.forEach((artifact) => {
        if (takenArtifacts.includes(artifact.Guid)) {
          ok = false;
        }
      });

      if (ok) {
        response[index].selected = line.id;
        response[index].artifacts = line;
        takenArtifacts.push(...line.artifacts.map((i) => i.Guid));
        return true;
      }

      return false;
    });

    return response[index].selected !== -1;
  });

  return response;
};

export default selectResults;
