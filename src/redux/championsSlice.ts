import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import reorder from "process/reorder";
import { Champion, ChampionDraft } from "models/Champion";
import { ChampionsState } from "models/Redux";

const initialState: ChampionsState = [];

export type ChampionsLoadAction = PayloadAction<{
  champions: ChampionDraft[];
}>;
export type ChampionsUpdateAction = PayloadAction<{
  name: string;
  champion: Partial<Champion>;
}>;
export type ChampionsReorderAction = PayloadAction<{
  name: string;
  newOrder: number;
}>;
export type ChampionsToggleAction = PayloadAction<{
  name: string;
}>;
export type ChampionsDeleteAction = PayloadAction<{ name: string }>;
export type ChampionsCreateAction = PayloadAction<{
  champion: ChampionDraft;
}>;

const championsSlice = createSlice({
  name: "champions",
  initialState,
  reducers: {
    loadChampions: (_state, action: ChampionsLoadAction) => {
      const state: ChampionsState = [];

      action.payload.champions.forEach((champion) => {
        const lastOrder = state.reduce((max, current) => {
          if (current.order > max) {
            return current.order;
          }
          return max;
        }, 0);

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
      }
    },
    reorderChampions: (state, action: ChampionsReorderAction) => {
      const flatState: Champion[] = JSON.parse(JSON.stringify(state));

      const element = flatState.find(
        (champion) => champion.name === action.payload.name
      );

      if (element) {
        const result = reorder(flatState, element, action.payload.newOrder);

        return result;
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
      const lastOrder = state.reduce((max, current) => {
        if (current.order > max) {
          return current.order;
        }
        return max;
      }, 0);

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
