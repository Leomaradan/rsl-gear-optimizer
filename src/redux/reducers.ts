import artifactsSlice from "./artifactsSlice";
import championConfigurationsSlice from "./championConfigurationsSlice";
import championsSlice from "./championsSlice";
import configurationSlice from "./configurationSlice";
import resultsSlice from "./resultsSlice";

import type {
  IArtifactsState,
  IChampionConfigurationsState,
  IChampionsState,
  IConfigurationState,
  IResultsState,
} from "../models";

import { combineReducers } from "@reduxjs/toolkit";

export default combineReducers({
  artifacts: artifactsSlice,
  championConfigurations: championConfigurationsSlice,
  champions: championsSlice,
  configuration: configurationSlice,
  results: resultsSlice,
});

export interface IState {
  artifacts: IArtifactsState;
  championConfigurations: IChampionConfigurationsState;
  champions: IChampionsState;
  configuration: IConfigurationState;
  results: IResultsState;
}
