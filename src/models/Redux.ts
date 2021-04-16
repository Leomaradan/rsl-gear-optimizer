import type { IArtifact } from "./Artifact";
import type { IChampion } from "./Champion";
import type { IChampionConfiguration } from "./ChampionConfiguration";
import type {
  IArenaRank,
  IArtifactsDisplayMode,
  IGenerationMethod,
  IGreatHallBonus,
} from "./Configuration";
import type { IResults, IResultsStatus } from "./Results";

export interface IResultsState {
  data: IResults[];
  status: IResultsStatus;
}

export type IStatus = "Idle" | "Progress" | "Done" | "Error";

interface IWithStatus {
  status: IStatus;
}

export interface IAccountState extends IWithStatus {
  username?: string;
  email?: string;
  language?: string;
  token?: string; // Put the token here for using it in thunk easily
  importStatus: "Idle" | "Progress";
}

export interface IConfigurationState {
  artifactsDisplay: IArtifactsDisplayMode;
  excludeWornArtifact: boolean;
  generationMethod: IGenerationMethod;
  greatHallBonus: IGreatHallBonus;
  arenaRank: IArenaRank;
}

export type IConfigurationOptions = keyof IConfigurationState;

export interface IChampionConfigurationsState extends IWithStatus {
  data: IChampionConfiguration[];
}

export interface IChampionsState extends IWithStatus {
  data: IChampion[];
}

export interface IArtifactsState extends IWithStatus {
  data: IArtifact[];
}
