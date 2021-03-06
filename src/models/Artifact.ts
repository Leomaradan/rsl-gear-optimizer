import { Stat, StatsFull } from "./Stat";
import { Rarity, Stars } from "./Quality";
import { Sets } from "./Sets";
import { Slots } from "./Slots";
import { Clans } from "./Clans";

interface ArtifactBase {
  Guid: string;
  Slot: Slots;
  Set: Sets;
  Clan: Clans;
  Rarity: Rarity;
  Quality: Stars;
  Level: number;
  MainStats: Stat;
  MainStatsValue?: number;
  Champion?: string;
  isAccessory: boolean;
  SubStats: [StatsFull?, StatsFull?, StatsFull?, StatsFull?];
}

export type ArtifactDraft = Omit<ArtifactBase, "Guid"> & { Guid?: string };

interface ArtifactWeapon extends ArtifactBase {
  Slot: Slots.Weapon;
  MainStats: Stat.None | Stat.Attack;
  Clan: Clans.Null;
  isAccessory: false;
}

interface ArtifactHelmet extends ArtifactBase {
  Slot: Slots.Helmet;
  MainStats: Stat.None | Stat.HP;
  Clan: Clans.Null;
  isAccessory: false;
}

interface ArtifactShield extends ArtifactBase {
  Slot: Slots.Shield;
  MainStats: Stat.None | Stat.Defense;
  Clan: Clans.Null;
  isAccessory: false;
}

interface ArtifactGauntlets extends ArtifactBase {
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
  Clan: Clans.Null;
  isAccessory: false;
}

interface ArtifactChestplate extends ArtifactBase {
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
  Clan: Clans.Null;
  isAccessory: false;
}

interface ArtifactBoots extends ArtifactBase {
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
  Clan: Clans.Null;
  isAccessory: false;
}

interface ArtifactRing extends ArtifactBase {
  Slot: Slots.Ring;
  MainStats: Stat.None | Stat.HP | Stat.Attack | Stat.Defense;
  Set: Sets.Null;
  isAccessory: true;
}

interface ArtifactAmulet extends ArtifactBase {
  Slot: Slots.Amulet;
  MainStats:
    | Stat.None
    | Stat.HP
    | Stat.Attack
    | Stat.Defense
    | Stat.CriticalDamage;
  Set: Sets.Null;
  isAccessory: true;
}

interface ArtifactBanner extends ArtifactBase {
  Slot: Slots.Banner;
  MainStats:
    | Stat.None
    | Stat.HP
    | Stat.Attack
    | Stat.Defense
    | Stat.Accuracy
    | Stat.Resistance;
  Set: Sets.Null;
  isAccessory: true;
}

const WeaponStats = [Stat.Attack];
export const WeaponSubStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.AttackPercent,
  Stat.Speed,
  Stat.CriticalRate,
  Stat.CriticalDamage,
  Stat.Resistance,
  Stat.Accuracy,
];
const HelmetStats = [Stat.HP];
export const HelmetSubStats = [
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
  Stat.Speed,
  Stat.CriticalRate,
  Stat.CriticalDamage,
  Stat.Resistance,
  Stat.Accuracy,
];
const ShieldStats = [Stat.Defense];
export const ShieldSubStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.DefensePercent,
  Stat.Speed,
  Stat.CriticalRate,
  Stat.CriticalDamage,
  Stat.Resistance,
  Stat.Accuracy,
];
const GauntletsStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
  Stat.CriticalRate,
  Stat.CriticalDamage,
];

const ChestplateStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
  Stat.Accuracy,
  Stat.Resistance,
];
const BootsStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
  Stat.Speed,
];

const RingStats = [Stat.HP, Stat.Attack, Stat.Defense];
export const RingSubStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
];

const AmuletStats = [Stat.HP, Stat.Attack, Stat.Defense, Stat.CriticalDamage];
export const AmuletSubStats = [
  Stat.HP,
  Stat.Attack,
  Stat.Defense,
  Stat.CriticalDamage,
  Stat.Resistance,
  Stat.Accuracy,
];

const BannerStats = [
  Stat.HP,
  Stat.Attack,
  Stat.Defense,
  Stat.Resistance,
  Stat.Accuracy,
];
export const BannerSubStats = [
  Stat.HP,
  Stat.HpPercent,
  Stat.Attack,
  Stat.AttackPercent,
  Stat.Defense,
  Stat.DefensePercent,
  Stat.Speed,
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

export type ListOfArtifacts = [
  ArtifactWeapon,
  ArtifactHelmet,
  ArtifactShield,
  ArtifactGauntlets,
  ArtifactChestplate,
  ArtifactBoots,
  ArtifactRing,
  ArtifactAmulet,
  ArtifactBanner
];

export type ScoredArtifact = Artifact & { score: number };

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
