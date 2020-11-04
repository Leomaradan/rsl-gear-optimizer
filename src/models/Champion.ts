import { Clans } from "./Clans";
import { Orderable } from "./Orderable";
import { Sets } from "./Sets";
import { Slots } from "./Slots";
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
  clan: Clans;
  sets: Sets[];
  statsPriority: ChampionStatsPriority;
  gauntletStats: Stat[];
  chestplateStats: Stat[];
  bootsStats: Stat[];
  methods: ChampionSetMethod;
  activated: boolean;
  accessories: "" | Slots.Ring | Slots.Amulet | Slots.Banner;
}

export type ChampionDraft = Omit<Champion, "name" | "clan">;
