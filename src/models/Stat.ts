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
