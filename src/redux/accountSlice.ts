import {
  PayloadAction,
  createSlice,
  Dispatch,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";

import type {
  IAccountState,
  IArtifact,
  IChampionDraft,
  IResponseFormatedAccount,
  IStatus,
} from "../models";
import service from "../service/account";

import {
  convertArtifactToResponse,
  convertResponseToArtifact,
  loadArtifacts,
} from "./artifactsSlice";
import { loadChampionConfigurations } from "./championConfigurationsSlice";
import {
  convertChampionToResponse,
  convertResponseToChampion,
  loadChampions,
} from "./championsSlice";
import { setAllOption } from "./configurationSlice";
import type { IState } from "./reducers";

const initialState: IAccountState = {
  status: "Idle",
  importStatus: "Idle",
};

type IAccountSetValuesAction = PayloadAction<{
  value: IAccountState;
}>;

type IAccountSetStatusAction = PayloadAction<IStatus>;
type IAccountSetImportStatusAction = PayloadAction<"Idle" | "Progress">;

const accountSlice = createSlice({
  initialState,
  name: "account",
  reducers: {
    setAccount: (_state, action: IAccountSetValuesAction) =>
      action.payload.value,
    setStatus: (state, action: IAccountSetStatusAction) => {
      state.status = action.payload;
    },
    setImportStatus: (state, action: IAccountSetImportStatusAction) => {
      state.importStatus = action.payload;
    },
  },
});

const { setAccount, setStatus, setImportStatus } = accountSlice.actions;

export default accountSlice.reducer;

const successThunkResult = (
  dispatch: Dispatch,
  success?: (data: IResponseFormatedAccount) => void
): ((data: IResponseFormatedAccount) => void) => (
  data: IResponseFormatedAccount
) => {
  dispatch(
    setAllOption({
      value: data.configuration,
    })
  );

  dispatch(
    setAccount({
      value: {
        status: "Done",
        importStatus: "Idle",
        email: data.email,
        language: data.language,
        username: data.username,
        token: data.token,
      },
    })
  );

  if (success) {
    success(data);
  }
};

const errorThunkResult = (
  dispatch: Dispatch,
  error?: () => void
): (() => void) => () => {
  dispatch(
    setAccount({
      value: {
        status: "Idle",
        importStatus: "Idle",
      },
    })
  );

  if (error) {
    error();
  }
};

export const loginWithCredentialThunk = (
  email: string,
  password: string,
  success?: (data: IResponseFormatedAccount) => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const currentStatus = getState().account.status;

    if (currentStatus !== "Idle") {
      return;
    }

    dispatch(setStatus("Progress"));

    return service.login(
      email,
      password,
      successThunkResult(dispatch, success),
      errorThunkResult(dispatch, error)
    );
  };
};

export const loginWithTokenThunk = (
  token?: string,
  success?: (data: IResponseFormatedAccount) => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const currentStatus = getState().account.status;

    if (currentStatus !== "Idle") {
      return;
    }

    if (!token) {
      return;
    }

    dispatch(setStatus("Progress"));

    return service.getAccount(
      token,
      successThunkResult(dispatch, success),
      errorThunkResult(dispatch, error)
    );
  };
};

export const importDataThunk = (
  dataImport: {
    champions: IChampionDraft[];
    artifacts: IArtifact[];
  },
  success?: () => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const currentStatus = getState().account.importStatus;
    const token = getState().account.token;

    if (currentStatus !== "Idle") {
      return;
    }

    if (!token) {
      if (error) {
        error();
      }

      return;
    }

    dispatch(setImportStatus("Progress"));

    const champions = dataImport.champions.map(convertChampionToResponse);
    const artifacts = dataImport.artifacts.map(convertArtifactToResponse);

    return service.import(
      token,
      {
        champions,
        artifacts,
      },
      (data) => {
        const newChampions = data.champions.map(
          convertResponseToChampion
        ) as IChampionDraft[];
        const newArtifacts = data.artifacts.map(
          convertResponseToArtifact
        ) as IArtifact[];

        dispatch(loadChampions({ champions: newChampions }));
        dispatch(loadArtifacts({ artifacts: newArtifacts }));
        dispatch(loadChampionConfigurations({ championConfigurations: [] }));
        dispatch(setImportStatus("Idle"));
        if (success) {
          success();
        }
      },
      () => {
        dispatch(setImportStatus("Idle"));
        if (error) {
          error();
        }
      }
    );
  };
};
