import { ListOfArtifacts } from "./Artifact";
import { Champion } from "./Champion";
import { Sets } from "./Sets";

export enum ResultsStatus {
  Ready,
  Processing,
  Done,
}

export interface ResultsRow {
  id: number;
  artifacts: ListOfArtifacts;
  score: number;
  maxScore: number;
  bonus: Sets[];
  bonusComplete?: boolean;
}

export interface Results {
  name: string;
  selected: boolean;
  artifacts: ResultsRow | null;
  champion: Champion;
  result: string[];
}
