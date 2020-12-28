import type { IRarity, IClans, IChampionRole, IChampionAffinity } from "models";

import Champions from "raid-data/champions-base-info.json";

export const ChampionsList: string[] = [];
export const ChampionsDetailsList: {
  [key: string]: {
    Rarity: IRarity;
    Clan: IClans;
    Role: IChampionRole;
    Affinity: IChampionAffinity;
  };
} = {};
if (ChampionsList.length === 0) {
  ChampionsList.push(
    ...Object.keys(Champions).map((c) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const championDef = (Champions as any)[c] as {
        rarity: string;
        affinity: string;
        faction: string;
        role: string;
        avatarUrl?: string;
        detailsUrl: string;
      };
      const name = c.replace(/[^a-z -]+/gi, "").replace(/[ -]+/gi, "_");
      let clan: IClans;
      switch (championDef.faction) {
        case "Banner Lords":
          clan = "BannerLords";
          break;
        case "Barbarians":
          clan = "Barbarians";
          break;
        case "Dark Elves":
          clan = "DarkElves";
          break;
        case "Demonspawn":
          clan = "Demonspawn";
          break;
        case "Dwarves":
          clan = "Dwarves";
          break;
        case "High Elves":
          clan = "HighElves";
          break;
        case "Knight Revenant":
          clan = "KnightsRevenant";
          break;
        case "Lizardmen":
          clan = "LizardMen";
          break;
        case "Ogryn Tribes":
          clan = "OgrynTribes";
          break;
        case "Orcs":
          clan = "Orcs";
          break;
        case "The Sacred Order":
          clan = "SacredOrder";
          break;
        case "Skinwalkers":
          clan = "Skinwalkers";
          break;
        case "Undead Hordes":
          clan = "UndeadHordes";
          break;
        default:
          clan = "";
      }
      let rarity: IRarity;
      switch (championDef.rarity) {
        case "legendary":
          rarity = "Legendary";
          break;

        case "epic":
          rarity = "Epic";
          break;

        case "rare":
          rarity = "Rare";
          break;

        case "uncommon":
          rarity = "Uncommon";
          break;
        default:
          rarity = "Common";
      }

      let role: IChampionRole;
      switch (championDef.role) {
        case "attack":
          role = "Attack";
          break;

        case "defense":
          role = "Defense";
          break;

        case "hp":
          role = "HP";
          break;

        default:
          role = "Support";
          break;
      }

      let element: IChampionAffinity;
      switch (championDef.affinity) {
        case "force":
          element = "Force";
          break;

        case "magic":
          element = "Magic";
          break;

        case "spirit":
          element = "Spirit";
          break;

        default:
          element = "Void";
          break;
      }

      ChampionsDetailsList[name] = {
        Clan: clan,
        Affinity: element,
        Rarity: rarity,
        Role: role,
      };
      return name;
    })
  );
}
