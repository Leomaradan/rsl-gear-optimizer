import type { IArtifact } from "./Artifact";
import type { IChampionConfiguration } from "./ChampionConfiguration";
import type { ISets } from "./Sets";

export type IResultsStatus = "Ready" | "Processing" | "Done";

export interface IResultsRow {
  artifacts: IArtifact[];
  score: number;
  maxScore: number;
  bonus: ISets[];
  bonusComplete?: boolean;
}

export interface IResults {
  name: string;
  champion: IChampionConfiguration;
  artifacts: IArtifact[];
  score: number;
  maxScore: number;
  bonus: ISets[];
  bonusComplete?: boolean;
}
