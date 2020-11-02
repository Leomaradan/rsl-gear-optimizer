enum Slots {
  Weapon = "Weapon",
  Helmet = "Helmet",
  Shield = "Shield",
  Gauntlets = "Gauntlets",
  Chestplate = "Chestplate",
  Boots = "Boots",
  Ring = "Ring",
  Amulet = "Amulet",
  Banner = "Banner",
}

export const SlotsIconName: { [key: string]: string } = {
  [Slots.Weapon]: "Weapon",
  [Slots.Helmet]: "Helmet",
  [Slots.Shield]: "Shield",
  [Slots.Gauntlets]: "Gloves",
  [Slots.Chestplate]: "Chest",
  [Slots.Boots]: "Boots",
  [Slots.Ring]: "Ring",
  [Slots.Amulet]: "Pendant",
  [Slots.Banner]: "Banner",
};

export default Slots;
