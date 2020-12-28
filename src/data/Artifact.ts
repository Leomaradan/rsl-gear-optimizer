import type { ISlots, IStat } from "models";

const WeaponStats: IStat[] = ["ATK"];
export const WeaponSubStats: IStat[] = [
  "HP",
  "HP%",
  "ATK%",
  "SPD",
  "C.RATE",
  "C.DMG",
  "RESI",
  "ACC",
];
const HelmetStats: IStat[] = ["HP"];
export const HelmetSubStats: IStat[] = [
  "HP%",
  "ATK",
  "ATK%",
  "DEF",
  "DEF%",
  "SPD",
  "C.RATE",
  "C.DMG",
  "RESI",
  "ACC",
];
const ShieldStats: IStat[] = ["DEF"];
export const ShieldSubStats: IStat[] = [
  "HP",
  "HP%",
  "DEF%",
  "SPD",
  "C.RATE",
  "C.DMG",
  "RESI",
  "ACC",
];
const GauntletsStats: IStat[] = [
  "HP",
  "HP%",
  "ATK",
  "ATK%",
  "DEF",
  "DEF%",
  "C.RATE",
  "C.DMG",
];

export const GauntletsStatsExeptFlat: IStat[] = [
  "HP%",
  "ATK%",
  "DEF%",
  "C.RATE",
  "C.DMG",
];

const ChestplateStats: IStat[] = [
  "HP",
  "HP%",
  "ATK",
  "ATK%",
  "DEF",
  "DEF%",
  "ACC",
  "RESI",
];

export const ChestplateStatsExeptFlat: IStat[] = [
  "HP%",
  "ATK%",
  "DEF%",
  "ACC",
  "RESI",
];

const BootsStats: IStat[] = ["HP", "HP%", "ATK", "ATK%", "DEF", "DEF%", "SPD"];

export const BootsStatsExeptFlat: IStat[] = ["HP%", "ATK%", "DEF%", "SPD"];

const RingStats: IStat[] = ["HP", "ATK", "DEF"];
export const RingSubStats: IStat[] = [
  "HP",
  "HP%",
  "ATK",
  "ATK%",
  "DEF",
  "DEF%",
];

const AmuletStats: IStat[] = ["HP", "ATK", "DEF", "C.DMG"];
export const AmuletSubStats: IStat[] = [
  "HP",
  "ATK",
  "DEF",
  "C.DMG",
  "RESI",
  "ACC",
];

const BannerStats: IStat[] = ["HP", "ATK", "DEF", "RESI", "ACC"];
export const BannerSubStats: IStat[] = [
  "HP",
  "HP%",
  "ATK",
  "ATK%",
  "DEF",
  "DEF%",
  "SPD",
];

export const StatsBySlots: Record<ISlots, IStat[]> = {
  Weapon: WeaponStats,
  Helmet: HelmetStats,
  Shield: ShieldStats,
  Gauntlets: GauntletsStats,
  Chestplate: ChestplateStats,
  Boots: BootsStats,
  Ring: RingStats,
  Amulet: AmuletStats,
  Banner: BannerStats,
};
