/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */

import generateData from "./generateData";

import type {
  IResultsWorkerCommands,
  IResultsWorkerEventGenerate,
  IResults,
  IChampionConfiguration,
  IArtifact,
  IGenerationMethod,
  IChampion,
  IResultsRow,
} from "models";

const ctx: Worker = self as any;

const postCommand = (command: IResultsWorkerCommands) => {
  ctx.postMessage(command);
};

let items = 0;
interface IGenerateProps {
  championConfigurations: IChampionConfiguration[];
  champions: IChampion[];
  artifacts: IArtifact[];
  generationMethod: IGenerationMethod;
  excludeWornArtifacts: boolean;
}
class CombinationWorker {
  // eslint-disable-next-line class-methods-use-this
  generate({
    artifacts,
    championConfigurations,
    champions,
    excludeWornArtifacts,
    generationMethod,
  }: IGenerateProps): IResults[] {
    const results: IResults[] = [];
    const usedArtifacts: string[] = [];
    const maxChampions = championConfigurations.length;

    championConfigurations.forEach((championConfiguration, nbChampion) => {
      let filtererdArtifacts = artifacts;

      const champion = champions.find(
        (c) => c.Guid === championConfiguration.SourceChampion
      ) as IChampion;

      postCommand({
        message: `Starting with champion ${championConfiguration.SourceChampion}`,
        command: "message",
      });

      if (
        championConfiguration.Methods === "ListSets" ||
        championConfiguration.Methods === "ListSetsNoBonus"
      ) {
        filtererdArtifacts = artifacts.filter((artifact) =>
          artifact.isAccessory
            ? champion.Clan === artifact.Clan
            : championConfiguration.Sets[0].includes(artifact.Set)
        );
      }

      if (excludeWornArtifacts) {
        filtererdArtifacts = filtererdArtifacts.filter(
          (artifact) =>
            artifact.Champion === "" ||
            !artifact.Champion ||
            artifact.Champion === championConfiguration.SourceChampion
        );
      }

      filtererdArtifacts = filtererdArtifacts.filter(
        (artifact) => !usedArtifacts.includes(artifact.Guid)
      );

      let combinations = generateData(
        {
          artifacts: filtererdArtifacts,
          championConfiguration,
          generationMethod,
          nbChampion,
          maxChampions,
          champion,
          forceComplete: championConfiguration.Methods === "ListSets",
        },
        postCommand
      );

      items += combinations.length;

      combinations = combinations
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);

      let selected: IResultsRow =
        combinations.length > 0 ? combinations[0] : (null as any);

      if (selected) {
        selected.artifacts.forEach((element) => {
          usedArtifacts.push(element.Guid);
        });
      } else {
        selected = {
          artifacts: [],
          bonus: [],
          maxScore: 0,
          score: 0,
          bonusComplete: false,
        };
      }

      postCommand({
        message: `Ending with champion ${championConfiguration.SourceChampion}`,
        command: "message",
      });

      results.push({
        champion: championConfiguration,
        name: championConfiguration.Guid,
        ...selected,
      });
    });

    return results;
  }
}

const worker = new CombinationWorker();

ctx.addEventListener("message", (event: IResultsWorkerEventGenerate) => {
  if (event.data.command === "generate") {
    postCommand({ message: JSON.stringify(event.data), command: "message" });
    const results = worker.generate(event.data);

    postCommand({ command: "done", results, items });
  }
});
