import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import type {
  IChampionConfiguration,
  IChampionConfigurationsState,
} from "../models";
import reorder from "../process/reorder";

const initialState: IChampionConfigurationsState = [];

type IChampionsLoadAction = PayloadAction<{
  championConfigurations: IChampionConfiguration[];
}>;
type IChampionsUpdateAction = PayloadAction<{
  id: string;
  championConfiguration: Partial<IChampionConfiguration>;
}>;
type IChampionsReorderAction = PayloadAction<{
  id: string;
  newOrder: number;
}>;
type IChampionsToggleAction = PayloadAction<{
  id: string;
}>;
type IChampionsDeleteAction = PayloadAction<{ id: string }>;
type IChampionsCreateAction = PayloadAction<{
  championConfiguration: IChampionConfiguration;
}>;

const getLastOrder = (state: IChampionConfigurationsState) =>
  state.reduce((max, current) => {
    if (current.order > max) {
      return current.order;
    }
    return max;
  }, 0);

const championConfigurationsSlice = createSlice({
  initialState,
  name: "championConfigurations",
  reducers: {
    createChampionConfigurations: (state, action: IChampionsCreateAction) => {
      const lastOrder = getLastOrder(state);

      const newChampion: IChampionConfiguration = {
        ...action.payload.championConfiguration,
        Activated: true,
        Guid: uuidv4(),
        order: lastOrder + 1,
      };

      state.push(newChampion);
    },
    deleteChampionConfigurations: (state, action: IChampionsDeleteAction) =>
      state.filter((i) => i.Guid !== action.payload.id),
    loadChampionConfigurations: (_state, action: IChampionsLoadAction) => {
      const state: IChampionConfigurationsState = [];

      action.payload.championConfigurations.forEach((champion) => {
        const lastOrder = getLastOrder(state);

        const newChampion: IChampionConfiguration = {
          ...champion,
          order: lastOrder + 1,
        };

        state.push(newChampion);
      });

      return state;
    },
    reorderChampionConfigurations: (state, action: IChampionsReorderAction) => {
      const flatState: IChampionConfiguration[] = JSON.parse(
        JSON.stringify(state)
      );

      const element = flatState.find(
        (champion) => champion.Guid === action.payload.id
      );

      if (element) {
        return reorder(flatState, element, action.payload.newOrder);
      }

      return state;
    },
    toggleChampionConfigurations: (state, action: IChampionsToggleAction) =>
      state.map((i) =>
        i.Guid === action.payload.id ? { ...i, Activated: !i.Activated } : i
      ),
    updateChampionConfigurations: (state, action: IChampionsUpdateAction) => {
      const championIndex = state.findIndex(
        (i) => i.Guid === action.payload.id
      );

      if (championIndex !== -1) {
        // eslint-disable-next-line no-param-reassign
        state[championIndex] = {
          ...state[championIndex],
          ...action.payload.championConfiguration,
        };
      }
    },
  },
});

export const {
  createChampionConfigurations,
  deleteChampionConfigurations,
  loadChampionConfigurations,
  reorderChampionConfigurations,
  updateChampionConfigurations,
} = championConfigurationsSlice.actions;

export default championConfigurationsSlice.reducer;
