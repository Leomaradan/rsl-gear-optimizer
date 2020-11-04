import {
  Artifact,
  Champion,
  Clans,
  ExistingSlotsAccessories,
  ListOfArtifacts,
  ResultsWorkerCommands,
  Sets,
  Slots,
  Stat,
} from "models";
import { v4 as uuidv4 } from "uuid";

const getEmtyItem = (Slot: Slots) =>
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
  } as Artifact);

const generateTable = (
  artifacts: Artifact[],
  champion: Champion,
  postCommand: (command: ResultsWorkerCommands) => void
): ListOfArtifacts[] => {
  const results: ListOfArtifacts[] = [];

  let counter = 0;

  const hasBanner = champion.accessories === Slots.Banner;
  const hasAmulet = hasBanner || champion.accessories === Slots.Amulet;
  const hasRing = hasAmulet || champion.accessories === Slots.Ring;

  postCommand({
    message: JSON.stringify({ hasBanner, hasAmulet, hasRing, artifacts }),
    command: "message",
  });

  const weapons = artifacts.filter((i) => i.Slot === Slots.Weapon);
  const helmets = artifacts.filter((i) => i.Slot === Slots.Helmet);
  const shields = artifacts.filter((i) => i.Slot === Slots.Shield);
  const gauntlets = artifacts.filter((i) => i.Slot === Slots.Gauntlets);
  const chestplates = artifacts.filter((i) => i.Slot === Slots.Chestplate);
  const boots = artifacts.filter((i) => i.Slot === Slots.Boots);
  const rings = hasRing
    ? artifacts.filter((i) => i.Slot === Slots.Ring && i.Clan === champion.clan)
    : [];
  const amulets = hasAmulet
    ? artifacts.filter(
        (i) => i.Slot === Slots.Amulet && i.Clan === champion.clan
      )
    : [];
  const banners = hasBanner
    ? artifacts.filter(
        (i) => i.Slot === Slots.Banner && i.Clan === champion.clan
      )
    : [];

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

  if (rings.length === 0) {
    rings.push(getEmtyItem(Slots.Ring));
  }

  if (amulets.length === 0) {
    amulets.push(getEmtyItem(Slots.Amulet));
  }

  if (banners.length === 0) {
    banners.push(getEmtyItem(Slots.Banner));
  }

  postCommand({
    message: JSON.stringify({ rings, amulets, banners, champion }),
    command: "message",
  });

  weapons.forEach((weapon) => {
    helmets.forEach((helmet) => {
      shields.forEach((shield) => {
        gauntlets.forEach((gauntlet) => {
          chestplates.forEach((chestplate) => {
            boots.forEach((boot) => {
              rings.forEach((ring) => {
                amulets.forEach((amulet) => {
                  banners.forEach((banner) => {
                    const sets = [
                      weapon,
                      helmet,
                      shield,
                      gauntlet,
                      chestplate,
                      boot,
                      ring,
                      amulet,
                      banner,
                    ] as ListOfArtifacts;
                    counter += 1;

                    if (postCommand && counter % 15000 === 0) {
                      postCommand({
                        command: "progress",
                        current: counter,
                        task: "taskGenerateTable",
                      });
                    }

                    results.push(sets);
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  return results;
};

export default generateTable;
