import { Orderable } from "./Orderable";
import { Sets } from "./Sets";
import { Stat } from "./Stat";

export enum ChampionSetMethod {
  RequireSets,
  OptionalSets,
  NoSets,
}

export interface ChampionStatsPriority {
  [Stat.Accuracy]?: number;
  [Stat.Attack]?: number;
  [Stat.AttackPercent]?: number;
  [Stat.CriticalDamage]?: number;
  [Stat.CriticalRate]?: number;
  [Stat.Defense]?: number;
  [Stat.DefensePercent]?: number;
  [Stat.HP]?: number;
  [Stat.HpPercent]?: number;
  [Stat.Resistance]?: number;
  [Stat.Speed]?: number;
}

export interface Champion extends Orderable {
  name: string;
  champion: string;
  sets: Sets[];
  statsPriority: ChampionStatsPriority;
  gauntletStats: Stat[];
  chestplateStats: Stat[];
  bootsStats: Stat[];
  methods: ChampionSetMethod;
  activated: boolean;
}

export type ChampionDraft = Omit<Champion, "name">;
