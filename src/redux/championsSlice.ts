import {
  ChampionsState,
  ChampionDraft,
  Champion,
  ChampionsClanList,
} from "models";
import reorder from "process/reorder";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ChampionsState = [];

type ChampionsLoadAction = PayloadAction<{
  champions: ChampionDraft[];
}>;
type ChampionsUpdateAction = PayloadAction<{
  name: string;
  champion: Partial<Champion>;
}>;
type ChampionsReorderAction = PayloadAction<{
  name: string;
  newOrder: number;
}>;
type ChampionsToggleAction = PayloadAction<{
  name: string;
}>;
type ChampionsDeleteAction = PayloadAction<{ name: string }>;
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
        let name = champion.champion;

        const champ = state.filter((s) => s.champion === name);

        if (champ.length > 0) {
          name += champ.length;
        }

        state.push({
          ...champion,
          order: lastOrder + 1,
          name,
          activated: true,
          clan: ChampionsClanList[champion.champion],
        });
      });

      return state;
    },
    updateChampions: (state, action: ChampionsUpdateAction) => {
      const championIndex = state.findIndex(
        (i) => i.name === action.payload.name
      );

      if (championIndex !== -1) {
        // eslint-disable-next-line no-param-reassign
        state[championIndex] = {
          ...state[championIndex],
          ...action.payload.champion,
        };

        // eslint-disable-next-line no-param-reassign
        state[championIndex].clan =
          ChampionsClanList[state[championIndex].champion];
      }
    },
    reorderChampions: (state, action: ChampionsReorderAction) => {
      const flatState: Champion[] = JSON.parse(JSON.stringify(state));

      const element = flatState.find(
        (champion) => champion.name === action.payload.name
      );

      if (element) {
        return reorder(flatState, element, action.payload.newOrder);
      }

      return state;
    },
    toggleChampions: (state, action: ChampionsToggleAction) =>
      state.map((i) =>
        i.name === action.payload.name ? { ...i, activated: !i.activated } : i
      ),
    deleteChampions: (state, action: ChampionsDeleteAction) =>
      state.filter((i) => i.name !== action.payload.name),
    createChampions: (state, action: ChampionsCreateAction) => {
      const lastOrder = getLastOrder(state);

      let name = action.payload.champion.champion;

      const champ = state.filter((s) => s.champion === name);

      if (champ.length > 0) {
        name += champ.length;
      }

      state.push({
        ...action.payload.champion,
        order: lastOrder + 1,
        name,
        activated: true,
        clan: ChampionsClanList[action.payload.champion.champion],
      });
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
