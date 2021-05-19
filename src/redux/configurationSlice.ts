import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import type { IConfigurationOptions, IConfigurationState } from "../models";

// TEMP
import { configuration } from "./defaultState.json";

const greatHallBonusAffinity = {
  ACC: 0,
  "ATK%": 0,
  "C.DMG": 0,
  "DEF%": 0,
  "HP%": 0,
  RESI: 0,
};

const initialState: IConfigurationState = configuration as any; /*{
  arenaRank: "B1",
  artifactsDisplay: "Table",
  excludeWornArtifact: true,
  generationMethod: "RealValue",
  greatHallBonus: {
    Force: greatHallBonusAffinity,
    Magic: greatHallBonusAffinity,
    Spirit: greatHallBonusAffinity,
    Void: greatHallBonusAffinity,
  },
}*/

type IConfigurationSetOptionAction = PayloadAction<{
  option: IConfigurationOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}>;

const configurationSlice = createSlice({
  initialState,
  name: "configuration",
  reducers: {
    setOption: (state, action: IConfigurationSetOptionAction) => {
      return { ...state, [action.payload.option]: action.payload.value };
    },
  },
});

export const { setOption } = configurationSlice.actions;

export default configurationSlice.reducer;
