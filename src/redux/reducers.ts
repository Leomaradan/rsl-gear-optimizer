import resultsSlice from "./resultsSlice";
import championConfigurationsSlice from "./championConfigurationsSlice";
import championsSlice from "./championsSlice";
import artifactsSlice from "./artifactsSlice";
import configurationSlice from "./configurationSlice";

import type {
  IArtifactsState,
  IChampionConfigurationsState,
  IChampionsState,
  IConfigurationState,
  IResultsState,
} from "models";

import { combineReducers } from "@reduxjs/toolkit";

export default combineReducers({
  artifacts: artifactsSlice,
  results: resultsSlice,
  champions: championsSlice,
  championConfigurations: championConfigurationsSlice,
  configuration: configurationSlice,
});

export interface IState {
  artifacts: IArtifactsState;
  results: IResultsState;
  champions: IChampionsState;
  championConfigurations: IChampionConfigurationsState;
  configuration: IConfigurationState;
}
