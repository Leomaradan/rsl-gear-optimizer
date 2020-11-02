import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ArtifactsDisplayMode, GenerationMethod } from "models/Configuration";

import { ConfigurationOptions, ConfigurationState } from "models/Redux";

const initialState: ConfigurationState = {
  artifactsDisplay: ArtifactsDisplayMode.Table,
  excludeWornArtifact: true,
  generationMethod: GenerationMethod.Easy,
};

export type ConfigurationSetOptionAction = PayloadAction<{
  option: ConfigurationOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}>;

const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    setOption: (state, action: ConfigurationSetOptionAction) => {
      return { ...state, [action.payload.option]: action.payload.value };
    },
  },
});

export const { setOption } = configurationSlice.actions;

export default configurationSlice.reducer;
