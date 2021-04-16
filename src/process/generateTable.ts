import { v4 as uuidv4 } from "uuid";

import { ExistingSlotsAccessories } from "../data";
import type { IScoredArtifact, ISlots } from "../models";

type IListOfScoredArtifacts = [
  IScoredArtifact,
  IScoredArtifact,
  IScoredArtifact,
  IScoredArtifact,
  IScoredArtifact,
  IScoredArtifact
];

export const getEmtyItem = (Slot: ISlots): IScoredArtifact =>
  ({
    Id: Math.round(0 - Math.random() * 1000000),
    MainStats: "",
    MainStatsValue: 0,
    Slot,
    Set: "",
    Clan: "",
    Rarity: "",
    isAccessory: ExistingSlotsAccessories.includes(Slot),
    Level: 0,
    Quality: 1,
    SubStats: [],
    score: 0,
    Power: 0,
  } as IScoredArtifact);

/**
 * Generate all possible artifacts combinations from a list of artifacts
 * @param entryArtifacts
 */
function* generateTable(
  entryArtifacts: IScoredArtifact[]
): Generator<{ artifacts: IListOfScoredArtifacts; max: number }> {
  let weapons = entryArtifacts.filter((i) => i.Slot === "Weapon");
  let helmets = entryArtifacts.filter((i) => i.Slot === "Helmet");
  let shields = entryArtifacts.filter((i) => i.Slot === "Shield");
  let gauntlets = entryArtifacts.filter((i) => i.Slot === "Gauntlets");
  let chestplates = entryArtifacts.filter((i) => i.Slot === "Chestplate");
  let boots = entryArtifacts.filter((i) => i.Slot === "Boots");

  if (weapons.length === 0) {
    weapons.push(getEmtyItem("Weapon"));
  }

  if (helmets.length === 0) {
    helmets.push(getEmtyItem("Helmet"));
  }

  if (shields.length === 0) {
    shields.push(getEmtyItem("Shield"));
  }

  if (gauntlets.length === 0) {
    gauntlets.push(getEmtyItem("Gauntlets"));
  }

  if (chestplates.length === 0) {
    chestplates.push(getEmtyItem("Chestplate"));
  }

  if (boots.length === 0) {
    boots.push(getEmtyItem("Boots"));
  }

  weapons = weapons.sort((a, b) => b.score - a.score).slice(0, 10);
  helmets = helmets.sort((a, b) => b.score - a.score).slice(0, 10);
  shields = shields.sort((a, b) => b.score - a.score).slice(0, 10);
  gauntlets = gauntlets.sort((a, b) => b.score - a.score).slice(0, 10);
  chestplates = chestplates.sort((a, b) => b.score - a.score).slice(0, 10);
  boots = boots.sort((a, b) => b.score - a.score).slice(0, 10);

  const max =
    boots.length *
    chestplates.length *
    gauntlets.length *
    helmets.length *
    shields.length *
    weapons.length;

  for (let weaponIndex = 0; weaponIndex < weapons.length; weaponIndex += 1) {
    const weapon = weapons[weaponIndex];
    for (let helmetIndex = 0; helmetIndex < helmets.length; helmetIndex += 1) {
      const helmet = helmets[helmetIndex];
      for (
        let shieldIndex = 0;
        shieldIndex < shields.length;
        shieldIndex += 1
      ) {
        const shield = shields[shieldIndex];
        for (
          let gloveIndex = 0;
          gloveIndex < gauntlets.length;
          gloveIndex += 1
        ) {
          const gauntlet = gauntlets[gloveIndex];
          for (
            let chestIndex = 0;
            chestIndex < chestplates.length;
            chestIndex += 1
          ) {
            const chestplate = chestplates[chestIndex];
            for (let bootIndex = 0; bootIndex < boots.length; bootIndex += 1) {
              const artifacts = [
                weapon,
                helmet,
                shield,
                gauntlet,
                chestplate,
                boots[bootIndex],
              ] as IListOfScoredArtifacts;

              yield { artifacts, max };
            }
          }
        }
      }
    }
  }
}

export default generateTable;
