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

export interface IConfigurationState {
  artifactsDisplay: IArtifactsDisplayMode;
  excludeWornArtifact: boolean;
  generationMethod: IGenerationMethod;
  greatHallBonus: IGreatHallBonus;
  arenaRank: IArenaRank;
}

export type IConfigurationOptions = keyof IConfigurationState;

export type IChampionConfigurationsState = IChampionConfiguration[];

export type IChampionsState = IChampion[];

export type IArtifactsState = IArtifact[];
