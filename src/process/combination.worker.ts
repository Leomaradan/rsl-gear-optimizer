/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */

import { Champion, ChampionSetMethod } from "models/Champion";
import Artifact from "models/Artifact";
import { Results, ResultsDraft } from "models/Results";
import {
  ResultsWorkerCommands,
  ResultsWorkerEventGenerate,
} from "models/Worker";
import { GenerationMethod } from "models/Configuration";
import generateData from "./generateData";
import selectResult from "./selectResults";

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
        champion.methods === ChampionSetMethod.RequireSets,
        generationMethod,
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

    return selectResult(results, postCommand);
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
