/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-globals */

import type {
  IArtifact,
  IChampion,
  IChampionConfiguration,
  IGameProgression,
  IGenerationMethod,
  IResults,
  IResultsRow,
  IResultsWorkerCommands,
  IResultsWorkerEventGenerate,
} from "../models";

import generateData from "./generateData";

const ctx: Worker = self as any;

const postCommand = (command: IResultsWorkerCommands) => {
  ctx.postMessage(command);
};

let items = 0;
interface IGenerateProps {
  artifacts: IArtifact[];
  championConfigurations: IChampionConfiguration[];
  champions: IChampion[];
  excludeWornArtifacts: boolean;
  generationMethod: IGenerationMethod;
  gameProgression: IGameProgression;
}
class CombinationWorker {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  generate({
    artifacts,
    championConfigurations,
    champions,
    excludeWornArtifacts,
    generationMethod,
    gameProgression,
  }: IGenerateProps): IResults[] {
    const results: IResults[] = [];
    const usedArtifacts: number[] = [];
    const maxChampions = championConfigurations.length;

    championConfigurations.forEach((championConfiguration, nbChampion) => {
      let filtererdArtifacts = artifacts;

      const champion = champions.find(
        (c) => c.Id === championConfiguration.SourceChampion
      ) as IChampion;

      postCommand({
        command: "message",
        message: `Starting with champion ${championConfiguration.SourceChampion}`,
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
            !artifact.Champion ||
            artifact.Champion === championConfiguration.SourceChampion
        );
      }

      filtererdArtifacts = filtererdArtifacts.filter(
        (artifact) => !usedArtifacts.includes(artifact.Id)
      );

      let combinations = generateData(
        {
          artifacts: filtererdArtifacts,
          champion,
          championConfiguration,
          forceComplete: championConfiguration.Methods === "ListSets",
          generationMethod,
          maxChampions,
          nbChampion,
          gameProgression,
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
          usedArtifacts.push(element.Id);
        });
      } else {
        selected = {
          artifacts: [],
          bonus: [],
          bonusComplete: false,
          maxScore: 0,
          score: 0,
        };
      }

      postCommand({
        command: "message",
        message: `Ending with champion ${championConfiguration.SourceChampion}`,
      });

      results.push({
        champion: championConfiguration,
        name: String(championConfiguration.Id),
        ...selected,
      });
    });

    return results;
  }
}

const worker = new CombinationWorker();

ctx.addEventListener("message", (event: IResultsWorkerEventGenerate) => {
  if (event.data.command === "generate") {
    postCommand({ command: "message", message: JSON.stringify(event.data) });
    const results = worker.generate(event.data);

    postCommand({ command: "done", items, results });
  }
});
