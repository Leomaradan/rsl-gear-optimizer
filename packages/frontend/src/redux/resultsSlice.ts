/* eslint-disable no-param-reassign */
import type { IResults, IResultsState } from "../models";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IResultsState = {
  data: [],
  status: "Ready",
};

type IResultsGenerateAction = PayloadAction<IResults[]>;

const resultsSlice = createSlice({
  initialState,
  name: "results",
  reducers: {
    resultsDoneGeneration: (state, action: IResultsGenerateAction) => {
      state.data = action.payload;
      state.status = "Done";
    },
    resultsStartGeneration: (state) => {
      state.status = "Processing";
      state.data = [];
    },
  },
});

export const {
  resultsDoneGeneration,
  resultsStartGeneration,
} = resultsSlice.actions;

export default resultsSlice.reducer;
