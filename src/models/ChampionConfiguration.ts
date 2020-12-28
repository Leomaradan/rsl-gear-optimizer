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
  "ATK%"?: number;
  "C.DMG"?: number;
  "C.RATE"?: number;
  "DEF%"?: number;
  "HP%"?: number;
  RESI?: number;
  SPD?: number;
}

export interface IChampionConfiguration extends IOrderable {
  Guid: string;
  SourceChampion: string;
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
