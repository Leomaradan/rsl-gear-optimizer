import type { IConfigurationOptions, IConfigurationState } from "models";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const greatHallBonusAffinity = {
  "ATK%": 0,
  "C.DMG": 0,
  "DEF%": 0,
  "HP%": 0,
  ACC: 0,
  RESI: 0,
};

const initialState: IConfigurationState = {
  artifactsDisplay: "Table",
  excludeWornArtifact: true,
  generationMethod: "RealValue",
  arenaRank: "B1",
  greatHallBonus: {
    Force: greatHallBonusAffinity,
    Magic: greatHallBonusAffinity,
    Spirit: greatHallBonusAffinity,
    Void: greatHallBonusAffinity,
  },
};

type IConfigurationSetOptionAction = PayloadAction<{
  option: IConfigurationOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}>;

const configurationSlice = createSlice({
  name: "configuration",
  initialState,
  reducers: {
    setOption: (state, action: IConfigurationSetOptionAction) => {
      return { ...state, [action.payload.option]: action.payload.value };
    },
  },
});

export const { setOption } = configurationSlice.actions;

export default configurationSlice.reducer;
