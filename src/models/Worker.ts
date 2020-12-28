import type { IChampionConfiguration } from "./ChampionConfiguration";
import type { IArtifact } from "./Artifact";
import type { IResults } from "./Results";
import type { IGenerationMethod } from "./Configuration";
import type { IChampion } from "./Champion";

import type { ILanguageUiTask } from "lang/language";

type IWorkerCommand<T> = {
  data: T;
};

export interface IResultsWorkerCommandGenerate {
  championConfigurations: IChampionConfiguration[];
  champions: IChampion[];
  artifacts: IArtifact[];
  generationMethod: IGenerationMethod;
  excludeWornArtifacts: boolean;
  command: "generate";
}

interface IResultsWorkerCommandDone {
  results: IResults[];
  items: number;
  command: "done";
}

interface IResultsWorkerCommandMessage {
  message: string;
  command: "message";
}

interface IResultsWorkerCommandProgress {
  current: number;
  max?: number;
  task: keyof ILanguageUiTask;
  champion: string;
  command: "progress";
}

export type IResultsWorkerEventGenerate = IWorkerCommand<
  IResultsWorkerCommandGenerate
>;

type IResultsWorkerEventDone = IWorkerCommand<IResultsWorkerCommandDone>;

type IResultsWorkerEventMessage = IWorkerCommand<IResultsWorkerCommandMessage>;

type IResultsWorkerEventProgress = IWorkerCommand<
  IResultsWorkerCommandProgress
>;

export type IResultsWorkerCommands =
  | IResultsWorkerCommandGenerate
  | IResultsWorkerCommandDone
  | IResultsWorkerCommandMessage
  | IResultsWorkerCommandProgress;

export type IResultsWorkerEvents =
  | IResultsWorkerEventGenerate
  | IResultsWorkerEventDone
  | IResultsWorkerEventMessage
  | IResultsWorkerEventProgress;
