import {
  PayloadAction,
  createSlice,
  ThunkAction,
  Dispatch,
  Action,
} from "@reduxjs/toolkit";

import type {
  IConfigurationOptions,
  IConfigurationState,
  IResponseConfiguration,
} from "../models";
import type { IState } from "./reducers";

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

type IConfigurationSetAllOptionAction = PayloadAction<{
  value: IConfigurationState;
}>;

const configurationSlice = createSlice({
  initialState,
  name: "configuration",
  reducers: {
    setOption: (state, action: IConfigurationSetOptionAction) => {
      return { ...state, [action.payload.option]: action.payload.value };
    },
    setAllOption: (state, action: IConfigurationSetAllOptionAction) => {
      return { ...state, ...action.payload.value };
    },
  },
});

export const { setOption, setAllOption } = configurationSlice.actions;

export default configurationSlice.reducer;
