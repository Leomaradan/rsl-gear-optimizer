import {
  Clans,
  ExistingSlotsAccessories,
  ScoredArtifact,
  Sets,
  Slots,
  Stat,
} from "models";
import { v4 as uuidv4 } from "uuid";

type ListOfScoredArtifacts = [
  ScoredArtifact,
  ScoredArtifact,
  ScoredArtifact,
  ScoredArtifact,
  ScoredArtifact,
  ScoredArtifact
];

export const getEmtyItem = (Slot: Slots): ScoredArtifact =>
  ({
    Guid: `fake${uuidv4()}`,
    MainStats: Stat.None,
    MainStatsValue: 0,
    Slot,
    Set: Sets.Null,
    Clan: Clans.Null,
    Rarity: -1,
    isAccessory: ExistingSlotsAccessories.includes(Slot),
    Level: 0,
    Quality: 1,
    SubStats: [],
    score: 0,
  } as ScoredArtifact);

function* generateTable(
  entryArtifacts: ScoredArtifact[]
): Generator<{ artifacts: ListOfScoredArtifacts; max: number }> {
  let weapons = entryArtifacts.filter((i) => i.Slot === Slots.Weapon);
  let helmets = entryArtifacts.filter((i) => i.Slot === Slots.Helmet);
  let shields = entryArtifacts.filter((i) => i.Slot === Slots.Shield);
  let gauntlets = entryArtifacts.filter((i) => i.Slot === Slots.Gauntlets);
  let chestplates = entryArtifacts.filter((i) => i.Slot === Slots.Chestplate);
  let boots = entryArtifacts.filter((i) => i.Slot === Slots.Boots);

  if (weapons.length === 0) {
    weapons.push(getEmtyItem(Slots.Weapon));
  }

  if (helmets.length === 0) {
    helmets.push(getEmtyItem(Slots.Helmet));
  }

  if (shields.length === 0) {
    shields.push(getEmtyItem(Slots.Shield));
  }

  if (gauntlets.length === 0) {
    gauntlets.push(getEmtyItem(Slots.Gauntlets));
  }

  if (chestplates.length === 0) {
    chestplates.push(getEmtyItem(Slots.Chestplate));
  }

  if (boots.length === 0) {
    boots.push(getEmtyItem(Slots.Boots));
  }

  weapons = weapons.sort((a, b) => b.score - a.score).slice(0, 10);
  helmets = helmets.sort((a, b) => b.score - a.score).slice(0, 10);
  shields = shields.sort((a, b) => b.score - a.score).slice(0, 10);
  gauntlets = gauntlets.sort((a, b) => b.score - a.score).slice(0, 10);
  chestplates = chestplates.sort((a, b) => b.score - a.score).slice(0, 10);
  boots = boots.sort((a, b) => b.score - a.score).slice(0, 10);

  const max =
    weapons.length *
    helmets.length *
    shields.length *
    gauntlets.length *
    chestplates.length *
    boots.length;

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
              ] as ListOfScoredArtifacts;

              yield { artifacts, max };
            }
          }
        }
      }
    }
  }
}

export default generateTable;
