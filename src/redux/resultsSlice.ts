/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ResultsState } from "models/Redux";
import { Results, ResultsStatus } from "models/Results";

const initialState: ResultsState = {
  data: [],
  status: ResultsStatus.Ready,
};

export type ResultsGenerateAction = PayloadAction<Results[]>;

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    resultsInitialize: () => {
      return initialState;
    },
    resultsStartGeneration: (state) => {
      state.status = ResultsStatus.Processing;
    },
    resultsDoneGeneration: (state, action: ResultsGenerateAction) => {
      state.data = action.payload;
      state.status = ResultsStatus.Done;
    },
  },
});

export const {
  resultsDoneGeneration,
  resultsInitialize,
  resultsStartGeneration,
} = resultsSlice.actions;

export default resultsSlice.reducer;
