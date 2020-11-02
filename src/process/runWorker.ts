// eslint-disable-next-line import/no-webpack-loader-syntax
import CombinationWorker from "worker-loader!process/combination.worker";

import Artifact from "models/Artifact";
import {
  resultsDoneGeneration,
  resultsStartGeneration,
} from "redux/resultsSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { Champion } from "models/Champion";
import { ResultsWorkerCommands, ResultsWorkerEvents } from "models/Worker";
import { GenerationMethod } from "models/Configuration";

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
      log(event.data.message);
    }

    if (event.data.command === "progress") {
      updateProgress(event.data.task, event.data.current);
      log(`${event.data.task} / ${event.data.current}`);
    }
  };
};
