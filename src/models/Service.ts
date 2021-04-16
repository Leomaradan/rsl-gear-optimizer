import type { IChampionMastery } from "./Champion";
import type {
  IChampionSetMethod,
  IChampionStatsPriority,
} from "./ChampionConfiguration";
import type { IClans } from "./Clans";
import type { IRarity, IStars } from "./Quality";
import type { IConfigurationState } from "./Redux";
import type { ISets } from "./Sets";
import type { ISlots } from "./Slots";
import type { IStat, IStatsFull } from "./Stat";

export interface IServiceProps<T> {
  success(data: T): void;
  fail?(errorMessage?: string): void;
}

export interface IResponseFormatedAccount {
  token: string;
  email: string;
  username: string;
  language: string;
  configuration: IConfigurationState;
}

export interface IQueryAccountOption extends IConfigurationState {
  language: string;
}

export interface IResponseAccount {
  id: number;
  username: string;
  email: string;
  token: string;
  language: string;
  option: {
    artifacts_display: boolean;
    exclude_worn_artifact: boolean;
    generation_method: string;
    arena_rank: number;
    great_hall: {
      Force: {
        ACC: number;
        ATK: number;
        CDMG: number;
        DEF: number;
        HP: number;
        RESI: number;
      };
      Magic: {
        ACC: number;
        ATK: number;
        CDMG: number;
        DEF: number;
        HP: number;
        RESI: number;
      };
      Spirit: {
        ACC: number;
        ATK: number;
        CDMG: number;
        DEF: number;
        HP: number;
        RESI: number;
      };
      Void: {
        ACC: number;
        ATK: number;
        CDMG: number;
        DEF: number;
        HP: number;
        RESI: number;
      };
    };
  };
}

export interface IResponseChampion {
  id: number;
  champion_ref: number;
  quality: IStars;
  awaken: IStars;
  level: number;
  vault: boolean;
  base_hp: number;
  base_acc: number;
  base_atk: number;
  base_def: number;
  base_crate: number;
  base_cdmg: number;
  base_res: number;
  base_spd: number;
  hp: number;
  acc: number;
  atk: number;
  def: number;
  crate: number;
  cdmg: number;
  res: number;
  spd: number;
  masteries: IChampionMastery[];
  power: number;
}

export type IQueryChampion = Omit<IResponseChampion, "id">;

export interface IResponseArtifact {
  id: number;
  champion_id?: number;
  slot: ISlots;
  sets: ISets | null;
  clan: IClans | null;
  rarity: IRarity;
  quality: IStars;
  level: number;
  main_stats: IStat;
  main_value: number;
  sub_stats: IStatsFull[];
  power: number;
}

export type IQueryArtifact = Omit<IResponseArtifact, "id">;

export interface IResponseConfiguration {
  id: number;
  champion_id: number;
  configuration: {
    Sets: ISets[][];
    StatsPriority: IChampionStatsPriority;
    GauntletStats: IStat[];
    ChestplateStats: IStat[];
    BootsStats: IStat[];
    RingsStats?: IStat[];
    AmuletsStats?: IStat[];
    BannersStats?: IStat[];
  };
  method: IChampionSetMethod;
  activated: boolean;
  locked: boolean;
  accessories: "" | "Ring" | "Amulet" | "Banner";
  order: number;
}

export type IQueryConfiguration = Omit<IResponseConfiguration, "id">;

export interface IDeleteResponse {
  deleted_id: number;
}

export interface IResponseImport {
  champions: IResponseChampion[];
  artifacts: IResponseArtifact[];
}

export type IServiceStatus = "Idle" | "Loading" | "Done" | "Error";
