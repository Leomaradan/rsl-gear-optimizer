import { Stat, StatsFull } from "./Stat";
import { Rarity, Stars } from "./Quality";
import { Sets } from "./Sets";
import { Slots } from "./Slots";

interface ArtifactBase {
  Guid: string;
  Slot: Slots;
  Set: Sets;
  Rarity: Rarity;
  Quality: Stars;
  Level: number;
  MainStats: Stat;
  MainStatsValue?: number;
  Champion?: string;
  SubStats: [StatsFull?, StatsFull?, StatsFull?, StatsFull?];
}

export type ArtifactDraft = Omit<ArtifactBase, "Guid"> & { Guid?: string };

export interface ArtifactWeapon extends ArtifactBase {
  Slot: Slots.Weapon;
  MainStats: Stat.None | Stat.Attack;
}

export interface ArtifactHelmet extends ArtifactBase {
  Slot: Slots.Helmet;
  MainStats: Stat.None | Stat.HP;
}

export interface ArtifactShield extends ArtifactBase {
  Slot: Slots.Shield;
  MainStats: Stat.None | Stat.Defense;
}

export interface ArtifactGauntlets extends ArtifactBase {
  Slot: Slots.Gauntlets;
  MainStats:
    | Stat.None
    | Stat.HP
    | Stat.HpPercent
    | Stat.Attack
    | Stat.AttackPercent
    | Stat.Defense
    | Stat.DefensePercent
    | Stat.CriticalRate
    | Stat.CriticalDamage;
}

export interface ArtifactChestplate extends ArtifactBase {
  Slot: Slots.Chestplate;
  MainStats:
    | Stat.None
    | Stat.HP
    | Stat.HpPercent
    | Stat.Attack
    | Stat.AttackPercent
    | Stat.Defense
    | Stat.DefensePercent
    | Stat.Accuracy
    | Stat.Resistance;
}

export interface ArtifactBoots extends ArtifactBase {
  Slot: Slots.Boots;
  MainStats:
    | Stat.None
    | Stat.HP
    | Stat.HpPercent
    | Stat.Attack
    | Stat.AttackPercent
    | Stat.Defense
    | Stat.DefensePercent
    | Stat.Speed;
}

export interface ArtifactRing extends ArtifactBase {
  Slot: Slots.Ring;
  MainStats: Stat.None | Stat.HP | Stat.Attack | Stat.Defense;
  Set: Sets.Null;
}

export interface ArtifactAmulet extends ArtifactBase {
  Slot: Slots.Amulet;
  MainStats:
    | Stat.None
    | Stat.HP
    | Stat.Attack
    | Stat.Defense
    | Stat.CriticalDamage;
  Set: Sets.Null;
}

export interface ArtifactBanner extends ArtifactBase {
  Slot: Slots.Banner;
  MainStats:
    | Stat.None
    | Stat.HP
    | Stat.Attack
    | Stat.Defense
    | Stat.Accuracy
    | Stat.Resistance;
  Set: Sets.Null;
}

export const WeaponStats = [Stat.Attack];
export const HelmetStats = [Stat.HP];
export const ShieldStats = [Stat.Defense];
export const GauntletsStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
  Stat.CriticalRate,
  Stat.CriticalDamage,
];
export const ChestplateStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
  Stat.Accuracy,
  Stat.Resistance,
];
export const BootsStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
  Stat.Speed,
];

export const RingStats = [Stat.HP, Stat.Attack, Stat.Defense];

export const AmuletStats = [
  Stat.HP,
  Stat.Attack,
  Stat.Defense,
  Stat.CriticalDamage,
];

export const BannerStats = [
  Stat.HP,
  Stat.Attack,
  Stat.Defense,
  Stat.Accuracy,
  Stat.Resistance,
];

export type Artifact =
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
