/* eslint-disable import/no-webpack-loader-syntax */
import {
  resultsDoneGeneration,
  resultsStartGeneration,
} from "redux/resultsSlice";
import {
  Artifact,
  Champion,
  GenerationMethod,
  ResultsWorkerCommands,
  ResultsWorkerEvents,
} from "models";
// eslint-disable-next-line import/no-unresolved
import CombinationWorker from "worker-loader!process/combination.worker";

import { Dispatch } from "@reduxjs/toolkit";

const log = (message: string) => {
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(message);
  }
};

export default (
  dispatch: Dispatch,
  champions: Champion[],
  artifacts: Artifact[],
  generationMethod: GenerationMethod,
  updateProgress: (task: string, value: number) => void
): void => {
  dispatch(resultsStartGeneration());

  const worker = new CombinationWorker();
  const time = performance.now();

  worker.postMessage({
    command: "generate",
    champions,
    artifacts,
    generationMethod,
  } as ResultsWorkerCommands);

  worker.onmessage = (event: ResultsWorkerEvents) => {
    if (event.data.command === "done") {
      const endTime = performance.now();
      log(`Generated ${event.data.items} combination in ${endTime - time}ms`);
      dispatch(resultsDoneGeneration(event.data.results));
    }

    if (event.data.command === "message") {
      if (event.data.message.startsWith("{")) {
        log(JSON.parse(event.data.message));
      } else {
        log(event.data.message);
      }
    }

    if (event.data.command === "progress") {
      updateProgress(event.data.task, event.data.current);
      log(`${event.data.task} / ${event.data.current}`);
    }
  };
};
