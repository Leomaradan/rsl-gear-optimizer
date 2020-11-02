export enum Rarity {
  Common,
  Uncommon,
  Rare,
  Epic,
  Legendary,
}

export const RarityString = {
  [Rarity.Common]: "common",
  [Rarity.Uncommon]: "uncommon",
  [Rarity.Rare]: "rare",
  [Rarity.Epic]: "epic",
  [Rarity.Legendary]: "legendary",
};

export const RarityFromString: { [key: string]: Rarity } = {
  common: Rarity.Common,
  uncommon: Rarity.Uncommon,
  rare: Rarity.Rare,
  epic: Rarity.Epic,
  legendary: Rarity.Legendary,
};

export type Stars = 1 | 2 | 3 | 4 | 5 | 6;
