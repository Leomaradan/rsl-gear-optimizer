/* eslint-disable import/no-webpack-loader-syntax */
import logger from "./logger";

import {
  resultsDoneGeneration,
  resultsStartGeneration,
} from "redux/resultsSlice";
import type {
  IArtifact,
  IChampion,
  IChampionConfiguration,
  IGenerationMethod,
  IResultsWorkerCommandGenerate,
  IResultsWorkerEvents,
} from "models";

// eslint-disable-next-line import/no-unresolved
import CombinationWorker from "worker-loader!process/combination.worker";
import type { Dispatch } from "@reduxjs/toolkit";

export default (
  dispatch: Dispatch,
  champions: IChampion[],
  championConfigurations: IChampionConfiguration[],
  artifacts: IArtifact[],
  generationMethod: IGenerationMethod,
  excludeWornArtifacts: boolean,
  updateProgress: (task: string, value: number, max: number) => void
): void => {
  dispatch(resultsStartGeneration());

  const worker = new CombinationWorker();
  const time = performance.now();

  const generateCommand: IResultsWorkerCommandGenerate = {
    command: "generate",
    championConfigurations,
    artifacts,
    generationMethod,
    champions,
    excludeWornArtifacts,
  };

  worker.postMessage(generateCommand);

  worker.onmessage = (event: IResultsWorkerEvents) => {
    if (event.data.command === "done") {
      const endTime = performance.now();
      worker.terminate();
      logger.info(
        `Generated ${event.data.items} combination in ${endTime - time}ms`
      );
      dispatch(resultsDoneGeneration(event.data.results));
    }

    if (event.data.command === "message") {
      if (event.data.message.startsWith("{")) {
        logger.info(JSON.parse(event.data.message));
      } else {
        logger.info(event.data.message);
      }
    }

    if (event.data.command === "progress") {
      updateProgress(event.data.task, event.data.current, event.data.max ?? 0);
    }
  };
};
