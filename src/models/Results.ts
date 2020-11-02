import { ListOfArtifacts } from "./Artifact";
import { Champion } from "./Champion";
import Sets from "./Sets";

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
  selected: number;
  artifacts: ResultsRow | null;
  champion: Champion;
  result: string;
}

export interface ResultsDraft {
  name: string;
  selected: number;
  champion: Champion;
  result: ResultsRow[];
}
