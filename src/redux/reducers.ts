import resultsSlice from "./resultsSlice";
import championsSlice from "./championsSlice";
import artifactsSlice from "./artifactsSlice";
import configurationSlice from "./configurationSlice";
import {
  ArtifactsState,
  ChampionsState,
  ConfigurationState,
  ResultsState,
} from "models";
import { combineReducers } from "@reduxjs/toolkit";

export default combineReducers({
  artifacts: artifactsSlice,
  results: resultsSlice,
  champions: championsSlice,
  configuration: configurationSlice,
});

export interface State {
  artifacts: ArtifactsState;
  results: ResultsState;
  champions: ChampionsState;
  configuration: ConfigurationState;
}
