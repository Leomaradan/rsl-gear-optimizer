import {
  ChampionsState,
  ChampionDraft,
  Champion,
  ChampionsClanList,
} from "models";
import reorder from "process/reorder";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { v4 as uuidv4 } from "uuid";

const initialState: ChampionsState = [];

type ChampionsLoadAction = PayloadAction<{
  champions: ChampionDraft[];
}>;
type ChampionsUpdateAction = PayloadAction<{
  id: string;
  champion: Partial<Champion>;
}>;
type ChampionsReorderAction = PayloadAction<{
  id: string;
  newOrder: number;
}>;
type ChampionsToggleAction = PayloadAction<{
  id: string;
}>;
type ChampionsDeleteAction = PayloadAction<{ id: string }>;
type ChampionsCreateAction = PayloadAction<{
  champion: ChampionDraft;
}>;

const getLastOrder = (state: ChampionsState) =>
  state.reduce((max, current) => {
    if (current.order > max) {
      return current.order;
    }
    return max;
  }, 0);

const championsSlice = createSlice({
  name: "champions",
  initialState,
  reducers: {
    loadChampions: (_state, action: ChampionsLoadAction) => {
      const state: ChampionsState = [];

      action.payload.champions.forEach((champion) => {
        const lastOrder = getLastOrder(state);

        const newChampion: Champion = {
          ...champion,
          Guid: uuidv4(),
          order: lastOrder + 1,
          Activated: true,
          Clan: ChampionsClanList[champion.Champion],
        };

        state.push(newChampion);
      });

      return state;
    },
    updateChampions: (state, action: ChampionsUpdateAction) => {
      const championIndex = state.findIndex(
        (i) => i.Guid === action.payload.id
      );

      if (championIndex !== -1) {
        // eslint-disable-next-line no-param-reassign
        state[championIndex] = {
          ...state[championIndex],
          ...action.payload.champion,
        };

        // eslint-disable-next-line no-param-reassign
        state[championIndex].Clan =
          ChampionsClanList[state[championIndex].Champion];
      }
    },
    reorderChampions: (state, action: ChampionsReorderAction) => {
      const flatState: Champion[] = JSON.parse(JSON.stringify(state));

      const element = flatState.find(
        (champion) => champion.Guid === action.payload.id
      );

      if (element) {
        return reorder(flatState, element, action.payload.newOrder);
      }

      return state;
    },
    toggleChampions: (state, action: ChampionsToggleAction) =>
      state.map((i) =>
        i.Guid === action.payload.id ? { ...i, Activated: !i.Activated } : i
      ),
    deleteChampions: (state, action: ChampionsDeleteAction) =>
      state.filter((i) => i.Guid !== action.payload.id),
    createChampions: (state, action: ChampionsCreateAction) => {
      const lastOrder = getLastOrder(state);

      const newChampion: Champion = {
        ...action.payload.champion,
        Guid: uuidv4(),
        order: lastOrder + 1,
        Activated: true,
        Clan: ChampionsClanList[action.payload.champion.Champion],
      };

      state.push(newChampion);
    },
  },
});

export const {
  createChampions,
  deleteChampions,
  loadChampions,
  updateChampions,
  reorderChampions,
} = championsSlice.actions;

export default championsSlice.reducer;
