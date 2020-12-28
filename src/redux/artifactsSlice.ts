import type { IArtifact, IArtifactDraft, IArtifactsState } from "models";
import calculateScoreRealStats from "process/calculateScoreRealStats";

import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: IArtifactsState = [];

type IArtifactsLoadAction = PayloadAction<{
  artifacts: IArtifact[];
}>;
type IArtifactsUpdateAction = PayloadAction<{
  id: string;
  artifact: Partial<IArtifact>;
}>;
type IArtifactsDeleteAction = PayloadAction<{ id: string }>;
type IArtifactsCreateAction = PayloadAction<IArtifact>;
type IArtifactsCreatePrepare = IArtifactDraft;

const artifactsSlice = createSlice({
  name: "artifacts",
  initialState,
  reducers: {
    loadArtifacts: (_state, action: IArtifactsLoadAction) =>
      action.payload.artifacts,
    updateArtifacts: (state, action: IArtifactsUpdateAction) => {
      const artifactIndex = state.findIndex(
        (i) => i.Guid === action.payload.id
      );

      if (artifactIndex !== -1) {
        const artifact = state[artifactIndex];
        // eslint-disable-next-line no-param-reassign
        state[artifactIndex] = {
          ...artifact,
          ...action.payload.artifact,
        } as IArtifact;
      }
    },
    deleteArtifacts: (state, action: IArtifactsDeleteAction) =>
      state.filter((i) => i.Guid !== action.payload.id),
    createArtifacts: {
      reducer: (state, action: IArtifactsCreateAction) => {
        state.push(action.payload);
      },
      prepare: (artifact: IArtifactsCreatePrepare) => {
        const Power = calculateScoreRealStats(artifact as IArtifact);
        const newArtifact = { ...artifact, Power } as IArtifact;
        return { payload: newArtifact };
      },
    },
  },
});

export const {
  createArtifacts,
  deleteArtifacts,
  loadArtifacts,
  updateArtifacts,
} = artifactsSlice.actions;

export default artifactsSlice.reducer;
