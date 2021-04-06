import { ChampionsDetailsList } from "../data";
import type { IChampion, IChampionDraft, IChampionsState } from "../models";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IChampionsState = [];

type IChampionsLoadAction = PayloadAction<{
  champions: IChampionDraft[];
}>;
type IChampionsUpdateAction = PayloadAction<{
  id: string;
  champion: Partial<IChampion>;
}>;

type IChampionsDeleteAction = PayloadAction<{ id: string }>;
type IChampionsCreateAction = PayloadAction<{
  champion: IChampionDraft;
}>;

const championsSlice = createSlice({
  initialState,
  name: "champions",
  reducers: {
    createChampion: (state, action: IChampionsCreateAction) => {
      const count = state.filter((c) => c.Name === action.payload.champion.Name)
        .length;

      let Slug = action.payload.champion.Name.replace("_", "-");

      if (count > 0) {
        Slug += `-${count + 1}`;
      }

      const newChampion: IChampion = {
        ...action.payload.champion,
        Slug,
        ...ChampionsDetailsList[action.payload.champion.Name],
      };

      state.push(newChampion);
    },
    deleteChampion: (state, action: IChampionsDeleteAction) =>
      state.filter((i) => i.Guid !== action.payload.id),
    loadChampions: (_state, action: IChampionsLoadAction) => {
      const state: IChampionsState = [];

      action.payload.champions.forEach((champion) => {
        const count = state.filter((c) => c.Name === champion.Name).length;

        let Slug = champion.Name.replace("_", "-");

        if (count > 0) {
          Slug += `-${count + 1}`;
        }

        const newChampion: IChampion = {
          ...champion,
          Slug,
          ...ChampionsDetailsList[champion.Name],
        };

        state.push(newChampion);
      });

      return state;
    },
    updateChampion: (state, action: IChampionsUpdateAction) => {
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
        state[championIndex] = {
          ...state[championIndex],
          ...ChampionsDetailsList[state[championIndex].Name],
        };
      }
    },
  },
});

export const {
  createChampion,
  deleteChampion,
  loadChampions,
  updateChampion,
} = championsSlice.actions;

export default championsSlice.reducer;
