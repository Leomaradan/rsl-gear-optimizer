import { Rarity } from "models/Quality";

const getColour = (rarity: Rarity): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  switch (parseInt(rarity as any, 10)) {
    case Rarity.Legendary:
      return "#c67b23";
    case Rarity.Epic:
      return "#cb5cea";
    case Rarity.Rare:
      return "#2d92e9";
    case Rarity.Uncommon:
      return "#27bc49";
    default:
      return "#a8acb1";
  }
};

export default getColour;
