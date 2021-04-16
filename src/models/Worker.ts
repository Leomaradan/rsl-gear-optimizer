import type { ILanguageUiTask } from "../lang/language";

import type { IArtifact } from "./Artifact";
import type { IChampion } from "./Champion";
import type { IChampionConfiguration } from "./ChampionConfiguration";
import type { IGameProgression, IGenerationMethod } from "./Configuration";
import type { IResults } from "./Results";

interface IWorkerCommand<T> {
  data: T;
}

export interface IResultsWorkerCommandGenerate {
  championConfigurations: IChampionConfiguration[];
  champions: IChampion[];
  artifacts: IArtifact[];
  generationMethod: IGenerationMethod;
  excludeWornArtifacts: boolean;
  gameProgression: IGameProgression;
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
  champion: number;
  command: "progress";
}

export type IResultsWorkerEventGenerate = IWorkerCommand<IResultsWorkerCommandGenerate>;

type IResultsWorkerEventDone = IWorkerCommand<IResultsWorkerCommandDone>;

type IResultsWorkerEventMessage = IWorkerCommand<IResultsWorkerCommandMessage>;

type IResultsWorkerEventProgress = IWorkerCommand<IResultsWorkerCommandProgress>;

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
