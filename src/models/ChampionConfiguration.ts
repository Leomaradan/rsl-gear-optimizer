import type { IOrderable } from "./Orderable";
import type { ISets } from "./Sets";
import type { IStat } from "./Stat";

export type IChampionSetMethod =
  | "SpecificSets"
  | "ListSets"
  | "ListSetsNoBonus"
  | "AllSets";

export interface IChampionStatsPriority {
  ACC?: number;
  ACC_Max?: number;
  "ATK%"?: number;
  "ATK%_Max"?: number;
  "C.DMG"?: number;
  "C.DMG_Max"?: number;
  "C.RATE"?: number;
  "C.RATE_Max"?: number;
  "DEF%"?: number;
  "DEF%_Max"?: number;
  "HP%"?: number;
  "HP%_Max"?: number;
  RESI?: number;
  RESI_Max?: number;
  SPD?: number;
  SPD_Max?: number;
}

export interface IChampionConfiguration extends IOrderable {
  Id: number;
  SourceChampion: number;
  Sets: ISets[][];
  StatsPriority: IChampionStatsPriority;
  GauntletStats: IStat[];
  ChestplateStats: IStat[];
  BootsStats: IStat[];
  RingsStats?: IStat[];
  AmuletsStats?: IStat[];
  BannersStats?: IStat[];
  Methods: IChampionSetMethod;
  Activated: boolean;
  Locked: boolean;
  Accessories: "" | "Ring" | "Amulet" | "Banner";
}
