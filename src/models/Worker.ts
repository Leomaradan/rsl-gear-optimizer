import { Champion } from "./Champion";
import { Artifact } from "./Artifact";
import { Results } from "./Results";
import { GenerationMethod } from "./Configuration";

type WorkerCommand<T> = {
  data: T;
};

interface ResultsWorkerCommandGenerate {
  champions: Champion[];
  artifacts: Artifact[];
  generationMethod: GenerationMethod;
  excludeWornArtifacts: boolean;
  command: "generate";
}

interface ResultsWorkerCommandDone {
  results: Results[];
  items: number;
  command: "done";
}

interface ResultsWorkerCommandMessage {
  message: string;
  command: "message";
}

interface ResultsWorkerCommandProgress {
  current: number;
  max?: number;
  task: string;
  champion: string;
  command: "progress";
}

export type ResultsWorkerEventGenerate = WorkerCommand<
  ResultsWorkerCommandGenerate
>;

type ResultsWorkerEventDone = WorkerCommand<ResultsWorkerCommandDone>;

type ResultsWorkerEventMessage = WorkerCommand<ResultsWorkerCommandMessage>;

type ResultsWorkerEventProgress = WorkerCommand<ResultsWorkerCommandProgress>;

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
