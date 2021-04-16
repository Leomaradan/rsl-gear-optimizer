import {
  PayloadAction,
  createSlice,
  ThunkAction,
  Action,
  Dispatch,
} from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import type {
  IChampionConfiguration,
  IChampionConfigurationsState,
  IResponseConfiguration,
  IStatus,
} from "../models";
import reorder from "../process/reorder";
import type { IState } from "./reducers";
import service from "../service/config";

const initialState: IChampionConfigurationsState = {
  data: [],
  status: "Idle",
};

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

type IChampionsSetStatusAction = PayloadAction<IStatus>;

const getLastOrder = (state: IChampionConfigurationsState) =>
  state.data.reduce((max, current) => {
    if (current.order > max) {
      return current.order;
    }
    return max;
  }, 0);

const championConfigurationsSlice = createSlice({
  initialState,
  name: "championConfigurations",
  reducers: {
    /*createChampionConfigurations: (state, action: IChampionsCreateAction) => {
      const lastOrder = getLastOrder(state);

      const newChampion: IChampionConfiguration = {
        ...action.payload.championConfiguration,
        Activated: true,
        Guid: uuidv4(),
        order: lastOrder + 1,
      };

      state.push(newChampion);
    },*/
    /*deleteChampionConfigurations: (state, action: IChampionsDeleteAction) =>
      state.filter((i) => i.Guid !== action.payload.id),*/
    loadChampionConfigurations: (_state, action: IChampionsLoadAction) => {
      const state: IChampionConfigurationsState = { data: [], status: "Done" };

      action.payload.championConfigurations.forEach((champion) => {
        const lastOrder = getLastOrder(state);

        const newChampion: IChampionConfiguration = {
          ...champion,
          order: lastOrder + 1,
        };

        state.data.push(newChampion);
      });

      return state;
    },
    setStatus: (state, action: IChampionsSetStatusAction) => {
      state.status = action.payload;
    },
    /*reorderChampionConfigurations: (state, action: IChampionsReorderAction) => {
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
    },*/
  },
});

/*export const {
  createChampionConfigurations,
  deleteChampionConfigurations,
  loadChampionConfigurations,
  reorderChampionConfigurations,
  updateChampionConfigurations,
} = championConfigurationsSlice.actions;*/

export const {
  loadChampionConfigurations,
} = championConfigurationsSlice.actions;

const { setStatus } = championConfigurationsSlice.actions;

export default championConfigurationsSlice.reducer;

const convertConfig = (
  config: IResponseConfiguration
): IChampionConfiguration | undefined => ({
  Accessories: config.accessories,
  Activated: config.activated,
  BootsStats: config.configuration.BootsStats,
  ChestplateStats: config.configuration.ChestplateStats,
  GauntletStats: config.configuration.GauntletStats,
  Id: config.id,
  Locked: config.locked,
  Methods: config.method,
  Sets: config.configuration.Sets,
  SourceChampion: config.champion_id,
  StatsPriority: config.configuration.StatsPriority,
  order: config.order,
  AmuletsStats: config.configuration.AmuletsStats,
  BannersStats: config.configuration.BannersStats,
  RingsStats: config.configuration.RingsStats,
});

export const loadConfigurationsThunk = (
  success?: (data: IResponseConfiguration[]) => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const currentStatus = getState().championConfigurations.status;
    const token = getState().account.token;

    if (currentStatus !== "Idle") {
      return;
    }

    if (!token) {
      return;
    }

    dispatch(setStatus("Progress"));

    return service.getConfigs(
      token,
      (data) => {
        const championConfigurations = data
          .map(convertConfig)
          .filter((c) => c !== undefined) as IChampionConfiguration[];

        dispatch(
          loadChampionConfigurations({
            championConfigurations,
          })
        );
        if (success) {
          success(data);
        }
      },
      () => {
        dispatch(setStatus("Error"));
        if (error) {
          error();
        }
      }
    );
  };
};
