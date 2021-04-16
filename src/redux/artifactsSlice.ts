import {
  PayloadAction,
  createSlice,
  ThunkAction,
  Action,
  Dispatch,
} from "@reduxjs/toolkit";

import type {
  IArtifact,
  IArtifactBase,
  IArtifactDraft,
  IArtifactsState,
  IResponseArtifact,
  IStatsFull,
  IStatus,
} from "../models";
import calculateScoreRealStats from "../process/calculateScoreRealStats";
import services from "../service/artifact";

import type { IState } from "./reducers";

const initialState: IArtifactsState = {
  data: [],
  status: "Idle",
};

type IArtifactsLoadAction = PayloadAction<{
  artifacts: IArtifact[];
}>;
type IArtifactsUpdateAction = PayloadAction<{
  id: number;
  artifact: IArtifact;
}>;
type IArtifactsDeleteAction = PayloadAction<{ id: number }>;
type IArtifactsCreateAction = PayloadAction<IArtifact>;
type IArtifactsCreatePrepare = IArtifactDraft;

type IArtifactsSetStatusAction = PayloadAction<IStatus>;

const artifactsSlice = createSlice({
  initialState,
  name: "artifacts",
  reducers: {
    createArtifacts: {
      prepare: (artifact: IArtifactsCreatePrepare) => {
        const Power = calculateScoreRealStats(artifact as IArtifact);
        const newArtifact = { ...artifact, Power } as IArtifact;
        return { payload: newArtifact };
      },
      reducer: (state, action: IArtifactsCreateAction) => {
        state.data.push(action.payload);
        state.status = "Done";
      },
    },
    deleteArtifacts: (state, action: IArtifactsDeleteAction) => {
      state.data = state.data.filter((i) => i.Id !== action.payload.id);
    },
    loadArtifacts: (state, action: IArtifactsLoadAction) => {
      state.data = action.payload.artifacts;
      state.status = "Done";
    },
    updateArtifacts: (state, action: IArtifactsUpdateAction) => {
      const artifactIndex = state.data.findIndex(
        (i) => i.Id === action.payload.id
      );

      if (artifactIndex !== -1) {
        const artifact = state.data[artifactIndex];
        state.data[artifactIndex] = {
          ...artifact,
          ...action.payload.artifact,
        } as IArtifact;
      }
    },
    setStatus: (state, action: IArtifactsSetStatusAction) => {
      state.status = action.payload;
    },
  },
});

export const { loadArtifacts } = artifactsSlice.actions;

const {
  createArtifacts,
  deleteArtifacts,
  updateArtifacts,
  setStatus,
} = artifactsSlice.actions;

export default artifactsSlice.reducer;

export const convertResponseToArtifact = (
  artifact: IResponseArtifact
): IArtifactBase => {
  const Clan = artifact.clan ?? "";
  const Set = artifact.sets ?? "";

  return {
    Id: artifact.id,
    Slot: artifact.slot,
    Set,
    Clan,
    Rarity: artifact.rarity,
    Quality: artifact.quality,
    Level: artifact.level,
    MainStats: artifact.main_stats,
    MainStatsValue: artifact.main_value,
    Champion: artifact.champion_id,
    isAccessory: artifact.sets === null,
    SubStats: [
      artifact.sub_stats[0],
      artifact.sub_stats[1],
      artifact.sub_stats[2],
      artifact.sub_stats[3],
    ],
    Power: artifact.power,
  };
};

export const convertArtifactToResponse = (
  artifact: IArtifactBase
): IResponseArtifact => {
  const clan = artifact.Clan ?? "";
  const sets = artifact.Set ?? "";

  return {
    id: artifact.Id,
    slot: artifact.Slot,
    sets,
    clan,
    rarity: artifact.Rarity,
    quality: artifact.Quality,
    level: artifact.Level,
    main_stats: artifact.MainStats,
    main_value: artifact.MainStatsValue as number,
    champion_id: artifact.Champion,
    // isAccessory: artifact.sets === null,
    sub_stats: artifact.SubStats.filter(
      (sub) => sub !== undefined
    ) as IStatsFull[],
    power: artifact.Power,
  };
};

const errorThunkResult = (error?: () => void): (() => void) => () => {
  if (error) {
    error();
  }
};

export const createArtifactsThunk = (
  artifactData: IArtifactBase,
  success?: (data: IResponseArtifact) => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const token = getState().account.token;

    if (!token) {
      return;
    }

    const artifact = convertArtifactToResponse(artifactData);

    return services.createArtifact(
      token,
      artifact,
      (data) => {
        const artifactResponse = convertResponseToArtifact(data);

        dispatch(createArtifacts(artifactResponse));

        if (success) {
          success(data);
        }
      },
      errorThunkResult(error)
    );
  };
};

export const loadArtifactsThunk = (
  success?: (data: IResponseArtifact[]) => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const currentStatus = getState().artifacts.status;
    const token = getState().account.token;

    if (currentStatus !== "Idle") {
      return;
    }

    if (!token) {
      return;
    }

    dispatch(setStatus("Progress"));

    return services.getArtifacts(
      token,
      (data) => {
        const artifacts = data
          .map(convertResponseToArtifact)
          .filter((c) => c !== undefined) as IArtifact[];

        dispatch(
          loadArtifacts({
            artifacts,
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

export const updateArtifactsThunk = (
  id: number,
  artifactData: IArtifactBase,
  success?: (data: IResponseArtifact) => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const token = getState().account.token;

    if (!token) {
      return;
    }

    const artifact = convertArtifactToResponse(artifactData);

    return services.updateArtifact(
      token,
      id,
      artifact,
      (data) => {
        const artifactResponse = convertResponseToArtifact(data);

        dispatch(
          updateArtifacts({
            artifact: artifactResponse as IArtifact,
            id: artifactResponse.Id,
          })
        );

        if (success) {
          success(data);
        }
      },
      errorThunkResult(error)
    );
  };
};

export const deleteArtifactsThunk = (
  id: number,
  success?: () => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const token = getState().account.token;

    if (!token) {
      return;
    }

    return services.deleteArtifact(
      token,
      id,
      (data) => {
        dispatch(
          deleteArtifacts({
            id: data.deleted_id,
          })
        );

        if (success) {
          success();
        }
      },
      errorThunkResult(error)
    );
  };
};
