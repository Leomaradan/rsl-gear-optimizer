import { Clans } from "./Clans";
import Champions from "raid-data/champions-base-info.json";

export const ChampionsList: string[] = [];
export const ChampionsClanList: { [key: string]: Clans } = {};

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
      let clan: Clans;
      switch (championDef.faction) {
        case "Banner Lords":
          clan = Clans.BannerLords;
          break;
        case "Barbarians":
          clan = Clans.Barbarians;
          break;
        case "Dark Elves":
          clan = Clans.DarkElves;
          break;
        case "Demonspawn":
          clan = Clans.Demonspawn;
          break;
        case "Dwarves":
          clan = Clans.Dwarves;
          break;
        case "High Elves":
          clan = Clans.HighElves;
          break;
        case "Knight Revenant":
          clan = Clans.KnightsRevenant;
          break;
        case "Lizardmen":
          clan = Clans.LizardMen;
          break;
        case "Ogryn Tribes":
          clan = Clans.OgrynTribes;
          break;
        case "Orcs":
          clan = Clans.Orcs;
          break;
        case "The Sacred Order":
          clan = Clans.SacredOrder;
          break;
        case "Skinwalkers":
          clan = Clans.Skinwalkers;
          break;
        case "Undead Hordes":
          clan = Clans.UndeadHordes;
          break;
        default:
          clan = Clans.Null;
      }
      ChampionsClanList[name] = clan;
      return name;
    })
  );
}
