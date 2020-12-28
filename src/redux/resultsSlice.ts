/* eslint-disable no-param-reassign */
import type { IResults, IResultsState } from "models";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IResultsState = {
  data: [],
  status: "Ready",
};

type IResultsGenerateAction = PayloadAction<IResults[]>;

const resultsSlice = createSlice({
  name: "results",
  initialState,
  reducers: {
    resultsStartGeneration: (state) => {
      state.status = "Processing";
      state.data = [];
    },
    resultsDoneGeneration: (state, action: IResultsGenerateAction) => {
      state.data = action.payload;
      state.status = "Done";
    },
  },
});

export const {
  resultsDoneGeneration,
  resultsStartGeneration,
} = resultsSlice.actions;

export default resultsSlice.reducer;
