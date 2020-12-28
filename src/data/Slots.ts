import type { ISlots } from "models";

export const ExistingSlotsAccessories: ISlots[] = ["Ring", "Amulet", "Banner"];

export const ExistingSlotsArtifacts: ISlots[] = [
  "Weapon",
  "Helmet",
  "Shield",
  "Gauntlets",
  "Chestplate",
  "Boots",
];

export const ExistingSlots: ISlots[] = [
  "Weapon",
  "Helmet",
  "Shield",
  "Gauntlets",
  "Chestplate",
  "Boots",
  "Ring",
  "Amulet",
  "Banner",
];

export const SlotsIconName: Record<ISlots, string> = {
  Weapon: "Weapon",
  Helmet: "Helmet",
  Shield: "Shield",
  Gauntlets: "Gloves",
  Chestplate: "Chest",
  Boots: "Boots",
  Ring: "Ring",
  Amulet: "Pendant",
  Banner: "Banner",
};
