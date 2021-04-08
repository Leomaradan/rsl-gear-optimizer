import type { IChampionAffinity } from "./Champion";

export type IStat =
  | ""
  | "HP"
  | "HP%"
  | "ATK"
  | "ATK%"
  | "DEF"
  | "DEF%"
  | "SPD"
  | "C.RATE"
  | "C.DMG"
  | "RESI"
  | "ACC";

export interface IStatsFull {
  Stats: IStat;
  Value: number;
  Rune: number;
  Roll: number;
}

export type IAuraType = "ATK" | "C.RATE" | "DEF" | "HP" | "RESI" | "SPD";
export type IAura = {
  type: IAuraType;
  value?: number;
  domain?: "Arena" | "Doom Tower" | "Dungeons" | "Faction Crypts" | "Campaign";
  affinity?: IChampionAffinity;
};
