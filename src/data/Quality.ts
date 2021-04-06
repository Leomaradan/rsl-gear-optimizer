import type { IRarity } from "../models";

export const RarityString: Record<IRarity, string> = {
  "": "",
  Common: "common",
  Uncommon: "uncommon",
  Rare: "rare",
  Epic: "epic",
  Legendary: "legendary",
};

export const RarityFromString: Record<string, IRarity> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};
