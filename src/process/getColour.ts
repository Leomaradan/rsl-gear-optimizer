import type { IRarity } from "../models";

const getColour = (rarity: IRarity): string => {
  switch (rarity) {
    case "Epic":
      return "#cb5cea";
    case "Legendary":
      return "#c67b23";
    case "Rare":
      return "#2d92e9";
    case "Uncommon":
      return "#27bc49";
    default:
      return "#a8acb1";
  }
};

export default getColour;
