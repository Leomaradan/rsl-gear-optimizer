/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */

import generateData from "./generateData";
import {
  ResultsWorkerCommands,
  ResultsWorkerEventGenerate,
  Results,
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
    generationMethod: GenerationMethod,
    excludeWornArtifacts: boolean
  ): Results[] {
    const results: Results[] = [];
    const usedArtifacts: string[] = [];
    const max = champions.length;

    champions.forEach((champion, nbChampion) => {
      let filtererdArtifacts = artifacts;

      postCommand({
        message: `Starting with champion ${champion.Champion}`,
        command: "message",
      });

      if (champion.Methods !== ChampionSetMethod.NoSets) {
        filtererdArtifacts = artifacts.filter((artifact) =>
          artifact.isAccessory
            ? champion.Clan === artifact.Clan
            : champion.Sets.includes(artifact.Set)
        );
      }

      if (excludeWornArtifacts) {
        filtererdArtifacts = filtererdArtifacts.filter(
          (artifact) =>
            artifact.Champion === "" || artifact.Champion === champion.Champion
        );
      }

      filtererdArtifacts = filtererdArtifacts.filter(
        (artifact) => !usedArtifacts.includes(artifact.Guid)
      );

      let result = generateData(
        filtererdArtifacts,
        champion,
        generationMethod,
        postCommand,
        nbChampion,
        max,
        champion.Methods === ChampionSetMethod.RequireSets
      );

      items += result.length;

      result = result.sort((a, b) => b.score - a.score).slice(0, 100);

      const selected = result.length > 0 ? result[0] : null;

      if (selected) {
        selected.artifacts.forEach((element) => {
          usedArtifacts.push(element.Guid);
        });
      }

      postCommand({
        message: `Ending with champion ${champion.Champion}`,
        command: "message",
      });

      results.push({
        result: result.map((row) => JSON.stringify(row)),
        champion,
        name: champion.Guid,
        selected: selected !== null,
        artifacts: selected,
      });
    });

    return results;
  }
}

const worker = new CombinationWorker();

ctx.addEventListener("message", (event: ResultsWorkerEventGenerate) => {
  if (event.data.command === "generate") {
    const results = worker.generate(
      event.data.champions,
      event.data.artifacts,
      event.data.generationMethod,
      event.data.excludeWornArtifacts
    );

    postCommand({ command: "done", results, items });
  }
});
