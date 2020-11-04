export enum Clans {
  Null = "",
  BannerLords = "BannerLords",
  HighElves = "HighElves",
  SacredOrder = "SacredOrder",
  OgrynTribes = "OgrynTribes",
  LizardMen = "LizardMen",
  Skinwalkers = "Skinwalkers",
  Orcs = "Orcs",
  Demonspawn = "Demonspawn",
  UndeadHordes = "UndeadHordes",
  DarkElves = "DarkElves",
  KnightsRevenant = "KnightsRevenant",
  Barbarians = "Barbarians",
  Dwarves = "Dwarves",
}
export const ExistingClans: Clans[] = [
  Clans.BannerLords,
  Clans.Barbarians,
  Clans.DarkElves,
  Clans.Demonspawn,
  Clans.Dwarves,
  Clans.HighElves,
  Clans.KnightsRevenant,
  Clans.LizardMen,
  Clans.OgrynTribes,
  Clans.Orcs,
  Clans.SacredOrder,
  Clans.Skinwalkers,
  Clans.UndeadHordes,
];

export const ClansIconName: { [key: string]: string } = {
  [Clans.BannerLords]: "1",
  [Clans.HighElves]: "2",
  [Clans.SacredOrder]: "3",
  [Clans.OgrynTribes]: "5",
  [Clans.LizardMen]: "6",
  [Clans.Skinwalkers]: "7",
  [Clans.Orcs]: "8",
  [Clans.Demonspawn]: "9",
  [Clans.UndeadHordes]: "10",
  [Clans.DarkElves]: "11",
  [Clans.KnightsRevenant]: "12",
  [Clans.Barbarians]: "13",
  [Clans.Dwarves]: "16",
};

export const SortedExistingClans: Clans[] = [...ExistingClans].sort();
