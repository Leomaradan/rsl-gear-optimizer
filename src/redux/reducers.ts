import { combineReducers } from "@reduxjs/toolkit";
import {
  ArtifactsState,
  ResultsState,
  ChampionsState,
  ConfigurationState,
} from "models/Redux";
import resultsSlice from "./resultsSlice";
import championsSlice from "./championsSlice";
import artifactsSlice from "./artifactsSlice";
import configurationSlice from "./configurationSlice";

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
