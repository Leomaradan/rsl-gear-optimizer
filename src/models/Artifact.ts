import Stats, { StatsFull } from "./Stats";
import { Rarity, Stars } from "./Quality";
import Sets from "./Sets";
import Slots from "./Slots";

interface ArtifactBase {
  Guid: string;
  Slot: Slots;
  Set: Sets;
  Rarity: Rarity;
  Quality: Stars;
  Level: number;
  MainStats: Stats;
  MainStatsValue?: number;
  Champion?: string;
  SubStats: [StatsFull?, StatsFull?, StatsFull?, StatsFull?];
}

export type ArtifactDraft = Omit<ArtifactBase, "Guid"> & { Guid?: string };

export interface ArtifactWeapon extends ArtifactBase {
  Slot: Slots.Weapon;
  MainStats: Stats.None | Stats.Attack;
}

export interface ArtifactHelmet extends ArtifactBase {
  Slot: Slots.Helmet;
  MainStats: Stats.None | Stats.HP;
}

export interface ArtifactShield extends ArtifactBase {
  Slot: Slots.Shield;
  MainStats: Stats.None | Stats.Defense;
}

export interface ArtifactGauntlets extends ArtifactBase {
  Slot: Slots.Gauntlets;
  MainStats:
    | Stats.None
    | Stats.HP
    | Stats.HpPercent
    | Stats.Attack
    | Stats.AttackPercent
    | Stats.Defense
    | Stats.DefensePercent
    | Stats.CriticalRate
    | Stats.CriticalDamage;
}

export interface ArtifactChestplate extends ArtifactBase {
  Slot: Slots.Chestplate;
  MainStats:
    | Stats.None
    | Stats.HP
    | Stats.HpPercent
    | Stats.Attack
    | Stats.AttackPercent
    | Stats.Defense
    | Stats.DefensePercent
    | Stats.Accuracy
    | Stats.Resistance;
}

export interface ArtifactBoots extends ArtifactBase {
  Slot: Slots.Boots;
  MainStats:
    | Stats.None
    | Stats.HP
    | Stats.HpPercent
    | Stats.Attack
    | Stats.AttackPercent
    | Stats.Defense
    | Stats.DefensePercent
    | Stats.Speed;
}

export interface ArtifactRing extends ArtifactBase {
  Slot: Slots.Ring;
  MainStats: Stats.None | Stats.HP | Stats.Attack | Stats.Defense;
  Set: Sets.Null;
}

export interface ArtifactAmulet extends ArtifactBase {
  Slot: Slots.Amulet;
  MainStats:
    | Stats.None
    | Stats.HP
    | Stats.Attack
    | Stats.Defense
    | Stats.CriticalDamage;
  Set: Sets.Null;
}

export interface ArtifactBanner extends ArtifactBase {
  Slot: Slots.Banner;
  MainStats:
    | Stats.None
    | Stats.HP
    | Stats.Attack
    | Stats.Defense
    | Stats.Accuracy
    | Stats.Resistance;
  Set: Sets.Null;
}

export const WeaponStats = [Stats.Attack];
export const HelmetStats = [Stats.HP];
export const ShieldStats = [Stats.Defense];
export const GauntletsStats = [
  Stats.HP,
  Stats.HpPercent,
  Stats.Attack,
  Stats.AttackPercent,
  Stats.Defense,
  Stats.DefensePercent,
  Stats.CriticalRate,
  Stats.CriticalDamage,
];
export const ChestplateStats = [
  Stats.HP,
  Stats.HpPercent,
  Stats.Attack,
  Stats.AttackPercent,
  Stats.Defense,
  Stats.DefensePercent,
  Stats.Accuracy,
  Stats.Resistance,
];
export const BootsStats = [
  Stats.HP,
  Stats.HpPercent,
  Stats.Attack,
  Stats.AttackPercent,
  Stats.Defense,
  Stats.DefensePercent,
  Stats.Speed,
];

export const RingStats = [Stats.HP, Stats.Attack, Stats.Defense];

export const AmuletStats = [
  Stats.HP,
  Stats.Attack,
  Stats.Defense,
  Stats.CriticalDamage,
];

export const BannerStats = [
  Stats.HP,
  Stats.Attack,
  Stats.Defense,
  Stats.Accuracy,
  Stats.Resistance,
];

type Artifact =
  | ArtifactWeapon
  | ArtifactHelmet
  | ArtifactShield
  | ArtifactGauntlets
  | ArtifactChestplate
  | ArtifactBoots
  | ArtifactRing
  | ArtifactAmulet
  | ArtifactBanner;

export const StatsBySlots = {
  [Slots.Weapon]: WeaponStats,
  [Slots.Helmet]: HelmetStats,
  [Slots.Shield]: ShieldStats,
  [Slots.Gauntlets]: GauntletsStats,
  [Slots.Chestplate]: ChestplateStats,
  [Slots.Boots]: BootsStats,
  [Slots.Ring]: RingStats,
  [Slots.Amulet]: AmuletStats,
  [Slots.Banner]: BannerStats,
};

export type ListOfArtifacts = [
  ArtifactWeapon,
  ArtifactHelmet,
  ArtifactShield,
  ArtifactGauntlets,
  ArtifactChestplate,
  ArtifactBoots
];

export default Artifact;
