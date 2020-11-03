import { Artifact, ArtifactDraft, ArtifactsState } from "models";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { v4 as uuidv4 } from "uuid";

const initialState: ArtifactsState = [];

type ArtifactsLoadAction = PayloadAction<{
  artifacts: ArtifactDraft[];
}>;
type ArtifactsUpdateAction = PayloadAction<{
  id: string;
  artifact: Partial<Artifact>;
}>;
type ArtifactsDeleteAction = PayloadAction<{ id: string }>;
type ArtifactsCreateAction = PayloadAction<Artifact>;
type ArtifactsCreatePrepare = ArtifactDraft;

const artifactsSlice = createSlice({
  name: "artifacts",
  initialState,
  reducers: {
    loadArtifacts: (_state, action: ArtifactsLoadAction) => {
      const state: ArtifactsState = [];

      action.payload.artifacts.forEach((artifact) => {
        const newArtifact = { ...artifact, Guid: uuidv4() } as Artifact;
        state.push(newArtifact);
      });

      return state;
    },
    updateArtifacts: (state, action: ArtifactsUpdateAction) => {
      const artifactIndex = state.findIndex(
        (i) => i.Guid === action.payload.id
      );

      if (artifactIndex !== -1) {
        const artifact = state[artifactIndex];
        // eslint-disable-next-line no-param-reassign
        state[artifactIndex] = {
          ...artifact,
          ...action.payload.artifact,
        } as Artifact;
      }
    },
    deleteArtifacts: (state, action: ArtifactsDeleteAction) =>
      state.filter((i) => i.Guid !== action.payload.id),
    createArtifacts: {
      reducer: (state, action: ArtifactsCreateAction) => {
        state.push(action.payload);
      },
      prepare: (artifact: ArtifactsCreatePrepare) => {
        const newArtifact = { ...artifact, Guid: uuidv4() } as Artifact;
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
