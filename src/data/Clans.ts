import type { IClans } from "../models";

export const ExistingClans: IClans[] = [
  "BannerLords",
  "Barbarians",
  "DarkElves",
  "Demonspawn",
  "Dwarves",
  "HighElves",
  "KnightsRevenant",
  "LizardMen",
  "OgrynTribes",
  "Orcs",
  "SacredOrder",
  "Skinwalkers",
  "UndeadHordes",
];

export const ClansIconName: Record<IClans, string> = {
  "": "",
  BannerLords: "1",
  HighElves: "2",
  SacredOrder: "3",
  OgrynTribes: "5",
  LizardMen: "6",
  Skinwalkers: "7",
  Orcs: "8",
  Demonspawn: "9",
  UndeadHordes: "10",
  DarkElves: "11",
  KnightsRevenant: "12",
  Barbarians: "13",
  Dwarves: "16",
};

export const SortedExistingClans: IClans[] = [...ExistingClans].sort();
