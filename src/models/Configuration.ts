import type {
  IArtifactsState,
  IChampionConfigurationsState,
  IChampionsState,
} from "./Redux";

export type IArtifactsDisplayMode = "Table" | "Grid";

export type IGenerationMethod = "Easy" | "RealValue" | "TheoricalValue";

export interface IGreatHallBonusAffinity {
  "HP%": number;
  "ATK%": number;
  "DEF%": number;
  "C.DMG": number;
  RESI: number;
  ACC: number;
}

export interface IGreatHallBonus {
  Force: IGreatHallBonusAffinity;
  Magic: IGreatHallBonusAffinity;
  Spirit: IGreatHallBonusAffinity;
  Void: IGreatHallBonusAffinity;
}

export type IArenaRank =
  | "B1"
  | "B2"
  | "B3"
  | "B4"
  | "S1"
  | "S2"
  | "S3"
  | "S4"
  | "G1"
  | "G2"
  | "G3"
  | "G4"
  | "P";

export interface IGameProgression {
  greatHallBonus: IGreatHallBonus;
  arenaRank: IArenaRank;
}

export interface IBackupV1 {
  version: "1";
  champions: IChampionsState;
  championConfig: IChampionConfigurationsState;
  artifacts: IArtifactsState;
}

export type IBackup = IBackupV1;

export type IBackupPrepare = Omit<IBackup, "version">;
