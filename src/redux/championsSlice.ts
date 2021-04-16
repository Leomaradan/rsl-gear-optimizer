import {
  PayloadAction,
  createSlice,
  Dispatch,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import ChampionsData from "raid-data";
import ChampionsIds from "raid-data/champions-by-id.json";

import { ChampionsDetailsList } from "../data";
import type {
  IAura,
  IAuraType,
  IChampion,
  IChampionAffinity,
  IChampionDraft,
  IChampionsState,
  IResponseChampion,
  IStatus,
} from "../models";
import services from "../service/champion";

import type { IState } from "./reducers";

const initialState: IChampionsState = {
  data: [],
  status: "Idle",
};

type IChampionsLoadAction = PayloadAction<{
  champions: IChampionDraft[];
}>;
type IChampionsUpdateAction = PayloadAction<{
  id: number;
  champion: Partial<IChampion>;
}>;

type IChampionsDeleteAction = PayloadAction<{ id: number }>;
type IChampionsCreateAction = PayloadAction<{
  champion: IChampionDraft;
}>;

type IChampionsSetStatusAction = PayloadAction<IStatus>;

const championsSlice = createSlice({
  initialState,
  name: "champions",
  reducers: {
    createChampion: (state, action: IChampionsCreateAction) => {
      const count = state.data.filter(
        (c) => c.Name === action.payload.champion.Name
      ).length;

      let Slug = action.payload.champion.Name.replace("_", "-");

      if (count > 0) {
        Slug += `-${count + 1}`;
      }

      const newChampion: IChampion = {
        ...action.payload.champion,
        Slug,
        ...ChampionsDetailsList[action.payload.champion.Name],
      };

      state.data.push(newChampion);
    },
    deleteChampion: (state, action: IChampionsDeleteAction) => {
      state.data = state.data.filter((i) => i.Id !== action.payload.id);
    },
    loadChampions: (state, action: IChampionsLoadAction) => {
      const data: IChampion[] = [];

      action.payload.champions.forEach((champion) => {
        const count = data.filter((c) => c.Name === champion.Name).length;

        let Slug = champion.Name.replace("_", "-");

        if (count > 0) {
          Slug += `-${count + 1}`;
        }

        const newChampion: IChampion = {
          ...champion,
          Slug,
          ...ChampionsDetailsList[champion.Name],
        };

        data.push(newChampion);
      });

      state.data = data;
      state.status = "Done";
    },
    updateChampion: (state, action: IChampionsUpdateAction) => {
      const championIndex = state.data.findIndex(
        (i) => i.Id === action.payload.id
      );

      if (championIndex !== -1) {
        state.data[championIndex] = {
          ...state.data[championIndex],
          ...action.payload.champion,
        };

        state.data[championIndex] = {
          ...state.data[championIndex],
          ...ChampionsDetailsList[state.data[championIndex].Name],
        };
      }
    },
    setStatus: (state, action: IChampionsSetStatusAction) => {
      state.status = action.payload;
    },
  },
});

export const { loadChampions } = championsSlice.actions;

const { setStatus, deleteChampion } = championsSlice.actions;

export default championsSlice.reducer;

const ucfirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const splitAura = (aura: string): IAura => {
  const [auraType, auraDomainAffinity, auraValue] = aura.split(" - ");

  const [auraDomain, auraAffinity] = auraDomainAffinity.split("(");

  let auraDomainTyped: any = auraDomain.trim();
  let auraAffinityTyped: any = undefined;

  if (auraDomainTyped === "Faction Wars") {
    auraDomainTyped = "Faction Crypts";
  }

  if (auraDomainTyped === "All") {
    auraDomainTyped = undefined;
  }

  if (auraAffinity) {
    auraAffinityTyped = ucfirst(auraAffinity.replace(")", "").trim());
  }
  return {
    type: auraType as IAuraType,
    value: Number.parseInt(auraValue.replace("%", "")),
    domain: auraDomainTyped,
    affinity: auraAffinityTyped,
  };
};

export const convertResponseToChampion = (
  champion: IResponseChampion
): IChampionDraft | undefined => {
  const refStr = String(champion.champion_ref);
  const championId = ChampionsIds.find((c) => (c.id as string) === refStr);

  if (championId) {
    const championData =
      ChampionsData[championId.name as keyof typeof ChampionsData];
    const aura =
      (championData as any).aura !== undefined
        ? splitAura((championData as any).aura)
        : undefined;

    return {
      Affinity: ucfirst(championData.affinity) as IChampionAffinity,
      Awaken: champion.awaken,
      BaseAccuracy: champion.base_acc,
      BaseAttack: champion.base_atk,
      BaseCriticalDamage: champion.base_cdmg,
      BaseCriticalRate: champion.base_crate,
      BaseDefense: champion.base_def,
      BaseHP: champion.base_hp,
      BaseResistance: champion.base_res,
      BaseSpeed: champion.base_spd,
      CurrentAccuracy: champion.acc,
      CurrentAttack: champion.atk,
      CurrentCriticalDamage: champion.cdmg,
      CurrentCriticalRate: champion.crate,
      CurrentDefense: champion.def,
      CurrentHP: champion.hp,
      CurrentResistance: champion.res,
      CurrentSpeed: champion.spd,
      Id: champion.id,
      InVault: champion.vault,
      Level: champion.level,
      Masteries: champion.masteries,
      Name: championId.name as string,
      Power: champion.power,
      Quality: champion.quality,
      Aura: aura,
    };
  } else {
    console.error("Unknown champion: ", champion.champion_ref, champion);
  }
};

export const convertChampionToResponse = (
  champion: IChampionDraft
): IResponseChampion => {
  const championId = ChampionsIds.find(
    (c) => (c.key as string) === champion.Name
  );

  if (!championId) {
    console.log("championId not found", { ChampionsIds, champion });
  }

  return {
    champion_ref: parseInt((championId as any).id, 10),
    awaken: champion.Awaken,
    base_acc: champion.BaseAccuracy,
    base_atk: champion.BaseAttack,
    base_cdmg: champion.BaseCriticalDamage,
    base_crate: champion.BaseCriticalRate,
    base_def: champion.BaseDefense,
    base_hp: champion.BaseHP,
    base_res: champion.BaseResistance,
    base_spd: champion.BaseSpeed,
    acc: champion.CurrentAccuracy,
    atk: champion.CurrentAttack,
    cdmg: champion.CurrentCriticalDamage,
    crate: champion.CurrentCriticalRate,
    def: champion.CurrentDefense,
    hp: champion.CurrentHP,
    res: champion.CurrentResistance,
    spd: champion.CurrentSpeed,
    id: champion.Id,
    vault: champion.InVault,
    level: champion.Level,
    masteries: champion.Masteries,
    power: champion.Power,
    quality: champion.Quality,
  };
};

export const loadChampionsThunk = (
  success?: (data: IResponseChampion[]) => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const currentStatus = getState().champions.status;
    const token = getState().account.token;

    console.log({ currentStatus, token });
    if (currentStatus !== "Idle") {
      return;
    }

    if (!token) {
      return;
    }

    dispatch(setStatus("Progress"));

    return services.getChampions(
      token,
      (data) => {
        const champions = data
          .map(convertResponseToChampion)
          .filter((c) => c !== undefined) as IChampionDraft[];

        dispatch(
          loadChampions({
            champions,
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

export const deleteChampionThunk = (
  id: number,
  success?: () => void,
  error?: () => void
): ThunkAction<void, IState, null, Action<unknown>> => {
  return (dispatch: Dispatch, getState: () => IState) => {
    const token = getState().account.token;

    if (!token) {
      return;
    }

    return services.deleteChampion(
      token,
      id,
      (data) => {
        deleteChampion({ id: data.deleted_id as any });

        if (success) {
          success();
        }
      },
      () => {
        if (error) {
          error();
        }
      }
    );
  };
};
