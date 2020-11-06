/* eslint-disable no-param-reassign */
import { Results, ResultsState, ResultsStatus } from "models";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ResultsState = {
  data: [],
  status: ResultsStatus.Ready,
};

type ResultsGenerateAction = PayloadAction<Results[]>;

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    resultsStartGeneration: (state) => {
      state.status = ResultsStatus.Processing;
      state.data = [];
    },
    resultsDoneGeneration: (state, action: ResultsGenerateAction) => {
      state.data = action.payload;
      state.status = ResultsStatus.Done;
    },
  },
});

export const {
  resultsDoneGeneration,
  resultsStartGeneration,
} = resultsSlice.actions;

export default resultsSlice.reducer;
