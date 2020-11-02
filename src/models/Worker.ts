import { Champion } from "./Champion";
import Artifact from "./Artifact";
import { Results } from "./Results";
import { GenerationMethod } from "./Configuration";

type WorkerCommand<T> = {
  data: T;
};

export interface ResultsWorkerCommandGenerate {
  champions: Champion[];
  artifacts: Artifact[];
  generationMethod: GenerationMethod;
  command: "generate";
}

export interface ResultsWorkerCommandDone {
  results: Results[];
  items: number;
  command: "done";
}

export interface ResultsWorkerCommandMessage {
  message: string;
  command: "message";
}

export interface ResultsWorkerCommandProgress {
  current: number;
  task: string;
  command: "progress";
}

export type ResultsWorkerEventGenerate = WorkerCommand<
  ResultsWorkerCommandGenerate
>;

export type ResultsWorkerEventDone = WorkerCommand<ResultsWorkerCommandDone>;

export type ResultsWorkerEventMessage = WorkerCommand<
  ResultsWorkerCommandMessage
>;

export type ResultsWorkerEventProgress = WorkerCommand<
  ResultsWorkerCommandProgress
>;

export type ResultsWorkerCommands =
  | ResultsWorkerCommandGenerate
  | ResultsWorkerCommandDone
  | ResultsWorkerCommandMessage
  | ResultsWorkerCommandProgress;

export type ResultsWorkerEvents =
  | ResultsWorkerEventGenerate
  | ResultsWorkerEventDone
  | ResultsWorkerEventMessage
  | ResultsWorkerEventProgress;
