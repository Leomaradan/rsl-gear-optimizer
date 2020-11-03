import { Champion } from "./Champion";
import { Artifact } from "./Artifact";
import { ArtifactsDisplayMode, GenerationMethod } from "./Configuration";
import { Results, ResultsStatus } from "./Results";

export interface ResultsState {
  data: Results[];
  status: ResultsStatus;
}

export interface ConfigurationState {
  artifactsDisplay: ArtifactsDisplayMode;
  excludeWornArtifact: boolean;
  generationMethod: GenerationMethod;
}

export type ConfigurationOptions = keyof ConfigurationState;

export type ChampionsState = Champion[];

export type ArtifactsState = Artifact[];
