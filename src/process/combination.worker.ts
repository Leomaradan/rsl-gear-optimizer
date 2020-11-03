/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */

import generateData from "./generateData";
import selectResults from "./selectResults";
import {
  ResultsWorkerCommands,
  ResultsWorkerEventGenerate,
  Results,
  ResultsDraft,
  Champion,
  ChampionSetMethod,
  Artifact,
  GenerationMethod,
} from "models";

const ctx: Worker = self as any;

const postCommand = (command: ResultsWorkerCommands) => {
  ctx.postMessage(command);
};

let items = 0;

class CombinationWorker {
  // eslint-disable-next-line class-methods-use-this
  generate(
    champions: Champion[],
    artifacts: Artifact[],
    generationMethod: GenerationMethod
  ): Results[] {
    postCommand({ command: "message", message: "Starting" });
    const results: ResultsDraft[] = [];
    champions.forEach((champion) => {
      let filtererdArtifacts = artifacts;

      if (champion.methods !== ChampionSetMethod.NoSets) {
        filtererdArtifacts = artifacts.filter((artifact) =>
          champion.sets.includes(artifact.Set)
        );
      }

      const result = generateData(
        filtererdArtifacts,
        champion,
        generationMethod,
        champion.methods === ChampionSetMethod.RequireSets,
        postCommand
      );

      items += result.length;

      results.push({
        result,
        champion,
        name: champion.name,
        selected: -1,
      });
    });

    return selectResults(results, postCommand);
  }
}

const worker = new CombinationWorker();

ctx.addEventListener("message", (event: ResultsWorkerEventGenerate) => {
  if (event.data.command === "generate") {
    const results = worker.generate(
      event.data.champions,
      event.data.artifacts,
      event.data.generationMethod
    );

    postCommand({ command: "done", results, items });
  }
});
