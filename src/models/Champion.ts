import { Orderable } from "./Orderable";
import Sets from "./Sets";
import Stats from "./Stats";

export enum ChampionSetMethod {
  RequireSets,
  OptionalSets,
  NoSets,
}

export interface ChampionStatsPriority {
  [Stats.Accuracy]?: number;
  [Stats.Attack]?: number;
  [Stats.AttackPercent]?: number;
  [Stats.CriticalDamage]?: number;
  [Stats.CriticalRate]?: number;
  [Stats.Defense]?: number;
  [Stats.DefensePercent]?: number;
  [Stats.HP]?: number;
  [Stats.HpPercent]?: number;
  [Stats.Resistance]?: number;
  [Stats.Speed]?: number;
}

export interface Champion extends Orderable {
  name: string;
  champion: string;
  sets: Sets[];
  statsPriority: ChampionStatsPriority;
  gauntletStats: Stats[];
  chestplateStats: Stats[];
  bootsStats: Stats[];
  methods: ChampionSetMethod;
  activated: boolean;
}

export type ChampionDraft = Omit<Champion, "name">;
